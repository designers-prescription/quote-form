import React from 'react';

const Caps = ({ product, updateProduct }) => {
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
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Cap Types:</label>
        <select
          value={product.fields.capType}
          onChange={(e) => updateProduct('capType', e.target.value)}
        >
          <option value="">Select Cap Type</option>
          <option value="twistCap">Twist Cap</option>
          <option value="flipCap">Flip Cap</option>
          <option value="sprayCap">Spray Cap</option>
          <option value="pressCap">Press Cap</option>
          <option value="pumpCap">Pump Cap</option>
          <option value="dripper">Dripper</option>
        </select>
      </div>

      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Additional Materials:</label>
        <div className="radio-group">
          {['wood', 'metal', 'glass'].map((material) => (
            <label key={material}>
              <input
                type="radio"
                name="additionalMaterialsForCaps"
                checked={product.fields.additionalMaterialsForCaps === material}
                onChange={() => updateProduct('additionalMaterialsForCaps', material)}
              />
              {material}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Child Proof:</label>
        <div className="radio-group">
          <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="childProofForCaps"
              checked={product.fields.childProofForCaps === 'yes'}
              onChange={() => updateProduct('childProofForCaps', 'yes')}
            />
            Yes
          </label>
          <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="childProofForCaps"
              checked={product.fields.childProofForCaps === 'no'}
              onChange={() => updateProduct('childProofForCaps', 'no')}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Color:</label>
        <input
          type="text"
          value={product.fields.colorForCaps || ''}
          onChange={(e) => updateProduct('colorForCaps', e.target.value)}
          placeholder="Color"
        />
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

export default Caps;
