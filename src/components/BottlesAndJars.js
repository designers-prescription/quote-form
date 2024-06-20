import React from 'react';

const BottlesAndJars = ({ product, updateProduct }) => {
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
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material Type:</label>
        <select
          value={product.fields.materialType}
          onChange={(e) => updateProduct('materialType', e.target.value)}
        >
          <option value="">Select Material Type</option>
          <option value="PET">PET (glossy, shiny, good-looking, resistant to high temperatures up to 40°C)</option>
          <option value="HDPE">HDPE (matte, heat-resistant, withstands temperatures up to 110°C, used for powder cans to avoid light)</option>
          <option value="PP">PP (generally used for lids)</option>
          <option value="Glass">Glass</option>
          <option value="Acrylic">Acrylic</option>
          <option value="ABS">ABS</option>
        </select>
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Volume:</label>
        <input
          type="text"
          value={product.fields.volume || ''}
          onChange={(e) => updateProduct('volume', e.target.value)}
          placeholder="Volume"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Color:</label>
        <input
          type="text"
          value={product.fields.color || ''}
          onChange={(e) => updateProduct('color', e.target.value)}
          placeholder="Color"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finish Type:</label>
        <input
          type="text"
          value={product.fields.finishType || ''}
          onChange={(e) => updateProduct('finishType', e.target.value)}
          placeholder="Finish Type"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finish Option:</label>
        <input
          type="text"
          value={product.fields.finishOption || ''}
          onChange={(e) => updateProduct('finishOption', e.target.value)}
          placeholder="Finish Option"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Artwork:</label>
        <input
          type="file"
          onChange={(e) => updateProduct('artwork', e.target.files[0])}
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Height: (in mm)</label>
        <input
          type="number"
          value={product.fields.size?.heightMM || ''}
          onChange={(e) => handleSizeChange('heightMM', e.target.value)}
          placeholder="Height in mm"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Width: (in mm)</label>
        <input
          type="number"
          value={product.fields.size?.widthMM || ''}
          onChange={(e) => handleSizeChange('widthMM', e.target.value)}
          placeholder="Width in mm"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-red-500">Height: (in Inches)</label>
        <input
          type="number"
          value={product.fields.size?.height || ''}
          readOnly
          placeholder="Height"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-red-500">Width: (in Inches)</label>
        <input
          type="number"
          value={product.fields.size?.width || ''}
          readOnly
          placeholder="Width"
        />
      </div>
    </div>
  );
};

export default BottlesAndJars;
