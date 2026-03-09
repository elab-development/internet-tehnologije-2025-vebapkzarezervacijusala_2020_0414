import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReservationModal from '../ReservationModal';

describe('ReservationModal', () => {
  it('submits ISO start/end via onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValueOnce(null);

    render(
      <ReservationModal
        open={true}
        mode='create'
        date='2026-02-23'
        roomId={7}
        reservation={null}
        initialStartHHMM='09:00'
        initialEndHHMM='09:30'
        isLoading={false}
        error={null}
        onClose={() => {}}
        onSubmit={onSubmit}
        onDelete={null}
      />,
    );

    // promeni vreme
    const startInput = screen.getByLabelText(/start/i);
    const endInput = screen.getByLabelText(/end/i);

    await user.clear(startInput);
    await user.type(startInput, '10:00');

    await user.clear(endInput);
    await user.type(endInput, '10:30');

    // submit
    const saveBtn = screen.getByRole('button', { name: /save/i });
    await user.click(saveBtn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];

    expect(payload.roomId).toBe(7);
    expect(payload.startTime).toBe('2026-02-23T10:00:00.000Z');
    expect(payload.endTime).toBe('2026-02-23T10:30:00.000Z');
  });

  it('shows local validation error if end <= start', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <ReservationModal
        open={true}
        mode='create'
        date='2026-02-23'
        roomId={7}
        reservation={null}
        initialStartHHMM='10:00'
        initialEndHHMM='09:30'
        isLoading={false}
        error={null}
        onClose={() => {}}
        onSubmit={onSubmit}
        onDelete={null}
      />,
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/end time must be after start time/i),
    ).toBeInTheDocument();
  });
});
