// TODO(api): Replace mock fallback once backend endpoints in docs/07-api/modules/notifications.md are implemented
import { notificationsEndpoints } from '@/api/endpoints/notifications';
import { AppNotification } from './types';

let mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Visit Assigned',
    body: 'City Care Clinic - Dr. Rajesh Sharma has been assigned to your route.',
    type: 'visit_assigned',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeAgo: '15m ago',
    visitId: 'v-1',
  },
  {
    id: 'notif-2',
    title: 'Daily Schedule Ready',
    body: '6 hospital visits scheduled for today. Tap to view your route.',
    type: 'visit_assigned',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    timeAgo: '1h ago',
  },
  {
    id: 'notif-3',
    title: 'Upcoming Visit Reminder',
    body: 'Scheduled check-in at Metro Heart Institute in 30 minutes.',
    type: 'reminder',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timeAgo: '2h ago',
    visitId: 'v-2',
  },
  {
    id: 'notif-4',
    title: 'Offline Sync Completed',
    body: '4 offline visit reports and forms uploaded successfully.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    timeAgo: '5h ago',
  },
  {
    id: 'notif-5',
    title: 'Hospital Protocol Update',
    body: 'Ensure GPS verification is completed before submitting hospital stock forms.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: 'Yesterday',
  },
];

export const notificationsApi = {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const data = await notificationsEndpoints.getNotifications();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          body: d.body,
          type: (d.type as AppNotification['type']) || 'system',
          read: d.read ?? false,
          createdAt: d.createdAt || new Date().toISOString(),
          timeAgo: 'Recently',
        }));
      }
    } catch {
      // Fallback to local mock layer when offline or API is not ready (TODO(api))
    }
    return [...mockNotifications];
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await notificationsEndpoints.markAsRead(id);
    } catch {
      // Offline fallback
    }
    mockNotifications = mockNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
  },

  async markAllAsRead(): Promise<void> {
    mockNotifications = mockNotifications.map((n) => ({ ...n, read: true }));
  },

  registerPushToken: notificationsEndpoints.registerPushToken,
};
