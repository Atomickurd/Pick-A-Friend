import { create } from 'zustand';
import type { AppNotification } from '../types';

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  // actions
  setNotifications: (items: AppNotification[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: AppNotification) => void;
  setUnreadCount: (count: number) => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount: n.isRead ? s.unreadCount : s.unreadCount + 1,
    })),

  setUnreadCount: (unreadCount) => set({ unreadCount }),
}));
