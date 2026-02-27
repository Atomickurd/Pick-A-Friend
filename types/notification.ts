export type NotificationType =
  | 'paw_request'
  | 'paw_accepted'
  | 'new_message'
  | 'event_reminder'
  | 'lost_alert'
  | 'match_nearby'
  | 'birthday'
  | 'reaction'
  | 'comment'
  | 'frenemy_nearby';

export interface AppNotification {
  id: string;
  recipientUid: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}
