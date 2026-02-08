import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Home, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isLoggedIn = Boolean(user);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      close();
      navigate('/');
    } catch {
      close();
    }
  };

  const navItemClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? 'bg-gray-900 text-white'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <header className='sticky top-0 z-50 border-b bg-white/80 backdrop-blur'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
        {/* Brand */}
        <Link
          to='/'
          className='flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100'
          onClick={close}
        >
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white'>
            <Home className='h-5 w-5' />
          </div>
          <div className='leading-tight'>
            <p className='text-sm font-semibold text-gray-900'>
              ConferenceBook
            </p>
            <p className='text-xs text-gray-500'>Room reservations</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className='hidden items-center gap-2 md:flex'>
          <NavLink to='/' className={navItemClass}>
            <Home className='h-4 w-4' />
            Home
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to='/profile' className={navItemClass}>
                <User className='h-4 w-4' />
                Profile
              </NavLink>

              <button
                onClick={handleLogout}
                className='inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900'
              >
                <LogOut className='h-4 w-4' />
                Logout
              </button>

              <div className='ml-2 flex items-center gap-2 rounded-xl border bg-white px-3 py-2'>
                <div className='leading-tight'>
                  <p className='max-w-[160px] truncate text-sm font-medium text-gray-900'>
                    {user.fullName}
                  </p>
                  <p className='text-xs text-gray-500'>{user.role}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <NavLink to='/login' className={navItemClass}>
                <LogIn className='h-4 w-4' />
                Login
              </NavLink>
              <NavLink to='/register' className={navItemClass}>
                <UserPlus className='h-4 w-4' />
                Register
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className='inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden'
          aria-label='Toggle menu'
        >
          {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className='border-t bg-white md:hidden'>
          <div className='mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3'>
            <NavLink to='/' className={navItemClass} onClick={close}>
              <Home className='h-4 w-4' />
              Home
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink to='/profile' className={navItemClass} onClick={close}>
                  <User className='h-4 w-4' />
                  Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className='inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900'
                >
                  <LogOut className='h-4 w-4' />
                  Logout
                </button>

                <div className='mt-2 rounded-xl border bg-gray-50 p-3'>
                  <p className='text-sm font-medium text-gray-900'>
                    {user.fullName}
                  </p>
                  <p className='text-xs text-gray-500'>{user.email}</p>
                </div>
              </>
            ) : (
              <>
                <NavLink to='/login' className={navItemClass} onClick={close}>
                  <LogIn className='h-4 w-4' />
                  Login
                </NavLink>
                <NavLink
                  to='/register'
                  className={navItemClass}
                  onClick={close}
                >
                  <UserPlus className='h-4 w-4' />
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
