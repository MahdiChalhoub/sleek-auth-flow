
import React, { Suspense, lazy, useEffect, useState } from "react";
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
  useEffect(() => {
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
        {/* We render the Outlet which will handle the routing for the active tab */}
        <Routes location={location}>
          <Route path="*" element={<Outlet />} />
        </Routes>
      </Suspense>
    </main>
  );
};

// This is a placeholder component that renders the appropriate route's component
const Outlet: React.FC = () => {
  const location = useLocation();
  
  return (
    <>
      {/* It may seem redundant, but by using this wrapper
          we ensure each tab has its own render context and state */}
      <Routes location={location}>
        <Route path="*" element={null} />
      </Routes>
    </>
  );
};

export default TabContent;
