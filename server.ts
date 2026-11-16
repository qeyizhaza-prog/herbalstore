import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, SEED_ORDER } from './src/data/catalog.ts';
import type {
  CheckoutFormData,
  OrderItemSnapshot,
  OrderRecord,
  Product,
} from './src/types/herbal.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory store initialized from catalog & seed order
const productStore: Product[] = PRODUCTS.map((p) => ({
  ...p,
  variants: p.variants ? p.variants.map((v) => ({ ...v })) : undefined,
}));

const orderStore = new Map<string, OrderRecord>();
const idempotencyMap = new Map<string, OrderRecord>();

function normalizeOrderKey(raw: string): string {
  const cleaned = raw.trim().toUpperCase();
  return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
}

orderStore.set(normalizeOrderKey(SEED_ORDER.orderNumber), {
  ...SEED_ORDER,
  items: SEED_ORDER.items.map((i) => ({ ...i })),
  milestones: SEED_ORDER.milestones.map((m) => ({ ...m })),
});

// API: Get all products
app.get('/api/products', (_req, res) => {
  res.json({ products: productStore });
});

// API: Get order by orderNumber
app.get('/api/orders/:orderNumber', (req, res) => {
  const key = normalizeOrderKey(req.params.orderNumber);
  const order = orderStore.get(key);
  if (!order) {
    res.status(404).json({
      error: `Pesanan ${key} tidak ditemukan. Periksa kembali nomor pesanan Anda.`,
    });
    return;
  }
  res.json({ order });
});

// API: Create order with server-side validation, pricing, stock check, & idempotency
interface CreateOrderBody {
  idempotencyKey?: string;
  items: Array<{ productId: number; variantId?: string; quantity: number }>;
  form: CheckoutFormData;
}

app.post('/api/orders', (req, res) => {
  const body = req.body as CreateOrderBody;

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    res.status(400).json({ error: 'Keranjang belanja tidak boleh kosong.' });
    return;
  }

  if (body.idempotencyKey && idempotencyMap.has(body.idempotencyKey)) {
    const existing = idempotencyMap.get(body.idempotencyKey)!;
    res.status(200).json({ order: existing, deduplicated: true });
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

  // Validate stock & calculate server-side line totals
  const snapshots: OrderItemSnapshot[] = [];
  let subtotal = 0;

  for (const requested of body.items) {
    const product = productStore.find((p) => p.id === requested.productId);
    if (!product) {
      res.status(400).json({ error: 'Salah satu produk di keranjang tidak ditemukan.' });
      return;
    }

    const qty = Math.floor(Number(requested.quantity));
    if (!Number.isFinite(qty) || qty < 1) {
      res.status(400).json({ error: `Jumlah untuk ${product.name} tidak valid.` });
      return;
    }

    const variant = requested.variantId
      ? product.variants?.find((v) => v.id === requested.variantId)
      : undefined;

    const unitPrice = variant ? variant.price : product.price;
    const availableStock = variant ? variant.stock : product.stock;
    const variantLabel = variant ? variant.label : product.packageSize;

    if (availableStock <= 0) {
      res.status(409).json({
        error: `Maaf, stok ${product.name} (${variantLabel}) baru saja habis. Silakan perbarui keranjang Anda.`,
      });
      return;
    }

    if (qty > availableStock) {
      res.status(409).json({
        error: `Stok ${product.name} tersisa ${availableStock}. Silakan sesuaikan jumlah di keranjang.`,
      });
      return;
    }

    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;
    snapshots.push({
      productId: product.id,
      productName: product.name,
      variantLabel,
      registrationNumber: product.registrationNumber,
      unitPrice,
      quantity: qty,
      lineTotal,
      image: product.image,
    });
  }

  // Promo calculation (HERBALAWAL -> 10% off if subtotal >= 100.000)
  const promoNormalized = (form.promoCode || '').trim().toUpperCase();
  const discount =
    promoNormalized === 'HERBALAWAL' && subtotal >= 100000
      ? Math.round(subtotal * 0.1)
      : 0;

  // Shipping calculation
  const shippingMethod = form.shippingMethod === 'express' ? 'express' : 'regular';
  let shippingCost = 0;
  if (shippingMethod === 'express') {
    shippingCost = 15000;
  } else {
    shippingCost = subtotal >= 150000 ? 0 : 18000;
  }

  const total = Math.max(0, subtotal - discount + shippingCost);

  // Deduct stock after all checks pass
  for (const requested of body.items) {
    const product = productStore.find((p) => p.id === requested.productId)!;
    const variant = requested.variantId
      ? product.variants?.find((v) => v.id === requested.variantId)
      : undefined;
    if (variant) {
      variant.stock = Math.max(0, variant.stock - requested.quantity);
    }
    product.stock = Math.max(0, product.stock - requested.quantity);
  }

  const now = new Date();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `#HBS-20261118-${randomSuffix}`;
  const awbNumber = `HBS${Math.floor(1000000000 + Math.random() * 8999999999)}ID`;
  const timeLabel = `${now.getDate()} Nov 2026, ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')} WIB`;

  const vaPrefix = form.paymentMethod === 'va_mandiri' ? '8950' : '8271';
  const vaNumber = `${vaPrefix} ${phoneDigits.slice(0, 4).padEnd(4, '0')} ${phoneDigits
    .slice(4, 8)
    .padEnd(4, '0')} ${String(randomSuffix)}`;

  const newOrder: OrderRecord = {
    orderNumber,
    createdAtLabel: timeLabel,
    status: 'Menunggu Pembayaran',
    paymentStatus: 'Belum Dibayar',
    paymentMethod: form.paymentMethod || 'qris',
    vaNumber,
    shippingMethod,
    courierName:
      shippingMethod === 'express' ? 'SiCepat Express 1 Hari' : 'SiCepat Reguler Higienis',
    awbNumber,
    estimatedArrival:
      shippingMethod === 'express'
        ? 'Besok, 19 Nov (09:00 - 13:00)'
        : '2–3 Hari Kerja (15:00 - 18:00)',
    driverName: 'Menunggu Alokasi Kurir Hub',
    driverHub: 'Gudang Pusat HerbalStore Bandung',
    driverPhone: '+62 812-9900-8800',
    deliveryInstruction:
      form.notes?.trim() || 'Hubungi penerima setibanya di alamat tujuan.',
    customerName: form.customerName.trim(),
    phone: form.phone.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    postalCode: form.postalCode.trim(),
    subtotal,
    shippingCost,
    discount,
    total,
    lastSyncedLabel: 'Baru saja diperbarui',
    items: snapshots,
    milestones: [
      {
        id: 'm1',
        title: 'Pesanan Berhasil Dibuat — Menunggu Pembayaran',
        timestamp: timeLabel,
        description:
          'Pesanan Anda tercatat di sistem. Silakan selesaikan pembayaran via QRIS atau Virtual Account sebelum batas waktu berakhir.',
        completed: true,
        active: true,
      },
    ],
  };

  orderStore.set(normalizeOrderKey(orderNumber), newOrder);
  if (body.idempotencyKey) {
    idempotencyMap.set(body.idempotencyKey, newOrder);
  }

  res.status(201).json({ order: newOrder, products: productStore });
});

