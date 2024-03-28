import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ShrinkSleeveModal = ({ show, onHide, quote, handleChange, handleUpdateQuote, additionalData }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Shrink Sleeve Quote</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="product-form">
          <div className="form-group">
            <label>Custom Die Cut Shape Pouch:</label>
            <p>{quote.product.fields.customDieCutShape}</p>
          </div>
          <div className="form-group">
            <label>Pouch Type:</label>
            <p>{quote.product.fields.pouchType}</p>
          </div>
          <div className="form-group">
            <label>Environmentally Friendly:</label>
            <p>{quote.product.fields.environmentallyFriendly}</p>
            {quote.product.fields.environmentallyFriendly === 'yes' && (
              <p>{quote.product.fields.environmentalOption}</p>
            )}
          </div>
          <div className="form-group">
            <label>Child Proof:</label>
            <p>{quote.product.fields.childProof}</p>
          </div>
        </div>

        <Form>
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
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateQuote}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShrinkSleeveModal;
