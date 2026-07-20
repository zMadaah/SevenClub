export type NotificationCategory = 'territory' | 'invite' | 'community' | 'sevenclub';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  subtitle: string;
  timeAgo: string;
  read: boolean;
}