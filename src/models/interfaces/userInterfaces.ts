
import { UserRole, UserPermission, UserStatus, Role } from '@/types/auth';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  name?: string; // Adding name property for backward compatibility
  avatar_url?: string;
  avatarUrl?: string; // Adding avatarUrl property for backward compatibility
  role?: UserRole;
  isGlobalAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  status?: UserStatus;
  lastLogin?: string;
  permissions?: UserPermission[];
}

export interface UserPermissions {
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewUsers: boolean;
  canManageRoles: boolean;
  canViewRoles: boolean;
}

// Re-export for backward compatibility
export type { UserRole, UserPermission, UserStatus, Role };
