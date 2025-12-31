// Auth Context - Global authentication state management

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getCurrentUser, login as loginService, logout as logoutService, register as registerService } from '../services/authService';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'seller' | 'buyer';
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);
    
    if (response.success && response.user && response.token) {
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
    }
    
    return {
      success: response.success,
      message: response.message,
    };
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'seller' | 'buyer';
  }) => {
    const response = await registerService(userData);
    
    if (response.success && response.user && response.token) {
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
    }
    
    return {
      success: response.success,
      message: response.message,
    };
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
