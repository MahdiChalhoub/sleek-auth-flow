
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, UserRole } from "@/types/auth";
import { useBusinessSelection } from "@/hooks/useBusinessSelection";
import { getMockPermissions, getRoleDefaultPage } from "@/hooks/usePermissions";
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
      (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          // Transform Supabase user to our app User type
          const userRole: UserRole = getUserRole(newSession.user);
          
          const appUser: User = {
            id: newSession.user.id,
            name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || 'User',
            email: newSession.user.email || '',
            role: userRole,
            avatarUrl: newSession.user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${newSession.user.email}`,
            isGlobalAdmin: userRole === 'admin',
          };
          
          // Add permissions to the user
          const permissions = getMockPermissions(userRole);
          const userWithPermissions = {
            ...appUser,
            permissions
          };
          
          setUser(userWithPermissions);
          
          // Store the selected business ID
          const businessId = localStorage.getItem("pos_current_business");
          if (businessId) {
            // Initialize business selection
            setTimeout(() => {
              initializeBusinessSelection(userWithPermissions, businessId);
            }, 0);
          }
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      
      if (existingSession?.user) {
        // Transform Supabase user to our app User type
        const userRole: UserRole = getUserRole(existingSession.user);
        
        const appUser: User = {
          id: existingSession.user.id,
          name: existingSession.user.user_metadata?.name || existingSession.user.email?.split('@')[0] || 'User',
          email: existingSession.user.email || '',
          role: userRole,
          avatarUrl: existingSession.user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${existingSession.user.email}`,
          isGlobalAdmin: userRole === 'admin',
        };
        
        // Add permissions to the user
        const permissions = getMockPermissions(userRole);
        const userWithPermissions = {
          ...appUser,
          permissions
        };
        
        setUser(userWithPermissions);
        
        // Store the selected business ID
        const businessId = localStorage.getItem("pos_current_business");
        if (businessId) {
          // Initialize business selection
          setTimeout(() => {
            initializeBusinessSelection(userWithPermissions, businessId);
          }, 0);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeBusinessSelection]);

  // Only redirect on initial login, not on every render
  useEffect(() => {
    if (!isLoading && user && location.pathname === "/login") {
      // Get the intended redirect path from localStorage or use default based on role
      const redirectPath = localStorage.getItem("intended_redirect") || getRoleDefaultPage(user.role);
      localStorage.removeItem("intended_redirect"); // Clear the stored path
      
      navigate(redirectPath);
    }
  }, [user, isLoading, navigate, location.pathname]);

  // Determine user role based on Supabase user
  const getUserRole = (supabaseUser: any): UserRole => {
    // Check email for role determination (temporary approach)
    // In a real app, you would look up roles in a database table
    const email = supabaseUser.email || '';
    
    if (email.includes('admin')) {
      return 'admin';
    } else if (email.includes('manager')) {
      return 'manager';
    }
    
    return 'cashier'; // Default role
  };

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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      currentBusiness, 
      userBusinesses,
      switchBusiness 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
