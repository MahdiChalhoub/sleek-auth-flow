
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider'; // Updated import
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
  
  const { user, isLoading, hasPermission, bypassAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('🧭 useAuthRedirect initialized:', { 
    path: location.pathname,
    hasUser: !!user, 
    isLoading,
    bypassAuth,
    redirectIfAuthenticated,
    redirectPath
  });
  
  // Store intended redirect if user is not authenticated
  const storeIntendedRedirect = () => {
    const from = location.state?.from?.pathname;
    if (from && ![ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.FORGOT_PASSWORD].includes(from)) {
      console.log('📝 Storing intended redirect from location state:', from);
      localStorage.setItem("intended_redirect", from);
    } else if (![ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.FORGOT_PASSWORD].includes(location.pathname)) {
      console.log('📝 Storing intended redirect from current path:', location.pathname);
      localStorage.setItem("intended_redirect", location.pathname);
    }
  };
  
  // Handle redirects based on authentication
  useEffect(() => {
    if (isLoading) {
      console.log('⏳ Loading, skipping auth redirect');
      return;
    }
    
    // Skip all redirects if bypassAuth is true
    if (bypassAuth) {
      console.log('🚫 Auth bypass enabled, skipping redirects');
      return;
    }
    
    console.log('🔍 Checking redirect conditions:', {
      isAuthenticated: !!user,
      redirectIfAuthenticated,
      redirectPath,
      requiredRole
    });
    
    try {
      // Case 1: If user needs to be authenticated but is not
      if (!user && !redirectIfAuthenticated) {
        console.log('❌ Not authenticated but needs auth, redirecting to login');
        storeIntendedRedirect();
        navigate(ROUTES.LOGIN, { state: { from: location }, replace: true });
        return;
      }
      
      // Case 2: If user is authenticated but should be redirected (login page case)
      if (user && redirectIfAuthenticated && redirectPath) {
        console.log('✅ Authenticated and should redirect to:', redirectPath);
        const intended = localStorage.getItem("intended_redirect") || redirectPath;
        console.log('🚀 Redirecting to:', intended);
        navigate(intended, { replace: true });
        return;
      }
      
      // Case 3: If user needs specific role but doesn't have it
      if (user && requiredRole && user.role !== requiredRole && user.role !== "admin") {
        console.log('❌ Role requirement not met:', { required: requiredRole, actual: user.role });
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
          console.log('❌ Missing required permissions');
          toast.error("You don't have the required permissions to access this page");
          navigate(ROUTES.HOME, { replace: true });
          return;
        }
      }
    } catch (error) {
      console.error("❌ Auth redirect error:", error);
      // Fallback to login page on unexpected errors
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [user, isLoading, location, navigate, redirectIfAuthenticated, redirectPath, requiredRole, requiredPermissions, hasPermission, bypassAuth]);
  
  // Return auth-related values and utility functions
  return {
    user,
    isLoading,
    isAuthenticated: !!user || bypassAuth, // Consider authenticated if bypassAuth is true
    redirectIfAuthenticated: (path: string = ROUTES.HOME) => {
      if ((user && !isLoading) || bypassAuth) {
        navigate(path, { replace: true });
        return true;
      }
      return false;
    },
    storeIntendedRedirect,
    getIntendedRedirect: () => localStorage.getItem("intended_redirect") || ROUTES.HOME,
    clearIntendedRedirect: () => localStorage.removeItem("intended_redirect")
  };
};
