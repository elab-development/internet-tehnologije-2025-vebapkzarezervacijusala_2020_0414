
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarCheck2,
  Sparkles,
} from 'lucide-react';

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
    <div className='space-y-10'>
      {/* Hero */}
      <section className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 px-6 py-12 text-white shadow-xl shadow-indigo-100 sm:px-10 lg:px-14 lg:py-16'>
        {/* Decorative shapes */}
        <div className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl' />
        <div className='absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl' />

        <div className='relative max-w-3xl'>
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur'>
            <Sparkles className='h-4 w-4' />
            Conference room booking
          </div>

          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
            Find the right space for your next meeting.
          </h1>

          <p className='mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg'>
            Explore available buildings, find the perfect conference room,
            and reserve your preferred time slot in just a few clicks.
          </p>

          <div className='mt-8 flex flex-wrap gap-3'>
            {/* Explore buildings */}
            <a
              href='#buildings'
              className='inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold !text-indigo-700 shadow-lg transition hover:bg-indigo-50'
            >
              Explore buildings
              <ArrowRight className='h-4 w-4 !text-indigo-700' />
            </a>

            {/* Start reserving */}
            <Link
              to='/login'
              className='inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold !text-white backdrop-blur transition hover:bg-white/20'
            >
              <CalendarCheck2 className='h-4 w-4' />
              Start reserving
            </Link>
          </div>
        </div>
      </section>

      {/* Buildings section */}
      <section id='buildings'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600'>
              <Building2 className='h-4 w-4' />
              AVAILABLE LOCATIONS
            </div>

            <h2 className='text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl'>
              Choose a building
            </h2>

            <p className='mt-1 text-sm text-slate-500'>
              Browse buildings and discover available conference rooms.
            </p>
          </div>

          {!isLoading && buildings.length > 0 && (
            <div className='inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm'>
              <Building2 className='h-4 w-4 text-indigo-600' />
              {buildings.length}{' '}
              {buildings.length === 1 ? 'building' : 'buildings'}
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className='rounded-2xl border border-slate-200 bg-white py-20 shadow-sm'>
            <div className='flex flex-col items-center justify-center'>
              <div className='h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600' />

              <p className='mt-4 text-sm font-medium text-slate-600'>
                Loading buildings...
              </p>

              <p className='mt-1 text-xs text-slate-400'>
                Please wait a moment.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className='rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm'>
            <p className='font-semibold'>Unable to load buildings</p>
            <p className='mt-1 text-sm'>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && buildings.length === 0 && !error && (
          <div className='rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600'>
              <Building2 className='h-7 w-7' />
            </div>

            <h3 className='mt-4 text-lg font-semibold text-slate-900'>
              No buildings available
            </h3>

            <p className='mx-auto mt-1 max-w-md text-sm text-slate-500'>
              There are currently no buildings available for reservation.
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && buildings.length > 0 && (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {buildings.map((building) => (
              <BuildingCard key={building.id} building={building} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

