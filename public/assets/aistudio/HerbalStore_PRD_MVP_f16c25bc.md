# Product Requirements Document (PRD)
## HerbalStore — MVP

**Versi:** 1.0  
**Tanggal:** 16 November 2026  
**Status:** Draft untuk validasi dan pengembangan MVP  
**Platform:** Responsive web app, mobile-first  
**Bahasa:** Indonesia  
**Model bisnis:** B2C online store produk herbal

---

## 1. Ringkasan Produk

HerbalStore adalah toko online produk herbal untuk pria dan wanita usia 30–55 tahun. Produk dirancang agar mudah ditemukan melalui dua jalur utama: katalog berdasarkan kategori dan pencarian berdasarkan sistem tubuh/keluhan.

Pengalaman belanja harus terasa sederhana, cepat, transparan, dan nyaman di perangkat mobile. HerbalStore bukan alat diagnosis atau pengganti konsultasi tenaga kesehatan. Informasi produk harus faktual, dapat ditelusuri, dan tidak menjanjikan kesembuhan.

### Problem statement

Calon pembeli sering kesulitan menemukan produk yang relevan di katalog herbal yang padat, membandingkan informasi produk, memahami batas penggunaan, dan menyelesaikan checkout melalui ponsel.

### Product proposition

**“Temukan pilihan herbal dengan lebih jelas. Belanja tanpa berputar-putar.”**

HerbalStore membantu pengguna:
1. Menemukan produk melalui kategori dan sistem tubuh.
2. Memahami informasi produk, komposisi, aturan pakai, dan peringatan.
3. Menyelesaikan pesanan melalui checkout tiga langkah yang ringkas.

---

## 2. Tujuan dan Metrik Keberhasilan

| Tujuan | Indikator MVP | Target awal |
|---|---|---:|
| Memudahkan penemuan produk | Pengguna dapat membuka produk dari homepage/katalog dengan maksimal 3 interaksi utama | ≥80% pada usability test |
| Panduan produk yang jelas | Setiap produk aktif memiliki informasi wajib dan peringatan yang relevan | 100% kelengkapan |
| Checkout mobile cepat | Pengguna dapat menyelesaikan checkout tanpa membuat akun | Median ≤3 menit pada usability test |
| Kinerja | LCP halaman katalog pada koneksi/perangkat uji yang disepakati | <2,5 detik; target internal katalog siap digunakan <2 detik |
| Keandalan transaksi | Pesanan tersimpan satu kali dan subtotal konsisten | Tidak ada duplikasi pada pengujian |

Target di atas adalah target awal yang perlu divalidasi, bukan klaim performa yang sudah tercapai.

---

## 3. Target Pengguna

### Segmen utama
- Pria dan wanita usia 30–55 tahun.
- Aktif menggunakan smartphone untuk mencari informasi dan berbelanja.
- Menginginkan pengalaman yang praktis, jelas, dan tidak membingungkan.
- Membutuhkan informasi produk yang transparan sebelum membeli.

### Kebutuhan pengguna
- Menemukan produk berdasarkan kategori atau sistem tubuh.
- Memahami kegunaan yang diklaim, komposisi, cara penggunaan, dan peringatan.
- Mengetahui harga, stok, dan biaya sebelum mengonfirmasi pesanan.
- Mengubah jumlah produk dan melihat subtotal secara langsung.
- Checkout tanpa proses registrasi yang menghambat.

### Asumsi yang perlu divalidasi
- Pengguna memahami istilah kategori sistem tubuh yang digunakan.
- Pengguna lebih nyaman checkout sebagai tamu.
- Informasi komposisi, legalitas, dan peringatan meningkatkan kepercayaan.
- Pengguna membutuhkan pencarian teks selain filter kategori.

---

## 4. Ruang Lingkup MVP

### In scope

1. Homepage dan banner promosi.
2. Navigasi kategori sistem tubuh.
3. Katalog produk berbentuk responsive grid.
4. Filter kategori dan pencarian nama produk.
5. Kartu produk dengan foto, nama, harga, kategori, dan status stok.
6. Halaman detail produk dan informasi ukuran/varian bila relevan.
7. Keranjang belanja: tambah, ubah jumlah, hapus, subtotal.
8. Checkout tiga langkah:
   - Data penerima dan alamat.
   - Pengiriman dan ringkasan biaya.
   - Konfirmasi pesanan.
9. Halaman konfirmasi pesanan dengan nomor pesanan.
10. Validasi form dan empty/error states.
11. Tampilan responsive dan aksesibilitas dasar.
12. Konten kebijakan, kontak, dan informasi keamanan produk yang diperlukan.

