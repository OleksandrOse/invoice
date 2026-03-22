import React from 'react';
import { TouristTax } from '../types/invoice';
import { FormSection } from './FormSection';
import { fmt } from '../utils/invoice';
import '../styles/TouristTaxForm.scss';

interface Props {
  touristTax: TouristTax;
  total: number;
  onChange: (patch: Partial<TouristTax>) => void;
}

export const TouristTaxForm: React.FC<Props> = ({ touristTax, total, onChange }) => (
  <FormSection label="Kurtaxe">
    <div className="row3">
      <div>
        <label>Ночей</label>
        <input
          type="number"
          min="0"
          value={touristTax.nights}
          onChange={e => onChange({ nights: e.target.value })}
          placeholder="9"
        />
      </div>
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
        <label>€ / Nacht / Person</label>
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
        {touristTax.nights} Nacht × {touristTax.persons} Person × {touristTax.pricePerNight} € = <strong>{fmt(total)}</strong>
      </div>
    )}
  </FormSection>
);
