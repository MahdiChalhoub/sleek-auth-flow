import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocationContext } from '@/contexts/LocationContext';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';
import { ROUTES } from '@/constants/routes';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string | null;
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

  useEffect(() => {
    if (!user && !isLoading) {
      localStorage.setItem("intended_redirect", location.pathname);
    }
  }, [user, isLoading, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    toast.error("Please log in to access this page");
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (user.status === 'pending' || user.status === 'denied' || user.status === 'inactive') {
    return <Navigate to="/waiting-approval" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    toast.error(`Access denied. This page requires ${requiredRole} privileges.`);
    
    const roleDefaultPage = {
      admin: ROUTES.HOME,
      manager: ROUTES.INVENTORY,
      cashier: ROUTES.POS_SALES
    };
    
    const redirectTo = roleDefaultPage[user.role] || ROUTES.HOME;
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(
      permission => !hasPermission(permission)
    );
    
    if (missingPermissions.length > 0) {
      toast.error("You don't have the required permissions to access this page");
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  if (!currentBusiness && 
      !location.pathname.includes(ROUTES.LOGIN) && 
      !location.pathname.includes(ROUTES.BUSINESS_SELECTION)) {
    toast.error("Please select a business to continue");
    return <Navigate to={ROUTES.BUSINESS_SELECTION} replace />;
  }

  if (requiredLocationAccess && currentLocation && !userHasAccessToLocation(currentLocation.id)) {
    toast.error("You don't have access to this location");
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
