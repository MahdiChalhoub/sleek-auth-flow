
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type UserRole = "admin" | "cashier" | "manager";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Mock Supabase session check
  useEffect(() => {
    const checkSession = async () => {
      // This would normally check a Supabase session
      const savedUser = localStorage.getItem("pos_user");
      
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse user data");
          localStorage.removeItem("pos_user");
        }
      }
      
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  // Handle redirect based on user role after login
  useEffect(() => {
    if (!isLoading && user) {
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
  }, [user, isLoading, navigate]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would call Supabase auth.signIn
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user data based on email
      let role: UserRole = "cashier";
      if (email.includes("admin")) {
        role = "admin";
      } else if (email.includes("manager")) {
        role = "manager";
      }
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
        avatarUrl: `https://avatar.vercel.sh/${email}`,
      };
      
      setUser(mockUser);
      localStorage.setItem("pos_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // In real app, this would call Supabase auth.signOut
    localStorage.removeItem("pos_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
