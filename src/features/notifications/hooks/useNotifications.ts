import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api';
import { AppNotification } from '../types';

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery<AppNotification[], Error>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await notificationsApi.getNotifications();
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    markAsRead: markReadMutation.mutate,
    refetch: query.refetch,
  };
}
