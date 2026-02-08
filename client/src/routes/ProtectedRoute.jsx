import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <div className='flex justify-center py-10'>
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return children;
}
