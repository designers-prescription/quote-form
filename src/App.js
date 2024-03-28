import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Card } from '@nextui-org/react';
import Login from './Routes/Login';
import Signup from './Routes/Signup';
import CompleteProfile from './Routes/CompleteProfile';
import StepOne from './Routes/StepOne';
import StepTwo from './Routes/StepTwo';
import PrivateRoute from './PrivateRoute';
import Header from './components/Header';
import './App.css';

const App = () => {
  return (
    <Router>
      <Card css={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/step-one" element={<PrivateRoute><StepOne /></PrivateRoute>} />
          <Route path="/step-two" element={<PrivateRoute><StepTwo /></PrivateRoute>} />
          <Route path="/complete-profile" element={<PrivateRoute><CompleteProfile /></PrivateRoute>} />
        </Routes>
      </Card>
    </Router>
  );
};

export default App;
