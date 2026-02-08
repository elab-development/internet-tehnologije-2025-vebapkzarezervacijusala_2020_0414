/**
 * Checks whether a string is a valid email format.
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid, otherwise false
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates ISO date-time string.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidIsoDateTime(value) {
  if (typeof value !== 'string') return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

/**
 * Parses a date-only string (YYYY-MM-DD) into a UTC day range.
 * @param {string} dateStr
 * @returns {{ start: Date, end: Date } | null}
 */
export function parseDateOnlyToUtcRange(dateStr) {
  if (typeof dateStr !== 'string') return null;
  // strict YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;

  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return { start, end };
}

/**
 * Returns minutes from midnight for a Date (UTC-based).
 * @param {Date} d
 * @returns {number}
 */
export function utcMinutesFromMidnight(d) {
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

/**
 * Checks if a reservation time range is within a room's working hours (time-of-day).
 * Room working hours are stored as DateTime but we compare only the time part (UTC).
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {Date} workingStart
 * @param {Date} workingEnd
 * @returns {boolean}
 */
export function isWithinWorkingHours(
  startTime,
  endTime,
  workingStart,
  workingEnd,
) {
  const s = utcMinutesFromMidnight(startTime);
  const e = utcMinutesFromMidnight(endTime);
  const ws = utcMinutesFromMidnight(workingStart);
  const we = utcMinutesFromMidnight(workingEnd);

  return s >= ws && e <= we;
}

/**
 * Checks whether two Date objects fall on the same UTC calendar day.
 * @param {Date} start
 * @param {Date} end
 * @returns {boolean}
 */
export function isSameUtcDay(start, end) {
  return (
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCDate() === end.getUTCDate()
  );
}
