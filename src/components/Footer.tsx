import { CheckCircle, MessageCircle, Sprout } from 'lucide-react';
import { CATEGORIES } from '../data/catalog.ts';
import type { CategorySlug } from '../types/herbal.ts';

interface FooterProps {
  onSelectCategory: (slug: CategorySlug) => void;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateTracking: () => void;
  onOpenPolicyModal: (topic: 'shipping' | 'warranty' | 'terms' | 'privacy') => void;
}

export function Footer({
  onSelectCategory,
  onNavigateHome,
  onNavigateTracking,
  onOpenPolicyModal,
}: FooterProps) {
  return (
    <footer className="bg-white border-t border-surface-border text-slate-600 text-xs mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-herbal-600 flex items-center justify-center text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-herbal-dark">HerbalStore</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Toko online herbal terpercaya yang mengedepankan transparansi kandungan bahan,
              sertifikasi resmi, dan informasi kesehatan faktual.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                <CheckCircle className="w-3.5 h-3.5 text-herbal-600" />
                Terdaftar BPOM
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                <CheckCircle className="w-3.5 h-3.5 text-herbal-600" />
                Halal MUI
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Sistem Tubuh
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.slug)}
                    className="hover:text-herbal-700 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Informasi &amp; Bantuan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome('edukasi')}
                  className="hover:text-herbal-700 transition-colors text-left"
                >
                  Disclaimer Medis
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateTracking}
                  className="hover:text-herbal-700 transition-colors text-left"
                >
                  Lacak Pengiriman Pesanan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyModal('shipping')}
                  className="hover:text-herbal-700 transition-colors text-left"
                >
                  Kebijakan Pengiriman
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyModal('warranty')}
                  className="hover:text-herbal-700 transition-colors text-left"
                >
                  Garansi Produk Asli
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyModal('terms')}
                  className="hover:text-herbal-700 transition-colors text-left"
                >
                  Syarat &amp; Ketentuan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicyModal('privacy')}
                  className="hover:text-herbal-700 transition-colors text-left"
                >
                  Kebijakan Privasi
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Kontak &amp; Pembayaran
            </h4>
            <p className="text-xs text-slate-500">Senin - Sabtu: 08:00 - 17:00 WIB</p>
            <a
              href="https://wa.me/6281299008800"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-slate-700 hover:text-herbal-700 text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>0812-9900-8800 (WhatsApp)</span>
            </a>
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                Metode Pembayaran Aman:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['QRIS', 'BCA', 'Mandiri', 'BNI'].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600 border border-slate-200"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[11px] text-slate-400">
            © 2026 HerbalStore Indonesia. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <p className="text-[11px] text-slate-400">
            Informasi pada situs ini bersifat edukatif dan bukan pengganti saran dokter resmi.
          </p>
        </div>
      </div>
    </footer>
  );
}
