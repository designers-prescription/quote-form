import React from 'react';

const Caps = ({ product, updateProduct }) => {
  return (
    <div className="product-form">
      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Cap Types:</label>
        <select
          value={product.fields.capType}
          onChange={(e) => updateProduct('capType', e.target.value)}
        >
          <option value="">Select Cap Type</option>
          <option value="twistCap">Twist Cap</option>
          <option value="flipCap">Flip Cap</option>
          <option value="sprayCap">Spray Cap</option>
          <option value="pressCap">Press Cap</option>
          <option value="pumpCap">Pump Cap</option>
          <option value="dripper">Dripper</option>
        </select>
      </div>

      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Additional Materials:</label>
        <div className="radio-group">
          {['wood', 'metal', 'glass'].map((material) => (
            <label key={material}>
              <input
                type="radio"
                name="additionalMaterialsForCaps"
                checked={product.fields.additionalMaterialsForCaps === material}
                onChange={() => updateProduct('additionalMaterialsForCaps', material)}
              />
              {material}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Child Proof:</label>
        <div className="radio-group">
          <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="childProofForCaps"
              checked={product.fields.childProofForCaps === 'yes'}
              onChange={() => updateProduct('childProofForCaps', 'yes')}
            />
            Yes
          </label>
          <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="childProofForCaps"
              checked={product.fields.childProofForCaps === 'no'}
              onChange={() => updateProduct('childProofForCaps', 'no')}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Color:</label>
        <input
          type="text"
          value={product.fields.colorForCaps || ''}
          onChange={(e) => updateProduct('colorForCaps', e.target.value)}
          placeholder="Color"
        />
      </div>
    </div>
  );
};

export default Caps;
