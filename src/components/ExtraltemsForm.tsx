import React from 'react';
import { LineItem } from '../types/invoice';
import { FormSection } from './FormSection';
import  '../styles/ExtraItemsForm.scss';

interface Props {
  items: LineItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<LineItem, 'id'>>) => void;
}

export const ExtraItemsForm: React.FC<Props> = ({ items, onAdd, onRemove, onUpdate }) => (
  <FormSection label="Zusätzliche Positionen">
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
          <label>Anzahl</label>
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
      + Position hinzufügen
    </button>
  </FormSection>
);