### Out of scope MVP

- Akun pelanggan, login, dan riwayat pesanan.
- Loyalty point, membership, referral, dan voucher kompleks.
- Ulasan/rating pengguna.
- Rekomendasi produk berbasis AI atau diagnosis keluhan.
- Chatbot konsultasi medis.
- Langganan/recurring order.
- Multi-vendor/marketplace.
- Aplikasi native Android/iOS.
- Integrasi ERP/warehouse kompleks.
- Dashboard analitik lanjutan.

**Catatan:** Pembayaran online dan integrasi kurir merupakan keputusan integrasi yang perlu ditetapkan sebelum implementasi. MVP minimal harus mendukung satu metode pembayaran yang benar-benar dapat diproses dan satu metode pengiriman/ongkir yang terdefinisi. Jika integrasi belum tersedia, gunakan alur manual yang transparan dan jangan menampilkan status pembayaran palsu.

---

## 5. Taksonomi Kategori

Kategori utama yang diminta:

1. Pencernaan
2. Peredaran Darah
3. Pernapasan
4. Perkemihan
5. Otak & Saraf
6. Reproduksi
7. Lainnya

Kategori adalah alat navigasi katalog, **bukan diagnosis, penetapan penyakit, atau jaminan bahwa produk dapat mengobati kondisi tertentu**.

Produk dapat memiliki satu kategori utama dan beberapa tag pendukung. Admin harus dapat mengelola kategori melalui data produk pada tahap MVP; jika belum ada panel admin, pengelolaan dilakukan melalui database/back office yang aman.

---

## 6. Struktur Informasi dan Navigasi

### Sitemap

- **Beranda**
  - Hero/banner
  - Jelajahi kategori
  - Produk pilihan
  - Keunggulan layanan/informasi kepercayaan
- **Katalog**
  - Pencarian
  - Filter kategori
  - Grid produk
- **Detail Produk**
  - Galeri foto
  - Nama dan harga
  - Stok/varian
  - Deskripsi dan informasi produk
  - Komposisi
  - Aturan penggunaan
  - Peringatan dan perhatian
  - Informasi izin edar bila berlaku
  - Tambah ke keranjang
- **Keranjang**
  - Daftar item
  - Kontrol kuantitas
  - Hapus item
  - Subtotal
  - Lanjut checkout
- **Checkout**
  - Langkah 1: Data penerima
  - Langkah 2: Pengiriman dan ringkasan
  - Langkah 3: Konfirmasi
- **Konfirmasi Pesanan**
  - Nomor pesanan
  - Ringkasan item dan total
  - Instruksi pembayaran/status berikutnya

Footer: Tentang, Kontak, Kebijakan Privasi, Syarat & Ketentuan, Kebijakan Pengiriman/Pengembalian, Disclaimer.

---

## 7. User Stories dan Acceptance Criteria

### US-01 — Menjelajahi homepage
**Sebagai** pengunjung, **saya ingin** melihat kategori dan produk pilihan agar dapat memulai pencarian dengan cepat.

Acceptance criteria:
- Homepage menampilkan hero/banner dengan CTA menuju katalog.
- Kategori utama dapat dipilih melalui tombol/link yang jelas.
- Produk pilihan menampilkan kartu produk yang konsisten.
- Banner tidak menghalangi konten atau memperlambat halaman secara berlebihan.

### US-02 — Melihat katalog
**Sebagai** pengunjung, **saya ingin** melihat produk dalam grid agar mudah membandingkan pilihan.

Acceptance criteria:
- Grid menyesuaikan lebar layar.
- Setiap kartu menampilkan foto, nama, harga, kategori, dan status stok.
- Produk habis menampilkan badge **“Habis”** dan tidak dapat ditambahkan ke keranjang.
- Harga ditampilkan dalam format Rupiah yang konsisten.

### US-03 — Mencari dan memfilter produk
Acceptance criteria:
- Pengguna dapat mencari berdasarkan nama produk.
- Pengguna dapat memfilter berdasarkan tujuh kategori sistem tubuh.
- Filter aktif terlihat dan dapat dihapus.
- Hasil kosong menampilkan pesan yang membantu dan opsi reset filter.
- Filter tidak menghapus kata pencarian tanpa tindakan pengguna.

