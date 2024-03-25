import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import CompleteProfile from './CompleteProfile';
import StepOne from './StepOne';
import Header from './Header';
import PrivateRoute from './PrivateRoute';
import './App.css'

const App = () => {
  return (
<Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/step-one" element={<PrivateRoute><StepOne /></PrivateRoute>} />
        <Route path="/complete-profile" element={<PrivateRoute><CompleteProfile /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
