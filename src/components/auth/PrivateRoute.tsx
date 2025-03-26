
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | null;
  requiredPermissions?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requiredRole = null,
  requiredPermissions = []
}) => {
  const { user, isLoading, currentBusiness, hasPermission } = useAuth();
  const location = useLocation();

  // Store the current location to redirect back after login
  useEffect(() => {
    if (!user && !isLoading) {
      localStorage.setItem("intended_redirect", location.pathname);
    }
  }, [user, isLoading, location.pathname]);

  // If we're still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    toast.error("Please log in to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role checking is required and user doesn't have the required role
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    toast.error(`Access denied. This page requires ${requiredRole} privileges.`);
    
    // Redirect to appropriate page based on role
    const roleDefaultPage = {
      admin: "/home",
      manager: "/inventory",
      cashier: "/pos-sales"
    };
    
    const redirectTo = roleDefaultPage[user.role] || "/home";
    return <Navigate to={redirectTo} replace />;
  }

  // Check for specific permissions
  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(
      permission => !hasPermission(permission)
    );
    
    if (missingPermissions.length > 0) {
      toast.error("You don't have the required permissions to access this page");
      return <Navigate to="/home" replace />;
    }
  }

  // If no business is selected but we're logged in
  if (!currentBusiness && !location.pathname.includes('/login')) {
    toast.error("Please select a business to continue");
    return <Navigate to="/business-selection" replace />;
  }

  // If authenticated and has the required role/permissions, render the children components
  return <>{children}</>;
};

export default PrivateRoute;
