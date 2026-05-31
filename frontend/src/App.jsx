import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import Codes from './pages/Codes';
import Alerts from './pages/Alerts';
import Verify from './pages/Verify';
import Landing from './pages/Landing';
import DashboardLayout from './components/DashboardLayout';
import Navbar from './components/Navbar';
import './App.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e293b', color: '#fff' }
        }} />
        <div className="flex-1">
          <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/codes" element={<ProtectedRoute><Codes /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        
        <Route path="/" element={<Landing />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
