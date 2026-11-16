import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Droplets,
  Flower,
  HeartPulse,
  Info,
  Layers,
  Leaf,
  PackageCheck,
  Plus,
  SearchX,
  Shield,
  ShieldCheck,
  Slash,
  Sparkles,
  Truck,
  Utensils,
  Wind,
  X,
} from 'lucide-react';
import { CATEGORIES, HERO_IMAGE } from '../data/catalog.ts';
import type { CategorySlug, Product } from '../types/herbal.ts';
import { formatRupiah } from '../utils/format.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface HomeStorefrontProps {
  products: Product[];
  activeCategory: CategorySlug | 'all';
  searchQuery: string;
  onSelectCategory: (category: CategorySlug | 'all') => void;
  onClearSearch: () => void;
  onResetFilters: () => void;
  onAddToCart: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
  onCopyPromoCode: (code: string) => void;
}

function CategoryIcon({ slug, className }: { slug: CategorySlug; className?: string }) {
  switch (slug) {
    case 'pencernaan':
      return <Utensils className={className} />;
    case 'darah':
      return <HeartPulse className={className} />;
    case 'pernapasan':
      return <Wind className={className} />;
    case 'perkemihan':
      return <Droplets className={className} />;
    case 'otak':
      return <Sparkles className={className} />;
    case 'reproduksi':
      return <Flower className={className} />;
    case 'lainnya':
      return <Shield className={className} />;
  }
}

