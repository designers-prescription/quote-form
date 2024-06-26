import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

const ShippingPricingQuoteModal = ({ quote, userRole, onClose }) => {
  const [additionalData, setAdditionalData] = useState({
    expressAir: '',
    regularAir: '',
    regularSeaLimitedContainer: '',
    expressSeaLimitedContainer: ''
  });

  const [realTimeQuote, setRealTimeQuote] = useState(quote);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'QuoteRequirements', quote.id), (doc) => {
      setRealTimeQuote({ id: doc.id, ...doc.data() });
    });

    return () => unsubscribe();
  }, [quote.id]);

  const handleChange = (e) => {
    setAdditionalData({ ...additionalData, [e.target.name]: e.target.value });
  };

  const handleUpdateQuote = async (field) => {
    const quoteRef = doc(db, 'QuoteRequirements', realTimeQuote.id);
    await updateDoc(quoteRef, {
      [`productShippingPricing.${field}`]: additionalData[field]
    });

    setAdditionalData({ ...additionalData, [field]: '' });
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black w-full opacity-50"></div>
        <div className="relative bg-white rounded-lg p-6 m-2 w-7/12">
          <div className="text-lg font-semibold mb-4">Shipping Pricing Details</div>
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Shipping Requirements</h3>
            <div className="grid text-sm grid-cols-3">
              {Object.keys(realTimeQuote.productShipping)
                .sort((a, b) => a.localeCompare(b))
                .map((field) => (
                  <p key={field} className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'>
                    <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(field)}: </span>
                    {realTimeQuote.productShipping[field]}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Shipping Pricing</h3>
            {userRole === 'ShippingAdmin' ? (
              <form className='grid grid-cols-2 gap-4'>
                {Object.keys(additionalData).map((field) => (
                  <React.Fragment key={field}>
                    {realTimeQuote.productShippingPricing?.[field] ? (
                      <p className='text-sm p-2 mb-4 rounded-md border border-dashed border-slate-500 bg-slate-50'>
                        <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(field)}: </span>
                        {realTimeQuote.productShippingPricing[field]}
                      </p>
                    ) : (
                      <div className='col-span-2'>
                        <div className="mb-4 grid grid-cols-3 gap-4 middle">
                          <div className='col-span-2'>
                            <label htmlFor={field} className="tracking-wide text-sm font-bold leading-6 text-gray-900">{formatFieldName(field)}</label>
                            <input
                              type="text"
                              id={field}
                              name={field}
                              value={additionalData[field]}
                              onChange={handleChange}
                              className="block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                          </div>
                          <div className='flex flex-col justify-end'>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuote(field)}
                              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(realTimeQuote.productShippingPricing || {})
                  .sort((a, b) => a.localeCompare(b))
                  .map((field) => (
                    <p key={field} className='col-span-2 p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'>
                      <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(field)}: </span>
                      {realTimeQuote.productShippingPricing[field]}
                    </p>
                  ))}
              </div>
            )}
          </div>
          <div className="mt-6">
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

export default ShippingPricingQuoteModal;
