import { PRODUCTS, SEED_ORDER } from '../data/catalog.ts';
import type {
  CheckoutFormData,
  OrderItemSnapshot,
  OrderMilestone,
  OrderRecord,
  Product,
} from '../types/herbal.ts';
import { calculateOrderTotals } from '../utils/pricing.ts';
import { getSupabase, isSupabaseConfigured } from './supabaseClient.ts';

// In-memory cache & fallback store
const inMemoryProducts: Product[] = PRODUCTS.map((p) => ({
  ...p,
  variants: p.variants ? p.variants.map((v) => ({ ...v })) : undefined,
}));

const inMemoryOrders = new Map<string, OrderRecord>();
const inMemoryIdempotency = new Map<string, OrderRecord>();

function normalizeOrderKey(raw: string): string {
  const cleaned = raw.trim().toUpperCase();
  return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
}

// Initialize seed order in memory
inMemoryOrders.set(normalizeOrderKey(SEED_ORDER.orderNumber), {
  ...SEED_ORDER,
  items: SEED_ORDER.items.map((i) => ({ ...i })),
  milestones: SEED_ORDER.milestones.map((m) => ({ ...m })),
});

export interface DatabaseAdapter {
  isConfigured: boolean;
  getProducts: () => Promise<Product[]>;
  getOrder: (orderNumber: string) => Promise<OrderRecord | null>;
  createOrder: (
    items: Array<{ productId: number; variantId?: string; quantity: number }>,
    form: CheckoutFormData,
    idempotencyKey?: string
  ) => Promise<{ order: OrderRecord; products: Product[] }>;
  updateInstruction: (orderNumber: string, instruction: string) => Promise<OrderRecord | null>;
  confirmDelivery: (orderNumber: string) => Promise<OrderRecord | null>;
  verifyPayment: (orderNumber: string) => Promise<OrderRecord | null>;
}

// Convert Supabase DB product row to application Product model
function mapDbProductToModel(row: any): Product {
  const variants = Array.isArray(row.product_variants)
    ? row.product_variants.map((v: any) => ({
        id: String(v.id),
        label: String(v.label),
        price: Number(v.price),
        stock: Number(v.stock),
      }))
    : undefined;

  let composition: string[] = [];
  if (Array.isArray(row.composition)) {
    composition = row.composition.map(String);
  } else if (typeof row.composition === 'string') {
    try {
      composition = JSON.parse(row.composition);
    } catch {
      composition = [row.composition];
    }
  }

  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    brand: String(row.brand),
    category: row.category_slug,
    categoryLabel: String(row.category_label),
    shortBenefit: String(row.short_benefit),
    description: String(row.description),
    price: Number(row.price),
    stock: Number(row.stock),
    packageSize: String(row.package_size),
    registrationNumber: String(row.registration_number),
    image: String(row.image),
    composition,
    usageInstruction: String(row.usage_instruction),
    warnings: String(row.warnings),
    storage: String(row.storage),
    batchCode: String(row.batch_code),
    expiryDate: String(row.expiry_date),
    variants: variants && variants.length > 0 ? variants : undefined,
  };
}

// Convert Supabase DB order rows to application OrderRecord model
function mapDbOrderToRecord(
  orderRow: any,
  itemRows: any[],
  milestoneRows: any[]
): OrderRecord {
  const items: OrderItemSnapshot[] = itemRows.map((it) => ({
    productId: Number(it.product_id),
    productName: String(it.product_name),
    variantLabel: String(it.variant_label),
    registrationNumber: String(it.registration_number),
    unitPrice: Number(it.unit_price),
    quantity: Number(it.quantity),
    lineTotal: Number(it.line_total),
    image: String(it.image),
  }));

  const milestones: OrderMilestone[] = milestoneRows.map((m) => ({
    id: String(m.id),
    title: String(m.title),
    timestamp: String(m.timestamp),
    description: String(m.description),
    completed: Boolean(m.completed),
    active: Boolean(m.active),
  }));

  return {
    orderNumber: String(orderRow.order_number),
    createdAtLabel: String(orderRow.created_at_label),
    status: orderRow.status,
    paymentStatus: orderRow.payment_status,
    paymentMethod: orderRow.payment_method,
    vaNumber: String(orderRow.va_number),
    shippingMethod: orderRow.shipping_method,
    courierName: String(orderRow.courier_name),
    awbNumber: String(orderRow.awb_number),
    estimatedArrival: String(orderRow.estimated_arrival),
    driverName: String(orderRow.driver_name),
    driverHub: String(orderRow.driver_hub),
    driverPhone: String(orderRow.driver_phone),
    deliveryInstruction: String(orderRow.delivery_instruction),
    customerName: String(orderRow.customer_name),
    phone: String(orderRow.phone),
    address: String(orderRow.address),
    city: String(orderRow.city),
    postalCode: String(orderRow.postal_code),
    subtotal: Number(orderRow.subtotal),
    shippingCost: Number(orderRow.shipping_cost),
    discount: Number(orderRow.discount),
    total: Number(orderRow.total),
    lastSyncedLabel: String(orderRow.last_synced_label),
    items,
    milestones,
  };
}

