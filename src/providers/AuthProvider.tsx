
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Business, mockBusinesses, mockUserBusinessAssignments } from "@/models/interfaces/businessInterfaces";
import { toast } from "sonner";
import { User, UserPermission } from "@/types/auth";
import { useBusinessSelection } from "@/hooks/useBusinessSelection";

// Mock permissions for different roles
const getMockPermissions = (role: User["role"]): UserPermission[] => {
  const basicPermissions: UserPermission[] = [
    { id: "1", name: "can_view_transactions", enabled: true },
    { id: "2", name: "can_view_inventory", enabled: true },
  ];
  
  const cashierPermissions: UserPermission[] = [
    ...basicPermissions,
    { id: "3", name: "can_edit_transactions", enabled: true },
    { id: "4", name: "can_apply_discount", enabled: false },
  ];
  
  const managerPermissions: UserPermission[] = [
    ...cashierPermissions,
    { id: "5", name: "can_lock_transactions", enabled: true },
    { id: "6", name: "can_unlock_transactions", enabled: true },
    { id: "7", name: "can_verify_transactions", enabled: true },
    { id: "8", name: "can_unverify_transactions", enabled: true },
    { id: "9", name: "can_approve_discrepancy", enabled: true },
    { id: "10", name: "can_apply_discount", enabled: true },
  ];
  
  const adminPermissions: UserPermission[] = [
    ...managerPermissions,
    { id: "11", name: "can_delete_transactions", enabled: true },
    { id: "12", name: "can_secure_transactions", enabled: true },
    { id: "13", name: "can_manage_users", enabled: true },
    { id: "14", name: "can_manage_roles", enabled: true },
    { id: "15", name: "can_manage_permissions", enabled: true },
  ];
  
  switch (role) {
    case "admin":
      return adminPermissions;
    case "manager":
      return managerPermissions;
    case "cashier":
      return cashierPermissions;
    default:
      return basicPermissions;
  }
};

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

  // Helper function to get default page by role
  const getRoleDefaultPage = (role: User["role"]): string => {
    switch (role) {
      case "admin":
        return "/home";
      case "cashier":
        return "/pos-sales";
      case "manager":
        return "/inventory";
      default:
        return "/home";
    }
  };

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
      
      // Create a unique ID based on the email for consistency
      const userId = `user-${email.split("@")[0].toLowerCase()}`;
      
      // Generate mock permissions based on role
      const permissions = getMockPermissions(role);
      
      const mockUser: User = {
        id: userId,
        name: email.split("@")[0],
        email,
        role,
        avatarUrl: `https://avatar.vercel.sh/${email}`,
        isGlobalAdmin,
        permissions
      };
      
      // Check if user has access to the selected business
      const userAssignments = mockUserBusinessAssignments.filter(
        assignment => assignment.userId === userId
      );
      
      const userBusinessIds = userAssignments.map(a => a.businessId);
      
      if (!userBusinessIds.includes(businessId)) {
        throw new Error("Access denied: You do not have permission to access the selected business");
      }
      
      setUser(mockUser);
      
      // Use appropriate storage based on rememberMe setting
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("pos_user", JSON.stringify(mockUser));
      storage.setItem("pos_current_business", businessId);
      
      // Store the storage type preference
      localStorage.setItem("auth_storage_type", rememberMe ? "local" : "session");
      
      // Initialize business selection after user is set
      initializeBusinessSelection(mockUser, businessId);
      
      // Navigate to the appropriate page based on role
      const redirectPath = localStorage.getItem("intended_redirect") || getRoleDefaultPage(mockUser.role);
      localStorage.removeItem("intended_redirect");
      navigate(redirectPath);
      
      toast.success(`Welcome, ${mockUser.name}`, {
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
    // Get the storage type that was used for login
    const storageType = localStorage.getItem("auth_storage_type") || "local";
    const storage = storageType === "local" ? localStorage : sessionStorage;
    
    // Clear auth data from the appropriate storage
    storage.removeItem("pos_user");
    storage.removeItem("pos_current_business");
    
    // Also clear from the other storage type to be safe
    if (storageType === "local") {
      sessionStorage.removeItem("pos_user");
      sessionStorage.removeItem("pos_current_business");
    } else {
      localStorage.removeItem("pos_user");
      localStorage.removeItem("pos_current_business");
    }
    
    // Clear storage type preference
    localStorage.removeItem("auth_storage_type");
    localStorage.removeItem("intended_redirect");
    
    setUser(null);
    toast.info("You have been logged out");
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
