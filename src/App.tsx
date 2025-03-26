
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/Login';
import HomePage from './pages/Dashboard'; // Using Dashboard as Home
import InventoryPage from './pages/Inventory';
import POSSales from './pages/POSSales';
import Settings from './pages/Settings';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import StockTransfers from './pages/StockTransfers';
import Transactions from './pages/Transactions';
import RegisterPage from './pages/POSRegister';
import RegisterSessions from './pages/RegisterSessions';
import Signup from './pages/Signup';
import TransactionPermissions from './pages/TransactionPermissions';
import StaffFinance from './pages/StaffFinance';
import Loyalty from './pages/Loyalty';
import Returns from './pages/Returns';
import RoleManagement from './pages/RoleManagement';
import Categories from './pages/Categories';
import ShiftReports from './pages/ShiftReports';
import AuditTrail from './pages/AuditTrail';
import Users from './pages/Users';
import Contacts from './pages/Contacts';
import NotificationsPage from './pages/Notifications';
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './components/auth/PrivateRoute';
import { ROUTES } from './constants/routes';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }>
              <Route path="home" element={<HomePage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="pos-sales" element={<POSSales />} />
              <Route path="settings" element={<Settings />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="purchase-orders" element={<PurchaseOrders />} />
              <Route path="stock-transfers" element={<StockTransfers />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="register-sessions" element={<RegisterSessions />} />
              <Route path="transaction-permissions" element={<TransactionPermissions />} />
              <Route path="staff-finance" element={<StaffFinance />} />
              <Route path="loyalty" element={<Loyalty />} />
              <Route path="returns" element={<Returns />} />
              <Route path="roles" element={<RoleManagement />} />
              <Route path="categories" element={<Categories />} />
              <Route path="shift-reports" element={<ShiftReports />} />
              <Route path="audit-trail" element={<AuditTrail />} />
              <Route path="users" element={<Users />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
          </Routes>
          
          <Toaster />
          <SonnerToaster position="top-right" />
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
