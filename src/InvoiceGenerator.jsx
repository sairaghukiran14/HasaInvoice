import React, { useState, useRef } from "react";
import { Download, Plus, Trash2, Eye, FileText } from "lucide-react";

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "INV-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    notes: "",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
  });

  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef();

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index, field, value) => {
    setInvoiceData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === "quantity" || field === "rate") {
        newItems[index].amount =
          newItems[index].quantity * newItems[index].rate;
      }

      return { ...prev, items: newItems };
    });
  };

  const updateField = (field, value) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const generatePDF = () => {
    window.print();
  };

  const InvoicePreview = () => (
    <div
      className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
      ref={printRef}
    >
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">INVOICE</h1>
            <p className="text-lg text-gray-600">
              #{invoiceData.invoiceNumber}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Invoice Date</div>
            <div className="font-semibold">{invoiceData.date}</div>
            {invoiceData.dueDate && (
              <>
                <div className="text-sm text-gray-600 mb-1 mt-2">Due Date</div>
                <div className="font-semibold">{invoiceData.dueDate}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">From:</h3>
          <div className="text-gray-700">
            <div className="font-semibold">
              {invoiceData.companyName || "Your Company Name"}
            </div>
            <div className="whitespace-pre-line">
              {invoiceData.companyAddress}
            </div>
            {invoiceData.companyEmail && <div>{invoiceData.companyEmail}</div>}
            {invoiceData.companyPhone && <div>{invoiceData.companyPhone}</div>}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">To:</h3>
          <div className="text-gray-700">
            <div className="font-semibold">
              {invoiceData.clientName || "Client Name"}
            </div>
            <div className="whitespace-pre-line">
              {invoiceData.clientAddress}
            </div>
            {invoiceData.clientEmail && <div>{invoiceData.clientEmail}</div>}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">
                Qty
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                Rate
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">
                  {item.description || "Item description"}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  ${item.rate.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                  ${item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b">
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Tax (10%):</span>
            <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-lg border-b-2 border-gray-400">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {invoiceData.notes && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Notes:</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {invoiceData.notes}
          </p>
        </div>
      )}
    </div>
  );

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
          }
        `}</style>

        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6 no-print">
            <h2 className="text-2xl font-bold text-gray-800">
              Invoice Preview
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <FileText size={18} />
                Edit Invoice
              </button>
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>

          <div className="print-area">
            <InvoicePreview />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hasa Invoice
          </h1>
          <p className="text-gray-600">
            Create professional invoices with ease
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invoice Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Invoice Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) =>
                      updateField("invoiceNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => updateField("dueDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Your Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={invoiceData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={invoiceData.companyAddress}
                  onChange={(e) =>
                    updateField("companyAddress", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Your company address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={invoiceData.companyEmail}
                    onChange={(e) =>
                      updateField("companyEmail", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="company@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={invoiceData.companyPhone}
                    onChange={(e) =>
                      updateField("companyPhone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
              Client Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={invoiceData.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Client Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Email
                </label>
                <input
                  type="email"
                  value={invoiceData.clientEmail}
                  onChange={(e) => updateField("clientEmail", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="client@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Address
              </label>
              <textarea
                value={invoiceData.clientAddress}
                onChange={(e) => updateField("clientAddress", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Client address"
              />
            </div>
          </div>

          {/* Items */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Items</h2>
              <button
                onClick={addItem}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      Description
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center w-24">
                      Qty
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right w-32">
                      Rate
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right w-32">
                      Amount
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center w-20">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(index, "description", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "rate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-200 rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          disabled={invoiceData.items.length === 1}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax (10%):</span>
                  <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg border-t">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Additional notes or payment terms..."
            />
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowPreview(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-lg font-semibold"
            >
              <Eye size={20} />
              Preview & Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
