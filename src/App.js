import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Routes/Login';
import Signup from './Routes/Signup';
import CompleteProfile from './Routes/CompleteProfile';
import StepOne from './Routes/StepOne';
// import Header from './components/Header';
import PrivateRoute from './PrivateRoute';
import './App.css'
import StepTwo from './Routes/StepTwo';



const App = () => {
  return (
<Router>
  
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/step-one" element={<PrivateRoute><StepOne /></PrivateRoute>} />
        <Route path="/step-two" element={<PrivateRoute><StepTwo /></PrivateRoute>} />
        <Route path="/complete-profile" element={<PrivateRoute><CompleteProfile /></PrivateRoute>} />
      </Routes>


    </Router>
  );
};

export default App;
