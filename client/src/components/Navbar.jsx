import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
Menu,
X,
Home,
LogIn,
UserPlus,
User,
LogOut,
Shield,
Settings,
LayoutDashboard,
} from 'lucide-react';

import { useAuthStore } from '../stores/authStore';

export default function Navbar() {
const [open, setOpen] = useState(false);
const navigate = useNavigate();

const user = useAuthStore((s) => s.user);
const logout = useAuthStore((s) => s.logout);

const isLoggedIn = Boolean(user);
const isAdmin = user?.role === 'ADMIN';

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
`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
    }`;

return ( <header className='sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl'> <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6'>
{/* Brand */} <Link
       to='/'
       className='flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50'
       onClick={close}
     > <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200'> <Home className='h-5 w-5' /> </div>

```
      <div className='leading-tight'>
        <p className='text-[15px] font-bold tracking-tight text-slate-900'>
          ConferenceBook
        </p>
        <p className='text-xs text-slate-500'>
          Conference room reservations
        </p>
      </div>
    </Link>

    {/* Desktop navigation */}
    <nav className='hidden items-center gap-1.5 md:flex'>
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

          {isAdmin && (
            <>
              <NavLink to='/admin' className={navItemClass}>
                <LayoutDashboard className='h-4 w-4' />
                Dashboard
              </NavLink>

              <NavLink to='/admin/manage' className={navItemClass}>
                <Settings className='h-4 w-4' />
                Manage
              </NavLink>
            </>
          )}

          <button
            onClick={handleLogout}
            className='inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600'
          >
            <LogOut className='h-4 w-4' />
            Logout
          </button>

          <div className='ml-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700'>
              {isAdmin ? (
                <Shield className='h-4 w-4' />
              ) : (
                <User className='h-4 w-4' />
              )}
            </div>

            <div className='leading-tight'>
              <p className='max-w-40 truncate text-sm font-semibold text-slate-900'>
                {user.fullName}
              </p>

              <p className='text-xs font-medium text-indigo-600'>
                {user.role}
              </p>
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
      className='inline-flex items-center justify-center rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 md:hidden'
      aria-label='Toggle menu'
    >
      {open ? (
        <X className='h-5 w-5' />
      ) : (
        <Menu className='h-5 w-5' />
      )}
    </button>
  </div>

  {/* Mobile menu */}
  {open && (
    <div className='border-t border-slate-200 bg-white md:hidden'>
      <div className='mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-4'>
        <NavLink to='/' className={navItemClass} onClick={close}>
          <Home className='h-4 w-4' />
          Home
        </NavLink>

        {isLoggedIn ? (
          <>
            <NavLink
              to='/profile'
              className={navItemClass}
              onClick={close}
            >
              <User className='h-4 w-4' />
              Profile
            </NavLink>

            {isAdmin && (
              <>
                <NavLink
                  to='/admin'
                  className={navItemClass}
                  onClick={close}
                >
                  <LayoutDashboard className='h-4 w-4' />
                  Dashboard
                </NavLink>

                <NavLink
                  to='/admin/manage'
                  className={navItemClass}
                  onClick={close}
                >
                  <Settings className='h-4 w-4' />
                  Manage
                </NavLink>
              </>
            )}

            <button
              onClick={handleLogout}
              className='inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600'
            >
              <LogOut className='h-4 w-4' />
              Logout
            </button>

            <div className='mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700'>
                {isAdmin ? (
                  <Shield className='h-4 w-4' />
                ) : (
                  <User className='h-4 w-4' />
                )}
              </div>

              <div>
                <p className='text-sm font-semibold text-slate-900'>
                  {user.fullName}
                </p>
                <p className='text-xs text-slate-500'>{user.email}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <NavLink
              to='/login'
              className={navItemClass}
              onClick={close}
            >
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
