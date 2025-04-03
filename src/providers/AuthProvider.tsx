
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
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const navigate = useNavigate();

  // Load user's businesses
  const loadUserBusinesses = useCallback(async (userId: string): Promise<Business[]> => {
    try {
      // Fetch businesses where user is the owner
      const ownedResponse = await fromTable('businesses')
        .select('*')
        .eq('owner_id', userId);
      
      if (!isDataResponse(ownedResponse)) {
        console.error('Error fetching owned businesses:', ownedResponse.error);
        return [];
      }
      
      // Safely transform the data to our Business interface
      const businesses: Business[] = [];
      
      // Only process the data if it exists and is an array
      if (Array.isArray(ownedResponse.data)) {
        for (const item of ownedResponse.data) {
          // Type checking to ensure we have a valid business object
          if (item && typeof item === 'object') {
            const business: Business = {
              id: item.id ? String(item.id) : 'unknown',
              name: item.name ? String(item.name) : 'Unknown Business',
              status: item.status ? String(item.status) : 'inactive',
              ownerId: item.owner_id ? String(item.owner_id) : userId,
              // Optional properties
              address: item.address ? String(item.address) : undefined,
              phone: item.phone ? String(item.phone) : undefined,
              email: item.email ? String(item.email) : undefined,
              createdAt: item.created_at ? String(item.created_at) : undefined,
              updatedAt: item.updated_at ? String(item.updated_at) : undefined,
              logoUrl: item.logo_url ? String(item.logo_url) : undefined,
              description: item.description ? String(item.description) : undefined,
              type: item.type ? String(item.type) : undefined,
              country: item.country ? String(item.country) : undefined,
              currency: item.currency ? String(item.currency) : undefined,
              active: item.active !== undefined ? Boolean(item.active) : undefined,
              timezone: item.timezone ? String(item.timezone) : undefined
            };
            businesses.push(business);
          }
        }
      }
      
      return businesses;
    } catch (error) {
      console.error('Error loading user businesses:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener first
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

    // Then check for existing session
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

  // Load businesses when user changes
  useEffect(() => {
    const getBusinesses = async () => {
      try {
        if (!user) {
          setUserBusinesses([]);
          setCurrentBusiness(null);
          setIsLoading(false);
          return;
        }

        // Fetch businesses for the current user
        const fetchedBusinesses = await loadUserBusinesses(user.id);
        setUserBusinesses(fetchedBusinesses);

        // Load the previously selected business or default to the first one
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

  // Login function
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

      // Verify that the selected business belongs to the user
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

      // Toast for successful login
      toast.success('Login successful');
      
      // Navigate to dashboard after login
      navigate('/dashboard');
      
      return;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  };

  // Logout function
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

  // Switch business function
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

  // Check if user has a specific permission
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
