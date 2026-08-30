
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
  const { isHoliday, holiday } = useHolidays(date || null, 'RS');

  return (
    <Link
      to={`/room/${room.id}`}
      className='group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50'
    >
      {/* Top accent */}
      <div className='h-1.5 bg-indigo-600 transition-all group-hover:bg-indigo-500' />

      <div className='p-5'>
        {/* Header */}
        <div className='mb-5 flex items-start justify-between gap-3'>
          <div className='flex min-w-0 items-center gap-3'>
            {/* Room icon */}
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white'>
              <DoorOpen className='h-6 w-6' />
            </div>

            <div className='min-w-0'>
              <div className='flex flex-wrap items-center gap-2'>
                <h3 className='truncate text-lg font-bold text-slate-900'>
                  {room.name}
                </h3>

                {isHoliday && (
                  <span className='inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700'>
                    <CalendarX2 className='h-3.5 w-3.5' />
                    Holiday
                  </span>
                )}
              </div>

              {/* Room type */}
              <div className='mt-1 flex items-center gap-2 text-sm text-slate-500'>
                <Tag className='h-4 w-4 text-indigo-500' />
                <span>{room.roomType?.name || 'Room'}</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className='mt-1 h-5 w-5 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-indigo-600' />
        </div>

        {/* Holiday notice */}
        {isHoliday && (
          <div className='mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5'>
            <div className='flex items-start gap-2'>
              <CalendarX2 className='mt-0.5 h-4 w-4 shrink-0 text-amber-600' />

              <p className='text-xs leading-5 text-amber-800'>
                <span className='font-semibold'>
                  {holiday?.localName ||
                    holiday?.name ||
                    'Public holiday'}
                </span>{' '}
                — no reservations
              </p>
            </div>
          </div>
        )}

        {/* Room details */}
        <div className='space-y-3 border-t border-slate-100 pt-4'>
          {/* Capacity */}
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2 text-sm text-slate-500'>
              <Users className='h-4 w-4 text-indigo-500' />
              <span>Capacity</span>
            </div>

            <span className='rounded-lg bg-slate-50 px-2.5 py-1 text-sm font-semibold text-slate-900'>
              {room.capacity}
            </span>
          </div>

          {/* Working hours */}
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2 text-sm text-slate-500'>
              <Clock className='h-4 w-4 text-indigo-500' />
              <span>Working hours</span>
            </div>

            <span className='text-sm font-semibold text-slate-900'>
              {formatTime(room.workingHoursStart)} –{' '}
              {formatTime(room.workingHoursEnd)}
            </span>
          </div>
        </div>

        {/* Bottom action */}
        <div className='mt-5 flex items-center justify-between border-t border-slate-100 pt-4'>
          <span className='text-sm font-semibold text-indigo-600'>
            View room
          </span>

          <span className='text-xs font-medium text-slate-400 transition group-hover:text-indigo-500'>
            Reserve a slot →
          </span>
        </div>
      </div>
    </Link>
  );
}

