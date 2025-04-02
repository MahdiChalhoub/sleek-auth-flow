
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, UserRole, UserStatus } from "@/types/auth";
import { useBusinessSelection } from "@/hooks/useBusinessSelection";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    currentBusiness,
    userBusinesses,
    initializeBusinessSelection,
    switchBusiness
  } = useBusinessSelection(user);

  // Set up Supabase auth state listener
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          try {
            // Get user's extended details and role
            const { data: extendedUser, error: extendedError } = await supabase
              .from('extended_users')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
            
            if (extendedError) throw extendedError;
            
            // Check if user is pending or denied
            if (extendedUser.status === 'pending') {
              setUser({
                id: newSession.user.id,
                email: newSession.user.email || '',
                status: 'pending' as UserStatus,
                role: 'cashier' // Default role
              });
              return;
            }
            
            if (extendedUser.status === 'denied' || extendedUser.status === 'inactive') {
              await supabase.auth.signOut();
              toast.error(`Account ${extendedUser.status}. Please contact an administrator.`);
              setUser(null);
              return;
            }
            
            // Get user's profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              throw profileError;
            }
            
            // Get user's role
            const { data: userRole, error: roleError } = await supabase
              .from('user_roles')
              .select('*, role:roles(*)')
              .eq('user_id', newSession.user.id)
              .single();
            
            // Default to cashier if no role found
            const role: UserRole = userRole?.role?.name === 'admin' 
              ? 'admin' 
              : userRole?.role?.name === 'manager'
                ? 'manager'
                : 'cashier';
            
            // Get user's permissions
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
            
            // Mark last login
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
            
            // Store the selected business ID
            const businessId = localStorage.getItem("pos_current_business");
            if (businessId) {
              // Initialize business selection
              setTimeout(() => {
                initializeBusinessSelection(appUser, businessId);
              }, 0);
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
            
            // Fallback to basic user info
            setUser({
              id: newSession.user.id,
              email: newSession.user.email || '',
              status: 'active' as UserStatus,
              role: 'cashier', // Default role
              lastLogin: new Date().toISOString()
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      // The onAuthStateChange handler will set the user
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeBusinessSelection]);

  // Only redirect on initial login, not on every render
  useEffect(() => {
    if (!isLoading && user) {
      // If user is pending, redirect to waiting page
      if (user.status === 'pending') {
        navigate('/waiting-approval');
        return;
      }
      
      // If location is login and user is active, redirect to appropriate page
      if (location.pathname === "/login") {
        // Get the intended redirect path from localStorage or use default based on role
        const redirectPath = localStorage.getItem("intended_redirect") || 
          (user.role === 'admin' ? '/home' : user.role === 'manager' ? '/inventory' : '/pos-sales');
        localStorage.removeItem("intended_redirect"); // Clear the stored path
        
        navigate(redirectPath);
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  const login = async (email: string, password: string, businessId: string, rememberMe: boolean = true): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (!businessId || businessId.trim() === "") {
        throw new Error("Please select a business to continue");
      }

      // Authenticate with Supabase
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
      
      // Check if user is pending or denied
      const { data: extendedUser, error: extendedError } = await supabase
        .from('extended_users')
        .select('status')
        .eq('id', data.user.id)
        .single();
      
      if (extendedError) {
        if (extendedError.code === 'PGRST116') {
          // User not found in extended_users, create an entry
          await supabase
            .from('extended_users')
            .insert({ id: data.user.id, status: 'active' });
        } else {
          throw extendedError;
        }
      } else if (extendedUser.status === 'pending') {
        // Redirect to waiting approval page
        navigate('/waiting-approval');
        toast.info("Your account is pending approval");
        return;
      } else if (extendedUser.status === 'denied' || extendedUser.status === 'inactive') {
        await supabase.auth.signOut();
        throw new Error(`Your account has been ${extendedUser.status}. Please contact an administrator.`);
      }
      
      // Store business selection in localStorage
      localStorage.setItem("pos_current_business", businessId);
      
      toast.success(`Welcome back!`, {
        description: "You have successfully logged in"
      });
    } catch (error) {
      console.error("Login failed", error);
      // Show detailed error message
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
      navigate("/login");
      toast.info("You have been logged out");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed", {
        description: "There was an issue with logging out. Please try again."
      });
    }
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false;
    
    // Admin role has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permissions if available
    if (user.permissions) {
      return user.permissions.some(
        permission => permission.name === permissionName && permission.enabled
      );
    }
    
    // Default role-based permissions for backward compatibility
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
