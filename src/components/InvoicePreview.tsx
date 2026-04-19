import React from 'react';
import { SenderInfo, RecipientInfo, InvoiceMeta, InvoiceFormData, InvoiceTotals } from '../types/invoice';
import { fmt, formatDate } from '../utils/invoice';
import { t, Lang } from '../utils/translations';
import '../styles/InvoicePreview.scss';

interface HeaderProps {
  sender: SenderInfo;
  meta: InvoiceMeta;
  lang: Lang;
}

const InvoiceHeader: React.FC<HeaderProps> = ({ sender, meta, lang }) => {
  const tr = t[lang];
  return(
  <div className="header">
    <div className="logoArea">
      <div className="companyName">
        <div className="logo-title">Wilena</div>
        <div className="logo-subtitle">apartments</div>
      </div>
      <div className="companySub">{sender.name}</div>
    </div>
    <div className="titleArea">
      <div className="title">{tr.invoice}</div>
      <div className="meta">
        {meta.invoiceNo && <>{tr.invoiceNo}: {meta.invoiceNo}<br /></>}
        {tr.date}: {formatDate(meta.date)}<br />
        {sender.email}
      </div>
    </div>
  </div>
)
};

interface AddressesProps {
  sender: SenderInfo;
  recipient: RecipientInfo;
  lang: Lang;
}

const InvoiceAddresses: React.FC<AddressesProps> = ({ sender, recipient, lang }) => {
  const recipientName =
    recipient.type === 'company'
      ? recipient.company || '—'
      : recipient.name || '—';

  const tr = t[lang];
  return (
    <div className="addresses">
      <div>
        <div className="addrLabel">{tr.from}</div>
        <div className="addrName">{sender.name || '—'}</div>
        <div className="addrDetail">
          {sender.company && <>{sender.company}<br /></>}
          {sender.address && <>{sender.address}<br /></>}
          {sender.city}
        </div>
      </div>
      <div>
        <div className="addrLabel">{tr.to}</div>
        <div className="addrName">{recipientName}</div>
        <div className="addrDetail">
          {recipient.type === 'person' && recipient.company && (
            <>{recipient.company}<br /></>
          )}
          {recipient.address && <>{recipient.address}<br /></>}
          {recipient.city}
        </div>
      </div>
    </div>
  );
};

interface TableProps {
  form: InvoiceFormData;
  touristTaxTotal: number;
  ubernachtungTotal: number;
  lang: Lang;
}

const InvoiceTable: React.FC<TableProps> = ({ form, touristTaxTotal, ubernachtungTotal, lang }) => {
  const { touristTax, extraItems } = form;
  const hasTax = !!(touristTax.nights && touristTax.persons);
  const tr = t[lang];
  let pos = 0;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>{tr.pos}</th>
          <th>{tr.description}</th>
          <th>{tr.qty}</th>
          <th>{tr.unit}</th>
          <th>{tr.unitPrice}</th>
          <th>{tr.total}</th>
        </tr>
      </thead>
      <tbody>
        {hasTax && (
          <>
            <tr>
              <td className="num">{++pos}</td>
              <td>{tr.overnight}</td>
              <td className="num">{touristTax.nights}</td>
              <td>{tr.nights}</td>
              <td className="num">
                {parseFloat(touristTax.price || '0').toFixed(2)}
              </td>
              <td className="num">{fmt(ubernachtungTotal)}</td>
            </tr>
            <tr>
              <td className="num">{++pos}</td>
              <td>Tourist Tax {touristTax.persons} {tr.persons}</td>
              <td className="num">{touristTax.nights}</td>
              <td>{tr.nightsPers}</td>
              <td className="num">
                {parseFloat(touristTax.pricePerNight || '0').toFixed(2)}
              </td>
              <td className="num">{fmt(touristTaxTotal)}</td>
            </tr>
          </>
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
              {tr.noItems}
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
  lang: Lang
}

const InvoiceTotalsBlock: React.FC<TotalsProps> = ({ totals, discount, lang }) => {
  const tr = t[lang];
  return(
  <div className="totalsWrap">
    <div className="totalsInner">
      {totals.discountVal > 0 && (
        <>
          <div className="totalRow">
            <span>{tr.subtotal}</span>
            <span>{fmt(totals.subtotal)}</span>
          </div>
          <div className={`totalRow discount`}>
            <span>{tr.discount} ({discount}%)</span>
            <span>−{fmt(totals.discountVal)}</span>
          </div>
        </>
      )}
      <div className={`totalRow final`}>
        <span>{tr.grandTotal}</span>
        <span>{fmt(totals.total)}</span>
      </div>
    </div>
  </div>
)
};

interface BankInfoProps {
  sender: SenderInfo;
}

const InvoiceBankInfo: React.FC<BankInfoProps> = ({ sender }) => {
  return(

  <div className="bank">
    <strong>{sender.company}</strong><br />
    <strong>{sender.name}</strong><br />
    {sender.bank}<br />
    IBAN: {sender.iban}<br />
    BIC: {sender.bic}
  </div>

)
};

// ─── Footer ───────────────────────────────────────────────────────────────────

interface FooterProps {
  sender: SenderInfo;
}

const InvoiceFooter: React.FC<FooterProps> = ({ sender }) => (

  <div className="footer">
    <div className="footerItem">
      <span className="dot" />
      {sender.phone}
    </div>
    <div className="footerItem">
      <span className="dot" />
      {sender.email}
    </div>
    <div className="footerItem">
      <span className="dot" />
      {sender.address}, {sender.city}
    </div>
  </div>

);

// ─── InvoicePreview (export) ──────────────────────────────────────────────────

interface Props {
  form: InvoiceFormData;
  totals: InvoiceTotals;
}

export const InvoicePreview: React.FC<Props> = ({ form, totals }) => {
  const lang: Lang = (form.meta.language ?? 'de') as Lang;
  return(
  <div className="invoice">
    <InvoiceHeader sender={form.sender} meta={form.meta}  lang={lang}/>
    <div className="body">
      <InvoiceAddresses sender={form.sender} recipient={form.recipient} lang={lang} />
      <div className="divider" />
      <InvoiceTable form={form} touristTaxTotal={totals.touristTaxTotal} ubernachtungTotal={totals.ubernachtungTotal} lang={lang} />
      <InvoiceTotalsBlock totals={totals} discount={form.discount} lang={lang} />
      <InvoiceBankInfo sender={form.sender} />
    </div>
    <InvoiceFooter sender={form.sender} />
  </div>
)};
