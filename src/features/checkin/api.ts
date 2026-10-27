import { apiClient } from '@/api/client';
import { CheckInPayload } from './types';

export const checkInApi = {
  async submitCheckIn(data: CheckInPayload): Promise<void> {
    await apiClient.post(`/visits/${data.visitId}/check-in`, {
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: data.timestamp,
    });
  },
};
