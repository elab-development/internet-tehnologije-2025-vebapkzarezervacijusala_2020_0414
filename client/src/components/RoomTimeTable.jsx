import { addMinutesUtc, overlaps, formatHHMMUtc } from '../lib/datetime';
import { useHolidays } from '../hooks/useHolidays';
import { CalendarX2, Clock3 } from 'lucide-react';

export default function RoomTimeTable({
  date,
  room,
  reservations,
  currentUserId,
  onClickFreeSlot,
  onClickOwnReservation,
}) {
  const { isHoliday, holiday } = useHolidays(date, 'RS');

  const workStartHHMM = formatHHMMUtc(room.workingHoursStart);
  const workEndHHMM = formatHHMMUtc(room.workingHoursEnd);

  const start = new Date(`${date}T${workStartHHMM}:00.000Z`);
  const end = new Date(`${date}T${workEndHHMM}:00.000Z`);

  const slots = [];

  for (
    let t = new Date(start);
    t < end;
    t = addMinutesUtc(t, 30)
  ) {
    const next = addMinutesUtc(t, 30);

    slots.push({
      start: new Date(t),
      end: next,
    });
  }

  const resList = (reservations || []).map((r) => ({
    ...r,
    _start: new Date(r.startTime),
    _end: new Date(r.endTime),
  }));

  const findReservationForSlot = (slot) => {
    return resList.find((r) =>
      overlaps(slot.start, slot.end, r._start, r._end),
    );
  };

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'>
      {/* Header */}
      <div className='mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex items-start gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700'>
            <Clock3 className='h-5 w-5' />
          </div>

          <div>
            <h3 className='text-base font-bold text-slate-900'>
              Time table
            </h3>

            <p className='mt-0.5 text-xs text-slate-500'>
              Working hours: {workStartHHMM} – {workEndHHMM} (UTC)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-600'>
          <span className='inline-flex items-center gap-2'>
            <span className='h-3 w-3 rounded border border-slate-200 bg-white shadow-sm' />
            Free
          </span>

          <span className='inline-flex items-center gap-2'>
            <span className='h-3 w-3 rounded border border-red-200 bg-red-100' />
            Busy
          </span>

          <span className='inline-flex items-center gap-2'>
            <span className='h-3 w-3 rounded border border-amber-200 bg-amber-100' />
            Holiday
          </span>
        </div>
      </div>

      {/* Holiday notice */}
      {isHoliday && (
        <div className='mb-5 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50'>
          <div className='flex items-start gap-3 px-4 py-3.5'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700'>
              <CalendarX2 className='h-5 w-5' />
            </div>

            <div>
              <p className='text-sm font-semibold text-amber-900'>
                Public holiday — reservations disabled
              </p>

              <p className='mt-0.5 text-xs text-amber-700'>
                {holiday?.localName || holiday?.name || 'Holiday'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Time slots */}
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {slots.map((slot, idx) => {
          const r = findReservationForSlot(slot);

          const hhmm = formatHHMMUtc(slot.start);
          const hhmmEnd = formatHHMMUtc(slot.end);

          const isBusy = Boolean(r);
          const isMine = r && r.user?.id === currentUserId;

          const base =
            'group min-h-[58px] rounded-xl border px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between gap-3';

          const holidayCls =
            'border-amber-200 bg-amber-50 text-amber-900 cursor-not-allowed';

          const freeCls =
            'border-slate-200 bg-white text-slate-900 cursor-pointer hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm';

          const busyOtherCls =
            'border-red-200 bg-red-50 text-red-800 cursor-not-allowed';

          const busyMineCls =
            'border-indigo-200 bg-indigo-50 text-indigo-800 cursor-pointer hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-sm';

          const disabled = isHoliday || (isBusy && !isMine);

          return (
            <button
              key={idx}
              type='button'
              disabled={disabled}
              className={[
                base,
                isHoliday
                  ? holidayCls
                  : !isBusy
                    ? freeCls
                    : isMine
                      ? busyMineCls
                      : busyOtherCls,
              ].join(' ')}
              onClick={() => {
                if (isHoliday) return;

                if (!isBusy) {
                  onClickFreeSlot({
                    startHHMM: hhmm,
                    endHHMM: hhmmEnd,
                  });
                } else if (isMine) {
                  onClickOwnReservation(r);
                }
              }}
              title={
                isHoliday
                  ? 'Public holiday — reservations disabled'
                  : isBusy
                    ? isMine
                      ? 'Your reservation (click to edit)'
                      : 'Reserved'
                    : 'Click to reserve'
              }
            >
              <div className='flex min-w-0 flex-col items-start'>
                <span
                  className={
                    isHoliday
                      ? 'font-semibold text-amber-900'
                      : isBusy
                        ? isMine
                          ? 'font-semibold text-indigo-900'
                          : 'font-semibold text-red-900'
                        : 'font-semibold text-slate-900'
                  }
                >
                  {hhmm} – {hhmmEnd}
                </span>

                {!isHoliday && isMine && (
                  <span className='mt-0.5 text-[11px] text-indigo-600'>
                    Your reservation
                  </span>
                )}
              </div>

              <span
                className={[
                  'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                  isHoliday
                    ? 'bg-amber-100 text-amber-700'
                    : isBusy
                      ? isMine
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-red-100 text-red-700'
                      : 'bg-emerald-50 text-emerald-700',
                ].join(' ')}
              >
                {isHoliday
                  ? 'Holiday'
                  : isBusy
                    ? isMine
                      ? 'Yours'
                      : 'Busy'
                    : 'Free'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
