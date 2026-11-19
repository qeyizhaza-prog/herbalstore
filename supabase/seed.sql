-- ==============================================================================
-- HerbalStore - Supabase Seed Data Script
-- Populates initial categories, 8 BPOM products, variants, and seed order
-- ==============================================================================

-- 1. Insert Categories
insert into public.categories (slug, name, short_desc, description, badge_class, icon_bg_class, icon_text_class, sort_order)
values
('pencernaan', 'Pencernaan', 'Lambung & Usus', 'Pilihan herbal tradisional untuk membantu kenyamanan lambung, nafsu makan, dan fungsi pencernaan.', 'bg-emerald-50 text-emerald-700 border-emerald-200', 'bg-emerald-100/70', 'text-emerald-700', 1),
('darah', 'Peredaran Darah', 'Jantung & Tensi', 'Ekstrak tanaman alami yang mendukung sirkulasi darah serta kebugaran pembuluh darah harian.', 'bg-rose-50 text-rose-700 border-rose-200', 'bg-rose-100/70', 'text-rose-600', 2),
('pernapasan', 'Pernapasan', 'Paru & Tenggorokan', 'Ramuan madu dan rimpang hangat untuk membantu melegakan tenggorokan dan saluran napas.', 'bg-cyan-50 text-cyan-700 border-cyan-200', 'bg-cyan-100/70', 'text-cyan-700', 3),
('perkemihan', 'Perkemihan', 'Ginjal & Saluran Kemih', 'Daun herbal diuretik alami untuk membantu memelihara kelancaran buang air kecil.', 'bg-amber-50 text-amber-700 border-amber-200', 'bg-amber-100/70', 'text-amber-700', 4),
('otak', 'Otak & Saraf', 'Fokus & Kualitas Tidur', 'Herbal adaptogenik dan seduhan daun untuk mendukung fokus kerja dan relaksasi alami.', 'bg-indigo-50 text-indigo-700 border-indigo-200', 'bg-indigo-100/70', 'text-indigo-700', 5),
('reproduksi', 'Reproduksi', 'Vitalitas & Hormonal', 'Ekstrak akar pilihan terstandar untuk menunjang stamina dan kebugaran dewasa.', 'bg-purple-50 text-purple-700 border-purple-200', 'bg-purple-100/70', 'text-purple-700', 6),
('lainnya', 'Lainnya', 'Imunitas & Sendi', 'Nutrisi nabati tinggi antioksidan untuk memelihara daya tahan tubuh dan kesehatan sendi.', 'bg-teal-50 text-teal-700 border-teal-200', 'bg-teal-100/70', 'text-teal-800', 7)
on conflict (slug) do update set
    name = excluded.name,
    short_desc = excluded.short_desc,
    description = excluded.description;

