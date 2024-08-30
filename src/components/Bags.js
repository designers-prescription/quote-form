import React, { useState, useEffect } from 'react';

const Bags = ({ product, updateProduct }) => {
  // Initialize state for bagType from product.fields.bagType
  const [bagType, setBagType] = useState(product.fields.bagType || '');

  useEffect(() => {
    // Update product.fields.bagType whenever bagType state changes
    updateProduct('bagType', bagType);
  }, [bagType, updateProduct]);

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

  const handleFoilNumberChange = (e) => {
    updateProduct('foilNumber', e.target.value);
  };

  const bagTypes = [
    { value: 1, label: '3 Sided Sealed' },
    { value: 2, label: 'Stand Up with bottom gusset without zipper' },
    { value: 3, label: '3 Side Sealed With Zipper' },
    { value: 4, label: 'Stand Up with bottom Gusset and Zipper' },
    { value: 5, label: 'Back Side Sealed' },
    { value: 6, label: 'Side Gusset Pouch' },
    { value: 7, label: 'Flat bottom with Zipper' },
    { value: 8, label: 'Special Shape Bag' },
    { value: 9, label: 'Roll Film' },
    { value: 10, label: 'Spout Bag' }
  ];

  const materialOptions = [
    "None",
    "PET / VMPET / PE (METALLIC GLOSS) Non Metallic as an option",
    "PET / PE (WHITE GLOSS 2 Layer) ",
    "MATTE OPP / VMPET / PE (MATTE) Silver Matt 3 Layers, Non Silver as an option",
    "PET / AL / PE 3 Layer Metallic/Non-Metallic as an Option Thicker Barrier than VMPET",
    "PET / LDPE - Smellproof, Metallic, Thicker Material Non Metallic is an option",
    "ALOX (Smellproof, Microwaveble, Air Proof) stronger than PET / LDPE",
    "KRAFT PAPER / PE 2 Layer (No Metallic Options)",
    "KRAFT PAPER / VMPET / PE 3 Layer (No Metallic Options)",
    "PE / PE (Recyclable)",
    "KRAFT PAPER / PLA (Compostable / Biodegradable) No Metallic Options",
  ];

  const renderCommonFields = () => (
    <>
      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Width (in mm):</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.widthMM || ""}
          onChange={(e) => handleSizeChange('widthMM', e.target.value)}
          placeholder="Width in mm"
        />
      </div>
      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Height (in mm):</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.heightMM || ""}
          onChange={(e) => handleSizeChange('heightMM', e.target.value)}
          placeholder="Height in mm"
        />
      </div>
    </>
  );

  const renderMaterialFields = () => (
    <>
      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Front Material:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.frontMaterial || ""}
          onChange={(e) => updateProduct('frontMaterial', e.target.value)}
        >
          {materialOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Back Material:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.backMaterial || ""}
          onChange={(e) => updateProduct('backMaterial', e.target.value)}
        >
          {materialOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </>
  );

  const renderFinishingOptions = () => (
    <div className="form-group">
      <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Finishings:</label>
      <div className="grid gap-2 grid-cols-2">
        {['Matte Lamination', 'Gloss Lamination', 'Soft Touch Lamination', 'Metallic White Support', 'Spot UV', 'Raised Varnish', 'Embossing', 'Hologram', 'Hot Foil Stamping'].map(option => (
          <label key={option} className="tracking-wide text-xs font-bold leading-6 text-gray-900 flex w-full flex-row" style={{ justifySelf: 'flex-start' }}>
            <input
              type="checkbox"
              name={option}
              checked={product.fields[option] || false}
              onChange={(e) => updateProduct(option, e.target.checked)}
              className="mr-2 text-gray-900 dark:text-gray-300"
              style={{ width: '15px', height: '15px' }}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  const renderBagOptions = () => {
    switch (bagType) {
      case '1':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Open Side:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.openSide || ""}
                onChange={(e) => updateProduct('openSide', e.target.value)}
              >
                <option value="">Select Side</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            {renderMaterialFields()}
            {renderFinishingOptions()}
          </>
        );
      case '2':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Total Gusset (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.totalGusset || ""}
                onChange={(e) => handleSizeChange('totalGusset', e.target.value)}
                placeholder="Total Gusset in mm"
              />
            </div>
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Gusset Type:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.gussetType || ""}
                onChange={(e) => updateProduct('gussetType', e.target.value)}
              >
                <option value="">Select Gusset Type</option>
                <option value="doyen">Doyen Gusset</option>
                <option value="k-seal">K Seal Gusset</option>
              </select>
            </div>
            {renderMaterialFields()}
            {renderFinishingOptions()}
          </>
        );
      case '3':
      case '8':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Open Side:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.openSide || ""}
                onChange={(e) => updateProduct('openSide', e.target.value)}
              >
                <option value="">Select Side</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Options:</label>
              <div className="grid gap-2 grid-cols-2">
                {['Tear Notches', 'Rounded Corners', 'Hang Hole', 'Sombrero Hole', 'Zipper', 'CR Zipper', 'Clear Window'].map(option => (
                  <label key={option} className="tracking-wide text-xs font-bold leading-6 text-gray-900 flex w-full flex-row" style={{ justifySelf: 'flex-start' }}>
                    <input
                      type="checkbox"
                      name={option}
                      checked={product.fields[option] || false}
                      onChange={(e) => updateProduct(option, e.target.checked)}
                      className="mr-2 text-gray-900 dark:text-gray-300"
                      style={{ width: '15px', height: '15px' }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            {renderMaterialFields()}
            {renderFinishingOptions()}
          </>
        );
      case '4':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Total Gusset (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.totalGusset || ""}
                onChange={(e) => handleSizeChange('totalGusset', e.target.value)}
                placeholder="Total Gusset in mm"
              />
            </div>
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Gusset Type:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.gussetType || ""}
                onChange={(e) => updateProduct('gussetType', e.target.value)}
              >
                <option value="">Select Gusset Type</option>
                <option value="doyen">Doyen Gusset</option>
                <option value="k-seal">K Seal Gusset</option>
              </select>
            </div>
            {renderMaterialFields()}
            {renderFinishingOptions()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Zipper Type:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.zipperType || ""}
                onChange={(e) => updateProduct('zipperType', e.target.value)}
              >
                <option value="">Select Zipper Type</option>
                <option value="regular-zipper">Regular Zipper</option>
                <option value="cr-zipper">CR Zipper</option>
              </select>
            </div>
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Options:</label>
              <div className="grid gap-2 grid-cols-2">
                {['Tear Notches', 'Rounded Corners', 'Hang Hole', 'Sombrero Hole', 'Clear Window'].map(option => (
                  <label key={option} className="tracking-wide text-xs font-bold leading-6 text-gray-900 flex w-full flex-row" style={{ justifySelf: 'flex-start' }}>
                    <input
                      type="checkbox"
                      name={option}
                      checked={product.fields[option] || false}
                      onChange={(e) => updateProduct(option, e.target.checked)}
                      className="mr-2 text-gray-900 dark:text-gray-300"
                      style={{ width: '15px', height: '15px' }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      case '5':
        return (
          <>
            {renderCommonFields()}
            {renderMaterialFields()}
            {renderFinishingOptions()}
          </>
        );
      case '6':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Total Side Gusset (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.totalSideGusset || ""}
                onChange={(e) => handleSizeChange('totalSideGusset', e.target.value)}
                placeholder="Total Side Gusset in mm"
              />
            </div>
            {renderMaterialFields()}
            {renderFinishingOptions()}
          </>
        );
      case '7':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Total Gusset (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.totalGusset || ""}
                onChange={(e) => handleSizeChange('totalGusset', e.target.value)}
                placeholder="Total Gusset in mm"
              />
            </div>
            {renderMaterialFields()}
            {renderFinishingOptions()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Options:</label>
              <div className="grid gap-2 grid-cols-2">
                {['Valve', 'Peel Stick', 'Tear Tab', 'Clear Window'].map(option => (
                  <label key={option} className="tracking-wide text-xs font-bold leading-6 text-gray-900 flex w-full flex-row" style={{ justifySelf: 'flex-start' }}>
                    <input
                      type="checkbox"
                      name={option}
                      checked={product.fields[option] || false}
                      onChange={(e) => updateProduct(option, e.target.checked)}
                      className="mr-2 text-gray-900 dark:text-gray-300"
                      style={{ width: '15px', height: '15px' }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      case '9':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Thickness (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.thicknessMM || ""}
                onChange={(e) => handleSizeChange('thicknessMM', e.target.value)}
                placeholder="Thickness in mm"
              />
            </div>
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Material:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={product.fields.material || ""}
                onChange={(e) => updateProduct('material', e.target.value)}
                placeholder="Material"
              />
            </div>
            {renderFinishingOptions()}
          </>
        );
      case '10':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Total Gusset (in mm):</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                value={product.fields.size?.totalGusset || ""}
                onChange={(e) => handleSizeChange('totalGusset', e.target.value)}
                placeholder="Total Gusset in mm"
              />
            </div>
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Gusset Type:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.gussetType || ""}
                onChange={(e) => updateProduct('gussetType', e.target.value)}
              >
                <option value="">Select Gusset Type</option>
                <option value="doyen">Doyen Gusset</option>
                <option value="k-seal">K Seal Gusset</option>
              </select>
            </div>
            <div className="form-group">
              <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Spout:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.spout || ""}
                onChange={(e) => updateProduct('spout', e.target.value)}
              >
                <option value="">Select Spout</option>
                <option value="Standard Cap">Standard Cap</option>
                <option value="Baby Safe Cap">Baby Safe Cap</option>
              </select>
            </div>
            {renderMaterialFields()}
            {renderFinishingOptions()}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="product-form">
      <div className="form-group">
        <img src="https://shipping-quote.labelslab.com/bags.png" alt="Placeholder" />
      </div>
      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Select Bag Type:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={bagType}
          onChange={(e) => setBagType(e.target.value)}
        >
          <option value="">Select Bag Type</option>
          {bagTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {`Type ${type.value} - ${type.label}`}
            </option>
          ))}
        </select>
      </div>
      {renderBagOptions()}
    </div>
  );
};

export default Bags;
