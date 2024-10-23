import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onSubmit, quoteData }) => {
  if (!isOpen) return null;

  // Group products by productType
  const groupedProducts = quoteData.products.reduce((acc, product) => {
    const { productType } = product;
    if (!acc[productType]) {
      acc[productType] = [];
    }
    acc[productType].push(product);
    return acc;
  }, {});

  const renderField = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="ml-4">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <span className="font-bold">{subKey}:</span> {subValue}
            </div>
          ))}
        </div>
      );
    }
    return value;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h3 className="text-lg font-bold mb-4">Confirm Your Submission</h3>
        
        <div className="overflow-y-auto max-h-96">
          {/* Display form data here similar to QuoteDetails */}
          <div className="mb-4">
            <p><strong>Customer Name:</strong> {quoteData.customerName}</p>
            <p><strong>Sales Rep Name:</strong> {quoteData.salesRepName}</p>
            <p><strong>Project Name:</strong> {quoteData.projectName}</p>
            <p><strong>Project ID:</strong> {quoteData.projectId}</p>
          </div>
          
          {Object.keys(groupedProducts).map((productType) => (
            <div key={productType}>
              <h3 className="text-md font-semibold mb-4">Product Type: {productType}</h3>

              {groupedProducts[productType].map((product, index) => (
                <div key={index} className="mb-6 border p-4 rounded-lg">
                  <h4 className="text-md font-semibold mb-2">Product {index + 1}: {product.productType}</h4>
                  <p><strong>Packaging Instructions:</strong> {product.packagingInstructions}</p>
                  <p><strong>Shipping Instructions:</strong> {product.shippingInstructions}</p>
                  
                  {/* Display all product fields */}
                  <div className="mb-4 grid text-sm grid-cols-2">
                    {Object.entries(product.fields || {}).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-bold">{key}:</span> {renderField(key, value)}
                      </div>
                    ))}
                  </div>

                  {/* Display quantities in table format */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold">SKU Quantities:</h4>
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1 border-gray-300">SKU</th>
                          {product.skuDetails[0]?.quantities.map((_, qtyIndex) => (
                            <th key={qtyIndex} className="border px-2 py-1 border-gray-300">Quantity {qtyIndex + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {product.skuDetails.map((skuDetail, skuIndex) => (
                          <tr key={skuIndex}>
                            <td className="border px-2 py-1 text-center border-gray-300">{skuDetail.sku}</td>
                            {skuDetail.quantities.map((quantity, qtyIndex) => (
                              <td key={qtyIndex} className="border px-2 py-1 text-center border-gray-300">{quantity.value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 mr-2 border text-sm font-medium rounded-md bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 border text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;