import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../utils/api';
import type { User, AuthContextType, AuthResponse } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // load user and token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // register new user
  const register = async (full_name: string, email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', {
        full_name,
        email,
        password,
      });

      if (response.data.success && response.data.user && response.data.token) {
        const { user: newUser, token: newToken } = response.data;
        
        // save to state
        setUser(newUser);
        setToken(newToken);
        
        // save to localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  // login existing user
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', {
        email,
        password,
      });

      if (response.data.success && response.data.user && response.data.token) {
        const { user: existingUser, token: newToken } = response.data;
        
        // save to state
        setUser(existingUser);
        setToken(newToken);
        
        // save to localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(existingUser));
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  // logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
