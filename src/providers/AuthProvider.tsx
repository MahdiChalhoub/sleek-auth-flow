import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, UserRole, UserStatus } from "@/types/auth";
import { useBusinessSelection } from "@/hooks/useBusinessSelection";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Business } from "@/models/interfaces/businessInterfaces";
import { fromTable } from "@/utils/supabaseServiceHelper";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          try {
            const { data: extendedUser, error: extendedError } = await supabase
              .from('extended_users')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
            
            if (extendedError) throw extendedError;
            
            if (extendedUser.status === 'pending') {
              setUser({
                id: newSession.user.id,
                email: newSession.user.email || '',
                status: 'pending' as UserStatus,
                role: 'cashier'
              });
              return;
            }
            
            if (extendedUser.status === 'denied' || extendedUser.status === 'inactive') {
              await supabase.auth.signOut();
              toast.error(`Account ${extendedUser.status}. Please contact an administrator.`);
              setUser(null);
              return;
            }
            
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              throw profileError;
            }
            
            const { data: userRole, error: roleError } = await supabase
              .from('user_roles')
              .select('*, role:roles(*)')
              .eq('user_id', newSession.user.id)
              .single();
            
            const role: UserRole = userRole?.role?.name === 'admin' 
              ? 'admin' 
              : userRole?.role?.name === 'manager'
                ? 'manager'
                : 'cashier';
            
            const { data: rolePermissions, error: permissionsError } = await supabase
              .from('role_permissions')
              .select('*, permission:permissions(*)')
              .eq('role_id', userRole?.role_id);
            
            const permissions = rolePermissions?.map(rp => ({
              id: rp.permission_id,
              name: rp.permission.name,
              description: rp.permission.description,
              category: rp.permission.category,
              enabled: rp.enabled
            }));
            
            await supabase
              .from('extended_users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', newSession.user.id);
            
            const appUser: User = {
              id: newSession.user.id,
              email: newSession.user.email || '',
              fullName: profile?.full_name || newSession.user.email?.split('@')[0] || 'User',
              status: extendedUser.status as UserStatus,
              role,
              avatarUrl: profile?.avatar_url || `https://avatar.vercel.sh/${newSession.user.email}`,
              permissions,
              lastLogin: new Date().toISOString(),
              createdAt: newSession.user.created_at
            };
            
            setUser(appUser);
            
            fetchUserBusinesses(appUser.id);
            
          } catch (error) {
            console.error("Error fetching user details:", error);
            
            setUser({
              id: newSession.user.id,
              email: newSession.user.email || '',
              status: 'active' as UserStatus,
              role: 'cashier',
              lastLogin: new Date().toISOString()
            });
          }
        } else {
          setUser(null);
          setUserBusinesses([]);
          setCurrentBusiness(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserBusinesses = async (userId: string) => {
    try {
      const { data: ownedBusinesses, error: ownedError } = await fromTable('businesses')
        .select('*')
        .eq('owner_id', userId);
      
      if (ownedError) throw ownedError;
      
      const { data: memberBusinesses, error: memberError } = await fromTable('business_users')
        .select('business:businesses(*)')
        .eq('user_id', userId)
        .eq('is_active', true);
      
      if (memberError) throw memberError;
      
      const memberBusinessesData = memberBusinesses
        .map(item => (item as any).business)
        .filter(Boolean);
      
      const allBusinesses = [...(ownedBusinesses || []), ...memberBusinessesData];
      
      const uniqueBusinesses = allBusinesses.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [] as any[]);
      
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
      
      const businessId = localStorage.getItem("pos_current_business");
      if (businessId) {
        const savedBusiness = mappedBusinesses.find(b => b.id === businessId);
        if (savedBusiness) {
          setCurrentBusiness(savedBusiness);
        } else if (mappedBusinesses.length > 0) {
          setCurrentBusiness(mappedBusinesses[0]);
          localStorage.setItem("pos_current_business", mappedBusinesses[0].id);
        }
      } else if (mappedBusinesses.length > 0) {
        setCurrentBusiness(mappedBusinesses[0]);
        localStorage.setItem("pos_current_business", mappedBusinesses[0].id);
      }
      
      return mappedBusinesses;
    } catch (error) {
      console.error("Error fetching user businesses:", error);
      toast.error("Failed to load businesses");
      return [];
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      if (user.status === 'pending') {
        navigate('/waiting-approval');
        return;
      }
      
      if (userBusinesses.length === 0 && !location.pathname.includes('/business-selection') && !location.pathname.includes('/login')) {
        navigate('/business-selection');
        return;
      }
      
      if (location.pathname === "/login") {
        const redirectPath = localStorage.getItem("intended_redirect") || 
          (user.role === 'admin' ? '/home' : user.role === 'manager' ? '/inventory' : '/pos-sales');
        localStorage.removeItem("intended_redirect");
        
        navigate(redirectPath);
      }
    }
  }, [user, isLoading, navigate, location.pathname, userBusinesses.length]);

  const login = async (email: string, password: string, businessId: string, rememberMe: boolean = true): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (!businessId || businessId.trim() === "") {
        throw new Error("Please select a business to continue");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.user) {
        throw new Error("Login failed. No user data found.");
      }
      
      const { data: extendedUser, error: extendedError } = await supabase
        .from('extended_users')
        .select('status')
        .eq('id', data.user.id)
        .single();
      
      if (extendedError) {
        if (extendedError.code === 'PGRST116') {
          await supabase
            .from('extended_users')
            .insert({ id: data.user.id, status: 'active' });
        } else {
          throw extendedError;
        }
      } else if (extendedUser.status === 'pending') {
        navigate('/waiting-approval');
        toast.info("Your account is pending approval");
        return;
      } else if (extendedUser.status === 'denied' || extendedUser.status === 'inactive') {
        await supabase.auth.signOut();
        throw new Error(`Your account has been ${extendedUser.status}. Please contact an administrator.`);
      }
      
      localStorage.setItem("pos_current_business", businessId);
      
      toast.success(`Welcome back!`, {
        description: "You have successfully logged in"
      });
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed", { 
        description: error instanceof Error ? error.message : "Authentication failed. Please check your credentials."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("pos_current_business");
      localStorage.removeItem("pos_current_location");
      navigate("/login");
      toast.info("You have been logged out");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed", {
        description: "There was an issue with logging out. Please try again."
      });
    }
  };

  const switchBusiness = (businessId: string) => {
    const business = userBusinesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
      localStorage.setItem("pos_current_business", business.id);
      localStorage.removeItem("pos_current_location");
      toast.success(`Switched to ${business.name}`, {
        description: "All data will now reflect this business."
      });
    } else {
      toast.error("Business not found", {
        description: "The selected business is not available."
      });
    }
  };

  const hasPermission = (permissionName: string): boolean => {
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      currentBusiness, 
      userBusinesses,
      switchBusiness,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
