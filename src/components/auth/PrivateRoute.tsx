
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider'; // Updated import
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
  const { user, isLoading, currentBusiness, hasPermission, bypassAuth } = useAuth();
  const { currentLocation, userHasAccessToLocation } = useLocationContext();
  const location = useLocation();

  console.log('🛡️ PrivateRoute rendered:', { 
    path: location.pathname,
    hasUser: !!user, 
    isLoading, 
    hasBusiness: !!currentBusiness,
    bypassAuth,
    requiredRole,
    requiredPermissions: requiredPermissions.length
  });

  // In bypass mode, always render children
  if (bypassAuth) {
    console.log('🚫 PrivateRoute bypassed due to bypass auth');
    return <>{children}</>;
  }

  if (isLoading) {
    console.log('⏳ PrivateRoute showing loading state');
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Rest of the PrivateRoute component is kept for when bypassAuth is false
  useEffect(() => {
    if (!user && !isLoading) {
      console.log('❌ PrivateRoute: No user, storing intended redirect:', location.pathname);
      localStorage.setItem("intended_redirect", location.pathname);
    }
  }, [user, isLoading, location.pathname]);

  if (!user) {
    console.log('❌ PrivateRoute: Not authenticated, redirecting to login');
    toast.error("Please log in to access this page");
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (user.status === 'pending' || user.status === 'denied' || user.status === 'inactive') {
    console.log('❌ PrivateRoute: User status not active:', user.status);
    return <Navigate to="/waiting-approval" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    console.log('❌ PrivateRoute: Role requirement not met:', { required: requiredRole, actual: user.role });
    toast.error(`Access denied. This page requires ${requiredRole} privileges.`);
    
    const roleDefaultPage = {
      admin: ROUTES.HOME,
      manager: ROUTES.INVENTORY,
      cashier: ROUTES.POS_SALES
    };
    
    const redirectTo = roleDefaultPage[user.role as keyof typeof roleDefaultPage] || ROUTES.HOME;
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(
      permission => !hasPermission(permission)
    );
    
    if (missingPermissions.length > 0) {
      console.log('❌ PrivateRoute: Missing permissions:', missingPermissions);
      toast.error("You don't have the required permissions to access this page");
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  if (!currentBusiness && 
      !location.pathname.includes(ROUTES.LOGIN) && 
      !location.pathname.includes(ROUTES.BUSINESS_SELECTION)) {
    console.log('❌ PrivateRoute: No business selected');
    toast.error("Please select a business to continue");
    return <Navigate to={ROUTES.BUSINESS_SELECTION} replace />;
  }

  if (requiredLocationAccess && currentLocation && !userHasAccessToLocation(currentLocation.id)) {
    console.log('❌ PrivateRoute: No access to location:', currentLocation?.id);
    toast.error("You don't have access to this location");
    return <Navigate to={ROUTES.HOME} replace />;
  }

  console.log('✅ PrivateRoute: Access granted to:', location.pathname);
  return <>{children}</>;
};

export default PrivateRoute;
