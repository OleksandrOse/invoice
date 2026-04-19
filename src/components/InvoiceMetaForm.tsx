import React from 'react';
import { InvoiceMeta } from '../types/invoice';
import { FormSection } from './FormSection';
import { t } from '../utils/translations';
import  '../styles/InvoiceMetaForm.scss';

interface Props {
  meta: InvoiceMeta;
  onChange: (patch: Partial<InvoiceMeta>) => void;
  language: 'de' | 'en';
}

export const InvoiceMetaForm: React.FC<Props> = ({ meta, onChange, language }) => {
  const tr = t[language];
  return(
  <FormSection label={tr.information}>
    <div className="row">
      <div>
        <label>{tr.invoiceDate}</label>
        <input type="date" value={meta.date} onChange={e => onChange({ date: e.target.value })} />
      </div>
      <div>
        <label>{tr.invoiceNo}</label>
        <input value={meta.invoiceNo} onChange={e => onChange({ invoiceNo: e.target.value })} />
      </div>
    </div>
  </FormSection>
)
};
