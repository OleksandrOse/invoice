import React from 'react';
import { LineItem } from '../types/invoice';
import { FormSection } from './FormSection';
import { t } from '../utils/translations';
import  '../styles/ExtraItemsForm.scss';

interface Props {
  items: LineItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<LineItem, 'id'>>) => void;
  language: 'de' | 'en';
}

export const ExtraItemsForm: React.FC<Props> = ({ items, onAdd, onRemove, onUpdate, language }) => {
  const tr = t[language];
  return(
  <FormSection label={tr.additional}>
    {items.map(item => (
      <div key={item.id} className="itemRow">
        <div>
          <label>Description</label>
          <input
            value={item.name}
            onChange={e => onUpdate(item.id, { name: e.target.value })}
            placeholder="Service"
          />
        </div>
        <div>
          <label>{tr.number}</label>
          <input
            type="number"
            min="0"
            value={item.qty}
            onChange={e => onUpdate(item.id, { qty: e.target.value })}
          />
        </div>
        <div>
          <label>Price €</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.price}
            onChange={e => onUpdate(item.id, { price: e.target.value })}
          />
        </div>
        <button
          className="removeBtn"
          onClick={() => onRemove(item.id)}
          type="button"
          aria-label="Entfernen"
        >
          ×
        </button>
      </div>
    ))}
    <button className="addBtn" onClick={onAdd} type="button">
      + {tr.add}
    </button>
  </FormSection>
)};