### US-04 — Melihat detail produk
Acceptance criteria:
- Detail memuat foto, nama, harga, stok, deskripsi, komposisi, aturan penggunaan, peringatan, dan informasi legalitas yang relevan.
- Informasi ukuran/varian ditampilkan hanya jika produk memilikinya.
- Tombol tambah ke keranjang dinonaktifkan jika stok habis.
- Klaim manfaat harus sesuai bukti dan ketentuan yang berlaku.

### US-05 — Mengelola keranjang
Acceptance criteria:
- Pengguna dapat menambah item, mengubah kuantitas, dan menghapus item.
- Kuantitas tidak boleh kurang dari 1 atau melebihi stok tersedia.
- Subtotal diperbarui setiap kali jumlah berubah.
- Harga dan subtotal dihitung ulang di server saat checkout; nilai dari browser tidak dipercaya.
- Keranjang tetap tersedia saat pengguna berpindah halaman pada sesi yang sama.

### US-06 — Checkout tiga langkah
Acceptance criteria:
- Checkout dapat dilakukan tanpa membuat akun.
- Langkah 1 memvalidasi nama penerima, nomor telepon, alamat lengkap, kota/kabupaten, dan kode pos sesuai kebutuhan pengiriman.
- Langkah 2 menampilkan opsi pengiriman, ongkir, subtotal, dan total.
- Langkah 3 menampilkan ringkasan final sebelum pesanan dibuat.
- Tombol submit mencegah pesanan ganda (idempotency/double-submit protection).
- Error ditampilkan dekat field terkait dengan bahasa yang jelas dan instruksi perbaikan.
- Jika stok berubah sebelum order dibuat, pengguna diberi tahu dan diminta meninjau keranjang.

### US-07 — Konfirmasi pesanan
Acceptance criteria:
- Setelah order berhasil dibuat, tampilkan nomor pesanan.
- Tampilkan ringkasan produk, total, metode pembayaran, dan langkah berikutnya.
- Halaman konfirmasi tidak menyatakan pembayaran berhasil kecuali status sudah diverifikasi oleh penyedia pembayaran.
- Refresh halaman tidak membuat pesanan baru.

---

## 8. Aturan Bisnis

1. Produk hanya dapat dibeli jika status aktif dan stok mencukupi.
2. Produk habis tetap dapat dilihat, tetapi tidak dapat ditambahkan ke keranjang.
3. Subtotal = jumlah dari (harga produk × kuantitas).
4. Total = subtotal + ongkir - diskon yang valid (diskon dapat ditiadakan pada MVP).
5. Ongkir harus berasal dari tarif yang dikonfigurasi atau layanan pengiriman yang terintegrasi; jangan mengarang tarif.
6. Stok harus divalidasi ulang saat order dibuat.
7. Nomor pesanan harus unik.
8. Status pesanan minimal: `Menunggu Pembayaran`, `Diproses`, `Dikirim`, `Selesai`, `Dibatalkan`.
9. Status pembayaran minimal: `Belum Dibayar`, `Menunggu Verifikasi`, `Dibayar`, `Gagal/Kedaluwarsa`, `Dikembalikan` bila relevan.
10. Jangan mengurangi stok secara permanen sebelum titik transaksi yang ditetapkan dalam desain pembayaran; tetapkan mekanisme reservasi stok dan kedaluwarsanya.

---

## 9. Kebutuhan Konten dan Kepercayaan Produk

Setiap produk aktif wajib memiliki:
- Nama produk dan merek/produsen.
- Foto produk yang jelas dan tidak menyesatkan.
- Harga dan satuan/ukuran kemasan.
- Kategori utama.
- Deskripsi faktual.
- Komposisi/bahan.
- Aturan penggunaan sesuai label resmi.
- Peringatan, kontraindikasi, dan perhatian khusus bila tercantum/tersedia.
- Informasi izin edar/registrasi yang dapat diverifikasi bila diwajibkan.
- Informasi produsen/distributor dan tanggal kedaluwarsa/batch pada kemasan fisik sesuai ketentuan.

**Guardrail konten kesehatan:**
- Jangan menyebut produk sebagai obat atau mengklaim menyembuhkan penyakit jika status dan bukti/izin tidak mendukung.
- Jangan membuat diagnosis dari pilihan kategori atau keluhan pengguna.
- Jangan menyarankan penghentian obat dokter.
- Tampilkan anjuran untuk berkonsultasi dengan tenaga kesehatan, terutama untuk pengguna hamil/menyusui, anak, memiliki penyakit kronis, atau menggunakan obat rutin.
- Klaim, label, iklan, dan izin edar harus diperiksa terhadap ketentuan BPOM dan peraturan Indonesia yang berlaku sebelum produk dipublikasikan.

