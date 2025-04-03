import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';
import { Business } from '@/models/interfaces/businessInterfaces';
import { fromTable, isDataResponse, safeDataTransform } from '@/utils/supabaseServiceHelper';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  currentBusiness: Business | null;
  userBusinesses: Business[];
  login: (email: string, password: string, businessId: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  switchBusiness: (businessId: string) => void;
  hasPermission: (permissionName: string) => boolean;
}

// Export the AuthContext so it can be imported in other files
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  currentBusiness: null,
  userBusinesses: [],
  login: async () => {},
  logout: () => {},
  switchBusiness: () => {},
  hasPermission: () => false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);

  // Load user's businesses
  const loadUserBusinesses = useCallback(async (userId: string): Promise<Business[]> => {
    try {
      // Fetch businesses where user is the owner
      const ownedResponse = await fromTable('businesses')
        .select('*')
        .eq('owner_id', userId);
      
      // Fetch businesses where user is a member
      const memberResponse = await fromTable('business_users')
        .select('business:businesses(*)')
        .eq('user_id', userId);
      
      if (!isDataResponse(ownedResponse) || !isDataResponse(memberResponse)) {
        console.error('Error fetching businesses:', ownedResponse.error || memberResponse.error);
        return [];
      }
      
      // Combine and deduplicate businesses
      const memberBusinessesData = safeDataTransform(memberResponse.data, item => {
        if (item && typeof item === 'object' && 'business' in item) {
          return item.business;
        }
        return null;
      });
      
      const allBusinesses = [...(ownedResponse.data || []), ...memberBusinessesData];
      
      // Remove duplicates based on business ID
      const uniqueBusinessMap = new Map<string, any>();
      allBusinesses.forEach(business => {
        if (business && business.id) {
          uniqueBusinessMap.set(business.id, business);
        }
      });
      
      // Map to our Business interface
      const mappedBusinesses: Business[] = Array.from(uniqueBusinessMap.values()).map(business => ({
        id: business.id,
        name: business.name,
        address: business.address,
        phone: business.phone,
        email: business.email,
        status: business.status,
        ownerId: business.owner_id,
        createdAt: business.created_at,
        updatedAt: business.updated_at,
        logoUrl: business.logo_url,
        description: business.description,
        type: business.type,
        country: business.country,
        currency: business.currency,
        active: business.active,
        timezone: business.timezone
      }));
      
      return mappedBusinesses;
    } catch (error) {
      console.error('Error loading user businesses:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error fetching user:', userError);
        setIsLoading(false);
        return;
      }
      
      if (userData && userData.user) {
        // Create a User object that matches our app's User type
        const appUser: User = {
          id: userData.user.id,
          email: userData.user.email || '',
          role: 'cashier', // Default role
          status: 'active', // Default status
          lastLogin: new Date().toISOString()
        };
        
        const userBusinessesData = await loadUserBusinesses(userData.user.id);
        
        setUser(appUser);
        setUserBusinesses(userBusinessesData);
        setCurrentBusiness(userBusinessesData[0] || null);
      }
      
      setIsLoading(false);
    };
    
    fetchUser();
  }, [loadUserBusinesses]);

  const login = async (email: string, password: string, businessId: string, rememberMe?: boolean) => {
    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (userError) {
      console.error('Error logging in:', userError);
      throw userError;
    }
    
    if (userData && userData.user) {
      // Create a User object that matches our app's User type
      const appUser: User = {
        id: userData.user.id,
        email: userData.user.email || '',
        role: 'cashier', // Default role
        status: 'active', // Default status
        lastLogin: new Date().toISOString()
      };
      
      const userBusinessesData = await loadUserBusinesses(userData.user.id);
      
      setUser(appUser);
      setCurrentBusiness(userBusinessesData[0] || null);
      setUserBusinesses(userBusinessesData);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setCurrentBusiness(null);
    setUserBusinesses([]);
  };

  const switchBusiness = (businessId: string) => {
    const newBusiness = userBusinesses.find(business => business.id === businessId);
    
    if (newBusiness) {
      setCurrentBusiness(newBusiness);
    }
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false;
    
    // Admin role has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permissions if available
    if (user.permissions) {
      return user.permissions.some(
        permission => permission.name === permissionName && permission.enabled
      );
    }
    
    // Default role-based permissions for backward compatibility
    if (permissionName === 'can_view_transactions' && user.role === 'cashier') {
      return true;
    }
    
    if (permissionName === 'can_edit_transactions' && user.role === 'cashier') {
      return true;
    }
    
    if (permissionName.startsWith('can_') && user.role === 'manager') {
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        currentBusiness,
        userBusinesses,
        login,
        logout,
        switchBusiness,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