-- 2. Insert Products
insert into public.products (id, slug, name, brand, category_slug, category_label, short_benefit, description, price, stock, package_size, registration_number, image, composition, usage_instruction, warnings, storage, batch_code, expiry_date)
values
(
    1,
    'kapsul-ekstrak-temulawak-organik',
    'Kapsul Ekstrak Temulawak Organik',
    'Sari Tani Nusantara',
    'pencernaan',
    'Pencernaan',
    'Membantu menjaga fungsi hati & saluran cerna',
    'Diformulasikan dari rimpang Curcuma xanthorrhiza organik pilihan yang diekstrak secara higienis pada suhu terkendali untuk menjaga kandungan kurkuminoid dan xanthorrhizol alami. Cocok untuk pendamping pola makan teratur dan kebugaran fungsi hati.',
    78000,
    36,
    '60 Kapsul',
    'BPOM TR203348111',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD40sHE1PkN_MJVGNe-TWK-pQMQ2m6CctFjfk8RY8DGkScVPVVUsOzq_6aMUXXThkQrS8Q69itID22XJfe11AzTKk-z0TCLra0xTLHqEOr5djP8HMm0jRgmg3Soxe9HPIvceUf39f7FMXCHCIcCVRQQrAIKmXdD_RpdvRKwFuDy7qVpBkQ445I9e5FixdAM_u4LXwgT8GYTTlLPF_zqjYXn2wmnBGGwnfCSdRQxNwo',
    '["Curcuma xanthorrhiza Rhizoma Extract (Temulawak) 450 mg", "Kapsul nabati HPMC halal bebas gelatin hewani"]'::jsonb,
    'Dewasa: 2 kali sehari 1–2 kapsul setelah makan dengan air hangat.',
    'Hati-hati bagi penderita penyumbatan saluran empedu atau gangguan hati akut. Konsultasikan dengan dokter apabila sedang mengonsumsi obat pengencer darah.',
    'Simpan di tempat sejuk dan kering (di bawah 30°C), terlindung dari sinar matahari langsung.',
    'TML-2610-A4',
    'Oktober 2028'
),
(
    2,
    'minyak-habbatussauda-nigella-sativa',
    'Minyak Habbatussauda Nigella Sativa',
    'HabbaMedica Indonesia',
    'darah',
    'Peredaran Darah',
    'Membantu sirkulasi darah & stamina tubuh',
    'Minyak biji jintan hitam (Nigella sativa) murni yang diproses melalui metode peras dingin (cold-pressed) pertama tanpa pelarut kimia, dikemas dalam kapsul lunak kedap udara agar aroma dan kandungan thymoquinone tetap stabil.',
    115000,
    27,
    '100 Kapsul',
    'BPOM TR182312001',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDLt2wrQSRBq8HLe2kXNntsPiEVQ3wPHRHFC0oVF8vtFvTazf3Anp42fzvLdQXDhsK0cLNeiEeTk2-1vIq-CVFNqL65HCXFePTC4axB2BD6LYWakanes5Vps6QVLKSM6bLAkKPma_w2zfdVBEhLCYT5Pc25VLP7iGeAdwwffTD0aTnf6fDYY6fUe3dlvIVJWs4Uom7DWiXQQPeZ6HJdL4cZLrr1IuFA6INv2R6Fl8M',
    '["Oleum Nigella sativa Semen (Minyak Jintan Hitam Cold-Pressed) 500 mg", "Cangkang kapsul lunak halal"]'::jsonb,
    'Dewasa: 2 kapsul lunak per hari, diminum 30 menit sebelum atau sesudah makan.',
    'Tidak dianjurkan untuk ibu hamil. Bagi pengguna obat penurun tekanan darah atau pengatur gula darah rutin, harap beri jeda 2 jam dan konsultasikan ke tenaga kesehatan.',
    'Tutup rapat botol setelah digunakan dan simpan pada suhu ruang.',
    'HBS-2609-C2',
    'September 2028'
),
(
    3,
    'madu-randu-ekstrak-jahe-merah',
    'Madu Randu Ekstrak Jahe Merah',
    'Apiari Merapi',
    'pernapasan',
    'Pernapasan',
    'Melegakan tenggorokan & menghangatkan dada',
    'Perpaduan madu bunga randu mentah (raw honey) dengan infusi ekstrak jahe merah (Zingiber officinale var. rubrum) serta daun mint alami. Memberikan sensasi hangat lembut di tenggorokan tanpa pemanis buatan atau pengawet.',
    89000,
    56,
    'Kemasan Botol 350 gr',
    'P-IRT 2093310010452-27',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD5RV3IqTOBgIq4IK1GakkuKIf90_FU9Kxu5xmE8eQr5pkbw4zNehxmH3uindIcvzLV_UbtKLLvGhQnJQAscpxEhFPb2m1Ctty0TUjhgh9JpE9yMjIyvGdYiJoP7XTtJk-ELuoYUJpDWv8aLeUKzaC7wgre9E0Y-_b71cKree3kKFxRyYWHK7rRWI99ZqRt6WiOy1k19NkyqBIHr2lm-h0S-hoX7KHC3rm0o9H89KE',
    '["Madu Randu Murni 85%", "Ekstrak Jahe Merah (Zingiber officinale) 12%", "Ekstrak Daun Mint & Adas Manis 3%"]'::jsonb,
    '1–2 sendok makan langsung atau diseduh dengan 150 ml air hangat (bukan air mendidih).',
    'Tidak diberikan kepada bayi di bawah usia 1 tahun. Penderita diabetes atau lambung sensitif sebaiknya memantau asupan harian.',
    'Simpan di suhu ruang, tidak perlu masuk kulkas agar madu tidak mengkristal.',
    'MRJ-2611-B1',
    'November 2028'
),
(
    4,
    'teh-daun-pegagan-centella',
    'Teh Daun Pegagan (Centella)',
    'Kebun Tawangmangu',
    'otak',
    'Otak & Saraf',
    'Membantu konsentrasi & relaksasi alami',
    'Seduhan herbal bebas kafein dari daun pegagan (Centella asiatica) yang dikeringkan secara alami di ruang teduh. Membantu menjaga kejernihan fokus saat bekerja dan memberi rasa tenang di sore atau malam hari.',
    45000,
    12,
    '25 Kantong Teh',
    'P-IRT 5103313020118-26',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAWb23mMkb5AX0SR13t2G9z_FiBkF7YVkaOeFN698STIgIXCBc4us46EFvrAKjDqF1SrMQgEGrx6PyeHHjw9jQmZmD7oQGBEJ5LqwzsTAVMoTrrgI8miQpgR3KdGQeYihUYmDSZBxTB10y6SkF4lc_FEb3tjcKAwv4_zJZpNQhrQIv90rF9xpPvQO8dacktbNPxWwWbGAjMEJxn1f08qRZWTxVqiiN_K-SaXK4kYxY',
    '["100% Daun Pegagan Kering (Centella asiatica Herba) 2 gr per kantong"]'::jsonb,
    'Seduh 1 kantong teh dalam 200 ml air panas selama 4–5 menit. Maksimal 2 cangkir sehari.',
    'Hentikan konsumsi 2 minggu sebelum tindakan operasi. Tidak disarankan dikonsumsi terus-menerus lebih dari 6 minggu tanpa jeda.',
    'Simpan dalam wadah kedap udara agar aroma daun tetap segar.',
    'PGG-2608-D7',
    'Agustus 2027'
),
(
    5,
    'ekstrak-kumis-kucing-folium',
    'Ekstrak Kumis Kucing Folium',
    'HerbaFit Indonesia',
    'perkemihan',
    'Perkemihan',
    'Membantu melancarkan buang air kecil',
    'Ekstrak daun kumis kucing (Orthosiphon aristatus) terstandar yang secara tradisional digunakan untuk membantu memelihara kesehatan saluran kemih dan melancarkan pembuangan cairan tubuh.',
    65000,
    0,
    '60 Kapsul',
    'BPOM TR192329881',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDh8chF5jRML3vj0E8dSavtIY62wA-yAf_LcuZ4TEnw3OBoMu3iJy1P4dmOGeDgL3S6aZZtItgvssbMsZmJ5grkLp0eBuvyHIHtKOIQMgFmUwkzf73kOynS6g59N-jZD8aNh0W00vT2myuqBAVeyW28fIhMZDc5NvdeOpcGFPPfjvTntUf0RwQ3sLaBGTBCeROZWWDNETGxgxD7_uy-P_93tdr8UTECnkYXVH8cjfM',
    '["Orthosiphon aristatus Folium Extract 400 mg"]'::jsonb,
    'Dewasa: 2 kali sehari 1 kapsul, disertai minum air putih minimal 2 liter per hari.',
    'Tidak dianjurkan untuk penderita gagal ginjal berat atau kondisi retensi cairan akibat gangguan jantung tanpa pengawasan dokter.',
    'Simpan di tempat kering pada suhu di bawah 30°C.',
    'KMK-2606-E1',
    'Juni 2028'
),
(
    6,
    'kunyit-asam-herbal-organik',
    'Kunyit Asam Herbal Organik',
    'Jamu Lestari Solo',
    'pencernaan',
    'Pencernaan',
    'Meringankan rasa kembung & nyaman di perut',
    'Minuman serbuk instan berbahan kunyit segar, asam jawa pilihan, dan gula aren organik tanpa pewarna maupun perisa sintetis. Praktis diseduh hangat atau dingin untuk menyegarkan tubuh dan mengurangi rasa begah.',
    35000,
    50,
    '10 Sachet @20gr',
    'P-IRT 2133372010891-26',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAd4ZMjjMmXqnfpm7D09BVuLX8SpC2lBE2jDmBNy0chJiJCAo0qcPN_np45pO_QSR04h9q-VNcdFeYmQFISpsSXsA4M_j0cGETYpN1920ZB1cJ9gReFfFlJlf0EQykmb_p8KTKKm2mL8RhDoMBxfTsETmjLuWrmxSa75kuGJdW95wVQ7GqhKFllJ2V8Mix-q7mkhesx8rXNr0YvIWoI_3N5guoqqnfo-PBe8yZqw3w',
    '["Ekstrak Kunyit Segar (Curcuma domestica) 45%", "Sari Asam Jawa (Tamarindus indica) 20%", "Gula Aren Organik & Sejumput Garam Laut 35%"]'::jsonb,
    'Larutkan 1 sachet ke dalam 150 ml air hangat atau dingin, aduk rata sebelum diminum.',
    'Konsumsi secukupnya bagi penderita maag kronis; sebaiknya diminum setelah makan.',
    'Simpan kotak di tempat kering dan terhindar dari kelembapan.',
    'KNY-2610-F9',
    'Oktober 2027'
),
(
    7,
    'kapsul-akar-purwoceng-pilihan',
    'Kapsul Akar Purwoceng Pilihan',
    'Dieng Botanical',
    'reproduksi',
    'Reproduksi',
    'Menunjang stamina pria dewasa secara alami',
    'Mengandung ekstrak akar purwoceng (Pimpinella pruatjan) dataran tinggi Dieng yang dipadukan dengan ekstrak jahe kering untuk membantu menjaga vitalitas, stamina kerja, dan kehangatan tubuh pria dewasa.',
    95000,
    15,
    '50 Kapsul',
    'BPOM TR173305411',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAKXlIuNtWtDk07ZKSvq8fnHQn1fUeHobKF157IMzXF_-h1IGPu9WLtUXekncNpZD61I0uK6Qpn4xxhnQf9llNPzqH02VkRFj2QC86zVgxSTGKjO_1VXTcdbB767c-r_HcSpvNWHBNy7YaY9qwptE1JJdsdRQ8ndSOkaTry1gMAAmOQxeR9O2sz2t9yAT71q7cHnZbwRK7wnOMxt-DB6IR3vcfeGZWND8ByRlJvLpc',
    '["Pimpinella pruatjan Radix Extract (Purwoceng) 350 mg", "Zingiber officinale Rhizoma Extract 100 mg"]'::jsonb,
    'Pria dewasa: 1 kapsul 2 kali sehari setelah makan.',
    'Tidak untuk anak-anak, wanita hamil, atau penderita hipertensi tidak terkontrol. Tidak mengandung bahan kimia obat (BKO).',
    'Simpan pada suhu sejuk di bawah 30°C dan jauhkan dari jangkauan anak-anak.',
    'PWC-2609-A3',
    'September 2028'
),
(
    8,
    'moringa-oleifera-daun-kelor',
    'Moringa Oleifera (Daun Kelor)',
    'Nusa Hijau Organik',
    'lainnya',
    'Lainnya',
    'Antioksidan tinggi & pemelihara daya tahan',
    'Serbuk mikronisasi daun kelor (Moringa oleifera) organik tanpa tangkai, kaya fitonutrien nabati, vitamin alami, dan antioksidan untuk membantu memelihara kebugaran harian serta daya tahan tubuh.',
    52000,
    30,
    '60 Kapsul',
    'BPOM TR193333831',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAxQNIT7YIwRACKGyPRYb6uMklMLh4MVEanf4fL25OR9lYdKOj_jEUkHekkEV4jqYFkvvkMYBvAVwjRhRJE8V9gPQtH1YNIfvp5WTTU3fqf065JvAPM1ikzIZ0-IvH0AwAyWYwK6oG0rGqaommYdjWLLH9LHgn2v-XvlKIfV5b3-w3hopOwSM1Y356Pflz1pB_QnTm1d_0VoljRDLzdXdGIiEmJUKK88HSgVnMEO_E',
    '["100% Moringa oleifera Folium Powder 500 mg (Kapsul Nabati)"]'::jsonb,
    'Dewasa: 2 kali sehari 2 kapsul sesudah makan.',
    'Pengguna obat tiroid atau pengatur gula darah dianjurkan berkonsultasi dengan dokter sebelum konsumsi rutin.',
    'Simpan di tempat sejuk dan kering, hindari paparan panas berlebih.',
    'MRG-2610-K8',
    'Oktober 2028'
)
on conflict (id) do update set
    name = excluded.name,
    price = excluded.price,
    stock = excluded.stock,
    composition = excluded.composition;

