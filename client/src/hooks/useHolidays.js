import { useEffect, useMemo, useState } from 'react';

const cache = new Map();

export function useHolidays(dateStr, country = 'RS') {
  const [holidays, setHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const year = useMemo(() => {
    if (!dateStr) return null;
    return Number(String(dateStr).slice(0, 4));
  }, [dateStr]);

  useEffect(() => {
    if (!year) return;

    const key = `${country}-${year}`;
    const cached = cache.get(key);
    if (cached) {
      setHolidays(cached);
      return;
    }

    let alive = true;
    setIsLoading(true);

    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        cache.set(key, list);
        setHolidays(list);
      })
      .catch(() => {
        if (!alive) return;
        setHolidays([]);
      })
      .finally(() => {
        if (!alive) return;
        setIsLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [year, country]);

  const holiday = useMemo(() => {
    if (!dateStr) return null;
    return holidays.find((h) => h.date === dateStr) || null;
  }, [holidays, dateStr]);

  return {
    holidays,
    isLoading,
    isHoliday: Boolean(holiday),
    holiday,
  };
}
