
import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Tab } from "@/contexts/tabs";
import { ROUTES } from "@/constants/routes";

interface TabContentProps {
  tabs: Tab[];
  activeTabId: string;
  currentPath: string;
}

const TabContent: React.FC<TabContentProps> = ({ 
  tabs, 
  activeTabId,
  currentPath 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  React.useEffect(() => {
    if (activeTab && activeTab.path !== currentPath) {
      navigate(activeTab.path, { replace: true });
    }
  }, [activeTab, currentPath, navigate]);

  if (!activeTab) {
    return (
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex items-center justify-center h-full">
          <p>No active tab</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <Suspense fallback={<div className="animate-pulse">Loading tab content...</div>}>
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Suspense>
    </main>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<DynamicComponent componentPath="Dashboard" />} />
      <Route path={ROUTES.DASHBOARD} element={<DynamicComponent componentPath="FinanceDashboard" />} />
      <Route path={ROUTES.INVENTORY} element={<DynamicComponent componentPath="Inventory" />} />
      <Route path={ROUTES.POS_SALES} element={<DynamicComponent componentPath="POSSales" />} />
      <Route path={ROUTES.SETTINGS} element={<DynamicComponent componentPath="Settings" />} />
      <Route path={ROUTES.SUPPLIERS} element={<DynamicComponent componentPath="Suppliers" />} />
      <Route path={ROUTES.PURCHASE_ORDERS} element={<DynamicComponent componentPath="PurchaseOrders" />} />
      <Route path={ROUTES.STOCK_TRANSFERS} element={<DynamicComponent componentPath="StockTransfers" />} />
      <Route path={ROUTES.STOCK_ADJUSTMENTS} element={<DynamicComponent componentPath="StockAdjustments" />} />
      <Route path={ROUTES.TRANSACTIONS} element={<DynamicComponent componentPath="Transactions" />} />
      <Route path={ROUTES.REGISTER} element={<DynamicComponent componentPath="POSRegister" />} />
      <Route path={ROUTES.REGISTER_SESSIONS} element={<DynamicComponent componentPath="RegisterSessions" />} />
      <Route path={ROUTES.TRANSACTION_PERMISSIONS} element={<DynamicComponent componentPath="TransactionPermissions" />} />
      <Route path={ROUTES.EXPENSES} element={<DynamicComponent componentPath="Expenses" />} />
      <Route path={ROUTES.RECURRING_EXPENSES} element={<DynamicComponent componentPath="RecurringExpenses" />} />
      <Route path={ROUTES.STAFF_FINANCE} element={<DynamicComponent componentPath="StaffFinance" />} />
      <Route path={ROUTES.LOYALTY} element={<DynamicComponent componentPath="Loyalty" />} />
      <Route path={ROUTES.RETURNS} element={<DynamicComponent componentPath="Returns" />} />
      <Route path={ROUTES.ROLES} element={<DynamicComponent componentPath="RoleManagement" />} />
      <Route path={ROUTES.CATEGORIES} element={<DynamicComponent componentPath="Categories" />} />
      <Route path={ROUTES.UNITS} element={<DynamicComponent componentPath="Units" />} />
      <Route path={ROUTES.SHIFT_REPORTS} element={<DynamicComponent componentPath="ShiftReports" />} />
      <Route path={ROUTES.AUDIT_TRAIL} element={<DynamicComponent componentPath="AuditTrail" />} />
      <Route path={ROUTES.USER_ACTIVITY} element={<DynamicComponent componentPath="UserActivity" />} />
      <Route path={ROUTES.USERS} element={<DynamicComponent componentPath="Users" />} />
      <Route path={ROUTES.CONTACTS} element={<DynamicComponent componentPath="Contacts" />} />
      <Route path={ROUTES.NOTIFICATIONS} element={<DynamicComponent componentPath="Notifications" />} />
      <Route path={ROUTES.LEDGER} element={<DynamicComponent componentPath="GeneralLedger" />} />
      <Route path={ROUTES.GENERAL_LEDGER} element={<DynamicComponent componentPath="GeneralLedger" />} />
      <Route path={ROUTES.ACCOUNTS_RECEIVABLE} element={<DynamicComponent componentPath="AccountsReceivable" />} />
      <Route path={ROUTES.ACCOUNTS_PAYABLE} element={<DynamicComponent componentPath="AccountsPayable" />} />
      <Route path={ROUTES.PROFIT_LOSS} element={<DynamicComponent componentPath="ProfitLoss" />} />
      <Route path={ROUTES.BACKUP_RESTORE} element={<DynamicComponent componentPath="BackupRestore" />} />
      <Route path={ROUTES.EXPORTS} element={<DynamicComponent componentPath="Exports" />} />
      <Route path={ROUTES.PACKAGING_MANAGEMENT} element={<DynamicComponent componentPath="PackagingManagement" />} />
      <Route path={ROUTES.BARCODE_PRINTING} element={<DynamicComponent componentPath="BarcodePrinting" />} />
      <Route path={ROUTES.EXPIRATION_MANAGEMENT} element={<DynamicComponent componentPath="ExpirationManagement" />} />
      <Route path={ROUTES.FINANCIAL_YEARS} element={<DynamicComponent componentPath="FinancialYearManagement" />} />
      <Route path="/clients" element={<DynamicComponent componentPath="ClientsList" />} />
      <Route path="/clients/:clientId" element={<DynamicComponent componentPath="ClientProfile" />} />
      <Route path="/clients/:clientId/edit" element={<DynamicComponent componentPath="ClientEditForm" />} />
      <Route path="/clients/new" element={<DynamicComponent componentPath="ClientEditForm" />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};

const DynamicComponent = ({ componentPath }: { componentPath: string }) => {
  const Component = React.useMemo(() => {
    try {
      switch (componentPath) {
        case "Dashboard":
          return lazy(() => import("../../../src/pages/Dashboard"));
        case "FinanceDashboard":
          return lazy(() => import("../../../src/pages/FinanceDashboard"));
        case "Inventory":
          return lazy(() => import("../../../src/pages/Inventory"));
        case "POSSales":
          return lazy(() => import("../../../src/pages/POSSales"));
        case "Settings":
          return lazy(() => import("../../../src/pages/Settings"));
        case "Suppliers":
          return lazy(() => import("../../../src/pages/Suppliers"));
        case "PurchaseOrders":
          return lazy(() => import("../../../src/pages/PurchaseOrders"));
        case "StockTransfers":
          return lazy(() => import("../../../src/pages/StockTransfers"));
        case "StockAdjustments":
          return lazy(() => import("../../../src/pages/StockAdjustments"));
        case "Transactions":
          return lazy(() => import("../../../src/pages/Transactions"));
        case "POSRegister":
          return lazy(() => import("../../../src/pages/POSRegister"));
        case "RegisterSessions":
          return lazy(() => import("../../../src/pages/RegisterSessions"));
        case "TransactionPermissions":
          return lazy(() => import("../../../src/pages/TransactionPermissions"));
        case "Expenses":
          return lazy(() => import("../../../src/pages/Expenses"));
        case "StaffFinance":
          return lazy(() => import("../../../src/pages/StaffFinance"));
        case "Loyalty":
          return lazy(() => import("../../../src/pages/Loyalty"));
        case "Returns":
          return lazy(() => import("../../../src/pages/Returns"));
        case "RoleManagement":
          return lazy(() => import("../../../src/pages/RoleManagement"));
        case "Categories":
          return lazy(() => import("../../../src/pages/Categories"));
        case "Units":
          return lazy(() => import("../../../src/pages/Units"));
        case "ShiftReports":
          return lazy(() => import("../../../src/pages/ShiftReports"));
        case "AuditTrail":
          return lazy(() => import("../../../src/pages/AuditTrail"));
        case "UserActivity":
          return lazy(() => import("../../../src/pages/UserActivity"));
        case "Users":
          return lazy(() => import("../../../src/pages/Users"));
        case "Contacts":
          return lazy(() => import("../../../src/pages/Contacts"));
        case "Notifications":
          return lazy(() => import("../../../src/pages/Notifications"));
        case "GeneralLedger":
          return lazy(() => import("../../../src/pages/accounting/GeneralLedger"));
        case "AccountsReceivable":
          return lazy(() => import("../../../src/pages/accounting/AccountsReceivable"));
        case "AccountsPayable":
          return lazy(() => import("../../../src/pages/accounting/AccountsPayable"));
        case "ProfitLoss":
          return lazy(() => import("../../../src/pages/accounting/ProfitLoss"));
        case "BackupRestore":
          return lazy(() => import("../../../src/pages/BackupRestore"));
        case "Exports":
          return lazy(() => import("../../../src/pages/Exports"));
        case "PackagingManagement":
          return lazy(() => import("../../../src/pages/PackagingManagement"));
        case "BarcodePrinting":
          return lazy(() => import("../../../src/pages/BarcodePrinting"));
        case "ExpirationManagement":
          return lazy(() => import("../../../src/pages/ExpirationManagement"));
        case "RecurringExpenses":
          return lazy(() => import("../../../src/pages/RecurringExpenses"));
        case "FinancialYearManagement":
          return lazy(() => import("../../../src/pages/FinancialYearManagement"));
        case "ClientsList":
          return lazy(() => import("../../../src/pages/ClientsList"));
        case "ClientProfile":
          return lazy(() => import("../../../src/pages/ClientProfile"));
        case "ClientEditForm":
          return lazy(() => import("../../../src/pages/ClientEditForm"));
        default:
          return lazy(() => import("../../../src/pages/NotFound"));
      }
    } catch (error) {
      console.error(`Failed to load component: ${componentPath}`, error);
      return () => <div>Error loading component: {String(error)}</div>;
    }
  }, [componentPath]);

  return (
    <Suspense fallback={<div className="animate-pulse">Loading component...</div>}>
      <Component />
    </Suspense>
  );
};

export default TabContent;
