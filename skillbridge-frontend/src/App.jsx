import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Homepage from './components/Homepage';
import ClientDashboard from './components/ClientDashboard';
import FreelancerDashboard from './components/FreelancerDashboard';
import AllocateFunds from './components/AllocateFunds';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/allocate-funds" element={<AllocateFunds />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
