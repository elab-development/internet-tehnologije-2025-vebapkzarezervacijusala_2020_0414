import { Link } from 'react-router-dom';
import {
  DoorOpen,
  Users,
  Clock,
  ArrowRight,
  Tag,
  CalendarX2,
} from 'lucide-react';
import { formatTime } from '../lib/datetime';
import { useHolidays } from '../hooks/useHolidays';

export default function RoomCard({ room, date }) {
  const { isHoliday, holiday } = useHolidays(date, 'RS');

  return (
    <Link
      to={`/room/${room.id}`}
      className='group block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
    >
      <div className='mb-4 flex items-start justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700'>
            <DoorOpen className='h-6 w-6' />
          </div>

          <div>
            <div className='flex items-center gap-2'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {room.name}
              </h3>

              {isHoliday && (
                <span className='inline-flex items-center gap-1 rounded-full border border-yellow-300 bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-900'>
                  <CalendarX2 className='h-3.5 w-3.5' />
                  Holiday
                </span>
              )}
            </div>

            <div className='mt-1 flex items-center gap-2 text-sm text-gray-500'>
              <Tag className='h-4 w-4' />
              {room.roomType?.name || 'Room'}
            </div>

            {isHoliday && (
              <p className='mt-1 text-xs text-yellow-800'>
                {holiday?.localName || holiday?.name || 'Public holiday'} — no
                reservations
              </p>
            )}
          </div>
        </div>

        <ArrowRight className='mt-1 h-5 w-5 text-gray-300 transition group-hover:text-gray-500' />
      </div>

      <div className='space-y-2 text-sm text-gray-600'>
        <div className='flex items-center gap-2'>
          <Users className='h-4 w-4 text-gray-400' />
          Capacity:{' '}
          <span className='font-medium text-gray-900'>{room.capacity}</span>
        </div>

        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 text-gray-400' />
          Working hours:{' '}
          <span className='font-medium text-gray-900'>
            {formatTime(room.workingHoursStart)} –{' '}
            {formatTime(room.workingHoursEnd)}
          </span>
        </div>
      </div>
    </Link>
  );
}
