
import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Tab } from "@/contexts/tabs";

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
      <Route path="/home" element={<DynamicComponent componentPath="Dashboard" />} />
      <Route path="/dashboard" element={<DynamicComponent componentPath="FinanceDashboard" />} />
      <Route path="/inventory" element={<DynamicComponent componentPath="Inventory" />} />
      <Route path="/pos-sales" element={<DynamicComponent componentPath="POSSales" />} />
      <Route path="/settings" element={<DynamicComponent componentPath="Settings" />} />
      <Route path="/suppliers" element={<DynamicComponent componentPath="Suppliers" />} />
      <Route path="/purchase-orders" element={<DynamicComponent componentPath="PurchaseOrders" />} />
      <Route path="/stock-transfers" element={<DynamicComponent componentPath="StockTransfers" />} />
      <Route path="/stock-adjustments" element={<DynamicComponent componentPath="StockAdjustments" />} />
      <Route path="/transactions" element={<DynamicComponent componentPath="Transactions" />} />
      <Route path="/register" element={<DynamicComponent componentPath="POSRegister" />} />
      <Route path="/register-sessions" element={<DynamicComponent componentPath="RegisterSessions" />} />
      <Route path="/transaction-permissions" element={<DynamicComponent componentPath="TransactionPermissions" />} />
      <Route path="/expenses" element={<DynamicComponent componentPath="Expenses" />} />
      <Route path="/recurring-expenses" element={<DynamicComponent componentPath="RecurringExpenses" />} />
      <Route path="/staff-finance" element={<DynamicComponent componentPath="StaffFinance" />} />
      <Route path="/loyalty" element={<DynamicComponent componentPath="Loyalty" />} />
      <Route path="/returns" element={<DynamicComponent componentPath="Returns" />} />
      <Route path="/roles" element={<DynamicComponent componentPath="RoleManagement" />} />
      <Route path="/categories" element={<DynamicComponent componentPath="Categories" />} />
      <Route path="/units" element={<DynamicComponent componentPath="Units" />} />
      <Route path="/shift-reports" element={<DynamicComponent componentPath="ShiftReports" />} />
      <Route path="/audit-trail" element={<DynamicComponent componentPath="AuditTrail" />} />
      <Route path="/user-activity" element={<DynamicComponent componentPath="UserActivity" />} />
      <Route path="/users" element={<DynamicComponent componentPath="Users" />} />
      <Route path="/contacts" element={<DynamicComponent componentPath="Contacts" />} />
      <Route path="/notifications" element={<DynamicComponent componentPath="Notifications" />} />
      <Route path="/ledger" element={<DynamicComponent componentPath="GeneralLedger" />} />
      <Route path="/general-ledger" element={<DynamicComponent componentPath="GeneralLedger" />} />
      <Route path="/accounts-receivable" element={<DynamicComponent componentPath="AccountsReceivable" />} />
      <Route path="/accounts-payable" element={<DynamicComponent componentPath="AccountsPayable" />} />
      <Route path="/profit-loss" element={<DynamicComponent componentPath="ProfitLoss" />} />
      <Route path="/backup-restore" element={<DynamicComponent componentPath="BackupRestore" />} />
      <Route path="/exports" element={<DynamicComponent componentPath="Exports" />} />
      <Route path="/packaging-management" element={<DynamicComponent componentPath="PackagingManagement" />} />
      <Route path="/barcode-printing" element={<DynamicComponent componentPath="BarcodePrinting" />} />
      <Route path="/expiration-management" element={<DynamicComponent componentPath="ExpirationManagement" />} />
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