export const db: DatabaseAdapter = {
  get isConfigured() {
    return isSupabaseConfigured();
  },

  async getProducts(): Promise<Product[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return inMemoryProducts;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .order('id', { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn('Supabase products fetch failed or empty; using catalog fallback.', error?.message);
        return inMemoryProducts;
      }

      return data.map(mapDbProductToModel);
    } catch (err) {
      console.error('Error fetching products from Supabase:', err);
      return inMemoryProducts;
    }
  },

  async getOrder(orderNumber: string): Promise<OrderRecord | null> {
    const key = normalizeOrderKey(orderNumber);
    const supabase = getSupabase();

    if (!supabase) {
      return inMemoryOrders.get(key) || null;
    }

    try {
      const { data: orderRow, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', key)
        .maybeSingle();

      if (orderErr || !orderRow) {
        return inMemoryOrders.get(key) || null;
      }

      const [{ data: itemRows }, { data: milestoneRows }] = await Promise.all([
        supabase.from('order_items').select('*').eq('order_number', key),
        supabase
          .from('order_milestones')
          .select('*')
          .eq('order_number', key)
          .order('sort_order', { ascending: false }),
      ]);

      const record = mapDbOrderToRecord(orderRow, itemRows || [], milestoneRows || []);
      inMemoryOrders.set(key, record);
      return record;
    } catch (err) {
      console.error('Error fetching order from Supabase:', err);
      return inMemoryOrders.get(key) || null;
    }
  },

  async createOrder(
    items: Array<{ productId: number; variantId?: string; quantity: number }>,
    form: CheckoutFormData,
    idempotencyKey?: string
  ): Promise<{ order: OrderRecord; products: Product[] }> {
    if (idempotencyKey && inMemoryIdempotency.has(idempotencyKey)) {
      return {
        order: inMemoryIdempotency.get(idempotencyKey)!,
        products: inMemoryProducts,
      };
    }

    const currentProducts = await this.getProducts();

    // Validate stocks & calculate server-side line totals
    const snapshots: OrderItemSnapshot[] = [];
    let subtotal = 0;

    for (const requested of items) {
      const product = currentProducts.find((p) => p.id === requested.productId);
      if (!product) {
        throw new Error('Salah satu produk di keranjang tidak ditemukan.');
      }

      const qty = Math.floor(Number(requested.quantity));
      if (!Number.isFinite(qty) || qty < 1) {
        throw new Error(`Jumlah untuk ${product.name} tidak valid.`);
      }

      const variant = requested.variantId
        ? product.variants?.find((v) => v.id === requested.variantId)
        : undefined;

      const unitPrice = variant ? variant.price : product.price;
      const availableStock = variant ? variant.stock : product.stock;
      const variantLabel = variant ? variant.label : product.packageSize;

      if (availableStock <= 0) {
        throw new Error(
          `Maaf, stok ${product.name} (${variantLabel}) baru saja habis. Silakan perbarui keranjang Anda.`
        );
      }

      if (qty > availableStock) {
        throw new Error(
          `Stok ${product.name} tersisa ${availableStock}. Silakan sesuaikan jumlah di keranjang.`
        );
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

    const shippingMethod = form.shippingMethod === 'express' ? 'express' : 'regular';
    const { discount, shippingCost, total } = calculateOrderTotals(
      subtotal,
      shippingMethod,
      form.promoCode
    );

    const now = new Date();
    const uniqueSuffix = `${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const orderNumber = `#HBS-${uniqueSuffix}`;
    const awbNumber = `HBS${Date.now().toString().slice(-6)}${Math.floor(100000 + Math.random() * 900000)}ID`;
    const timeLabel = `${now.getDate()} Nov 2026, ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} WIB`;

    const phoneDigits = (form.phone || '').replace(/\D/g, '');
    const vaPrefix = form.paymentMethod === 'va_mandiri' ? '8950' : '8271';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const vaNumber = `${vaPrefix} ${phoneDigits.slice(0, 4).padEnd(4, '0')} ${phoneDigits
      .slice(4, 8)
      .padEnd(4, '0')} ${String(randomSuffix)}`;

    const initialMilestones: OrderMilestone[] = [
      {
        id: `m-init-${Date.now()}`,
        title: 'Pesanan Berhasil Dibuat — Menunggu Pembayaran',
        timestamp: timeLabel,
        description:
          'Pesanan Anda tercatat di sistem. Silakan selesaikan pembayaran via QRIS atau Virtual Account sebelum batas waktu berakhir.',
        completed: true,
        active: true,
      },
    ];

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
      milestones: initialMilestones,
    };

    // Update in-memory stocks
    for (const requested of items) {
      const product = inMemoryProducts.find((p) => p.id === requested.productId)!;
      const variant = requested.variantId
        ? product.variants?.find((v) => v.id === requested.variantId)
        : undefined;

      if (variant) {
        variant.stock = Math.max(0, variant.stock - requested.quantity);
        if (product.variants && product.variants.length > 0) {
          product.stock = product.variants.reduce((acc, v) => acc + v.stock, 0);
        } else {
          product.stock = Math.max(0, product.stock - requested.quantity);
        }
      } else {
        product.stock = Math.max(0, product.stock - requested.quantity);
      }
    }

    inMemoryOrders.set(normalizeOrderKey(orderNumber), newOrder);
    if (idempotencyKey) {
      inMemoryIdempotency.set(idempotencyKey, newOrder);
    }

    // Persist to Supabase if configured
    const supabase = getSupabase();
    if (supabase) {
      try {
        // 1. Insert order
        await supabase.from('orders').insert({
          order_number: orderNumber,
          idempotency_key: idempotencyKey || null,
          created_at_label: timeLabel,
          status: newOrder.status,
          payment_status: newOrder.paymentStatus,
          payment_method: newOrder.paymentMethod,
          va_number: newOrder.vaNumber,
          shipping_method: newOrder.shippingMethod,
          courier_name: newOrder.courierName,
          awb_number: newOrder.awbNumber,
          estimated_arrival: newOrder.estimatedArrival,
          driver_name: newOrder.driverName,
          driver_hub: newOrder.driverHub,
          driver_phone: newOrder.driverPhone,
          delivery_instruction: newOrder.deliveryInstruction,
          customer_name: newOrder.customerName,
          phone: newOrder.phone,
          address: newOrder.address,
          city: newOrder.city,
          postal_code: newOrder.postalCode,
          subtotal: newOrder.subtotal,
          shipping_cost: newOrder.shippingCost,
          discount: newOrder.discount,
          total: newOrder.total,
          last_synced_label: newOrder.lastSyncedLabel,
        });

        // 2. Insert order items
        await supabase.from('order_items').insert(
          snapshots.map((item) => ({
            order_number: orderNumber,
            product_id: item.productId,
            product_name: item.productName,
            variant_label: item.variantLabel,
            registration_number: item.registrationNumber,
            unit_price: item.unitPrice,
            quantity: item.quantity,
            line_total: item.lineTotal,
            image: item.image,
          }))
        );

        // 3. Insert initial milestone
        await supabase.from('order_milestones').insert({
          id: initialMilestones[0].id,
          order_number: orderNumber,
          title: initialMilestones[0].title,
          timestamp: initialMilestones[0].timestamp,
          description: initialMilestones[0].description,
          completed: initialMilestones[0].completed,
          active: initialMilestones[0].active,
          sort_order: 1,
        });

        // 4. Update stocks in Supabase
        for (const requested of items) {
          const product = inMemoryProducts.find((p) => p.id === requested.productId)!;
          if (requested.variantId) {
            const variant = product.variants?.find((v) => v.id === requested.variantId);
            if (variant) {
              await supabase
                .from('product_variants')
                .update({ stock: variant.stock })
                .eq('id', requested.variantId);
            }
          }
          await supabase
            .from('products')
            .update({ stock: product.stock })
            .eq('id', product.id);
        }
      } catch (dbErr) {
        console.error('Failed to persist order to Supabase:', dbErr);
      }
    }

    return { order: newOrder, products: inMemoryProducts };
  },

  async updateInstruction(
    orderNumber: string,
    instruction: string
  ): Promise<OrderRecord | null> {
    const key = normalizeOrderKey(orderNumber);
    const order = await this.getOrder(key);
    if (!order) return null;

    order.deliveryInstruction = instruction;
    order.lastSyncedLabel = 'Baru saja diperbarui';
    inMemoryOrders.set(key, order);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            delivery_instruction: instruction,
            last_synced_label: order.lastSyncedLabel,
          })
          .eq('order_number', key);
      } catch (err) {
        console.error('Error updating instruction in Supabase:', err);
      }
    }

    return order;
  },

  async confirmDelivery(orderNumber: string): Promise<OrderRecord | null> {
    const key = normalizeOrderKey(orderNumber);
    const order = await this.getOrder(key);
    if (!order || order.status !== 'Dalam Pengiriman Ekspedisi') return null;

    order.status = 'Selesai';
    order.milestones = order.milestones.map((m) => ({ ...m, active: false }));
    const completionMilestone: OrderMilestone = {
      id: `m-deliv-${Date.now()}`,
      title: 'Paket Diterima oleh Penerima',
      timestamp: 'Hari ini, Selesai',
      description: `Pesanan dikonfirmasi telah diterima dengan segel higienis utuh oleh ${order.customerName}.`,
      completed: true,
      active: true,
    };
    order.milestones.unshift(completionMilestone);
    order.lastSyncedLabel = 'Baru saja diperbarui';
    inMemoryOrders.set(key, order);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            status: 'Selesai',
            last_synced_label: order.lastSyncedLabel,
          })
          .eq('order_number', key);

        await supabase
          .from('order_milestones')
          .update({ active: false })
          .eq('order_number', key);

        await supabase.from('order_milestones').insert({
          id: completionMilestone.id,
          order_number: key,
          title: completionMilestone.title,
          timestamp: completionMilestone.timestamp,
          description: completionMilestone.description,
          completed: true,
          active: true,
          sort_order: 10,
        });
      } catch (err) {
        console.error('Error confirming delivery in Supabase:', err);
      }
    }

    return order;
  },

  async verifyPayment(orderNumber: string): Promise<OrderRecord | null> {
    const key = normalizeOrderKey(orderNumber);
    const order = await this.getOrder(key);
    if (!order) return null;

    order.paymentStatus = 'Dibayar';
    order.status = 'Dalam Pengiriman Ekspedisi';
    order.driverName = 'Rian Firmansyah';
    order.driverHub = 'SiCepat Delivery Hub Bandung Barat';
    order.driverPhone = '+62 813-9821-44xx';
    order.milestones = order.milestones.map((m) => ({ ...m, active: false }));

    const dispatchMilestones: OrderMilestone[] = [
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
    ];

    order.milestones.unshift(...dispatchMilestones);
    order.lastSyncedLabel = 'Baru saja diperbarui';
    inMemoryOrders.set(key, order);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            payment_status: 'Dibayar',
            status: 'Dalam Pengiriman Ekspedisi',
            driver_name: order.driverName,
            driver_hub: order.driverHub,
            driver_phone: order.driverPhone,
            last_synced_label: order.lastSyncedLabel,
          })
          .eq('order_number', key);

        await supabase
          .from('order_milestones')
          .update({ active: false })
          .eq('order_number', key);

        await supabase.from('order_milestones').insert([
          {
            id: dispatchMilestones[0].id,
            order_number: key,
            title: dispatchMilestones[0].title,
            timestamp: dispatchMilestones[0].timestamp,
            description: dispatchMilestones[0].description,
            completed: true,
            active: true,
            sort_order: 8,
          },
          {
            id: dispatchMilestones[1].id,
            order_number: key,
            title: dispatchMilestones[1].title,
            timestamp: dispatchMilestones[1].timestamp,
            description: dispatchMilestones[1].description,
            completed: true,
            active: false,
            sort_order: 7,
          },
        ]);
      } catch (err) {
        console.error('Error verifying payment in Supabase:', err);
      }
    }

    return order;
  },
};
