import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
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
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Quote - Stand Up Pouches</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display existing data */}
        <p>Material: {quote.product.fields.material}</p>
        <p>Finish Type: {quote.product.fields.finishType}</p>
        {/* Add more fields to display existing data */}

        {/* Form to add additional data */}
        <Form>
          {/* Add form fields for additional data */}
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateQuote}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StandUpPouchModal;
