import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config/config';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: any, password: any) => Promise<{ success: boolean; message: string }>;
  register: (name: any, email: any, password: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false, message: '' }),
  register: async () => ({ success: false, message: '' }),
  logout: () => {},
  checkAuth: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import type { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axios.post(`${BACKEND_URL}verify-token`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.valid) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: any, password: any) => {
    try {
      const response = await axios.post(`${BACKEND_URL}login`, {
        email,
        password
      });

      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user state
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      let message = 'Login failed';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      return { success: false, message };
    }
  };

  const register = async (name: any, email: any, password: any) => {
    try {
      const response = await axios.post(`${BACKEND_URL}register`, {
        name,
        email,
        password
      });

      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set user state
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      let message = 'Registration failed';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
