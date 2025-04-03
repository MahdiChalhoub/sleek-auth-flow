
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';
import { Business } from '@/models/interfaces/businessInterfaces';
import { toast } from 'sonner';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';

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

  const loadUserBusinesses = useCallback(async (userId: string): Promise<Business[]> => {
    try {
      const ownedResponse = await fromTable('businesses')
        .select('*')
        .eq('owner_id', userId);
      
      if (!isDataResponse(ownedResponse)) {
        console.error('Error fetching owned businesses:', ownedResponse.error);
        return [];
      }
      
      const ownedBusinesses = ownedResponse.data || [];
      
      const membershipResponse = await fromTable('business_users')
        .select('business_id')
        .eq('user_id', userId);
      
      if (!isDataResponse(membershipResponse)) {
        console.error('Error fetching member businesses:', membershipResponse.error);
        return ownedBusinesses.map(mapBusinessData);
      }
      
      // Filter out any null or undefined business_id values
      const validMemberBusinesses = (membershipResponse.data || [])
        .filter(item => item && typeof item === 'object' && item.business_id);
      
      let businessesFromMembership: any[] = [];
      if (validMemberBusinesses.length > 0) {
        // Extract business IDs from validMemberBusinesses
        const businessIds = validMemberBusinesses.map(item => item.business_id);
        
        if (businessIds.length > 0) {
          const memberDetailsResponse = await fromTable('businesses')
            .select('*')
            .in('id', businessIds);
            
          if (isDataResponse(memberDetailsResponse)) {
            businessesFromMembership = memberDetailsResponse.data || [];
          } else {
            console.error('Error fetching member business details:', memberDetailsResponse.error);
          }
        }
      }
      
      const allBusinesses = [...ownedBusinesses, ...businessesFromMembership];
      
      const uniqueBusinessMap = new Map<string, any>();
      allBusinesses.forEach(business => {
        if (business && business.id) {
          uniqueBusinessMap.set(business.id, business);
        }
      });
      
      return Array.from(uniqueBusinessMap.values()).map(mapBusinessData);
    } catch (error) {
      console.error('Error loading user businesses:', error);
      return [];
    }
  }, []);

  const mapBusinessData = (business: any): Business => ({
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
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: authData } = await supabase.auth.getSession();
      
        if (authData && authData.session?.user) {
          const appUser: User = {
            id: authData.session.user.id,
            email: authData.session.user.email || '',
            role: 'admin',
            status: 'active',
            lastLogin: new Date().toISOString()
          };
          
          const userBusinessesData = await loadUserBusinesses(authData.session.user.id);
          
          setUser(appUser);
          setUserBusinesses(userBusinessesData);
          
          const savedBusinessId = localStorage.getItem('pos_current_business');
          if (savedBusinessId) {
            const savedBusiness = userBusinessesData.find(b => b.id === savedBusinessId);
            if (savedBusiness) {
              setCurrentBusiness(savedBusiness);
            } else if (userBusinessesData.length > 0) {
              setCurrentBusiness(userBusinessesData[0]);
              localStorage.setItem('pos_current_business', userBusinessesData[0].id);
            }
          } else if (userBusinessesData.length > 0) {
            setCurrentBusiness(userBusinessesData[0]);
            localStorage.setItem('pos_current_business', userBusinessesData[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const appUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
            status: 'active',
            lastLogin: new Date().toISOString()
          };
          
          const userBusinessesData = await loadUserBusinesses(session.user.id);
          
          setUser(appUser);
          setUserBusinesses(userBusinessesData);
          
          if (userBusinessesData.length > 0) {
            setCurrentBusiness(userBusinessesData[0]);
            localStorage.setItem('pos_current_business', userBusinessesData[0].id);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCurrentBusiness(null);
          setUserBusinesses([]);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadUserBusinesses]);

  const login = async (email: string, password: string, businessId: string, rememberMe?: boolean) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success('Logged in successfully');
        
        const appUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          role: 'admin',
          status: 'active',
          lastLogin: new Date().toISOString()
        };
        
        const userBusinessesData = await loadUserBusinesses(data.user.id);
        
        setUser(appUser);
        setUserBusinesses(userBusinessesData);
        
        if (businessId) {
          const selectedBusiness = userBusinessesData.find(b => b.id === businessId);
          if (selectedBusiness) {
            setCurrentBusiness(selectedBusiness);
            localStorage.setItem('pos_current_business', selectedBusiness.id);
          } else if (userBusinessesData.length > 0) {
            setCurrentBusiness(userBusinessesData[0]);
            localStorage.setItem('pos_current_business', userBusinessesData[0].id);
          }
        } else if (userBusinessesData.length > 0) {
          setCurrentBusiness(userBusinessesData[0]);
          localStorage.setItem('pos_current_business', userBusinessesData[0].id);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again'
      });
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      toast.error('Error signing out');
    } else {
      setUser(null);
      setCurrentBusiness(null);
      setUserBusinesses([]);
      localStorage.removeItem('pos_current_business');
      localStorage.removeItem('pos_current_location');
      toast.success('Logged out successfully');
    }
  };

  const switchBusiness = (businessId: string) => {
    const newBusiness = userBusinesses.find(business => business.id === businessId);
    
    if (newBusiness) {
      setCurrentBusiness(newBusiness);
      localStorage.setItem('pos_current_business', businessId);
      toast.success(`Switched to ${newBusiness.name}`);
    } else {
      toast.error('Business not found');
    }
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    if (user.permissions) {
      return user.permissions.some(
        permission => permission.name === permissionName && permission.enabled
      );
    }
    
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
