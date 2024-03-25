import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Modal, Button, Form } from 'react-bootstrap'; // Using react-bootstrap for modal and form

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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Quote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Render custom fields based on product type */}
          {selectedQuote && (
            <Form>
              {/* Additional form fields */}
              <Form.Group className="mb-3">
                <Form.Label>Unit Price</Form.Label>
                <Form.Control
                  type="text"
                  name="unitPrice"
                  value={additionalData.unitPrice}
                  onChange={handleChange}
                />
              </Form.Group>
              {/* Add more form groups for other fields */}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateQuote}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StepTwo;
