
import { UserPermission } from "@/types/auth";

/**
 * Returns a set of mock permissions based on the user role
 * Used during bypass auth mode for testing
 */
export const getMockPermissions = (role: string): UserPermission[] => {
  console.log('📋 Generating mock permissions for role:', role);
  
  // Common permissions for all roles
  const commonPermissions: UserPermission[] = [
    { name: 'can_view_dashboard', enabled: true },
    { name: 'can_view_profile', enabled: true },
  ];
  
  // Admin has all permissions
  if (role === 'admin') {
    return [
      ...commonPermissions,
      { name: 'can_manage_users', enabled: true },
      { name: 'can_manage_roles', enabled: true },
      { name: 'can_view_transactions', enabled: true },
      { name: 'can_edit_transactions', enabled: true },
      { name: 'can_delete_transactions', enabled: true },
      { name: 'can_manage_inventory', enabled: true },
      { name: 'can_manage_settings', enabled: true },
      { name: 'can_view_reports', enabled: true },
      { name: 'can_export_data', enabled: true },
      { name: 'can_manage_clients', enabled: true },
      { name: 'can_manage_suppliers', enabled: true },
      { name: 'can_manage_locations', enabled: true },
      { name: 'can_view_financial_data', enabled: true },
      { name: 'can_manage_pos', enabled: true },
    ];
  }
  
  // Manager has most permissions except user management
  if (role === 'manager') {
    return [
      ...commonPermissions,
      { name: 'can_view_transactions', enabled: true },
      { name: 'can_edit_transactions', enabled: true },
      { name: 'can_manage_inventory', enabled: true },
      { name: 'can_view_reports', enabled: true },
      { name: 'can_export_data', enabled: true },
      { name: 'can_manage_clients', enabled: true },
      { name: 'can_manage_suppliers', enabled: true },
      { name: 'can_manage_pos', enabled: true },
    ];
  }
  
  // Cashier has limited permissions
  if (role === 'cashier') {
    return [
      ...commonPermissions,
      { name: 'can_view_transactions', enabled: true },
      { name: 'can_edit_transactions', enabled: true },
      { name: 'can_manage_pos', enabled: true },
      { name: 'can_view_inventory', enabled: true },
    ];
  }
  
  // Return basic permissions for unknown roles
  return commonPermissions;
};

/**
 * Hook for checking permissions in bypass mode
 */
export const usePermissions = (role: string = 'admin') => {
  const permissions = getMockPermissions(role);
  
  const hasPermission = (permissionName: string): boolean => {
    return permissions.some(p => p.name === permissionName && p.enabled);
  };
  
  return {
    permissions,
    hasPermission
  };
};

export default usePermissions;
