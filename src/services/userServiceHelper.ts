
import { User, UserRole } from '@/types/auth';
import { Role } from '@/models/role';

/**
 * Safe mapper for user data
 */
export function mapUserData(userData: any): User {
  return {
    id: userData.id || '',
    email: userData.email || '',
    fullName: userData.profiles?.full_name || userData.email?.split('@')[0] || '',
    avatarUrl: userData.profiles?.avatar_url || '',
    status: (userData.status as any) || 'active',
    role: (userData.role as UserRole) || 'cashier',
    isGlobalAdmin: userData.is_global_admin || false,
    isDeleted: userData.is_deleted || false,
    lastLogin: userData.last_login || null,
    createdAt: userData.created_at || null,
    permissions: userData.permissions || []
  };
}

/**
 * Safe mapper for role data
 */
export function mapRoleData(roleData: any): Role {
  return {
    id: roleData.id || '',
    name: roleData.name || '',
    description: roleData.description || '',
    permissions: roleData.permissions || [],
    createdAt: roleData.created_at || null,
    updatedAt: roleData.updated_at || null,
    created_at: roleData.created_at || null,
    updated_at: roleData.updated_at || null
  };
}

/**
 * Method adapters for safe data handling
 */
export const methodAdapters = {
  listUsers: (data: any[]): User[] => {
    return data.map(mapUserData);
  },
  
  mapUserRoles: (userData: any, roles: any[]): User & { roles: Role[] } => {
    const user = mapUserData(userData);
    const mappedRoles = roles.map(mapRoleData);
    
    return {
      ...user,
      roles: mappedRoles
    };
  }
};

/**
 * Helper for safe property access
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  if (!obj) return undefined;
  return obj[key];
}
