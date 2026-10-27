import { useQuery } from '@tanstack/react-query';
import { visitsRepo, LocalVisit } from '@/db/repositories/visits.repo';

export function useTodayVisits() {
  const query = useQuery<LocalVisit[], Error>({
    queryKey: ['visits', 'today'],
    queryFn: async () => {
      // 1. Fetch instantly from local SQLite DB
      const local = await visitsRepo.getTodayVisits();
      // 2. Trigger asynchronous background sync from API (non-blocking)
      visitsRepo.refreshTodayVisitsFromApi().catch(() => {});
      return local;
    },
  });

  return {
    visits: query.data || [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
  };
}
