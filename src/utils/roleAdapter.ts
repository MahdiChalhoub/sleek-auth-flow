
import { Role as ModelRole } from '@/models/role';
import { Role as TypeRole } from '@/types/auth';

/**
 * Adapt a type Role to a model Role
 */
export function adaptTypeRoleToModelRole(typeRole: TypeRole): ModelRole {
  return {
    id: typeRole.id,
    name: typeRole.name,
    description: typeRole.description || '',
    permissions: typeRole.permissions || [],
    createdAt: typeRole.createdAt,
    updatedAt: typeRole.updatedAt,
    created_at: typeRole.createdAt || '',
    updated_at: typeRole.updatedAt || ''
  };
}

/**
 * Adapt an array of type Roles to model Roles
 */
export function adaptTypeRolesToModelRoles(typeRoles: TypeRole[]): ModelRole[] {
  return typeRoles.map(adaptTypeRoleToModelRole);
}

// Add aliases for backward compatibility
export const adaptRole = adaptTypeRoleToModelRole;
export const adaptRoles = adaptTypeRolesToModelRoles;
