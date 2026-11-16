import type { OrderRecord } from '../types/herbal.ts';

export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function downloadOrderInvoice(order: OrderRecord): void {
  const itemRows = order.items
    .map(
      (item, idx) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">${idx + 1}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">
          <strong>${item.productName}</strong><br/>
          <span style="color:#64748b;font-size:12px;">${item.variantLabel} · ${item.registrationNumber}</span>
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatRupiah(item.unitPrice)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">${formatRupiah(item.lineTotal)}</td>
      </tr>`
    )
    .join('');

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${order.orderNumber} — HerbalStore</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #1a2e26; max-width: 760px; margin: 32px auto; padding: 0 20px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 24px; }
    .brand { font-size: 22px; font-weight: 800; color: #142820; }
    .brand span { color: #059669; }
    .meta { text-align: right; font-size: 13px; color: #475569; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; font-size: 13px; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; }
    th { background: #f0fdf4; color: #065f46; text-align: left; padding: 10px 8px; border-bottom: 1px solid #bbf7d0; }
    .totals { width: 280px; margin-left: auto; font-size: 13px; }
    .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
    .grand { font-size: 16px; font-weight: 800; color: #047857; border-top: 1px solid #cbd5e1; padding-top: 8px; margin-top: 6px; }
    .note { margin-top: 28px; font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Herbal<span>Store</span></div>
      <div style="font-size:12px;color:#64748b;">Katalog Herbal Alami Terdaftar BPOM</div>
    </div>
    <div class="meta">
      <div><strong>Invoice:</strong> ${order.orderNumber}</div>
      <div><strong>Tanggal:</strong> ${order.createdAtLabel}</div>
      <div><strong>Resi (AWB):</strong> ${order.awbNumber}</div>
    </div>
  </div>
  <div class="grid">
    <div class="box">
      <div style="font-weight:700;margin-bottom:6px;">Penerima & Tujuan</div>
      <div>${order.customerName} (${order.phone})</div>
      <div>${order.address}, ${order.city} ${order.postalCode}</div>
    </div>
    <div class="box">
      <div style="font-weight:700;margin-bottom:6px;">Pengiriman & Pembayaran</div>
      <div>Ekspedisi: ${order.courierName}</div>
      <div>Status Pesanan: ${order.status}</div>
      <div>Status Pembayaran: ${order.paymentStatus}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Produk</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Harga</th>
        <th style="text-align:right;">Subtotal</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>
  <div class="totals">
    <div><span>Subtotal Produk</span><span>${formatRupiah(order.subtotal)}</span></div>
    <div><span>Ongkos Kirim</span><span>${order.shippingCost === 0 ? 'Gratis' : formatRupiah(order.shippingCost)}</span></div>
    ${order.discount > 0 ? `<div><span>Diskon Promo</span><span>-${formatRupiah(order.discount)}</span></div>` : ''}
    <div class="grand"><span>Total Tagihan</span><span>${formatRupiah(order.total)}</span></div>
  </div>
  <div class="note">
    Bukti transaksi resmi HerbalStore Indonesia. Produk herbal adalah pendukung kebugaran dan bukan pengganti diagnosis atau obat dokter.
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${order.orderNumber.replace('#', '')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
