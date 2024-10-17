import React, { useState } from 'react';

const Boxes = ({ product, updateProduct }) => {
  const [selectedMaterial, setSelectedMaterial] = useState('');

  const boxTypeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

  const materialOptionsMap = {
    '1': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Corrugated paper', 'Hologram Cardboard'],
    '2': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Corrugated paper', 'Hologram Cardboard'],
    '3': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Corrugated paper', 'Hologram Cardboard'],
    '4': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Corrugated paper', 'Hologram Cardboard'],
    '5': ['Rigid cardboard'],
    '6': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Corrugated paper', 'Hologram Cardboard'],
    '7': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Corrugated paper', 'Hologram Cardboard'],
    '8': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Hologram Cardboard'],
    '9': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Corrugated paper', 'Hologram Cardboard'],
    '10': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Corrugated paper', 'Hologram Cardboard'],
    '11': ['Corrugated paper'],
    '12': ['White cardboard', 'Silver cardboard', 'Kraft paper', 'Hologram Cardboard'],
    '13': ['Rigid cardboard'],
    '14': ['Rigid cardboard'],
    '15': ['Rigid cardboard'],
  };

  const materialToOptionsMap = {
    'White cardboard': {
      bottomClosure: ['Auto Lock', '1-3 Envelope Closure'],
      thickness: ['200g', '250g', '300g', '350g', '400g'],
      specialFeatures: ['Light proof', 'biodegradable', 'recyclable'],
      printingFinishes: ['Gloss/ matte lamination', 'Soft touch', 'Gloss/ matte varnish', 'Spot UV', 'Embossing'],
      substrateType: ['Hologram', 'Metallic', 'Clear', 'White', 'Kraft'],
    },
    'Silver cardboard': {
      bottomClosure: ['Auto Lock', '1-3 Envelope Closure'],
      thickness: ['275g', '325g', '375g', '425g'],
      specialFeatures: [],
      printingFinishes: ['Gloss/ matte lamination', 'Soft touch', 'Gloss/ matte varnish', 'Spot UV', 'Embossing'],
      substrateType: ['Hologram', 'Metallic', 'Clear', 'White', 'Kraft'],
    },
    'Kraft paper': {
      bottomClosure: ['Auto Lock', '1-3 Envelope Closure'],
      thickness: ['200g', '250g', '300g', '350g'],
      specialFeatures: ['Light proof', 'biodegradable', 'recyclable'],
      printingFinishes: ['Gloss/ matte lamination', 'Gloss/ matte varnish', 'Spot UV'],
      substrateType: [],
    },
    'Corrugated paper': {
      bottomClosure: ['Auto Lock', '1-3 Envelope Closure'],
      thickness: ['250g/300g/350g white cardboard + corrugated paper'],
      specialFeatures: ['Light proof', 'biodegradable', 'recyclable'],
      printingFinishes: ['Gloss/ matte lamination', 'Soft touch', 'Gloss/ matte varnish', 'Spot UV', 'Embossing'],
      substrateType: ['Kraft', 'White'],
    },
    'Hologram Cardboard': {
      bottomClosure: ['Auto Lock', '1-3 Envelope Closure'],
      thickness: ['?'],
      specialFeatures: [],
      printingFinishes: [],
      substrateType: [],
    },
    'Rigid cardboard': {
      bottomClosure: ['Magnetic Closure', 'Rigid Lid'],
      thickness: ['1mm', '2mm', '3mm'],
      specialFeatures: ['Sturdy', 'Reinforced'],
      printingFinishes: ['Gloss/ matte lamination', 'Soft touch'],
      substrateType: ['White', 'Kraft'],
    },
  };

  const handleBoxTypeChange = (value) => {
    updateProduct('boxType', value);
    setSelectedMaterial(''); // Reset material selection when box type changes
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterial(material);
    updateProduct('material', material);
  };

  const handleSpecialFeaturesChange = (feature) => {
    let currentFeatures = product.fields.specialFeatures ? product.fields.specialFeatures.split(',') : [];

    if (currentFeatures.includes(feature)) {
      currentFeatures = currentFeatures.filter(f => f !== feature);
    } else {
      currentFeatures.push(feature);
    }

    updateProduct('specialFeatures', currentFeatures.join(','));
  };

  const renderMaterialOptions = () => {
    const boxType = product.fields.boxType;
    const materials = materialOptionsMap[boxType] || [];

    return (
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={selectedMaterial || ''}
          onChange={(e) => handleMaterialChange(e.target.value)}
        >
          <option value="">Select Material</option>
          {materials.map((material, index) => (
            <option key={index} value={material}>{material}</option>
          ))}
        </select>
      </div>
    );
  };

  const renderOptionsBasedOnMaterial = () => {
    if (!selectedMaterial) return null;

    const options = materialToOptionsMap[selectedMaterial] || {};

    return (
      <>
        {/* Bottom Closure */}
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Bottom Closure:</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={product.fields.bottomClosure || ''}
            onChange={(e) => updateProduct('bottomClosure', e.target.value)}
          >
            {options.bottomClosure?.map((closure, index) => (
              <option key={index} value={closure}>{closure}</option>
            ))}
          </select>
        </div>

        {/* Thickness */}
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Thickness:</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={product.fields.thickness || ''}
            onChange={(e) => updateProduct('thickness', e.target.value)}
          >
            {options.thickness?.map((thick, index) => (
              <option key={index} value={thick}>{thick}</option>
            ))}
          </select>
        </div>

        {/* Height, Width, Depth */}
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Height (mm):</label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={product.fields.height || ''}
            onChange={(e) => updateProduct('height', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Width (mm):</label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={product.fields.width || ''}
            onChange={(e) => updateProduct('width', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Depth (mm):</label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={product.fields.depth || ''}
            onChange={(e) => updateProduct('depth', e.target.value)}
          />
        </div>

        {/* Special Features */}
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Special Features:</label>
          {options.specialFeatures?.map((feature, index) => (
            <label key={index} className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
              <input
                type="checkbox"
                checked={product.fields.specialFeatures?.includes(feature) || false}
                onChange={() => handleSpecialFeaturesChange(feature)}
                className="mr-2"
              />
              {feature}
            </label>
          ))}
        </div>

        {/* Printing Finishes */}
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Printing Finishes:</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={product.fields.printingFinishes || ''}
            onChange={(e) => updateProduct('printingFinishes', e.target.value)}
          >
            {options.printingFinishes?.map((finish, index) => (
              <option key={index} value={finish}>{finish}</option>
            ))}
          </select>
        </div>

        {/* Substrate Type */}
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Substrate Type:</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={product.fields.substrateType || ''}
            onChange={(e) => updateProduct('substrateType', e.target.value)}
          >
            {options.substrateType?.map((substrate, index) => (
              <option key={index} value={substrate}>{substrate}</option>
            ))}
          </select>
        </div>

        {/* Insert */}
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Insert:</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={product.fields.insert || ''}
            onChange={(e) => updateProduct('insert', e.target.value)}
          >
            <option value="">Select Insert</option>
            <option value="Cardboard">Cardboard</option>
            <option value="Eva">Eva</option>
            <option value="Plastic Shell">Plastic Shell</option>
            <option value="Foam">Foam</option>
          </select>
        </div>
      </>
    );
  };

  return (
    <div className="product-form">
      <div className="form-group">
        <img src="https://shipping-quote.labelslab.com/boxes.jpg" alt="Boxes Options" />
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Box Type:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.boxType || ''}
          onChange={(e) => handleBoxTypeChange(e.target.value)}
        >
          <option value="">Select Box Type</option>
          {boxTypeOptions.map((boxType, index) => (
            <option key={index} value={boxType}>#{boxType}</option>
          ))}
        </select>
      </div>

      {/* Render material options based on the box type */}
      {renderMaterialOptions()}

      {/* Render other fields based on the selected material */}
      {renderOptionsBasedOnMaterial()}
    </div>
  );
};

export default Boxes;
