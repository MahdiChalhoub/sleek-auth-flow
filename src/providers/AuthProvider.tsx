import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';
import { Business } from '@/models/interfaces/businessInterfaces';
import { fromTable, isDataResponse, safeDataTransform } from '@/utils/supabaseServiceHelper';
import { mapAuthUserToUser } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  currentBusiness: Business | null;
  userBusinesses: Business[];
  login: (email: string, password: string, businessId?: string, rememberMe?: boolean) => Promise<void>;
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
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const navigate = useNavigate();

  const loadUserBusinesses = useCallback(async (userId: string): Promise<Business[]> => {
    try {
      const ownedResponse = await fromTable('businesses')
        .select('*')
        .eq('owner_id', userId);
      
      if (!isDataResponse(ownedResponse)) {
        console.error('Error fetching owned businesses:', ownedResponse.error);
        return [];
      }
      
      const businesses: Business[] = [];
      
      if (Array.isArray(ownedResponse.data)) {
        for (const itemData of ownedResponse.data) {
          if (!itemData || typeof itemData !== 'object') continue;
          
          const typedItemData = itemData as Record<string, unknown>;
          
          if (!('id' in typedItemData) || 
              !('name' in typedItemData) || 
              !('status' in typedItemData) || 
              !('owner_id' in typedItemData)) {
            continue;
          }
          
          const business: Business = {
            id: String(typedItemData.id || 'unknown'),
            name: String(typedItemData.name || 'Unknown Business'),
            status: String(typedItemData.status || 'inactive'),
            ownerId: String(typedItemData.owner_id || userId),
          };
          
          if ('address' in typedItemData && typedItemData.address !== null) {
            business.address = String(typedItemData.address);
          }
          
          if ('phone' in typedItemData && typedItemData.phone !== null) {
            business.phone = String(typedItemData.phone);
          }
          
          if ('email' in typedItemData && typedItemData.email !== null) {
            business.email = String(typedItemData.email);
          }
          
          if ('created_at' in typedItemData && typedItemData.created_at !== null) {
            business.createdAt = String(typedItemData.created_at);
          }
          
          if ('updated_at' in typedItemData && typedItemData.updated_at !== null) {
            business.updatedAt = String(typedItemData.updated_at);
          }
          
          if ('logo_url' in typedItemData && typedItemData.logo_url !== null) {
            business.logoUrl = String(typedItemData.logo_url);
          }
          
          if ('description' in typedItemData && typedItemData.description !== null) {
            business.description = String(typedItemData.description);
          }
          
          if ('type' in typedItemData && typedItemData.type !== null) {
            business.type = String(typedItemData.type);
          }
          
          if ('country' in typedItemData && typedItemData.country !== null) {
            business.country = String(typedItemData.country);
          }
          
          if ('currency' in typedItemData && typedItemData.currency !== null) {
            business.currency = String(typedItemData.currency);
          }
          
          if ('active' in typedItemData) {
            business.active = Boolean(typedItemData.active);
          }
          
          if ('timezone' in typedItemData && typedItemData.timezone !== null) {
            business.timezone = String(typedItemData.timezone);
          }
          
          businesses.push(business);
        }
      }
      
      return businesses;
    } catch (error) {
      console.error('Error loading user businesses:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          const appUser = mapAuthUserToUser(session.user, { 
            role: 'cashier', 
            status: 'active' 
          });
          setUser(appUser);
        } else {
          setUser(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const appUser = mapAuthUserToUser(session.user, { 
          role: 'cashier', 
          status: 'active' 
        });
        setUser(appUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getBusinesses = async () => {
      try {
        if (!user) {
          setUserBusinesses([]);
          setCurrentBusiness(null);
          setIsLoading(false);
          return;
        }

        const fetchedBusinesses = await loadUserBusinesses(user.id);
        setUserBusinesses(fetchedBusinesses);

        const savedBusinessId = localStorage.getItem('pos_current_business');
        let selectedBusiness = null;

        if (savedBusinessId && fetchedBusinesses.length > 0) {
          selectedBusiness = fetchedBusinesses.find(b => b.id === savedBusinessId) || fetchedBusinesses[0];
        } else if (fetchedBusinesses.length > 0) {
          selectedBusiness = fetchedBusinesses[0];
        }

        setCurrentBusiness(selectedBusiness);
        if (selectedBusiness) {
          localStorage.setItem('pos_current_business', selectedBusiness.id);
        }
      } catch (error) {
        console.error('Error in getBusinesses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getBusinesses();
  }, [user, loadUserBusinesses]);

  const login = async (email: string, password: string, businessId?: string, rememberMe = true) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Login successful but no user returned');
      }

      if (businessId) {
        const businessResponse = await fromTable('businesses')
          .select('*')
          .eq('id', businessId)
          .eq('owner_id', data.user.id)
          .maybeSingle();
          
        if (!isDataResponse(businessResponse) || !businessResponse.data) {
          throw new Error('Selected business not found or doesn\'t belong to you');
        }
        
        localStorage.setItem('pos_current_business', businessId);
      } else {
        throw new Error('Please select a business to continue');
      }

      toast.success('Login successful');
      
      navigate('/dashboard');
      
      return;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setCurrentBusiness(null);
      setUserBusinesses([]);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const switchBusiness = (businessId: string) => {
    const business = userBusinesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
      localStorage.setItem('pos_current_business', business.id);
      toast.success(`Switched to ${business.name}`);
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

  const value = {
    user,
    isLoading,
    currentBusiness,
    userBusinesses,
    login,
    logout,
    switchBusiness,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
