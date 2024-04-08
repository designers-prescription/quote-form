import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

const CapsShipModal = ({ quote, onClose }) => {
    const [additionalData, setAdditionalData] = useState({
        commodityType: '',
        totalUnitsPerCommodity: '',
        numberOfUnitsPerBox: '',
        totalNumberOfBoxesPerCommodity: '',
        shipBoxDimensions: '',
        shipWeightPerBox: '',
        totalQtyOfBoxesPerCommodity: '',
        totalValuePerProductPerSize: '',
        overallValueForTheShipment: '',
        shippingVolumePerProduct: '',
        totalVolumeForTheWholeOrder: '',
        fromShippingAddress: '',
        toShippingAddress: '',
        splitShipping: ''
    });

    const [realTimeQuote, setRealTimeQuote] = useState(quote);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'QuoteRequirements', quote.id), (doc) => {
            setRealTimeQuote({ id: doc.id, ...doc.data() });
        });

        return () => unsubscribe();
    }, [quote.id]);

    const handleChange = (e) => {
        setAdditionalData({ ...additionalData, [e.target.name]: e.target.value });
    };

    const handleUpdateQuote = async (field) => {
        const quoteRef = doc(db, 'QuoteRequirements', realTimeQuote.id);
        await updateDoc(quoteRef, {
            [`productShipping.${field}`]: additionalData[field]
        });

        setAdditionalData({ ...additionalData, [field]: '' });
    };

    const formatFieldName = (fieldName) => {
        return fieldName
            .split(/(?=[A-Z])/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 bg-black w-full opacity-50"></div>
                <div className="relative bg-white rounded-lg p-6 m-2 w-7/12">
                    <div className="text-lg font-semibold mb-4">Edit Quote - Caps</div>
                    <div className="mb-4 grid text-sm grid-cols-4">
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Material:</span> {realTimeQuote.product.fields.material}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Size: </span>{realTimeQuote.product.fields.size}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Color: </span>{realTimeQuote.product.fields.color}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Style:</span> {realTimeQuote.product.fields.style}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Logo Required:</span> {realTimeQuote.product.fields.logoRequired}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Qty of SKU's:</span> {realTimeQuote.product.fields.qtyOfSKUs}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Total Qty:</span> {realTimeQuote.product.fields.totalQty}</p>
                        
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Cap Types:</span> {realTimeQuote.product.fields.capType}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Additional Materials:</span> {realTimeQuote.product.fields.additionalMaterialsForCaps}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Child Proof:</span> {realTimeQuote.product.fields.childProofForCaps}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Color:</span> {realTimeQuote.product.fields.colorForCaps}</p>

                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Unit Price: </span>{realTimeQuote.productPricing.unitPrice}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Overall Price: </span>{realTimeQuote.productPricing.overallPrice}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>One Time Charges: </span>{realTimeQuote.productPricing.oneTimeCharges}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Price Negotiated:</span> {realTimeQuote.productPricing.priceNegotiated}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Units Per Box:</span> {realTimeQuote.productPricing.unitsPerBox}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Total Boxes:</span> {realTimeQuote.productPricing.totalBoxes}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Box Dimensions:</span> {realTimeQuote.productPricing.boxDimensions}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Weight Per Box:</span> {realTimeQuote.productPricing.weightPerBox}</p>
                        <p className='p-2 m-1 rounded-md border border-dashed border-slate-500 bg-slate-50'><span className='tracking-wide font-bold leading-6 text-gray-900'>Total Weight:</span> {realTimeQuote.productPricing.totalWeight}</p>
                    </div>
                    <form className='grid grid-cols-2 gap-4'>
                        {Object.keys(additionalData).map((field) => (
                            <React.Fragment key={field}>
                                {realTimeQuote.productShipping?.[field] ? (
                                    <p className='text-sm p-2 mb-4 rounded-md border border-dashed border-slate-500 bg-slate-50'>
                                        <span className='tracking-wide font-bold leading-6 text-gray-900'>{formatFieldName(field)}: </span>
                                        {realTimeQuote.productShipping[field]}
                                    </p>
                                ) : (
                                    <div className='col-span-2'>
                                        <div className="mb-4 grid grid-cols-3 gap-4 middle">
                                            <div className='col-span-2'>
                                                <label htmlFor={field} className="tracking-wide text-sm font-bold leading-6 text-gray-900">{formatFieldName(field)}</label>
                                                <input
                                                    type="text"
                                                    id={field}
                                                    name={field}
                                                    value={additionalData[field]}
                                                    onChange={handleChange}
                                                    className="block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                />
                                            </div>
                                            <div className='flex flex-col justify-end'>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuote(field)}
                                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </form>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CapsShipModal;
