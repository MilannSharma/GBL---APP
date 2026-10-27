import { apiClient } from '../client';
import { ApiNotificationDto } from '../types';

export const notificationsEndpoints = {
  async getNotifications(): Promise<ApiNotificationDto[]> {
    const response = await apiClient.get<ApiNotificationDto[]>('/notifications');
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.post(`/notifications/${id}/read`);
  },

  async registerPushToken(token: string, platform: 'ios' | 'android'): Promise<void> {
    await apiClient.post('/notifications/device-token', { token, platform });
  },
};
