import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Mail, User2, Shield, DoorOpen } from 'lucide-react';

import { useAuthStore } from '../stores/authStore';
import { useReservationStore } from '../stores/reservationStore';
import { formatDateTimeUTC } from '../lib/datetime';

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  const myUpcoming = useReservationStore((s) => s.myUpcoming);
  const isLoading = useReservationStore((s) => s.isLoading);
  const error = useReservationStore((s) => s.error);
  const fetchMyUpcoming = useReservationStore((s) => s.fetchMyUpcoming);

  useEffect(() => {
    if (user) fetchMyUpcoming();
  }, [user, fetchMyUpcoming]);

  const upcoming = useMemo(() => {
    const now = new Date();
    return (myUpcoming || []).filter((r) => new Date(r.endTime) > now);
  }, [myUpcoming]);

  if (!user) return null;

  return (
    <div className='space-y-8'>
      {/* User card */}
      <div className='rounded-2xl border bg-white p-6 shadow-sm'>
        <div className='flex items-start gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white'>
            <User2 className='h-6 w-6' />
          </div>

          <div className='flex-1'>
            <h1 className='text-2xl font-bold text-gray-900'>
              {user.fullName}
            </h1>

            <div className='mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-gray-400' />
                <span className='font-medium text-gray-900'>{user.email}</span>
              </div>

              <div className='flex items-center gap-2'>
                <Shield className='h-4 w-4 text-gray-400' />
                Role:{' '}
                <span className='font-medium text-gray-900'>{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading / error */}
      {isLoading && (
        <div className='flex justify-center py-10'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
        </div>
      )}

      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Upcoming reservations */}
      <div className='rounded-2xl border bg-white p-6 shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CalendarClock className='h-5 w-5 text-gray-700' />
            <h2 className='text-lg font-semibold text-gray-900'>
              Upcoming reservations
            </h2>
          </div>

          <button
            onClick={fetchMyUpcoming}
            className='rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50'
            type='button'
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>

        {upcoming.length === 0 ? (
          <p className='text-sm text-gray-600'>
            You don’t have any upcoming reservations.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead>
                <tr className='border-b text-gray-600'>
                  <th className='py-2 pr-4'>Room</th>
                  <th className='py-2 pr-4'>Building</th>
                  <th className='py-2 pr-4'>Type</th>
                  <th className='py-2 pr-4'>Start</th>
                  <th className='py-2 pr-4'>End</th>
                  <th className='py-2 pr-0'>Action</th>
                </tr>
              </thead>

              <tbody>
                {upcoming.map((r) => (
                  <tr key={r.id} className='border-b last:border-b-0'>
                    <td className='py-3 pr-4 font-medium text-gray-900'>
                      {r.room?.name || `Room #${r.roomId}`}
                    </td>
                    <td className='py-3 pr-4 text-gray-700'>
                      {r.room?.building?.name ||
                        `Building #${r.room?.buildingId ?? '-'}`}
                    </td>
                    <td className='py-3 pr-4 text-gray-700'>
                      {r.room?.roomType?.name ||
                        `Type #${r.room?.roomTypeId ?? '-'}`}
                    </td>
                    <td className='py-3 pr-4 text-gray-700'>
                      {formatDateTimeUTC(r.startTime)}
                    </td>
                    <td className='py-3 pr-4 text-gray-700'>
                      {formatDateTimeUTC(r.endTime)}
                    </td>
                    <td className='py-3 pr-0'>
                      <Link
                        to={`/room/${r.roomId}`}
                        className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-black'
                      >
                        <DoorOpen className='h-4 w-4' />
                        Open room
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
