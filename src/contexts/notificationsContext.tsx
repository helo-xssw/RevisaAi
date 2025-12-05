import {
  CreateNotificationInput,
  Notification,
  NotificationStatus,
  createNotification as createNotificationApi,
  deleteNotification as deleteNotificationApi,
  deleteNotificationsByRevisionId as deleteNotificationsByRevisionIdApi,
  fetchNotifications as fetchNotificationsApi,
  updateNotificationStatus as updateNotificationStatusApi,
  updateStatusByRevisionId as updateStatusByRevisionIdApi,
} from '@/api/notifications';
import { useAuth } from '@/hooks/useAuth';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

type NotificationsContextData = {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateNotificationInput) => Promise<Notification>;
  updateStatus: (id: string, status: NotificationStatus) => Promise<Notification>;
  remove: (id: string) => Promise<void>;
  removeByRevisionId: (revisionId: string) => Promise<void>;
  updateStatusByRevisionId: (revisionId: string, status: NotificationStatus) => Promise<void>;
};

export const NotificationsContext =
  createContext<NotificationsContextData | undefined>(undefined);

type Props = { children: ReactNode };

export function NotificationsProvider({ children }: Props) {
  const { token, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!isLoggedIn) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotificationsApi(token);
      setNotifications(data);
    } catch (err: any) {
      console.error('[NotificationsContext] loadNotifications', err);
      setError(
        err?.message ?? 'Não foi possível carregar as notificações.',
      );
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function create(
    input: CreateNotificationInput,
  ): Promise<Notification> {
    try {
      const created = await createNotificationApi(input, token);
      setNotifications((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      console.error('[NotificationsContext] create', err);
      throw new Error(
        err?.message ?? 'Não foi possível criar a notificação.',
      );
    }
  }

  async function updateStatus(
    id: string,
    status: NotificationStatus,
  ): Promise<Notification> {
    try {
      const updated = await updateNotificationStatusApi(id, status, token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? updated : n)),
      );
      return updated;
    } catch (err: any) {
      console.error('[NotificationsContext] updateStatus', err);
      throw new Error(
        err?.message ?? 'Não foi possível atualizar a notificação.',
      );
    }
  }

  async function remove(id: string): Promise<void> {
    try {
      await deleteNotificationApi(id, token);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      console.error('[NotificationsContext] remove', err);
      throw new Error(
        err?.message ?? 'Não foi possível remover a notificação.',
      );
    }
  }

  async function removeByRevisionId(revisionId: string): Promise<void> {
    try {
      await deleteNotificationsByRevisionIdApi(revisionId, token);
      setNotifications((prev) =>
        prev.filter((n) => n.revisionId !== revisionId),
      );
    } catch (err: any) {
      console.error('[NotificationsContext] removeByRevisionId', err);
      throw new Error(
        err?.message ?? 'Não foi possível remover as notificações.',
      );
    }
  }

  async function updateStatusByRevision(
    revisionId: string,
    status: NotificationStatus,
  ): Promise<void> {
    try {
      await updateStatusByRevisionIdApi(revisionId, status, token);
      setNotifications((prev) =>
        prev.map((n) =>
          n.revisionId === revisionId ? { ...n, status } : n,
        ),
      );
    } catch (err: any) {
      console.error('[NotificationsContext] updateStatusByRevision', err);
      throw new Error(
        err?.message ?? 'Não foi possível atualizar as notificações.',
      );
    }
  }

  const value: NotificationsContextData = {
    notifications,
    loading,
    error,
    refresh: loadNotifications,
    create,
    updateStatus,
    remove,
    removeByRevisionId,
    updateStatusByRevisionId: updateStatusByRevision,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
