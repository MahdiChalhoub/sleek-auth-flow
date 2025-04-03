import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { User, UserRole, UserStatus, UserPermission } from '@/types/auth';
import { Business } from '@/models/interfaces/businessInterfaces';
import { fromTable, isDataResponse, safeDataTransform } from '@/utils/supabaseServiceHelper';
import { mapAuthUserToUser } from '@/utils/authUtils';
import { getMockPermissions } from '@/hooks/usePermissions';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  currentBusiness: Business | null;
  userBusinesses: Business[];
  login: (email: string, password: string, businessId?: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  switchBusiness: (businessId: string) => void;
  hasPermission: (permissionName: string) => boolean;
  bypassAuth: boolean; // Added bypass flag
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  currentBusiness: null,
  userBusinesses: [],
  login: async () => {},
  logout: () => {},
  switchBusiness: () => {},
  hasPermission: () => false,
  bypassAuth: true // Default to bypass authentication
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changed to false to prevent loading screen
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [bypassAuth, setBypassAuth] = useState(true); // Set to true to bypass authentication
  const navigate = useNavigate();

  // Setup auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, !!session);
        setSession(session);
        
        if (session?.user) {
          try {
            const appUser = mapAuthUserToUser(session.user, { 
              role: 'admin', // Default to admin role for maximum access
              status: 'active' 
            });
            
            // Add mock permissions based on role for development
            appUser.permissions = getMockPermissions('admin'); // Always give admin permissions
            
            setUser(appUser);
          } catch (error) {
            console.error('Error mapping auth user:', error);
            createMockAdminUser(); // Create mock admin user on error
          }
        } else {
          createMockAdminUser(); // Create mock admin user when not logged in
        }
      }
    );

    // Initial session check
    const checkSession = async () => {
      try {
        console.log('Checking initial session');
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('Initial session:', !!session);
        setSession(session);
        
        if (session?.user) {
          const appUser = mapAuthUserToUser(session.user, { 
            role: 'admin', 
            status: 'active' 
          });
          
          // Add mock permissions based on role for development
          appUser.permissions = getMockPermissions('admin');
          
          setUser(appUser);
        } else {
          createMockAdminUser(); // Create mock admin user when not logged in
        }
      } catch (error) {
        console.error('Error checking session:', error);
        createMockAdminUser(); // Create mock admin user on error
      } finally {
        setIsLoading(false);
      }
    };

    // Create a mock admin user for direct access
    const createMockAdminUser = () => {
      const mockUser: User = {
        id: 'mock-admin-id',
        email: 'mock-admin@example.com',
        fullName: 'Admin User',
        name: 'Admin User',
        role: 'admin',
        status: 'active',
        isGlobalAdmin: true,
        permissions: getMockPermissions('admin'),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      setUser(mockUser);
      
      // Also create a mock business
      const mockBusiness: Business = {
        id: 'mock-business-id',
        name: 'Mock Business',
        ownerId: mockUser.id,
        status: 'active',
        type: 'Retail',
        currency: 'USD',
        active: true,
        description: 'Automatically created mock business'
      };
      setUserBusinesses([mockBusiness]);
      setCurrentBusiness(mockBusiness);
      localStorage.setItem('pos_current_business', mockBusiness.id);
    };

    checkSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Load businesses when user changes
  useEffect(() => {
    const getBusinesses = async () => {
      try {
        if (!user) {
          return;
        }

        console.log('Loading businesses for user:', user.id);
        
        const fetchedBusinesses = await loadUserBusinesses(user.id);
        console.log('Fetched businesses:', fetchedBusinesses.length);
        
        if (fetchedBusinesses.length > 0) {
          setUserBusinesses(fetchedBusinesses);

          const savedBusinessId = localStorage.getItem('pos_current_business');
          let selectedBusiness = null;

          if (savedBusinessId && fetchedBusinesses.length > 0) {
            selectedBusiness = fetchedBusinesses.find(b => b.id === savedBusinessId) || fetchedBusinesses[0];
          } else if (fetchedBusinesses.length > 0) {
            selectedBusiness = fetchedBusinesses[0];
          }

          if (selectedBusiness) {
            console.log('Setting current business:', selectedBusiness.name);
            setCurrentBusiness(selectedBusiness);
            localStorage.setItem('pos_current_business', selectedBusiness.id);
          }
        }
      } catch (error) {
        console.error('Error in getBusinesses:', error);
      }
    };

    getBusinesses();
  }, [user]);

  // Load user's businesses
  const loadUserBusinesses = useCallback(async (userId: string): Promise<Business[]> => {
    // Mock businesses for direct access
    if (bypassAuth) {
      return [
        {
          id: 'mock-business-1',
          name: 'Demo Retail Store',
          status: 'active',
          ownerId: userId,
          type: 'Retail',
          currency: 'USD',
          active: true,
          description: 'Demo retail business with full access',
          logoUrl: 'https://placehold.co/100x100?text=Demo'
        },
        {
          id: 'mock-business-2',
          name: 'Demo Restaurant',
          status: 'active',
          ownerId: userId,
          type: 'Restaurant',
          currency: 'USD',
          active: true,
          description: 'Demo restaurant business with full access',
          logoUrl: 'https://placehold.co/100x100?text=Rest'
        }
      ];
    }
    
    // This will only run if bypassAuth is false
    try {
      // Fetch businesses where user is the owner
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
          if (!itemData) continue;
          const typedItemData = itemData as Record<string, unknown>;
          
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
  }, [bypassAuth]);

  const login = async (email: string, password: string, businessId?: string, rememberMe = true) => {
    try {
      console.log('Attempting login for:', email);
      setIsLoading(true);
      
      if (bypassAuth) {
        // Skip actual login in bypass mode
        toast.success('Direct access enabled - No login required');
        return;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Login successful but no user returned');
      }

      console.log('Login successful:', data.user.id);
      
      if (businessId) {
        localStorage.setItem('pos_current_business', businessId);
      }
      
      toast.success('Login successful');
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out');
      setIsLoading(true);
      
      if (bypassAuth) {
        // In bypass mode, just notify user and don't actually logout
        toast.info('Logout ignored - Direct access mode enabled');
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setCurrentBusiness(null);
      setUserBusinesses([]);
      localStorage.removeItem('pos_current_business');
      
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  const switchBusiness = (businessId: string) => {
    const business = userBusinesses.find(b => b.id === businessId);
    if (business) {
      console.log('Switching to business:', business.name);
      setCurrentBusiness(business);
      localStorage.setItem('pos_current_business', business.id);
      toast.success(`Switched to ${business.name}`);
    } else {
      toast.error('Business not found');
    }
  };

  const hasPermission = (permissionName: string): boolean => {
    // Always return true in bypass mode
    if (bypassAuth) return true;
    
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
    hasPermission,
    bypassAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
