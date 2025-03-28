
import React, { createContext, useContext } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { Business } from '@/models/interfaces/businessInterfaces';
import { supabase } from '@/lib/supabase';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoading: true,
  currentBusiness: null,
  userBusinesses: [],
  login: async () => {},
  logout: async () => {}, // Changed to return Promise<void>
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  error: null,
  switchBusiness: () => {},
  hasPermission: () => false
});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
