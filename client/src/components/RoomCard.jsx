import { Link } from 'react-router-dom';
import { DoorOpen, Users, Clock, ArrowRight, Tag } from 'lucide-react';
import { formatTime } from '../lib/datetime';

export default function RoomCard({ room }) {
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
            <h3 className='text-lg font-semibold text-gray-900'>{room.name}</h3>
            <div className='mt-1 flex items-center gap-2 text-sm text-gray-500'>
              <Tag className='h-4 w-4' />
              {room.roomType?.name || 'Room'}
            </div>
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
