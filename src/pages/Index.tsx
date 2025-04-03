
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, LogOut, ShoppingCart, Package, FileText } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading, bypassAuth } = useAuth();

  console.log('🖥️ Index page rendered:', { 
    hasUser: !!user, 
    isLoading,
    bypassAuth
  });

  useEffect(() => {
    // Always redirect to appropriate dashboard in one of these cases:
    // 1. If bypass auth is enabled
    // 2. If the user has already logged in
    if ((user && !isLoading) || bypassAuth) {
      console.log('🚀 Redirecting to appropriate dashboard');
      
      // Get the appropriate page based on role
      let redirectPath = ROUTES.HOME;
      if (user?.role === 'cashier') {
        redirectPath = ROUTES.POS_SALES;
      } else if (user?.role === 'manager') {
        redirectPath = ROUTES.INVENTORY;
      }

      navigate(redirectPath, { replace: true });
    }
  }, [user, isLoading, navigate, bypassAuth]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully", {
      description: "You have been logged out of your account.",
    });
  };

  if (isLoading) {
    console.log('⏳ Showing loading indicator on Index page');
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  if (user || bypassAuth) {
    console.log('⏳ User detected, waiting for redirect...');
    // This is a fallback, but useEffect should handle redirection
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-lg mx-auto p-8 rounded-2xl glass-card">
        <h1 className="text-3xl font-semibold mb-4 text-center">POS Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          Welcome to your POS system. Please log in to continue.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            className="p-6 h-auto flex flex-col items-center gap-3"
            variant="outline"
            asChild
          >
            <Link to={ROUTES.POS_SALES}>
              <ShoppingCart className="h-6 w-6" />
              <span>POS Sales</span>
            </Link>
          </Button>
          
          <Button
            className="p-6 h-auto flex flex-col items-center gap-3"
            variant="outline"
            asChild
          >
            <Link to={ROUTES.INVENTORY}>
              <Package className="h-6 w-6" />
              <span>Inventory</span>
            </Link>
          </Button>

          <Button
            className="p-6 h-auto flex flex-col items-center gap-3"
            variant="outline"
            asChild
          >
            <Link to={ROUTES.ROLES}>
              <Users className="h-6 w-6" />
              <span>Manage Roles</span>
            </Link>
          </Button>
          
          <Button
            className="p-6 h-auto flex flex-col items-center gap-3"
            variant="outline"
            asChild
          >
            <Link to={ROUTES.TRANSACTIONS}>
              <FileText className="h-6 w-6" />
              <span>Transactions</span>
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            className="px-8 py-2"
            variant="outline"
            onClick={handleLogout}
            asChild
          >
            <Link to={ROUTES.LOGIN}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
          
          <Button
            className="px-8 py-2"
            variant="default"
            asChild
          >
            <Link to={ROUTES.LOGIN}>Login to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
