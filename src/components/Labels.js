import React from 'react';

const Labels = ({ product, updateProduct }) => {
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

  const handleSpecialNotesChange = (note) => {
    let notes = product.fields.specialNotes ? product.fields.specialNotes.split(',') : [];
    if (notes.includes(note)) {
      notes = notes.filter(n => n !== note);
    } else {
      notes.push(note);
    }
    updateProduct('specialNotes', notes.join(','));
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
            'CLEAR BOPP',
            'CLEAR ON CLEAR',
            'CLEAR POLY E',
            'CROMO PAPER + SPECIAL ADHESIVE',
            'DIRECT THERMAL PAPER',
            'DOUBLE SIDED',
            'DOUBLE SIDED WINDOW CLING',
            'EGG SHELL',
            'HOLOGRAM BOPP',
            'PAPER',
            'PIGGY BACK',
            'SATIN',
            'SHANAV WINE PAPER',
            'SILVER BOPP',
            'SILVER PAPER',
            'SILVER POLY E',
            'VOID',
            'WHITE BOPP',
            'WHITE PAPER',
            'WHITE POLY THICK',
            'WINDOW CLING',
            'WINE PAPER TEXTURED',
            'WINE WHITE PAPER',
            'WHITE POLY E'
          ].map((material) => (
            <option key={material} value={material}>
              {material}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Thickness (in GSM):</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.thickness || ""}
          onChange={(e) => updateProduct('thickness', e.target.value)}
          placeholder="Thickness in GSM"
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
            'Lamination',
            'Matte',
            'Matte Lamination',
            'Matte Varnish',
            'Gloss',
            'Gloss Lamination',
            'Gloss Varnish',
            'Varnish',
            'Clear Stamping'
          ].map((finish) => (
            <option key={finish} value={finish}>
              {finish}
            </option>
          ))}
        </select>
      </div>

      <div className=" col-span-2 mb-2">
        <label className="block tracking-wide text-sm font-bold leading-6 mb-5 text-gray-900">Special Effects:</label>
        <div className="grid gap-2 grid-cols-2">
          {[
            'Spot UV',
            'Metallics',
            'Embossing',
            'Thermal Varnish',
            'Foil Stamping',
            'UV Ink',
            'Raised Varnish'
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

      <div className=" col-span-2 mb-2">
        <label className="block tracking-wide text-sm font-bold leading-6 mb-5 text-gray-900">Special Note:</label>
        <div className="grid gap-2 grid-cols-2">
          {[
            'Pre-Cut',
            'Scratch-off',
            'Variable Data',
            'Easy removable adhesive',
            'Refrigerated adhesive'
          ].map((note) => (
            <label key={note} className="tracking-wide text-xs font-bold leading-6 text-gray-900 flex w-full flex-row" style={{ justifySelf: 'flex-start' }}>
              <input
                type="checkbox"
                checked={product.fields.specialNotes?.split(',').includes(note) || false}
                onChange={() => handleSpecialNotesChange(note)}
                className="mr-2 text-gray-900 dark:text-gray-300"
                style={{ width: '15px', height: '15px' }}
              />
              {note}
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

      <div className=" col-span-2 mb-2">
        <label className="tracking-wide text-xs font-bold leading-6 text-gray-900 flex w-full flex-row" style={{ justifySelf: 'flex-start' }}>
          <input
            type="checkbox"
            checked={product.fields.handApplied || false}
            onChange={(e) => updateProduct('handApplied', e.target.checked)}
            className="mr-2 text-gray-900 dark:text-gray-300"
            style={{ width: '15px', height: '15px' }}
          />
          Hand applied
        </label>
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

export default Labels;
