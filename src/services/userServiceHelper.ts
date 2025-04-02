
import { User, Role as AuthRole } from '@/types/auth';
import { Role } from '@/models/role';

/**
 * Type-safe access to object properties with defaults
 */
export const safeGet = <T>(obj: any, key: string, defaultValue: T): T => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  return (obj[key] as T) ?? defaultValue;
};

/**
 * Safe mapping function for user data
 */
export const mapUserData = (userData: any): User => {
  const profiles = safeGet(userData, 'profiles', {});
  
  return {
    id: safeGet(userData, 'id', ''),
    email: safeGet(userData, 'email', ''),
    role: safeGet(userData, 'role', 'employee'),
    isGlobalAdmin: safeGet(userData, 'is_global_admin', false),
    fullName: safeGet(profiles, 'full_name', '') || safeGet(userData, 'email', '').split('@')[0] || '',
    avatarUrl: safeGet(profiles, 'avatar_url', ''),
    status: safeGet(userData, 'status', 'inactive'),
    lastLogin: safeGet(userData, 'last_login', null),
    createdAt: safeGet(userData, 'created_at', null),
    permissions: safeGet(userData, 'permissions', [])
  };
};

/**
 * Safe mapping function for role data
 */
export const mapRoleData = (roleData: any): Role => {
  return {
    id: safeGet(roleData, 'id', ''),
    name: safeGet(roleData, 'name', ''),
    description: safeGet(roleData, 'description', ''),
    permissions: safeGet(roleData, 'permissions', []),
    createdAt: safeGet(roleData, 'created_at', null),
    updatedAt: safeGet(roleData, 'updated_at', null),
    created_at: safeGet(roleData, 'created_at', null),
    updated_at: safeGet(roleData, 'updated_at', null)
  };
};

/**
 * Type adapter for user-related service methods
 */
export const methodAdapters = {
  listUsers: (users: any[]): User[] => {
    return users.map(mapUserData);
  },
  
  getRoles: (roles: any[]): Role[] => {
    return roles.map(mapRoleData);
  }
};
