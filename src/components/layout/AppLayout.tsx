
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useScreenSize } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/sonner";
import { TabsProvider, useTabs } from "@/contexts/TabsContext";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent";

// Component for tab-based layout
const TabsLayout: React.FC = () => {
  const { tabs, activeTabId } = useTabs();
  const location = useLocation();
  
  return (
    <>
      <TabNavigation />
      {activeTabId ? (
        // When we have active tabs, render the TabContent component
        <TabContent 
          tabs={tabs} 
          activeTabId={activeTabId} 
          currentPath={location.pathname} 
        />
      ) : (
        // When no tabs are active, use the router's outlet directly
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      )}
    </>
  );
};

const AppLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { isMobile } = useScreenSize();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TabsProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <AppTopbar />
            <TabsLayout />
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </TabsProvider>
  );
};

export default AppLayout;
