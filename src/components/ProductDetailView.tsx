import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Info,
  Package,
  Plus,
  ShieldCheck,
  Slash,
} from 'lucide-react';
import { useState } from 'react';
import type { Product, ProductVariant } from '../types/herbal.ts';
import { formatRupiah } from '../utils/format.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, qty: number, variant?: ProductVariant) => void;
  onOpenProduct: (product: Product) => void;
}

export function ProductDetailView({
  product,
  relatedProducts,
  onBack,
  onAddToCart,
  onOpenProduct,
}: ProductDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [qty, setQty] = useState(1);

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const activePackage = selectedVariant ? selectedVariant.label : product.packageSize;
  const outOfStock = activeStock <= 0;

  return (
    <main className="flex-grow bg-surface-base py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-slate-500 flex-wrap"
          >
            <button
              type="button"
              onClick={onBack}
              className="hover:text-herbal-700 font-medium transition-colors"
            >
              Beranda
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={onBack}
              className="hover:text-herbal-700 font-medium transition-colors"
            >
              {product.categoryLabel}
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-herbal-700 truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-herbal-700 px-3 py-1.5 rounded-lg bg-white border border-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Katalog
          </button>
        </div>

        {/* Main Product Module */}
        <div className="bg-white rounded-3xl border border-surface-border p-5 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-3">
                <ResilientImage
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  className={`w-full h-full object-cover rounded-xl ${
                    outOfStock ? 'grayscale opacity-80' : ''
                  }`}
                />
                {outOfStock && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-lg bg-slate-900/80 text-white text-xs font-bold uppercase tracking-wider">
                      Stok Habis
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block">Nomor Batch</span>
                  <span className="font-mono font-bold text-slate-800">{product.batchCode}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block">Kedaluwarsa</span>
                  <span className="font-semibold text-slate-800">{product.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* Right Purchase & Transparency Module */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-herbal-700">{product.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>Produsen: {product.brand}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-600">{product.registrationNumber}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-slate-600">{product.shortBenefit}</p>
              </div>

              {/* Price & Stock */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">Harga Satuan ({activePackage})</span>
                  <span className="text-2xl font-extrabold text-herbal-700 tabular-nums">
                    {formatRupiah(activePrice)}
                  </span>
                </div>
                {outOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                    <Slash className="w-3.5 h-3.5" />
                    Habis (Dalam Restock)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold tabular-nums">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tersedia ({activeStock} unit)
                  </span>
                )}
              </div>

              {/* Variant Selector (only shown when product has variants per US-04) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-herbal-600" />
                    Informasi Kemasan &amp; Varian
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((variant) => {
                      const selected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => {
                            setSelectedVariant(variant);
                            setQty(1);
                          }}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-2 ${
                            selected
                              ? 'border-herbal-600 bg-herbal-50 text-herbal-800 ring-1 ring-herbal-600'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{variant.label}</span>
                          <span className="text-slate-400">·</span>
                          <span className="tabular-nums">{formatRupiah(variant.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center justify-between sm:justify-start border border-slate-200 rounded-xl bg-white px-2 py-1.5">
                  <button
                    type="button"
                    disabled={outOfStock || qty <= 1}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 font-bold text-base transition"
                    aria-label="Kurangi jumlah"
                  >
                    −
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900 tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    disabled={outOfStock || qty >= activeStock}
                    onClick={() => setQty((q) => Math.min(activeStock, q + 1))}
                    className="w-9 h-9 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 font-bold text-base transition"
                    aria-label="Tambah jumlah"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={() => onAddToCart(product, qty, selectedVariant)}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition ${
                    outOfStock
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-herbal-600 hover:bg-herbal-700 text-white shadow-md shadow-herbal-600/20'
                  }`}
                >
                  {outOfStock ? (
                    <>
                      <Slash className="w-4 h-4" />
                      Stok Tidak Tersedia
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Tambah ke Keranjang ({formatRupiah(activePrice * qty)})
                    </>
                  )}
                </button>
              </div>

              {/* Mandatory Herbal Product Information (PRD Section 9) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Deskripsi Produk
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-herbal-600" />
                      Komposisi Bahan
                    </h3>
                    <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                      {product.composition.map((comp) => (
                        <li key={comp}>{comp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-herbal-50/60 border border-herbal-200/80 space-y-2">
                    <h3 className="text-xs font-bold text-herbal-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-herbal-700" />
                      Aturan Penggunaan
                    </h3>
                    <p className="text-xs text-herbal-900 leading-relaxed">
                      {product.usageInstruction}
                    </p>
                    <p className="text-[11px] text-herbal-700 pt-1">
                      Penyimpanan: {product.storage}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs text-amber-950">
                    <span className="font-bold block">Peringatan &amp; Perhatian Khusus</span>
                    <p className="leading-relaxed">{product.warnings}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <Info className="w-4 h-4 text-herbal-600 shrink-0 mt-0.5" />
                  <p>
                    Bukan pengganti obat dokter atau tindakan medis. Hentikan pemakaian apabila
                    terjadi reaksi sensitivitas dan konsultasikan ke tenaga kesehatan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Pilihan Herbal Lainnya</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onOpenProduct(rel)}
                  className="text-left bg-white rounded-2xl border border-surface-border p-3.5 hover:shadow-md hover:border-herbal-200 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square rounded-xl bg-slate-50 overflow-hidden mb-2.5 p-1.5">
                      <ResilientImage
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{rel.categoryLabel}</p>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5">
                      {rel.name}
                    </h3>
                  </div>
                  <p className="text-sm font-bold text-herbal-700 mt-2 tabular-nums">
                    {formatRupiah(rel.price)}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