-- Reset sequence to 9
select setval(pg_get_serial_sequence('public.products', 'id'), 8);

-- 3. Insert Product Variants
insert into public.product_variants (id, product_id, label, price, stock)
values
('1-60', 1, 'Botol 60 Kapsul', 78000, 24),
('1-120', 1, 'Botol 120 Kapsul', 145000, 12),
('2-100', 2, 'Botol 100 Kapsul', 115000, 18),
('2-200', 2, 'Botol 200 Kapsul', 215000, 9),
('3-350', 3, 'Botol Kaca 350 gr', 89000, 40),
('3-650', 3, 'Botol Kaca 650 gr', 162000, 16)
on conflict (id) do update set
    label = excluded.label,
    price = excluded.price,
    stock = excluded.stock;

-- 4. Insert Seed Order
insert into public.orders (
    order_number,
    created_at_label,
    status,
    payment_status,
    payment_method,
    va_number,
    shipping_method,
    courier_name,
    awb_number,
    estimated_arrival,
    driver_name,
    driver_hub,
    driver_phone,
    delivery_instruction,
    customer_name,
    phone,
    address,
    city,
    postal_code,
    subtotal,
    shipping_cost,
    discount,
    total,
    last_synced_label
)
values (
    '#HBS-20261118-8492',
    '18 Nov 2026, 14:32 WIB',
    'Dalam Pengiriman Ekspedisi',
    'Dibayar',
    'qris',
    '8271 0812 3456 7890',
    'regular',
    'SiCepat Reguler Higienis',
    'HBS8829103948ID',
    'Besok, 19 Nov (15:00 - 18:00)',
    'Rian Firmansyah',
    'SiCepat Delivery Hub Bandung Barat',
    '+62 813-9821-44xx',
    'Titip sekuriti pos gerbang jika tidak ada orang di rumah.',
    'Budi Pratama',
    '0812-3456-7890',
    'Jl. Anggrek Cendrawasih No. 24, Sukajadi',
    'Kota Bandung, Jawa Barat',
    '40161',
    282000,
    0,
    0,
    282000,
    'Sinkronisasi live 5 mnt lalu'
)
on conflict (order_number) do nothing;

