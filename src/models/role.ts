
import { UserPermission } from '@/types/auth';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: UserPermission[];
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full access to all system features',
    permissions: [
      { id: '1', name: 'users.view', description: 'View users', category: 'Users', enabled: true },
      { id: '2', name: 'users.create', description: 'Create users', category: 'Users', enabled: true },
      { id: '3', name: 'users.edit', description: 'Edit users', category: 'Users', enabled: true },
      { id: '4', name: 'users.delete', description: 'Delete users', category: 'Users', enabled: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Access to manage daily operations',
    permissions: [
      { id: '1', name: 'users.view', description: 'View users', category: 'Users', enabled: true },
      { id: '2', name: 'users.create', description: 'Create users', category: 'Users', enabled: false },
      { id: '3', name: 'users.edit', description: 'Edit users', category: 'Users', enabled: false },
      { id: '4', name: 'users.delete', description: 'Delete users', category: 'Users', enabled: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Utility to convert between role formats
export function adaptRole(role: any): Role {
  return {
    id: role.id,
    name: role.name,
    description: role.description || '',
    permissions: role.permissions || [],
    createdAt: role.createdAt || role.created_at,
    updatedAt: role.updatedAt || role.updated_at,
    created_at: role.created_at || role.createdAt,
    updated_at: role.updated_at || role.updatedAt
  };
}
