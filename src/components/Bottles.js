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

  return (
    <div className="product-form">
      <div className="form-group">
        <label>Image Upload:</label>
        <input type="file" onChange={handleImageUpload} />
        <small>Clear picture of the bottle must be attached</small>
      </div>

      <div className="form-group">
        <label>Volume of the Bottle:</label>
        <input
          type="text"
          value={product.fields.volume || ''}
          onChange={(e) => updateProduct('volume', e.target.value)}
          placeholder="Volume"
        />
      </div>

      <div className="form-group">
        <label>Additional Materials:</label>
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
        <label>Silk Screen Printing:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="silkScreenPrinting"
              checked={product.fields.silkScreenPrinting === 'yes'}
              onChange={() => updateProduct('silkScreenPrinting', 'yes')}
            />
            Yes
          </label>
          <label>
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
        <label>Color:</label>
        <input
          type="text"
          value={product.fields.color || ''}
          onChange={(e) => updateProduct('color', e.target.value)}
          placeholder="Color"
        />
      </div>
    </div>
  );
};

export default Bottles;
