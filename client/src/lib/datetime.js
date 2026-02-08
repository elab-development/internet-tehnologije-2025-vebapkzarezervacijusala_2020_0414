export function todayDateOnlyUtc() {
  return new Date().toISOString().slice(0, 10);
}

export function toUtcDateFromDateOnlyAndTime(dateOnly, hhmm) {
  return new Date(`${dateOnly}T${hhmm}:00.000Z`);
}

export function formatHHMMUtc(date) {
  return new Date(date).toISOString().slice(11, 16);
}

export function addMinutesUtc(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}
