import { InvoiceFormData, InvoiceTotals } from '../types/invoice';

export const fmt = (n: number): string =>
  n.toFixed(2).replace('.', ',') + ' €';

export const formatDate = (d: string): string => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}.${m}.${y}`;
};

export const calcTotals = (data: InvoiceFormData): InvoiceTotals => {
  const { touristTax, extraItems, discount } = data;

  const touristTaxTotal =
    parseFloat(touristTax.nights || '0') *
    parseFloat(touristTax.persons || '0') *
    parseFloat(touristTax.pricePerNight || '0');

  const ubernachtungTotal =
    parseFloat(touristTax.nights || '0') *
    parseFloat(touristTax.price || '0');

  const extraTotal = extraItems.reduce(
    (sum, item) =>
      sum + parseFloat(item.qty || '0') * parseFloat(item.price || '0'),
    0
  );

  const subtotal = touristTaxTotal + extraTotal + ubernachtungTotal;
  const discountVal = discount
    ? (subtotal * parseFloat(discount)) / 100
    : 0;
  const total = subtotal - discountVal;

  return { ubernachtungTotal, touristTaxTotal, extraTotal, subtotal, discountVal, total };
};

export const generateId = (): string =>
  Math.random().toString(36).slice(2, 9);

export const defaultFormData = (): InvoiceFormData => ({
  sender: {
    name: 'Dr. Elena Schollenberg',
    company: 'Wilena apartments',
    address: 'Warmbader Allee 53, 172/166',
    city: '9504 Villach',
    email: 'wilena@speed.at',
    phone: '+43 664 73784888',
    bank: 'Hypo Salzburg',
    iban: 'AT573400064704493128',
    bic: 'RZ00AT2L',
  },
  recipient: {
    type: 'company',
    name: '',
    company: '',
    address: '',
    city: '',
  },
  meta: {
    invoiceNo: '001',
    date: new Date().toISOString().split('T')[0],
  },
  touristTax: {
    nights: '',
    persons: '',
    pricePerNight: '2.70',
    price: '100',
  },
  extraItems: [],
  discount: '',
});
