
export type UserRole = 'admin' | 'manager' | 'cashier' | 'user';

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
  status?: 'active' | 'pending' | 'inactive' | 'denied';
  lastLogin?: string;
  permissions?: UserPermission[];
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface UserPermissions {
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewUsers: boolean;
  canManageRoles: boolean;
  canViewRoles: boolean;
}

export interface UserPermission {
  id: string;
  name: string;
  description?: string;
  category?: string;
  enabled: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: UserPermission[];
  createdAt?: string;
  updatedAt?: string;
}
