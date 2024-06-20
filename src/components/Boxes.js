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
    'COATED PAPER'
  ];

  const materialOptionsTwo = [
    'WHITE CARDBOARD',
    'SILVER CARDBOARD',
    'KRAFT PAPER'
  ];

  const materialOptionsThree = [
    'WHITE CARDBOARD',
    'SILVER CARDBOARD',
    'COATED PAPER'
  ];

  const materialOptionsFour = [
    'COATED PAPER'
  ];

  const thicknessOptions = [
    '300g',
    '350g',
    '400g',
    '450g'
  ];

  const thicknessOptionsTwo = [
    '157g'
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
    'Double Sided Printing'
  ];

  const insertOptions = [
    'None',
    'Cardboard',
    'EVA',
    'Plastic Shell',
    'Foam',
    'Rigid'
  ];

  const insertOptionsTwo = [
    'None',
    'Cardboard',
    'EVA',
    'Plastic Shell',
    'Foam'
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

  const renderMaterialField = (options) => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={product.fields.material || ""}
        onChange={(e) => updateProduct('material', e.target.value)}
      >
        {options.map((material, index) => (
          <option key={index} value={material}>{material}</option>
        ))}
      </select>
    </div>
  );

  const renderThicknessField = (options) => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Thickness:</label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={product.fields.thickness || ""}
        onChange={(e) => updateProduct('thickness', e.target.value)}
      >
        {options.map((thickness, index) => (
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

  const renderInsertField = (options) => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Insert:</label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={product.fields.insert || ""}
        onChange={(e) => updateProduct('insert', e.target.value)}
      >
        {options.map((insert, index) => (
          <option key={index} value={insert}>{insert}</option>
        ))}
      </select>
    </div>
  );

  const renderBoxOptions = () => {
    switch (product.fields.designType) {
      case '1':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField(materialOptionsThree)}
            {renderThicknessField(thicknessOptions)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField(insertOptionsTwo)}
          </>
        );
      case '2':
        return (
          <>
            {renderCommonFields()}
            {/* <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Belot Width (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.belotWidth || ""}
                onChange={(e) => handleSizeChange('belotWidth', e.target.value)}
                placeholder="Belot Width in mm"
              />
            </div> */}
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Bottom:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.bottom || ""}
                onChange={(e) => updateProduct('bottom', e.target.value)}
              >
                <option value="">Select Bottom</option>
                <option value="Auto lock">Auto lock</option>
                <option value="1-2-3 Envelope closure">1-2-3 Envelope closure</option>
              </select>
            </div>
            {renderMaterialField(materialOptionsTwo)}
            {renderThicknessField(thicknessOptions)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField(insertOptionsTwo)}
          </>
        );
      case '3':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField(materialOptionsThree)}
            {renderThicknessField(thicknessOptions)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField(insertOptionsTwo)}
          </>
        );
      case '4':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField(materialOptionsTwo)}
            {renderThicknessField(thicknessOptions)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField(insertOptions)}
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
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Thickness:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.thickness || ""}
                onChange={(e) => updateProduct('thickness', e.target.value)}
              >
                <option value="">Select Thickness</option>
                <option value="1-2-3 Envelope bottom closure">1-2-3 Envelope bottom closure</option>
                <option value="Autolock Glue Bottom">Autolock Glue Bottom</option>
              </select>
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
            {renderMaterialField(materialOptionsThree)}
            {renderThicknessField(thicknessOptionsTwo)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
          </>
        );
      case '6':
      case '7':
      case '8':
      case '10':
      case '12':
      case '13':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField(materialOptions)}
            {renderThicknessField(thicknessOptions)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField(insertOptionsTwo)}
          </>
        );
      case '9':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField(materialOptions)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField(insertOptions)}
          </>
        );
      case '11':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField(materialOptions)}
            {renderThicknessField(thicknessOptions)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField(insertOptions)}
          </>
        );
      case '14':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField(materialOptionsFour)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField(insertOptions)}
          </>
        );
      case '15':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialField(materialOptionsFour)}
            {renderFinishField()}
            {renderSpecialEffectsField()}
            {renderInsertField(insertOptions)}
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
          value={product.fields.designType || ""}
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
