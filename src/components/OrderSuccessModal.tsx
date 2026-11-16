import {
  Check,
  CheckCircle2,
  Copy,
  Info,
  MessageCircle,
  PackageSearch,
  QrCode,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type { OrderRecord } from '../types/herbal.ts';
import { downloadOrderInvoice, formatRupiah } from '../utils/format.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface OrderSuccessModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export function OrderSuccessModal({
  order,
  onClose,
  onTrackOrder,
}: OrderSuccessModalProps) {
  const [copiedField, setCopiedField] = useState<'va' | 'total' | null>(null);

  if (!order) return null;

  const handleCopy = (value: string, field: 'va' | 'total') => {
    navigator.clipboard?.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Konfirmasi Pesanan"
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center sm:p-6">
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block bg-white rounded-3xl text-left overflow-hidden shadow-2xl w-full max-w-2xl relative z-10 border border-slate-200/90 my-6">
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-emerald-50/70 via-white to-white border-b border-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-herbal-700 flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-8 h-8 text-herbal-600" />
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-herbal-800 text-[10px] font-bold tracking-wide uppercase mb-1">
                    Konfirmasi Pesanan
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    Pesanan Berhasil Dibuat!
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    Terima kasih atas pesanan Anda. Nomor pesanan Anda telah tercatat dan siap
                    dipantau melalui halaman pelacakan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Tutup modal"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Nomor Pesanan Unik
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-slate-800">
                  {order.orderNumber}
                </span>
              </div>
              <div className="space-y-0.5 text-left sm:text-center">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Waktu Pemesanan
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {order.createdAtLabel}
                </span>
              </div>
              <div className="space-y-0.5 text-left sm:text-right">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Status Pesanan
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[62vh] overflow-y-auto">
            {/* Payment Instructions */}
            <div className="p-5 rounded-2xl bg-herbal-50/60 border border-herbal-200/80">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-herbal-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-herbal-600 text-white flex items-center justify-center font-bold text-xs">
                    QR
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      Instruksi Pembayaran Instan (QRIS &amp; VA)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Dapat dipindai oleh semua aplikasi m-Banking dan e-Wallet
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Batas: 23 jam 59 menit
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4 items-center">
                <div className="sm:col-span-5 flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <div className="w-32 h-32 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-2">
                    <QrCode className="w-10 h-10 text-herbal-700 mb-1" />
                    <span className="text-[9px] font-mono font-bold text-slate-600">
                      SCAN QRIS RESMI
                    </span>
                    <span className="text-[8px] text-slate-400 mt-0.5">
                      NMID: ID1020261198
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-medium text-center">
                    BCA, Mandiri, BRI, GoPay, OVO, ShopeePay
                  </span>
                </div>

                <div className="sm:col-span-7 space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Nomor Virtual Account {order.paymentMethod === 'va_mandiri' ? 'Mandiri' : 'BCA'}
                    </span>
                    <div className="flex items-center justify-between mt-0.5 gap-2">
                      <span className="font-mono text-sm font-bold text-slate-800 tracking-wider">
                        {order.vaNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.vaNumber.replace(/\s+/g, ''), 'va')}
                        className="text-[10px] font-bold text-herbal-700 hover:text-herbal-800 bg-herbal-50 px-2.5 py-1 rounded border border-herbal-200 transition inline-flex items-center gap-1 shrink-0"
                      >
                        {copiedField === 'va' ? (
                          <>
                            <Check className="w-3 h-3" /> Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Salin VA
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Total Tagihan Tepat (Jangan Dibulatkan)
                    </span>
                    <div className="flex items-center justify-between mt-0.5 gap-2">
                      <span className="text-base font-extrabold text-herbal-700 tabular-nums">
                        {formatRupiah(order.total)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(String(order.total), 'total')}
                        className="text-[10px] font-bold text-herbal-700 hover:text-herbal-800 bg-herbal-50 px-2.5 py-1 rounded border border-herbal-200 transition inline-flex items-center gap-1 shrink-0"
                      >
                        {copiedField === 'total' ? (
                          <>
                            <Check className="w-3 h-3" /> Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Salin Nominal
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Summary */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-herbal-600" />
                Ringkasan Item Pesanan
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 p-2">
                {order.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantLabel}`}
                    className="flex items-center justify-between p-2.5 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ResilientImage
                        src={item.image}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {item.productName}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {item.variantLabel} · {item.quantity}x
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-800 tabular-nums shrink-0">
                      {formatRupiah(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Item ({order.items.length} produk)</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {formatRupiah(order.subtotal)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon Promo</span>
                    <span className="font-semibold tabular-nums">
                      -{formatRupiah(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Ongkos Kirim Higienis</span>
                  <span className="font-semibold text-emerald-600 tabular-nums">
                    {order.shippingCost === 0
                      ? 'Rp 0 (Gratis Ongkir Promo)'
                      : formatRupiah(order.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>Total Tagihan Pembayaran</span>
                  <span className="text-herbal-700 font-extrabold tabular-nums">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipient Data */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-herbal-600" />
                Data Penerima &amp; Pengiriman
              </h3>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <p>
                  <span className="font-semibold text-slate-800">Penerima:</span>{' '}
                  {order.customerName} ({order.phone})
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Alamat:</span> {order.address},{' '}
                  {order.city} {order.postalCode}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Estimasi Tiba:</span>{' '}
                  {order.estimatedArrival} ({order.courierName})
                </p>
              </div>
            </div>

            {/* Health Notice */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-herbal-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-herbal-900 leading-relaxed">
                <span className="font-bold">Perhatian:</span> Suplemen &amp; herbal bukan
                pengganti obat dokter atau tindakan medis. Simpan di tempat sejuk dan terhindar
                dari sinar matahari langsung.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onTrackOrder(order.orderNumber)}
              className="w-full sm:w-auto px-5 py-2.5 bg-herbal-600 hover:bg-herbal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <PackageSearch className="w-4 h-4" />
              <span>Lacak Pengiriman Pesanan</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href={`https://wa.me/6281299008800?text=${encodeURIComponent(
                  `Halo HerbalStore, saya ingin konfirmasi pesanan ${order.orderNumber}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-herbal-800 font-semibold text-xs rounded-xl border border-herbal-200 transition flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => downloadOrderInvoice(order)}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/50 rounded-xl border border-slate-200 bg-white transition whitespace-nowrap"
              >
                Unduh Invoice
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/50 rounded-xl border border-slate-200 bg-white transition whitespace-nowrap"
              >
                Kembali Belanja
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
