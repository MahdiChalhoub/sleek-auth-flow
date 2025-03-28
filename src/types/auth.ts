
import { Business } from "@/models/interfaces/businessInterfaces";

export type UserRole = "admin" | "cashier" | "manager";

export interface UserPermission {
  id: string;
  name: string;
  enabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  avatar?: string;
  isGlobalAdmin?: boolean;
  isAdmin?: boolean;
  permissions?: UserPermission[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading?: boolean; 
  currentBusiness: Business | null;
  userBusinesses: Business[];
  login: (email: string, password: string, businessId: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  signIn?: (email: string, password: string, businessId: string, rememberMe?: boolean) => Promise<void>;
  signUp?: (email: string, password: string, name: string) => Promise<void>;
  signOut?: () => Promise<void>;
  error?: string | null;
  switchBusiness: (businessId: string) => void;
  hasPermission: (permissionName: string) => boolean;
}
