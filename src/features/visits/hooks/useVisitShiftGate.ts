import { useWorklog } from '@/features/worklog';
import { useDaySessionStore } from '../store/useDaySessionStore';
import { useWorklogDaySync } from './useWorklogDaySync';

/**
 * Lets a visit screen start the day in place: loads the server's shift status into the shared
 * day-session store (which gates adding visits) and exposes the start action for the shift form.
 */
export function useVisitShiftGate() {
  const worklog = useWorklog();
  const isDayStarted = useDaySessionStore((s) => s.isDayStarted);
  const isDayEnded = useDaySessionStore((s) => s.isDayEnded);

  useWorklogDaySync({
    hasLoaded: worklog.loadState === 'ready',
    isDayStarted: worklog.isDayStarted,
    isDayEnded: worklog.isDayEnded,
    dayStartTime: worklog.dayStartTime,
  });

  return {
    isDayStarted,
    isDayEnded,
    startShift: worklog.startShift,
    isStarting: worklog.submitting,
    startError: worklog.error,
    clearStartError: worklog.clearError,
  };
}
