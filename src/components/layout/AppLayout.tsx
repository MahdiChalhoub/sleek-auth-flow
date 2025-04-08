
import React, { Suspense } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
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
    <div className="flex flex-col flex-1 h-full">
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
    </div>
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
  const { user, isLoading, currentBusiness, bypassAuth } = useAuth();
  const { isMobile } = useScreenSize();
  const location = useLocation();
  
  console.log('🖥️ AppLayout rendered:', { 
    user: !!user, 
    isLoading, 
    hasBusiness: !!currentBusiness, 
    bypassAuth,
    location: location.pathname
  });

  // Show loading indicator during auth check, but only if not in bypass mode
  if (isLoading && !bypassAuth) {
    console.log('⏳ Showing loading indicator due to auth loading state');
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingIndicator />
          <p className="text-sm text-muted-foreground">Initializing application...</p>
        </div>
      </div>
    );
  }

  // Skip authentication checks if bypassAuth is true
  if (!bypassAuth) {
    // Only perform these checks if not in bypass mode
    console.log('🔍 Performing authentication checks');
    
    // Redirect if not authenticated
    if (!user) {
      console.log('❌ Not authenticated, redirecting to login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to business selection if no business is selected
    if (!currentBusiness) {
      console.log('❌ No business selected, redirecting to business selection');
      return <Navigate to="/business-selection" replace />;
    }
  } else {
    console.log('🚫 Bypassing authentication checks');
  }

  return (
    <TabsProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full h-screen bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col h-full">
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
