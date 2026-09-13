import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authApi } from '../api/auth.api';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sih_user');
    const token = localStorage.getItem('sih_auth_token');
    if (!saved || !token) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('sih_auth_token');
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('sih_user', JSON.stringify(user));
      localStorage.setItem('sih_auth_token', token);
    } else {
      localStorage.removeItem('sih_user');
      localStorage.removeItem('sih_auth_token');
    }
  }, [user, token]);

  const login = async (email: string, password = 'Password@123'): Promise<User> => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);
      
      const loggedInUser: User = {
        id: data.user_id,
        email: email,
        full_name: data.full_name,
        role: data.role.toUpperCase() as any,
        designation: data.designation || (data.role.toLowerCase() === 'trainer' ? 'NSSTA Faculty' : (data.role.toLowerCase().includes('admin') ? 'Director / Admin' : 'Statistical Officer')),
      };

      setToken(data.access_token);
      setUser(loggedInUser);
      localStorage.setItem('sih_auth_token', data.access_token);
      localStorage.setItem('sih_user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sih_auth_token');
    localStorage.removeItem('sih_user');
    // Hard navigate to ensure clean state reset across all routers and listeners
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
