import React from 'react';

const StandUpPouches = ({ product, updateProduct }) => {
    return (
        <div className="product-form">
            <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Custom Die Cut Shape Pouch:</label>
                <div>
                    <div className="radio-group">
                        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
                            <input
                                type="radio"
                                name="customDieCutShape"
                                checked={product.fields.customDieCutShape === 'yes'}
                                onChange={() => updateProduct('customDieCutShape', 'yes')}
                            />
                            Yes
                        </label>
                        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
                            <input
                                type="radio"
                                name="customDieCutShape"
                                checked={product.fields.customDieCutShape === 'no'}
                                onChange={() => updateProduct('customDieCutShape', 'no')}
                            />
                            No
                        </label>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Pouch Type:</label>
                <select
                    value={product.fields.pouchType}
                    onChange={(e) => updateProduct('pouchType', e.target.value)}
                >
                    <option value="">Select Pouch Type</option>
                    {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                            Type {num + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Environmentally Friendly:</label>
                <div className="radio-group">
                    <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
                        <input
                            type="radio"
                            name="environmentallyFriendly"
                            checked={product.fields.environmentallyFriendly === 'yes'}
                            onChange={() => updateProduct('environmentallyFriendly', 'yes')}
                        />
                        Yes
                    </label>
                    <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
                        <input
                            type="radio"
                            name="environmentallyFriendly"
                            checked={product.fields.environmentallyFriendly === 'no'}
                            onChange={() => updateProduct('environmentallyFriendly', 'no')}
                        />
                        No
                    </label>
                </div>
                {product.fields.environmentallyFriendly === 'yes' && (
                    <div className="radio-group">
                        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
                            <input
                                type="radio"
                                name="environmentalOption"
                                checked={product.fields.environmentalOption === 'biodegradable'}
                                onChange={() => updateProduct('environmentalOption', 'biodegradable')}
                            />
                            Biodegradable
                        </label>
                        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
                            <input
                                type="radio"
                                name="environmentalOption"
                                checked={product.fields.environmentalOption === 'recyclable'}
                                onChange={() => updateProduct('environmentalOption', 'recyclable')}
                            />
                            Recyclable
                        </label>
                        <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
                            <input
                                type="radio"
                                name="environmentalOption"
                                checked={product.fields.environmentalOption === 'compostable'}
                                onChange={() => updateProduct('environmentalOption', 'compostable')}
                            />
                            Compostable
                        </label>
                    </div>
                )}
            </div>
            <div className="form-group">
                <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>Child Proof:</label>
                <div className="radio-group">
                    <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
                        <input
                            type="radio"
                            name="childProof"
                            checked={product.fields.childProof === 'yes'}
                            onChange={() => updateProduct('childProof', 'yes')}
                        />
                        Yes
                    </label>
                    <label className='block tracking-wide text-sm font-bold leading-6 text-gray-900'>
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

export default StandUpPouches;