---

## 10. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Homepage dengan hero, CTA, kategori, produk pilihan | Must |
| FR-02 | Katalog responsive grid | Must |
| FR-03 | Pencarian nama produk | Must |
| FR-04 | Filter tujuh kategori | Must |
| FR-05 | Kartu produk dengan foto, nama, harga, kategori, stok | Must |
| FR-06 | Badge “Habis” dan blokir add-to-cart saat stok nol | Must |
| FR-07 | Detail produk dan informasi wajib | Must |
| FR-08 | Tambah/ubah/hapus item keranjang | Must |
| FR-09 | Subtotal dan total transparan | Must |
| FR-10 | Checkout tamu tiga langkah | Must |
| FR-11 | Validasi form yang jelas dan solutif | Must |
| FR-12 | Buat order dan tampilkan konfirmasi | Must |
| FR-13 | Integrasi satu metode pembayaran | Must untuk transaksi online |
| FR-14 | Satu metode pengiriman/aturan ongkir yang operasional | Must |
| FR-15 | Akun pelanggan dan riwayat pesanan | Later |
| FR-16 | Wishlist, review, voucher kompleks | Later |

---

## 11. Kebutuhan Non-Fungsional

### Responsive design
- Mobile-first; diuji minimal pada lebar 360 px, 390 px, 768 px, 1024 px, dan 1440 px.
- Tidak ada horizontal scroll pada viewport normal.
- Area sentuh tombol/link utama nyaman digunakan (target sekitar 44×44 px).

### Performance
- Target internal: katalog dapat digunakan dalam <2 detik pada perangkat/koneksi uji yang disepakati.
- Core Web Vitals ditargetkan berada pada rentang “Good”.
- Gunakan WebP/AVIF, ukuran gambar responsif, lazy loading untuk gambar di bawah fold, caching, dan pagination.
- Hindari library besar yang tidak diperlukan.

### Accessibility
- Kontras teks memenuhi WCAG 2.2 AA sejauh memungkinkan.
- Struktur heading semantik, label form, alt text gambar, focus state keyboard, dan pesan error yang dapat dibaca screen reader.
- Jangan menggunakan warna sebagai satu-satunya penanda status.

### Security & privacy
- HTTPS wajib.
- Validasi input di client dan server.
- Proteksi CSRF, XSS, SQL injection, rate limiting dasar, dan penyimpanan secret di konfigurasi server.
- Jangan menyimpan data kartu pembayaran.
- Batasi akses data pesanan dan informasi pribadi.
- Tampilkan kebijakan privasi dan tujuan penggunaan data.
- Terapkan retensi data seperlunya dan proses penghapusan sesuai kebijakan/hukum yang berlaku.

### Reliability
- Penanganan kegagalan jaringan dan payment callback.
- Pencegahan double-submit.
- Log error tanpa mengekspos data sensitif.
- Backup database terjadwal sesuai kemampuan hosting.

---

## 12. UX dan Visual Direction

### Prinsip desain
- Modern minimalist, Swiss-inspired grid, Japanese restraint.
- Fokus pada keterbacaan, whitespace, alignment, dan hierarki visual.
- Hindari ornamen dekoratif yang tidak membantu keputusan belanja.

### Design tokens awal

| Elemen | Arahan |
|---|---|
| Background | Putih / off-white |
| Primary text | Hitam arang |
| Secondary text | Abu-abu netral |
| Accent | Emerald green |
| Border | Abu-abu sangat muda |
| Typography | Sans-serif modern, ukuran nyaman untuk usia 30–55 |
| Product image | Bersih, konsisten, pencahayaan natural |
| Buttons | Kontras tinggi, label aksi spesifik |
| Radius | Kecil–sedang, konsisten |

### Contoh microcopy
- Hero: **“Pilihan herbal, lebih mudah dipahami.”**
- Subcopy: “Cari berdasarkan kategori, cek informasi produk, lalu pesan dengan praktis.”
- Search placeholder: “Cari nama produk…”
- Filter: “Pilih kategori”
- Add to cart: “Tambah ke keranjang”
- Empty cart: “Keranjangmu masih kosong. Yuk, temukan produk yang kamu cari.”
- Out of stock: “Habis”
- Validation: “Nomor WhatsApp belum lengkap. Periksa kembali, ya.”

Hindari copywriting yang menakut-nakuti, menjanjikan hasil medis, atau menekan pengguna untuk membeli.

---

