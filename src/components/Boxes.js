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
    if (dimension === 'depthMM') {
      size.depth = (value / 25.4).toFixed(2);
    }
    if (dimension === 'lengthMM') {
      size.length = (value / 25.4).toFixed(2);
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

  const materialOptions = [
    'WHITE CARDBOARD',
    'SILVER CARDBOARD',
    'KRAFT PAPER',
    'CORRUGATED',
    'COATED PAPER AND RIGID MATERIAL'
  ];

  const thicknessOptions = [
    '300g',
    '350g',
    '400g',
    '450g'
  ];

  const finishOptions = [
    'Matte Lamination',
    'Gloss Lamination',
    'Soft Touch Lamination'
  ];

  const specialEffectsOptions = [
    'White Support',
    'Hot Stamping',
    'Spot UV',
    'Raised Varnish',
    'Hologram',
    'Embossing',
    'Debossing',
    'Window'
  ];

  const insertOptions = [
    'None',
    'Cardboard',
    'EVA',
    'Plastic Shell',
    'Foam',
    'Rigid'
  ];

  const renderCommonFields = () => (
    <>
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Height (in mm):</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.heightMM || ""}
          onChange={(e) => handleSizeChange('heightMM', e.target.value)}
          placeholder="Height in mm"
        />
      </div>
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Depth (in mm):</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.depthMM || ""}
          onChange={(e) => handleSizeChange('depthMM', e.target.value)}
          placeholder="Depth in mm"
        />
      </div>
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Width (in mm):</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.widthMM || ""}
          onChange={(e) => handleSizeChange('widthMM', e.target.value)}
          placeholder="Width in mm"
        />
      </div>
    </>
  );

  const renderMaterialField = () => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={product.fields.material || ""}
        onChange={(e) => updateProduct('material', e.target.value)}
      >
        {materialOptions.map((material, index) => (
          <option key={index} value={material}>{material}</option>
        ))}
      </select>
    </div>
  );

  const renderThicknessField = () => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Thickness:</label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={product.fields.thickness || ""}
        onChange={(e) => updateProduct('thickness', e.target.value)}
      >
        {thicknessOptions.map((thickness, index) => (
          <option key={index} value={thickness}>{thickness}</option>
        ))}
      </select>
    </div>
  );

  const renderFinishField = () => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finish:</label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={product.fields.finish || ""}
        onChange={(e) => updateProduct('finish', e.target.value)}
      >
        {finishOptions.map((finish, index) => (
          <option key={index} value={finish}>{finish}</option>
        ))}
      </select>
    </div>
  );

  const renderSpecialEffectsField = () => (
    <div className="form-group col-span-2 mb-2">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900 mb-5">Special Effects:</label>
      <div className="grid gap-2 grid-cols-2">
        {specialEffectsOptions.map((effect, index) => (
          <label key={index} className="tracking-wide text-xs font-bold leading-6 text-gray-900 flex w-full flex-row" style={{ justifySelf: 'flex-start' }}>
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
  );

  const renderInsertField = () => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Insert:</label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={product.fields.insert || ""}
        onChange={(e) => updateProduct('insert', e.target.value)}
      >
        {insertOptions.map((insert, index) => (
          <option key={index} value={insert}>{insert}</option>
        ))}
      </select>
    </div>
  );

  const renderBoxOptions = () => {
    switch (product.fields.designType) {
      case '1':
      case '2':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField()}
            {renderThicknessField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField()}
          </>
        );
      case '3':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Hang Flap Size (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.hangFlapSize || ""}
                onChange={(e) => handleSizeChange('hangFlapSize', e.target.value)}
                placeholder="Hang Flap Size in mm"
              />
            </div>
            {renderMaterialField()}
            {renderThicknessField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField()}
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Hanging Hole:</label>
              <div className="radio-group">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="hangingHole"
                    checked={product.fields.hangingHole === 'yes'}
                    onChange={() => updateProduct('hangingHole', 'yes')}
                  />
                  Yes
                </label>
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="hangingHole"
                    checked={product.fields.hangingHole === 'no'}
                    onChange={() => updateProduct('hangingHole', 'no')}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Sombrero Hole:</label>
              <div className="radio-group">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="sombreroHole"
                    checked={product.fields.sombreroHole === 'yes'}
                    onChange={() => updateProduct('sombreroHole', 'yes')}
                  />
                  Yes
                </label>
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="sombreroHole"
                    checked={product.fields.sombreroHole === 'no'}
                    onChange={() => updateProduct('sombreroHole', 'no')}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Delta Hole:</label>
              <div className="radio-group">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="deltaHole"
                    checked={product.fields.deltaHole === 'yes'}
                    onChange={() => updateProduct('deltaHole', 'yes')}
                  />
                  Yes
                </label>
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="deltaHole"
                    checked={product.fields.deltaHole === 'no'}
                    onChange={() => updateProduct('deltaHole', 'no')}
                  />
                  No
                </label>
              </div>
            </div>
          </>
        );
      case '4':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField()}
            {renderThicknessField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField()}
          </>
        );
      case '5':
        return (
          <>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Lid Diameter (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.lidDiameter || ""}
                onChange={(e) => handleSizeChange('lidDiameter', e.target.value)}
                placeholder="Lid Diameter in mm"
              />
            </div>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Height (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.heightMM || ""}
                onChange={(e) => handleSizeChange('heightMM', e.target.value)}
                placeholder="Height in mm"
              />
            </div>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Lid Height (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.lidHeight || ""}
                onChange={(e) => handleSizeChange('lidHeight', e.target.value)}
                placeholder="Lid Height in mm"
              />
            </div>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Base Height (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.baseHeight || ""}
                onChange={(e) => handleSizeChange('baseHeight', e.target.value)}
                placeholder="Base Height in mm"
              />
            </div>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Inner Tube Exposed Height (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.innerTubeExposedHeight || ""}
                onChange={(e) => handleSizeChange('innerTubeExposedHeight', e.target.value)}
                placeholder="Inner Tube Exposed Height in mm"
              />
            </div>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">EVA Insert:</label>
              <div className="radio-group">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="evaInsert"
                    checked={product.fields.evaInsert === 'yes'}
                    onChange={() => updateProduct('evaInsert', 'yes')}
                  />
                  Yes
                </label>
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="evaInsert"
                    checked={product.fields.evaInsert === 'no'}
                    onChange={() => updateProduct('evaInsert', 'no')}
                  />
                  No
                </label>
              </div>
            </div>
            {renderMaterialField()}
            {renderThicknessField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
          </>
        );
      case '6':
      case '7':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField()}
            {renderThicknessField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField()}
          </>
        );
      case '8':
      case '9':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField()}
          </>
        );
      case '10':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField()}
            {renderThicknessField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField()}
          </>
        );
      case '11':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField()}
            {renderThicknessField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField()}
          </>
        );
      case '12':
      case '13':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField()}
            {renderThicknessField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField()}
          </>
        );
      case '14':
      case '15':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField()}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField()}
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Magnetic Closure:</label>
              <div className="radio-group">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="magneticClosure"
                    checked={product.fields.magneticClosure === 'yes'}
                    onChange={() => updateProduct('magneticClosure', 'yes')}
                  />
                  Yes
                </label>
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
                  <input
                    type="radio"
                    name="magneticClosure"
                    checked={product.fields.magneticClosure === 'no'}
                    onChange={() => updateProduct('magneticClosure', 'no')}
                  />
                  No
                </label>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="product-form">
      <div className="form-group">
        <img src="https://shipping-quote.labelslab.com/boxes.jpg" alt="Placeholder" />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Design Type:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
      {renderBoxOptions()}
    </div>
  );
};

export default Boxes;

