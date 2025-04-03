
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatar_url?: string;
  role?: string;
  isGlobalAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
