import React, { useState, useEffect, useRef } from 'react';
import { db, storage, auth } from '../firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

const ShippingDetails = () => {
  const { id } = useParams();
  const [realTimeQuote, setRealTimeQuote] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendorImage, setVendorImage] = useState('');
  const [shippingVendors, setShippingVendors] = useState([]);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorImage, setNewVendorImage] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const printRef = useRef();

  const [additionalData ] = useState({
    commodityType: '',
    totalUnitsPerCommodity: '',
    numberOfUnitsPerBox: '',
    totalNumberOfBoxesPerCommodity: '',
    shipBoxDimensions: { length: '', breadth: '', height: '' },
    shipWeightPerBox: '',
    totalQtyOfBoxesPerCommodity: '',
    totalValuePerProductPerSize: '',
    overallValueForTheShipment: '',
    shippingVolumePerProduct: '',
    totalVolumeForTheWholeOrder: '',
    fromShippingAddress: '',
    toShippingAddress: '',
    splitShipping: '',
    palletize: '',
    // expressAir: '',
    // regularAir: '',
    // regularSeaLimitedContainer: '',
    // expressSeaLimitedContainer: ''
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserRole(userData.role); // Set the user role
        }
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'QuoteRequirements', id), (doc) => {
      setRealTimeQuote({ id: doc.id, ...doc.data() });
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (selectedVendor && realTimeQuote?.vendorDetails) {
      const vendor = realTimeQuote.vendorDetails.find(v => v.vendorName === selectedVendor);
      if (vendor) {
        setVendorImage(vendor.imageUrl);
      }
    }
  }, [selectedVendor, realTimeQuote]);

  const formatFieldName = (fieldName) => {
    return fieldName
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleDownloadPNG = async () => {
    const input = printRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'shipping-details.png';
    link.click();
  };

  const handleVendorImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `vendorImages/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setNewVendorImage(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const addShippingVendor = () => {
    if (newVendorName && newVendorImage) {
      setShippingVendors([...shippingVendors, { vendorName: newVendorName, imageUrl: newVendorImage }]);
      setNewVendorName('');
      setNewVendorImage(null);
    }
  };

  if (!realTimeQuote) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div ref={printRef} className="p-6">
        <div className="text-lg font-semibold mb-4">Shipping Details - {realTimeQuote.product.type}</div>
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
        </div>
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Select Vendor:</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value="">Select Vendor</option>
            {realTimeQuote.vendorDetails && realTimeQuote.vendorDetails.map((vendor, index) => (
              <option key={index} value={vendor.vendorName}>
                {vendor.vendorName}
              </option>
            ))}
          </select>
        </div>
        {vendorImage && (
          <div className="mt-4">
            <img src={vendorImage} alt="Vendor" className="max-w-full h-auto rounded-lg" style={{ border: '2px dashed red' }} />
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Additional Shipping Details</h3>
          <div className="mb-4 grid text-sm grid-cols-2 gap-4">
            {Object.entries(additionalData).map(([key, value]) => (
              <div key={key} className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">{formatFieldName(key)}: </label>
                <br />
                _______________
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Shipping Quote</h3>
          <div className="mb-4 grid text-sm grid-cols-2 gap-4">
            {['expressAir', 'regularAir', 'regularSeaLimitedContainer', 'expressSeaLimitedContainer'].map((field) => (
              <div key={field} className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">{formatFieldName(field)}: </label>
                <br />
                _______________
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Vendor Details</h3>
          {shippingVendors.map((vendor, index) => (
            <div key={index} className="mb-4">
              <span className='tracking-wide font-bold leading-6 text-gray-900'>Vendor Name: </span>
              <p>{vendor.vendorName}</p>
              <a href={vendor.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Image</a>
            </div>
          ))}
          {userRole === 'ShippingAdmin' && (
            <>
              <div className="form-group mt-4">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Shipping Vendor Name:</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  placeholder="Vendor Name"
                />
              </div>
              <div className="form-group mt-4">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Shipping Vendor Image:</label>
                <input
                  type="file"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onChange={handleVendorImageUpload}
                />
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
                onClick={addShippingVendor}
              >
                Add Vendor
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => navigate('/shipping-requirements')}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleDownloadPNG}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
        >
          Download as PNG
        </button>
      </div>
    </div>
  );
};

export default ShippingDetails;
