
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Business } from '@/models/interfaces/businessInterfaces';
import { toast } from 'sonner';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';

// Define the authentication context type
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  businesses: Business[];
  currentBusiness: Business | null;
  login: (email: string, password: string, businessId?: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  switchBusiness: (businessId: string) => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const navigate = useNavigate();

  // Initialize authentication
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
