import React from 'react';
import { t } from '../utils/translations';
import { RecipientInfo, RecipientType } from '../types/invoice';
import { FormSection } from './FormSection';
import '../styles/RecipientForm.scss';

interface Props {
  recipient: RecipientInfo;
  onChange: (patch: Partial<RecipientInfo>) => void;
  onTypeChange: (type: RecipientType) => void;
  language: 'de' | 'en';
}

export const RecipientForm: React.FC<Props> = ({ recipient, onChange, onTypeChange, language }) => {
  const tr = t[language];
  return(
  <FormSection label={tr.recipient}>
    <div className="typeToggle">
      <button
        className={recipient.type === 'company' ? 'active' : ''}
        onClick={() => onTypeChange('company')}
        type="button"
      >
        {tr.comp}
      </button>
      <button
        className={recipient.type === 'person' ? 'active' : ''}
        onClick={() => onTypeChange('person')}
        type="button"
      >
        {tr.private}
      </button>
    </div>

    <label>{recipient.type === 'company' ? `${tr.com}` : `${tr.name}`}</label>
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
        <label>{tr.address}</label>
        <input value={recipient.address} onChange={e => onChange({ address: e.target.value })} />
      </div>
      <div>
        <label>{tr.city}</label>
        <input value={recipient.city} onChange={e => onChange({ city: e.target.value })} />
      </div>
    </div>
  </FormSection>
)
};
