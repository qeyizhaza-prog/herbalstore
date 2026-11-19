import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/services/db.ts';
import type { CheckoutFormData, OrderRecord } from './src/types/herbal.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security & Content Headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json());

function normalizeOrderKey(raw: string): string {
  const cleaned = raw.trim().toUpperCase();
  return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
}

// PII Masking Utilities for public tracking protection (Anti-IDOR)
function maskCustomerName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => {
      if (p.length <= 2) return p[0] + '*';
      return p[0] + '*'.repeat(Math.min(p.length - 2, 4)) + p[p.length - 1];
    })
    .join(' ');
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) return '****';
  return digits.slice(0, 4) + '-****-' + digits.slice(-3);
}

function maskAddress(address: string, city: string, postalCode: string): string {
  const safeCity = city ? `, ${city}` : '';
  const safePostal = postalCode ? ` ${postalCode}` : '';
  if (address.length <= 10) return `Alamat Tujuan Terproteksi${safeCity}${safePostal}`;
  return `${address.slice(0, 10)}*** (Alamat Disamarkan untuk Privasi)${safeCity}${safePostal}`;
}

function sanitizeOrderForPublic(order: OrderRecord, isAuthorized: boolean): OrderRecord {
  if (isAuthorized) return order;
  return {
    ...order,
    customerName: maskCustomerName(order.customerName),
    phone: maskPhone(order.phone),
    address: maskAddress(order.address, order.city, order.postalCode),
  };
}

// In-memory sliding window rate limiter for order creation
const orderRateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkOrderRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = orderRateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    orderRateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (record.count >= 25) {
    return false;
  }
  record.count += 1;
  return true;
}

// API: Health check & Database Status
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: db.isConfigured ? 'supabase' : 'in-memory-fallback',
    timestamp: new Date().toISOString(),
  });
});

// API: Get all products
app.get('/api/products', async (_req, res) => {
  try {
    const products = await db.getProducts();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memuat katalog produk.' });
  }
});

// API: Get order by orderNumber with PII protection
app.get('/api/orders/:orderNumber', async (req, res) => {
  const key = normalizeOrderKey(req.params.orderNumber);
  try {
    const order = await db.getOrder(key);
    if (!order) {
      res.status(404).json({
        error: `Pesanan ${key} tidak ditemukan. Periksa kembali nomor pesanan Anda.`,
      });
      return;
    }

    const queryPhone = String(
      req.query.phone || req.headers['x-customer-phone'] || ''
    ).replace(/\D/g, '');
    const orderPhoneDigits = order.phone.replace(/\D/g, '');
    const isAuthorized = Boolean(
      queryPhone &&
        (orderPhoneDigits === queryPhone ||
          (queryPhone.length >= 4 && orderPhoneDigits.endsWith(queryPhone)))
    );

    res.json({
      order: sanitizeOrderForPublic(order, isAuthorized),
      isMasked: !isAuthorized,
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memuat data pesanan.' });
  }
});

// API: Create order with server-side validation, stock check, & persistence
interface CreateOrderBody {
  idempotencyKey?: string;
  items: Array<{ productId: number; variantId?: string; quantity: number }>;
  form: CheckoutFormData;
}

app.post('/api/orders', async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkOrderRateLimit(clientIp)) {
    res.status(429).json({
      error: 'Terlalu banyak permintaan pemesanan. Mohon tunggu beberapa saat sebelum mencoba lagi.',
    });
    return;
  }

  const body = req.body as CreateOrderBody;

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    res.status(400).json({ error: 'Keranjang belanja tidak boleh kosong.' });
    return;
  }

  const form = body.form;
  if (!form || !form.customerName?.trim() || form.customerName.trim().length < 2) {
    res.status(400).json({ error: 'Nama penerima harus diisi lengkap.', field: 'customerName' });
    return;
  }
  const phoneDigits = (form.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    res.status(400).json({
      error: 'Nomor WhatsApp belum lengkap. Periksa kembali, ya.',
      field: 'phone',
    });
    return;
  }
  if (!form.address?.trim() || form.address.trim().length < 8) {
    res.status(400).json({
      error: 'Alamat lengkap pengiriman minimal 8 karakter.',
      field: 'address',
    });
    return;
  }
  if (!form.city?.trim()) {
    res.status(400).json({ error: 'Kota / Kabupaten wajib diisi.', field: 'city' });
    return;
  }
  if (!/^\d{5}$/.test((form.postalCode || '').trim())) {
    res.status(400).json({
      error: 'Kode pos harus terdiri dari 5 digit angka.',
      field: 'postalCode',
    });
    return;
  }

  try {
    const result = await db.createOrder(body.items, form, body.idempotencyKey);
    res.status(201).json(result);
  } catch (err: any) {
    const message = err?.message || 'Gagal membuat pesanan.';
    const isConflict = message.includes('stok') || message.includes('habis');
    res.status(isConflict ? 409 : 400).json({ error: message });
  }
});

// API: Update delivery instruction
app.patch('/api/orders/:orderNumber/instruction', async (req, res) => {
  const key = normalizeOrderKey(req.params.orderNumber);
  const instruction = String((req.body as { instruction?: string })?.instruction || '').trim();
  if (!instruction) {
    res.status(400).json({ error: 'Instruksi pengiriman tidak boleh kosong.' });
    return;
  }

  const order = await db.updateInstruction(key, instruction);
  if (!order) {
    res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    return;
  }
  res.json({ order });
});

// API: Confirm order received (only allowed when in transit)
app.patch('/api/orders/:orderNumber/confirm-delivery', async (req, res) => {
  const key = normalizeOrderKey(req.params.orderNumber);
  const order = await db.getOrder(key);
  if (!order) {
    res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    return;
  }
  if (order.status !== 'Dalam Pengiriman Ekspedisi') {
    res.status(400).json({
      error: 'Konfirmasi penerimaan hanya tersedia saat paket berstatus dalam pengiriman ekspedisi.',
    });
    return;
  }

  const updated = await db.confirmDelivery(key);
  res.json({ order: updated });
});

// API: Verify payment & dispatch order (guarded demo trigger)
app.patch('/api/orders/:orderNumber/verify-payment', async (req, res) => {
  if (req.headers['x-demo-action'] !== 'simulated-payment') {
    res.status(403).json({
      error: 'Akses ditolak: Verifikasi pembayaran manual memerlukan otorisasi demo resmi.',
    });
    return;
  }
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DEMO_PAYMENT) {
    res.status(403).json({
      error: 'Akses ditolak: Verifikasi pembayaran simulasi dimatikan pada mode produksi.',
    });
    return;
  }

  const key = normalizeOrderKey(req.params.orderNumber);
  const updated = await db.verifyPayment(key);
  if (!updated) {
    res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    return;
  }
  res.json({ order: updated });
});

async function startServer() {
  const isDbReady = db.isConfigured;
  console.log(`[Database] Mode: ${isDbReady ? 'Supabase Persistent PostgreSQL' : 'In-Memory Fallback'}`);
  if (!isDbReady) {
    console.log('[Database] Untuk menghubungkan ke Supabase, masukkan SUPABASE_URL & SUPABASE_ANON_KEY di file .env');
  }

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HerbalStore server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
