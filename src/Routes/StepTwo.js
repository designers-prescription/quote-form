import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import ShrinkSleeveModal from '../components/ShrinkSleevesModal';


const StepTwo = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    const fetchQuotes = async () => {
      const querySnapshot = await getDocs(collection(db, 'QuoteRequirements'));
      const quotesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuotes(quotesData);
    };

    fetchQuotes();
  }, []);

  const handleEditClick = (quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleUpdateQuote = async () => {
    if (selectedQuote) {
      const quoteRef = doc(db, 'QuoteRequirements', selectedQuote.id);
      await updateDoc(quoteRef, {
        ...additionalData,
        product: {
          ...selectedQuote.product,
          fields: {
            ...selectedQuote.product.fields,
            ...additionalData,
          },
        },
      });
      setShowModal(false);
      setAdditionalData({
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
    }
  };

  const handleChange = (e) => {
    setAdditionalData({ ...additionalData, [e.target.name]: e.target.value });
  };

  const renderEditModal = () => {
    switch (selectedQuote.product.type) {
      case 'Shrink Sleeves':
        return (
          <ShrinkSleeveModal
            show={showModal}
            onHide={() => setShowModal(false)}
            quote={selectedQuote}
            handleChange={handleChange}
            handleUpdateQuote={handleUpdateQuote}
            additionalData={additionalData}
          />
        );
      // Add cases for other product types and their respective modals
      default:
        return null;
    }
  };
  
  

  return (
    <div className='container'>
      <h2>Update Quote</h2>
      <table className='table'>
        <thead>
          <tr>
            <th scope="col">Customer Name</th>
            <th scope="col">Sales Rep Name</th>
            <th scope="col">Product Type</th>
            <th scope="col">Created On</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td>{quote.customerName}</td>
              <td>{quote.salesRepName}</td>
              <td>{quote.product.type}</td>
              <td>{quote.createdOn.toDate().toLocaleString()}</td>
              <td>
                <button onClick={() => handleEditClick(quote)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Render the appropriate edit modal based on the selected quote */}
      {selectedQuote && renderEditModal()}

    </div>
  );
};

export default StepTwo;
