import React, { useState, useEffect, useRef } from 'react';
import { db, storage, auth } from '../firebase';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';

const QuoteDetails = () => {
  const { id } = useParams();
  const [realTimeQuote, setRealTimeQuote] = useState(null);
  const [currentUserUid, setCurrentUserUid] = useState('');
  const [selectedTab, setSelectedTab] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const printRef = useRef();
  const [vendorName, setVendorName] = useState('');
  const [vendorPdf, setVendorPdf] = useState(null);
  const [productType, setProductType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [artworkLoading, setArtworkLoading] = useState(true);
  const [bottleImageLoading, setBottleImageLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUserUid(user.uid);
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

  const handleQuantityChange = (e, index, key) => {
    const newQuote = { ...realTimeQuote };
    newQuote.products[0].quantities[key][index] = e.target.value;
    setRealTimeQuote(newQuote);
  };

  const handleSaveQuantities = async () => {
    setIsSaving(true);
    if (realTimeQuote) {
      const quoteRef = doc(db, 'QuoteRequirements', realTimeQuote.id);
      await updateDoc(quoteRef, {
        'products': realTimeQuote.products
      });

      // Define your subject and body content for the update notification
      const subject = 'Quote Updated';
      const textBody = `The quote with ID ${realTimeQuote.id} has been updated.`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; margin: 20px;">
          <h2 style="color: #333;">Quote Updated</h2>
          <p style="font-size: 16px; color: #555;">
            The quote with ID ${realTimeQuote.id} has been updated. Click the button below to view the details:
          </p>
          <a href="https://shipping-quote.labelslab.com/packaging-details/${realTimeQuote.id}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
            View the Quote
          </a>
          <p style="font-size: 14px; color: #999; margin-top: 20px;">
            If you have any questions, please contact us at <a href="mailto:vaibhav@designersprescription.com" style="color: #007BFF;">vaibhav@designersprescription.com</a>.
          </p>
        </div>
      `;

      // Notify Maria via AWS Lambda with the dynamic subject and body
      await notifyMaria(realTimeQuote.id, subject, textBody, htmlBody);
    }
    setIsSaving(false);
    setIsSaved(true);
    setIsEditing(false);
    setTimeout(() => setIsSaved(false), 3000); // Hide confirmation message after 3 seconds
  };

  const notifyMaria = async (quoteId, subject, textBody, htmlBody) => {
    try {
      await fetch('https://ghft6mowc4.execute-api.us-east-2.amazonaws.com/default/QuoteForm-EmailSender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientEmail: 'maria@labelslab.com',
          subject: subject,
          textBody: textBody,
          htmlBody: htmlBody
        })
      });
    } catch (error) {
      console.error('Error notifying Maria:', error);
    }
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleDownloadPDF = async () => {
    const input = printRef.current;
    const logoUrl = 'https://shipping-quote.labelslab.com/labelslab.png'; // Replace with your logo URL
  
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
  
    const addImageToPDF = async (pdf, imgSrc, x, y, maxWidth, maxHeight) => {
      return new Promise((resolve, reject) => {
        if (imgSrc) {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = imgSrc;
          img.onload = () => {
            let width = img.width;
            let height = img.height;
  
            // Calculate the aspect ratio
            const aspectRatio = width / height;
  
            // Adjust width and height to fit within the specified max dimensions
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }
  
            if (width > maxWidth) {
              width = maxWidth;
              height = width / aspectRatio;
            }
  
            pdf.addImage(img, 'PNG', x, y, width, height);
            resolve();
          };
          img.onerror = (error) => {
            console.error(`Error loading image ${imgSrc}:`, error);
            reject(error);
          };
        } else {
          resolve();
        }
      });
    };
  
    try {
      // Add logo
      await addImageToPDF(pdf, logoUrl, 20, 20, 100, 50); // Adjust the position and size as needed
  
      if (!realTimeQuote || !realTimeQuote.products) {
        console.error('Quote data is missing or incomplete');
        return;
      }
  
      // Filter products based on the selected tab
      const filteredProducts = realTimeQuote.products.filter(product => product.productType === selectedTab);
  
      // Iterate over each filtered product and create a new page for each
      for (let productIndex = 0; productIndex < filteredProducts.length; productIndex++) {
        const product = filteredProducts[productIndex];
  
        if (productIndex > 0) {
          pdf.addPage();
        }
  
        // Add general information about the quote
        pdf.setFontSize(20);
        pdf.setFont(undefined, 'bold');
        pdf.text(`Product ${productIndex + 1}: ${product.productType || ''}`, 40, 100);
  
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.autoTable({
          startY: 120,
          head: [['Field', 'Value']],
          body: [
            ['Customer Name', realTimeQuote.customerName || ''],
            ['Sales Rep Name', realTimeQuote.salesRepName || ''],
            ['Project Name', realTimeQuote.projectName || ''],
            ['Project ID', realTimeQuote.projectId || ''],
          ],
          theme: 'grid',
          styles: { fontSize: 10 },
        });
  
        // Add special and shipping instructions
        const specialShippingY = pdf.lastAutoTable.finalY + 25; // Adjusted position
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(255, 0, 0);
        pdf.text('Special Instructions:', 40, specialShippingY);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'normal');
        pdf.text(product.packagingInstructions || '', 150, specialShippingY);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(255, 0, 0);
        pdf.text('Shipping Instructions:', 40, specialShippingY + 20);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'normal');
        pdf.text(product.shippingInstructions || '', 150, specialShippingY + 20);
  
        // Add product fields in a table layout
        const fieldsTableYStart = specialShippingY + 60;
        const productFields = Object.entries(product.fields || {})
          .filter(([key]) => key !== 'bottleImage' && key !== 'artwork')
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([key, value]) => {
            const formattedName = formatFieldName(key);
            const displayValue = typeof value === 'object' && value !== null
              ? `Width: ${value.width} x Height ${value.height} x Length ${value.length} x Gusset ${value.gusset} x Depth ${value.depth}`
              : value;
            return [formattedName, displayValue || ''];
          });
  
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Product Fields', 40, fieldsTableYStart - 10);
        pdf.setFont(undefined, 'normal');
        pdf.autoTable({
          startY: fieldsTableYStart,
          head: [['Field', 'Value']],
          body: productFields,
          theme: 'grid',
          styles: { fontSize: 10 },
        });
  
        // Add quantities table
        const quantitiesTableYStart = pdf.lastAutoTable.finalY + 20;
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Quantities', 40, quantitiesTableYStart);
        pdf.setFont(undefined, 'normal');
        pdf.autoTable({
          startY: quantitiesTableYStart + 10,
          head: [['SKU', 'Q1', 'Q2', 'Q3']],
          body: Object.keys(product.quantities.Q1 || {}).map((skuIndex) => [
            parseInt(skuIndex) + 1,
            product.quantities.Q1[skuIndex] || '',
            product.quantities.Q2[skuIndex] || '',
            product.quantities.Q3[skuIndex] || ''
          ]),
          theme: 'grid',
          styles: { fontSize: 10 },
        });
  
        // Add new table for prices
        const priceTableYStart = pdf.lastAutoTable.finalY + 20;
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Prices', 40, priceTableYStart);
        pdf.setFont(undefined, 'normal');
        pdf.autoTable({
          startY: priceTableYStart + 10,
          head: [['SKU', 'Q1 Price', 'Q2 Price', 'Q3 Price']],
          body: Object.keys(product.quantities.Q1 || {}).map((skuIndex) => [
            parseInt(skuIndex) + 1,
            '', // Q1 Price
            '', // Q2 Price
            '', // Q3 Price
          ]),
          theme: 'grid',
          styles: { fontSize: 10 },
        });
  
        // Add new table for shipping dimensions
        const dimensionsTableYStart = pdf.lastAutoTable.finalY + 20;
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Shipping Dimensions', 40, dimensionsTableYStart);
        pdf.setFont(undefined, 'normal');
        pdf.autoTable({
          startY: dimensionsTableYStart + 10,
          head: [['SKU', 'Q1 Shipping Dimensions', 'Q2 Shipping Dimensions', 'Q3 Shipping Dimensions']],
          body: Object.keys(product.quantities.Q1 || {}).map((skuIndex) => [
            parseInt(skuIndex) + 1,
            '', // Q1 Shipping Dimensions
            '', // Q2 Shipping Dimensions
            '', // Q3 Shipping Dimensions
          ]),
          theme: 'grid',
          styles: { fontSize: 10 },
        });
  
        // Add shipping details in a 2-column layout
        const shippingDetailsYStart = pdf.lastAutoTable.finalY + 40;
        const shippingDetails = [
          { label: 'Commodity Type', value: '' },
          { label: 'From Shipping Address', value: '' },
          { label: 'Split Shipping With Breakdown', value: '' },
          { label: 'Palletize', value: '' },
          { label: 'Special Notes', value: product.shippingInstructions || '' },
          { label: 'Total Units Per Commodity', value: '' },
          { label: 'Number Of Units Per Box', value: '' },
          { label: 'Total Number Of Boxes Per Commodity', value: '' },
          { label: 'Ship Box Dimensions', value: '' },
          { label: 'Ship Weight Per Box', value: '' },
          { label: 'Total Qty Of Boxes Per Commodity', value: '' },
          { label: 'Shipping Volume Per Product', value: '' },
          { label: 'Total Volume For The Whole Order', value: '' }
        ];
  
        const shippingDetailsBody = shippingDetails.map(detail => [detail.label, detail.value]);
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Shipping Details', 40, shippingDetailsYStart);
        pdf.setFont(undefined, 'normal');
        pdf.autoTable({
          startY: shippingDetailsYStart + 10,
          head: [['Field', 'Value']],
          body: shippingDetailsBody,
          theme: 'grid',
          styles: { fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 0.5 * pageWidth - 40 },
            1: { cellWidth: 0.5 * pageWidth - 40 }
          },
        });
  
        // Add new table for Air/Sea quantities
        const airSeaQuantityTableYStart = pdf.lastAutoTable.finalY + 20;
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Air/Sea Shipping Quantities', 40, airSeaQuantityTableYStart);
        pdf.setFont(undefined, 'normal');
        pdf.autoTable({
          startY: airSeaQuantityTableYStart + 10,
          head: [
            ['SKU', 'Express Air Qty', 'Regular Air Qty', 'Regular Sea Container Qty', 'Express Sea Container Qty']
          ],
          body: Object.keys(product.quantities.Q1 || {}).map((skuIndex) => [
            parseInt(skuIndex) + 1,
            '', // Express Air Quantity
            '', // Regular Air Quantity
            '', // Regular Sea Container Quantity
            '', // Express Sea Container Quantity
          ]),
          theme: 'grid',
          styles: { fontSize: 10 },
        });
  
        // Add new table for Air/Sea prices
        const airSeaPriceTableYStart = pdf.lastAutoTable.finalY + 20;
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Air/Sea Shipping Prices', 40, airSeaPriceTableYStart);
        pdf.setFont(undefined, 'normal');
        pdf.autoTable({
          startY: airSeaPriceTableYStart + 10,
          head: [
            ['SKU', 'Express Air Price', 'Regular Air Price', 'Regular Sea Container Price', 'Express Sea Container Price']
          ],
          body: Object.keys(product.quantities.Q1 || {}).map((skuIndex) => [
            parseInt(skuIndex) + 1,
            '', // Express Air Price
            '', // Regular Air Price
            '', // Regular Sea Container Price
            '', // Express Sea Container Price
          ]),
          theme: 'grid',
          styles: { fontSize: 10 },
        });
  
        // Add reference image if exists
        const imageYStart = pdf.lastAutoTable.finalY + 40;
        if (product.imageUrl) {
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          pdf.text('Image Reference', 40, imageYStart);
          await addImageToPDF(pdf, product.imageUrl, 40, imageYStart + 20, pageWidth - 80, 300); // Set fixed height to 300, max width to 700
        }
      }
  
      pdf.save(`quote-details - ${selectedTab} - (${realTimeQuote.projectId}).pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  

  const handleAddVendorDetails = async () => {
    if (!vendorName || !vendorPdf || !productType) {
      alert("Please enter vendor name, select product type, and upload a file.");
      return;
    }

    setIsUploading(true);

    const fileExtension = vendorPdf.name.split('.').pop();
    const uniqueFileName = `quote-details - ${productType} - (${realTimeQuote.projectId})-${uuidv4()}.${fileExtension}`;
    const fileRef = ref(storage, `vendorPdfs/${uniqueFileName}`);
    
    await uploadBytes(fileRef, vendorPdf);
    const fileUrl = await getDownloadURL(fileRef);

    const vendorDetails = { vendorName, fileUrl, productType };

    const updatedVendorDetails = realTimeQuote.vendorDetails ? [...realTimeQuote.vendorDetails, vendorDetails] : [vendorDetails];

    await updateDoc(doc(db, 'QuoteRequirements', id), {
      vendorDetails: updatedVendorDetails
    });

    setVendorName('');
    setVendorPdf(null);
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
              <div className="mb-4 relative">
                {artworkLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={product.imageUrl}
                  alt="Product Artwork"
                  style={{ width: '500px', height: 'auto' }}
                  onLoad={() => setArtworkLoading(false)}
                  className={artworkLoading ? 'invisible' : 'visible'}
                />
              </div>
            )}
            {product.fields.bottleImage && (
              <div className="mb-4 relative">
                {bottleImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={product.fields.bottleImage}
                  alt="Bottle"
                  style={{ width: '500px', height: 'auto' }}
                  onLoad={() => setBottleImageLoading(false)}
                  className={bottleImageLoading ? 'invisible' : 'visible'}
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
                      <td className="border px-2 py-1 border-slate-900 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={product.quantities.Q1[skuIndex]}
                            onChange={(e) => handleQuantityChange(e, skuIndex, 'Q1')}
                            className="w-full text-center"
                          />
                        ) : (
                          product.quantities.Q1[skuIndex]
                        )}
                      </td>
                      <td className="border px-2 py-1 border-slate-900 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={product.quantities.Q2[skuIndex]}
                            onChange={(e) => handleQuantityChange(e, skuIndex, 'Q2')}
                            className="w-full text-center"
                          />
                        ) : (
                          product.quantities.Q2[skuIndex]
                        )}
                      </td>
                      <td className="border px-2 py-1 border-slate-900 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={product.quantities.Q3[skuIndex]}
                            onChange={(e) => handleQuantityChange(e, skuIndex, 'Q3')}
                            className="w-full text-center"
                          />
                        ) : (
                          product.quantities.Q3[skuIndex]
                        )}
                      </td>
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
              {realTimeQuote.createdBy === currentUserUid && (
                <>
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveQuantities}
                        className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-green-500 text-white hover:bg-green-700"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Quantities'}
                      </button>
                      {isSaved && <p className="text-green-500 mt-2">Quantities saved successfully!</p>}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-700"
                    >
                      Edit Quantities
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {userRole === 'PackagingAdmin' && (
        <div className="mb-4 mt-20">
          <h3 className="text-lg font-semibold mb-2">Upload Quote (PDF only)</h3>
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
            <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Upload PDF:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="file"
              accept="application/pdf"
              onChange={(e) => setVendorPdf(e.target.files[0])}
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
              <span className='tracking-wide font-bold leading-6 text-gray-900'>PDF: </span>
              <a href={vendor.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View PDF</a>
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
          onClick={handleDownloadPDF}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
        >
          Download Requirement
        </button>
      </div>
    </div>
  );
};

export default QuoteDetails;