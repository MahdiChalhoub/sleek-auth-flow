import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';
import { Business } from '@/models/interfaces/businessInterfaces';
import { fromTable } from '@/utils/supabaseServiceHelper';

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

const AuthContext = createContext<AuthContextType>({
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
  const loadUserBusinesses = useCallback(async (userId: string) => {
    try {
      // Fetch businesses where user is the owner
      const { data: ownedBusinesses, error: ownedError } = await fromTable('businesses')
        .select('*')
        .eq('owner_id', userId);
      
      if (ownedError) throw ownedError;
      
      // Fetch businesses where user is a member
      const { data: memberBusinesses, error: memberError } = await fromTable('business_users')
        .select('business:businesses(*)')
        .eq('user_id', userId)
        .eq('is_active', true);
      
      if (memberError) throw memberError;
      
      // Combine and deduplicate businesses
      const memberBusinessesData = memberBusinesses
        .map(item => item.business)
        .filter(Boolean);
      
      const allBusinesses = [...ownedBusinesses, ...memberBusinessesData];
      
      // Remove duplicates based on business ID
      const uniqueBusinesses = allBusinesses.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [] as any[]);
      
      // Map to our Business interface
      const mappedBusinesses: Business[] = uniqueBusinesses.map(business => ({
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
        return;
      }
      
      if (userData) {
        const { data: userBusinessesData, error: userBusinessesError } = await loadUserBusinesses(userData.user.id);
        
        if (userBusinessesError) {
          console.error('Error loading user businesses:', userBusinessesError);
          return;
        }
        
        setUser(userData.user);
        setCurrentBusiness(userBusinessesData[0]);
        setUserBusinesses(userBusinessesData);
      }
      
      setIsLoading(false);
    };
    
    fetchUser();
  }, [loadUserBusinesses]);

  const login = async (email: string, password: string, businessId: string, rememberMe?: boolean) => {
    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (userError) {
      console.error('Error logging in:', userError);
      return;
    }
    
    const { data: userBusinessesData, error: userBusinessesError } = await loadUserBusinesses(userData.user.id);
    
    if (userBusinessesError) {
      console.error('Error loading user businesses:', userBusinessesError);
      return;
    }
    
    setUser(userData.user);
    setCurrentBusiness(userBusinessesData[0]);
    setUserBusinesses(userBusinessesData);
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
