import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Routes/Login';
import Signup from './Routes/Signup';
import CompleteProfile from './Routes/CompleteProfile';
import StepThree from './Routes/StepThree';
import StepOne from './Routes/StepOne';
// import Header from './components/Header';
import PrivateRoute from './PrivateRoute';
import './App.css'
import StepTwo from './Routes/StepTwo';
import StepFour from './Routes/StepFour';



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
      </Routes>


    </Router>
  );
};

export default App;
