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

  
    let artworkURL = null;
    if (productFields.artwork) {
      // Upload the artwork file to Firebase Storage
      const storageRef = ref(storage, `artwork/${productFields.artwork.name}`);
      const snapshot = await uploadBytes(storageRef, productFields.artwork);
      artworkURL = await getDownloadURL(snapshot.ref);
    }
  
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
      case 'Stand Up Pouches':
        return <StandUpPouches product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'Boxes':
        return <Boxes product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'Bottles':
        return <Bottles product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'caps':
        return <Caps product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'shrinkSleeves':
        return <div>Shrink Sleeves selected. No additional fields required.</div>;
      case 'blisters':
        return <Blisters product={{ fields: productFields }} updateProduct={updateProductFields} />;
      // Add cases for other product types
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>Step One: Quote Requirements</h2>
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
          <option value="caps">Caps</option>
          <option value="shrinkSleeves">Shrink Sleeves</option>
          <option value="blisters">Blisters</option>
          {/* Add more product types as needed */}
        </select>

        <div className='product-form'>
          {renderProductForm()}
        </div>

        {/* Additional fields */}
        <div className="product-form">
          <div className="form-group">
            <label>Is the order over 10K USD before shipping:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="orderOver10K"
                  checked={productFields.orderOver10K === 'yes'}
                  onChange={(e) => updateProductFields('orderOver10K', 'yes')}
                />
                Yes
              </label>
              <label>
              <input
                  type="radio"
                  name="orderOver10K"
                  checked={productFields.orderOver10K === 'no'}
                  onChange={(e) => updateProductFields('orderOver10K', 'no')}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Artwork:</label>
            <input
              type="file"
              onChange={(e) => updateProductFields('artwork', e.target.files[0])}
            />
            <small>Artwork is optional unless the order is over 10K</small>
          </div>

          <div className="form-group">
            <label>Material:</label>
            <input
              type="text"
              value={productFields.material || ''}
              onChange={(e) => updateProductFields('material', e.target.value)}
              placeholder="Material"
            />
          </div>

          <div className="form-group">
            <label>Finish Type:</label>
            <input
              type="text"
              value={productFields.finishType || ''}
              onChange={(e) => updateProductFields('finishType', e.target.value)}
              placeholder="Finish Type"
            />
          </div>

          <div className="form-group">
            <label>Finish Option:</label>
            <input
              type="text"
              value={productFields.finishOption || ''}
              onChange={(e) => updateProductFields('finishOption', e.target.value)}
              placeholder="Finish Option"
            />
          </div>

          <div className="form-group">
            <label>Size:</label>
            <input
              type="text"
              value={productFields.size || ''}
              onChange={(e) => updateProductFields('size', e.target.value)}
              placeholder="Size"
            />
          </div>

          <div className="form-group">
            <label>Qty of SKU's:</label>
            <input
              type="number"
              value={productFields.qtyOfSKUs || ''}
              onChange={(e) => updateProductFields('qtyOfSKUs', e.target.value)}
              placeholder="Qty of SKU's"
            />
          </div>

          <div className="form-group">
            <label>Total Qty:</label>
            <input
              type="number"
              value={productFields.totalQty || ''}
              onChange={(e) => updateProductFields('totalQty', e.target.value)}
              placeholder="Total Qty"
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Quote'}
        </button>
      </form>
    </div>
  );
};

export default StepOne;
