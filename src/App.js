import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Routes/Login';
import Signup from './Routes/Signup';
import CompleteProfile from './Routes/CompleteProfile';
import StepThree from './Routes/StepThree';
import StepOne from './Routes/StepOne';
import StepTwo from './Routes/StepTwo';
import StepFour from './Routes/StepFour';
import QuoteDetails from './Routes/QuoteDetails';
import ShippingDetails from './Routes/ShippingDetails';
import PrivateRoute from './PrivateRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-request" element={<PrivateRoute><StepOne /></PrivateRoute>} />
        <Route path="/update-quote" element={<PrivateRoute><StepTwo /></PrivateRoute>} />
        <Route path="/shipping-requirements" element={<PrivateRoute><StepThree /></PrivateRoute>} />
        <Route path="/shipping-quote" element={<PrivateRoute><StepFour /></PrivateRoute>} />
        <Route path="/complete-profile" element={<PrivateRoute><CompleteProfile /></PrivateRoute>} />
        <Route path="/quote-details/:id" element={<PrivateRoute><QuoteDetails /></PrivateRoute>} />
        <Route path="/shipping-details/:id" element={<PrivateRoute><ShippingDetails /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
