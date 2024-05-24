import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import StandUpPouches from "../components/StandUpPouches";
import Boxes from "../components/Boxes";
import Bottles from "../components/Bottles";
import Caps from "../components/Caps";
import Blisters from "../components/Blisters";
import Header from "../components/Header";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Adjust the path to match your file structure
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StepOne = () => {
  const [user] = useAuthState(auth);
  const [productType, setProductType] = useState("");
  const [productFields, setProductFields] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [salesRepName, setSalesRepName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [totalQty01, setTotalQty01] = useState("");
  const [totalQty02, setTotalQty02] = useState("");
  const [totalQty03, setTotalQty03] = useState("");

  useEffect(() => {
    let totalSkuQuantity01 = 0;
    let totalSkuQuantity02 = 0;
    let totalSkuQuantity03 = 0;

    for (let i = 1; i <= parseInt(productFields.numberOfSKUs, 10); i++) {
      totalSkuQuantity01 += parseInt(productFields[`sku${i}Quantity01`], 10) || 0;
      totalSkuQuantity02 += parseInt(productFields[`sku${i}Quantity02`], 10) || 0;
      totalSkuQuantity03 += parseInt(productFields[`sku${i}Quantity03`], 10) || 0;
    }

    setTotalQty01(totalSkuQuantity01);
    setTotalQty02(totalSkuQuantity02);
    setTotalQty03(totalSkuQuantity03);
  }, [productFields]);

  const updateProductFields = (field, value) => {
    if (field === "size" && value.heightMM) {
      value.height = (value.heightMM / 25.4).toFixed(2);
    }
    if (field === "size" && value.widthMM) {
      value.width = (value.widthMM / 25.4).toFixed(2);
    }
    setProductFields({ ...productFields, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !salesRepName || !productType) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true); // Set loading to true

    const quoteId = uuidv4();

    let artworkURL = null;
    if (productFields.artwork) {
      // Upload the artwork file to Firebase Storage
      const storageRef = ref(storage, `artwork/${productFields.artwork.name}`);
      const snapshot = await uploadBytes(storageRef, productFields.artwork);
      artworkURL = await getDownloadURL(snapshot.ref);
    }

    const quoteData = {
      createdBy: user.uid,
      createdOn: serverTimestamp(),
      customerName,
      salesRepName,
      projectName,
      projectId,
      product: {
        type: productType,
        fields: {
          ...productFields,
          artwork: artworkURL, // Store the URL of the uploaded artwork
          quantity01: totalQty01,
          quantity02: totalQty02,
          quantity03: totalQty03,
        },
      },
    };

    try {
      await setDoc(doc(db, "QuoteRequirements", quoteId), quoteData);
      toast.success("Form submitted successfully!"); // Display success toast
      // Reset form and reload page after a short delay
      setTimeout(() => {
        setCustomerName("");
        setSalesRepName("");
        setProductType("");
        setProductFields({});
        setProjectName("");
        setProjectId("");
        setIsLoading(false); // Set loading to false
        // window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to submit the form."); // Display error toast
      setIsLoading(false); // Set loading to false
    }
  };

  const renderProductForm = () => {
    switch (productType) {
      case "Stand Up Pouches":
        return (
          <StandUpPouches
            product={{ fields: productFields }}
            updateProduct={updateProductFields}
          />
        );
      case "Boxes":
        return (
          <Boxes
            product={{ fields: productFields }}
            updateProduct={updateProductFields}
          />
        );
      case "Bottles":
        return (
          <Bottles
            product={{ fields: productFields }}
            updateProduct={updateProductFields}
          />
        );
      case "Caps":
        return (
          <Caps
            product={{ fields: productFields }}
            updateProduct={updateProductFields}
          />
        );
      case "Blisters":
        return (
          <Blisters
            product={{ fields: productFields }}
            updateProduct={updateProductFields}
          />
        );
      // Add cases for other product types
      default:
        return null;
    }
  };

  // const renderSizeFields = () => {
  //   return (
  //     <div>
  //       <div className="form-group">
  //         <label className="block tracking-wide text-sm font-bold leading-6 text-red-500">Height: (in Inches)</label>
  //         <input
  //           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //           type="number"
  //           value={productFields.size?.height || ""}
  //           readOnly
  //           placeholder="Height"
  //         />
  //       </div>

  //       <div className="form-group">
  //         <label className="block tracking-wide text-sm font-bold leading-6 text-red-500">Width: (in Inches)</label>
  //         <input
  //           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //           type="number"
  //           value={productFields.size?.width || ""}
  //           readOnly
  //           placeholder="Width"
  //         />
  //       </div>

  //       <div className="form-group">
  //         <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Height: (in mm)</label>
  //         <input
  //           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //           type="number"
  //           value={productFields.size?.heightMM || ""}
  //           onChange={(e) =>
  //             updateProductFields("size", {
  //               ...productFields.size,
  //               heightMM: e.target.value,
  //               height: (e.target.value / 25.4).toFixed(2)
  //             })
  //           }
  //           placeholder="Height in mm"
  //         />
  //       </div>

  //       <div className="form-group">
  //         <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Width: (in mm)</label>
  //         <input
  //           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //           type="number"
  //           value={productFields.size?.widthMM || ""}
  //           onChange={(e) =>
  //             updateProductFields("size", {
  //               ...productFields.size,
  //               widthMM: e.target.value,
  //               width: (e.target.value / 25.4).toFixed(2)
  //             })
  //           }
  //           placeholder="Width in mm"
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  const renderSKUQuantityFields = () => {
    const numberOfSKUs = parseInt(productFields.numberOfSKUs, 10) || 0;
    const skuQuantityFields = [];
    for (let i = 1; i <= numberOfSKUs; i++) {
      skuQuantityFields.push(
        <div key={`sku${i}`} className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">SKU {i} Quantity 01:</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="number"
            value={productFields[`sku${i}Quantity01`] || ""}
            onChange={(e) =>
              updateProductFields(`sku${i}Quantity01`, e.target.value)
            }
            placeholder={`SKU ${i} Quantity 01`}
          />
        </div>
      );

      skuQuantityFields.push(
        <div key={`sku${i}`} className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">SKU {i} Quantity 02:</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="number"
            value={productFields[`sku${i}Quantity02`] || ""}
            onChange={(e) =>
              updateProductFields(`sku${i}Quantity02`, e.target.value)
            }
            placeholder={`SKU ${i} Quantity 02`}
          />
        </div>
      );

      skuQuantityFields.push(
        <div key={`sku${i}`} className="form-group">
          <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">SKU {i} Quantity 03:</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="number"
            value={productFields[`sku${i}Quantity03`] || ""}
            onChange={(e) =>
              updateProductFields(`sku${i}Quantity03`, e.target.value)
            }
            placeholder={`SKU ${i} Quantity 03`}
          />
        </div>
      );
    }
    return skuQuantityFields;
  };

  return (
    <>
      <Header />
      <div className="parent-container pt-5 h-100 pb-10 p-4 sm:ml-64">
        <h2 className="text-3xl p-10 mb-6" style={{ textAlign: "center" }}>
          Step One: Quote Requirements
        </h2>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Project Name</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
              />
            </div>
            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Project ID</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Project ID"
              />
            </div>

            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Customer Name<span className="text-red-500">*</span></label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                required
              />
            </div>

            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Sales Rep Name<span className="text-red-500">*</span></label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={salesRepName}
                onChange={(e) => setSalesRepName(e.target.value)}
                placeholder="Sales Rep Name"
                required
              />
            </div>

            <div className="form-group">
              <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Select Product Type<span className="text-red-500">*</span></label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                required
              >
                <option value="">Select Product Type</option>
                <option value="Stand Up Pouches">Stand Up Pouches</option>
                <option value="Boxes">Boxes</option>
                <option value="Bottles">Bottles and Jars</option>
                <option value="Caps">Caps</option>
                <option value="Shrink Sleeves">Shrink Sleeves</option>
                <option value="Blisters">Blisters</option>
              </select>
            </div>
            <div className="product-form">{renderProductForm()}</div>
          </div>
          <div>
            <div className="product-form">
              <div className="form-group">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Number of SKU's:</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="number"
                  value={productFields.numberOfSKUs || ""}
                  onChange={(e) =>
                    updateProductFields("numberOfSKUs", e.target.value)
                  }
                  placeholder="Number of SKU's"
                />

                {renderSKUQuantityFields()}
              </div>

              <div className="form-group">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity 01:</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="number"
                  value={totalQty01 || ""}
                  readOnly
                  placeholder="Quantity 01"
                />
              </div>

              <div className="form-group">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity 02:</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="number"
                  value={totalQty02 || ""}
                  readOnly
                  placeholder="Quantity 02"
                />
              </div>

              <div className="form-group">
                <label className="block tracking-wide text-sm font-bold leading-6 text-gray-900">Quantity 03:</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="number"
                  value={totalQty03 || ""}
                  readOnly
                  placeholder="Quantity 03"
                />
              </div>
            </div>

            <button
              className="mt-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-black text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Quote"}
            </button>
          </div>
        </form>
        <ToastContainer position="top-center" autoClose={9000} />
      </div>
    </>
  );
};

export default StepOne;
