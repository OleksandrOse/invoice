import { InvoiceFormData, InvoiceTotals } from '../types/invoice';
import { fmt, formatDate } from './invoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const fontToBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const icons = {
  phone: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>`,
  email: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  address: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
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
      ? `${recipient.company}<br>` : '';

  const taxRow = hasTax ? `
    <tr>
      <td class="l">${++pos}</td>
      <td class="l">Ubernachtung</td>
      <td class="c">${touristTax.nights}</td>
      <td class="c">Nacht</td>
      <td class="r">${parseFloat(touristTax.price || '0').toFixed(2)} €</td>
      <td class="r">${fmt(totals.ubernachtungTotal)}</td>
    </tr>
    <tr>
      <td class="l">${++pos}</td>
      <td class="l">Tourist Tax (${touristTax.persons} Persons)</td>
      <td class="c">${touristTax.nights}</td>
      <td class="c">Nacht/Pers.</td>
      <td class="r">${parseFloat(touristTax.pricePerNight || '0').toFixed(2)} €</td>
      <td class="r">${fmt(totals.touristTaxTotal)}</td>
    </tr>` : '';

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
    ? `<tr><td colspan="6" class="empty">— keine Positionen —</td></tr>` : '';

  const summaryRows = totals.discountVal > 0
    ? `<div class="s-line"><span>Zwischensumme:</span><span>${fmt(totals.subtotal)}</span></div>
       <div class="s-line red"><span>Rabatt (-${discount}%)</span><span>-${fmt(totals.discountVal)}</span></div>`
    : '';

  const safeName = (sender.name || '').replace(/ /g, '\u00A0');
  const safeCompany = (sender.company || '').replace(/ /g, '\u00A0');

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8"/>
<style>
  @font-face{font-family:'Brush';src:url('data:font/otf;base64,${brushBase64}') format('opentype');}
  @font-face{font-family:'Gothic';src:url('data:font/ttf;base64,${gothicBase64}') format('truetype');}
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:#fff;color:#222;width:794px;margin:0;padding:0;}
  .page{width:794px;height:1123px;display:flex;flex-direction:column;background:#fff;overflow:hidden;position:relative;}
  .hdr{background:#1e2d45;padding:35px 45px;display:flex;justify-content:space-between;align-items:flex-start;flex-shrink:0;}
  .logo{display:flex;flex-direction:column;align-items:flex-start;line-height:1;}
  .logo-title{font-family:'Brush',cursive;font-size:78px;font-weight:400;color:#fff;margin-left:-3px;line-height:0.95;}
  .logo-subtitle{font-family:'Gothic',sans-serif;font-size:24px;color:rgba(255,255,255,.85);letter-spacing:8px;margin-top:-10px;margin-bottom:6px;}
  .logo-sub-name{font-size:11px;color:rgba(255,255,255,.5);margin-top:2px;}
  .hdr-right{text-align:right;}
  .inv-title{font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:400;letter-spacing:.2em;text-transform:uppercase;color:#fff;}
  .inv-meta{font-size:11px;color:rgba(255,255,255,.55);margin-top:10px;line-height:2;}
  .body{padding:30px 45px;flex:1;overflow:hidden;}
  .info-row{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:28px;}
  .info-lbl{font-size:10px;font-weight:700;color:#999;margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em;}
  .info-name{font-size:14px;font-weight:700;color:#1a1a2e;}
  .info-val{font-size:12px;color:#444;line-height:1.75;margin-top:2px;}
  table{width:100%;border-collapse:collapse;}
  thead tr{border-bottom:2px solid #1e2d45;}
  th{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#1e2d45;padding:8px 0;text-align:left;}
  th.c{text-align:center;}th.r{text-align:right;}
  tbody tr{border-bottom:1px solid #ebebeb;}
  td{font-size:12px;color:#333;padding:9px 0;text-align:left;}
  td.c{text-align:center;}td.r{text-align:right;}td.l{text-align:left;}
  .empty{text-align:center!important;color:#bbb;font-style:italic;}
  .summary{display:flex;justify-content:flex-end;margin-top:20px;padding-top:14px;border-top:1.5px solid #ccc;}
  .summary-inner{width:240px;}
  .s-line{display:flex;justify-content:space-between;font-size:12px;color:#444;padding:3px 0;}
  .s-line.red{color:#b04040;}
  .s-line.total{font-size:14px;font-weight:700;color:#1e2d45;border-top:2px solid #1e2d45;padding-top:8px;margin-top:4px;}
  .bank{background:#f8f4ee;border-left:3px solid #c9a96e;padding:11px 15px;margin-top:18px;font-size:11px;color:#555;line-height:1.85;}
  .bank-line{display:block;line-height:1.9;word-spacing:0.08em;white-space:normal;overflow-wrap:break-word;}
  .bank strong{display:block;word-spacing:0.15em;letter-spacing:normal;}
  .bank-bold{font-weight:700;color:#1a1a2e;font-size:11px;white-space:normal;word-spacing:0.08em;letter-spacing:0.02em;}
  .ftr{background:#1e2d45;padding:14px 45px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
  .ftr-item{display:flex;align-items:center;gap:8px;font-size:11px;color:rgba(255,255,255,.6);}
  .ftr-item span{color:rgba(255,255,255,.6)!important;font-size:11px;}
  .ftr-icon{width:22px;height:22px;border:1.5px solid rgba(255,255,255,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
</style>
</head>
<body>
<div class="page" id="page">
  <div class="hdr">
    <div class="logo">
      <div class="logo-title">${(sender.company || 'Wilena').split(' ')[0]}</div>
      <div class="logo-subtitle">${(sender.company || 'Wilena apartments').split(' ').slice(1).join(' ') || 'apartments'}</div>
      <div class="logo-sub-name">${sender.name || ''}</div>
    </div>
    <div class="hdr-right">
      <div class="inv-title">Rechnung</div>
      <div class="inv-meta">
        ${meta.invoiceNo ? `Rechnungsnummer: ${meta.invoiceNo}<br>` : ''}
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
        <div class="info-val">${sender.company}<br>${sender.address}<br>${sender.city}</div>
      </div>
      <div>
        <div class="info-lbl">An</div>
        <div class="info-name">${recipientName}</div>
        <div class="info-val">${recipientExtra}${recipient.address || ''}<br>${recipient.city}</div>
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
      <tbody>${taxRow}${extraRows}${emptyRow}</tbody>
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
      <div class="bank-line bank-bold">${safeCompany}</div>
      <div class="bank-line bank-bold">${safeName}</div>
      <div class="bank-line">${sender.bank}</div>
      <div class="bank-line">IBAN: ${sender.iban}</div>
      <div class="bank-line">BIC: ${sender.bic}</div>
    </div>
  </div>
  <div class="ftr">
    <div class="ftr-item">
      <div class="ftr-icon">${icons.phone}</div>
      <span style="color:rgba(255,255,255,.6);">${sender.phone}</span>
    </div>
    <div class="ftr-item">
      <div class="ftr-icon">${icons.email}</div>
      <span style="color:rgba(255,255,255,.6);">${sender.email}</span>
    </div>
    <div class="ftr-item">
      <div class="ftr-icon">${icons.address}</div>
      <span style="color:rgba(255,255,255,.6);">${sender.address}, ${sender.city}</span>
    </div>
  </div>
</div>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:794px',
    'height:1123px',
    'border:none',
    'opacity:0',           
    'pointer-events:none',
    'z-index:-1',
  ].join(';');

  document.body.appendChild(iframe);

  await new Promise<void>((resolve, reject) => {
    iframe.onload = async () => {
      try {
        const doc = iframe.contentDocument!;

        try { await doc.fonts.ready; } catch {}

        await new Promise(r => setTimeout(r, 800));

        const pageEl = doc.getElementById('page')!;

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          allowTaint: false, 
          foreignObjectRendering: false,
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        pdf.save(`Rechnung-${meta.invoiceNo}.pdf`);

      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(iframe);
        resolve();
      }
    };

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    iframe.src = URL.createObjectURL(blob);
  });
};