export function HomeStorefront({
  products,
  activeCategory,
  searchQuery,
  onSelectCategory,
  onClearSearch,
  onResetFilters,
  onAddToCart,
  onOpenProduct,
  onCopyPromoCode,
}: HomeStorefrontProps) {
  const normalizedQuery = searchQuery.toLowerCase().trim();
  const filteredProducts = products.filter((item) => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch =
      !normalizedQuery ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.shortBenefit.toLowerCase().includes(normalizedQuery) ||
      item.categoryLabel.toLowerCase().includes(normalizedQuery);
    return matchCategory && matchSearch;
  });

  const activeCategoryObj =
    activeCategory !== 'all' ? CATEGORIES.find((c) => c.slug === activeCategory) : undefined;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#EDF5F1] via-[#F4F9F6] to-surface-base pt-8 pb-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-herbal-100/90 border border-herbal-200 text-herbal-800 text-xs font-semibold tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-herbal-600" />
                Formulasi Teruji &amp; Transparan
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11241C] tracking-tight leading-tight text-balance">
                Pilihan Herbal Alami,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-herbal-700 via-herbal-600 to-teal-600">
                  Lebih Mudah Dipahami.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Temukan suplemen &amp; ekstrak tanaman obat terpercaya berdasarkan kebutuhan sistem
                tubuh. Belanja aman tanpa janji berlebihan, lengkap dengan informasi aturan pakai
                dan izin edar resmi.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => scrollToSection('katalog')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-herbal-600 hover:bg-herbal-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-herbal-600/20 transition duration-200 flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <span>Jelajahi Katalog Produk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('kategori')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition duration-200 flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
                >
                  <Layers className="w-4 h-4 text-herbal-600" />
                  <span>Cek Berdasarkan Sistem Tubuh</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200/80 max-w-xl mx-auto lg:mx-0">
                <p className="text-xs text-slate-500 flex items-center justify-center lg:justify-start gap-2">
                  <Info className="w-3.5 h-3.5 text-herbal-600 shrink-0" />
                  Bukan pengganti diagnosis dokter. Selalu baca anjuran pakai di kemasan.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-slate-100 p-3">
                  <ResilientImage
                    src={HERO_IMAGE}
                    alt="Koleksi Herbal Alami dan Rempah Tradisional"
                    loading="eager"
                    className="w-full h-76 sm:h-92 object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/92 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-herbal-700 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          100% Bahan Nabati
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          Bebas Bahan Kimia Obat (BKO)
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-herbal-700 bg-herbal-50 px-2.5 py-1 rounded-md border border-herbal-200 shrink-0">
                      Grade A
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4-column Trust Badges Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-white rounded-2xl border border-surface-border shadow-xs">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-herbal-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Terdaftar BPOM</h2>
                <p className="text-xs text-slate-500">Izin edar resmi &amp; terverifikasi</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Kemas Higienis</h2>
                <p className="text-xs text-slate-500">Segel aluminium &amp; silica gel</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Pengiriman Cepat</h2>
                <p className="text-xs text-slate-500">Ready stock dikirim di hari sama</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Informasi Faktual</h2>
                <p className="text-xs text-slate-500">Panduan aturan &amp; batas minum</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body System Categories */}
      <section className="py-14 bg-white border-y border-surface-border" id="kategori">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-herbal-600 uppercase tracking-wider mb-1">
                <Activity className="w-3.5 h-3.5" />
                Taksonomi Sistem Tubuh
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-herbal-dark">
                Jelajahi Berdasarkan Sistem Tubuh
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Navigasi katalog herbal sesuai fungsi organ. Bukan diagnosis medis melainkan
                kategori pendukung kebugaran harian.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                scrollToSection('katalog');
              }}
              className="text-xs font-semibold text-herbal-700 hover:text-herbal-800 flex items-center gap-1 transition self-start md:self-auto whitespace-nowrap"
            >
              Lihat Semua Kategori
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    scrollToSection('katalog');
                  }}
                  className={`group flex flex-col items-center p-4 rounded-2xl border transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-herbal-500 ${
                    isSelected
                      ? 'bg-herbal-50 border-herbal-500 ring-2 ring-herbal-600'
                      : 'border-slate-200/80 bg-surface-base hover:bg-herbal-50 hover:border-herbal-300'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${cat.iconBgClass} ${cat.iconTextClass} group-hover:scale-105 flex items-center justify-center transition-transform mb-2`}
                  >
                    <CategoryIcon slug={cat.slug} className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-xs text-slate-800 group-hover:text-herbal-800">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{cat.shortDesc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="py-14" id="katalog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Katalog Pilihan Herbal
                </h2>
                <p className="text-sm text-slate-500">
                  Pilih produk terverifikasi dengan komposisi jelas dan batas penggunaan tertera.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(activeCategory !== 'all' || normalizedQuery) && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reset Filter
                  </button>
                )}
                <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 tabular-nums">
                  Menampilkan <span className="font-bold text-herbal-700">{filteredProducts.length}</span>{' '}
                  produk
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition shrink-0 ${
                  activeCategory === 'all'
                    ? 'bg-herbal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Semua Produk
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition shrink-0 ${
                    activeCategory === cat.slug
                      ? 'bg-herbal-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name === 'Lainnya' ? 'Lainnya / Imunitas' : cat.name}
                </button>
              ))}
            </div>

            {/* Active Filter Indicators (US-03) */}
            {(activeCategoryObj || normalizedQuery) && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="text-slate-400">Filter aktif:</span>
                {activeCategoryObj && (
                  <button
                    type="button"
                    onClick={() => onSelectCategory('all')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-herbal-50 text-herbal-800 border border-herbal-200 font-medium hover:bg-herbal-100 transition"
                  >
                    <span>Kategori: {activeCategoryObj.name}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {normalizedQuery && (
                  <button
                    type="button"
                    onClick={onClearSearch}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-medium hover:bg-slate-200 transition"
                  >
                    <span>Pencarian: &ldquo;{searchQuery}&rdquo;</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const catStyle =
                  CATEGORIES.find((c) => c.slug === product.category)?.badgeClass ||
                  'bg-herbal-50 text-herbal-700 border-herbal-200';
                const outOfStock = product.stock <= 0;

                return (
                  <article
                    key={product.id}
                    className={`bg-white rounded-2xl border border-surface-border p-3.5 sm:p-4 flex flex-col justify-between transition duration-200 ${
                      outOfStock
                        ? 'opacity-85 hover:opacity-100'
                        : 'hover:shadow-md hover:border-herbal-200 hover:-translate-y-0.5'
                    }`}
                  >
                    <div>
                      <button
                        type="button"
                        onClick={() => onOpenProduct(product)}
                        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-herbal-600 rounded-xl"
                      >
                        <div className="relative bg-slate-50 rounded-xl overflow-hidden mb-3 aspect-square flex items-center justify-center p-2">
                          <span
                            className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded border ${catStyle}`}
                          >
                            {product.categoryLabel}
                          </span>
                          {outOfStock && (
                            <span className="absolute inset-0 z-10 bg-slate-900/45 backdrop-blur-[1px] flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                              Stok Habis
                            </span>
                          )}
                          <ResilientImage
                            src={product.image}
                            alt={product.name}
                            className={`object-cover w-full h-full rounded-lg transition duration-300 ${
                              outOfStock ? 'grayscale' : 'group-hover:scale-105'
                            }`}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {product.packageSize} · {product.registrationNumber}
                        </p>
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mt-0.5 hover:text-herbal-700 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {product.shortBenefit}
                        </p>
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-2.5 gap-2">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Harga:</span>
                          <p
                            className={`text-sm sm:text-base font-bold tabular-nums ${
                              outOfStock ? 'text-slate-400' : 'text-herbal-700'
                            }`}
                          >
                            {formatRupiah(product.price)}
                          </p>
                        </div>
                        {outOfStock ? (
                          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded shrink-0">
                            Habis
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded tabular-nums shrink-0">
                            Stok: {product.stock}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {outOfStock ? (
                          <button
                            type="button"
                            disabled
                            title="Produk sedang dalam proses restock"
                            className="w-full py-2.5 bg-slate-200 text-slate-500 cursor-not-allowed text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                          >
                            <Slash className="w-3.5 h-3.5" />
                            Stok Tidak Tersedia
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onAddToCart(product)}
                            className="w-full py-2.5 bg-herbal-600 hover:bg-herbal-700 active:bg-herbal-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Tambah ke Keranjang
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onOpenProduct(product)}
                          className="w-full py-1.5 text-[11px] font-semibold text-slate-600 hover:text-herbal-700 hover:bg-slate-50 rounded-lg transition"
                        >
                          Lihat Komposisi &amp; Aturan Pakai
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 mt-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Tidak ada produk yang cocok
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                Produk tidak ditemukan untuk kata kunci atau kategori yang Anda pilih. Coba atur
                ulang filter pencarian Anda.
              </p>
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-4 px-5 py-2.5 bg-herbal-600 hover:bg-herbal-700 text-white text-xs font-semibold rounded-lg transition"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Promo & Trust Banners */}
      <section className="py-12 bg-surface-base border-t border-surface-border" id="promo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              type="button"
              onClick={() => onCopyPromoCode('HERBALAWAL')}
              className="text-left bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-1 rounded bg-white/20 text-white text-[11px] font-semibold mb-3">
                  Pengguna Baru
                </span>
                <h3 className="text-xl font-bold leading-tight">
                  Diskon 10% Belanja Pertama Anda
                </h3>
                <p className="text-xs text-emerald-100 mt-2">
                  Guest checkout instan tanpa registrasi ribet. Klik kartu untuk salin kode:{' '}
                  <span className="font-mono bg-white/25 px-1.5 py-0.5 rounded font-bold">
                    HERBALAWAL
                  </span>
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between relative z-10 w-full">
                <span className="text-xs font-medium text-emerald-200">Min. Belanja Rp 100rb</span>
                <div className="w-8 h-8 rounded-full bg-white text-herbal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </button>

            <div className="bg-gradient-to-br from-[#854D0E] to-[#A16207] rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-1 rounded bg-white/20 text-white text-[11px] font-semibold mb-3">
                  Bebas Ongkir
                </span>
                <h3 className="text-xl font-bold leading-tight">
                  Gratis Pengiriman Seluruh Jawa-Bali
                </h3>
                <p className="text-xs text-amber-100 mt-2">
                  Pesanan dipacking aman dengan bubble wrap ganda dan kardus tebal bersegel untuk
                  belanja minimal Rp 150.000.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between relative z-10">
                <span className="text-xs font-medium text-amber-200">Otomatis saat checkout</span>
                <div className="w-8 h-8 rounded-full bg-white text-[#854D0E] flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('edukasi')}
              className="text-left bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-1 rounded bg-herbal-500 text-white text-[11px] font-semibold mb-3">
                  Panduan &amp; Edukasi
                </span>
                <h3 className="text-xl font-bold leading-tight">
                  Belanja Jelas Tanpa Janji Bombastis
                </h3>
                <p className="text-xs text-slate-300 mt-2">
                  Setiap produk memiliki deskripsi bahan asli, aturan minum harian, serta
                  peringatan interaksi.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between relative z-10 w-full">
                <span className="text-xs font-medium text-slate-400">Transparan &amp; Faktual</span>
                <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Health Disclaimer Section */}
      <section className="py-12 bg-white border-t border-surface-border" id="edukasi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                Perhatian &amp; Tanggung Jawab Penggunaan Herbal
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Seluruh suplemen dan ramuan herbal di HerbalStore dirancang untuk mendukung kesehatan
                dan kebugaran tubuh,{' '}
                <strong>
                  bukan sebagai pengganti resep obat, diagnosis dokter, atau perawatan medis
                  komprehensif
                </strong>
                .
              </p>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Jika Anda sedang dalam kondisi hamil, menyusui, memiliki penyakit kronis (seperti
                gagal ginjal atau komplikasi jantung), atau sedang mengonsumsi obat pengencer darah
                rutin,{' '}
                <strong>
                  wajib berkonsultasi terlebih dahulu dengan tenaga kesehatan atau dokter keluarga
                  Anda
                </strong>{' '}
                sebelum memulai konsumsi rutin.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-herbal-700">
                <span className="inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Sesuai Regulasi BPOM RI
                </span>
                <span className="inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Komposisi Tertera Lengkap
                </span>
                <span className="inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Batch Number &amp; Expire Date Jelas
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
