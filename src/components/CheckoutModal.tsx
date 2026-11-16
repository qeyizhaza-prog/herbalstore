import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type {
  CartItem,
  CheckoutFormData,
  PaymentMethod,
  ShippingMethod,
} from '../types/herbal.ts';
import { formatRupiah } from '../utils/format.ts';

interface CheckoutModalProps {
  open: boolean;
  items: CartItem[];
  initialPromoCode: string;
  onClose: () => void;
  onSubmitOrder: (form: CheckoutFormData, idempotencyKey: string) => Promise<void>;
}

export function CheckoutModal({
  open,
  items,
  initialPromoCode,
  onClose,
  onSubmitOrder,
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>(
    {}
  );
  const [idempotencyKey] = useState(() => `chk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const [form, setForm] = useState<CheckoutFormData>({
    customerName: 'Budi Pratama',
    phone: '0812-3456-7890',
    address: 'Jl. Anggrek Cendrawasih No. 24, Sukajadi',
    city: 'Kota Bandung, Jawa Barat',
    postalCode: '40161',
    notes: 'Titip sekuriti pos gerbang jika tidak ada orang di rumah.',
    shippingMethod: 'regular',
    paymentMethod: 'qris',
    promoCode: initialPromoCode,
  });

  if (!open) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const itemCount = items.reduce((acc, item) => acc + item.qty, 0);
  const regularShipping = subtotal >= 150000 ? 0 : 18000;
  const shippingCost = form.shippingMethod === 'express' ? 15000 : regularShipping;
  const promoApplied = form.promoCode.trim().toUpperCase() === 'HERBALAWAL' && subtotal >= 100000;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const validateStep1 = (): boolean => {
    const errors: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (!form.customerName.trim() || form.customerName.trim().length < 2) {
      errors.customerName = 'Nama lengkap penerima wajib diisi.';
    }
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) {
      errors.phone = 'Nomor WhatsApp belum lengkap. Periksa kembali, ya.';
    }
    if (!form.address.trim() || form.address.trim().length < 8) {
      errors.address = 'Mohon lengkapi nama jalan, nomor rumah, dan RT/RW atau kelurahan.';
    }
    if (!form.city.trim()) {
      errors.city = 'Kota / Kabupaten wajib diisi.';
    }
    if (!/^\d{5}$/.test(form.postalCode.trim())) {
      errors.postalCode = 'Kode pos harus 5 digit angka.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    setServerError(null);
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }
    if (step === 2) {
      setStep(3);
    }
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;
    setServerError(null);
    setSubmitting(true);
    try {
      await onSubmitOrder(form, idempotencyKey);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Gagal membuat pesanan. Silakan coba kembali.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Guest Checkout HerbalStore"
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:p-6">
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative z-10 bg-white rounded-2xl text-left overflow-hidden shadow-2xl w-full max-w-xl border border-slate-200">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Guest Checkout HerbalStore
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-herbal-800 rounded-full">
                  Tanpa Akun
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Belanja herbal aman, cepat, dan transparan.
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup checkout"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3-Step Indicator (US-06) */}
          <div className="px-6 pt-4 pb-3 border-b border-slate-100 bg-white">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
              {[
                { num: 1 as const, label: 'Data Penerima' },
                { num: 2 as const, label: 'Opsi Kirim' },
                { num: 3 as const, label: 'Konfirmasi' },
              ].map((s) => {
                const isCurrent = step === s.num;
                const isDone = step > s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    disabled={s.num > step}
                    onClick={() => {
                      if (s.num < step) setStep(s.num);
                    }}
                    className={`p-2 rounded-lg border transition text-center ${
                      isCurrent
                        ? 'bg-herbal-700 text-white border-herbal-700 shadow-xs'
                        : isDone
                        ? 'bg-herbal-50 text-herbal-700 border-herbal-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`block text-[10px] uppercase font-bold ${
                        isCurrent ? 'text-emerald-200' : isDone ? 'text-herbal-600' : 'text-slate-400'
                      }`}
                    >
                      Tahap {s.num}
                    </span>
                    <span className="truncate block">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
            {serverError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* STEP 1: Data Penerima */}
            {step === 1 && (
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-herbal-600" />
                  1. Informasi Penerima &amp; Alamat
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-700 mb-1"
                      htmlFor="cust-name"
                    >
                      Nama Lengkap *
                    </label>
                    <input
                      id="cust-name"
                      type="text"
                      value={form.customerName}
                      onChange={(e) => {
                        setForm({ ...form, customerName: e.target.value });
                        setFieldErrors({ ...fieldErrors, customerName: undefined });
                      }}
                      className={`w-full text-xs rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-herbal-600 ${
                        fieldErrors.customerName ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.customerName && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-700 mb-1"
                      htmlFor="cust-phone"
                    >
                      Nomor WhatsApp *
                    </label>
                    <input
                      id="cust-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        setFieldErrors({ ...fieldErrors, phone: undefined });
                      }}
                      className={`w-full text-xs rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-herbal-600 ${
                        fieldErrors.phone ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-slate-700 mb-1"
                    htmlFor="cust-address"
                  >
                    Alamat Lengkap Pengiriman *
                  </label>
                  <textarea
                    id="cust-address"
                    rows={2}
                    value={form.address}
                    onChange={(e) => {
                      setForm({ ...form, address: e.target.value });
                      setFieldErrors({ ...fieldErrors, address: undefined });
                    }}
                    className={`w-full text-xs rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-herbal-600 ${
                      fieldErrors.address ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.address && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label
                      className="block text-xs font-semibold text-slate-700 mb-1"
                      htmlFor="cust-city"
                    >
                      Kota / Kabupaten &amp; Provinsi *
                    </label>
                    <input
                      id="cust-city"
                      type="text"
                      value={form.city}
                      onChange={(e) => {
                        setForm({ ...form, city: e.target.value });
                        setFieldErrors({ ...fieldErrors, city: undefined });
                      }}
                      className={`w-full text-xs rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-herbal-600 ${
                        fieldErrors.city ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.city && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-700 mb-1"
                      htmlFor="cust-postal"
                    >
                      Kode Pos *
                    </label>
                    <input
                      id="cust-postal"
                      type="text"
                      maxLength={5}
                      value={form.postalCode}
                      onChange={(e) => {
                        setForm({ ...form, postalCode: e.target.value });
                        setFieldErrors({ ...fieldErrors, postalCode: undefined });
                      }}
                      className={`w-full text-xs rounded-lg border px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-herbal-600 ${
                        fieldErrors.postalCode ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.postalCode && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.postalCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-slate-700 mb-1"
                    htmlFor="cust-notes"
                  >
                    Catatan untuk Kurir (Opsional)
                  </label>
                  <input
                    id="cust-notes"
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Contoh: Titip di pos satpam jika rumah kosong"
                    className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-herbal-600"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Opsi Pengiriman & Pembayaran */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-herbal-600" />
                    2. Pilih Layanan Ekspedisi
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {(
                      [
                        {
                          id: 'regular' as ShippingMethod,
                          name: 'Reguler Higienis (2–3 Hari)',
                          priceLabel: regularShipping === 0 ? 'Gratis' : formatRupiah(regularShipping),
                          highlight: regularShipping === 0,
                        },
                        {
                          id: 'express' as ShippingMethod,
                          name: 'Express 1 Hari (Armada Dingin)',
                          priceLabel: '+Rp 15.000',
                          highlight: false,
                        },
                      ] as const
                    ).map((opt) => {
                      const active = form.shippingMethod === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            active
                              ? 'border-herbal-600 bg-herbal-50/70 ring-1 ring-herbal-600'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="shipping_service"
                              checked={active}
                              onChange={() => setForm({ ...form, shippingMethod: opt.id })}
                              className="text-herbal-600 focus:ring-herbal-500"
                            />
                            <span className="font-semibold text-slate-800">{opt.name}</span>
                          </div>
                          <span
                            className={`text-[11px] font-bold tabular-nums ${
                              opt.highlight ? 'text-emerald-600' : 'text-slate-700'
                            }`}
                          >
                            {opt.priceLabel}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-herbal-600" />
                    Metode Pembayaran
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {(
                      [
                        { id: 'qris' as PaymentMethod, label: 'QRIS Instant', sub: 'Bebas Biaya' },
                        { id: 'va_bca' as PaymentMethod, label: 'VA BCA', sub: 'Cek Otomatis' },
                        { id: 'va_mandiri' as PaymentMethod, label: 'VA Mandiri', sub: 'Cek Otomatis' },
                      ] as const
                    ).map((pm) => {
                      const active = form.paymentMethod === pm.id;
                      return (
                        <label
                          key={pm.id}
                          className={`flex items-start gap-2 p-3 rounded-xl border cursor-pointer transition ${
                            active
                              ? 'border-herbal-600 bg-herbal-50/70 ring-1 ring-herbal-600'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_method"
                            checked={active}
                            onChange={() => setForm({ ...form, paymentMethod: pm.id })}
                            className="mt-0.5 text-herbal-600 focus:ring-herbal-500"
                          />
                          <div>
                            <span className="font-semibold text-slate-800 block">{pm.label}</span>
                            <span className="text-[10px] text-slate-500">{pm.sub}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal Produk ({itemCount} item)</span>
                    <span className="font-medium text-slate-800 tabular-nums">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Diskon HERBALAWAL (10%)</span>
                      <span className="font-semibold tabular-nums">-{formatRupiah(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkos Kirim</span>
                    <span className="font-semibold text-emerald-600 tabular-nums">
                      {shippingCost === 0 ? 'Gratis (Hemat Rp 18.000)' : formatRupiah(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
                    <span>Estimasi Total Akhir</span>
                    <span className="text-herbal-700 font-extrabold tabular-nums">
                      {formatRupiah(total)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Konfirmasi Final */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-herbal-600" />
                  3. Ringkasan Final Sebelum Buat Pesanan
                </h4>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{form.customerName}</span>
                    <span className="font-mono text-slate-600">{form.phone}</span>
                  </div>
                  <p className="text-slate-600">
                    {form.address}, {form.city} {form.postalCode}
                  </p>
                  {form.notes && (
                    <p className="text-slate-500 pt-1">Catatan kurir: {form.notes}</p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                  {items.map((it) => (
                    <div
                      key={`${it.productId}-${it.variantId || 'default'}`}
                      className="flex items-center justify-between p-3 gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{it.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {it.variantLabel} · {it.qty}x @ {formatRupiah(it.price)}
                        </p>
                      </div>
                      <span className="font-bold text-slate-800 tabular-nums shrink-0">
                        {formatRupiah(it.price * it.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 bg-herbal-50/70 rounded-xl border border-herbal-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Kurir</span>
                    <span className="font-semibold text-slate-800">
                      {form.shippingMethod === 'express'
                        ? 'SiCepat Express 1 Hari'
                        : 'SiCepat Reguler Higienis'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Pembayaran</span>
                    <span className="font-semibold text-slate-800">
                      {form.paymentMethod === 'qris'
                        ? 'QRIS Instant'
                        : form.paymentMethod === 'va_bca'
                        ? 'Virtual Account BCA'
                        : 'Virtual Account Mandiri'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-herbal-200 text-sm">
                    <span>Total Tagihan Akhir</span>
                    <span className="text-herbal-700 font-extrabold tabular-nums">
                      {formatRupiah(total)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 rounded-lg transition"
              >
                Kembali ke Keranjang
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Langkah Sebelumnya
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-herbal-600 hover:bg-herbal-700 rounded-lg shadow-sm transition flex items-center gap-2"
              >
                <span>Lanjut ke Tahap {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-herbal-600 hover:bg-herbal-700 disabled:bg-herbal-400 rounded-lg shadow-sm transition flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses Pesanan...
                  </>
                ) : (
                  <>
                    <span>Buat Pesanan &amp; Terbitkan Resi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
