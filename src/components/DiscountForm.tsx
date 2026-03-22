import React from 'react';
import { FormSection } from './FormSection';

interface Props {
  discount: string;
  onChange: (val: string) => void;
}

export const DiscountForm: React.FC<Props> = ({ discount, onChange }) => (
  <FormSection label="Rabatt">
    <label>Rabatt (%)</label>
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
);
