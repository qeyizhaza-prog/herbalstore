export type CategorySlug =
  | 'pencernaan'
  | 'darah'
  | 'pernapasan'
  | 'perkemihan'
  | 'otak'
  | 'reproduksi'
  | 'lainnya';

export interface BodyCategory {
  slug: CategorySlug;
  name: string;
  shortDesc: string;
  description: string;
  badgeClass: string;
  iconBgClass: string;
  iconTextClass: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  stock: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  categoryLabel: string;
  shortBenefit: string;
  description: string;
  price: number;
  stock: number;
  packageSize: string;
  registrationNumber: string;
  image: string;
  composition: string[];
  usageInstruction: string;
  warnings: string;
  storage: string;
  batchCode: string;
  expiryDate: string;
  variants?: ProductVariant[];
}

export interface CartItem {
  productId: number;
  variantId?: string;
  name: string;
  variantLabel: string;
  registrationNumber: string;
  price: number;
  qty: number;
  maxStock: number;
  image: string;
}

export type ShippingMethod = 'regular' | 'express';
export type PaymentMethod = 'qris' | 'va_bca' | 'va_mandiri';

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  promoCode: string;
}

export type OrderStatus =
  | 'Menunggu Pembayaran'
  | 'Diproses'
  | 'Dalam Pengiriman Ekspedisi'
  | 'Selesai'
  | 'Dibatalkan';

export type PaymentStatus =
  | 'Belum Dibayar'
  | 'Menunggu Verifikasi'
  | 'Dibayar';

export interface OrderMilestone {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  completed: boolean;
  active?: boolean;
}

export interface OrderItemSnapshot {
  productId: number;
  productName: string;
  variantLabel: string;
  registrationNumber: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  image: string;
}

export interface OrderRecord {
  orderNumber: string;
  createdAtLabel: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  vaNumber: string;
  shippingMethod: ShippingMethod;
  courierName: string;
  awbNumber: string;
  estimatedArrival: string;
  driverName: string;
  driverHub: string;
  driverPhone: string;
  deliveryInstruction: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  lastSyncedLabel: string;
  items: OrderItemSnapshot[];
  milestones: OrderMilestone[];
}
