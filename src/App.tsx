
import React from 'react';
import './App.css';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { toast } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import MobileLayout from './components/layout/MobileLayout';
import { ROUTES } from './constants/routes';
import { QueryProvider } from './providers/QueryProvider';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from './providers/AuthProvider';
import { LocationProvider } from './contexts/LocationContext';
import { useIsMobile } from './hooks/use-mobile';

// Import page components
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import PurchaseOrders from './pages/PurchaseOrders';
import PurchaseRequestManagement from './pages/PurchaseRequestManagement';
import PurchaseAnalytics from './pages/PurchaseAnalytics';
import Suppliers from './pages/Suppliers';
import StockTransfers from './pages/StockTransfers';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import POSSales from './pages/POSSales';
import POSRegister from './pages/POSRegister';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import Categories from './pages/Categories';
import StockAdjustments from './pages/StockAdjustments';
import Units from './pages/Units';
import Contacts from './pages/Contacts';
import ClientsList from './pages/ClientsList';
import ClientProfile from './pages/ClientProfile'; 
import ClientEditForm from './pages/ClientEditForm';
import Expenses from './pages/Expenses';
import Returns from './pages/Returns';
import Transactions from './pages/Transactions';
import TransactionsPage from './pages/TransactionsPage';
import AuditTrail from './pages/AuditTrail';
import UserActivity from './pages/UserActivity';
import Roles from './pages/Roles';
import RoleManagement from './pages/RoleManagement';
import FinancialYearManagement from './pages/FinancialYearManagement';
import BusinessSelection from './pages/BusinessSelection';
import WaitingApproval from './pages/WaitingApproval';
import SetupWizard from './pages/SetupWizard';
import ShiftReports from './pages/ShiftReports';
import BackupRestore from './pages/BackupRestore';
import Exports from './pages/Exports';
import BarcodePrinting from './pages/BarcodePrinting';
import ExpirationManagement from './pages/ExpirationManagement';

// Layout Resolver component to decide which layout to use based on device
const LayoutResolver: React.FC = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <AppLayout />;
};

function App() {
  console.log('🖥️ App component rendering');

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <QueryProvider>
          <LocationProvider>
            <Routes>
              <Route path={ROUTES.SETUP} element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path="/index" element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path={ROUTES.SIGNUP} element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path="/reset-password" element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path={ROUTES.BUSINESS_SELECTION} element={<Navigate to={ROUTES.HOME} replace />} />
              <Route path="/waiting-approval" element={<Navigate to={ROUTES.HOME} replace />} />
              
              <Route element={<LayoutResolver />}>
                <Route path={ROUTES.HOME} element={<Dashboard />} />
                <Route path={ROUTES.INVENTORY} element={<Inventory />} />
                <Route path={ROUTES.PURCHASE_ORDERS} element={<PurchaseOrders />} />
                <Route path={ROUTES.PURCHASE_REQUESTS} element={<PurchaseRequestManagement />} />
                <Route path={ROUTES.PURCHASE_ANALYTICS} element={<PurchaseAnalytics />} />
                <Route path={ROUTES.SUPPLIERS} element={<Suppliers />} />
                <Route path={ROUTES.STOCK_TRANSFERS} element={<StockTransfers />} />
                <Route path={ROUTES.POS_SALES} element={<POSSales />} />
                <Route path={ROUTES.REGISTER} element={<POSRegister />} />
                <Route path={ROUTES.CATEGORIES} element={<Categories />} />
                <Route path={ROUTES.STOCK_ADJUSTMENTS} element={<StockAdjustments />} />
                <Route path={ROUTES.UNITS} element={<Units />} />
                <Route path={ROUTES.CONTACTS} element={<Contacts />} />
                <Route path={ROUTES.CLIENTS} element={<ClientsList />} />
                <Route path="/clients/:clientId" element={<ClientProfile />} />
                <Route path="/clients/:clientId/edit" element={<ClientEditForm />} />
                <Route path="/clients/new" element={<ClientEditForm />} />
                <Route path="/financial-years" element={<FinancialYearManagement />} />
                <Route path={ROUTES.EXPENSES} element={<Expenses />} />
                <Route path={ROUTES.RETURNS} element={<Returns />} />
                <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
                <Route path="/transactions-page" element={<TransactionsPage />} />
                <Route path={ROUTES.AUDIT_TRAIL} element={<AuditTrail />} />
                <Route path={ROUTES.USER_ACTIVITY} element={<UserActivity />} />
                <Route path={ROUTES.ROLES} element={<Roles />} />
                <Route path={ROUTES.SHIFT_REPORTS} element={<ShiftReports />} />
                <Route path={ROUTES.BACKUP_RESTORE} element={<BackupRestore />} />
                <Route path={ROUTES.EXPORTS} element={<Exports />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                <Route path={ROUTES.BARCODE_PRINTING} element={<BarcodePrinting />} />
                <Route path={ROUTES.EXPIRATION_MANAGEMENT} element={<ExpirationManagement />} />
                
                <Route path="*" element={<NotFound />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LocationProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
