import { SEED_ORDER } from '../data/catalog.ts';
import type {
  CartItem,
  CheckoutFormData,
  OrderItemSnapshot,
  OrderRecord,
  Product,
} from '../types/herbal.ts';

const ORDERS_STORAGE_KEY = 'herbalstore_orders_v1';

function normalizeKey(raw: string): string {
  const cleaned = raw.trim().toUpperCase();
  return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
}

function getStoredOrders(): Record<string, OrderRecord> {
  const base: Record<string, OrderRecord> = {
    [normalizeKey(SEED_ORDER.orderNumber)]: SEED_ORDER,
  };
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Record<string, OrderRecord>;
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

function saveStoredOrder(order: OrderRecord): void {
  try {
    const all = getStoredOrders();
    all[normalizeKey(order.orderNumber)] = order;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Ignore storage errors
  }
}

export function createOrderLocally(
  products: Product[],
  cartItems: CartItem[],
  form: CheckoutFormData
): { order: OrderRecord; updatedProducts: Product[] } {
  const updatedProducts = products.map((p) => ({
    ...p,
    variants: p.variants ? p.variants.map((v) => ({ ...v })) : undefined,
  }));

  const snapshots: OrderItemSnapshot[] = [];
  let subtotal = 0;

  for (const cartItem of cartItems) {
    const product = updatedProducts.find((p) => p.id === cartItem.productId);
    if (!product) {
      throw new Error('Salah satu produk tidak ditemukan.');
    }
    const variant = cartItem.variantId
      ? product.variants?.find((v) => v.id === cartItem.variantId)
      : undefined;
    const unitPrice = variant ? variant.price : product.price;
    const availableStock = variant ? variant.stock : product.stock;
    if (cartItem.qty > availableStock || availableStock <= 0) {
      throw new Error(`Stok ${product.name} tidak mencukupi.`);
    }

    if (variant) {
      variant.stock = Math.max(0, variant.stock - cartItem.qty);
    }
    product.stock = Math.max(0, product.stock - cartItem.qty);

    const lineTotal = unitPrice * cartItem.qty;
    subtotal += lineTotal;
    snapshots.push({
      productId: product.id,
      productName: product.name,
      variantLabel: variant ? variant.label : product.packageSize,
      registrationNumber: product.registrationNumber,
      unitPrice,
      quantity: cartItem.qty,
      lineTotal,
      image: product.image,
    });
  }

  const promoNormalized = (form.promoCode || '').trim().toUpperCase();
  const discount =
    promoNormalized === 'HERBALAWAL' && subtotal >= 100000
      ? Math.round(subtotal * 0.1)
      : 0;
  const shippingCost =
    form.shippingMethod === 'express' ? 15000 : subtotal >= 150000 ? 0 : 18000;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const now = new Date();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `#HBS-20261118-${suffix}`;
  const awbNumber = `HBS${Math.floor(1000000000 + Math.random() * 8999999999)}ID`;
  const timeLabel = `${now.getDate()} Nov 2026, ${String(now.getHours()).padStart(
    2,
    '0'
  )}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
  const digits = form.phone.replace(/\D/g, '');
  const vaPrefix = form.paymentMethod === 'va_mandiri' ? '8950' : '8271';
  const vaNumber = `${vaPrefix} ${digits.slice(0, 4).padEnd(4, '0')} ${digits
    .slice(4, 8)
    .padEnd(4, '0')} ${suffix}`;

  const order: OrderRecord = {
    orderNumber,
    createdAtLabel: timeLabel,
    status: 'Menunggu Pembayaran',
    paymentStatus: 'Belum Dibayar',
    paymentMethod: form.paymentMethod,
    vaNumber,
    shippingMethod: form.shippingMethod,
    courierName:
      form.shippingMethod === 'express' ? 'SiCepat Express 1 Hari' : 'SiCepat Reguler Higienis',
    awbNumber,
    estimatedArrival:
      form.shippingMethod === 'express'
        ? 'Besok, 19 Nov (09:00 - 13:00)'
        : '2–3 Hari Kerja (15:00 - 18:00)',
    driverName: 'Menunggu Alokasi Kurir Hub',
    driverHub: 'Gudang Pusat HerbalStore Bandung',
    driverPhone: '+62 812-9900-8800',
    deliveryInstruction:
      form.notes.trim() || 'Hubungi penerima setibanya di alamat tujuan.',
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

  saveStoredOrder(order);
  return { order, updatedProducts };
}

export function lookupOrderLocally(orderNumber: string): OrderRecord | null {
  const all = getStoredOrders();
  return all[normalizeKey(orderNumber)] || null;
}

export function updateOrderInstructionLocally(
  orderNumber: string,
  instruction: string
): OrderRecord | null {
  const order = lookupOrderLocally(orderNumber);
  if (!order) return null;
  const updated: OrderRecord = {
    ...order,
    deliveryInstruction: instruction,
    lastSyncedLabel: 'Baru saja diperbarui',
  };
  saveStoredOrder(updated);
  return updated;
}

export function confirmDeliveryLocally(orderNumber: string): OrderRecord | null {
  const order = lookupOrderLocally(orderNumber);
  if (!order) return null;
  const updated: OrderRecord = {
    ...order,
    status: 'Selesai',
    lastSyncedLabel: 'Baru saja diperbarui',
    milestones: [
      {
        id: `m-${Date.now()}`,
        title: 'Paket Diterima oleh Penerima',
        timestamp: '19 Nov, 15:40 WIB',
        description: `Pesanan dikonfirmasi telah diterima dengan segel higienis utuh oleh ${order.customerName}.`,
        completed: true,
        active: true,
      },
      ...order.milestones.map((m) => ({ ...m, active: false })),
    ],
  };
  saveStoredOrder(updated);
  return updated;
}

export function verifyPaymentLocally(orderNumber: string): OrderRecord | null {
  const order = lookupOrderLocally(orderNumber);
  if (!order) return null;
  const updated: OrderRecord = {
    ...order,
    paymentStatus: 'Dibayar',
    status: 'Dalam Pengiriman Ekspedisi',
    driverName: 'Rian Firmansyah',
    driverHub: 'SiCepat Delivery Hub Bandung Barat',
    driverPhone: '+62 813-9821-44xx',
    lastSyncedLabel: 'Baru saja diperbarui',
    milestones: [
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
      },
      ...order.milestones.map((m) => ({ ...m, active: false })),
    ],
  };
  saveStoredOrder(updated);
  return updated;
}
