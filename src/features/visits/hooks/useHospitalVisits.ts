import { useMemo } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { visitsApi } from '../api';
import { HospitalVisit } from '../types';
import { useDaySessionStore } from '../store/useDaySessionStore';

export const HOSPITAL_VISITS_KEY = 'hospitalVisits';

// Newest visits first. "Today" is decided on the device from each visit's own timestamp, so a
// server/device timezone difference can never hide a visit that was just recorded.
const RECENT_VISITS_LIMIT = 100;

/** Today's visits of the logged-in agent, read from the server, plus the shared day-session state. */
export function useHospitalVisits() {
  const { isDayStarted, dayStartTime, startDay, endDay } = useDaySessionStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const {
    data: recentVisits = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<HospitalVisit[]>({
    queryKey: [HOSPITAL_VISITS_KEY, today],
    queryFn: () => visitsApi.getVisits({ limit: RECENT_VISITS_LIMIT }),
  });

  const visits = useMemo(() => recentVisits.filter((visit) => visit.isoDate === today), [recentVisits, today]);

  return {
    visits,
    // Every listed visit already happened; the server has no visited/not-visited state.
    visitedCount: visits.length,
    totalCount: visits.length,
    isDayStarted,
    dayStartTime,
    startDay,
    endDay,
    isLoading,
    isError,
    refetch,
  };
}
