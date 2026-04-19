import React from 'react';
import { TouristTax } from '../types/invoice';
import { FormSection } from './FormSection';
import { fmt } from '../utils/invoice';
import { t } from '../utils/translations';
import '../styles/TouristTaxForm.scss';

interface Props {
  touristTax: TouristTax;
  total: number;
  onChange: (patch: Partial<TouristTax>) => void;
  language: 'de' | 'en';
}

export const TouristTaxForm: React.FC<Props> = ({ touristTax, total, onChange, language }) => {
  const tr = t[language];
  return(
  <FormSection label={tr.roomRate}>
     <div className="row">
      <div>
        <label>Price</label>
        <input
          type="number"
          value={touristTax.price} onChange={e => onChange({ price: e.target.value })} />
      </div>
        <div>
        <label>{tr.nights}</label>
        <input
          type="number"
          min="0"
          value={touristTax.nights}
          onChange={e => onChange({ nights: e.target.value })}
          placeholder="9"
        />
      </div>
    </div>
    <div className="row">
      <div>
        <label>Person</label>
        <input
          type="number"
          min="0"
          value={touristTax.persons}
          onChange={e => onChange({ persons: e.target.value })}
          placeholder="6"
        />
      </div>
      <div>
        <label>€ / {tr.nights} / Person</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={touristTax.pricePerNight}
          onChange={e => onChange({ pricePerNight: e.target.value })}
        />
      </div>
    </div>
    {total > 0 && (
      <div className="preview">
        {touristTax.nights} {tr.nights} × {touristTax.persons} Person × {touristTax.pricePerNight} € = <strong>{fmt(total)}</strong>
      </div>
    )}
  </FormSection>
)
};
