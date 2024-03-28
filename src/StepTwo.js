import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import StandUpPouchModal from './components/StandUpPouchModal';
import ShrinkSleeveModal from './components/ShrinkSleeveModal';
// Import other product type modals

const StepTwo = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuote(null);
  };

  const renderModal = () => {
    switch (selectedQuote?.product.type) {
      case 'Stand Up Pouches':
        return <StandUpPouchModal quote={selectedQuote} onClose={handleCloseModal} setQuote={setQuotes} />;
      case 'Shrink Sleeves':
        return <ShrinkSleeveModal quote={selectedQuote} onClose={handleCloseModal} />;
      // Add cases for other product types
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
            <th>Customer Name</th>
            <th>Sales Rep Name</th>
            <th>Product Type</th>
            <th>Created On</th>
            <th>Action</th>
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

      {showModal && renderModal()}
    </div>
  );
};

export default StepTwo;
