
import { Role as AuthRole } from '@/types/auth';
import { Role as ModelRole } from '@/models/role';

/**
 * Utility function to convert between Auth Role and Model Role formats
 */
export function adaptRole(role: AuthRole | ModelRole): ModelRole {
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

/**
 * Utility function to convert arrays of roles
 */
export function adaptRoles(roles: (AuthRole | ModelRole)[]): ModelRole[] {
  return roles.map(role => adaptRole(role));
}
