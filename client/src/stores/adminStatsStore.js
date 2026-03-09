import { create } from 'zustand';
import { api } from '../api/api';

export const useAdminStatsStore = create((set) => ({
  stats: null, // { kpis, charts, meta }
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchAdminStats: async ({ days = 30 } = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get(`/api/admin/stats?days=${days}`);
      set({ stats: data, isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
