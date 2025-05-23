import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { User, UserRole, UserPermission, Role } from '@/types/auth'; 
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
  hasPermission: (permission: string) => boolean;
  bypassAuth?: boolean; // Added bypass flag
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
  const [bypassAuth] = useState<boolean>(false);

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

  const fetchUserBusinesses = async (userId: string) => {
    try {
      console.log('Fetching businesses for user:', userId);
      
      const { data: businessData, error: businessError } = await fromTable('businesses')
        .select('*')
        .eq('owner_id', userId);
      
      if (businessError) {
        console.error('Error fetching user businesses:', businessError);
        return;
      }
      
      if (businessData && Array.isArray(businessData)) {
        console.log('Found businesses:', businessData.length);
        
        const mappedBusinesses: Business[] = businessData.map((business: any) => ({
          id: business.id,
          name: business.name,
          description: business.description || '',
          email: business.email || '',
          status: business.status || 'active',
          ownerId: business.owner_id,
          logoUrl: business.logo_url,
          active: business.active !== undefined ? business.active : true,
          createdAt: business.created_at,
          updatedAt: business.updated_at,
          address: business.address || '',
          phone: business.phone || '',
          country: business.country,
          currency: business.currency,
          type: business.type,
          timezone: business.timezone || ''
        }));
        
        setUserBusinesses(mappedBusinesses);
        
        if (!currentBusiness && mappedBusinesses.length > 0) {
          const storedBusinessId = localStorage.getItem('currentBusinessId');
          const businessToActivate = storedBusinessId
            ? mappedBusinesses.find(b => b.id === storedBusinessId) 
            : mappedBusinesses[0];
            
          if (businessToActivate) {
            setCurrentBusiness(businessToActivate);
            localStorage.setItem('currentBusinessId', businessToActivate.id);
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchUserBusinesses:', error);
    }
  };

  const fetchUserDetails = async (supabaseUser: SupabaseUser) => {
    setIsLoading(true);
    try {
      const { data: userDetails, error: userError } = await fromTable('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (userError) {
        throw new Error(`Error fetching user details: ${userError.message}`);
      }

      if (!userDetails) {
        console.warn('User details not found in the users table, attempting to create...');
        const { data: newUserDetails, error: newUserError } = await fromTable('users')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            fullName: supabaseUser.email?.split('@')[0] || 'New User',
            avatar_url: supabaseUser.user_metadata.avatar_url || null,
            role: 'user'
          })
          .select('*')
          .single();

        if (newUserError) {
          throw new Error(`Error creating user profile: ${newUserError.message}`);
        }

        if (newUserDetails) {
          console.log('Successfully created user profile:', newUserDetails);
          const typedUserDetails = newUserDetails as any;
          setUser({
            id: typedUserDetails.id,
            email: typedUserDetails.email || '',
            fullName: typedUserDetails.fullName || '',
            avatar_url: typedUserDetails.avatar_url || null,
            role: typedUserDetails.role || 'user',
            isGlobalAdmin: typedUserDetails.isGlobalAdmin || false,
            createdAt: typedUserDetails.createdAt || '',
            updatedAt: typedUserDetails.updatedAt || ''
          });
        }
      } else {
        const typedUserDetails = userDetails as any;
        setUser({
          id: typedUserDetails.id,
          email: typedUserDetails.email || '',
          fullName: typedUserDetails.fullName || '',
          avatar_url: typedUserDetails.avatar_url || null,
          role: typedUserDetails.role || 'user',
          isGlobalAdmin: typedUserDetails.isGlobalAdmin || false,
          createdAt: typedUserDetails.createdAt || '',
          updatedAt: typedUserDetails.updatedAt || ''
        });
      }

      const { data: roleData, error: roleError } = await fromTable('roles')
        .select('*')
        .eq('name', (userDetails as any)?.role || 'user')
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        setRole({ 
          id: 'default',
          name: 'user', 
          permissions: [] 
        });
      } else {
        const typedRoleData = roleData as any;
        setRole({
          id: typedRoleData?.id || 'default',
          name: typedRoleData?.name || 'user',
          permissions: typedRoleData?.permissions || []
        });
      }

      await fetchUserBusinesses(supabaseUser.id);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details.');
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
        const typedUpdatedUser = updatedUser as any;
        setUser(prevUser => ({
          ...prevUser!,
          fullName: typedUpdatedUser.fullName || prevUser!.fullName,
          avatar_url: typedUpdatedUser.avatar_url || prevUser!.avatar_url,
        }));
        toast.success('User profile updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false;
    
    if (user.role === 'admin' || user.isGlobalAdmin) return true;
    
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
    hasPermission,
    bypassAuth
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
