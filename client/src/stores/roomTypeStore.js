import { create } from 'zustand';
import { api } from '../api/api';

export const useRoomTypeStore = create((set, get) => ({
  roomTypes: [],
  activeRoomType: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchRoomTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get('/api/room-types');
      set({ roomTypes: data.roomTypes, isLoading: false });
      return data.roomTypes;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchRoomTypeById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get(`/api/room-types/${id}`);
      set({ activeRoomType: data.roomType, isLoading: false });
      return data.roomType;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createRoomType: async ({ name, description }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post('/api/room-types', { name, description });
      set({ roomTypes: [...get().roomTypes, data.roomType], isLoading: false });
      return data.roomType;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateRoomType: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.put(`/api/room-types/${id}`, payload);
      set({
        roomTypes: get().roomTypes.map((rt) =>
          rt.id === id ? data.roomType : rt,
        ),
        activeRoomType:
          get().activeRoomType?.id === id
            ? data.roomType
            : get().activeRoomType,
        isLoading: false,
      });
      return data.roomType;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteRoomType: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.del(`/api/room-types/${id}`);
      set({
        roomTypes: get().roomTypes.filter((rt) => rt.id !== id),
        activeRoomType:
          get().activeRoomType?.id === id ? null : get().activeRoomType,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
