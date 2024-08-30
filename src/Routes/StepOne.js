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
import ConfirmationModal from "../components/ConfirmationModal"; // Import the modal

const StepOne = () => {
  const [user] = useAuthState(auth);
  const [products, setProducts] = useState([
    {
      productType: '',
      SKU: 1,
      quantitiesCount: 1,
      skuDetails: [],
      fields: {},
      address: '',
      packagingInstructions: '',
      shippingInstructions: '',
      imageUrl: ''
    }
  ]);
  const [customerName, setCustomerName] = useState("");
  const [salesRepName, setSalesRepName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [mainAddress, setMainAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;

    if (field === 'SKU' || field === 'quantitiesCount') {
      const skus = newProducts[index].SKU;
      const quantities = newProducts[index].quantitiesCount;

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

  const handleSKUQuantityChange = (index, skuIndex, qtyIndex, value) => {
    const newProducts = [...products];
    newProducts[index].skuDetails[skuIndex].quantities[qtyIndex].value = parseInt(value) || 0;
    setProducts(newProducts);
  };

  const handleFieldChange = (index, field, value) => {
    const newProducts = [...products];
    if (!newProducts[index].fields) {
      newProducts[index].fields = {};
    }
    
    // Update field directly for packaging and shipping instructions
    if (field === "packagingInstructions" || field === "shippingInstructions") {
      newProducts[index][field] = value;
    } else {
      newProducts[index].fields[field] = value;
    }

    setProducts(newProducts);
  };

  const handleFileChange = async (e, index, field) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `quotes/${projectId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    handleFieldChange(index, field, downloadURL);
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
      quantitiesCount: 1,
      skuDetails: [],
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

  const notifyMaria = async (quoteId, subject, textBody, htmlBody) => {
    try {
      await fetch('https://ghft6mowc4.execute-api.us-east-2.amazonaws.com/default/QuoteForm-EmailSender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientEmail: 'maria@labelslab.com',
          subject: subject,
          textBody: textBody,
          htmlBody: htmlBody
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

      const subject = 'New Quote Submitted';
      const textBody = `A new quote has been submitted. View it at https://shipping-quote.labelslab.com/packaging-details/${uniqueProjectId}`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; margin: 20px;">
          <h2 style="color: #333;">New Quote Submitted</h2>
          <p style="font-size: 16px; color: #555;">
            A new quote has been submitted. Click the button below to view the details:
          </p>
          <a href="https://shipping-quote.labelslab.com/packaging-details/${uniqueProjectId}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
            View the Quote
          </a>
          <p style="font-size: 14px; color: #999; margin-top: 20px;">
            If you have any questions, please contact us at <a href="mailto:vaibhav@designersprescription.com" style="color: #007BFF;">vaibhav@designersprescription.com</a>.
          </p>
        </div>
      `;

      await notifyMaria(uniqueProjectId, subject, textBody, htmlBody); // Notify Maria
      setTimeout(() => {
        setCustomerName("");
        setSalesRepName("");
        setProducts([{
          productType: '',
          SKU: 1,
          quantitiesCount: 1,
          skuDetails: [],
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

  return (
    <>
      <Header />
      <div className="parent-container pt-5 h-100 pb-10 p-4 sm:ml-64">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl p-10 mb-6" style={{ textAlign: "center" }}>
            Step One: Quote Requirements
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Customer Details Section */}
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
            {/* Sales Rep Name */}
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
            {/* Project Details */}
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

            {/* Products Section */}
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

                {/* Packaging Instructions */}
                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Packaging Instructions:</label>
                  <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={product.packagingInstructions}
                    onChange={(e) => handleFieldChange(index, "packagingInstructions", e.target.value)}
                    placeholder="Packaging Instructions"
                  />
                </div>

                {/* Shipping Instructions */}
                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Shipping Instructions: (Please do not add address) </label>
                  <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={product.shippingInstructions}
                    onChange={(e) => handleFieldChange(index, "shippingInstructions", e.target.value)}
                    placeholder="Shipping Instructions"
                  />
                </div>

                {/* Additional Product Fields */}
                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">PMS QTY:</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    type="number"
                    value={product.fields.pmsQty || ""}
                    onChange={(e) => handleFieldChange(index, "pmsQty", e.target.value)}
                    placeholder="PMS QTY"
                  />
                </div>

                {/* Product Image Upload */}
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

                {/* SKU and Quantities Configuration */}
                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">SKU Count:</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    type="number"
                    name="SKU"
                    value={product.SKU}
                    onChange={(e) => handleProductChange(index, "SKU", Math.max(1, e.target.value))}
                    placeholder="Number of SKUs"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantities Count:</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    type="number"
                    name="quantitiesCount"
                    value={product.quantitiesCount}
                    onChange={(e) => handleProductChange(index, "quantitiesCount", Math.max(1, e.target.value))}
                    placeholder="Number of Quantities"
                    required
                  />
                </div>

                {/* SKU Details Configuration */}
                <div className="grid mt-2 gap-2">
                  {product.skuDetails?.map((sku, skuIndex) => (
                    <div key={skuIndex} className="mb-2">
                      <h4 className="text-md font-semibold">SKU {sku.sku}</h4>
                      <div className="grid mt-1 gap-5 grid-cols-3">
                        {sku.quantities.map((quantity, qtyIndex) => (
                          <div key={qtyIndex} className="mb-2">
                            <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity {quantity.quantity}:</label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              type="number"
                              value={quantity.value}
                              onChange={(e) => handleSKUQuantityChange(index, skuIndex, qtyIndex, e.target.value)}
                              placeholder={`Quantity ${quantity.quantity}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Product Type Selector */}
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

                {/* Dynamic Product Component Rendering */}
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

            {/* Add Product Button */}
            <div className="mb-6">
              <button
                type="button"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-green-500 text-white hover:bg-green-700"
                onClick={addProduct}
              >
                Add Another Product
              </button>
            </div>

            {/* Preview and Submit Buttons */}
            <button
              type="button"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-yellow-500 text-white hover:bg-yellow-600 mr-2"
              onClick={() => setIsModalOpen(true)}
            >
              Preview Quote
            </button>

            <button
              className="mt-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Quote"}
            </button>
          </form>
          <ToastContainer position="top-center" autoClose={9000} />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        quoteData={{ customerName, salesRepName, projectName, projectId, products }}
      />
    </>
  );
};

export default StepOne;
