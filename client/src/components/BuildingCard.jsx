import { Link } from 'react-router-dom';
import { Building2, MapPin, ArrowRight } from 'lucide-react';

export default function BuildingCard({ building }) {
  return (
    <Link
      to={`/building/${building.id}`}
      className='group block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
    >
      {/* Icon */}
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700'>
        <Building2 className='h-6 w-6' />
      </div>

      {/* Name */}
      <h3 className='mb-1 text-lg font-semibold text-gray-900 group-hover:text-gray-700'>
        {building.name}
      </h3>

      {/* Address */}
      <div className='mb-2 flex items-center gap-2 text-sm text-gray-500'>
        <MapPin className='h-4 w-4' />
        {building.address}
      </div>

      {/* Description */}
      {building.description && (
        <p className='mb-4 line-clamp-2 text-sm text-gray-600'>
          {building.description}
        </p>
      )}

      {/* Action */}
      <div className='flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:gap-3'>
        View details
        <ArrowRight className='h-4 w-4 transition' />
      </div>
    </Link>
  );
}
