import React from 'react';

const Boxes = ({ product, updateProduct }) => {
  const handleSizeChange = (dimension, value) => {
    const size = { ...product.fields.size, [dimension]: value };
    if (dimension === 'heightMM') {
      size.height = (value / 25.4).toFixed(2);
    }
    if (dimension === 'widthMM') {
      size.width = (value / 25.4).toFixed(2);
    }
    if (dimension === 'lengthMM') {
      size.length = (value / 25.4).toFixed(2);
    }
    updateProduct('size', size);
  };

  return (
    <div className="product-form">
      <div className="form-group">
        <img src="https://shipping-quote.labelslab.com/boxes.jpg" alt="Placeholder" />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Design Type:</label>
        <select
          value={product.fields.designType}
          onChange={(e) => updateProduct('designType', e.target.value)}
        >
          <option value="">Select Design Type</option>
          {[...Array(15).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Requires Magnet:</label>
        <div className="radio-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
            <input
              type="radio"
              name="requiresMagnet"
              checked={product.fields.requiresMagnet === 'yes'}
              onChange={() => updateProduct('requiresMagnet', 'yes')}
            />
            Yes
          </label>
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
            <input
              type="radio"
              name="requiresMagnet"
              checked={product.fields.requiresMagnet === 'no'}
              onChange={() => updateProduct('requiresMagnet', 'no')}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Child Proof:</label>
        <div className="radio-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
            <input
              type="radio"
              name="childProof"
              checked={product.fields.childProof === 'yes'}
              onChange={() => updateProduct('childProof', 'yes')}
            />
            Yes
          </label>
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
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

      {/* Material Dropdown */}
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.material || ""}
          onChange={(e) => updateProduct('material', e.target.value)}
        >
          <option value="">Select Material</option>
          {[
            'BLACK CARDBOARD',
            'CORRUGATED PAPER',
            'GRAY RIGID CARDBOARD',
            'HOLOGRAM MATERIAL',
            'INSERT (CARDBOARD)',
            'KRAFT PAPER',
            'SILVER CARDBOARD',
            'WHITE CARDBOARD'
          ].map((material) => (
            <option key={material} value={material}>
              {material}
            </option>
          ))}
        </select>
      </div>

      {/* Thickness Input */}
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Thickness (in gsm):</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.thickness || ""}
          onChange={(e) => updateProduct('thickness', e.target.value)}
          placeholder="Thickness in gsm"
        />
      </div>

      {/* Finish Dropdown */}
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finish:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.finish || ""}
          onChange={(e) => updateProduct('finish', e.target.value)}
        >
          <option value="">Select Finish</option>
          {[
            'Matte Lamination',
            'Gloss Lamination',
            'Matte Varnish',
            'Gloss Varnish',
            'Soft Touch'
          ].map((finish) => (
            <option key={finish} value={finish}>
              {finish}
            </option>
          ))}
        </select>
      </div>

      {/* Special Effects Dropdown */}
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Special Effects:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.specialEffects || ""}
          onChange={(e) => updateProduct('specialEffects', e.target.value)}
        >
          <option value="">Select Special Effects</option>
          {[
            'Spot UV',
            'Embossing',
            'Metallics',
            'Debossing',
            'Hot Stamping / Foil',
            'Raised Varnish',
            'Hologram',
            'Window'
          ].map((effect) => (
            <option key={effect} value={effect}>
              {effect}
            </option>
          ))}
        </select>
      </div>

      {/* Insert Dropdown */}
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Insert:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.insert || ""}
          onChange={(e) => updateProduct('insert', e.target.value)}
        >
          <option value="">Select Insert</option>
          {[
            'None',
            'White Cardboard',
            'EVA',
            'Foam'
          ].map((insert) => (
            <option key={insert} value={insert}>
              {insert}
            </option>
          ))}
        </select>
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
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Length: (in mm)</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.lengthMM || ""}
          onChange={(e) => handleSizeChange('lengthMM', e.target.value)}
          placeholder="Length in mm"
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

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-red-500">Length: (in Inches)</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.length || ""}
          readOnly
          placeholder="Length"
        />
      </div>
    </div>
  );
};

export default Boxes;
