import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  avatarUrl?: string;
  role?: string;
  isAdmin?: boolean;
  isGlobalAdmin?: boolean;
  permissions?: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string, businessId: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  error: string | null;
  currentBusiness: any;
  userBusinesses: any[];
  switchBusiness: (businessId: string) => void;
  hasPermission: (permissionName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = supabase.auth.getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError(profileError.message);
          setLoading(false);
          return;
        }

        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.name,
          avatar: profile?.avatar_url,
          avatarUrl: profile?.avatar_url,
          role: profile?.role,
          isAdmin: profile?.role === 'admin',
          isGlobalAdmin: profile?.role === 'global_admin',
          permissions: profile?.permissions,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        if (data.user?.id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id, name }]);

          if (profileError) {
            setError(profileError.message);
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
      }
      setUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, businessId: string, rememberMe?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabase.auth.user()?.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError(profileError.message);
          setLoading(false);
          return;
        }

        setUser({
          id: supabase.auth.user()?.id,
          email: supabase.auth.user()?.email || '',
          name: profile?.name,
          avatar: profile?.avatar_url,
          avatarUrl: profile?.avatar_url,
          role: profile?.role,
          isAdmin: profile?.role === 'admin',
          isGlobalAdmin: profile?.role === 'global_admin',
          permissions: profile?.permissions,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!user || !user.permissions) return false;
    
    if (user.isAdmin) return true;
    
    return user.permissions.some(p => 
      typeof p === 'string' 
        ? p === permissionName
        : p.name === permissionName && p.enabled
    );
  };

  const value = { 
    user, 
    loading, 
    isLoading: loading,
    signIn, 
    signUp, 
    signOut, 
    error,
    login,
    logout,
    currentBusiness: null,
    userBusinesses: [],
    switchBusiness: () => {},
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
