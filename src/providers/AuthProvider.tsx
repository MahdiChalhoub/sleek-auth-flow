
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Business } from '@/models/interfaces/businessInterfaces';
import { UserStatus } from '@/types/auth';
import { usePermissions } from '@/hooks/usePermissions';

// Create a type for the context value
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  bypassAuth: boolean;
  currentBusiness: Business | null;
  userBusinesses: Business[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permissionName: string) => boolean;
  switchBusiness: (businessId: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  bypassAuth: false,
  currentBusiness: null,
  userBusinesses: [],
  login: async () => false,
  logout: async () => {},
  hasPermission: () => false,
  switchBusiness: async () => {}
});

// Mock business for bypass mode
const mockBusinesses: Business[] = [
  {
    id: 'mock-business-id',
    name: 'Mock Business',
    status: 'active',
    ownerId: 'bypass-user-id',
    description: 'A mock business for development',
    email: 'mock@example.com',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bypassAuth = true; // Enable bypass mode for debugging
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(mockBusinesses[0]);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>(mockBusinesses);
  
  useEffect(() => {
    console.log('🔐 AuthProvider initializing...');
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('🔐 Auth state changed:', event);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    // Initial session check
    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('🔐 Initial session:', initialSession);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error('🔐 Session check error:', error);
        toast.error('Failed to check authentication session');
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialSession();

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Mock login for bypass mode
  const login = async (email: string, password: string) => {
    if (bypassAuth) {
      console.log('🔐 Bypass login successful');
      return true;
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('🔐 Login error:', error);
        toast.error(error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('🔐 Unexpected login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  // Mock switchBusiness for bypass mode
  const switchBusiness = async (businessId: string) => {
    if (bypassAuth) {
      const business = mockBusinesses.find(b => b.id === businessId);
      if (business) {
        setCurrentBusiness(business);
        console.log('🔐 Switched to business:', business.name);
        return;
      }
    }
    
    // Actual implementation would go here
    console.log('🔐 Switching to business:', businessId);
  };

  // Logout method
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('🔐 Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Get permissions based on user role
  const { hasPermission } = usePermissions(user?.role || 'user');

  // Provide mock user and session in bypass mode
  const contextValue: AuthContextType = bypassAuth 
    ? {
        user: {
          id: 'bypass-user-id',
          email: 'admin@example.com',
          role: 'admin',
          fullName: 'Admin User',
          name: 'Admin User',
          avatarUrl: null,
          status: 'active' as UserStatus,
          isGlobalAdmin: true
        } as unknown as User,
        session: {} as Session,
        isLoading: false,
        bypassAuth,
        currentBusiness,
        userBusinesses,
        login,
        logout,
        hasPermission,
        switchBusiness
      }
    : { 
        user, 
        session, 
        isLoading, 
        bypassAuth, 
        currentBusiness,
        userBusinesses,
        login, 
        logout, 
        hasPermission,
        switchBusiness
      };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthProvider;
