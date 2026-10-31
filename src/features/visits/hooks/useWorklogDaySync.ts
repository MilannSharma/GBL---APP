import { useEffect } from 'react';
import { useDaySessionStore } from '../store/useDaySessionStore';

interface WorklogShiftSnapshot {
  hasLoaded: boolean;
  isDayStarted: boolean;
  isDayEnded: boolean;
  dayStartTime?: string;
}

/**
 * Mirrors the backend shift status into the day-session store that gates the
 * visit screens. Skipped until the first successful load so a failed request
 * never overrides the cached state.
 */
export function useWorklogDaySync({
  hasLoaded,
  isDayStarted,
  isDayEnded,
  dayStartTime,
}: WorklogShiftSnapshot) {
  const applyServerShift = useDaySessionStore((s) => s.applyServerShift);

  useEffect(() => {
    if (hasLoaded) {
      applyServerShift({ isDayStarted, isDayEnded, dayStartTime });
    }
  }, [hasLoaded, isDayStarted, isDayEnded, dayStartTime, applyServerShift]);
}
