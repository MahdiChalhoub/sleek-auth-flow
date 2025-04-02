
import { Business } from "@/models/interfaces/businessInterfaces";

export type UserStatus = 'pending' | 'active' | 'inactive' | 'denied';

export type UserRole = "admin" | "manager" | "cashier";

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

export interface User {
  id: string;
  email: string;
  fullName?: string;
  name?: string; // Added for backward compatibility
  avatarUrl?: string;
  status: UserStatus;
  role: UserRole;
  isDeleted?: boolean;
  lastLogin?: string;
  createdAt?: string;
  permissions?: UserPermission[];
  isGlobalAdmin?: boolean; // Added for admin access checks
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  currentBusiness: Business | null;
  userBusinesses: Business[];
  login: (email: string, password: string, businessId: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  switchBusiness: (businessId: string) => void;
  hasPermission: (permissionName: string) => boolean;
}
