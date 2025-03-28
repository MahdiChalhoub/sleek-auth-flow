
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
  isGlobalAdmin?: boolean;
  isAdmin?: boolean; // This was missing
  permissions?: UserPermission[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  currentBusiness: Business | null;
  userBusinesses: Business[];
  login: (email: string, password: string, businessId: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  switchBusiness: (businessId: string) => void;
  hasPermission?: (permissionName: string) => boolean;
}
