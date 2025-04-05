
import { Business } from '@/models/interfaces/businessInterfaces';
import { Branch } from '@/types/location';

export interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  currentBusiness: Business | null;
  setCurrentBusiness: (business: Business | null) => void;
  currentLocation: Branch | null;
  setCurrentLocation: (location: Branch | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  bypassAuth: boolean;
  userBusinesses?: Business[];
  switchBusiness?: (businessId: string) => Promise<void>;
}

// Define UserRole type
export type UserRole = 'admin' | 'manager' | 'cashier' | 'user';

// Define User interface
export interface User {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  avatar_url?: string;
  avatarUrl?: string;
  role?: UserRole;
  isGlobalAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  status?: UserStatus;
  lastLogin?: string;
  permissions?: UserPermission[];
}

// Define UserPermission interface
export interface UserPermission {
  id?: string; // Made optional to fix type errors
  name: string;
  description?: string;
  category?: string;
  enabled: boolean;
}

// Define Role interface
export interface Role {
  id?: string; // Made optional to fix TS error
  name: string;
  description?: string;
  permissions: UserPermission[];
  createdAt?: string;
  updatedAt?: string;
}

// Define UserStatus type
export type UserStatus = 'active' | 'pending' | 'inactive' | 'denied';
