import React, { useState } from 'react';
import { db } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';

const StandUpPouchModal = ({ quote, onClose }) => {
  const [additionalData, setAdditionalData] = useState({
    unitPrice: '',
    overallPrice: '',
    oneTimeCharges: '',
    priceNegotiated: '',
    unitsPerBox: '',
    totalBoxes: '',
    boxDimensions: '',
    weightPerBox: '',
    totalWeight: '',
  });

  const handleChange = (e) => {
    setAdditionalData({ ...additionalData, [e.target.name]: e.target.value });
  };

  const handleUpdateQuote = async () => {
    const quoteRef = doc(db, 'QuoteRequirements', quote.id);
    await updateDoc(quoteRef, {
      ...quote,
      ...additionalData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white rounded-lg max-w-md p-6 mx-auto">
          <div className="text-lg font-semibold mb-4">Edit Quote - Stand Up Pouches</div>
          <div className="mb-4">
            <p>Material: {quote.product.fields.material}</p>
            <p>Finish Type: {quote.product.fields.finishType}</p>
            {/* Add more fields to display existing data */}
          </div>
          <form>
            <div className="mb-4">
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">Unit Price</label>
              <input
                type="text"
                id="unitPrice"
                name="unitPrice"
                value={additionalData.unitPrice}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>
            {/* Add more form fields for other data */}
          </form>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-light hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
              onClick={handleUpdateQuote}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandUpPouchModal;
