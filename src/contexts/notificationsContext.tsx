import {
  Notification,
  notificationsApi,
} from '@/api/notifications';
import React, { createContext, useCallback, useEffect, useState } from 'react';

type NotificationsContextData = {
  notifications: Notification[];
  loading: boolean;
  refresh: () => Promise<void>;
  createFromRevision: (input: {
    motoId: string;
    revisionId: string;
    motoName: string;
    revisionTitle: string;
    revisionService: string;
  }) => Promise<Notification>;
  markDone: (id: string) => Promise<void>;
  markDoneByRevision: (revisionId: string) => Promise<void>;
  removeByRevision: (revisionId: string) => Promise<void>;
};

export const NotificationsContext =
  createContext<NotificationsContextData>({} as NotificationsContextData);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await notificationsApi.list();
    setNotifications(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function createFromRevision({
    motoId,
    revisionId,
    motoName,
    revisionTitle,
    revisionService,
  }: {
    motoId: string;
    revisionId: string;
    motoName: string;
    revisionTitle: string;
    revisionService: string;
  }) {
    const created = await notificationsApi.create({
      motoId,
      revisionId,
      title: `${motoName}: ${revisionTitle}`,
      description: revisionService,
    });

    setNotifications((prev) => [created, ...prev]);
    return created;
  }

  async function markDone(id: string) {
    const updated = await notificationsApi.markDone(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? updated : n)),
    );
  }

  async function markDoneByRevision(revisionId: string) {
    await notificationsApi.markDoneByRevision(revisionId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.revisionId === revisionId ? { ...n, status: 'done' as const } : n,
      ),
    );
  }

  async function removeByRevision(revisionId: string) {
    await notificationsApi.deleteByRevision(revisionId);
    setNotifications((prev) =>
      prev.filter((n) => n.revisionId !== revisionId),
    );
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        refresh,
        createFromRevision,
        markDone,
        markDoneByRevision,
        removeByRevision,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
