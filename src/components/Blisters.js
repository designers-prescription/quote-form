import React from 'react';

const Blisters = ({ product, updateProduct }) => {
  return (
    <div className="product-form">
      <div className="form-group">
         <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Clamshell:(restricted materials apply)</label>
        <div className="radio-group">
           <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="clamshell"
              checked={product.fields.clamshell === 'yes'}
              onChange={() => updateProduct('clamshell', 'yes')}
            />
            Yes 
          </label>
           <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="clamshell"
              checked={product.fields.clamshell === 'no'}
              onChange={() => updateProduct('clamshell', 'no')}
            />
            No
          </label>
        </div>
      </div>

      <div className="form-group">
         <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>3M Adhesive:</label>
        <div className="radio-group">
           <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="adhesive3M"
              checked={product.fields.adhesive3M === 'yes'}
              onChange={() => updateProduct('adhesive3M', 'yes')}
            />
            Yes
          </label>
           <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
            <input
              type="radio"
              name="adhesive3M"
              checked={product.fields.adhesive3M === 'no'}
              onChange={() => updateProduct('adhesive3M', 'no')}
            />
            No
          </label>
        </div>
      </div>
    </div>
  );
};

export default Blisters;
