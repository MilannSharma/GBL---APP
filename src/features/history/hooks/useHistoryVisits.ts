import { useQuery } from '@tanstack/react-query';
import { historyApi } from '../api';
import { getDb } from '@/db/client';
import { LocalVisit } from '@/db/repositories/visits.repo';

export function useHistoryVisits() {
  const query = useQuery<LocalVisit[], Error>({
    queryKey: ['visits', 'history'],
    queryFn: async () => {
      const db = await getDb();
      // Fetch completed or past visits from local DB
      const local = await db.getAllAsync<LocalVisit>(
        `SELECT * FROM visits WHERE status = 'completed' ORDER BY scheduled_date DESC`
      );
      return local;
    },
  });

  return {
    historyVisits: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
