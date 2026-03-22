export type RecipientType = 'company' | 'person';

export interface LineItem {
  id: string;
  name: string;
  qty: string;
  price: string;
}

export interface SenderInfo {
  name: string;
  company: string;
  address: string;
  city: string;
  email: string;
  bank: string;
  iban: string;
  bic: string;
}

export interface RecipientInfo {
  type: RecipientType;
  name: string;
  company: string;
  address: string;
}

export interface TouristTax {
  nights: string;
  persons: string;
  pricePerNight: string;
}

export interface InvoiceMeta {
  invoiceNo: string;
  date: string;
}

export interface InvoiceFormData {
  sender: SenderInfo;
  recipient: RecipientInfo;
  meta: InvoiceMeta;
  touristTax: TouristTax;
  extraItems: LineItem[];
  discount: string;
}

export interface InvoiceTotals {
  touristTaxTotal: number;
  extraTotal: number;
  subtotal: number;
  discountVal: number;
  total: number;
}
