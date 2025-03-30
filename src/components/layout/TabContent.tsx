
import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Tab } from "@/contexts/tabs";
import { ROUTES } from "@/constants/routes";
import NotFound from "@/pages/NotFound";

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
      {/* Routes for all pages */}
      {Object.entries(ROUTES).map(([key, path]) => (
        <Route 
          key={path} 
          path={path} 
          element={<DynamicComponent componentPath={getComponentNameFromPath(path)} />} 
        />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Helper function to get component name from path
const getComponentNameFromPath = (path: string): string => {
  // Remove leading slash and capitalize each word
  const pathWithoutSlash = path.replace(/^\//, '');
  
  if (pathWithoutSlash === '') return 'Dashboard';
  
  // Handle special cases
  switch (pathWithoutSlash) {
    case 'home': return 'Dashboard';
    case 'dashboard': return 'FinanceDashboard';
    case 'general-ledger': return 'GeneralLedger';
    case 'accounts-receivable': return 'AccountsReceivable';
    case 'accounts-payable': return 'AccountsPayable';
    case 'profit-loss': return 'ProfitLoss';
    case 'pos-sales': return 'POSSales';
    case 'register': return 'POSRegister';
    case 'financial-years': return 'FinancialYearManagement';
    case 'purchase-requests': return 'PurchaseRequestManagement';
    case 'purchase-analytics': return 'PurchaseAnalytics';
    default:
      // Convert kebab-case to PascalCase
      return pathWithoutSlash
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
  }
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
        case "PurchaseRequestManagement":
          return lazy(() => import("../../../src/pages/PurchaseRequestManagement"));
        case "PurchaseAnalytics":
          return lazy(() => import("../../../src/pages/PurchaseAnalytics"));
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
