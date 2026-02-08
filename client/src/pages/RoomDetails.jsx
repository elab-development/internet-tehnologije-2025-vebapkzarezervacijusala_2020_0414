import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  DoorOpen,
  Users,
  Building2,
  Tag,
  LogIn,
  CalendarDays,
} from 'lucide-react';

import { useAuthStore } from '../stores/authStore';
import { useRoomStore } from '../stores/roomStore';
import { useReservationStore } from '../stores/reservationStore';

import ReservationModal from '../components/ReservationModal';
import RoomTimeTable from '../components/RoomTimeTable';
import { todayDateOnlyUtc } from '../lib/datetime';

export default function RoomDetails() {
  const { roomId } = useParams();
  const idNum = Number(roomId);

  const user = useAuthStore((s) => s.user);

  const room = useRoomStore((s) => s.activeRoom);
  const roomLoading = useRoomStore((s) => s.isLoading);
  const roomError = useRoomStore((s) => s.error);
  const fetchRoomById = useRoomStore((s) => s.fetchRoomById);

  const reservations = useReservationStore((s) => s.reservations);
  const resLoading = useReservationStore((s) => s.isLoading);
  const resError = useReservationStore((s) => s.error);
  const fetchByRoomAndDate = useReservationStore((s) => s.fetchByRoomAndDate);
  const createReservation = useReservationStore((s) => s.createReservation);
  const updateReservationTime = useReservationStore(
    (s) => s.updateReservationTime,
  );
  const deleteReservation = useReservationStore((s) => s.deleteReservation);

  const [date, setDate] = useState(todayDateOnlyUtc());

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create | edit
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [initialStartHHMM, setInitialStartHHMM] = useState('09:00');
  const [initialEndHHMM, setInitialEndHHMM] = useState('09:30');

  useEffect(() => {
    if (!Number.isInteger(idNum)) return;
    fetchRoomById(idNum);
  }, [idNum, fetchRoomById]);

  useEffect(() => {
    if (!Number.isInteger(idNum)) return;
    if (!user) return;
    fetchByRoomAndDate({ roomId: idNum, date });
  }, [idNum, date, user, fetchByRoomAndDate]);

  const isLoading = roomLoading || (user ? resLoading : false);
  const error = roomError || (user ? resError : null);

  const headerMeta = useMemo(() => {
    if (!room) return null;
    return {
      buildingName: room.building?.name,
      roomTypeName: room.roomType?.name,
    };
  }, [room]);

  if (!Number.isInteger(idNum)) {
    return (
      <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
        Invalid room id.
      </div>
    );
  }

  const openCreate = ({ startHHMM, endHHMM }) => {
    setModalMode('create');
    setSelectedReservation(null);
    setInitialStartHHMM(startHHMM);
    setInitialEndHHMM(endHHMM);
    setModalOpen(true);
  };

  const openEdit = (reservation) => {
    setModalMode('edit');
    setSelectedReservation(reservation);
    setModalOpen(true);
  };

  const handleSubmit = async ({ roomId, startTime, endTime }) => {
    if (modalMode === 'create') {
      await createReservation({ roomId, startTime, endTime });
    } else {
      await updateReservationTime(selectedReservation.id, {
        startTime,
        endTime,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteReservation(id);
    setModalOpen(false);
  };

  return (
    <div className='space-y-8'>
      {/* Room info */}
      <div className='rounded-2xl border bg-white p-6 shadow-sm'>
        <div className='flex items-start gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white'>
            <DoorOpen className='h-6 w-6' />
          </div>

          <div className='flex-1'>
            <h1 className='text-2xl font-bold text-gray-900'>
              {room?.name || 'Room'}
            </h1>

            <div className='mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-gray-400' />
                Capacity:{' '}
                <span className='font-medium text-gray-900'>
                  {room?.capacity ?? '-'}
                </span>
              </div>

              <div className='flex items-center gap-2'>
                <Tag className='h-4 w-4 text-gray-400' />
                Type:{' '}
                <span className='font-medium text-gray-900'>
                  {headerMeta?.roomTypeName || '-'}
                </span>
              </div>

              <div className='flex items-center gap-2 sm:col-span-2'>
                <Building2 className='h-4 w-4 text-gray-400' />
                Building:{' '}
                <span className='font-medium text-gray-900'>
                  {headerMeta?.buildingName || '-'}
                </span>
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

      {/* Guest view */}
      {!user && !roomLoading && (
        <div className='rounded-2xl border bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Reserve this room
          </h2>
          <p className='mt-1 text-sm text-gray-600'>
            You need to be logged in to view availability and create
            reservations.
          </p>

          <Link
            to='/login'
            className='mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black'
          >
            <LogIn className='h-4 w-4' />
            Login to reserve
          </Link>
        </div>
      )}

      {/* Logged in view */}
      {user && room && !roomLoading && (
        <div className='space-y-4'>
          {/* Date picker */}
          <div className='rounded-2xl border bg-white p-4 shadow-sm'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Availability
                </h2>
                <p className='text-sm text-gray-500'>
                  Pick a date to see reservations.
                </p>
              </div>

              <div className='flex items-center gap-2'>
                <CalendarDays className='h-4 w-4 text-gray-500' />
                <input
                  type='date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className='rounded-xl border px-3 py-2 text-sm outline-none focus:border-gray-900'
                />
              </div>
            </div>
          </div>

          {/* TimeTable */}
          <RoomTimeTable
            date={date}
            room={room}
            reservations={reservations}
            currentUserId={user.id}
            onClickFreeSlot={openCreate}
            onClickOwnReservation={openEdit}
          />
        </div>
      )}

      {/* Modal */}
      <ReservationModal
        open={modalOpen}
        mode={modalMode}
        date={date}
        roomId={idNum}
        reservation={selectedReservation}
        initialStartHHMM={initialStartHHMM}
        initialEndHHMM={initialEndHHMM}
        isLoading={resLoading}
        error={resError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={modalMode === 'edit' ? handleDelete : null}
      />
    </div>
  );
}
