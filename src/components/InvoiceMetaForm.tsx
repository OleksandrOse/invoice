import React from 'react';
import { InvoiceMeta } from '../types/invoice';
import { FormSection } from './FormSection';
import  '../styles/InvoiceMetaForm.scss';

interface Props {
  meta: InvoiceMeta;
  onChange: (patch: Partial<InvoiceMeta>) => void;
}

export const InvoiceMetaForm: React.FC<Props> = ({ meta, onChange }) => (
  <FormSection label="Kontodaten">
    <div className="row">
      <div>
        <label>Rechnungsdatum</label>
        <input type="date" value={meta.date} onChange={e => onChange({ date: e.target.value })} />
      </div>
      <div>
        <label>Kontonummer</label>
        <input value={meta.invoiceNo} onChange={e => onChange({ invoiceNo: e.target.value })} />
      </div>
    </div>
  </FormSection>
);
