import { describe, it, expect, beforeEach, vi } from 'vitest';

// 1) Mock api modul
vi.mock('../../api/api', () => {
  return {
    api: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      del: vi.fn(),
    },
  };
});

import { api } from '../../api/api';
import { useReservationStore } from '../reservationStore';

describe('useReservationStore - createReservation flow', () => {
  beforeEach(() => {
    // reset Zustand state pre svakog testa
    useReservationStore.setState({
      reservations: [],
      myUpcoming: [],
      isLoading: false,
      error: null,
      lastRoomId: null,
      lastDate: null,
    });

    vi.clearAllMocks();
  });

  it('creates reservation and refreshes reservations list when lastRoomId/lastDate match', async () => {
    // arrange
    const roomId = 7;
    const date = '2026-02-23';
    const startTime = '2026-02-23T09:00:00.000Z';
    const endTime = '2026-02-23T09:30:00.000Z';

    useReservationStore.setState({ lastRoomId: roomId, lastDate: date });

    api.post.mockResolvedValueOnce({
      reservation: { id: 101, roomId, startTime, endTime },
    });

    // fetchByRoomAndDate radi api.get i setuje reservations
    api.get.mockResolvedValueOnce({
      reservations: [{ id: 201, roomId, startTime, endTime }],
    });

    // act
    const created = await useReservationStore
      .getState()
      .createReservation({ roomId, startTime, endTime });

    // assert
    expect(api.post).toHaveBeenCalledWith('/api/reservations', {
      roomId,
      startTime,
      endTime,
    });

    expect(api.get).toHaveBeenCalledWith(
      `/api/reservations?roomId=${roomId}&date=${date}`,
    );

    expect(created.id).toBe(101);

    const state = useReservationStore.getState();
    expect(state.reservations).toHaveLength(1);
    expect(state.reservations[0].id).toBe(201);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('creates reservation but does NOT refresh list when lastRoomId/lastDate not set', async () => {
    const roomId = 7;

    api.post.mockResolvedValueOnce({
      reservation: { id: 101, roomId },
    });

    const created = await useReservationStore.getState().createReservation({
      roomId,
      startTime: '2026-02-23T09:00:00.000Z',
      endTime: '2026-02-23T09:30:00.000Z',
    });

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.get).not.toHaveBeenCalled();

    expect(created.id).toBe(101);
    expect(useReservationStore.getState().isLoading).toBe(false);
  });

  it('handles API error and sets error in store', async () => {
    api.post.mockRejectedValueOnce(new Error('Overlap conflict'));

    await expect(
      useReservationStore.getState().createReservation({
        roomId: 1,
        startTime: '2026-02-23T09:00:00.000Z',
        endTime: '2026-02-23T09:30:00.000Z',
      }),
    ).rejects.toThrow('Overlap conflict');

    const state = useReservationStore.getState();
    expect(state.error).toBe('Overlap conflict');
    expect(state.isLoading).toBe(false);
  });
});
