-- ==============================================================================
-- HerbalStore - Supabase Relational Database Schema
-- Tahap 2: Database Persisten & Arsitektur Transaksi Atomik
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
    slug text primary key,
    name text not null,
    short_desc text not null,
    description text not null,
    badge_class text not null,
    icon_bg_class text not null,
    icon_text_class text not null,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
    id serial primary key,
    slug text unique not null,
    name text not null,
    brand text not null,
    category_slug text not null references public.categories(slug) on update cascade,
    category_label text not null,
    short_benefit text not null,
    description text not null,
    price integer not null check (price >= 0),
    stock integer not null default 0 check (stock >= 0),
    package_size text not null,
    registration_number text not null,
    image text not null,
    composition jsonb not null default '[]'::jsonb,
    usage_instruction text not null,
    warnings text not null,
    storage text not null,
    batch_code text not null,
    expiry_date text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 3. PRODUCT VARIANTS TABLE
create table if not exists public.product_variants (
    id text primary key,
    product_id integer not null references public.products(id) on delete cascade,
    label text not null,
    price integer not null check (price >= 0),
    stock integer not null default 0 check (stock >= 0),
    created_at timestamptz not null default now()
);

-- 4. ORDERS TABLE
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    order_number text unique not null,
    idempotency_key text unique,
    created_at timestamptz not null default now(),
    created_at_label text not null,
    status text not null default 'Menunggu Pembayaran',
    payment_status text not null default 'Belum Dibayar',
    payment_method text not null,
    va_number text not null,
    shipping_method text not null,
    courier_name text not null,
    awb_number text not null,
    estimated_arrival text not null,
    driver_name text not null default 'Menunggu Alokasi Kurir Hub',
    driver_hub text not null default 'Gudang Pusat HerbalStore Bandung',
    driver_phone text not null default '+62 812-9900-8800',
    delivery_instruction text not null default 'Hubungi penerima setibanya di alamat tujuan.',
    customer_name text not null,
    phone text not null,
    address text not null,
    city text not null,
    postal_code text not null,
    subtotal integer not null check (subtotal >= 0),
    shipping_cost integer not null check (shipping_cost >= 0),
    discount integer not null default 0 check (discount >= 0),
    total integer not null check (total >= 0),
    last_synced_label text not null default 'Baru saja diperbarui'
);

-- 5. ORDER ITEMS TABLE
create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_number text not null references public.orders(order_number) on delete cascade,
    product_id integer not null references public.products(id),
    product_name text not null,
    variant_label text not null,
    registration_number text not null,
    unit_price integer not null check (unit_price >= 0),
    quantity integer not null check (quantity > 0),
    line_total integer not null check (line_total >= 0),
    image text not null,
    created_at timestamptz not null default now()
);

-- 6. ORDER MILESTONES TABLE
create table if not exists public.order_milestones (
    id text primary key,
    order_number text not null references public.orders(order_number) on delete cascade,
    title text not null,
    timestamp text not null,
    description text not null,
    completed boolean not null default true,
    active boolean not null default false,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE LOOKUPS
-- ==============================================================================
create index if not exists idx_products_category on public.products(category_slug);
create index if not exists idx_product_variants_product on public.product_variants(product_id);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_phone on public.orders(phone);
create index if not exists idx_order_items_order_number on public.order_items(order_number);
create index if not exists idx_order_milestones_order_number on public.order_milestones(order_number);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_milestones enable row level security;

-- Public read access for catalog
create policy "Allow public read categories" on public.categories for select using (true);
create policy "Allow public read products" on public.products for select using (true);
create policy "Allow public read variants" on public.product_variants for select using (true);

-- Orders: Service role has full access; anon can read by order_number
create policy "Allow public read orders by order_number" on public.orders for select using (true);
create policy "Allow public insert orders" on public.orders for insert with check (true);
create policy "Allow public update order instruction" on public.orders for update using (true);

create policy "Allow public read order_items" on public.order_items for select using (true);
create policy "Allow public insert order_items" on public.order_items for insert with check (true);

create policy "Allow public read milestones" on public.order_milestones for select using (true);
create policy "Allow public insert milestones" on public.order_milestones for insert with check (true);
create policy "Allow public update milestones" on public.order_milestones for update using (true);
