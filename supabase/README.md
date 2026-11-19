# Panduan Setup Supabase Database HerbalStore

Dokumentasi ini menjelaskan langkah-langkah menghubungkan HerbalStore ke **Supabase Persistent PostgreSQL Database** (Tahap 2).

---

## 1. Buat Proyek Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Klik **"New Project"**.
3. Beri nama proyek (misal: `herbalstore-db`), atur database password, dan pilih region terdekat (misal: `Singapore (ap-southeast-1)`).

---

## 2. Eksekusi Skema Tabel (DDL)
1. Buka menu **SQL Editor** pada sidebar Supabase.
2. Buka file [`supabase/schema.sql`](./schema.sql), salin seluruh isinya, tempelkan ke SQL Editor Supabase, lalu klik **Run**.
3. Skema ini akan membuat:
   * Tabel `public.categories` (Taksonomi 7 sistem organ tubuh).
   * Tabel `public.products` (Katalog produk herbal).
   * Tabel `public.product_variants` (Pilihan ukuran & varian kemasan).
   * Tabel `public.orders` (Data transaksi & status pengiriman).
   * Tabel `public.order_items` (Snapshot item dalam pesanan).
   * Tabel `public.order_milestones` (Linimasa pelacakan pengiriman).
   * Indeks performa & aturan Row Level Security (RLS).

---

## 3. Eksekusi Data Awal (Seed Data)
1. Pada **SQL Editor**, buka file [`supabase/seed.sql`](./seed.sql), salin isinya, tempelkan ke SQL Editor, lalu klik **Run**.
2. Script ini akan mengisi:
   * 7 kategori sistem organ tubuh.
   * 8 produk herbal berizin BPOM/P-IRT beserta komposisi dan aturan pakai.
   * Varian kemasan produk.
   * 1 pesanan seed (`#HBS-20261118-8492`) untuk demo pelacakan pengiriman.

---

## 4. Konfigurasi Environment Variables
1. Buka menu **Project Settings** -> **API** di dashboard Supabase.
2. Salin **Project URL** dan **anon public key** (atau **service_role secret key**).
3. Buat file `.env` di root direktori proyek (salin dari `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Masukkan kredensial Anda:
   ```env
   SUPABASE_URL="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
   SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

---

## 5. Jalankan Server
Jalankan aplikasi seperti biasa:
```bash
npm run dev
```

Server akan mendeteksi kredensial Supabase secara otomatis:
```
[Database] Mode: Supabase Persistent PostgreSQL
HerbalStore server running at http://0.0.0.0:3000
```

> **Catatan Graceful Fallback:**  
> Jika kredensial Supabase belum diisi atau salah, aplikasi akan tetap berjalan dengan aman menggunakan mode *In-Memory Fallback* tanpa mengalami crash.
