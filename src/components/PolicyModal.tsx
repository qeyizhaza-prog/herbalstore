import { ShieldCheck, X } from 'lucide-react';

export type PolicyTopic = 'shipping' | 'warranty' | 'terms' | 'privacy';

interface PolicyModalProps {
  topic: PolicyTopic | null;
  onClose: () => void;
}

const POLICY_CONTENT: Record<
  PolicyTopic,
  { title: string; subtitle: string; paragraphs: string[] }
> = {
  shipping: {
    title: 'Kebijakan Pengiriman & Pengembalian',
    subtitle: 'Standar pengemasan higienis & jaminan keutuhan segel produk herbal',
    paragraphs: [
      'Pesanan yang terverifikasi sebelum pukul 15.00 WIB pada hari kerja (Senin–Sabtu) diproses dan diserahkan ke ekspedisi pada hari yang sama.',
      'Setiap botol kapsul, cairan madu, dan seduhan teh dilapisi bubble wrap ganda, silica gel food-grade, dan kardus tebal bersegel hologram.',
      'Gratis ongkos kirim otomatis berlaku untuk pengiriman Reguler wilayah Jawa–Bali dengan minimum belanja Rp 150.000.',
      'Jika segel hologram rusak atau kemasan bocor saat diterima, pelanggan berhak menolak paket atau mengirimkan foto dalam 2×24 jam via WhatsApp CS untuk penggantian instan gratis.',
    ],
  },
  warranty: {
    title: 'Garansi Produk Asli & Legalitas',
    subtitle: 'Komitmen transparansi komposisi & izin edar resmi',
    paragraphs: [
      'Seluruh produk di HerbalStore diperoleh langsung dari produsen dan distributor resmi bersertifikat CPOTB/BPOM atau P-IRT.',
      'Setiap item mencantumkan nomor registrasi resmi, nomor batch produksi, serta tanggal kedaluwarsa yang dapat diperiksa langsung pada kemasan fisik.',
      'Kami menjamin 100% produk bebas dari Bahan Kimia Obat (BKO) sintetis berbahaya.',
    ],
  },
  terms: {
    title: 'Syarat & Ketentuan Layanan',
    subtitle: 'Pedoman transaksi & edukasi konsumsi bertanggung jawab',
    paragraphs: [
      'HerbalStore menyediakan informasi produk secara faktual berdasarkan label resmi dan bukan merupakan layanan diagnosis medis atau resep dokter.',
      'Harga dan stok produk divalidasi secara langsung pada server saat proses konfirmasi checkout untuk mencegah selisih harga maupun overselling.',
      'Konsumen dianjurkan membaca aturan pakai, peringatan, dan kontraindikasi sebelum mengonsumsi suplemen herbal secara rutin.',
    ],
  },
  privacy: {
    title: 'Kebijakan Privasi Data Pelanggan',
    subtitle: 'Minimisasi data untuk kenyamanan guest checkout',
    paragraphs: [
      'HerbalStore menerapkan alur belanja tamu (guest checkout) tanpa mewajibkan pembuatan akun atau pengumpulan riwayat medis pribadi.',
      'Data nama, nomor WhatsApp, dan alamat pengiriman hanya digunakan untuk memproses pesanan, menerbitkan resi pengiriman, dan memberikan informasi status paket.',
      'Kami tidak menyimpan informasi kartu pembayaran atau kredensial perbankan pengguna di server kami.',
    ],
  },
};

export function PolicyModal({ topic, onClose }: PolicyModalProps) {
  if (!topic) return null;
  const content = POLICY_CONTENT[topic];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={onClose}
        />
        <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-herbal-100 text-herbal-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{content.title}</h3>
                <p className="text-[11px] text-slate-500">{content.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Tutup informasi"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 space-y-3 text-xs text-slate-600 leading-relaxed">
            {content.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-herbal-600 hover:bg-herbal-700 text-white text-xs font-semibold rounded-lg transition"
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
