import { Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='mt-10 border-t bg-white'>
      <div className='mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-sm font-semibold text-gray-900'>ConferenceBook</p>
          <p className='mt-1 text-sm text-gray-600'>
            MVP reservations for buildings and teams.
          </p>
          <p className='mt-2 text-xs text-gray-500'>
            © {new Date().getFullYear()} ConferenceBook. All rights reserved.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <a
            href='mailto:support@conferencebook.local'
            className='inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'
          >
            <Mail className='h-4 w-4' />
            Contact
          </a>

          <a
            href='#'
            className='inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'
          >
            <Github className='h-4 w-4' />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
