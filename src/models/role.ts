
import { UserPermission } from '@/types/auth';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: { id: string; enabled: boolean; }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleWithPermissions extends Omit<Role, 'permissions'> {
  permissions: { id: string; enabled: boolean; }[];
}

// Mock roles data
export const mockRoles: Role[] = [
  {
    id: "role-1",
    name: "Administrator",
    description: "Full system access",
    permissions: [
      { id: "perm-1", enabled: true },
      { id: "perm-2", enabled: true },
      { id: "perm-3", enabled: true }
    ]
  },
  {
    id: "role-2",
    name: "Manager",
    description: "Store management access",
    permissions: [
      { id: "perm-1", enabled: true },
      { id: "perm-2", enabled: true },
      { id: "perm-3", enabled: false }
    ]
  },
  {
    id: "role-3",
    name: "Cashier",
    description: "Sales and register access",
    permissions: [
      { id: "perm-1", enabled: true },
      { id: "perm-2", enabled: false },
      { id: "perm-3", enabled: false }
    ]
  }
];
