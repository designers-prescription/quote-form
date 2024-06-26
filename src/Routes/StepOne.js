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
  const [productType, setProductType] = useState("");
  const [productFields, setProductFields] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [salesRepName, setSalesRepName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalQty01, setTotalQty01] = useState("");
  const [totalQty02, setTotalQty02] = useState("");
  const [totalQty03, setTotalQty03] = useState("");

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

  const updateSkuQuantity = (skuIndex, qty01) => {
    const updatedFields = {
      ...productFields,
      [`sku${skuIndex}Quantity01`]: qty01,
      [`sku${skuIndex}Quantity02`]: qty01 * 2,
      [`sku${skuIndex}Quantity03`]: qty01 * 3
    };
    setProductFields(updatedFields);
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

    if (!customerName || !salesRepName || !productType) {
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

    let artworkURL = null;
    if (productFields.artwork) {
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
      projectId: uniqueProjectId,
      product: {
        type: productType,
        fields: {
          ...productFields,
          artwork: artworkURL,
          quantity01: totalQty01,
          quantity02: totalQty02,
          quantity03: totalQty03,
        },
      },
    };

    try {
      await setDoc(doc(db, "QuoteRequirements", uniqueProjectId), quoteData);
      toast.success("Form submitted successfully!");
      await notifyMaria(uniqueProjectId); // Notify Maria
      setTimeout(() => {
        setCustomerName("");
        setSalesRepName("");
        setProductType("");
        setProductFields({});
        setProjectName("");
        setProjectId("");
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
      case "Labels":
        return (
          <Labels
            product={{ fields: productFields }}
            updateProduct={updateProductFields}
          />
        );
      case "Sachets":
        return (
          <Sachets
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
      case "Bags":
        return (
          <Bags
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
      case "Shrink Sleeves":
        return (
          <ShrinkSleeves
            product={{ fields: productFields }}
            updateProduct={updateProductFields}
          />
        );
      default:
        return null;
    }
  };

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
              updateSkuQuantity(i, e.target.value)
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
                className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={projectId}
                readOnly
                placeholder="Project ID"
              />
              <small className="text-gray-500 text-xs">Project ID is auto-generated and cannot be changed.</small>
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
                className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                value={salesRepName}
                placeholder="Sales Rep Name"
                readOnly
              />
              <small className="text-gray-500 text-xs">Sales Rep name cannot be changed.</small>
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
                <option value="Labels">Labels</option>
                <option value="Shrink Sleeves">Shrink Sleeves</option>
                <option value="Sachets">Sachets</option>
                <option value="Stand Up Pouches">Stand Up Pouches</option>
                <option value="Boxes">Boxes</option>
                <option value="Bottles">Bottles</option>
                <option value="Caps">Caps</option>
                <option value="Bags">Bags</option>
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
                <div className="grid mt-5 gap-2  grid-cols-3">
                  {renderSKUQuantityFields()}
                </div>
              </div>
              <div className="grid mt-5 gap-2  grid-cols-3">
                <div className="form-group ">
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
