import React from 'react';
import { useInvoiceForm } from './hooks/useinvoiceform';
import { SenderForm } from './components/SenderForm';
import { RecipientForm } from './components/RecipientForm';
import { InvoiceMetaForm } from './components/InvoiceMetaForm';
import { TouristTaxForm } from './components/TouristTaxForm';
import { ExtraItemsForm } from './components/ExtraltemsForm';
import { DiscountForm } from './components/DiscountForm';
import { InvoicePreview } from './components/InvoicePreview';
import { printInvoice } from './utils/printInvoice';
import './styles/App.scss';
import './styles/global.scss';

const App: React.FC = () => {
  const {
    form, totals,
    setSender, setRecipient, setRecipientType,
    setMeta, setTouristTax, setDiscount,
    addItem, removeItem, updateItem,
  } = useInvoiceForm();

  const handlePrint = () => { printInvoice(form, totals); };
  return (
    <div className="app">
      <div className="form-panel">
        <div className="panel-title">Kontogenerator</div>
        <SenderForm sender={form.sender} onChange={setSender} />
        <RecipientForm
          recipient={form.recipient}
          onChange={setRecipient}
          onTypeChange={setRecipientType}
        />
        <InvoiceMetaForm meta={form.meta} onChange={setMeta} />
        <TouristTaxForm
          touristTax={form.touristTax}
          total={totals.touristTaxTotal}
          onChange={setTouristTax}
        />
        <ExtraItemsForm
          items={form.extraItems}
          onAdd={addItem}
          onRemove={removeItem}
          onUpdate={updateItem}
        />
        <DiscountForm discount={form.discount} onChange={setDiscount} />
      </div>

      <div className="preview-panel">
        <div className="invoice-wrapper">
          <InvoicePreview form={form} totals={totals} />
          <button className="print-btn" onClick={handlePrint}>
            PDF drucken / speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
