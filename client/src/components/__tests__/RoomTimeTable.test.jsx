import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../hooks/useHolidays', () => ({
  useHolidays: () => ({ isHoliday: false, holiday: null }),
}));

import RoomTimeTable from '../RoomTimeTable';

function makeRoom() {
  return {
    id: 1,
    name: 'Room A',
    // radno vreme 09:00-10:00 (UTC) => dva slota (09:00-09:30, 09:30-10:00)
    workingHoursStart: '2026-02-23T09:00:00.000Z',
    workingHoursEnd: '2026-02-23T10:00:00.000Z',
  };
}

describe('RoomTimeTable', () => {
  it('clicking free slot calls onClickFreeSlot with HHMM', async () => {
    const user = userEvent.setup();
    const onClickFreeSlot = vi.fn();
    const onClickOwnReservation = vi.fn();

    render(
      <RoomTimeTable
        date='2026-02-23'
        room={makeRoom()}
        reservations={[]}
        currentUserId={123}
        onClickFreeSlot={onClickFreeSlot}
        onClickOwnReservation={onClickOwnReservation}
      />,
    );

    // dugme sadrži "09:00 – 09:30"
    const slotBtn = screen.getByRole('button', { name: /09:00 – 09:30/i });
    await user.click(slotBtn);

    expect(onClickFreeSlot).toHaveBeenCalledWith({
      startHHMM: '09:00',
      endHHMM: '09:30',
    });
    expect(onClickOwnReservation).not.toHaveBeenCalled();
  });

  it('clicking your busy slot calls onClickOwnReservation', async () => {
    const user = userEvent.setup();
    const onClickFreeSlot = vi.fn();
    const onClickOwnReservation = vi.fn();

    render(
      <RoomTimeTable
        date='2026-02-23'
        room={makeRoom()}
        reservations={[
          {
            id: 55,
            startTime: '2026-02-23T09:00:00.000Z',
            endTime: '2026-02-23T09:30:00.000Z',
            user: { id: 123 },
          },
        ]}
        currentUserId={123}
        onClickFreeSlot={onClickFreeSlot}
        onClickOwnReservation={onClickOwnReservation}
      />,
    );

    const slotBtn = screen.getByRole('button', { name: /09:00 – 09:30/i });
    await user.click(slotBtn);

    expect(onClickOwnReservation).toHaveBeenCalled();
    expect(onClickFreeSlot).not.toHaveBeenCalled();
  });

  it('busy slot from other user is disabled', async () => {
    const user = userEvent.setup();
    const onClickFreeSlot = vi.fn();
    const onClickOwnReservation = vi.fn();

    render(
      <RoomTimeTable
        date='2026-02-23'
        room={makeRoom()}
        reservations={[
          {
            id: 99,
            startTime: '2026-02-23T09:00:00.000Z',
            endTime: '2026-02-23T09:30:00.000Z',
            user: { id: 777 },
          },
        ]}
        currentUserId={123}
        onClickFreeSlot={onClickFreeSlot}
        onClickOwnReservation={onClickOwnReservation}
      />,
    );

    const slotBtn = screen.getByRole('button', { name: /09:00 – 09:30/i });
    expect(slotBtn).toBeDisabled();

    await user.click(slotBtn);
    expect(onClickFreeSlot).not.toHaveBeenCalled();
    expect(onClickOwnReservation).not.toHaveBeenCalled();
  });
});
