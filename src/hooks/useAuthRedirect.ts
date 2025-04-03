
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

/**
 * Hook for handling auth redirects based on user status and role
 * @param options Configuration options for redirect behavior
 * @returns Object containing auth-related values and utility functions
 */
export const useAuthRedirect = (options: {
  requiredRole?: string;
  requiredPermissions?: string[];
  redirectIfAuthenticated?: boolean;
  redirectPath?: string;
} = {}) => {
  const {
    requiredRole,
    requiredPermissions = [],
    redirectIfAuthenticated = false,
    redirectPath,
  } = options;
  
  const { user, isLoading, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Store intended redirect if user is not authenticated
  const storeIntendedRedirect = () => {
    const from = location.state?.from?.pathname;
    if (from && ![ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.FORGOT_PASSWORD].includes(from)) {
      localStorage.setItem("intended_redirect", from);
    } else if (!from) {
      localStorage.setItem("intended_redirect", location.pathname);
    }
  };
  
  // Handle redirects based on authentication
  useEffect(() => {
    if (isLoading) return;
    
    try {
      // Case 1: If user needs to be authenticated but is not
      if (!user && !redirectIfAuthenticated) {
        storeIntendedRedirect();
        navigate(ROUTES.LOGIN, { state: { from: location }, replace: true });
        return;
      }
      
      // Case 2: If user is authenticated but should be redirected (login page case)
      if (user && redirectIfAuthenticated && redirectPath) {
        const intended = localStorage.getItem("intended_redirect") || redirectPath;
        navigate(intended, { replace: true });
        return;
      }
      
      // Case 3: If user needs specific role but doesn't have it
      if (user && requiredRole && user.role !== requiredRole && user.role !== "admin") {
        toast.error(`Access denied. This page requires ${requiredRole} privileges.`);
        navigate(ROUTES.HOME, { replace: true });
        return;
      }
      
      // Case 4: If user needs specific permissions but doesn't have them
      if (user && requiredPermissions.length > 0) {
        const hasMissingPermissions = requiredPermissions.some(
          permission => !hasPermission(permission)
        );
        
        if (hasMissingPermissions) {
          toast.error("You don't have the required permissions to access this page");
          navigate(ROUTES.HOME, { replace: true });
          return;
        }
      }
    } catch (error) {
      console.error("Auth redirect error:", error);
      // Fallback to login page on unexpected errors
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [user, isLoading, location, navigate, redirectIfAuthenticated, redirectPath, requiredRole, requiredPermissions, hasPermission]);
  
  // Return auth-related values and utility functions
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    storeIntendedRedirect,
    getIntendedRedirect: () => localStorage.getItem("intended_redirect") || ROUTES.HOME,
    clearIntendedRedirect: () => localStorage.removeItem("intended_redirect")
  };
};