-- 5. Insert Seed Order Items
insert into public.order_items (order_number, product_id, product_name, variant_label, registration_number, unit_price, quantity, line_total, image)
values
('#HBS-20261118-8492', 1, 'Kapsul Ekstrak Temulawak Organik', '60 Kapsul', 'BPOM TR203348111', 78000, 1, 78000, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD40sHE1PkN_MJVGNe-TWK-pQMQ2m6CctFjfk8RY8DGkScVPVVUsOzq_6aMUXXThkQrS8Q69itID22XJfe11AzTKk-z0TCLra0xTLHqEOr5djP8HMm0jRgmg3Soxe9HPIvceUf39f7FMXCHCIcCVRQQrAIKmXdD_RpdvRKwFuDy7qVpBkQ445I9e5FixdAM_u4LXwgT8GYTTlLPF_zqjYXn2wmnBGGwnfCSdRQxNwo'),
('#HBS-20261118-8492', 2, 'Minyak Habbatussauda Nigella Sativa', '100 Kapsul', 'BPOM TR182312001', 115000, 1, 115000, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLt2wrQSRBq8HLe2kXNntsPiEVQ3wPHRHFC0oVF8vtFvTazf3Anp42fzvLdQXDhsK0cLNeiEeTk2-1vIq-CVFNqL65HCXFePTC4axB2BD6LYWakanes5Vps6QVLKSM6bLAkKPma_w2zfdVBEhLCYT5Pc25VLP7iGeAdwwffTD0aTnf6fDYY6fUe3dlvIVJWs4Uom7DWiXQQPeZ6HJdL4cZLrr1IuFA6INv2R6Fl8M'),
('#HBS-20261118-8492', 3, 'Madu Randu Ekstrak Jahe Merah', 'Kemasan Botol 350 gr', 'P-IRT', 89000, 1, 89000, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5RV3IqTOBgIq4IK1GakkuKIf90_FU9Kxu5xmE8eQr5pkbw4zNehxmH3uindIcvzLV_UbtKLLvGhQnJQAscpxEhFPb2m1Ctty0TUjhgh9JpE9yMjIyvGdYiJoP7XTtJk-ELuoYUJpDWv8aLeUKzaC7wgre9E0Y-_b71cKree3kKFxRyYWHK7rRWI99ZqRt6WiOy1k19NkyqBIHr2lm-h0S-hoX7KHC3rm0o9H89KE')
on conflict do nothing;

-- 6. Insert Seed Order Milestones
insert into public.order_milestones (id, order_number, title, timestamp, description, completed, active, sort_order)
values
('m5', '#HBS-20261118-8492', 'Sedang Dibawa Kurir Menuju Alamat Penerima (Out for Delivery)', '19 Nov, 08:30 WIB', 'Paket sedang dalam perjalanan ke alamat tujuan. Kurir Rian Firmansyah mengendarai motor berpendingin untuk menjaga integritas produk herbal.', true, true, 5),
('m4', '#HBS-20261118-8492', 'Tiba di Sorting Center Hub Logistik Bandung', '18 Nov, 21:10 WIB', 'Paket telah diproses melalui jalur scanning otomatis dan dialokasikan ke armada kurir wilayah Sukajadi.', true, false, 4),
('m3', '#HBS-20261118-8492', 'Diserahkan ke Kurir Ekspedisi (Drop Point Bandung Sukajadi)', '18 Nov, 17:20 WIB', 'Paket telah diterima oleh agen ekspedisi dengan nomor AWB HBS8829103948ID.', true, false, 3),
('m2', '#HBS-20261118-8492', 'Dikemas Higienis dengan Bubble Wrap & Segel Khusus Herbal', '18 Nov, 15:45 WIB', 'Gudang Pusat HerbalStore Bandung telah selesai melakukan quality check nomor batch, segel botol, dan kemasan kedap suhu.', true, false, 2),
('m1', '#HBS-20261118-8492', 'Pesanan Berhasil Dibuat & Terverifikasi', '18 Nov, 14:32 WIB', 'Pembayaran terkonfirmasi via QRIS Instant. Sistem meneruskan pesanan ke staf farmasi gudang.', true, false, 1)
on conflict (id) do nothing;
