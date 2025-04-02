import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import AppLayout from './components/layout/AppLayout';
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
import Expenses from './pages/Expenses';
import Returns from './pages/Returns';
import Transactions from './pages/Transactions';
import TransactionsPage from './pages/TransactionsPage';
import AuditTrail from './pages/AuditTrail';
import UserActivity from './pages/UserActivity';
import RoleManagement from './pages/RoleManagement';
import Users from './pages/Users';
import RegisterSessions from './pages/RegisterSessions';
import Loyalty from './pages/Loyalty';
import StaffFinance from './pages/StaffFinance';
import ShiftReports from './pages/ShiftReports';
import Notifications from './pages/Notifications';
import BackupRestore from './pages/BackupRestore';
import Exports from './pages/Exports';
import FinanceDashboard from './pages/FinanceDashboard';
import GeneralLedger from './pages/accounting/GeneralLedger';
import JournalEntries from './pages/accounting/JournalEntries';
import AccountsReceivable from './pages/accounting/AccountsReceivable';
import AccountsPayable from './pages/accounting/AccountsPayable';
import ProfitLoss from './pages/accounting/ProfitLoss';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import PackagingManagement from './pages/PackagingManagement';
import BarcodePrinting from './pages/BarcodePrinting';
import ExpirationManagement from './pages/ExpirationManagement';
import RecurringExpenses from './pages/RecurringExpenses';
import TransactionPermissions from './pages/TransactionPermissions';
import { ROUTES } from './constants/routes';
import PrivateRoute from './components/auth/PrivateRoute';
import ClientEditForm from './pages/ClientEditForm';
import FinancialYearManagement from './pages/FinancialYearManagement';
import BusinessSelection from './pages/BusinessSelection';
import WaitingApproval from './pages/WaitingApproval';
import { LocationProvider } from './contexts/LocationContext'; // Import LocationProvider
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <QueryProvider>
          <AuthProvider>
            <LocationProvider> {/* Add LocationProvider here */}
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/index" element={<Navigate to="/" replace />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGNUP} element={<Signup />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ForgotPassword />} />
                <Route path="/business-selection" element={<BusinessSelection />} />
                <Route path="/waiting-approval" element={<WaitingApproval />} />
                
                {/* Main layout with protected routes */}
                <Route path="/" element={
                  <PrivateRoute>
                    <AppLayout />
                  </PrivateRoute>
                }>
                  <Route path={ROUTES.HOME} element={<Dashboard />} />
                  <Route path={ROUTES.DASHBOARD} element={<FinanceDashboard />} />
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
                  <Route path="/clients" element={<ClientsList />} />
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
                  <Route path={ROUTES.ROLES} element={<RoleManagement />} />
                  <Route path="/role-management" element={<RoleManagement />} />
                  <Route path={ROUTES.USERS} element={<Users />} />
                  <Route path={ROUTES.REGISTER_SESSIONS} element={<RegisterSessions />} />
                  <Route path={ROUTES.LOYALTY} element={<Loyalty />} />
                  <Route path={ROUTES.STAFF_FINANCE} element={<StaffFinance />} />
                  <Route path={ROUTES.SHIFT_REPORTS} element={<ShiftReports />} />
                  <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
                  <Route path={ROUTES.BACKUP_RESTORE} element={<BackupRestore />} />
                  <Route path={ROUTES.EXPORTS} element={<Exports />} />
                  <Route path={ROUTES.SETTINGS} element={<Settings />} />
                  <Route path={ROUTES.GENERAL_LEDGER} element={<GeneralLedger />} />
                  <Route path={ROUTES.LEDGER} element={<GeneralLedger />} />
                  <Route path="/journal-entries" element={<JournalEntries />} />
                  <Route path={ROUTES.ACCOUNTS_RECEIVABLE} element={<AccountsReceivable />} />
                  <Route path={ROUTES.ACCOUNTS_PAYABLE} element={<AccountsPayable />} />
                  <Route path={ROUTES.PROFIT_LOSS} element={<ProfitLoss />} />
                  <Route path={ROUTES.PACKAGING_MANAGEMENT} element={<PackagingManagement />} />
                  <Route path={ROUTES.BARCODE_PRINTING} element={<BarcodePrinting />} />
                  <Route path={ROUTES.EXPIRATION_MANAGEMENT} element={<ExpirationManagement />} />
                  <Route path={ROUTES.TRANSACTION_PERMISSIONS} element={<TransactionPermissions />} />
                  <Route path={ROUTES.RECURRING_EXPENSES} element={<RecurringExpenses />} />
                </Route>
                
                {/* Catch all for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LocationProvider> {/* Close LocationProvider */}
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
