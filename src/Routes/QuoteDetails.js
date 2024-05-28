import React, { useState, useEffect, useRef } from 'react';
import { db, storage, auth } from '../firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

const QuoteDetails = () => {
  const { id } = useParams();
  const [realTimeQuote, setRealTimeQuote] = useState(null);
  const [vendorName, setVendorName] = useState('');
  const [vendorImage, setVendorImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userRole, setUserRole] = useState('');
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
      setRealTimeQuote({ id: doc.id, ...doc.data() });
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
    const canvas = await html2canvas(input, { scale: 1.5 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `quote-details - (${realTimeQuote.projectId}).png`;
    link.click();
  };

  const handleAddVendorDetails = async () => {
    if (!vendorName || !vendorImage) {
      alert("Please enter vendor name and upload an image.");
      return;
    }

    setIsUploading(true);

    const imageRef = ref(storage, `vendorImages/${vendorImage.name}`);
    await uploadBytes(imageRef, vendorImage);
    const imageUrl = await getDownloadURL(imageRef);

    const vendorDetails = { vendorName, imageUrl };

    await updateDoc(doc(db, 'QuoteRequirements', id), {
      vendorDetails: arrayUnion(vendorDetails)
    });

    setVendorName('');
    setVendorImage(null);
    setIsUploading(false);
  };

  if (!realTimeQuote) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="p-6">
        <div ref={printRef} className="p-6">
          <div className="text-lg font-semibold mb-4">Quote Requirements - {realTimeQuote.product.type}</div>
          
          {/* ----- PROJECT DETAILS STARTS ----- */}
          
          {realTimeQuote.product.fields.artwork && (
            <div className="mb-4">
              <img
                src={realTimeQuote.product.fields.artwork}
                alt="Product Artwork"
                className="max-w-full h-auto"
                onLoad={() => console.log('Artwork image loaded')}
              />
            </div>
          )}
          {realTimeQuote.product.fields.bottleImage && (
            <div className="mb-4">
              <img
                src={realTimeQuote.product.fields.bottleImage}
                alt="Bottle"
                className="max-w-full h-auto"
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
          </div>

          {/* ----- PROJECT REQUIREMENT STARTS ----- */}

          <div className="mb-4 grid text-sm grid-cols-3">
            {Object.entries(realTimeQuote.product.fields)
              .filter(([key]) => key !== 'bottleImage' && key !== 'artwork')
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([key, value]) => (
                <p key={key} className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'>
                  <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(key)}: </span>
                  {typeof value === 'object' && value !== null
                    ? `Width: ${value.width} x Height ${value.height} x Length ${value.length} x Gusset ${value.gusset}`
                    : value}
                </p>
              ))}
          </div>

          {/* ----- PACKAGING DETAIL STARTS ----- */}

          <h3 className="text-lg font-semibold mb-2 mt-10">Packaging Details</h3>
          <div className="mb-4 grid text-sm grid-cols-3 gap-4">
            <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity One Price: </label>
              <br />
              _______________
            </div>
            <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity Two Price: </label>
              <br />
              _______________
            </div>
            <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity Three Price: </label>
              <br />
              _______________
            </div>

            <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quote Reference:(If Applicable) </label>
              <br />
              _______________
            </div>
            <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">One Time Charges: </label>
              <br />
              _______________
            </div>
            <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Final Price:(If Negotiated) </label>
              <br />
              _______________
            </div>
          </div>

          {/* ----- SHIPPING DETAIL STARTS ----- */}

          <div className="mt-4">
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
              <div className="p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">To Shipping Address: </label>
                <br />
                _______________
              </div>
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
            </div>


            {/* ----- QUANTITY 1 ----- */}

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Details For Shipping (Quantity 1: <span className='font-bold leading-6 text-red-500' > {realTimeQuote.product.fields.quantity01}</span>) </h3>
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


            {/* ----- QUANTITY 2 ----- */}

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Details For Shipping (Quantity 2: <span className='font-bold leading-6 text-red-500' > {realTimeQuote.product.fields.quantity02}</span>) </h3>
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


            {/* ----- QUANTITY 3 ----- */}

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Details For Shipping (Quantity 3: <span className='font-bold leading-6 text-red-500' > {realTimeQuote.product.fields.quantity03}</span>) </h3>
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
          </div>
        </div>

        {/* ----- END OF PRINTABLE AREA ----- */}

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
                <span className='tracking-wide font-bold leading-6 text-gray-900'>Image: </span>
                <a href={vendor.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Details from the Packaging Vendor</a>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => navigate('/update-quote')}
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

export default QuoteDetails;
