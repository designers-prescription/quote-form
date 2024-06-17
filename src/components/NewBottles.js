import React, { useState } from 'react';

const Bottles = ({ product, updateProduct }) => {
  const [materialGroup, setMaterialGroup] = useState('');
  const [materialSubGroup, setMaterialSubGroup] = useState('');
  const [capacity, setCapacity] = useState('');
  const [color, setColor] = useState('');
  const [cap, setCap] = useState('');
  const [size, setSize] = useState('');
  const [threading, setThreading] = useState('');

  const materialOptions = {
    Aluminium: [],
    Glass: [],
    Plastic: ['LDPE', 'PET', 'PP', 'HDPE']
  };

  const capacityOptions = [
    '.5 Oz', '1 Oz', '2 Oz', '3 Oz', '4 Oz', '6 Oz', '8 Oz', 'Other'
  ];

  const colorOptions = [
    'Amber', 'Blue', 'Clear', 'Green', 'Natural', 'Silver (Aluminium)'
  ];

  const capOptions = [
    'Beer Bottle Caps', 'Dropper Caps', 'Spice & Sifter Caps', 'Bottle Pourer Caps', 
    'Flip Top Caps', 'Spout Caps', 'Brush & Dauber Caps', 'Mister Caps', 
    'Tamper-Evident Caps', 'Child-Resistant Capable Caps', 'Orifice Reducers', 
    'Threaded & Lug Caps', 'Corks & Stoppers', 'Pump Caps', 'Trigger Sprayers', 
    'Disc Caps', 'Shrink Bands & Cap Liners'
  ];

  const threadingOptions = [
    '400', '410', '415', '425'
  ];

  const handleMaterialGroupChange = (value) => {
    setMaterialGroup(value);
    setMaterialSubGroup('');
  };

  return (
    <div className="bottles-form">
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material Group:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={materialGroup}
          onChange={(e) => handleMaterialGroupChange(e.target.value)}
        >
          <option value="">Select Material Group</option>
          {Object.keys(materialOptions).map((group, index) => (
            <option key={index} value={group}>{group}</option>
          ))}
        </select>
        {materialGroup && materialOptions[materialGroup].length > 0 && (
            <>
        <img src="https://shipping-quote.labelslab.com/Plastic-Recycling-Symbol.jpg" alt="Materials" className="mb-2" />

          <select
            className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={materialSubGroup}
            onChange={(e) => setMaterialSubGroup(e.target.value)}
          >
            <option value="">Select Sub-Group</option>
            {materialOptions[materialGroup].map((subGroup, index) => (
              <option key={index} value={subGroup}>{subGroup}</option>
            ))}
          </select>
          </>
        )}
      </div>
      
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Capacity:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        >
          <option value="">Select Capacity</option>
          {capacityOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Color:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          <option value="">Select Color</option>
          {colorOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Caps:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={cap}
          onChange={(e) => setCap(e.target.value)}
        >
          <option value="">Select Cap</option>
          {capOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Size (Outer Diameter):</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="Enter Size"
        />
      </div>
      
      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Type of Threading:</label>
        <img src="https://shipping-quote.labelslab.com/styles-v2.png" alt="Threading Example" className="mb-2" />
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={threading}
          onChange={(e) => setThreading(e.target.value)}
        >
          <option value="">Select Threading</option>
          {threadingOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Bottles;
