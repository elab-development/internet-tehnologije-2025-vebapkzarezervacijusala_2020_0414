import { create } from 'zustand';
import { api } from '../api/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthLoading: false,
  authError: null,

  clearAuthError: () => set({ authError: null }),

  register: async ({ fullName, email, password }) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const data = await api.post('/api/auth/register', {
        fullName,
        email,
        password,
      });
      set({ user: data.user, isAuthLoading: false });
      return data.user;
    } catch (err) {
      set({ authError: err.message, isAuthLoading: false });
      throw err;
    }
  },

  login: async ({ email, password }) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const data = await api.post('/api/auth/login', { email, password });
      set({ user: data.user, isAuthLoading: false });
      return data.user;
    } catch (err) {
      set({ authError: err.message, isAuthLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isAuthLoading: true, authError: null });
    try {
      await api.post('/api/auth/logout', {});
      set({ user: null, isAuthLoading: false });
    } catch (err) {
      set({ authError: err.message, isAuthLoading: false });
      throw err;
    }
  },

  me: async () => {
    set({ isAuthLoading: true, authError: null });
    try {
      const data = await api.get('/api/auth/me');
      set({ user: data.user, isAuthLoading: false });
      return data.user;
    } catch (err) {
      set({
        user: null,
        isAuthLoading: false,
        authError: err.status === 401 ? null : err.message,
      });
      return null;
    }
  },

  // helpers
  isAdmin: () => get().user?.role === 'ADMIN',
  isUser: () => get().user?.role === 'USER',
}));
