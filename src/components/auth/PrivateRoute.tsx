
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocationContext } from '@/contexts/LocationContext';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | null;
  requiredPermissions?: string[];
  requiredLocationAccess?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requiredRole = null,
  requiredPermissions = [],
  requiredLocationAccess = false
}) => {
  const { user, isLoading, currentBusiness, hasPermission } = useAuth();
  const { currentLocation, userHasAccessToLocation } = useLocationContext();
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
  if (!currentBusiness && !location.pathname.includes('/login') && !location.pathname.includes('/business-selection')) {
    toast.error("Please select a business to continue");
    return <Navigate to="/business-selection" replace />;
  }

  // Check if location access is required and user has access to the current location
  if (requiredLocationAccess && currentLocation && !userHasAccessToLocation(currentLocation.id)) {
    toast.error("You don't have access to this location");
    return <Navigate to="/home" replace />;
  }

  // If authenticated and has the required role/permissions, render the children components
  return <>{children}</>;
};

export default PrivateRoute;
