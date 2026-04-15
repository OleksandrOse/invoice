import React from 'react';
import { SenderInfo } from '../types/invoice';
import { FormSection } from './FormSection';
import '../styles/SenderForm.scss';

interface Props {
  sender: SenderInfo;
  onChange: (patch: Partial<SenderInfo>) => void;
}

export const SenderForm: React.FC<Props> = ({ sender, onChange }) => (
  <FormSection label="Absender">
    <label>Vorname / Nachname</label>
    <input value={sender.name} onChange={e => onChange({ name: e.target.value })} placeholder="Dr. Elena Schollenberg" />

    <label>Firma / Wohnung</label>
    <input value={sender.company} onChange={e => onChange({ company: e.target.value })} placeholder="Wilena Apartments" />

    <div className="row">
      <div>
        <label>Adresse</label>
        <input value={sender.address} onChange={e => onChange({ address: e.target.value })} />
      </div>
      <div>
        <label>Stadt / Postleitzahl</label>
        <input value={sender.city} onChange={e => onChange({ city: e.target.value })} />
      </div>
    </div>

    <div className="row">
      <div>
        <label>Email</label>
        <input type="email" value={sender.email} onChange={e => onChange({ email: e.target.value })} />
      </div>
      <div>
        <label>Telefonnummer</label>
        <input value={sender.phone} onChange={e => onChange({ phone: e.target.value })} />
      </div>
    </div>

    <div className="row">
      <div>
        <label>Bank</label>
        <input value={sender.bank} onChange={e => onChange({ bank: e.target.value })} />
      </div>
      <div>
        <label>IBAN</label>
        <input value={sender.iban} onChange={e => onChange({ iban: e.target.value })} />
      </div>
    </div>

    <label>BIC</label>
    <input value={sender.bic} onChange={e => onChange({ bic: e.target.value })} />
  </FormSection>
);
