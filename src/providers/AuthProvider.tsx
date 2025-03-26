
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Business, mockBusinesses, mockUserBusinessAssignments } from "@/models/interfaces/businessInterfaces";
import { toast } from "sonner";
import { User } from "@/types/auth";
import { useBusinessSelection } from "@/hooks/useBusinessSelection";

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
          
          // Initialize business selection
          initializeBusinessSelection(parsedUser, savedBusinessId);
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
      
      const mockUser: User = {
        id: userId,
        name: email.split("@")[0],
        email,
        role,
        avatarUrl: `https://avatar.vercel.sh/${email}`,
        isGlobalAdmin
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
      initializeBusinessSelection(mockUser, businessId);
      
      // Use appropriate storage based on rememberMe setting
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("pos_user", JSON.stringify(mockUser));
      storage.setItem("pos_current_business", businessId);
      
      // Store the storage type preference
      localStorage.setItem("auth_storage_type", rememberMe ? "local" : "session");
      
      // Navigate to the appropriate page based on role
      navigate(getRoleDefaultPage(mockUser.role));
      
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
