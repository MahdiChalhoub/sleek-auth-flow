
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
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
            
            {/* Protected routes with role-based access */}
            <Route path="/*" element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }>
              <Route path="home" element={<HomePage />} />
              <Route path="inventory" element={
                <PrivateRoute 
                  requiredRole="manager"
                  requiredPermissions={["can_view_inventory"]}
                >
                  <InventoryPage />
                </PrivateRoute>
              } />
              <Route path="pos-sales" element={<POSSales />} />
              <Route path="settings" element={
                <PrivateRoute 
                  requiredRole="admin"
                  requiredPermissions={["can_manage_settings"]}
                >
                  <Settings />
                </PrivateRoute>
              } />
              <Route path="suppliers" element={
                <PrivateRoute 
                  requiredRole="manager"
                  requiredPermissions={["can_manage_suppliers"]}
                >
                  <Suppliers />
                </PrivateRoute>
              } />
              <Route path="purchase-orders" element={
                <PrivateRoute 
                  requiredRole="manager"
                  requiredPermissions={["can_manage_purchase_orders"]}
                >
                  <PurchaseOrders />
                </PrivateRoute>
              } />
              <Route path="stock-transfers" element={
                <PrivateRoute 
                  requiredRole="manager"
                  requiredPermissions={["can_manage_stock_transfers"]}
                >
                  <StockTransfers />
                </PrivateRoute>
              } />
              <Route path="transactions" element={
                <PrivateRoute requiredPermissions={["can_view_transactions"]}>
                  <Transactions />
                </PrivateRoute>
              } />
              <Route path="register" element={<RegisterPage />} />
              <Route path="register-sessions" element={<RegisterSessions />} />
              <Route path="transaction-permissions" element={
                <PrivateRoute 
                  requiredRole="admin"
                  requiredPermissions={["can_manage_permissions"]}
                >
                  <TransactionPermissions />
                </PrivateRoute>
              } />
              <Route path="staff-finance" element={
                <PrivateRoute 
                  requiredRole="admin"
                  requiredPermissions={["can_manage_staff_finance"]}
                >
                  <StaffFinance />
                </PrivateRoute>
              } />
              <Route path="loyalty" element={
                <PrivateRoute requiredPermissions={["can_manage_loyalty"]}>
                  <Loyalty />
                </PrivateRoute>
              } />
              <Route path="returns" element={
                <PrivateRoute requiredPermissions={["can_manage_returns"]}>
                  <Returns />
                </PrivateRoute>
              } />
              <Route path="roles" element={
                <PrivateRoute 
                  requiredRole="admin"
                  requiredPermissions={["can_manage_roles"]}
                >
                  <RoleManagement />
                </PrivateRoute>
              } />
              <Route path="categories" element={
                <PrivateRoute 
                  requiredRole="manager"
                  requiredPermissions={["can_manage_categories"]}
                >
                  <Categories />
                </PrivateRoute>
              } />
              <Route path="shift-reports" element={
                <PrivateRoute requiredPermissions={["can_view_shift_reports"]}>
                  <ShiftReports />
                </PrivateRoute>
              } />
              <Route path="audit-trail" element={
                <PrivateRoute 
                  requiredRole="admin"
                  requiredPermissions={["can_view_audit_trail"]}
                >
                  <AuditTrail />
                </PrivateRoute>
              } />
              <Route path="users" element={
                <PrivateRoute 
                  requiredRole="admin"
                  requiredPermissions={["can_manage_users"]}
                >
                  <Users />
                </PrivateRoute>
              } />
              <Route path="contacts" element={
                <PrivateRoute requiredPermissions={["can_manage_contacts"]}>
                  <Contacts />
                </PrivateRoute>
              } />
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
