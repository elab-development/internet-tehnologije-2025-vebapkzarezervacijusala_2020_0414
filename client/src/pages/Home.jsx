import { useEffect } from 'react';
import { Building2 } from 'lucide-react';

import { useBuildingStore } from '../stores/buildingStore';
import BuildingCard from '../components/BuildingCard';

export default function Home() {
  const buildings = useBuildingStore((s) => s.buildings);
  const isLoading = useBuildingStore((s) => s.isLoading);
  const error = useBuildingStore((s) => s.error);
  const fetchBuildings = useBuildingStore((s) => s.fetchBuildings);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  return (
    <div>
      {/* Header */}
      <div className='mb-8 flex items-center gap-3'>
        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white'>
          <Building2 className='h-6 w-6' />
        </div>

        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Buildings</h1>
          <p className='text-sm text-gray-500'>
            Browse available buildings and reserve rooms.
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className='flex justify-center py-16'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Empty */}
      {!isLoading && buildings.length === 0 && (
        <div className='text-center text-gray-500 py-12'>
          No buildings available.
        </div>
      )}

      {/* Grid */}
      {!isLoading && buildings.length > 0 && (
        <div
          className='
          grid gap-6
          sm:grid-cols-2
          lg:grid-cols-3
        '
        >
          {buildings.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      )}
    </div>
  );
}
