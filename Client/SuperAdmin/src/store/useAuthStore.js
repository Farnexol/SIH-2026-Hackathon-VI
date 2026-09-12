import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: (bypassKey) => {
    if (bypassKey === 'SUPERADMIN_HACKATHON_2026') {
      set({
        isAuthenticated: true,
        user: { id: 'SA-001', name: 'SuperAdmin', role: 'SUPERADMIN' }
      });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  }
}));
