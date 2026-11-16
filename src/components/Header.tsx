import { Search, ShieldCheck, ShoppingBag, Sprout, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateTracking: () => void;
  activeView: 'home' | 'product' | 'tracking';
}

export function Header({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onNavigateHome,
  onNavigateTracking,
  activeView,
}: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <aside
        className="bg-herbal-900 text-herbal-100 text-xs py-2 px-4 border-b border-herbal-800/60 no-print"
        aria-label="Informasi Jaminan Mutu"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-herbal-600 text-white tracking-wide uppercase shrink-0">
              BPOM Terverifikasi
            </span>
            <span>
              Jaminan produk herbal alami terdaftar resmi. Gratis ongkir min. belanja Rp 150.000.
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-herbal-200 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateHome('edukasi')}
              className="hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-herbal-500" />
              Panduan Konsumsi Aman
            </button>
            <span className="hidden md:inline text-herbal-700" aria-hidden="true">
              |
            </span>
            <span className="hidden md:inline whitespace-nowrap">
              Layanan Pelanggan: 08.00 - 17.00 WIB
            </span>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-border shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => onNavigateHome()}
              className="flex items-center gap-2.5 shrink-0 group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-herbal-600 rounded-xl p-1 -ml-1"
            >
              <div className="w-10 h-10 rounded-xl bg-herbal-600 flex items-center justify-center text-white shadow-md shadow-herbal-600/20 group-hover:bg-herbal-700 transition">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-herbal-dark flex items-center whitespace-nowrap">
                  Herbal<span className="text-herbal-600">Store</span>
                </span>
                <span className="text-[10px] tracking-wider text-neutral-500 uppercase font-medium whitespace-nowrap">
                  Katalog Terpercaya
                </span>
              </div>
            </button>

            <div className="flex-1 max-w-lg mx-2 hidden md:block">
              <div className="relative">
                <label className="sr-only" htmlFor="desktop-search-input">
                  Cari produk herbal
                </label>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="desktop-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (activeView !== 'home') {
                      onNavigateHome('katalog');
                    }
                  }}
                  placeholder="Cari nama produk herbal, temulawak, madu, habbatussauda..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-herbal-600 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Bersihkan pencarian"
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <nav aria-label="Navigasi Utama" className="flex items-center gap-4 lg:gap-6 shrink-0">
              <ul className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-700">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateHome('kategori')}
                    className="hover:text-herbal-600 transition-colors whitespace-nowrap"
                  >
                    Sistem Tubuh
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateHome('katalog')}
                    className="hover:text-herbal-600 transition-colors whitespace-nowrap"
                  >
                    Katalog Pilihan
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateHome('promo')}
                    className="hover:text-herbal-600 transition-colors whitespace-nowrap"
                  >
                    Promo
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateHome('edukasi')}
                    className="hover:text-herbal-600 transition-colors whitespace-nowrap"
                  >
                    Transparansi
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateTracking}
                    className={`transition-colors whitespace-nowrap ${
                      activeView === 'tracking'
                        ? 'text-herbal-700 font-semibold underline underline-offset-4'
                        : 'hover:text-herbal-600'
                    }`}
                  >
                    Lacak Pesanan
                  </button>
                </li>
              </ul>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onNavigateTracking}
                  className="lg:hidden px-3 py-2 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 whitespace-nowrap"
                >
                  Lacak
                </button>
                <button
                  type="button"
                  aria-label="Buka pencarian"
                  onClick={() => setMobileSearchOpen((prev) => !prev)}
                  className="md:hidden p-2.5 text-slate-600 hover:text-herbal-600 rounded-lg hover:bg-slate-100"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Buka keranjang belanja"
                  onClick={onOpenCart}
                  className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-herbal-50 text-herbal-700 hover:bg-herbal-100 border border-herbal-200/80 transition-all font-medium text-sm focus-visible:ring-2 focus-visible:ring-herbal-500 focus:outline-none whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4 text-herbal-600" />
                  <span className="hidden sm:inline">Keranjang</span>
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-herbal-600 rounded-full tabular-nums">
                    {cartCount}
                  </span>
                </button>
              </div>
            </nav>
          </div>

          {mobileSearchOpen && (
            <div className="pb-3 md:hidden">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (activeView !== 'home') {
                      onNavigateHome('katalog');
                    }
                  }}
                  placeholder="Cari kapsul, madu, ekstrak herbal..."
                  className="w-full pl-9 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-herbal-600 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Bersihkan pencarian"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
