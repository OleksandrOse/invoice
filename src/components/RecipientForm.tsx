import React from 'react';
import { RecipientInfo, RecipientType } from '../types/invoice';
import { FormSection } from './FormSection';
import '../styles/RecipientForm.scss';

interface Props {
  recipient: RecipientInfo;
  onChange: (patch: Partial<RecipientInfo>) => void;
  onTypeChange: (type: RecipientType) => void;
}

export const RecipientForm: React.FC<Props> = ({ recipient, onChange, onTypeChange }) => (
  <FormSection label="Empfänger">
    <div className="typeToggle">
      <button
        className={recipient.type === 'company' ? 'active' : ''}
        onClick={() => onTypeChange('company')}
        type="button"
      >
        Firma
      </button>
      <button
        className={recipient.type === 'person' ? 'active' : ''}
        onClick={() => onTypeChange('person')}
        type="button"
      >
        Privatperson
      </button>
    </div>

    <label>{recipient.type === 'company' ? 'Name der Firma' : "Vorname / Nachname"}</label>
    <input
      value={recipient.type === 'company' ? recipient.company : recipient.name}
      onChange={e =>
        onChange(recipient.type === 'company' ? { company: e.target.value } : { name: e.target.value })
      }
      placeholder={recipient.type === 'company' ? 'Haapsalu VET Center' : 'Max Mustermann'}
    />

    {recipient.type === 'person' && (
      <>
        <label>Firma (optional)</label>
        <input value={recipient.company} onChange={e => onChange({ company: e.target.value })} />
      </>
    )}

    <div className="row">
      <div>
        <label>Adresse</label>
        <input value={recipient.address} onChange={e => onChange({ address: e.target.value })} />
      </div>
      <div>
        <label>Stadt / Postleitzahl</label>
        <input value={recipient.city} onChange={e => onChange({ city: e.target.value })} />
      </div>
    </div>
  </FormSection>
);
