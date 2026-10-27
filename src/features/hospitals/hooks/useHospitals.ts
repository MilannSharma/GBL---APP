import { useQuery } from '@tanstack/react-query';
import { hospitalsRepo, LocalHospital } from '@/db/repositories/hospitals.repo';

export function useHospitals() {
  const query = useQuery<LocalHospital[], Error>({
    queryKey: ['hospitals'],
    queryFn: async () => {
      const local = await hospitalsRepo.getAll();
      hospitalsRepo.refreshHospitals().catch(() => {});
      return local;
    },
  });

  return {
    hospitals: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
