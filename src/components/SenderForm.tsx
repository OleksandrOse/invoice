import React from 'react';
import { t } from '../utils/translations';
import { SenderInfo } from '../types/invoice';
import { FormSection } from './FormSection';
import '../styles/SenderForm.scss';

interface Props {
  sender: SenderInfo;
  onChange: (patch: Partial<SenderInfo>) => void;
  language: 'de' | 'en';
  onLanguageChange: (lang: 'de' | 'en') => void;
}

export const SenderForm: React.FC<Props> = ({ sender, onChange, language, onLanguageChange }) => {
  const tr = t[language];
  return(
  <FormSection label={tr.sender}>
    <label>{tr.language}</label>
    <div className="row">
      <button
        type="button"
        className={`lang-btn${language === 'de' ? ' active' : ''}`}
        onClick={() => onLanguageChange('de')}
      >
        Deutsch
      </button>
      <button
        type="button"
        className={`lang-btn${language === 'en' ? ' active' : ''}`}
        onClick={() => onLanguageChange('en')}
      >
        English
      </button>
    </div>
    <label>{tr.name}</label>
    <input value={sender.name} onChange={e => onChange({ name: e.target.value })} placeholder="Dr. Elena Schollenberg" />

    <label>{tr.company}</label>
    <input value={sender.company} onChange={e => onChange({ company: e.target.value })} placeholder="Wilena Apartments" />

    <div className="row">
      <div>
        <label>{tr.address}</label>
        <input value={sender.address} onChange={e => onChange({ address: e.target.value })} />
      </div>
      <div>
        <label>{tr.city}</label>
        <input value={sender.city} onChange={e => onChange({ city: e.target.value })} />
      </div>
    </div>

    <div className="row">
      <div>
        <label>Email</label>
        <input type="email" value={sender.email} onChange={e => onChange({ email: e.target.value })} />
      </div>
      <div>
        <label>{tr.phone}</label>
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
)
};
