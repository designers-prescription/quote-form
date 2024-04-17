import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import StandUpPouches from '../components/StandUpPouches';
import Boxes from '../components/Boxes';
import Bottles from '../components/Bottles';
import Caps from '../components/Caps';
import Blisters from '../components/Blisters';
import Header from '../components/Header';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // Adjust the path to match your file structure
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StepOne = () => {
  const [user] = useAuthState(auth);
  const [productType, setProductType] = useState('');
  const [productFields, setProductFields] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [salesRepName, setSalesRepName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [skuTotalQty, setSkuTotalQty] = useState('');
  const [totalQtyOne, setTotalQtyOne] = useState('');
  const [totalQtyTwo, setTotalQtyTwo] = useState('');
  const [totalQtyThree, setTotalQtyThree] = useState('');

  useEffect(() => {
    let totalSkuQuantity = 0;
    for (let i = 1; i <= parseInt(productFields.numberOfSKUs, 10); i++) {
      totalSkuQuantity += parseInt(productFields[`sku${i}Quantity`], 10) || 0;
    }
    setSkuTotalQty(totalSkuQuantity);

    // Update total quantities based on business logic
    // setTotalQtyOne(totalSkuQuantity * 0.1);
    // setTotalQtyTwo(totalSkuQuantity * 0.4);
    // setTotalQtyThree(totalSkuQuantity * 0.5);
  }, [productFields]);

  const updateProductFields = (field, value) => {
    setProductFields({ ...productFields, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true

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
        fields: {
          ...productFields,
          artwork: artworkURL, // Store the URL of the uploaded artwork
          totalQuantity: skuTotalQty, // Update to use skuTotalQty
          quantityOne: totalQtyOne,
          quantityTwo: totalQtyTwo,
          quantityThree: totalQtyThree
        },
      },
    };

    try {
      await setDoc(doc(db, 'QuoteRequirements', quoteId), quoteData);
      toast.success('Form submitted successfully!'); // Display success toast
      // Reset form and reload page after a short delay
      setTimeout(() => {
        setCustomerName('');
        setSalesRepName('');
        setProductType('');
        setProductFields({});
        setIsLoading(false); // Set loading to false
        // window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to submit the form.'); // Display error toast
      setIsLoading(false); // Set loading to false
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
      case 'Caps':
        return <Caps product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'Shrink Sleeves':
        return <div>Shrink Sleeves selected. No additional fields required.</div>;
      case 'Blisters':
        return <Blisters product={{ fields: productFields }} updateProduct={updateProductFields} />;
      // Add cases for other product types
      default:
        return null;
    }
  };

  const renderSizeFields = () => {
    // if (productType === 'Stand Up Pouches' || productType === 'Boxes') {
    if (productType === 'Stand Up Pouches') {
      return (
        <>
          {/* {productType === 'Boxes' && ( */}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Gusset: (in Inches)</label>
              <input
                className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                type="number"
                value={productFields.size?.gusset || ''}
                onChange={(e) => updateProductFields('size', { ...productFields.size, gusset: e.target.value })}
                placeholder="Gusset"
              />
            </div>
          {/* )} */}
        </>
      );
    }
    return null;
  };

  const renderSKUQuantityFields = () => {
    const numberOfSKUs = parseInt(productFields.numberOfSKUs, 10) || 0;
    const skuQuantityFields = [];
    for (let i = 1; i <= numberOfSKUs; i++) {
      skuQuantityFields.push(
        <div key={`sku${i}`} className="form-group">
          <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>SKU {i} Quantity:</label>
          <input
            className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            type="number"
            value={productFields[`sku${i}Quantity`] || ''}
            onChange={(e) => updateProductFields(`sku${i}Quantity`, e.target.value)}
            placeholder={`SKU ${i} Quantity`}
          />
        </div>
      );
    }
    return skuQuantityFields;
  };

  return (
    <>
      <Header />

      <div className='parent-container pt-5 h-100 pb-10 p-4 sm:ml-64'>
        <h2 className='text-3xl p-10 mb-6' style={{ textAlign: 'center' }}>Step One: Quote Requirements</h2>
        <form className='grid grid-cols-2 gap-4 ' onSubmit={handleSubmit}>
          <div>
            <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Customer Name</label>
            <input
              className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
            />

            <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Sales Rep Name</label>
            <input
              className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              type="text"
              value={salesRepName}
              onChange={(e) => setSalesRepName(e.target.value)}
              placeholder="Sales Rep Name"
            />

            <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Select Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="">Select Product Type</option>
              <option value="Stand Up Pouches">Stand Up Pouches</option>
              <option value="Boxes">Boxes</option>
              <option value="Bottles">Bottles</option>
              <option value="Caps">Caps</option>
              <option value="Shrink Sleeves">Shrink Sleeves</option>
              <option value="Blisters">Blisters</option>
            </select>

            <div className='product-form'>
              {renderProductForm()}
            </div>
          </div>

          <div>
            <div className="product-form">
              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Artwork:</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="file"
                  onChange={(e) => updateProductFields('artwork', e.target.files[0])}
                />
                {/* <small>Artwork is optional unless the order is over 10K</small> */}
              </div>

              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Material:</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="text"
                  value={productFields.material || ''}
                  onChange={(e) => updateProductFields('material', e.target.value)}
                  placeholder="Material"
                />
              </div>

              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Finish Type:</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="text"
                  value={productFields.finishType || ''}
                  onChange={(e) => updateProductFields('finishType', e.target.value)}
                  placeholder="Finish Type"
                />
              </div>

              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Finish Option:</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="text"
                  value={productFields.finishOption || ''}
                  onChange={(e) => updateProductFields('finishOption', e.target.value)}
                  placeholder="Finish Option"
                />
              </div>


              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Height: (in Inches)</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="number"
                  value={productFields.size?.height || ''}
                  onChange={(e) => updateProductFields('size', { ...productFields.size, length: e.target.value })}
                  placeholder="Height"
                />
              </div>

              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Width: (in Inches)</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="number"
                  value={productFields.size?.width || ''}
                  onChange={(e) => updateProductFields('size', { ...productFields.size, width: e.target.value })}
                  placeholder="Width"
                />
              </div>
              {renderSizeFields()}


              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Number of SKU's:</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="number"
                  value={productFields.numberOfSKUs || ''}
                  onChange={(e) => updateProductFields('numberOfSKUs', e.target.value)}
                  placeholder="Number of SKU's"
                />

                {renderSKUQuantityFields()}
              </div>

              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Total Quantity:</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="number"
                  value={skuTotalQty || ''}
                  readOnly
                  placeholder="Total Quantity"
                />
              </div>

              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Quantity One:</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="number"
                  value={totalQtyOne || ''}
                  onChange={(e) => setTotalQtyOne(e.target.value)}
                  placeholder="Quantity One : for ex 3000"
                />
              </div>

              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Quantity Two:</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="number"
                  value={totalQtyTwo || ''}
                  onChange={(e) => setTotalQtyTwo(e.target.value)}
                  placeholder="Quantity One : for ex 12000"
                />
              </div>

              <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Quantity Three:</label>
                <input
                  className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  type="number"
                  value={totalQtyThree || ''}
                  onChange={(e) => setTotalQtyThree(e.target.value)}
                  placeholder="Quantity Three : for ex 20000"
                />
              </div>
            </div>

            <button
              className='mt-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light'
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Quote'}
            </button>
          </div>
        </form>
        <ToastContainer position="top-center" autoClose={9000} />
      </div>
    </>
  );
};

export default StepOne;
