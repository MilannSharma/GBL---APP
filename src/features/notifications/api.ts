import { notificationsEndpoints } from '@/api/endpoints/notifications';

export const notificationsApi = {
  getNotifications: notificationsEndpoints.getNotifications,
  markAsRead: notificationsEndpoints.markAsRead,
  registerPushToken: notificationsEndpoints.registerPushToken,
};
