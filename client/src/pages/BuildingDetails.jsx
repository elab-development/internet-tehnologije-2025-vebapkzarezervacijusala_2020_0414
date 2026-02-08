import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, MapPin } from 'lucide-react';

import { useBuildingStore } from '../stores/buildingStore';
import { useRoomStore } from '../stores/roomStore';
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

  useEffect(() => {
    if (!Number.isInteger(idNum)) return;
    fetchBuildingById(idNum);
    fetchRooms({ buildingId: idNum });
  }, [idNum, fetchBuildingById, fetchRooms]);

  const isLoading = buildingLoading || roomsLoading;
  const error = buildingError || roomsError;

  if (!Number.isInteger(idNum)) {
    return (
      <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
        Invalid building id.
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header / Building info */}
      <div className='rounded-2xl border bg-white p-6 shadow-sm'>
        <div className='flex items-start gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white'>
            <Building2 className='h-6 w-6' />
          </div>

          <div className='flex-1'>
            <h1 className='text-2xl font-bold text-gray-900'>
              {building?.name || 'Building'}
            </h1>

            {building?.address && (
              <div className='mt-2 flex items-center gap-2 text-sm text-gray-600'>
                <MapPin className='h-4 w-4 text-gray-400' />
                {building.address}
              </div>
            )}

            {building?.description && (
              <p className='mt-3 text-sm text-gray-600'>
                {building.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* States */}
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

      {/* Rooms */}
      {!isLoading && !error && (
        <div>
          <div className='mb-4 flex items-end justify-between gap-3'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>Rooms</h2>
              <p className='text-sm text-gray-500'>
                Available rooms in this building.
              </p>
            </div>

            <div className='text-sm text-gray-500'>
              Total:{' '}
              <span className='font-medium text-gray-900'>{rooms.length}</span>
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className='rounded-xl border bg-white p-6 text-sm text-gray-600'>
              No rooms found for this building.
            </div>
          ) : (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
