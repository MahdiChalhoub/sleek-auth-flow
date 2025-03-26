
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User } from "@/types/auth";
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

  // Check if user session exists
  useEffect(() => {
    const checkSession = async () => {
      // Get the storage type (localStorage or sessionStorage) based on remember me setting
      const storageType = localStorage.getItem("auth_storage_type") || "local";
      const storage = storageType === "local" ? localStorage : sessionStorage;
      
      const savedUser = storage.getItem("pos_user");
      const savedBusinessId = storage.getItem("pos_current_business");
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Initialize business selection if user exists
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

  // Only redirect on initial login, not on every render
  useEffect(() => {
    if (!isLoading && user && location.pathname === "/login") {
      // Get the intended redirect path from localStorage or use default based on role
      const redirectPath = localStorage.getItem("intended_redirect") || getRoleDefaultPage(user.role);
      localStorage.removeItem("intended_redirect"); // Clear the stored path
      
      navigate(redirectPath);
    }
  }, [user, isLoading, navigate, location.pathname]);

  const login = async (email: string, password: string, businessId: string, rememberMe: boolean = true): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (!businessId || businessId.trim() === "") {
        throw new Error("Please select a business to continue");
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user data based on email
      let role: User["role"] = "cashier";
      let isGlobalAdmin = false;
      
      if (email.includes("admin")) {
        role = "admin";
        isGlobalAdmin = true;
      } else if (email.includes("manager")) {
        role = "manager";
      }
      
      // Generate mock user
      const mockUser = generateMockUser(email, role, isGlobalAdmin);
      
      // Generate mock permissions based on role
      const permissions = getMockPermissions(role);
      
      // Add permissions to the user
      const userWithPermissions = {
        ...mockUser,
        permissions
      };
      
      // Check if user has access to the selected business
      if (!checkBusinessAccess(mockUser.id, businessId)) {
        throw new Error("Access denied: You do not have permission to access the selected business");
      }
      
      setUser(userWithPermissions);
      
      // Store auth data in appropriate storage
      setAuthStorage(userWithPermissions, businessId, rememberMe);
      
      // Initialize business selection after user is set
      initializeBusinessSelection(userWithPermissions, businessId);
      
      // Navigate to the appropriate page based on role
      const redirectPath = localStorage.getItem("intended_redirect") || getRoleDefaultPage(userWithPermissions.role);
      localStorage.removeItem("intended_redirect");
      navigate(redirectPath);
      
      toast.success(`Welcome, ${userWithPermissions.name}`, {
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

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    navigate("/login");
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
