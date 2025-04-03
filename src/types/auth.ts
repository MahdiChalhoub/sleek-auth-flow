
import { Business } from '@/models/interfaces/businessInterfaces';
import { User, UserRole } from '@/models/interfaces/userInterfaces';
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
}
