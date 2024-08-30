import React from 'react';

const Sachet = ({ product, updateProduct }) => {
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

  const handleSpecialEffectsChange = (effect) => {
    let effects = product.fields.specialEffects ? product.fields.specialEffects.split(',') : [];
    if (effects.includes(effect)) {
      effects = effects.filter(e => e !== effect);
    } else {
      effects.push(effect);
    }
    updateProduct('specialEffects', effects.join(','));
  };

  return (
    <div className="product-form grid gap-2 grid-cols-2">
      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.material || ""}
          onChange={(e) => updateProduct('material', e.target.value)}
        >
          <option value="">Select Material</option>
          {[
            'Clear Sachet',
            'Silver Sachet',
            'White Sachet',
            'Soft Touch Sachet'
          ].map((material) => (
            <option key={material} value={material}>
              {material}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Thickness:</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          value={product.fields.thickness || ""}
          onChange={(e) => updateProduct('thickness', e.target.value)}
          placeholder="Enter Thickness"
        />
      </div>

      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finish:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.finish || ""}
          onChange={(e) => updateProduct('finish', e.target.value)}
        >
          <option value="">Select Finish</option>
          {[
            'Matte Lamination',
            'Matte Varnish',
            'Gloss Lamination',
            'Gloss Varnish',
            'Soft Touch'
          ].map((finish) => (
            <option key={finish} value={finish}>
              {finish}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-2 mb-2">
        <label className="block tracking-wide text-sm font-bold leading-6 mb-5 text-gray-900">Special Effects:</label>
        <div className="grid gap-2 grid-cols-2">
          {[
            'Spot UV',
            'Metallics',
            'Foil Stamping'
          ].map((effect) => (
            <label key={effect} className="tracking-wide text-xs font-bold leading-6 text-gray-900 flex w-full flex-row" style={{ justifySelf: 'flex-start' }}>
              <input
                type="checkbox"
                checked={product.fields.specialEffects?.split(',').includes(effect) || false}
                onChange={() => handleSpecialEffectsChange(effect)}
                className="mr-2 text-gray-900 dark:text-gray-300"
                style={{ width: '15px', height: '15px' }}
              />
              {effect}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Rolling Direction:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.rollingDirection || ""}
          onChange={(e) => updateProduct('rollingDirection', e.target.value)}
        >
          <option value="">Select Rolling Direction</option>
          {[
            '1 - Internal',
            '2 - Internal',
            '3 - Internal',
            '4 - Internal',
            '5 - External',
            '6 - External',
            '7 - External',
            '8 - External'
          ].map((direction) => (
            <option key={direction} value={direction}>
              {direction}
            </option>
          ))}
        </select>
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

export default Sachet;
