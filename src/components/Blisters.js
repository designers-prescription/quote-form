import React from 'react';

const Blisters = ({ product, updateProduct }) => {
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

  const renderCommonFields = () => (
    <>
      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Width (in mm):</label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="number"
          value={product.fields.size?.widthMM || ""}
          onChange={(e) => handleSizeChange('widthMM', e.target.value)}
          placeholder="Width in mm"
        />
      </div>
      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Height (in mm):</label>
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

  const renderFinishings = () => (
    <>
      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Finishings:</label>
        <div className="grid gap-2 grid-cols-2">
          {['Matte Lamination', 'Gloss Lamination', 'Soft Touch Lamination', 'Spot UV', 'Hot Stamping'].map(option => (
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

  const renderHangingHoles = () => (
    <>
      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Hanging Hole Options:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.hangingHole || ""}
          onChange={(e) => updateProduct('hangingHole', e.target.value)}
        >
          <option value="">Select Hanging Hole</option>
          <option value="hang-hole">Hang Hole</option>
          <option value="sombrero-hole">Sombrero Hole</option>
          <option value="delta-hole">Delta Hole</option>
        </select>
      </div>
    </>
  );

  const renderNotes = () => (
    <>
      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Notes:</label>
        <textarea
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.notes || ""}
          onChange={(e) => updateProduct('notes', e.target.value)}
          placeholder="Additional notes"
        />
      </div>
    </>
  );

  const renderBlisterOptions = () => {
    switch (product.fields.blisterType) {
      case '1':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group col-span-2">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.material || ""}
                onChange={(e) => updateProduct('material', e.target.value)}
              >
                <option value="">Select Material</option>
                <option value="350g white cardboard">350g White Cardboard</option>
                <option value="400g white cardboard">400g White Cardboard</option>
                <option value="350g silver cardboard">350g Silver Cardboard</option>
                <option value="400g silver cardboard">400g Silver Cardboard</option>
              </select>
            </div>
            <div className="form-group col-span-2">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Plastic Shell:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={product.fields.plasticShell || ""}
                onChange={(e) => updateProduct('plasticShell', e.target.value)}
                placeholder="Plastic Shell"
              />
            </div>
            <div className="form-group col-span-2">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">3M Tape:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={product.fields.tape3M || ""}
                onChange={(e) => updateProduct('tape3M', e.target.value)}
                placeholder="3M Tape"
              />
            </div>
            {renderFinishings()}
            {renderHangingHoles()}
            {renderNotes()}
          </>
        );
      case '2':
        return (
          <>
            {renderCommonFields()}
            <div className="form-group col-span-2">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Material:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={product.fields.material || ""}
                onChange={(e) => updateProduct('material', e.target.value)}
              >
                <option value="">Select Material</option>
                <option value="300g white cardboard">300g White Cardboard</option>
                <option value="350g white cardboard">350g White Cardboard</option>
                <option value="300g silver cardboard">300g Silver Cardboard</option>
                <option value="350g silver cardboard">350g Silver Cardboard</option>
              </select>
            </div>
            <div className="form-group col-span-2">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Internal Cardboard Size (W x H):</label>
              <div className="grid gap-2 grid-cols-2">
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="number"
                  value={product.fields.internalCardboardWidth || ""}
                  onChange={(e) => updateProduct('internalCardboardWidth', e.target.value)}
                  placeholder="Width in mm"
                />
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="number"
                  value={product.fields.internalCardboardHeight || ""}
                  onChange={(e) => updateProduct('internalCardboardHeight', e.target.value)}
                  placeholder="Height in mm"
                />
              </div>
            </div>
            {renderFinishings()}
            {renderHangingHoles()}
            {renderNotes()}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="product-form grid gap-2 grid-cols-2">
      <div className="form-group col-span-2">
        <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Select Blister Type:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={product.fields.blisterType || ""}
          onChange={(e) => updateProduct('blisterType', e.target.value)}
        >
          <option value="">Select Blister Type</option>
          <option value="1">Trapped Cardboard Blister</option>
          <option value="2">Plastic Shell Blister</option>
        </select>
      </div>
      {renderBlisterOptions()}
    </div>
  );
};

export default Blisters;
