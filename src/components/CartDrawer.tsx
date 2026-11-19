import { ArrowRight, ShieldCheck, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { CartItem } from '../types/herbal.ts';
import { formatRupiah } from '../utils/format.ts';
import {
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODE,
  PROMO_MIN_SUBTOTAL,
  calculateOrderTotals,
  isPromoEligible,
} from '../utils/pricing.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  promoCode: string;
  onApplyPromoCode: (code: string) => void;
  onClose: () => void;
  onUpdateQty: (productId: number, variantId: string | undefined, delta: number) => void;
  onRemoveItem: (productId: number, variantId: string | undefined) => void;
  onProceedCheckout: () => void;
}

export function CartDrawer({
  open,
  items,
  promoCode,
  onApplyPromoCode,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  if (!open) return null;

  const totalQuantity = items.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD;
  const { discount, shippingCost, total, freeShippingReached, promoApplied: activePromo } =
    calculateOrderTotals(subtotal, 'regular', promoCode);

  const handleApplyPromo = () => {
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) {
      onApplyPromoCode('');
      setPromoFeedback(null);
      return;
    }
    if (cleaned !== PROMO_CODE) {
      setPromoFeedback(`Kode promo tidak dikenali. Gunakan kode ${PROMO_CODE}.`);
      return;
    }
    if (subtotal < PROMO_MIN_SUBTOTAL) {
      setPromoFeedback(`Kode ${PROMO_CODE} berlaku untuk minimal belanja ${formatRupiah(PROMO_MIN_SUBTOTAL)}.`);
      return;
    }
    onApplyPromoCode(PROMO_CODE);
    setPromoFeedback(`Diskon 10% (${PROMO_CODE}) berhasil diterapkan.`);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang Belanja"
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10 pointer-events-none">
        <div className="w-screen max-w-md bg-white shadow-2xl pointer-events-auto flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-herbal-600" />
              <h2 className="text-base font-bold text-slate-800">Keranjang Belanja</h2>
              <span className="text-xs bg-herbal-100 text-herbal-800 font-bold px-2 py-0.5 rounded-full tabular-nums">
                {totalQuantity}
              </span>
            </div>
            <button
              type="button"
              aria-label="Tutup keranjang"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Keranjangmu masih kosong
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Yuk, temukan pilihan herbal yang kamu cari di katalog produk kami.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        freeShippingReached ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate">
                      {freeShippingReached
                        ? 'Gratis Ongkir Aktif (Min. Rp 150.000)'
                        : `Tambah ${formatRupiah(
                            freeShippingThreshold - subtotal
                          )} lagi untuk Gratis Ongkir`}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                      freeShippingReached
                        ? 'text-herbal-700 bg-herbal-50 border-herbal-200'
                        : 'text-amber-700 bg-amber-50 border-amber-200'
                    }`}
                  >
                    {freeShippingReached ? 'Tercapai' : 'Hampir'}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => {
                    const key = `${item.productId}-${item.variantId || 'default'}`;
                    return (
                      <div
                        key={key}
                        className="flex gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs items-center"
                      >
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg bg-slate-50 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-slate-800 truncate">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              aria-label={`Hapus ${item.name}`}
                              onClick={() => onRemoveItem(item.productId, item.variantId)}
                              className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {item.variantLabel} · {item.registrationNumber}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs font-bold text-herbal-700 tabular-nums">
                              {formatRupiah(item.price * item.qty)}
                            </p>
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                              <button
                                type="button"
                                aria-label="Kurangi jumlah"
                                onClick={() => onUpdateQty(item.productId, item.variantId, -1)}
                                className="px-2.5 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-200/50 rounded-l"
                              >
                                −
                              </button>
                              <span className="px-2.5 text-xs font-semibold text-slate-800 bg-white tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                aria-label="Tambah jumlah"
                                disabled={item.qty >= item.maxStock}
                                onClick={() => onUpdateQty(item.productId, item.variantId, 1)}
                                className="px-2.5 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-200/50 disabled:opacity-40 rounded-r"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code Input */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <label
                    htmlFor="cart-promo-input"
                    className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5"
                  >
                    <Tag className="w-3.5 h-3.5 text-herbal-600" />
                    Punya Kode Promo? (Opsional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="cart-promo-input"
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Contoh: HERBALAWAL"
                      className="flex-1 text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-herbal-600"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition whitespace-nowrap"
                    >
                      Terapkan
                    </button>
                  </div>
                  {promoFeedback && (
                    <p
                      className={`text-[11px] font-medium ${
                        activePromo ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {promoFeedback}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-herbal-50 rounded-xl border border-herbal-200/80 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-herbal-600 mt-0.5 shrink-0" />
                  <div className="text-[11px] text-herbal-800 leading-relaxed">
                    <span className="font-bold">Jaminan Mutu Herbal:</span> Seluruh produk dikemas
                    dengan segel ganda &amp; lolos uji registrasi resmi.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Summary */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/80 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon Promo (HERBALAWAL)</span>
                  <span className="font-semibold tabular-nums">-{formatRupiah(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimasi Ongkir (Jawa-Bali)</span>
                <span
                  className={`font-semibold tabular-nums ${
                    shippingCost === 0 ? 'text-emerald-600' : 'text-slate-800'
                  }`}
                >
                  {shippingCost === 0 ? 'Gratis' : formatRupiah(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Pembayaran</span>
                <span className="text-herbal-700 font-extrabold text-base tabular-nums">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={onProceedCheckout}
              className="w-full py-3.5 bg-herbal-600 hover:bg-herbal-700 active:bg-herbal-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md shadow-herbal-600/20 transition flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Transaksi aman &amp; terenkripsi. Guest checkout tanpa perlu login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
