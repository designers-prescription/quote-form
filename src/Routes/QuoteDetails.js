import React, { useState, useEffect, useRef } from 'react';
import { db, storage, auth } from '../firebase';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

const QuoteDetails = () => {
  const { id } = useParams();
  const [realTimeQuote, setRealTimeQuote] = useState(null);
  const [vendorName, setVendorName] = useState('');
  const [vendorImage, setVendorImage] = useState(null);
  const [productType, setProductType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [selectedTab, setSelectedTab] = useState('');
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserRole(userData.role);
        }
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'QuoteRequirements', id), (doc) => {
      const data = doc.data();
      setRealTimeQuote({ id: doc.id, ...data });
      if (data.products && data.products.length > 0) {
        setSelectedTab(data.products[0].productType);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const formatFieldName = (fieldName) => {
    return fieldName
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleDownloadPNG = async () => {
    const input = printRef.current;

    const images = input.querySelectorAll('img');
    const promises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = img.onerror = resolve;
      });
    });

    await Promise.all(promises);

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `quote-details - (${realTimeQuote.projectId}).png`;
    link.click();
  };

  const handleAddVendorDetails = async () => {
    if (!vendorName || !vendorImage || !productType) {
      alert("Please enter vendor name, select product type, and upload an image.");
      return;
    }

    setIsUploading(true);

    const imageRef = ref(storage, `vendorImages/${vendorImage.name}`);
    await uploadBytes(imageRef, vendorImage);
    const imageUrl = await getDownloadURL(imageRef);

    const vendorDetails = { vendorName, imageUrl, productType };

    const updatedVendorDetails = realTimeQuote.vendorDetails ? [...realTimeQuote.vendorDetails, vendorDetails] : [vendorDetails];

    await updateDoc(doc(db, 'QuoteRequirements', id), {
      vendorDetails: updatedVendorDetails
    });

    setVendorName('');
    setVendorImage(null);
    setProductType('');
    setIsUploading(false);
  };

  if (!realTimeQuote) {
    return <div>Loading...</div>;
  }

  const groupedProducts = Array.isArray(realTimeQuote.products)
    ? realTimeQuote.products.reduce((acc, product) => {
        const { productType } = product;
        if (!acc[productType]) {
          acc[productType] = [];
        }
        acc[productType].push(product);
        return acc;
      }, {})
    : {};

  return (
    <div className="p-6">
      <div className="mb-4">
        {Object.keys(groupedProducts).map((productType) => (
          <button
            key={productType}
            className={`px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-md ${selectedTab === productType ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => setSelectedTab(productType)}
          >
            {productType}
          </button>
        ))}
      </div>
      <div ref={printRef} className="p-6">
        {groupedProducts[selectedTab]?.map((product, index) => (
          <div key={index} className="mb-10">
            <div className="text-lg font-semibold mb-4">Quote Requirements - {product.productType} {index + 1}</div>

            {product.imageUrl && (
              <div className="mb-4">
                <img
                  src={product.imageUrl}
                  alt="Product Artwork"
                  style={{ width: '500px', height: 'auto' }}
                  onLoad={() => console.log('Artwork image loaded')}
                />
              </div>
            )}
            {product.fields.bottleImage && (
              <div className="mb-4">
                <img
                  src={product.fields.bottleImage}
                  alt="Bottle"
                  style={{ width: '500px', height: 'auto' }}
                  onLoad={() => console.log('Bottle image loaded')}
                />
              </div>
            )}
            
            <div className="mb-4 grid text-sm grid-cols-3">
              <div>
                <span className='tracking-wide font-bold leading-6 text-gray-900'>Customer Name: </span>
                <p>{realTimeQuote.customerName}</p>
              </div>
              <div>
                <span className='tracking-wide font-bold leading-6 text-gray-900'>Sales Rep Name: </span>
                <p>{realTimeQuote.salesRepName}</p>
              </div>
              <div>
                <span className='tracking-wide font-bold leading-6 text-gray-900'>Project Name: </span>
                <p>{realTimeQuote.projectName}</p>
              </div>
              <div>
                <span className='tracking-wide font-bold leading-6 text-gray-900'>Project ID: </span>
                <p>{realTimeQuote.projectId}</p>
              </div>
              <div>
                <span className='tracking-wide font-bold leading-6 text-gray-900'>Project Address: </span>
                <p>{product.address}</p>
              </div>
            </div>

            <div className="mb-4">
              <span className='tracking-wide font-bold leading-6 text-red-700'>Special Instructions: </span>
              <p className='text-red-700'>{product.packagingInstructions}</p>
            </div>

            <div className="mb-4">
              <span className='tracking-wide font-bold leading-6 text-red-700'>Shipping Instructions: </span>
              <p className='text-red-700'>{product.shippingInstructions}</p>
            </div>

             


            <div className="mb-4 grid text-sm grid-cols-3">
              {Object.entries(product.fields)
                .filter(([key]) => key !== 'bottleImage' && key !== 'artwork')
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([key, value]) => (
                  <p key={key} className='p-2 m-1 rounded-md border border-dashed border-slate-900 bg-slate-50'>
                    <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(key)}: </span>
                    {typeof value === 'object' && value !== null
                      ? `Width: ${value.width} x Height ${value.height} x Length ${value.length} x Gusset ${value.gusset}`
                      : value}
                  </p>
                ))}
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Quantities</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 border-slate-900 text-center">SKU</th>
                    <th className="border px-2 py-1 border-slate-900 text-center">Q1</th>
                    <th className="border px-2 py-1 border-slate-900 text-center">Q2</th>
                    <th className="border px-2 py-1 border-slate-900 text-center">Q3</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(product.quantities.Q1).map((skuIndex) => (
                    <tr key={skuIndex}>
                      <td className="border px-2 py-1 border-slate-900 text-center">{parseInt(skuIndex) + 1}</td>
                      <td className="border px-2 py-1 border-slate-900 text-center">{product.quantities.Q1[skuIndex]}</td>
                      <td className="border px-2 py-1 border-slate-900 text-center">{product.quantities.Q2[skuIndex]}</td>
                      <td className="border px-2 py-1 border-slate-900 text-center">{product.quantities.Q3[skuIndex]}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border px-2 py-1 border-slate-900 text-center font-bold">Total</td>
                    <td className="border px-2 py-1 border-slate-900 text-center font-bold">
                      {Object.values(product.quantities.Q1).reduce((acc, value) => acc + parseInt(value, 10), 0)}
                    </td>
                    <td className="border px-2 py-1 border-slate-900 text-center font-bold">
                      {Object.values(product.quantities.Q2).reduce((acc, value) => acc + parseInt(value, 10), 0)}
                    </td>
                    <td className="border px-2 py-1 border-slate-900 text-center font-bold">
                      {Object.values(product.quantities.Q3).reduce((acc, value) => acc + parseInt(value, 10), 0)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* <div className="mb-4">
              <span className='tracking-wide font-bold leading-6 text-gray-900'>Address: </span>
              <p>{product.address}</p>
            </div> */}
            
            </div>

            <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
            <div className="mb-4 grid text-sm grid-cols-3 gap-4">
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Commodity Type: </label>
                <br />
                _______________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">From Shipping Address: </label>
                <br />
                _______________
              </div>
              {/* <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">To Shipping Address: </label>
                <br />
                <p className='text-red-700'>{product.address}</p>
              </div> */}
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Split Shipping With Breakdown: </label>
                <br />
                _______________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Palletize: </label>
                <br />
                _______________
              </div>
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Special Notes: </label>
                <br />
                <p className='text-red-700'>{product.shippingInstructions}</p>
              </div>
            </div>

            {['quantity01', 'quantity02', 'quantity03'].map((quantityKey, idx) => (
              <div className="mt-4" key={quantityKey}>
                <h3 className="text-lg font-semibold mb-2">Details For Shipping (Quantity {idx + 1}: <span className='font-bold leading-6 text-red-500'>{product.fields[quantityKey]}</span>) </h3>
                <div className="mb-4 grid text-sm grid-cols-5 gap-3">
                  <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                    <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Total Units Per Commodity: </label>
                    _______________
                  </div>
                  <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                    <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Number Of Units Per Box: </label>
                    <br />
                    _______________
                  </div>
                  <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                    <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Total Number Of Boxes Per Commodity: </label>
                    <br />
                    _______________
                  </div>
                  <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                    <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Ship Box Dimensions: </label>
                    <br />
                    _______________
                  </div>
                  <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                    <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Ship Weight Per Box: </label>
                    <br />
                    _______________
                  </div>
                  <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                    <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Total Qty Of Boxes Per Commodity: </label>
                    <br />
                    _______________
                  </div>
                  <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                    <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Shipping Volume Per Product: </label>
                    <br />
                    _______________
                  </div>
                  <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                    <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Total Volume For The Whole Order: </label>
                    <br />
                    _______________
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {userRole === 'PackagingAdmin' && (
        <div className="mb-4 mt-20">
          <h3 className="text-lg font-semibold mb-2">Updated Values from Vendor</h3>
          <div className="form-group">
            <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Vendor Name:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="Vendor Name"
            />
          </div>
          <div className="form-group">
            <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Product Type:</label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              required
            >
              <option value="">Select Product Type</option>
              <option value="Boxes">Boxes</option>
              <option value="Bottles">Bottles</option>
              <option value="Caps">Caps</option>
              <option value="Blisters">Blisters</option>
              <option value="ShrinkSleeves">Shrink Sleeves</option>
              <option value="Labels">Labels</option>
              <option value="Bags">Bags</option>
              <option value="Sachets">Sachets</option>
            </select>
          </div>
          <div className="form-group">
            <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Upload Image:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="file"
              onChange={(e) => setVendorImage(e.target.files[0])}
            />
          </div>
          <button
            type="button"
            onClick={handleAddVendorDetails}
            className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Add Vendor Details"}
          </button>
        </div>
      )}
      {realTimeQuote.vendorDetails && realTimeQuote.vendorDetails.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Vendor Details</h3>
          {realTimeQuote.vendorDetails.map((vendor, index) => (
            <div key={index} className="mb-2">
              <span className='tracking-wide font-bold leading-6 text-gray-900'>Vendor Name: </span>
              <p>{vendor.vendorName}</p>
              <span className='tracking-wide font-bold leading-6 text-gray-900'>Product Type: </span>
              <p>{vendor.productType}</p>
              <span className='tracking-wide font-bold leading-6 text-gray-900'>Image: </span>
              <a href={vendor.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Details from the Packaging Vendor</a>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => navigate('/packaging-details')}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleDownloadPNG}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
        >
          Download Requirement
        </button>
      </div>
    </div>
  );
};

export default QuoteDetails;
