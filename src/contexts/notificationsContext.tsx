// src/contexts/notificationsContext.tsx
import {
    completeAllNotifications,
    completeNotification,
    fetchNotifications,
    Notification,
} from '@/api/notifications';
import React, {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react';

type NotificationsContextData = {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  markAllAsCompleted: () => Promise<void>;
};

export const NotificationsContext =
  createContext<NotificationsContextData | undefined>(undefined);

type Props = { children: ReactNode };

export function NotificationsProvider({ children }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar as notificações.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function markAsCompleted(id: string) {
    const updated = await completeNotification(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n)),
    );
  }

  async function markAllAsCompleted() {
    const all = await completeAllNotifications();
    setNotifications(all);
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        error,
        refresh: loadNotifications,
        markAsCompleted,
        markAllAsCompleted,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
