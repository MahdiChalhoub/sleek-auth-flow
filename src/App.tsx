
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import PurchaseOrders from './pages/PurchaseOrders';
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

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <QueryProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<AppLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="purchase-orders" element={<PurchaseOrders />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="stock-transfers" element={<StockTransfers />} />
                <Route path="sales" element={<POSSales />} />
                <Route path="register" element={<POSRegister />} />
                <Route path="categories" element={<Categories />} />
                <Route path="stock-adjustments" element={<StockAdjustments />} />
                <Route path="units" element={<Units />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="returns" element={<Returns />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="transactions-page" element={<TransactionsPage />} />
                <Route path="audit-trail" element={<AuditTrail />} />
                <Route path="user-activity" element={<UserActivity />} />
                <Route path="role-management" element={<RoleManagement />} />
                <Route path="users" element={<Users />} />
                <Route path="register-sessions" element={<RegisterSessions />} />
                <Route path="loyalty" element={<Loyalty />} />
                <Route path="staff-finance" element={<StaffFinance />} />
                <Route path="shift-reports" element={<ShiftReports />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="backup-restore" element={<BackupRestore />} />
                <Route path="exports" element={<Exports />} />
                <Route path="finance-dashboard" element={<FinanceDashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="general-ledger" element={<GeneralLedger />} />
                <Route path="ledger" element={<GeneralLedger />} />
                <Route path="journal-entries" element={<JournalEntries />} />
                <Route path="accounts-receivable" element={<AccountsReceivable />} />
                <Route path="accounts-payable" element={<AccountsPayable />} />
                <Route path="profit-loss" element={<ProfitLoss />} />
                <Route path="packaging-management" element={<PackagingManagement />} />
                <Route path="barcode-printing" element={<BarcodePrinting />} />
                <Route path="expiration-management" element={<ExpirationManagement />} />
                <Route path="pos-sales" element={<POSSales />} />
                <Route path="transaction-permissions" element={<TransactionPermissions />} />
                <Route path="recurring-expenses" element={<RecurringExpenses />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
