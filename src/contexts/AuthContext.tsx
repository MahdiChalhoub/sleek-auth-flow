import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { User, Role } from '@/models/interfaces/userInterfaces';
import { Business } from '@/models/interfaces/businessInterfaces';
import { fromTable, isDataResponse, safeDataTransform } from '@/utils/supabaseServiceHelper';

interface AuthContextType {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  currentBusiness: Business | null;
  userBusinesses: Business[];
  role: Role | null;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchBusiness: (businessId: string) => Promise<void>;
  refreshUserBusinesses: () => Promise<void>;
  updateUser: (updates: { fullName?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);

        if (session) {
          await fetchUserDetails(session.user);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        fetchUserDetails(session.user);
      } else {
        setUser(null);
        setCurrentBusiness(null);
        setUserBusinesses([]);
        setRole(null);
      }
    });

    loadSession();
  }, []);

  const fetchUserDetails = async (supabaseUser: SupabaseUser) => {
    setIsLoading(true);
    try {
      // Fetch user details from the 'users' table
      const { data: userDetails, error: userError } = await fromTable('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (userError) {
        throw new Error(`Error fetching user details: ${userError.message}`);
      }

      if (!userDetails) {
        console.warn('User details not found in the users table, attempting to create...');
        // Attempt to create a user profile if it doesn't exist
        const { data: newUserDetails, error: newUserError } = await fromTable('users')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            fullName: supabaseUser.email?.split('@')[0] || 'New User',
            avatar_url: supabaseUser.user_metadata.avatar_url || null,
            role: 'user' // Default role
          })
          .select('*')
          .single();

        if (newUserError) {
          throw new Error(`Error creating user profile: ${newUserError.message}`);
        }

        if (newUserDetails) {
          console.log('Successfully created user profile:', newUserDetails);
          setUser({
            id: newUserDetails.id,
            email: newUserDetails.email || '',
            fullName: newUserDetails.fullName || '',
            avatar_url: newUserDetails.avatar_url || null,
            role: newUserDetails.role || 'user',
            isGlobalAdmin: newUserDetails.isGlobalAdmin || false,
            createdAt: newUserDetails.createdAt || '',
            updatedAt: newUserDetails.updatedAt || ''
          });
        }
      } else {
        // If user details are found, update the state
        setUser({
          id: userDetails.id,
          email: userDetails.email || '',
          fullName: userDetails.fullName || '',
          avatar_url: userDetails.avatar_url || null,
          role: userDetails.role || 'user',
          isGlobalAdmin: userDetails.isGlobalAdmin || false,
          createdAt: userDetails.createdAt || '',
          updatedAt: userDetails.updatedAt || ''
        });
      }

      // Fetch the user's role
      const { data: roleData, error: roleError } = await fromTable('roles')
        .select('*')
        .eq('name', userDetails?.role || 'user')
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        setRole({ name: 'user', permissions: [] }); // Default role
      } else {
        setRole({
          name: roleData?.name || 'user',
          permissions: roleData?.permissions || []
        });
      }

      // Fetch user's businesses
      await fetchUserBusinesses(supabaseUser.id);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserBusinesses = async (userId: string) => {
    setIsLoading(true);
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
        console.error('Error fetching businesses:',
          ownedResponse.error?.message || memberResponse.error?.message);
        return;
      }

      // Combine and deduplicate businesses
      const memberBusinessesData = safeDataTransform(memberResponse.data, item => {
        if (item && typeof item === 'object' && 'business' in item && item.business !== null) {
          return item.business;
        }
        return null;
      }).filter(Boolean);

      const allBusinesses = [...(ownedResponse.data || []), ...memberBusinessesData];

      // Remove duplicates based on business ID
      const uniqueBusinessMap = new Map<string, any>();
      allBusinesses.forEach(business => {
        if (business && business.id) {
          uniqueBusinessMap.set(business.id, business);
        }
      });

      const uniqueBusinesses = Array.from(uniqueBusinessMap.values());

      // Map to our Business interface
      const mappedBusinesses: Business[] = uniqueBusinesses.map(business => ({
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

      setUserBusinesses(mappedBusinesses);

      // Load the current business from local storage
      const storedBusinessId = localStorage.getItem('currentBusinessId');
      if (storedBusinessId) {
        const storedBusiness = mappedBusinesses.find(b => b.id === storedBusinessId);
        if (storedBusiness) {
          setCurrentBusiness(storedBusiness);
        } else {
          // If the stored business is not found, default to the first business
          setCurrentBusiness(mappedBusinesses[0] || null);
        }
      } else {
        // If no business in local storage, default to the first business
        setCurrentBusiness(mappedBusinesses[0] || null);
      }
    } catch (error) {
      console.error('Error fetching user businesses:', error);
      toast.error('Failed to load businesses.');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            fullName: fullName,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Signup successful! Check your email to verify your account.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = password
        ? await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        })
        : await supabase.auth.signInWithOtp({ email });

      if (error) {
        throw new Error(error.message);
      }

      if (!password) {
        toast.success('Check your email for the sign-in link.');
      }
      // The auth state change listener in useEffect will handle the session update and navigation
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }

      // Clear currentBusinessId from local storage
      localStorage.removeItem('currentBusinessId');
      setCurrentBusiness(null);
      setUserBusinesses([]);
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchBusiness = async (businessId: string) => {
    setIsLoading(true);
    try {
      const businessToSwitchTo = userBusinesses.find(b => b.id === businessId);
      if (businessToSwitchTo) {
        setCurrentBusiness(businessToSwitchTo);
        // Store the currentBusinessId in local storage
        localStorage.setItem('currentBusinessId', businessId);
        toast.success(`Switched to business: ${businessToSwitchTo.name}`);
      } else {
        throw new Error('Business not found');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserBusinesses = useCallback(async () => {
    if (user?.id) {
      await fetchUserBusinesses(user.id);
    }
  }, [user?.id]);

  const updateUser = async (updates: { fullName?: string; avatar_url?: string }) => {
    setIsLoading(true);
    try {
      const { data: updatedUser, error } = await fromTable('users')
        .update(updates)
        .eq('id', user?.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (updatedUser) {
        setUser(prevUser => ({
          ...prevUser!,
          fullName: updatedUser.fullName || prevUser!.fullName,
          avatar_url: updatedUser.avatar_url || prevUser!.avatar_url,
        }));
        toast.success('User profile updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    currentBusiness,
    userBusinesses,
    role,
    signUp,
    signIn,
    logout,
    switchBusiness,
    refreshUserBusinesses,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
