import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Modal = ({ quote, onClose }) => {
  const [realTimeQuote, setRealTimeQuote] = useState(quote);
  const printRef = useRef();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'QuoteRequirements', quote.id), (doc) => {
      setRealTimeQuote({ id: doc.id, ...doc.data() });
    });

    return () => unsubscribe();
  }, [quote.id]);

  const formatFieldName = (fieldName) => {
    return fieldName
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black w-full opacity-50"></div>
        <div className="relative bg-white rounded-lg p-6 m-2 w-7/12">
          <div ref={printRef}>
            <div className="text-lg font-semibold mb-4">Quote Requirements - {realTimeQuote.product.type}</div>
            {realTimeQuote.product.fields.artwork && (
              <div className="mb-4">
                <img src={realTimeQuote.product.fields.artwork} alt="Product Artwork" className="max-w-full h-auto" />
              </div>
            )}
            {realTimeQuote.product.fields.bottleImage && (
              <div className="mb-4">
                <img src={realTimeQuote.product.fields.bottleImage} alt="Bottle" className="max-w-full h-auto" />
              </div>
            )}
            <div className="mb-4 grid text-sm grid-cols-4">
              {Object.entries(realTimeQuote.product.fields).sort((a, b) => a[0].localeCompare(b[0])).map(([key, value]) => (
                key !== 'bottleImage' && (
                  <p key={key} className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'>
                    <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(key)}: </span>
                    {typeof value === 'object' && value !== null ? `Width: ${value.width} x Height ${value.height} x Length ${value.length} x Gusset ${value.gusset}` : value}
                  </p>
                )
              ))}
            </div>
            <div className="mb-4 grid text-sm grid-cols-2 gap-4">
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity One Price: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity Two Price: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity Three Price: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Invoice Number: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quote Number: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Approved: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">One Time Charges: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Price Negotiated: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Units Per Box: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Total Boxes: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Box Dimensions (Length, Breadth, Height): </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Weight Per Box: </label>
                ____________________________________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Total Weight: </label>
                ____________________________________
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
