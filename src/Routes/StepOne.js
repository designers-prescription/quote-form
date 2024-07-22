import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, getDoc, serverTimestamp, query, collection, getDocs } from "firebase/firestore";
import StandUpPouches from "../components/StandUpPouches";
import Boxes from "../components/Boxes";
import Bottles from "../components/NewBottles";
import Caps from "../components/Caps";
import Blisters from "../components/Blisters";
import Header from "../components/Header";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShrinkSleeves from "../components/ShrinkSleeves";
import Labels from "../components/Labels";
import Bags from "../components/Bags";
import Sachets from "../components/Sachets";

const StepOne = () => {
  const [user] = useAuthState(auth);
  const [products, setProducts] = useState([{
    productType: '',
    SKU: 1,
    quantities: { Q1: {}, Q2: {}, Q3: {} },
    fields: {},
    address: '',
    packagingInstructions: '',
    shippingInstructions: '',
    imageUrl: ''
  }]);
  const [customerName, setCustomerName] = useState("");
  const [salesRepName, setSalesRepName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [mainAddress, setMainAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserName = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSalesRepName(userData.name);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };

      fetchUserName();
    }
  }, [user]);

  useEffect(() => {
    setProducts(products.map(product => ({ ...product, address: mainAddress })));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainAddress]);

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;

    if (field === 'SKU') {
      const newQuantities = { Q1: {}, Q2: {}, Q3: {} };
      for (let i = 0; i < value; i++) {
        newQuantities.Q1[i] = newProducts[index].quantities.Q1[i] || 0;
        newQuantities.Q2[i] = newProducts[index].quantities.Q2[i] || 0;
        newQuantities.Q3[i] = newProducts[index].quantities.Q3[i] || 0;
      }
      newProducts[index].quantities = newQuantities;
    }

    setProducts(newProducts);
  };

  const handleQuantityChange = (index, qKey, skuIndex, value) => {
    const newProducts = [...products];
    if (!newProducts[index].quantities[qKey]) {
      newProducts[index].quantities[qKey] = {};
    }
    newProducts[index].quantities[qKey][skuIndex] = value;
    setProducts(newProducts);
  };

  const handleFieldChange = (index, field, value) => {
    const newProducts = [...products];
    if (!newProducts[index].fields) {
      newProducts[index].fields = {};
    }
    newProducts[index].fields[field] = value;
    setProducts(newProducts);
  };

  const handleFileChange = async (e, index, field) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `quotes/${projectId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    handleFieldChange(index, field, downloadURL);
  };

  const handleAddressChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].address = value;
    setProducts(newProducts);
  };

  const handlePackagingInstructionsChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].packagingInstructions = value;
    setProducts(newProducts);
  };

  const handleShippingInstructionsChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].shippingInstructions = value;
    setProducts(newProducts);
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `quotes/${projectId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    const newProducts = [...products];
    newProducts[index].imageUrl = downloadURL;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, {
      productType: '',
      SKU: 1,
      quantities: { Q1: {}, Q2: {}, Q3: {} },
      fields: {},
      address: mainAddress,
      packagingInstructions: '',
      shippingInstructions: '',
      imageUrl: ''
    }]);
  };

  const removeProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const generateUniqueProjectId = async () => {
    const baseId = "LL";
    let idNumber = 1;
    let newProjectId = `${baseId}${idNumber.toString().padStart(3, "0")}`;

    const projectsCollection = collection(db, "QuoteRequirements");
    const existingProjectIds = await getDocs(query(projectsCollection));

    const existingIds = existingProjectIds.docs.map(doc => doc.data().projectId);

    while (existingIds.includes(newProjectId)) {
      idNumber++;
      newProjectId = `${baseId}${idNumber.toString().padStart(3, "0")}`;
    }

    return newProjectId;
  };

  const notifyMaria = async (quoteId) => {
    try {
      await fetch('https://ghft6mowc4.execute-api.us-east-2.amazonaws.com/default/QuoteForm-EmailSender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientEmail: 'maria@labelslab.com',
          quoteId: quoteId
        })
      });
    } catch (error) {
      console.error('Error notifying Maria:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !salesRepName || !products[0].productType) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    let uniqueProjectId = projectId;
    let isUnique = false;

    while (!isUnique) {
      const docRef = doc(db, "QuoteRequirements", uniqueProjectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        isUnique = true;
      } else {
        uniqueProjectId = await generateUniqueProjectId();
      }
    }

    const quoteData = {
      createdBy: user.uid,
      createdOn: serverTimestamp(),
      customerName,
      salesRepName,
      projectName,
      projectId: uniqueProjectId,
      products,
    };

    try {
      await setDoc(doc(db, "QuoteRequirements", uniqueProjectId), quoteData);
      toast.success("Form submitted successfully!");
      await notifyMaria(uniqueProjectId); // Notify Maria
      setTimeout(() => {
        setCustomerName("");
        setSalesRepName("");
        setProducts([{
          productType: '',
          SKU: 1,
          quantities: { Q1: {}, Q2: {}, Q3: {} },
          fields: {},
          address: '',
          packagingInstructions: '',
          shippingInstructions: '',
          imageUrl: ''
        }]);
        setProjectName("");
        setProjectId("");
        setMainAddress("");
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to submit the form.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeProjectId = async () => {
      const newProjectId = await generateUniqueProjectId();
      setProjectId(newProjectId);
    };

    initializeProjectId();
  }, []);

  const productComponents = {
    StandUpPouches,
    Boxes,
    Bottles,
    Caps,
    Blisters,
    ShrinkSleeves,
    Labels,
    Bags,
    Sachets,
  };

  const calculateProductTotals = (quantities) => {
    let totals = { Q1: 0, Q2: 0, Q3: 0 };
    Object.keys(quantities).forEach((qKey) => {
      Object.values(quantities[qKey]).forEach(value => {
        totals[qKey] += parseInt(value, 10) || 0;
      });
    });
    return totals;
  };

  return (
    <>
      <Header />
      <div className="parent-container pt-5 h-100 pb-10 p-4 sm:ml-64">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl p-10 mb-6" style={{ textAlign: "center" }}>
            Step One: Quote Requirements
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Customer Name:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Sales Rep Name:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={salesRepName}
                onChange={(e) => setSalesRepName(e.target.value)}
                placeholder="Sales Rep Name"
                required
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Project Name:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Project ID:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={projectId}
                readOnly
                placeholder="Project ID"
              />
              <small className="text-gray-500 text-xs">Project ID is auto-generated and cannot be changed.</small>
            </div>
            {/* <div className="mb-4">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Address:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={mainAddress}
                onChange={(e) => setMainAddress(e.target.value)}
                placeholder="Address"
                required
              />
            </div> */}

            {products.map((product, index) => (
              <div key={index} className="mb-6 border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Product {index + 1}</h3>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeProduct(index)}
                  >
                    Remove
                  </button>
                </div>

                {/* <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Product Address:</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    type="text"
                    value={product.address}
                    onChange={(e) => handleAddressChange(index, e.target.value)}
                    placeholder="Product Address"
                    required
                  />
                </div> */}

                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Packaging Instructions:</label>
                  <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={product.packagingInstructions}
                    onChange={(e) => handlePackagingInstructionsChange(index, e.target.value)}
                    placeholder="Packaging Instructions"
                  />
                </div>

                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Shipping Instructions:</label>
                  <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={product.shippingInstructions}
                    onChange={(e) => handleShippingInstructionsChange(index, e.target.value)}
                    placeholder="Shipping Instructions"
                  />
                </div>

                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Product Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={`Product ${index + 1}`} className="mt-2 w-32 h-32 object-cover" />
                  )}
                </div>

                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">SKU Count:</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    type="number"
                    name="SKU"
                    value={product.SKU}
                    onChange={(e) => handleProductChange(index, "SKU", Math.max(0, e.target.value))}
                    placeholder="Number of SKUs"
                    required
                  />
                </div>

                <div className="grid mt-2 gap-2">
                  {[...Array(parseInt(product.SKU))].map((_, skuIndex) => (
                    <div key={skuIndex} className="mb-2">
                      <h4 className="text-md font-semibold">SKU {skuIndex + 1}</h4>
                      <div className="grid mt-1 gap-5 grid-cols-3">
                        <div className="mb-2">
                          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity 1:</label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            type="number"
                            value={product.quantities.Q1[skuIndex] || ""}
                            onChange={(e) => handleQuantityChange(index, "Q1", skuIndex, e.target.value)}
                            placeholder="Quantity 1"
                          />
                        </div>

                        <div className="mb-2">
                          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity 2:</label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            type="number"
                            value={product.quantities.Q2[skuIndex] || ""}
                            onChange={(e) => handleQuantityChange(index, "Q2", skuIndex, e.target.value)}
                            placeholder="Quantity 2"
                          />
                        </div>

                        <div className="mb-2">
                          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity 3:</label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            type="number"
                            value={product.quantities.Q3[skuIndex] || ""}
                            onChange={(e) => handleQuantityChange(index, "Q3", skuIndex, e.target.value)}
                            placeholder="Quantity 3"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Product Total Quantities:</h4>
                  <div className="grid gap-5 grid-cols-3">
                    <div className="form-group">
                      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Total Quantity 1:</label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        type="number"
                        value={calculateProductTotals(product.quantities).Q1}
                        readOnly
                        placeholder="Total Quantity 1"
                      />
                    </div>

                    <div className="form-group">
                      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Total Quantity 2:</label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        type="number"
                        value={calculateProductTotals(product.quantities).Q2}
                        readOnly
                        placeholder="Total Quantity 2"
                      />
                    </div>

                    <div className="form-group">
                      <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Total Quantity 3:</label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        type="number"
                        value={calculateProductTotals(product.quantities).Q3}
                        readOnly
                        placeholder="Total Quantity 3"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Product Type:</label>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    name="productType"
                    value={product.productType}
                    onChange={(e) => handleProductChange(index, "productType", e.target.value)}
                    required
                  >
                    <option value="">Select Product Type</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Caps">Caps</option>
                    <option value="Blisters">Blisters</option>
                    <option value="ShrinkSleeves">Shrink Sleeves</option>
                    <option value="Labels">Labels</option>
                    <option value="Bags">Bags</option>
                    <option value="Sachets">Sachets</option>
                  </select>
                </div>

                {product.productType && productComponents[product.productType] && (
                  <div className="mb-4">
                    <h4 className="text-md font-semibold mb-2">Custom Fields for {product.productType}</h4>
                    {React.createElement(productComponents[product.productType], {
                      product: product,
                      updateProduct: (field, value) => handleFieldChange(index, field, value),
                      handleFileChange: (e) => handleFileChange(e, index, e.target.name),
                      handleInputChange: (e) => handleFieldChange(index, e.target.name, e.target.value),
                    })}
                  </div>
                )}
              </div>
            ))}

            <div className="mb-6">
              <button
                type="button"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-green-500 text-white hover:bg-green-700"
                onClick={addProduct}
              >
                Add Another Product
              </button>
            </div>

            <button
              className="mt-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Quote"}
            </button>
          </form>
          <ToastContainer position="top-center" autoClose={9000} />
        </div>
      </div>
    </>
  );
};

export default StepOne;