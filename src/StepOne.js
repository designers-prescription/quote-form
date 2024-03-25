import React, { useState } from 'react';
import { auth, db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import StandUpPouches from './components/StandUpPouches';
import Boxes from './components/Boxes';
import Bottles from './components/Bottles';
// Import other product type components

const StepOne = () => {
  const [user] = useAuthState(auth);
  const [productType, setProductType] = useState('');
  const [productFields, setProductFields] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [salesRepName, setSalesRepName] = useState('');

  const updateProductFields = (field, value) => {
    setProductFields({ ...productFields, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quoteId = uuidv4();
    const quoteData = {
      createdBy: user.uid,
      createdOn: serverTimestamp(),
      customerName,
      salesRepName,
      product: {
        type: productType,
        fields: productFields,
      },
    };
    try {
      await setDoc(doc(db, 'QuoteRequirements', quoteId), quoteData);
      // Handle success, e.g., show a message or redirect
  
      // Reset the form to its initial state
      setCustomerName('');
      setSalesRepName('');
      setProductType('');
      setProductFields({});
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const renderProductForm = () => {
    switch (productType) {
      case 'standUpPouches':
        return <StandUpPouches product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'boxes':
        return <Boxes product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'bottles':
        return <Bottles product={{ fields: productFields }} updateProduct={updateProductFields} />;
      // Add cases for other product types
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: 'auto' }}>
      <h2 style={{textAlign:'center'}}>Step One: Quote Requirements</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
        />
        <input
          type="text"
          value={salesRepName}
          onChange={(e) => setSalesRepName(e.target.value)}
          placeholder="Sales Rep Name"
        />
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        >
          <option value="">Select Product Type</option>
          <option value="standUpPouches">Stand Up Pouches</option>
          <option value="boxes">Boxes</option>
          <option value="bottles">Bottles</option>
          {/* Add more product types as needed */}
        </select>

        {renderProductForm()}

        <button type="submit">Submit Quote</button>
      </form>
    </div>
  );
};

export default StepOne;
