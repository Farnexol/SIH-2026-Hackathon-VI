import React, { createContext, useContext, useState } from 'react';
import { useStore } from '../store/useStore';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Pull state from Zustand store
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  
  const [loading, setLoading] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  const login = async (email, password, role = 'learner') => {
    setLoading(true);
    try {
      const res = await api.loginUser(email, password, role);
      if (res.success) {
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
    useStore.getState().logout();
  };

  const updateUserProfile = async (newData) => {
    try {
      const res = await api.updateUserProfile(newData);
      return { success: true, user: res.data };
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
