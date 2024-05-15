import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

const ShippingModal = ({ quote, onClose, userRole }) => {
  const [additionalData, setAdditionalData] = useState({
    commodityType: '',
    totalUnitsPerCommodity: '',
    numberOfUnitsPerBox: '',
    totalNumberOfBoxesPerCommodity: '',
    shipBoxDimensions: { length: '', breadth: '', height: '' },
    shipWeightPerBox: '',
    totalQtyOfBoxesPerCommodity: '',
    totalValuePerProductPerSize: '',
    overallValueForTheShipment: '',
    shippingVolumePerProduct: '',
    totalVolumeForTheWholeOrder: '',
    fromShippingAddress: '',
    toShippingAddress: '',
    splitShipping: '',
    palletize: '',
  });

  const [realTimeQuote, setRealTimeQuote] = useState(quote);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'QuoteRequirements', quote.id), (doc) => {
      setRealTimeQuote({ id: doc.id, ...doc.data() });
      setAdditionalData((prevData) => ({
        ...prevData,
        ...doc.data().productShipping,
      }));
    });

    return () => unsubscribe();
  }, [quote.id]);

  const handleChange = (e, fieldName) => {
    const { name, value } = e.target;
    if (fieldName) {
      const updatedField = { ...additionalData[fieldName], [name]: value };
      setAdditionalData((prevData) => ({
        ...prevData,
        [fieldName]: updatedField,
      }));
    } else {
      setAdditionalData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUpdateQuote = async (field) => {
    const quoteRef = doc(db, 'QuoteRequirements', realTimeQuote.id);
    await updateDoc(quoteRef, {
      [`productShipping.${field}`]: additionalData[field],
    });
  };

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
          <div className="text-lg font-semibold mb-4">Edit Shipping Pricing - {realTimeQuote.product.type}</div>
          {realTimeQuote.product.artwork && (
            <div className="mb-4">
              <img src={realTimeQuote.product.artwork} alt="Product Artwork" className="max-w-full h-auto" />
            </div>
          )}
          {realTimeQuote.product.fields.bottleImage && (
            <div className="mb-4">
              <img src={realTimeQuote.product.fields.bottleImage} alt="Bottle" className="max-w-full h-auto" />
            </div>
          )}
          <div className="text-sm font-semibold mb-4">Packaging Requirements - {realTimeQuote.product.type}</div>
          <div className="mb-4 grid text-sm grid-cols-4">
            {Object.entries(realTimeQuote.product.fields).sort((a, b) => a[0].localeCompare(b[0])).map(([key, value]) => (
              key !== 'bottleImage' && key !== 'artwork' && (
                <p key={key} className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'>
                  <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(key)}: </span>
                  {typeof value === 'object' && value !== null ? `${value.width} Width (in Inches) x ${value.height} Height (in Inches)` : value}
                </p>
              )
            ))}
          </div>
          <div className="text-sm font-semibold mb-4">Packaging Pricing - {realTimeQuote.product.type}</div>
          <div className="mb-4 grid text-sm grid-cols-4">
            {Object.entries(realTimeQuote.productPricing).sort((a, b) => a[0].localeCompare(b[0])).map(([key, value]) => (
              <p key={key} className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'>
                <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(key)}: </span>
                {typeof value === 'object' && value !== null ? (
                  <>
                    {Object.entries(value).map(([subKey, subVal]) => (
                      <span className='block' key={subKey}>
                        <p className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>{formatFieldName(subKey)}:</p>
                        {subVal}
                      </span>
                    ))}
                  </>
                ) : (
                  value
                )}
              </p>
            ))}
          </div>
          <form className="grid grid-cols-2 gap-4">
            {Object.entries(additionalData).map(([field, value]) => (
              <React.Fragment key={field}>
                {realTimeQuote.productShipping?.[field] ? (
                  <p key={field} className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'>
                    <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(field)}: </span>
                    {typeof value === 'object' && value !== null ? (
                      <>
                        {Object.entries(value).map(([subKey, subVal]) => (
                          <span className='block' key={subKey}>
                            <p className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>{formatFieldName(subKey)}:</p>
                            {subVal}
                          </span>
                        ))}
                      </>
                    ) : (
                      value
                    )}
                  </p>
                ) : (
                  (userRole === 'ShippingAdmin' || userRole === 'PackagingAdmin') && (
                    <div className='col-span-2'>
                      <div className="mb-4 grid grid-cols-3 gap-4 middle">
                        {field === 'shipBoxDimensions' ? (
                          <>
                            <div className='col-span-1'>
                              <label htmlFor="length" className="tracking-wide text-sm font-bold leading-6 text-gray-900">Length</label>
                              <input
                                type="text"
                                id="length"
                                name="length"
                                value={additionalData.shipBoxDimensions.length}
                                onChange={(e) => handleChange(e, 'shipBoxDimensions')}
                                placeholder="Length (in inches)"
                                className="block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                              />
                            </div>
                            <div className='col-span-1'>
                              <label htmlFor="breadth" className="tracking-wide text-sm font-bold leading-6 text-gray-900">Breadth</label>
                              <input
                                type="text"
                                id="breadth"
                                name="breadth"
                                value={additionalData.shipBoxDimensions.breadth}
                                onChange={(e) => handleChange(e, 'shipBoxDimensions')}
                                placeholder="Breadth (in inches)"
                                className="block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                              />
                            </div>
                            <div className='col-span-1'>
                              <label htmlFor="height" className="tracking-wide text-sm font-bold leading-6 text-gray-900">Height</label>
                              <input
                                type="text"
                                id="height"
                                name="height"
                                value={additionalData.shipBoxDimensions.height}
                                onChange={(e) => handleChange(e, 'shipBoxDimensions')}
                                placeholder="Height (in inches)"
                                className="block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                              />
                            </div>
                          </>
                        ) : (
                          <div className='col-span-2'>
                            <label htmlFor={field} className="tracking-wide text-sm font-bold leading-6 text-gray-900">{formatFieldName(field)}</label>
                            <input
                              type="text"
                              id={field}
                              name={field}
                              value={additionalData[field]}
                              onChange={(e) => handleChange(e)}
                              className="block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                            />
                          </div>
                        )}
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
                  )
                )}
              </React.Fragment>
            ))}
          </form>
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

export default ShippingModal;