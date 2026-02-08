import { X, Trash2, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { formatHHMMUtc, toUtcDateFromDateOnlyAndTime } from '../lib/datetime';

export default function ReservationModal({
  open,
  mode,
  date,
  roomId,
  reservation,
  initialStartHHMM,
  initialEndHHMM,
  isLoading,
  error,
  onClose,
  onSubmit,
  onDelete,
}) {
  const [startHHMM, setStartHHMM] = useState(initialStartHHMM || '09:00');
  const [endHHMM, setEndHHMM] = useState(initialEndHHMM || '09:30');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLocalError('');
    if (mode === 'edit' && reservation) {
      setStartHHMM(formatHHMMUtc(reservation.startTime));
      setEndHHMM(formatHHMMUtc(reservation.endTime));
    } else {
      setStartHHMM(initialStartHHMM || '09:00');
      setEndHHMM(initialEndHHMM || '09:30');
    }
  }, [open, mode, reservation, initialStartHHMM, initialEndHHMM]);

  const canDelete = useMemo(
    () => mode === 'edit' && reservation && onDelete,
    [mode, reservation, onDelete],
  );

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const start = toUtcDateFromDateOnlyAndTime(date, startHHMM);
    const end = toUtcDateFromDateOnlyAndTime(date, endHHMM);

    if (start >= end) {
      setLocalError('End time must be after start time.');
      return;
    }

    await onSubmit({
      roomId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />

      <div className='relative w-full max-w-md rounded-2xl border bg-white p-5 shadow-lg'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {mode === 'create' ? 'Create reservation' : 'Edit reservation'}
          </h3>
          <button
            onClick={onClose}
            className='rounded-xl p-2 hover:bg-gray-100'
            type='button'
          >
            <X className='h-5 w-5 text-gray-600' />
          </button>
        </div>

        {(localError || error) && (
          <div className='mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Start
              </label>
              <input
                type='time'
                value={startHHMM}
                onChange={(e) => setStartHHMM(e.target.value)}
                className='w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-900'
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                End
              </label>
              <input
                type='time'
                value={endHHMM}
                onChange={(e) => setEndHHMM(e.target.value)}
                className='w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-900'
              />
            </div>
          </div>

          <div className='flex items-center justify-between gap-3'>
            {canDelete ? (
              <button
                type='button'
                onClick={() => onDelete(reservation.id)}
                disabled={isLoading}
                className='inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60'
              >
                <Trash2 className='h-4 w-4' />
                Delete
              </button>
            ) : (
              <div />
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60'
            >
              <Save className='h-4 w-4' />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
