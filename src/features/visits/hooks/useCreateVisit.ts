import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppError, CreateVisitRequest, CreateVisitResult } from '@/api';
import { visitsApi } from '../api';
import { HOSPITAL_VISITS_KEY } from './useHospitalVisits';

const MAX_AUTO_RETRIES = 2;

/**
 * Creates entity + contact + visit in one call. The server returns the original visit when the
 * same payload is sent again within ~2 minutes, so a dropped connection is retried automatically;
 * any other failure is shown to the agent instead.
 */
export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation<CreateVisitResult, Error, CreateVisitRequest>({
    mutationFn: (data) => visitsApi.createVisit(data),
    retry: (failureCount, error) =>
      failureCount < MAX_AUTO_RETRIES && error instanceof AppError && error.code === 'NETWORK_ERROR',
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [HOSPITAL_VISITS_KEY] });
      void queryClient.invalidateQueries({ queryKey: ['entityVisits'] });
      void queryClient.invalidateQueries({ queryKey: ['entityContacts'] });
      void queryClient.invalidateQueries({ queryKey: ['entitySearch'] });
      void queryClient.invalidateQueries({ queryKey: ['entityDirectory'] });
    },
  });
}
