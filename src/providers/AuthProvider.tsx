
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Business } from "@/models/interfaces/businessInterfaces";
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

  // Mock Supabase session check
  useEffect(() => {
    const checkSession = async () => {
      // This would normally check a Supabase session
      const savedUser = localStorage.getItem("pos_user");
      const savedBusinessId = localStorage.getItem("pos_current_business");
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Initialize business selection
          initializeBusinessSelection(parsedUser, savedBusinessId);
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.removeItem("pos_user");
          localStorage.removeItem("pos_current_business");
        }
      }
      
      setIsLoading(false);
    };
    
    checkSession();
  }, [initializeBusinessSelection]);

  // Only redirect on initial login, not on every render
  useEffect(() => {
    if (!isLoading && user && location.pathname === "/login") {
      switch (user.role) {
        case "admin":
          navigate("/home");
          break;
        case "cashier":
          navigate("/pos-sales");
          break;
        case "manager":
          navigate("/inventory");
          break;
        default:
          navigate("/home");
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  const login = async (email: string, password: string, businessId: string): Promise<void> => {
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
      
      // Create a unique ID that's deterministic based on the email
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
        assignment => assignment.userId === `user-${role}`
      );
      
      const userBusinessIds = userAssignments.map(a => a.businessId);
      
      if (!userBusinessIds.includes(businessId)) {
        throw new Error("User does not have access to this business");
      }
      
      setUser(mockUser);
      initializeBusinessSelection(mockUser, businessId);
      
      localStorage.setItem("pos_user", JSON.stringify(mockUser));
      localStorage.setItem("pos_current_business", businessId);
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("pos_user");
    localStorage.removeItem("pos_current_business");
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
