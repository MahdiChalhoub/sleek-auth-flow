
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import { Toaster } from '@/components/ui/toaster';
import { ToastContainer } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import InventoryPage from './pages/Inventory';
import POSSales from './pages/POSSales';
import Settings from './pages/Settings';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import StockTransfers from './pages/StockTransfers';
import Transactions from './pages/Transactions';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/pos-sales" element={<POSSales />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/stock-transfers" element={<StockTransfers />} />
              <Route path="/transactions" element={<Transactions />} />
            </Route>
          </Routes>
          
          <Toaster />
          <ToastContainer position="top-right" />
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
