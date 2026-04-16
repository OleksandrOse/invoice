import { InvoiceFormData, InvoiceTotals } from '../types/invoice';
import { fmt, formatDate } from './invoice';

const fontToBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  const mime = url.endsWith('.otf') ? 'font/otf' : 'font/ttf';
  return `data:${mime};base64,${base64}`;
};

export const printInvoice = async (form: InvoiceFormData, totals: InvoiceTotals): Promise<void> => {
  const { sender, recipient, meta, touristTax, extraItems, discount } = form;

  const origin = window.location.origin;
  let pos = 0;
  const [brushBase64, gothicBase64] = await Promise.all([
    fontToBase64(`${origin}/invoice/fonts/Brush/BrushScriptOpti-Regular.otf`),
    fontToBase64(`${origin}/invoice/fonts/Gothic/SpecialGothic-Regular.ttf`),
  ]);

  const recipientName =
    recipient.type === 'company'
      ? recipient.company || '—'
      : recipient.name || '—';

  const hasTax = !!(touristTax.nights && touristTax.persons);

  const recipientExtra =
    recipient.type === 'person' && recipient.company
      ? `${recipient.company}<br>`
      : '';

  const taxRow = hasTax
    ? `<tr>
        <td class="l">${++pos}</td>
        <td class="l">Ubernachtung</td>
        <td class="c">${touristTax.nights}</td>
        <td class="c">Nacht</td>
        <td class="r">${parseFloat(touristTax.price || '0').toFixed(2)} €</td>
        <td class="r">${fmt(totals.ubernachtungTotal)}</td>
      </tr>
      <tr>
        <td class="l">${++pos}</td>
        <td class="l">Tourist Tax (${touristTax.persons} Persons</td>
        <td class="c">${touristTax.nights}</td>
        <td class="c">Nacht/Pers.</td>
        <td class="r">${parseFloat(touristTax.pricePerNight || '0').toFixed(2)} €</td>
        <td class="r">${fmt(totals.touristTaxTotal)}</td>
       </tr>`
    : '';

  const extraRows = extraItems
    .filter(i => i.name)
    .map(item => {
      const lt = parseFloat(item.qty || '0') * parseFloat(item.price || '0');
      return `<tr>
        <td class="l">${++pos}</td>
        <td>${item.name}</td>
        <td class="c">${item.qty}</td>
        <td class="c">Stk.</td>
        <td class="r">${parseFloat(item.price || '0').toFixed(2)} €</td>
        <td class="r">${fmt(lt)}</td>
      </tr>`;
    }).join('');

  const hasRows = hasTax || extraItems.some(i => i.name);
  const emptyRow = !hasRows
    ? `<tr><td colspan="5" class="empty">— keine Positionen —</td></tr>`
    : '';

  const summaryRows = totals.discountVal > 0
    ? `<div class="s-line"><span>Zwischensumme:</span><span>${fmt(totals.subtotal)}</span></div>
       <div class="s-line red"><span>Rabatt (-${discount}%)</span><span>-${fmt(totals.discountVal)}</span></div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=794, initial-scale=1.0, maximum-scale=1.0"/>
<title>Rechnung Nr. ${meta.invoiceNo}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  @font-face {
    font-family: 'Brush';
    src: url('${brushBase64}') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Gothic';
    src: url('${gothicBase64}') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{
    font-family:'DM Sans',sans-serif;
    background:#fff;
    color:#222;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  }
  .page{
    width:210mm;
    min-height:297mm;
    margin:0 auto;
    display:flex;
    flex-direction:column;
    background:#fff;
  }
  .hdr{
    background:#1e2d45;
    padding:2.2rem 2.8rem;
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
  }
  .logo{display:flex;flex-direction:column;align-items:flex-start;line-height:1;}
  .logo-title{
    font-family:'Brush',cursive;
    font-size:78px;font-weight:400;
    color:#fff;
    margin-left:-3px;
    line-height:0.95;
    letter-spacing:1px;
  }
  .logo-subtitle{
    font-family:'Gothic',sans-serif;
    font-weight:400;
    font-size:24px;
    color:rgba(255,255,255,.85);
    letter-spacing:8px;
    margin-top:-10px;
    margin-bottom:6px;
  }
  .logo-sub-name{
    font-size:11px;font-weight:400;
    color:rgba(255,255,255,.5);
    letter-spacing:.05em;
    margin-top:2px;
  }
  .hdr-right{text-align:right;}
  .inv-title{
    font-family:'Playfair Display',serif;
    font-size:2.6rem;font-weight:400;
    letter-spacing:.2em;text-transform:uppercase;
    color:#fff;line-height:1;
  }
  .inv-meta{
    font-size:11.5px;
    color:rgba(255,255,255,.55);
    margin-top:10px;line-height:2;
  }
  .body{padding:2.2rem 2.8rem;flex:1;}
  .info-row{
    display:grid;grid-template-columns:1fr 1fr;
    gap:2.5rem;margin-bottom:2.2rem;
  }
  .info-lbl{font-size:12px;font-weight:700;color: #999;margin-bottom:5px;text-transform: uppercase;}
  .info-name{font-size:14px;font-weight:700;color: #1a1a2e;}
  .info-val{font-size:13px;color:#444;line-height:1.75;}
  table{width:100%;border-collapse:collapse;}
  thead tr{border-bottom:2px solid #1e2d45;}
  th{
    font-size:10.5px;font-weight:700;
    text-transform:uppercase;letter-spacing:.07em;
    color:#1e2d45;padding:9px 0;text-align:left;
  }
  th.c{text-align:center;}
  th.r{text-align:right;}
  tbody tr{border-bottom:1px solid #ebebeb;}
  td{font-size:13px;color:#333;padding:11px 0;text-align:left;}
  td.c{text-align:center;}
  td.r{text-align:right;}
  td.l{text-align:left;}
  .empty{text-align:center!important;color:#bbb;font-style:italic;padding:1.8rem 0!important;}
  .summary{
    display:flex;justify-content:flex-end;
    margin-top:1.8rem;
    padding-top:1.2rem;
    border-top:1.5px solid #ccc;
  }
  .summary-inner{width:260px;}
  .s-line{
    display:flex;justify-content:space-between;
    font-size:13px;color:#444;padding:4px 0;
  }
  .s-line.red{color:#b04040;}
  .s-line.total{
    font-size:15px;font-weight:700;color:#1e2d45;
    border-top:2px solid #1e2d45;
    padding-top:9px;margin-top:5px;
  }
  .bank {
    background: #f8f4ee;
    border-left: 3px solid #c9a96e;
    padding: 12px 16px;
    margin-top: 24px;
    font-size: 11px;
    color: #555;
    line-height: 1.9;
  }
  strong {
    color: #1a1a2e;
    font-size: 12px;
  }
  .ftr{
    background:#1e2d45;
    padding:1rem 2.8rem;
    display:flex;justify-content:space-between;
    align-items:center;flex-wrap:wrap;gap:.75rem;
    margin-top:auto;
  }
  .ftr-item{
    display:flex;align-items:center;gap:7px;
    font-size:11px;color:rgba(255,255,255,.6);
  }
  .ftr-icon{
    width:18px;height:18px;
    border:1.5px solid rgba(255,255,255,.35);
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:9px;color:rgba(255,255,255,.55);
    flex-shrink:0;
  }
  @media print{
    @page{
      margin:0;
      size:210mm 297mm portrait;
      -webkit-margin-before:0;
      -webkit-margin-after:0;
    }
    html,body{
      margin:0;
      padding:0;
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
    }
    .page{
      width:210mm !important;
      max-width:210mm !important;
      min-height:297mm;
      height:297mm;
      overflow:hidden;
      page-break-after:avoid;
      page-break-inside:avoid;
    }
  }
</style>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var page = document.querySelector('.page');
    var pageH = page.scrollHeight;
    var maxH = 297 * 3.7795; // 297mm в пікселях
    if (pageH > maxH) {
      var scale = maxH / pageH;
      page.style.transformOrigin = 'top left';
      page.style.transform = 'scale(' + scale + ')';
      page.style.width = (100 / scale) + '%';
      document.body.style.height = maxH + 'px';
      document.body.style.overflow = 'hidden';
    }
  });
</script>
</head>
<body>
<div class="page">
  <div class="hdr">
    <div class="logo">
      <div class="logo-title">${(sender.company || 'Wilena').split(' ')[0]}</div>
      <div class="logo-subtitle">${(sender.company || 'Wilena apartments').split(' ').slice(1).join(' ') || 'apartments'}</div>
      <div class="logo-sub-name">${sender.name || ''}</div>
    </div>
    <div class="hdr-right">
      <div class="inv-title">Rechnung</div>
      <div class="inv-meta">
        Rechnungsnummer: ${meta.invoiceNo}<br>
        Datum: ${formatDate(meta.date)}<br>
        ${sender.email}
      </div>
    </div>
  </div>
  <div class="body">
    <div class="info-row">
      <div>
        <div class="info-lbl">Von</div>
        <div class="info-name">${sender.name}</div>
        <div class="info-val">
          ${sender.company}<br>  
          ${sender.address}<br>
          ${sender.city}
        </div>
      </div>
      <div>
        <div class="info-lbl">An</div>
        <div class="info-name">${recipientName}</div>
        <div class="info-val">
          ${recipientExtra}
          ${recipient.address || ''}<br>
          ${recipient.city}
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th class="l">Pos.</th>
          <th class="l">Bezeichnung</th>
          <th class="c">Menge</th>
          <th class="c">Einheit</th>
          <th class="r">Einzelpreis</th>
          <th class="r">Gesamt (€)</th>
        </tr>
      </thead>
      <tbody>
        ${taxRow}
        ${extraRows}
        ${emptyRow}
      </tbody>
    </table>
    <div class="summary">
      <div class="summary-inner">
        ${summaryRows}
        <div class="s-line total">
          <span>Gesamtsumme:</span>
          <span>${fmt(totals.total)}</span>
        </div>
      </div>
    </div>
    <div class="bank">
      <strong class="strong">${sender.company}</strong><br />
      <strong class="strong">${sender.name}</strong><br />
      ${sender.bank}<br />
      IBAN: ${sender.iban}<br />
      BIC: ${sender.bic}
    </div>
  </div>
  
  <div class="ftr">
    <div class="ftr-item"><div class="ftr-icon">☎</div><span>${sender.phone}</span></div>
    <div class="ftr-item"><div class="ftr-icon">✉</div><span>${sender.email}</span></div>
    <div class="ftr-item"><div class="ftr-icon">⌂</div><span>${sender.address}, ${sender.city}</span></div>
  </div>
</div>
<script>
  window.onload = function() {
    document.fonts.ready.then(function() {
      window.print();
      window.onafterprint = function() { window.close(); };
    });
  };
</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};
