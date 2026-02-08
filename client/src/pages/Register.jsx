import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function Register() {
  const navigate = useNavigate();

  const register = useAuthStore((s) => s.register);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const authError = useAuthStore((s) => s.authError);
  const clearAuthError = useAuthStore((s) => s.clearAuthError);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldError, setFieldError] = useState('');

  useEffect(() => {
    clearAuthError();
  }, []);

  const onChange = (e) => {
    setFieldError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      return 'All fields are required.';
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
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
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/', { replace: true });
    } catch {}
  };

  return (
    <div className='flex min-h-[calc(100vh-160px)] items-center justify-center px-4'>
      <div className='w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm'>
        <div className='mb-6 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white'>
            <UserPlus className='h-5 w-5' />
          </div>
          <div>
            <h1 className='text-lg font-semibold text-gray-900'>Register</h1>
            <p className='text-sm text-gray-500'>
              Create your account to book rooms.
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
              Full name
            </label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <input
                name='fullName'
                type='text'
                value={form.fullName}
                onChange={onChange}
                placeholder='John Doe'
                className='w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-gray-900'
                autoComplete='name'
              />
            </div>
          </div>

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
                placeholder='Min 6 characters'
                className='w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-gray-900'
                autoComplete='new-password'
              />
            </div>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Confirm password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <input
                name='confirmPassword'
                type='password'
                value={form.confirmPassword}
                onChange={onChange}
                placeholder='Repeat password'
                className='w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-gray-900'
                autoComplete='new-password'
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
                Creating...
              </>
            ) : (
              <>
                <UserPlus className='h-4 w-4' />
                Register
              </>
            )}
          </button>
        </form>

        <p className='mt-5 text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium text-gray-900 hover:underline'
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}