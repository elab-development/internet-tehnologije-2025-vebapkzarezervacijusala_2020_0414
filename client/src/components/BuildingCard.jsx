import { Link } from 'react-router-dom';
import { Building2, MapPin, ArrowRight } from 'lucide-react';

export default function BuildingCard({ building }) {
  return (
    <Link
      to={`/building/${building.id}`}
      className='group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50'
    >
      {/* Top accent */}
      <div className='h-1.5 bg-gradient-to-r from-indigo-600 to-blue-500' />

      <div className='p-6'>

        {/* Icon */}
        <div className='mb-5'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white'>
            <Building2 className='h-6 w-6' />
          </div>
        </div>

        {/* Name */}
        <h3 className='text-xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-indigo-600'>
          {building.name}
        </h3>

        {/* Address */}
        <div className='mt-2 flex items-start gap-2 text-sm text-slate-500'>
          <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-indigo-500' />

          <span>
            {building.address || 'Address not available'}
          </span>
        </div>

        {/* Description */}
        {building.description ? (
          <p className='mt-4 line-clamp-2 text-sm leading-6 text-slate-600'>
            {building.description}
          </p>
        ) : (
          <p className='mt-4 text-sm italic text-slate-400'>
            No description available.
          </p>
        )}

        {/* Divider */}
        <div className='my-5 border-t border-slate-100' />

        {/* Action */}
        <div className='flex items-center justify-between'>

          <span className='text-sm font-semibold text-slate-700 transition-colors duration-300 group-hover:text-indigo-600'>
            Explore building
          </span>

          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white'>
            <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5' />
          </div>

        </div>
      </div>
    </Link>
  );
}

