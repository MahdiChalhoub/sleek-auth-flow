
import { UserPermission } from "@/types/auth";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: UserPermission[];
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;  // Used for compatibility with database fields
  updated_at?: string;  // Used for compatibility with database fields
}

// Helper for converting between different role formats
export const adaptRole = (role: any): Role => {
  const createdAt = role.createdAt || role.created_at || new Date().toISOString();
  const updatedAt = role.updatedAt || role.updated_at || new Date().toISOString();
  
  return {
    id: role.id,
    name: role.name,
    description: role.description || "",
    permissions: role.permissions || [],
    createdAt,
    updatedAt,
    created_at: createdAt,
    updated_at: updatedAt
  };
};

// Mock roles for development
export const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Admin',
    description: 'Full system access',
    permissions: [
      { id: 'perm-1', name: 'manage_users', description: 'Manage Users', category: 'users', enabled: true },
      { id: 'perm-2', name: 'manage_inventory', description: 'Manage Inventory', category: 'inventory', enabled: true },
      { id: 'perm-3', name: 'manage_sales', description: 'Manage Sales', category: 'sales', enabled: true }
    ],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'role-2',
    name: 'Manager',
    description: 'Store management capabilities',
    permissions: [
      { id: 'perm-2', name: 'manage_inventory', description: 'Manage Inventory', category: 'inventory', enabled: true },
      { id: 'perm-3', name: 'manage_sales', description: 'Manage Sales', category: 'sales', enabled: true }
    ],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'role-3',
    name: 'Cashier',
    description: 'Limited sales capabilities',
    permissions: [
      { id: 'perm-3', name: 'manage_sales', description: 'Manage Sales', category: 'sales', enabled: true }
    ],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];
