export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'visit_assigned' | 'reminder' | 'system';
  read: boolean;
  createdAt: string;
}
