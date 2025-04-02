
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: { id: string; enabled: boolean }[];
  created_at?: string;
  updated_at?: string;
}

export interface RoleWithPermissions extends Role {
  permissions: string[];
}

export const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all features',
    permissions: []
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage inventory, sales, and staff',
    permissions: []
  },
  {
    id: 'cashier',
    name: 'Cashier',
    description: 'Can process sales and view inventory',
    permissions: []
  },
  {
    id: 'inventory',
    name: 'Inventory Manager',
    description: 'Can manage inventory and stock transfers',
    permissions: []
  }
];

export const mockRoles = defaultRoles;
