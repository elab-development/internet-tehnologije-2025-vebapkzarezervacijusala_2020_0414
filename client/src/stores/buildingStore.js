import { create } from 'zustand';
import { api } from '../api/api';

export const useBuildingStore = create((set, get) => ({
  buildings: [],
  activeBuilding: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchBuildings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get('/api/buildings');
      set({ buildings: data.buildings, isLoading: false });
      return data.buildings;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchBuildingById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get(`/api/buildings/${id}`);
      set({ activeBuilding: data.building, isLoading: false });
      return data.building;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createBuilding: async ({ name, address, description }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post('/api/buildings', {
        name,
        address,
        description,
      });
      set({ buildings: [...get().buildings, data.building], isLoading: false });
      return data.building;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateBuilding: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.put(`/api/buildings/${id}`, payload);
      set({
        buildings: get().buildings.map((b) =>
          b.id === id ? data.building : b,
        ),
        activeBuilding:
          get().activeBuilding?.id === id
            ? data.building
            : get().activeBuilding,
        isLoading: false,
      });
      return data.building;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteBuilding: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.del(`/api/buildings/${id}`);
      set({
        buildings: get().buildings.filter((b) => b.id !== id),
        activeBuilding:
          get().activeBuilding?.id === id ? null : get().activeBuilding,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
