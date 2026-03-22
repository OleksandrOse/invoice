import { useState } from 'react';
import {
  InvoiceFormData,
  LineItem,
  RecipientType,
  SenderInfo,
  RecipientInfo,
  TouristTax,
  InvoiceMeta,
} from '../types/invoice';
import { calcTotals, defaultFormData, generateId } from '../utils/invoice';

export const useInvoiceForm = () => {
  const [form, setForm] = useState<InvoiceFormData>(defaultFormData());

  const setSender = (patch: Partial<SenderInfo>) =>
    setForm(f => ({ ...f, sender: { ...f.sender, ...patch } }));

  const setRecipient = (patch: Partial<RecipientInfo>) =>
    setForm(f => ({ ...f, recipient: { ...f.recipient, ...patch } }));

  const setRecipientType = (type: RecipientType) =>
    setForm(f => ({ ...f, recipient: { ...f.recipient, type } }));

  const setMeta = (patch: Partial<InvoiceMeta>) =>
    setForm(f => ({ ...f, meta: { ...f.meta, ...patch } }));

  const setTouristTax = (patch: Partial<TouristTax>) =>
    setForm(f => ({ ...f, touristTax: { ...f.touristTax, ...patch } }));

  const setDiscount = (discount: string) =>
    setForm(f => ({ ...f, discount }));

  const addItem = () =>
    setForm(f => ({
      ...f,
      extraItems: [
        ...f.extraItems,
        { id: generateId(), name: '', qty: '', price: '' },
      ],
    }));

  const removeItem = (id: string) =>
    setForm(f => ({
      ...f,
      extraItems: f.extraItems.filter(item => item.id !== id),
    }));

  const updateItem = (id: string, patch: Partial<Omit<LineItem, 'id'>>) =>
    setForm(f => ({
      ...f,
      extraItems: f.extraItems.map(item =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));

  const totals = calcTotals(form);

  return {
    form,
    totals,
    setSender,
    setRecipient,
    setRecipientType,
    setMeta,
    setTouristTax,
    setDiscount,
    addItem,
    removeItem,
    updateItem,
  };
};
