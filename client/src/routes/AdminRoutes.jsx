import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function AdminRoutes({ children }) {
  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  if (isAuthLoading) {
    return (
      <div className='flex justify-center py-10'>
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to='/' replace />;
  }

  return children;
}