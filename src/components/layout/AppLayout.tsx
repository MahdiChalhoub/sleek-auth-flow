
import React, { Suspense } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useScreenSize } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/sonner";
import { TabsProvider, useTabs } from "@/contexts/tabs";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent";
import { Loader2 } from "lucide-react";

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
          <Suspense fallback={<LoadingIndicator />}>
            <Outlet />
          </Suspense>
        </main>
      )}
    </>
  );
};

// Extracted loading component for reuse
const LoadingIndicator = () => (
  <div className="flex h-full w-full items-center justify-center p-8">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const AppLayout: React.FC = () => {
  const { user, isLoading, currentBusiness } = useAuth();
  const { isMobile } = useScreenSize();
  const location = useLocation();

  // Show loading indicator during auth check
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to business selection if no business is selected
  if (!currentBusiness) {
    return <Navigate to="/business-selection" replace />;
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
