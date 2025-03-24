
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useScreenSize } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/sonner";

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppTopbar />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default AppLayout;
