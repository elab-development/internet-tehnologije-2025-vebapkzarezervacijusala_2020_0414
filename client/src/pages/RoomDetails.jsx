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
  const fetchByRoomAndDate = useReservationStore(
    (s) => s.fetchByRoomAndDate,
  );
  const createReservation = useReservationStore(
    (s) => s.createReservation,
  );
  const updateReservationTime = useReservationStore(
    (s) => s.updateReservationTime,
  );
  const deleteReservation = useReservationStore(
    (s) => s.deleteReservation,
  );

  const [date, setDate] = useState(todayDateOnlyUtc());

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
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

    fetchByRoomAndDate({
      roomId: idNum,
      date,
    });
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
      <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700'>
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
      await createReservation({
        roomId,
        startTime,
        endTime,
      });
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
      {/* Room header */}
      <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
        <div className='h-2 bg-indigo-600' />

        <div className='p-6 sm:p-8'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
            {/* Icon */}
            <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700'>
              <DoorOpen className='h-8 w-8' />
            </div>

            {/* Room information */}
            <div className='flex-1'>
              <p className='mb-1 text-sm font-semibold uppercase tracking-wider text-indigo-600'>
                Conference room
              </p>

              <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
                {room?.name || 'Room'}
              </h1>

              <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                <div className='flex items-center gap-2 text-sm text-slate-600'>
                  <Users className='h-4 w-4 text-indigo-500' />
                  <span>Capacity:</span>
                  <span className='font-semibold text-slate-900'>
                    {room?.capacity ?? '-'}
                  </span>
                </div>

                <div className='flex items-center gap-2 text-sm text-slate-600'>
                  <Tag className='h-4 w-4 text-indigo-500' />
                  <span>Type:</span>
                  <span className='font-semibold text-slate-900'>
                    {headerMeta?.roomTypeName || '-'}
                  </span>
                </div>

                <div className='flex items-center gap-2 text-sm text-slate-600 sm:col-span-2'>
                  <Building2 className='h-4 w-4 text-indigo-500' />
                  <span>Building:</span>
                  <span className='font-semibold text-slate-900'>
                    {headerMeta?.buildingName || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Capacity badge */}
            {room && (
              <div className='rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-center'>
                <Users className='mx-auto mb-1 h-5 w-5 text-indigo-600' />

                <p className='text-2xl font-bold text-slate-900'>
                  {room.capacity}
                </p>

                <p className='text-xs font-medium text-slate-500'>
                  seats
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className='flex justify-center py-12'>
          <div className='h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600' />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700'>
          {error}
        </div>
      )}

      {/* Guest view */}
      {!user && !roomLoading && (
        <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
          <div className='h-1.5 bg-indigo-600' />

          <div className='p-6 sm:p-8'>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <div className='flex items-center gap-2'>
                  <CalendarDays className='h-5 w-5 text-indigo-600' />

                  <h2 className='text-xl font-bold text-slate-900'>
                    Reserve this room
                  </h2>
                </div>

                <p className='mt-2 max-w-xl text-sm leading-6 text-slate-500'>
                  Log in to view room availability and create reservations.
                </p>
              </div>

              <Link
                to='/login'
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md'
              >
                <LogIn className='h-4 w-4' />
                Login to reserve
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Logged in view */}
      {user && room && !roomLoading && (
        <div className='space-y-5'>
          {/* Availability header */}
          <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'>
            <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
              <div>
                <div className='flex items-center gap-2'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700'>
                    <CalendarDays className='h-5 w-5' />
                  </div>

                  <div>
                    <h2 className='text-xl font-bold text-slate-900'>
                      Room availability
                    </h2>

                    <p className='text-sm text-slate-500'>
                      Select a date and choose an available time slot.
                    </p>
                  </div>
                </div>
              </div>

              {/* Date picker */}
              <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2'>
                <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm'>
                  <CalendarDays className='h-4 w-4' />
                </div>

                <div>
                  <label
                    htmlFor='room-date'
                    className='block text-[11px] font-semibold uppercase tracking-wider text-slate-400'
                  >
                    Date
                  </label>

                  <input
                    id='room-date'
                    type='date'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className='bg-transparent text-sm font-semibold text-slate-900 outline-none'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timetable */}
          <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
            <div className='border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6'>
              <h3 className='text-sm font-semibold text-slate-900'>
                Available time slots
              </h3>

              <p className='mt-1 text-xs text-slate-500'>
                Click an available slot to make a reservation. Click your own
                reservation to edit or delete it.
              </p>
            </div>

            <div className='p-4 sm:p-6'>
              <RoomTimeTable
                date={date}
                room={room}
                reservations={reservations}
                currentUserId={user.id}
                onClickFreeSlot={openCreate}
                onClickOwnReservation={openEdit}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reservation modal */}
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

