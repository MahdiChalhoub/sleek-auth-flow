import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  isAdmin?: boolean; // Add isAdmin property
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
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
          role: profile?.role,
          isAdmin: profile?.role === 'admin',
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
        // After successful signup, update the user's profile
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

  const value = { user, loading, signIn, signUp, signOut, error };

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
