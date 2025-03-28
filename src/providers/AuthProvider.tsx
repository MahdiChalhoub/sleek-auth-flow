
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";
import { useBusinessSelection } from "@/hooks/useBusinessSelection";
import { getMockPermissions, getRoleDefaultPage } from "@/hooks/usePermissions";
import { 
  generateMockUser, 
  checkBusinessAccess, 
  setAuthStorage, 
  clearAuthStorage 
} from "@/utils/authUtils";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    currentBusiness,
    userBusinesses,
    initializeBusinessSelection,
    switchBusiness
  } = useBusinessSelection(user);

  useEffect(() => {
    const checkSession = async () => {
      const storageType = localStorage.getItem("auth_storage_type") || "local";
      const storage = storageType === "local" ? localStorage : sessionStorage;
      
      const savedUser = storage.getItem("pos_user");
      const savedBusinessId = storage.getItem("pos_current_business");
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          if (parsedUser) {
            initializeBusinessSelection(parsedUser, savedBusinessId);
          }
        } catch (e) {
          console.error("Failed to parse user data", e);
          storage.removeItem("pos_user");
          storage.removeItem("pos_current_business");
        }
      }
      
      setIsLoading(false);
    };
    
    checkSession();
  }, [initializeBusinessSelection]);

  useEffect(() => {
    if (!isLoading && user && location.pathname === "/login") {
      const redirectPath = localStorage.getItem("intended_redirect") || getRoleDefaultPage(user.role);
      localStorage.removeItem("intended_redirect");
      navigate(redirectPath);
    }
  }, [user, isLoading, navigate, location.pathname]);

  const login = async (email: string, password: string, businessId: string, rememberMe: boolean = true): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (!businessId || businessId.trim() === "") {
        throw new Error("Please select a business to continue");
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      
      let role: UserRole = "cashier";
      let isGlobalAdmin = false;
      
      if (email.includes("admin")) {
        role = "admin";
        isGlobalAdmin = true;
      } else if (email.includes("manager")) {
        role = "manager";
      }
      
      const mockUser = generateMockUser(email, role, isGlobalAdmin);
      
      const permissions = getMockPermissions(role);
      
      const userWithPermissions: User = {
        ...mockUser,
        permissions
      };
      
      if (!checkBusinessAccess(mockUser.id, businessId)) {
        throw new Error("Access denied: You do not have permission to access the selected business");
      }
      
      setUser(userWithPermissions);
      
      setAuthStorage(userWithPermissions, businessId, rememberMe);
      
      initializeBusinessSelection(userWithPermissions, businessId);
      
      const redirectPath = localStorage.getItem("intended_redirect") || getRoleDefaultPage(userWithPermissions.role);
      localStorage.removeItem("intended_redirect");
      navigate(redirectPath);
      
      toast.success(`Welcome, ${userWithPermissions.name}`, {
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

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    navigate("/login");
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      loading: isLoading,
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
