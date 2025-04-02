
import { Role as AuthRole } from '@/types/auth';
import { Role as ModelRole } from '@/models/role';

/**
 * Utility function to convert between Auth Role and Model Role formats
 */
export function adaptRole(role: AuthRole | ModelRole): ModelRole {
  // Check if role has createdAt or created_at
  const createdAt = 
    'createdAt' in role && role.createdAt ? role.createdAt : 
    ('created_at' in role && role.created_at ? role.created_at : undefined);
  
  // Check if role has updatedAt or updated_at
  const updatedAt = 
    'updatedAt' in role && role.updatedAt ? role.updatedAt : 
    ('updated_at' in role && role.updated_at ? role.updated_at : undefined);
  
  return {
    id: role.id,
    name: role.name,
    description: role.description || '',
    permissions: role.permissions || [],
    createdAt: createdAt,
    updatedAt: updatedAt,
    created_at: createdAt,
    updated_at: updatedAt
  };
}

/**
 * Utility function to convert arrays of roles
 */
export function adaptRoles(roles: (AuthRole | ModelRole)[]): ModelRole[] {
  return roles.map(role => adaptRole(role));
}
