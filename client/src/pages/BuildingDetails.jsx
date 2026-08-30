import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, MapPin, DoorOpen } from 'lucide-react';

import { useBuildingStore } from '../stores/buildingStore';
import { useRoomStore } from '../stores/roomStore';
import { geocodeAddress } from '../api/geocode';
import RoomCard from '../components/RoomCard';

export default function BuildingDetails() {
  const { buildingId } = useParams();
  const idNum = Number(buildingId);

  const building = useBuildingStore((s) => s.activeBuilding);
  const buildingLoading = useBuildingStore((s) => s.isLoading);
  const buildingError = useBuildingStore((s) => s.error);
  const fetchBuildingById = useBuildingStore((s) => s.fetchBuildingById);

  const rooms = useRoomStore((s) => s.rooms);
  const roomsLoading = useRoomStore((s) => s.isLoading);
  const roomsError = useRoomStore((s) => s.error);
  const fetchRooms = useRoomStore((s) => s.fetchRooms);

  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!building?.address) return;

    geocodeAddress(building.address).then(setCoords);
  }, [building]);

  useEffect(() => {
    if (!Number.isInteger(idNum)) return;

    fetchBuildingById(idNum);
    fetchRooms({ buildingId: idNum });
  }, [idNum, fetchBuildingById, fetchRooms]);

  const isLoading = buildingLoading || roomsLoading;
  const error = buildingError || roomsError;

  if (!Number.isInteger(idNum)) {
    return (
      <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700'>
        Invalid building id.
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Building header */}
      <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
        {/* Top accent */}
        <div className='h-2 bg-indigo-600' />

        <div className='p-6 sm:p-8'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
            {/* Icon */}
            <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700'>
              <Building2 className='h-8 w-8' />
            </div>

            {/* Building information */}
            <div className='flex-1'>
              <p className='mb-1 text-sm font-semibold uppercase tracking-wider text-indigo-600'>
                Conference building
              </p>

              <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
                {building?.name || 'Building'}
              </h1>

              {building?.address && (
                <div className='mt-3 flex items-center gap-2 text-sm text-slate-600'>
                  <MapPin className='h-4 w-4 text-indigo-500' />
                  <span>{building.address}</span>
                </div>
              )}

              {building?.description && (
                <p className='mt-4 max-w-3xl text-sm leading-6 text-slate-600'>
                  {building.description}
                </p>
              )}

              {coords && (
                <div className='mt-5'>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}`}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100'
                  >
                    <MapPin className='h-4 w-4' />
                    View on map
                  </a>
                </div>
              )}
            </div>

            {/* Room count */}
            {!roomsLoading && (
              <div className='rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center sm:min-w-28'>
                <DoorOpen className='mx-auto mb-1 h-5 w-5 text-indigo-600' />
                <p className='text-2xl font-bold text-slate-900'>
                  {rooms.length}
                </p>
                <p className='text-xs font-medium text-slate-500'>
                  {rooms.length === 1 ? 'Room' : 'Rooms'}
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

      {/* Rooms */}
      {!isLoading && !error && (
        <section>
          <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <div className='flex items-center gap-2'>
                <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700'>
                  <DoorOpen className='h-5 w-5' />
                </div>

                <h2 className='text-xl font-bold text-slate-900'>
                  Rooms
                </h2>
              </div>

              <p className='mt-2 text-sm text-slate-500'>
                Choose a room to view availability and reserve a time slot.
              </p>
            </div>

            <div className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm'>
              Total:{' '}
              <span className='font-bold text-indigo-600'>
                {rooms.length}
              </span>
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center'>
              <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400'>
                <DoorOpen className='h-7 w-7' />
              </div>

              <h3 className='mt-4 text-base font-semibold text-slate-900'>
                No rooms available
              </h3>

              <p className='mt-1 text-sm text-slate-500'>
                There are currently no rooms assigned to this building.
              </p>
            </div>
          ) : (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

