import { useQuery } from '@tanstack/react-query';
import { visitsRepo, LocalVisit } from '@/db/repositories/visits.repo';

export function useTodayVisits() {
  const query = useQuery<LocalVisit[], Error>({
    queryKey: ['visits', 'today'],
    queryFn: async () => {
      return visitsRepo.getTodayVisits();
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
