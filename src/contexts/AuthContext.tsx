
import React, { createContext, useContext } from "react";
import { Business } from "@/models/interfaces/businessInterfaces";
import { User, AuthContextType } from "@/types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthProvider } from "@/providers/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Add permission checking helper
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
    if (permissionName.startsWith('can_view') && context.user.role === 'cashier') {
      return true;
    }
    
    if ((permissionName.startsWith('can_view') || permissionName.startsWith('can_edit')) 
        && context.user.role === 'manager') {
      return true;
    }
    
    return false;
  };
  
  return {
    ...context,
    hasPermission
  };
};
