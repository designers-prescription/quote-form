import React from 'react';
import { storage } from '../firebase'; // Adjust the path based on your file structure
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Bottles = ({ product, updateProduct }) => {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `bottles/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      updateProduct('bottleImage', downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

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
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Image Upload:</label>
        <input type="file" onChange={handleImageUpload} />
        <small>Clear picture of the bottle must be attached</small>
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Volume of the Bottle/Jar:</label>
        <input
          type="text"
          value={product.fields.volume || ''}
          onChange={(e) => updateProduct('volume', e.target.value)}
          placeholder="Volume"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Additional Materials:</label>
        <div className="radio-group">
          {['wood', 'metal', 'glass'].map((material) => (
            <label key={material}>
              <input
                type="radio"
                name="additionalMaterials"
                checked={product.fields.additionalMaterials === material}
                onChange={() => updateProduct('additionalMaterials', material)}
              />
              {material}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Silk Screen Printing:</label>
        <div className="radio-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
            <input
              type="radio"
              name="silkScreenPrinting"
              checked={product.fields.silkScreenPrinting === 'yes'}
              onChange={() => updateProduct('silkScreenPrinting', 'yes')}
            />
            Yes
          </label>
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">
            <input
              type="radio"
              name="silkScreenPrinting"
              checked={product.fields.silkScreenPrinting === 'no'}
              onChange={() => updateProduct('silkScreenPrinting', 'no')}
            />
            No
          </label>
        </div>
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
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          value={product.fields.material || ""}
          onChange={(e) => updateProduct('material', e.target.value)}
          placeholder="Material"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finish Type:</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          value={product.fields.finishType || ""}
          onChange={(e) => updateProduct('finishType', e.target.value)}
          placeholder="Finish Type"
        />
      </div>

      <div className="form-group">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finish Option:</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          value={product.fields.finishOption || ""}
          onChange={(e) => updateProduct('finishOption', e.target.value)}
          placeholder="Finish Option"
        />
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

export default Bottles;
