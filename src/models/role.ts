
export interface Role {
  id: string;
  name: string;
  description: string;
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
    description: 'Full access to all features'
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage inventory, sales, and staff'
  },
  {
    id: 'cashier',
    name: 'Cashier',
    description: 'Can process sales and view inventory'
  },
  {
    id: 'inventory',
    name: 'Inventory Manager',
    description: 'Can manage inventory and stock transfers'
  }
];
