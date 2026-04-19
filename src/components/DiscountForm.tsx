import React from 'react';
import { t } from '../utils/translations';
import { FormSection } from './FormSection';

interface Props {
  discount: string;
  onChange: (val: string) => void;
  language: 'de' | 'en';
}

export const DiscountForm: React.FC<Props> = ({ discount, onChange, language }) => {
  const tr = t[language];
  return(
  <FormSection label={tr.discount}>
    <label>{tr.discount} (%)</label>
    <input
      type="number"
      min="0"
      max="100"
      step="0.1"
      value={discount}
      onChange={e => onChange(e.target.value)}
      placeholder="0"
    />
  </FormSection>
)
};