## 13. Data Model Konseptual

### Product
- `id`
- `slug`
- `name`
- `brand`
- `description`
- `price`
- `stock`
- `category_id`
- `image_url`
- `package_size`
- `composition`
- `usage_instruction`
- `warnings`
- `registration_number`
- `is_active`
- `created_at`, `updated_at`

### Category
- `id`
- `name`
- `slug`
- `description`
- `sort_order`
- `is_active`

### Cart (session-based MVP)
- `session_id`
- `product_id`
- `quantity`

### Order
- `id`
- `order_number`
- `customer_name`
- `phone`
- `address`
- `city`
- `postal_code`
- `shipping_method`
- `shipping_cost`
- `subtotal`
- `total`
- `order_status`
- `payment_status`
- `created_at`

### Order Item
- `id`
- `order_id`
- `product_id`
- `product_name_snapshot`
- `unit_price_snapshot`
- `quantity`
- `line_total`

Simpan snapshot nama dan harga pada item pesanan agar invoice historis tidak berubah ketika data produk diperbarui.

---

## 14. Analitik MVP

Event minimum:
- `view_home`
- `view_catalog`
- `search_product`
- `filter_category`
- `view_product`
- `add_to_cart`
- `remove_from_cart`
- `begin_checkout`
- `checkout_step_completed`
- `order_created`
- `payment_status_updated`

KPI yang dipantau:
- Rasio katalog ke detail produk.
- Add-to-cart rate.
- Cart abandonment.
- Checkout completion rate.
- Waktu median checkout.
- Produk paling sering dicari dan kategori paling sering dipilih.
- Persentase produk dengan informasi wajib lengkap.

Gunakan analytics dengan memperhatikan persetujuan dan kebijakan privasi. Jangan mengirim data kesehatan sensitif ke analytics.

---

## 15. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Klaim manfaat berlebihan/tidak sesuai izin | Risiko hukum dan hilangnya kepercayaan | Review konten dan legalitas sebelum publikasi |
| Informasi produk tidak lengkap | Pengguna ragu atau salah menggunakan produk | Wajibkan field konten minimum |
| Stok tidak sinkron | Pesanan gagal/overselling | Validasi stok server saat order |
| Checkout terlalu panjang | Pengguna batal membeli | Guest checkout, tiga langkah, field minimum |
| Ongkir/pembayaran tidak jelas | Komplain dan order tidak selesai | Tampilkan biaya dan status secara transparan |
| Gambar besar | Halaman lambat | Optimasi format, dimensi, dan lazy loading |
| Data pribadi bocor | Kerugian pengguna dan bisnis | HTTPS, kontrol akses, validasi, dan minimisasi data |

---

## 16. Definition of Done MVP

MVP dapat dirilis ketika:
- Seluruh fitur Must berjalan pada mobile, tablet, dan desktop.
- Katalog, filter, pencarian, detail, keranjang, dan checkout telah diuji.
- Produk habis tidak bisa dibeli.
- Perhitungan harga dan stok divalidasi server-side.
- Order tidak terduplikasi saat tombol ditekan berulang atau halaman di-refresh.
- Satu alur pembayaran dan pengiriman telah diuji end-to-end, atau alur manual dijelaskan secara eksplisit.
- Semua produk yang dipublikasikan memiliki konten wajib dan review kepatuhan.
- Tidak ada bug kritis pada alur pembelian.
- Kebijakan privasi, syarat, pengiriman, dan pengembalian tersedia.
- Pengujian usability dasar dilakukan kepada calon pengguna dari segmen target.

---

## 17. Pertanyaan Keputusan Sebelum Development

1. Apakah pembayaran MVP menggunakan payment gateway (misalnya satu penyedia) atau transfer manual?
2. Apakah ongkir memakai integrasi agregator kurir atau tarif tetap/manual?
3. Siapa yang mengelola produk, stok, kategori, dan pesanan? Apakah perlu admin panel sederhana sejak MVP?
4. Apakah produk yang dijual memiliki izin edar/registrasi yang sesuai dan dokumentasi klaim?
5. Apakah “size guide” berarti ukuran kemasan/varian produk? Untuk herbal, tampilkan sebagai **Informasi Kemasan & Varian** bila lebih tepat.

**Rekomendasi PM:** jangan mulai dari fitur tambahan. Validasi dulu alur inti: temukan produk → pahami informasi → tambah ke keranjang → checkout → order tercatat. Kejelasan konten dan transaksi lebih penting daripada animasi atau personalisasi pada MVP.
