
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Business, mockBusinesses, mockUserBusinessAssignments } from "@/models/interfaces/businessInterfaces";
import { toast } from "sonner";

type UserRole = "admin" | "cashier" | "manager";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isGlobalAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  currentBusiness: Business | null;
  userBusinesses: Business[];
  login: (email: string, password: string, businessId: string) => Promise<void>;
  logout: () => void;
  switchBusiness: (businessId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

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
          
          // Load user's businesses
          const userAssignments = mockUserBusinessAssignments.filter(
            assignment => assignment.userId === parsedUser.id
          );
          
          const businesses = mockBusinesses.filter(business => 
            userAssignments.some(assignment => assignment.businessId === business.id)
          );
          
          setUserBusinesses(businesses);
          
          // Set current business
          if (savedBusinessId) {
            const business = businesses.find(b => b.id === savedBusinessId);
            if (business) {
              setCurrentBusiness(business);
            } else if (businesses.length > 0) {
              // If saved business not found, use the first available one
              setCurrentBusiness(businesses[0]);
              localStorage.setItem("pos_current_business", businesses[0].id);
            }
          } else if (businesses.length > 0) {
            // If no saved business, use the default one or the first available
            const defaultBusiness = businesses.find(b => 
              userAssignments.some(a => a.businessId === b.id && a.isDefault)
            ) || businesses[0];
            
            setCurrentBusiness(defaultBusiness);
            localStorage.setItem("pos_current_business", defaultBusiness.id);
          }
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.removeItem("pos_user");
          localStorage.removeItem("pos_current_business");
        }
      }
      
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

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
      let role: UserRole = "cashier";
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
      
      // Get the businesses this user has access to
      const businesses = mockBusinesses.filter(business => 
        userBusinessIds.includes(business.id)
      );
      
      // Set selected business as current
      const selectedBusiness = businesses.find(b => b.id === businessId);
      
      if (!selectedBusiness) {
        throw new Error("Business not found");
      }
      
      setUser(mockUser);
      setUserBusinesses(businesses);
      setCurrentBusiness(selectedBusiness);
      
      localStorage.setItem("pos_user", JSON.stringify(mockUser));
      localStorage.setItem("pos_current_business", selectedBusiness.id);
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const switchBusiness = (businessId: string) => {
    if (!user || !user.isGlobalAdmin) {
      console.error("Only global admins can switch businesses");
      return;
    }
    
    const business = userBusinesses.find(b => b.id === businessId);
    
    if (!business) {
      console.error("Business not found");
      return;
    }
    
    setCurrentBusiness(business);
    localStorage.setItem("pos_current_business", business.id);
    
    toast.success(`Switched to ${business.name}`);
    
    // Redirect to home after switching
    navigate("/home");
  };

  const logout = () => {
    localStorage.removeItem("pos_user");
    localStorage.removeItem("pos_current_business");
    setUser(null);
    setCurrentBusiness(null);
    setUserBusinesses([]);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
