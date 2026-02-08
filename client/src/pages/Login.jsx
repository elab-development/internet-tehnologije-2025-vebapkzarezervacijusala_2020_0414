import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const authError = useAuthStore((s) => s.authError);
  const clearAuthError = useAuthStore((s) => s.clearAuthError);

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldError, setFieldError] = useState('');

  useEffect(() => {
    clearAuthError();
  }, []);

  const onChange = (e) => {
    setFieldError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.email.trim() || !form.password.trim()) {
      return 'Email and password are required.';
    }
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    const msg = validate();
    if (msg) {
      setFieldError(msg);
      return;
    }

    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate('/', { replace: true });
    } catch {}
  };

  return (
    <div className='flex min-h-[calc(100vh-160px)] items-center justify-center px-4'>
      <div className='w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm'>
        <div className='mb-6 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white'>
            <LogIn className='h-5 w-5' />
          </div>
          <div>
            <h1 className='text-lg font-semibold text-gray-900'>Login</h1>
            <p className='text-sm text-gray-500'>
              Sign in to manage your reservations.
            </p>
          </div>
        </div>

        {(fieldError || authError) && (
          <div className='mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            {fieldError || authError}
          </div>
        )}

        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Email
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <input
                name='email'
                type='email'
                value={form.email}
                onChange={onChange}
                placeholder='you@example.com'
                className='w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-gray-900'
                autoComplete='email'
              />
            </div>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <input
                name='password'
                type='password'
                value={form.password}
                onChange={onChange}
                placeholder='••••••••'
                className='w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-gray-900'
                autoComplete='current-password'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isAuthLoading}
            className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isAuthLoading ? (
              <>
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className='h-4 w-4' />
                Login
              </>
            )}
          </button>
        </form>

        <p className='mt-5 text-center text-sm text-gray-600'>
          Don&apos;t have an account?{' '}
          <Link
            to='/register'
            className='font-medium text-gray-900 hover:underline'
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
