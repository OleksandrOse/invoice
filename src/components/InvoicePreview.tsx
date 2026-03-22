import React from 'react';
import { SenderInfo, RecipientInfo, InvoiceMeta, InvoiceFormData, InvoiceTotals } from '../types/invoice';
import { fmt, formatDate } from '../utils/invoice';
import '../styles/InvoicePreview.scss';

interface HeaderProps {
  sender: SenderInfo;
  meta: InvoiceMeta;
}

const InvoiceHeader: React.FC<HeaderProps> = ({ sender, meta }) => (
  <div className="header">
    <div className="logoArea">
      <div className="companyName">
        <div className="logo-title">Wilena</div>
        <div className="logo-subtitle">apartments</div>
      </div>
      <div className="companySub">{sender.name}</div>
    </div>
    <div className="titleArea">
      <div className="title">Rechnung</div>
      <div className="meta">
        Nr. {meta.invoiceNo}<br />
        Datum: {formatDate(meta.date)}<br />
        {sender.email}
      </div>
    </div>
  </div>
);

interface AddressesProps {
  sender: SenderInfo;
  recipient: RecipientInfo;
}

const InvoiceAddresses: React.FC<AddressesProps> = ({ sender, recipient }) => {
  const recipientName =
    recipient.type === 'company'
      ? recipient.company || '—'
      : recipient.name || '—';

  return (
    <div className="addresses">
      <div>
        <div className="addrLabel">Von</div>
        <div className="addrName">{sender.name || '—'}</div>
        <div className="addrDetail">
          {sender.company && <>{sender.company}<br /></>}
          {sender.address && <>{sender.address}<br /></>}
          {sender.city}
        </div>
      </div>
      <div>
        <div className="addrLabel">An</div>
        <div className="addrName">{recipientName}</div>
        <div className="addrDetail">
          {recipient.type === 'person' && recipient.company && (
            <>{recipient.company}<br /></>
          )}
          {recipient.address}
        </div>
      </div>
    </div>
  );
};

interface TableProps {
  form: InvoiceFormData;
  touristTaxTotal: number;
}

const InvoiceTable: React.FC<TableProps> = ({ form, touristTaxTotal }) => {
  const { touristTax, extraItems } = form;
  const hasTax = !!(touristTax.nights && touristTax.persons);
  let pos = 0;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Pos.</th>
          <th>Bezeichnung</th>
          <th>Menge</th>
          <th>Einheit</th>
          <th>Einzelpreis</th>
          <th>Gesamt (€)</th>
        </tr>
      </thead>
      <tbody>
        {hasTax && (
          <tr>
            <td className="num">{++pos}</td>
            <td>Tourist Tax {touristTax.persons} Persons</td>
            <td className="num">{touristTax.nights}</td>
            <td>Nacht/Pers.</td>
            <td className="num">
              {parseFloat(touristTax.pricePerNight || '0').toFixed(2)}
            </td>
            <td className="num">{fmt(touristTaxTotal)}</td>
          </tr>
        )}
        {extraItems
          .filter(i => i.name)
          .map(item => {
            const lineTotal =
              parseFloat(item.qty || '0') * parseFloat(item.price || '0');
            return (
              <tr key={item.id}>
                <td className="num">{++pos}</td>
                <td>{item.name}</td>
                <td className="num">{item.qty}</td>
                <td>Stk.</td>
                <td className="num">
                  {parseFloat(item.price || '0').toFixed(2)}
                </td>
                <td className="num">{fmt(lineTotal)}</td>
              </tr>
            );
          })}
        {pos === 0 && (
          <tr>
            <td colSpan={6} className="empty">
              — keine Positionen —
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

// ─── Totals ───────────────────────────────────────────────────────────────────

interface TotalsProps {
  totals: InvoiceTotals;
  discount: string;
}

const InvoiceTotalsBlock: React.FC<TotalsProps> = ({ totals, discount }) => (
  <div className="totalsWrap">
    <div className="totalsInner">
      {totals.discountVal > 0 && (
        <>
          <div className="totalRow">
            <span>Zwischensumme</span>
            <span>{fmt(totals.subtotal)}</span>
          </div>
          <div className={`$totalRow} $discount}`}>
            <span>Rabatt ({discount}%)</span>
            <span>−{fmt(totals.discountVal)}</span>
          </div>
        </>
      )}
      <div className={`$totalRow} $final}`}>
        <span>Gesamt</span>
        <span>{fmt(totals.total)}</span>
      </div>
    </div>
  </div>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

interface FooterProps {
  sender: SenderInfo;
}

const InvoiceFooter: React.FC<FooterProps> = ({ sender }) => (
  <>
    <div className="bank">
      <strong>{sender.company} · {sender.name}</strong><br />
      {sender.bank}<br />
      IBAN: {sender.iban}<br />
      BIC: {sender.bic}
    </div>
    <div className="footer">
      <div className="footerItem">
        <span className="dot" />
        {sender.email}
      </div>
      <div className="footerItem">
        <span className="dot" />
        {sender.address}, {sender.city}
      </div>
    </div>
  </>
);

// ─── InvoicePreview (export) ──────────────────────────────────────────────────

interface Props {
  form: InvoiceFormData;
  totals: InvoiceTotals;
}

export const InvoicePreview: React.FC<Props> = ({ form, totals }) => (
  <div className="invoice">
    <InvoiceHeader sender={form.sender} meta={form.meta} />
    <div className="body">
      <InvoiceAddresses sender={form.sender} recipient={form.recipient} />
      <div className="divider" />
      <InvoiceTable form={form} touristTaxTotal={totals.touristTaxTotal} />
      <InvoiceTotalsBlock totals={totals} discount={form.discount} />
      <InvoiceFooter sender={form.sender} />
    </div>
  </div>
);
