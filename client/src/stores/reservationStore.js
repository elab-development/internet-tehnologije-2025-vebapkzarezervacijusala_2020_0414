import { create } from 'zustand';
import { api } from '../api/api';

export const useReservationStore = create((set, get) => ({
  reservations: [],
  myUpcoming: [],
  isLoading: false,
  error: null,

  lastRoomId: null,
  lastDate: null,

  clearError: () => set({ error: null }),

  fetchMyUpcoming: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get('/api/reservations/my-upcoming');
      set({ myUpcoming: data.reservations, isLoading: false });
      return data.reservations;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchByRoomAndDate: async ({ roomId, date }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get(
        `/api/reservations?roomId=${roomId}&date=${date}`,
      );
      set({
        reservations: data.reservations,
        isLoading: false,
        lastRoomId: roomId,
        lastDate: date,
      });
      return data.reservations;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createReservation: async ({ roomId, startTime, endTime }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post('/api/reservations', {
        roomId,
        startTime,
        endTime,
      });

      const { lastRoomId, lastDate } = get();
      if (
        Number(lastRoomId) === Number(roomId) &&
        typeof lastDate === 'string'
      ) {
        await get().fetchByRoomAndDate({ roomId: lastRoomId, date: lastDate });
      } else {
        set({ isLoading: false });
      }

      return data.reservation;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateReservationTime: async (id, { startTime, endTime }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.put(`/api/reservations/${id}`, {
        startTime,
        endTime,
      });

      const { lastRoomId, lastDate } = get();
      if (lastRoomId && lastDate) {
        await get().fetchByRoomAndDate({ roomId: lastRoomId, date: lastDate });
      } else {
        set({ isLoading: false });
      }

      return data.reservation;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteReservation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.del(`/api/reservations/${id}`);

      const { lastRoomId, lastDate } = get();
      if (lastRoomId && lastDate) {
        await get().fetchByRoomAndDate({ roomId: lastRoomId, date: lastDate });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
