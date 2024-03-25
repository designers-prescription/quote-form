import React from 'react';

const StandUpPouches = ({ product, updateProduct }) => {
    return (
        <div className="product-form">
            <div className="form-group">
                <label>Custom Die Cut Shape Pouch:</label>
                <div>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="customDieCutShape"
                                checked={product.fields.customDieCutShape === 'yes'}
                                onChange={() => updateProduct('customDieCutShape', 'yes')}
                            />
                            Yes
                        </label>
                        <label>
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
                <label>Pouch Type:</label>
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
                <label>Environmentally Friendly:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="environmentallyFriendly"
                            checked={product.fields.environmentallyFriendly === 'yes'}
                            onChange={() => updateProduct('environmentallyFriendly', 'yes')}
                        />
                        Yes
                    </label>
                    <label>
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
                        <label>
                            <input
                                type="radio"
                                name="environmentalOption"
                                checked={product.fields.environmentalOption === 'biodegradable'}
                                onChange={() => updateProduct('environmentalOption', 'biodegradable')}
                            />
                            Biodegradable
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="environmentalOption"
                                checked={product.fields.environmentalOption === 'recyclable'}
                                onChange={() => updateProduct('environmentalOption', 'recyclable')}
                            />
                            Recyclable
                        </label>
                        <label>
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

            {/* Add more common fields for all product types */}
            <div className="form-group">
                <label>Is the order over 10K USD before shipping:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="orderOver10K"
                            checked={product.fields.orderOver10K === 'yes'}
                            onChange={() => updateProduct('orderOver10K', 'yes')}
                        />
                        Yes
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="orderOver10K"
                            checked={product.fields.orderOver10K === 'no'}
                            onChange={() => updateProduct('orderOver10K', 'no')}
                        />
                        No
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label>Material:</label>
                <input
                    type="text"
                    value={product.fields.material || ''}
                    onChange={(e) => updateProduct('material', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Finish Type:</label>
                <input
                    type="text"
                    value={product.fields.finishType || ''}
                    onChange={(e) => updateProduct('finishType', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Finish Option:</label>
                <input
                    type="text"
                    value={product.fields.finishOption || ''}
                    onChange={(e) => updateProduct('finishOption', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Size:</label>
                <input
                    type="text"
                    value={product.fields.size || ''}
                    onChange={(e) => updateProduct('size', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Qty of SKU's:</label>
                <input
                    type="number"
                    value={product.fields.qtyOfSKUs || ''}
                    onChange={(e) => updateProduct('qtyOfSKUs', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Total Qty:</label>
                <input
                    type="number"
                    value={product.fields.totalQty || ''}
                    onChange={(e) => updateProduct('totalQty', e.target.value)}
                />
            </div>
        </div>
    );
};

export default StandUpPouches;
