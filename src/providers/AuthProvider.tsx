
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Create a type for the context value
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  bypassAuth: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permissionName: string) => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  bypassAuth: false,
  login: async () => false,
  logout: async () => {},
  hasPermission: () => false
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bypassAuth = true; // Enable bypass mode for debugging

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

  // Logout method
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('🔐 Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Simplified permission check for bypass mode
  const hasPermission = (permissionName: string) => {
    if (bypassAuth) return true;
    // Implement actual permission logic here
    return false;
  };

  // Provide mock user and session in bypass mode
  const contextValue: AuthContextType = bypassAuth 
    ? {
        user: {
          id: 'bypass-user-id',
          email: 'admin@example.com',
          role: 'admin'
        } as User,
        session: {} as Session,
        isLoading: false,
        bypassAuth,
        login,
        logout,
        hasPermission
      }
    : { 
        user, 
        session, 
        isLoading, 
        bypassAuth, 
        login, 
        logout, 
        hasPermission 
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
