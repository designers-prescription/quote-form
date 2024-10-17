
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
import Modal from "../components/Modal"; // Assuming a Modal component exists or needs to be created

const StepOne = () => {
  const [user] = useAuthState(auth);
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [salesRepName, setSalesRepName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [mainAddress, setMainAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
  }, [mainAddress]);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        productType: '',
        SKUs: 1,
        quantities: 1,
        skuDetails: [],
        fields: {},
        address: mainAddress,
        packagingInstructions: '',
        shippingInstructions: '',
        imageUrl: ''
      }
    ]);
  };

  const duplicateProduct = (index) => {
    const productToDuplicate = { ...products[index] };
    setProducts([...products, productToDuplicate]);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;

    if (field === 'SKUs' || field === 'quantities') {
      const skus = newProducts[index].SKUs;
      const quantities = newProducts[index].quantities;
      
      newProducts[index].skuDetails = Array.from({ length: skus }, (_, skuIndex) => ({
        sku: skuIndex + 1,
        quantities: Array.from({ length: quantities }, (_, qtyIndex) => ({
          quantity: qtyIndex + 1,
          value: newProducts[index].skuDetails?.[skuIndex]?.quantities?.[qtyIndex]?.value || 0
        }))
      }));
    }

    setProducts(newProducts);
  };

  const handleSKUQuantityChange = (productIndex, skuIndex, qtyIndex, value) => {
    const newProducts = [...products];
    newProducts[productIndex].skuDetails[skuIndex].quantities[qtyIndex].value = value;
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

  const removeProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmationModal(true);
  };

  const handleEdit = () => {
    setShowConfirmationModal(false);
  };

  const handleSubmit = async () => {
    if (!customerName || !salesRepName || !products[0].productType) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    let uniqueProjectId = projectId || await generateUniqueProjectId();

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

      setTimeout(() => {
        setCustomerName("");
        setSalesRepName("");
        setProducts([]);
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

  return (
    <>
      <Header />
      <div className="parent-container pt-5 h-100 pb-10 p-4 sm:ml-64">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl p-10 mb-6" style={{ textAlign: "center" }}>
            Step One: Quote Requirements
          </h2>
          <form onSubmit={(e) => { e.preventDefault(); handleConfirmSubmit(); }}>

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
            </div>

            {products.map((product, index) => (
              <div key={index} className="mb-6 border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Product {index + 1}</h3>
                  <div>
                    <button
                      type="button"
                      className="mr-4 text-green-500 hover:text-green-700"
                      onClick={() => duplicateProduct(index)}
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeProduct(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

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
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Shipping Instructions: (Please do not add address) </label>
                  <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={product.shippingInstructions}
                    onChange={(e) => handleShippingInstructionsChange(index, e.target.value)}
                    placeholder="Shipping Instructions"
                  />
                </div>

                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">SKU Count:</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    type="number"
                    name="SKU"
                    value={product.SKUs}
                    onChange={(e) => handleProductChange(index, "SKUs", Math.max(0, e.target.value))}
                    placeholder="Number of SKUs"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity Count:</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    type="number"
                    name="Quantity"
                    value={product.quantities}
                    onChange={(e) => handleProductChange(index, "quantities", Math.max(0, e.target.value))}
                    placeholder="Number of Quantities"
                    required
                  />
                </div>

                {product.skuDetails.map((sku, skuIndex) => (
                  <div key={skuIndex} className="mb-4">
                    <h4 className="text-md font-semibold mb-2">SKU {sku.sku}</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {sku.quantities.map((qty, qtyIndex) => (
                        <div key={qtyIndex} className="mb-2">
                          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity {qty.quantity}:</label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            type="number"
                            value={qty.value}
                            onChange={(e) => handleSKUQuantityChange(index, skuIndex, qtyIndex, e.target.value)}
                            placeholder={`Quantity ${qty.quantity}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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

          {showConfirmationModal && (
            <Modal
              title="Confirm Submission"
              onClose={handleEdit}
              onConfirm={handleSubmit}
              confirmText="Submit"
              cancelText="Edit"
            >
              Are you sure you want to submit this quote?
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default StepOne;
