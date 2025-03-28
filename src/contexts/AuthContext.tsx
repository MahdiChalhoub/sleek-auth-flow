
import React, { createContext, useContext } from "react";
import { Business } from "@/models/interfaces/businessInterfaces";
import { User, AuthContextType } from "@/types/auth";
import { AuthProvider } from "@/providers/AuthProvider";

// Create the auth context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the AuthProvider from our providers directory
export { AuthProvider };

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Add permission checking helper - this is already defined in usePermissions.ts
  // but we're adding it here for backward compatibility and convenience
  const hasPermission = (permissionName: string): boolean => {
    if (!context.user) return false;
    
    // Admin role has all permissions
    if (context.user.role === 'admin') return true;
    
    // Check specific permissions if available
    if (context.user.permissions) {
      return context.user.permissions.some(
        permission => permission.name === permissionName && permission.enabled
      );
    }
    
    // Default role-based permissions for backward compatibility
    if (permissionName === 'can_view_transactions' && context.user.role === 'cashier') {
      return true;
    }
    
    if (permissionName === 'can_edit_transactions' && context.user.role === 'cashier') {
      return true;
    }
    
    if (permissionName.startsWith('can_') && context.user.role === 'manager') {
      return true;
    }
    
    return false;
  };
  
  return {
    ...context,
    hasPermission
  };
};
