import React, { useState } from 'react';
import { auth, db, storage } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import StandUpPouches from '../components/StandUpPouches';
import Boxes from '../components/Boxes';
import Bottles from '../components/Bottles';
import Caps from '../components/Caps';
import Blisters from '../components/Blisters';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Grid, Input, Select, Radio, Button, Spinner } from '@nextui-org/react';

const StepOne = () => {
  const [user] = useAuthState(auth);
  const [productType, setProductType] = useState('');
  const [productFields, setProductFields] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [salesRepName, setSalesRepName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateProductFields = (field, value) => {
    setProductFields({ ...productFields, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const quoteId = uuidv4();
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
      product: {
        type: productType,
        fields: {
          ...productFields,
          artwork: artworkURL,
        },
      },
    };

    try {
      await setDoc(doc(db, 'QuoteRequirements', quoteId), quoteData);
      toast.success('Order Created Sucessfully!');
      setTimeout(() => {
        setCustomerName('');
        setSalesRepName('');
        setProductType('');
        setProductFields({});
        setIsLoading(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to create the order.');
      setIsLoading(false);
    }
  };

  const renderProductForm = () => {
    switch (productType) {
      case 'Stand Up Pouches':
        return <StandUpPouches product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'Boxes':
        return <Boxes product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'Bottles':
        return <Bottles product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'Caps':
        return <Caps product={{ fields: productFields }} updateProduct={updateProductFields} />;
      case 'Shrink Sleeves':
        return <div>Shrink Sleeves selected. No additional fields required.</div>;
      case 'Blisters':
        return <Blisters product={{ fields: productFields }} updateProduct={updateProductFields} />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <h2 style={{ textAlign: 'center' }}>Step One: Quote Requirements</h2>
      <form onSubmit={handleSubmit}>
        <Grid.Container gap={2}>
          <Grid>
            <Input
              fullWidth
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Grid>
          <Grid>
            <Input
              fullWidth
              label="Sales Rep Name"
              value={salesRepName}
              onChange={(e) => setSalesRepName(e.target.value)}
            />
          </Grid>
          <Grid>
            <Select
              fullWidth
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <Select.Option value="">Select Product Type</Select.Option>
              <Select.Option value="Stand Up Pouches">Stand Up Pouches</Select.Option>
              <Select.Option value="Boxes">Boxes</Select.Option>
              <Select.Option value="Bottles">Bottles</Select.Option>
              <Select.Option value="Caps">Caps</Select.Option>
              <Select.Option value="Shrink Sleeves">Shrink Sleeves</Select.Option>
              <Select.Option value="Blisters">Blisters</Select.Option>
            </Select>
          </Grid>
          <Grid>
            {renderProductForm()}
          </Grid>
          <Grid>
            <Radio.Group
              label="Is the order over 10K USD before shipping:"
              value={productFields.OrderOver10K}
              onChange={(value) => updateProductFields('OrderOver10K', value)}
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Grid>
          <Grid>
            <Input
              label="Material"
              fullWidth
              value={productFields.material || ''}
              onChange={(e) => updateProductFields('material', e.target.value)}
            />
          </Grid>
          {/* Add more input fields as needed */}
          <Grid>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : 'Submit Quote'}
            </Button>
          </Grid>
        </Grid.Container>
      </form>
      <ToastContainer position="top-center" autoClose={5000} />
    </Container>
  );
};

export default StepOne;