// API: Update delivery instruction
app.patch('/api/orders/:orderNumber/instruction', (req, res) => {
  const key = normalizeOrderKey(req.params.orderNumber);
  const order = orderStore.get(key);
  if (!order) {
    res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    return;
  }
  const instruction = String((req.body as { instruction?: string })?.instruction || '').trim();
  if (!instruction) {
    res.status(400).json({ error: 'Instruksi pengiriman tidak boleh kosong.' });
    return;
  }
  order.deliveryInstruction = instruction;
  order.lastSyncedLabel = 'Baru saja diperbarui';
  res.json({ order });
});

// API: Confirm order received (only allowed when in transit)
app.patch('/api/orders/:orderNumber/confirm-delivery', (req, res) => {
  const key = normalizeOrderKey(req.params.orderNumber);
  const order = orderStore.get(key);
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

  order.status = 'Selesai';
  order.milestones = order.milestones.map((m) => ({ ...m, active: false }));
  order.milestones.unshift({
    id: `m-${Date.now()}`,
    title: 'Paket Diterima oleh Penerima',
    timestamp: '19 Nov, 15:40 WIB',
    description: `Pesanan dikonfirmasi telah diterima dengan segel higienis utuh oleh ${order.customerName}.`,
    completed: true,
    active: true,
  });
  order.lastSyncedLabel = 'Baru saja diperbarui';
  res.json({ order });
});

// API: Verify payment & dispatch order (explicit user-triggered status progression)
app.patch('/api/orders/:orderNumber/verify-payment', (req, res) => {
  const key = normalizeOrderKey(req.params.orderNumber);
  const order = orderStore.get(key);
  if (!order) {
    res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    return;
  }
  order.paymentStatus = 'Dibayar';
  order.status = 'Dalam Pengiriman Ekspedisi';
  order.driverName = 'Rian Firmansyah';
  order.driverHub = 'SiCepat Delivery Hub Bandung Barat';
  order.driverPhone = '+62 813-9821-44xx';
  order.milestones = order.milestones.map((m) => ({ ...m, active: false }));
  order.milestones.unshift(
    {
      id: `m-ship-${Date.now()}`,
      title: 'Sedang Dibawa Kurir Menuju Alamat Penerima (Out for Delivery)',
      timestamp: 'Hari ini, 08:30 WIB',
      description:
        'Pembayaran terverifikasi & paket telah dikemas higienis. Kurir Rian Firmansyah sedang menuju alamat tujuan.',
      completed: true,
      active: true,
    },
    {
      id: `m-pack-${Date.now()}`,
      title: 'Dikemas Higienis dengan Bubble Wrap & Segel Khusus Herbal',
      timestamp: 'Hari ini, 07:15 WIB',
      description:
        'Gudang Pusat HerbalStore telah melakukan quality check nomor batch, segel botol, dan kemasan kedap suhu.',
      completed: true,
      active: false,
    }
  );
  order.lastSyncedLabel = 'Baru saja diperbarui';
  res.json({ order });
});

async function startServer() {
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
