import { create } from 'zustand';
import { api } from '../api/api';

function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export const useRoomStore = create((set, get) => ({
  rooms: [],
  activeRoom: null,
  isLoading: false,
  error: null,

  lastFilters: null,

  clearError: () => set({ error: null }),

  fetchRooms: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = buildQuery(filters);
      const data = await api.get(`/api/rooms${query}`);
      set({ rooms: data.rooms, isLoading: false, lastFilters: filters });
      return data.rooms;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchRoomById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get(`/api/rooms/${id}`);
      set({ activeRoom: data.room, isLoading: false });
      return data.room;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createRoom: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post('/api/rooms', payload);
      const lf = get().lastFilters;
      if (lf) await get().fetchRooms(lf);
      set({ rooms: [...get().rooms, data.room], isLoading: false });
      return data.room;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateRoom: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.put(`/api/rooms/${id}`, payload);
      set({
        rooms: get().rooms.map((r) => (r.id === id ? data.room : r)),
        activeRoom: get().activeRoom?.id === id ? data.room : get().activeRoom,
        isLoading: false,
      });
      return data.room;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteRoom: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.del(`/api/rooms/${id}`);
      set({
        rooms: get().rooms.filter((r) => r.id !== id),
        activeRoom: get().activeRoom?.id === id ? null : get().activeRoom,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
