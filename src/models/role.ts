
import { UserPermission } from '@/types/auth';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: { id: string; enabled: boolean }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleWithPermissions extends Omit<Role, 'permissions'> {
  permissions: UserPermission[];
}

export const createRole = (data: Partial<Role>): Role => {
  return {
    id: data.id || '',
    name: data.name || '',
    description: data.description || '',
    permissions: data.permissions || [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
};

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full access to all features',
    permissions: [
      { id: '1', enabled: true },
      { id: '2', enabled: true },
      { id: '3', enabled: true }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Access to most features except administrative settings',
    permissions: [
      { id: '1', enabled: true },
      { id: '2', enabled: true },
      { id: '3', enabled: false }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Cashier',
    description: 'Limited access to sales features',
    permissions: [
      { id: '1', enabled: true },
      { id: '2', enabled: false },
      { id: '3', enabled: false }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
