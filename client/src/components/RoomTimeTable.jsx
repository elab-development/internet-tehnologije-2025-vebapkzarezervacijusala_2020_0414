import { addMinutesUtc, overlaps, formatHHMMUtc } from '../lib/datetime';

export default function RoomTimeTable({
  date,
  room,
  reservations,
  currentUserId,
  onClickFreeSlot,
  onClickOwnReservation,
}) {
  const workStartHHMM = formatHHMMUtc(room.workingHoursStart);
  const workEndHHMM = formatHHMMUtc(room.workingHoursEnd);

  const start = new Date(`${date}T${workStartHHMM}:00.000Z`);
  const end = new Date(`${date}T${workEndHHMM}:00.000Z`);

  const slots = [];
  for (let t = new Date(start); t < end; t = addMinutesUtc(t, 30)) {
    const next = addMinutesUtc(t, 30);
    slots.push({ start: new Date(t), end: next });
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
    <div className='rounded-2xl border bg-white p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <div>
          <h3 className='text-sm font-semibold text-gray-900'>Time table</h3>
          <p className='text-xs text-gray-500'>
            {workStartHHMM} – {workEndHHMM} (UTC)
          </p>
        </div>

        <div className='flex items-center gap-2 text-xs'>
          <span className='inline-flex items-center gap-2'>
            <span className='h-3 w-3 rounded bg-gray-100 border' />
            Free
          </span>
          <span className='inline-flex items-center gap-2'>
            <span className='h-3 w-3 rounded bg-red-200 border border-red-300' />
            Busy
          </span>
        </div>
      </div>

      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {slots.map((slot, idx) => {
          const r = findReservationForSlot(slot);
          const hhmm = formatHHMMUtc(slot.start);
          const hhmmEnd = formatHHMMUtc(slot.end);

          const isBusy = Boolean(r);
          const isMine = r && r.user?.id === currentUserId;

          const base =
            'rounded-xl border px-3 py-2 text-sm flex items-center justify-between transition';
          const freeCls = 'bg-white hover:bg-gray-50 cursor-pointer';
          const busyOtherCls =
            'bg-red-200 border-red-200 text-red-800 cursor-not-allowed';
          const busyMineCls =
            'bg-red-50 border-red-200 text-red-800 cursor-pointer hover:bg-red-100';

          return (
            <button
              key={idx}
              type='button'
              className={[
                base,
                !isBusy ? freeCls : isMine ? busyMineCls : busyOtherCls,
              ].join(' ')}
              disabled={isBusy && !isMine}
              onClick={() => {
                if (!isBusy)
                  onClickFreeSlot({ startHHMM: hhmm, endHHMM: hhmmEnd });
                else if (isMine) onClickOwnReservation(r);
              }}
              title={
                isBusy
                  ? isMine
                    ? 'Your reservation (click to edit)'
                    : 'Reserved'
                  : 'Click to reserve'
              }
            >
              <span className='font-medium text-gray-900'>
                {hhmm} – {hhmmEnd}
              </span>
              <span className='text-xs text-gray-500'>
                {isBusy ? (isMine ? 'Yours' : 'Busy') : 'Free'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}