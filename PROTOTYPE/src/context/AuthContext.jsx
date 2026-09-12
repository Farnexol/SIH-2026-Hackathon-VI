import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mockData';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check sessionStorage so active session persists across refreshes,
  // but fresh visits / newly opened browser tabs start unauthenticated at /login
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('statiq_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = sessionStorage.getItem('statiq_auth');
      return saved ? JSON.parse(saved) === true : false;
    } catch {
      return false;
    }
  });

  const [loading, setLoading] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  useEffect(() => {
    if (user && isAuthenticated) {
      sessionStorage.setItem('statiq_user', JSON.stringify(user));
      sessionStorage.setItem('statiq_auth', JSON.stringify(true));
    } else if (!isAuthenticated) {
      sessionStorage.removeItem('statiq_user');
      sessionStorage.removeItem('statiq_auth');
    }
    localStorage.removeItem('statiq_auth');
    localStorage.removeItem('statiq_user');
  }, [user, isAuthenticated]);

  // Verify and sync latest user profile from backend on app load
  useEffect(() => {
    async function syncAuthUser() {
      const token = sessionStorage.getItem('statiq_token');
      if (token) {
        try {
          const freshUser = await api.getCurrentUser();
          if (freshUser && freshUser.name) {
            setUser(freshUser);
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.warn('Session verification note:', e);
        }
      }
    }
    syncAuthUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.loginUser({ email, password });
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        sessionStorage.setItem('statiq_user', JSON.stringify(res.user));
        sessionStorage.setItem('statiq_auth', JSON.stringify(true));
        return { success: true, user: res.user };
      } else {
        return { success: false, error: res.error || 'Invalid official credentials' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('statiq_user');
    sessionStorage.removeItem('statiq_auth');
    localStorage.removeItem('statiq_user');
    localStorage.removeItem('statiq_auth');
  };

  const updateUserProfile = async (newData) => {
    try {
      const updated = await api.updateProfile({ ...newData, isProfileCompleted: true });
      const userObj = { ...updated, isProfileCompleted: true };
      setUser(userObj);
      sessionStorage.setItem('statiq_user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  };

  const openAiAdvisor = () => setIsAiAdvisorOpen(true);
  const closeAiAdvisor = () => setIsAiAdvisorOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUserProfile,
        isAiAdvisorOpen,
        setIsAiAdvisorOpen,
        openAiAdvisor,
        closeAiAdvisor
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
