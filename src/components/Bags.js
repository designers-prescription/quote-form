import React, { useState, useEffect } from 'react';

const Bags = ({ product, updateProduct }) => {
  // Initialize state for bagType and selectedMaterial
  const [bagType, setBagType] = useState(product.fields.bagType || '');
  const [selectedMaterial, setSelectedMaterial] = useState(product.fields.material || '');
  const [bagSpecifications, setBagSpecifications] = useState(product.fields.bagSpecifications || []);
  const [width, setWidth] = useState(product.fields.width || '');
  const [height, setHeight] = useState(product.fields.height || '');

  useEffect(() => {
    // Update product.fields.bagType whenever bagType state changes
    updateProduct('bagType', bagType);
  }, [bagType, updateProduct]);

  useEffect(() => {
    // Update product.fields.bagSpecifications whenever bagSpecifications state changes
    updateProduct('bagSpecifications', bagSpecifications);
  }, [bagSpecifications, updateProduct]);

  useEffect(() => {
    // Update product.fields.width whenever width state changes
    updateProduct('width', width);
  }, [width, updateProduct]);

  useEffect(() => {
    // Update product.fields.height whenever height state changes
    updateProduct('height', height);
  }, [height, updateProduct]);

  // Bag types (static, not affecting other options)
  const bagTypes = [
    { value: '1', label: '3 Sided Sealed' },
    { value: '2', label: 'Stand Up with Bottom Gusset' },
    { value: '3', label: '3 Side Sealed with Zipper' },
    { value: '4', label: 'Flat Bottom with Zipper' },
    { value: '5', label: 'Back Side Sealed' },
    { value: '6', label: 'Side Gusset Pouch' },
    { value: '7', label: 'Roll Film' },
    { value: '8', label: 'Spout Bag' }
  ];

  // Material options
  const materialOptions = [
    "PET / VMPET / PE",
    "PET / PE",
    "MATTE OPP / VMPET / PE",
    "PET / AL / PE",
    "PET / LDPE",
    "ALOX",
    "KRAFT PAPER / PE",
    "KRAFT PAPER / VMPET / PE",
    "PE / PE",
    "KRAFT PAPER / PLA",
    "With clear window: Matte opp/PET/PE" // New option added here
  ];

  // Mapping of materials to their specific options
  const materialToOptionsMap = {
    "PET / VMPET / PE": {
      microns: ["90","100", "110", "120"],
      layers: ["1", "2" ,"3"],
      specialFeatures: ["Smell Proof", "Light Proof", "Air Proof", "Recyclable"],
      printingFinishes: ["Gloss", "Matte", "Soft Touch", "Varnish", "Lamination", "Spot UV"],
      substrateType: ["Hologram", "Metallic", "Clear", "White", "Kraft"]
    },
    "PET / PE": {
      microns: ["90","100","110", "120"],
      layers: ["1", "2"],
      specialFeatures: ["Smell Proof", "Air Proof"],
      printingFinishes: ["Gloss", "Matte", "Soft Touch", "Varnish", "Lamination", "Spot UV"],
      substrateType: ["Hologram", "Metallic", "Clear", "White", "Kraft"]
    },
    "MATTE OPP / VMPET / PE": {
      microns: ["90", "100", "110", "120"],
      layers: ["1", "2" ,"3"],
      specialFeatures: ["Smell Proof", "Light Proof", "Air Proof"],
      printingFinishes: ["Gloss", "Matte", "Soft Touch", "Varnish", "Lamination", "Spot UV"],
      substrateType: ["Hologram", "Metallic", "Clear", "White", "Kraft"]
    },
    "PET / AL / PE": {
      microns: ["90", "100", "110", "120"],
      layers: ["1", "2" ,"3"],
      specialFeatures: ["Smell Proof", "Light Proof", "Air Proof"],
      printingFinishes: ["Gloss", "Matte", "Soft Touch", "Varnish", "Lamination", "Spot UV"],
      substrateType: ["Hologram", "Metallic", "Clear", "White", "Kraft"]
    },
    "PET / LDPE": {
      microns: ["90", "100", "110", "120"],
      layers: ["1", "2"],
      specialFeatures: ["Smell Proof", "Air Proof"],
      printingFinishes: ["Gloss", "Matte", "Soft Touch", "Varnish", "Lamination", "Spot UV"],
      substrateType: ["Hologram", "Metallic", "Clear", "White", "Kraft"]
    },
    "ALOX": {
      microns: ["90", "100", "110", "120"],
      layers: [""],
      specialFeatures: ["Thin Transparent Aluminum Oxide Coating"],
      printingFinishes: [],
      substrateType: []
    },
    "KRAFT PAPER / PE": {
      microns: ["90", "100", "110", "120"],
      layers: [""],
      specialFeatures: ["Smell Proof", "Light Proof", "Air Proof", "Recyclable"],
      printingFinishes: [],
      substrateType: []
    },
    "KRAFT PAPER / VMPET / PE": {
      microns: ["90", "100", "110", "120"],
      layers: [""],
      specialFeatures: ["Smell Proof", "Light Proof", "Air Proof"],
      printingFinishes: [],
      substrateType: []
    },
    "PE / PE": {
      microns: ["90", "100", "110", "120"],
      layers: [""],
      specialFeatures: ["Smell Proof", "Light Proof", "Air Proof", "Recyclable"],
      printingFinishes: ["Gloss", "Matte", "Soft Touch", "Varnish", "Lamination", "Spot UV"],
      substrateType: []
    },
    "KRAFT PAPER / PLA": {
      microns: ["90", "100", "110", "120"],
      layers: [""],
      specialFeatures: ["Smell Proof", "Light Proof", "Air Proof", "Biodegradable", "Recyclable"],
      printingFinishes: ["Gloss", "Matte", "Soft Touch", "Varnish", "Lamination", "Spot UV"],
      substrateType: []
    },
    "With clear window: Matte opp/PET/PE": { // New material options
      microns: ["90", "100", "110", "120"],
      layers: ["1", "2"],
      specialFeatures: ["Clear Window", "Smell Proof", "Air Proof"],
      printingFinishes: ["Gloss", "Matte"],
      substrateType: ["Clear", "White"]
    }
  };

  // Handle material change
  const handleMaterialChange = (e) => {
    const material = e.target.value;
    setSelectedMaterial(material);
    updateProduct('material', material);
    // Reset dependent fields
    updateProduct('microns', '');
    updateProduct('layers', '');
    updateProduct('specialFeatures', []);
    updateProduct('printingFinishes', '');
    updateProduct('substrateType', '');
  };

  // Handle special features change
  const handleSpecialFeaturesChange = (feature) => {
    let currentFeatures = product.fields.specialFeatures || [];
    if (currentFeatures.includes(feature)) {
      currentFeatures = currentFeatures.filter(f => f !== feature);
    } else {
      currentFeatures.push(feature);
    }
    updateProduct('specialFeatures', currentFeatures);
  };

  // Handle bag specifications change
  const handleBagSpecificationChange = (option) => {
    let updatedSpecifications = [...bagSpecifications];
    if (updatedSpecifications.includes(option)) {
      updatedSpecifications = updatedSpecifications.filter(spec => spec !== option);
    } else {
      updatedSpecifications.push(option);
    }
    setBagSpecifications(updatedSpecifications);
  };

  // Render conditional fields based on selected material
  const renderConditionalFields = () => {
    if (!selectedMaterial) return null;
    const options = materialToOptionsMap[selectedMaterial] || {};

    return (
      <>
        {/* Microns */}
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Microns:</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
            value={product.fields.microns || ''}
            onChange={(e) => updateProduct('microns', e.target.value)}
          >
            <option value="">Select Microns</option>
            {options.microns.map((micron, index) => (
              <option key={index} value={micron}>{micron}</option>
            ))}
          </select>
        </div>

        {/* Layers */}
        <div className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Layers:</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
            value={product.fields.layers || ''}
            onChange={(e) => updateProduct('layers', e.target.value)}
          >
            <option value="">Select Layers</option>
            {options.layers.map((layer, index) => (
              <option key={index} value={layer}>{layer}</option>
            ))}
          </select>
        </div>

        {/* Special Features */}
        {options.specialFeatures.length > 0 && (
          <div className="form-group">
            <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Special Features:</label>
            <div className="grid gap-2 grid-cols-2">
              {options.specialFeatures.map((feature, index) => (
                <label key={index} className="flex items-center">
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
          </div>
        )}

        {/* Printing Finishes */}
        {options.printingFinishes.length > 0 && (
          <div className="form-group">
            <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Printing Finishes:</label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
              value={product.fields.printingFinishes || ''}
              onChange={(e) => updateProduct('printingFinishes', e.target.value)}
            >
              <option value="">Select Printing Finish</option>
              {options.printingFinishes.map((finish, index) => (
                <option key={index} value={finish}>{finish}</option>
              ))}
            </select>
          </div>
        )}

        {/* Substrate Type */}
        {options.substrateType.length > 0 && (
          <div className="form-group">
            <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Substrate Type:</label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
              value={product.fields.substrateType || ''}
              onChange={(e) => updateProduct('substrateType', e.target.value)}
            >
              <option value="">Select Substrate Type</option>
              {options.substrateType.map((substrate, index) => (
                <option key={index} value={substrate}>{substrate}</option>
              ))}
            </select>
          </div>
        )}
      </>
    );
  };

  // Render Bag Specification checkboxes
  const renderBagSpecifications = () => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Bag Specification:</label>
      <div className="grid gap-2 grid-cols-2">
        {['Tear Notch', 'Zipper', 'Rounded Corners', 'Pull Tab', 'Punch Hole', 'Sombrero Hole', 'Straight Corners', 'Tin tie'].map(option => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={bagSpecifications.includes(option)}
              onChange={() => handleBagSpecificationChange(option)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  // Render Loading Side dropdown
  const renderLoadingSide = () => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Loading Side:</label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
        value={product.fields.loadingSide || ''}
        onChange={(e) => updateProduct('loadingSide', e.target.value)}
      >
        <option value="">Select Loading Side</option>
        <option value="top">Top</option>
        <option value="bottom">Bottom</option>
        <option value="left">Left Side</option>
        <option value="right">Right Side</option>
      </select>
    </div>
  );

  // Render CR (Childproof) radio button
  const renderCRChildproof = () => (
    <div className="form-group">
      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">CR (Childproof):</label>
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="crChildproof"
            value="yes"
            checked={product.fields.crChildproof === 'yes'}
            onChange={(e) => updateProduct('crChildproof', e.target.value)}
            className="mr-2"
          />
          Yes
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="crChildproof"
            value="no"
            checked={product.fields.crChildproof === 'no'}
            onChange={(e) => updateProduct('crChildproof', e.target.value)}
            className="mr-2"
          />
          No
        </label>
      </div>
    </div>
  );

  return (
    <div className="product-form">
      {/* Bag Type */}
      <div className="form-group">
        <img src="https://shipping-quote.labelslab.com/bags.png" alt="BagsImage" />
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Select Bag Type:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
          value={bagType}
          onChange={(e) => setBagType(e.target.value)}
        >
          <option value="">Select Bag Type</option>
          {bagTypes.map((type) => (
            <option key={type.value} value={type.value}>{`${type.value} - ${type.label}`}</option>
          ))}
        </select>
      </div>

      {/* Width */}
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Width (in mm):</label>
        <input
          type="number"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
      </div>

      {/* Height */}
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Height (in mm):</label>
        <input
          type="number"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>

      {/* Material */}
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
          value={selectedMaterial}
          onChange={handleMaterialChange}
        >
          <option value="">Select Material</option>
          {materialOptions.map((material, index) => (
            <option key={index} value={material}>{material}</option>
          ))}
        </select>
      </div>

      {/* Conditional Fields Based on Material */}
      {renderConditionalFields()}

      {/* Additional Fields */}
      {renderBagSpecifications()}
      {renderLoadingSide()}
      {renderCRChildproof()}
    </div>
  );
};

export default Bags;
