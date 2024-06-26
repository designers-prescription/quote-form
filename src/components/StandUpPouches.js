import React from 'react';

const StandUpPouches = ({ product, updateProduct }) => {
  const handleSizeChange = (dimension, value) => {
    const size = { ...product.fields.size, [dimension]: value };
    if (dimension === 'heightMM') {
      size.height = (value / 25.4).toFixed(2);
    }
    if (dimension === 'widthMM') {
      size.width = (value / 25.4).toFixed(2);
    }
    updateProduct('size', size);
  };

  return (
    <div className="product-form">
      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Custom Die Cut Shape Pouch:</label>
        <div>
          <div className="radio-group">
            <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
              <input
                type="radio"
                name="customDieCutShape"
                checked={product.fields.customDieCutShape === 'yes'}
                onChange={() => updateProduct('customDieCutShape', 'yes')}
              />
              Yes
            </label>
            <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
              <input
                type="radio"
                name="customDieCutShape"
                checked={product.fields.customDieCutShape === 'no'}
                onChange={() => updateProduct('customDieCutShape', 'no')}
              />
              No
            </label>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Pouch Type:</label>
        <select
          value={product.fields.pouchType}
          onChange={(e) => updateProduct('pouchType', e.target.value)}
        >
          <option value="">Select Pouch Type</option>
          {[...Array(10).keys()].map((num) => (
            <option key={num + 1} value={`Type ${num + 1}`}>
              Type {num + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Environmentally Friendly:</label>
        <div className="radio-group">
          <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="environmentallyFriendly"
              checked={product.fields.environmentallyFriendly === 'yes'}
              onChange={() => updateProduct('environmentallyFriendly', 'yes')}
            />
            Yes
          </label>
          <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="environmentallyFriendly"
              checked={product.fields.environmentallyFriendly === 'no'}
              onChange={() => updateProduct('environmentallyFriendly', 'no')}
            />
            No
          </label>
        </div>
        {product.fields.environmentallyFriendly === 'yes' && (
          <div className="radio-group">
            <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
              <input
                type="radio"
                name="environmentalOption"
                checked={product.fields.environmentalOption === 'biodegradable'}
                onChange={() => updateProduct('environmentalOption', 'biodegradable')}
              />
              Biodegradable
            </label>
            <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
              <input
                type="radio"
                name="environmentalOption"
                checked={product.fields.environmentalOption === 'recyclable'}
                onChange={() => updateProduct('environmentalOption', 'recyclable')}
              />
              Recyclable
            </label>
            <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
              <input
                type="radio"
                name="environmentalOption"
                checked={product.fields.environmentalOption === 'compostable'}
                onChange={() => updateProduct('environmentalOption', 'compostable')}
              />
              Compostable
            </label>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Child Proof:</label>
        <div className="radio-group">
          <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="childProof"
              checked={product.fields.childProof === 'yes'}
              onChange={() => updateProduct('childProof', 'yes')}
            />
            Yes
          </label>
          <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="childProof"
              checked={product.fields.childProof === 'no'}
              onChange={() => updateProduct('childProof', 'no')}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          value={product.fields.material || ""}
          onChange={(e) => updateProduct('material', e.target.value)}
          placeholder="Material"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finish Type:</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          value={product.fields.finishType || ""}
          onChange={(e) => updateProduct('finishType', e.target.value)}
          placeholder="Finish Type"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finish Option:</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          value={product.fields.finishOption || ""}
          onChange={(e) => updateProduct('finishOption', e.target.value)}
          placeholder="Finish Option"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Artwork:</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="file"
          onChange={(e) => updateProduct('artwork', e.target.files[0])}
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Height: (in mm)</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.heightMM || ""}
          onChange={(e) => handleSizeChange('heightMM', e.target.value)}
          placeholder="Height in mm"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Width: (in mm)</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.widthMM || ""}
          onChange={(e) => handleSizeChange('widthMM', e.target.value)}
          placeholder="Width in mm"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-red-500">Height: (in Inches)</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.height || ""}
          readOnly
          placeholder="Height"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-red-500">Width: (in Inches)</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.width || ""}
          readOnly
          placeholder="Width"
        />
      </div>
    </div>
  );
};

export default StandUpPouches;
