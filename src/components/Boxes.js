import React from 'react';

const Boxes = ({ product, updateProduct }) => {
  return (
    <div className="product-form">
      <div className="form-group">
        <img src="https://via.placeholder.com/150" alt="Placeholder" />
      </div>

      <div className="form-group">
        <label>Design Type:</label>
        <select
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

      <div className="form-group">
        <label>Requires Magnet:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="requiresMagnet"
              checked={product.fields.requiresMagnet === 'yes'}
              onChange={() => updateProduct('requiresMagnet', 'yes')}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="requiresMagnet"
              checked={product.fields.requiresMagnet === 'no'}
              onChange={() => updateProduct('requiresMagnet', 'no')}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Child Proof:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="childProof"
              checked={product.fields.childProof === 'yes'}
              onChange={() => updateProduct('childProof', 'yes')}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="childProof"
              checked={product.fields.childProof === 'no'}
              onChange={() => updateProduct('childProof', 'no')}
            />
            No
          </label>
        </div>
      </div>
    </div>
  );
};

export default Boxes;
