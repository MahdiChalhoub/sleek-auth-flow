
import React, { createContext, useContext } from "react";
import { Business } from "@/models/interfaces/businessInterfaces";
import { User, AuthContextType } from "@/types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthProvider } from "@/providers/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
