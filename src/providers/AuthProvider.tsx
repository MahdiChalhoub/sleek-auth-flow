import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
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
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const navigate = useNavigate();

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
        if (item && typeof item === 'object' && 'business' in item && item.business !== null) {
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
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
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
          setBusinesses([]);
          setCurrentBusiness(null);
          setIsLoading(false);
          return;
        }

        // Fetch businesses for the current user
        const response = await fromTable('businesses')
          .select('*')
          .eq('owner_id', user.id);

        if (!isDataResponse(response)) {
          console.error('Error fetching businesses:', response.error);
          setBusinesses([]);
          setCurrentBusiness(null);
          setIsLoading(false);
          return;
        }

        const fetchedBusinesses = response.data || [];
        setBusinesses(fetchedBusinesses);

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
  }, [user]);

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

      if (businessId) {
        localStorage.setItem('pos_current_business', businessId);
      }

      return;
    } catch (error) {
      console.error('Login error:', error);
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
      setBusinesses([]);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Switch business function
  const switchBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
      localStorage.setItem('pos_current_business', business.id);
      toast.success(`Switched to ${business.name}`);
    } else {
      toast.error('Business not found');
    }
  };

  const value = {
    user,
    session,
    isLoading,
    businesses,
    currentBusiness,
    login,
    logout,
    switchBusiness,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
