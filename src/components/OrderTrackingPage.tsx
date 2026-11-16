import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardList,
  Download,
  Info,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useState } from 'react';
import type { OrderRecord } from '../types/herbal.ts';
import { downloadOrderInvoice, formatRupiah } from '../utils/format.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface OrderTrackingPageProps {
  order: OrderRecord;
  lookupError: string | null;
  onLookupOrder: (orderNumber: string) => Promise<void>;
  onUpdateInstruction: (orderNumber: string, instruction: string) => Promise<void>;
  onConfirmDelivery: (orderNumber: string) => Promise<void>;
  onVerifyPaymentDemo: (orderNumber: string) => Promise<void>;
  onBackHome: () => void;
}

export function OrderTrackingPage({
  order,
  lookupError,
  onLookupOrder,
  onUpdateInstruction,
  onConfirmDelivery,
  onVerifyPaymentDemo,
  onBackHome,
}: OrderTrackingPageProps) {
  const [searchInput, setSearchInput] = useState(order.orderNumber);
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState(false);
  const [instructionDraft, setInstructionDraft] = useState(order.deliveryInstruction);
  const [savingInstruction, setSavingInstruction] = useState(false);
  const [showCourierContact, setShowCourierContact] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const totalProductsCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

  const handleCopyAwb = () => {
    navigator.clipboard?.writeText(order.awbNumber);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    await onLookupOrder(searchInput.trim());
  };

  const handleSaveInstruction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructionDraft.trim()) return;
    setSavingInstruction(true);
    try {
      await onUpdateInstruction(order.orderNumber, instructionDraft.trim());
      setEditingInstruction(false);
    } finally {
      setSavingInstruction(false);
    }
  };

  const handleRefreshSync = async () => {
    setSyncing(true);
    try {
      await onLookupOrder(order.orderNumber);
    } finally {
      setTimeout(() => setSyncing(false), 300);
    }
  };

  const handleConfirmDeliveryClick = async () => {
    if (order.status !== 'Dalam Pengiriman Ekspedisi' || confirming) return;
    setConfirming(true);
    try {
      await onConfirmDelivery(order.orderNumber);
    } finally {
      setConfirming(false);
    }
  };

  const statusBadgeStyle =
    order.status === 'Selesai'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : order.status === 'Menunggu Pembayaran'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-herbal-50 text-herbal-700 border-herbal-200';

  const statusDotColor =
    order.status === 'Selesai'
      ? 'bg-emerald-600'
      : order.status === 'Menunggu Pembayaran'
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <main className="flex-grow bg-surface-base py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Row: Breadcrumb + Order Lookup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={onBackHome}
              className="hover:text-herbal-700 transition-colors"
            >
              Beranda
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-slate-500">Pesanan Saya</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-herbal-700">Pelacakan Pengiriman</span>
          </nav>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 no-print">
            <label htmlFor="order-lookup-input" className="sr-only">
              Cari Nomor Pesanan
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="order-lookup-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="#HBS-20261118-8492"
                className="pl-8 pr-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-herbal-600 w-48 sm:w-56"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition whitespace-nowrap"
            >
              Cek Resi
            </button>
          </form>
        </div>

        {lookupError && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2"
          >
            <span>{lookupError}</span>
            <button
              type="button"
              onClick={() => {
                setSearchInput('#HBS-20261118-8492');
                onLookupOrder('#HBS-20261118-8492');
              }}
              className="font-semibold underline whitespace-nowrap"
            >
              Muat Contoh #HBS-20261118-8492
            </button>
          </div>
        )}

        {/* Payment Verification Notice if order is newly created & awaiting payment */}
        {order.status === 'Menunggu Pembayaran' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs text-amber-950">
              <p className="font-bold text-sm">
                Menunggu Konfirmasi Pembayaran ({formatRupiah(order.total)})
              </p>
              <p className="text-amber-800">
                Selesaikan transfer ke Virtual Account{' '}
                <span className="font-mono font-bold">{order.vaNumber}</span> atau QRIS agar staf
                gudang dapat segera mengemas pesanan Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onVerifyPaymentDemo(order.orderNumber)}
              className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl transition whitespace-nowrap shrink-0"
            >
              Simulasikan Pembayaran Terverifikasi
            </button>
          </div>
        )}

        {/* Main Hero Tracking Header Card (matches screen_b6f59961.png) */}
        <section className="bg-white rounded-3xl border border-surface-border p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wide ${statusBadgeStyle}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusDotColor}`} />
                <span>{order.status}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pelacakan Pengiriman Pesanan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Pantau perjalanan produk herbal higienis Anda langsung secara berkala dan
                terverifikasi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
              <button
                type="button"
                onClick={() => downloadOrderInvoice(order)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold inline-flex items-center gap-2 transition whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Unduh Invoice
              </button>
              <a
                href={`https://wa.me/6281299008800?text=${encodeURIComponent(
                  `Halo CS HerbalStore, saya ingin menanyakan status pengiriman pesanan ${order.orderNumber} (Resi ${order.awbNumber}).`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-herbal-600 hover:bg-herbal-700 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Bantuan WhatsApp CS
              </a>
            </div>
          </div>

          {/* 4-column Metadata Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">Nomor Pesanan</span>
              <span className="font-mono text-sm font-bold text-slate-900 block">
                {order.orderNumber}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">Ekspedisi Kurir</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-sm font-bold text-slate-900 truncate">
                  {order.courierName}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium block">
                Nomor Resi (AWB)
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-herbal-700 truncate">
                  {order.awbNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAwb}
                  className="px-2.5 py-1 rounded-md bg-herbal-50 hover:bg-herbal-100 text-herbal-700 border border-herbal-200 text-[11px] font-bold transition whitespace-nowrap shrink-0"
                >
                  {copiedAwb ? 'Tersalin' : 'Salin Resi'}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-herbal-50/80 border border-herbal-200 space-y-1">
              <span className="text-[11px] text-herbal-700 font-medium block">
                Estimasi Paket Tiba
              </span>
              <span className="text-sm font-bold text-herbal-900 block">
                {order.estimatedArrival}
              </span>
            </div>
          </div>
        </section>

        {/* Main 2-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (7 cols): Courier Card + Timeline Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* Courier Card */}
            <section className="bg-white rounded-3xl border border-surface-border p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-herbal-50 border border-herbal-200/70 text-herbal-700 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900">{order.driverName}</h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-herbal-700 border border-herbal-200 text-[10px] font-bold">
                        Kurir Dedicated
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {order.driverHub} ({order.driverPhone})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCourierContact((prev) => !prev)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-herbal-50 text-herbal-700 border border-herbal-300 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition whitespace-nowrap shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Hubungi Kurir
                </button>
              </div>

              {showCourierContact && (
                <div className="p-3.5 rounded-xl bg-herbal-50/70 border border-herbal-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-herbal-900">
                    <span className="font-bold block">Kontak Armada Pengantar</span>
                    <span>
                      {order.driverName} · {order.driverPhone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/6281398214400?text=${encodeURIComponent(
                        `Halo Pak ${order.driverName}, saya penerima paket ${order.orderNumber} (${order.awbNumber}).`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-herbal-600 text-white font-semibold hover:bg-herbal-700 transition"
                    >
                      Chat WhatsApp Kurir
                    </a>
                  </div>
                </div>
              )}

              {/* Instruction Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                {!editingInstruction ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Info className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        Instruksi:{' '}
                        <strong className="text-slate-800">{order.deliveryInstruction}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setInstructionDraft(order.deliveryInstruction);
                        setEditingInstruction(true);
                      }}
                      className="text-xs font-bold text-herbal-700 hover:text-herbal-800 underline underline-offset-2 shrink-0"
                    >
                      Ubah Instruksi
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveInstruction} className="space-y-2">
                    <label
                      htmlFor="edit-instruction-input"
                      className="text-[11px] font-semibold text-slate-700 block"
                    >
                      Perbarui Instruksi untuk Kurir:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="edit-instruction-input"
                        type="text"
                        value={instructionDraft}
                        onChange={(e) => setInstructionDraft(e.target.value)}
                        className="flex-1 text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-herbal-600"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={savingInstruction}
                          className="px-3.5 py-2 bg-herbal-600 hover:bg-herbal-700 text-white text-xs font-semibold rounded-lg transition"
                        >
                          {savingInstruction ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingInstruction(false)}
                          className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* Timeline Card */}
            <section className="bg-white rounded-3xl border border-surface-border p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-herbal-600" />
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Riwayat &amp; Linimasa Pengiriman
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleRefreshSync}
                  className="text-xs text-slate-400 hover:text-herbal-700 inline-flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin text-herbal-600' : ''}`} />
                  <span>{order.lastSyncedLabel}</span>
                </button>
              </div>

              <div className="relative space-y-5">
                {order.milestones.map((milestone, idx) => {
                  const isLast = idx === order.milestones.length - 1;
                  const isActive = Boolean(milestone.active);

                  return (
                    <div key={milestone.id} className="relative flex gap-4">
                      {/* Vertical connector line */}
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[13px] top-7 bottom-[-20px] w-0.5 bg-slate-200"
                        />
                      )}

                      {/* Status Node */}
                      <div className="relative z-10 shrink-0 mt-0.5">
                        {isActive ? (
                          <div className="w-7 h-7 rounded-full bg-herbal-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white border-2 border-herbal-500 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-herbal-600" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      {isActive ? (
                        <div className="flex-1 p-4 rounded-2xl bg-herbal-50/70 border border-herbal-200 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-xs sm:text-sm font-bold text-herbal-900">
                              {milestone.title}
                            </h3>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-herbal-800 text-[11px] font-bold tabular-nums">
                              {milestone.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1 pt-0.5 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                              {milestone.title}
                            </h3>
                            <span className="text-[11px] text-slate-400 tabular-nums">
                              {milestone.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (5 cols): Recipient + Items + Bottom Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Recipient Card */}
            <section className="bg-white rounded-3xl border border-surface-border p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-herbal-600" />
                <span>Tujuan Pengiriman &amp; Penerima</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-slate-900">{order.customerName}</h2>
                <span className="font-mono text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {order.phone}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                {order.address}, {order.city} {order.postalCode}
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-herbal-700">
                <Check className="w-4 h-4 shrink-0" />
                <span>Kemasan Segel Higienis Terverifikasi</span>
              </div>
            </section>

            {/* Items in Package Card */}
            <section className="bg-white rounded-3xl border border-surface-border p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <PackageCheck className="w-4 h-4 text-herbal-600" />
                  <span>Item Dalam Paket ({totalProductsCount} Produk)</span>
                </div>
                <span className="text-xs font-extrabold text-herbal-700 tabular-nums">
                  Total {formatRupiah(order.total)}
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantLabel}`}
                    className="flex items-center gap-3"
                  >
                    <ResilientImage
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-slate-800 truncate">
                        {item.productName}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.variantLabel} · {item.quantity}x · {item.registrationNumber}
                      </p>
                      <p className="text-xs font-bold text-herbal-700 mt-0.5 tabular-nums">
                        {formatRupiah(item.lineTotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-herbal-50/70 border border-herbal-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-herbal-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-herbal-900 leading-relaxed">
                  <strong className="font-bold">Jaminan Mutu:</strong> Paket dilapisi kardus tebal
                  bersegel hologram. Jika segel rusak saat tiba, tolak paket dan foto untuk retur
                  instan gratis.
                </p>
              </div>
            </section>

            {/* Bottom Actions */}
            <div className="space-y-3 no-print">
              {order.status === 'Selesai' ? (
                <div className="w-full py-3.5 px-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pesanan Telah Diterima &amp; Selesai
                </div>
              ) : (
                <button
                  type="button"
                  disabled={order.status !== 'Dalam Pengiriman Ekspedisi' || confirming}
                  onClick={handleConfirmDeliveryClick}
                  className={`w-full py-3.5 px-5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    order.status === 'Dalam Pengiriman Ekspedisi'
                      ? 'bg-slate-200/80 hover:bg-herbal-600 hover:text-white text-slate-600 cursor-pointer'
                      : 'bg-slate-200/70 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {confirming
                      ? 'Memproses Konfirmasi...'
                      : order.status === 'Dalam Pengiriman Ekspedisi'
                      ? 'Konfirmasi Pesanan Diterima (Menunggu Kurir)'
                      : 'Konfirmasi Pesanan Diterima (Menunggu Pembayaran)'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={onBackHome}
                className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda &amp; Katalog Produk
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
