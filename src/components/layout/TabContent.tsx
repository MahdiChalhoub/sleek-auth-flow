
import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Tab } from "@/contexts/TabsContext";

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
  
  // If the active tab doesn't match the current route, synchronize them
  React.useEffect(() => {
    if (activeTab && activeTab.path !== currentPath) {
      // Navigate to the correct path without adding to browser history
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
        {/* We render Routes here to match the current location */}
        <Routes>
          {/* This catch-all route will render the app's main routes */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Suspense>
    </main>
  );
};

// This component renders the app's routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/home" element={<DynamicComponent componentPath="Dashboard" />} />
      <Route path="/inventory" element={<DynamicComponent componentPath="Inventory" />} />
      <Route path="/pos-sales" element={<DynamicComponent componentPath="POSSales" />} />
      <Route path="/settings" element={<DynamicComponent componentPath="Settings" />} />
      <Route path="/suppliers" element={<DynamicComponent componentPath="Suppliers" />} />
      <Route path="/purchase-orders" element={<DynamicComponent componentPath="PurchaseOrders" />} />
      <Route path="/stock-transfers" element={<DynamicComponent componentPath="StockTransfers" />} />
      <Route path="/transactions" element={<DynamicComponent componentPath="Transactions" />} />
      <Route path="/register" element={<DynamicComponent componentPath="POSRegister" />} />
      <Route path="/register-sessions" element={<DynamicComponent componentPath="RegisterSessions" />} />
      <Route path="/transaction-permissions" element={<DynamicComponent componentPath="TransactionPermissions" />} />
      <Route path="/staff-finance" element={<DynamicComponent componentPath="StaffFinance" />} />
      <Route path="/loyalty" element={<DynamicComponent componentPath="Loyalty" />} />
      <Route path="/returns" element={<DynamicComponent componentPath="Returns" />} />
      <Route path="/roles" element={<DynamicComponent componentPath="RoleManagement" />} />
      <Route path="/categories" element={<DynamicComponent componentPath="Categories" />} />
      <Route path="/shift-reports" element={<DynamicComponent componentPath="ShiftReports" />} />
      <Route path="/audit-trail" element={<DynamicComponent componentPath="AuditTrail" />} />
      <Route path="/users" element={<DynamicComponent componentPath="Users" />} />
      <Route path="/contacts" element={<DynamicComponent componentPath="Contacts" />} />
      <Route path="/notifications" element={<DynamicComponent componentPath="Notifications" />} />
      {/* Fallback route */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};

// This is a dynamic component loader that will load the component based on the path
const DynamicComponent = ({ componentPath }: { componentPath: string }) => {
  // Using React.lazy for code splitting
  const Component = React.useMemo(() => {
    try {
      // Fix the dynamic import path by using a direct import pattern
      return lazy(() => {
        // Handle each component path explicitly to ensure correct imports
        switch (componentPath) {
          case "Dashboard":
            return import("@/pages/Dashboard");
          case "Inventory":
            return import("@/pages/Inventory");
          case "POSSales":
            return import("@/pages/POSSales");
          case "Settings":
            return import("@/pages/Settings");
          case "Suppliers":
            return import("@/pages/Suppliers");
          case "PurchaseOrders":
            return import("@/pages/PurchaseOrders");
          case "StockTransfers":
            return import("@/pages/StockTransfers");
          case "Transactions":
            return import("@/pages/Transactions");
          case "POSRegister":
            return import("@/pages/POSRegister");
          case "RegisterSessions":
            return import("@/pages/RegisterSessions");
          case "TransactionPermissions":
            return import("@/pages/TransactionPermissions");
          case "StaffFinance":
            return import("@/pages/StaffFinance");
          case "Loyalty":
            return import("@/pages/Loyalty");
          case "Returns":
            return import("@/pages/Returns");
          case "RoleManagement":
            return import("@/pages/RoleManagement");
          case "Categories":
            return import("@/pages/Categories");
          case "ShiftReports":
            return import("@/pages/ShiftReports");
          case "AuditTrail":
            return import("@/pages/AuditTrail");
          case "Users":
            return import("@/pages/Users");
          case "Contacts":
            return import("@/pages/Contacts");
          case "Notifications":
            return import("@/pages/Notifications");
          default:
            return import("@/pages/NotFound");
        }
      });
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
