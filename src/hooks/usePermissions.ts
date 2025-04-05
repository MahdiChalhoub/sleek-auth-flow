
import { UserPermission } from "@/types/auth";
import { v4 as uuidv4 } from 'uuid';

// Helper to create permission with UUID
const createPermission = (name: string, enabled: boolean = true): UserPermission => ({
  id: uuidv4(),
  name,
  enabled
});

/**
 * Returns a set of mock permissions based on the user role
 * Used during bypass auth mode for testing
 */
export const getMockPermissions = (role: string): UserPermission[] => {
  console.log('📋 Generating mock permissions for role:', role);
  
  // Common permissions for all roles
  const commonPermissions: UserPermission[] = [
    createPermission('can_view_dashboard'),
    createPermission('can_view_profile'),
  ];
  
  // Admin has all permissions
  if (role === 'admin') {
    return [
      ...commonPermissions,
      createPermission('can_manage_users'),
      createPermission('can_manage_roles'),
      createPermission('can_view_transactions'),
      createPermission('can_edit_transactions'),
      createPermission('can_delete_transactions'),
      createPermission('can_manage_inventory'),
      createPermission('can_manage_settings'),
      createPermission('can_view_reports'),
      createPermission('can_export_data'),
      createPermission('can_manage_clients'),
      createPermission('can_manage_suppliers'),
      createPermission('can_manage_locations'),
      createPermission('can_view_financial_data'),
      createPermission('can_manage_pos'),
    ];
  }
  
  // Manager has most permissions except user management
  if (role === 'manager') {
    return [
      ...commonPermissions,
      createPermission('can_view_transactions'),
      createPermission('can_edit_transactions'),
      createPermission('can_manage_inventory'),
      createPermission('can_view_reports'),
      createPermission('can_export_data'),
      createPermission('can_manage_clients'),
      createPermission('can_manage_suppliers'),
      createPermission('can_manage_pos'),
    ];
  }
  
  // Cashier has limited permissions
  if (role === 'cashier') {
    return [
      ...commonPermissions,
      createPermission('can_view_transactions'),
      createPermission('can_edit_transactions'),
      createPermission('can_manage_pos'),
      createPermission('can_view_inventory'),
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
