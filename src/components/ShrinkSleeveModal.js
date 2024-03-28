import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

const ShrinkSleeveModal = ({ quote, onClose }) => {
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
            [`productPricing.${field}`]: additionalData[field]
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
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Quote - Shrink Sleeves</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Material: {realTimeQuote.product.fields.material}</p>
                <p>Size: {realTimeQuote.product.fields.size}</p>
                <p>Order over 10K: {realTimeQuote.product.fields.orderOver10K}</p>
                <p>Finish type: {realTimeQuote.product.fields.finishType}</p>
                <p>Finish option: {realTimeQuote.product.fields.finishOption}</p>
                <p>Qty of SKU's: {realTimeQuote.product.fields.qtyOfSKUs}</p>
                <p>Total Qty: {realTimeQuote.product.fields.totalQty}</p>

                {Object.keys(additionalData).map((field) => (
                    <React.Fragment key={field}>
                        {realTimeQuote.productPricing?.[field] ? (
                            <p>{formatFieldName(field)}: {realTimeQuote.productPricing[field]}</p>
                        ) : (
                            <Form.Group className="mb-3">
                                <Form.Label>{formatFieldName(field)}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={field}
                                    value={additionalData[field]}
                                    onChange={handleChange}
                                />
                                <Button onClick={() => handleUpdateQuote(field)}>Save</Button>
                            </Form.Group>
                        )}
                    </React.Fragment>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShrinkSleeveModal;
