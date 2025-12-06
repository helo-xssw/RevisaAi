// src/api/notifications.ts
import { hasApiConfigured, http } from './http';

export type NotificationStatus = 'pending' | 'done';

export type Notification = {
  id: string;
  motoId: string;
  revisionId: string;
  title: string;
  description: string;
  status: NotificationStatus;
  createdAt?: string;
};

export type CreateNotificationInput = {
  motoId: string;
  revisionId: string;
  title: string;
  description: string;
};

// ----------------------
// MOCK em memória
// ----------------------

let notificationsMock: Notification[] = [];

async function mockFetchNotifications(): Promise<Notification[]> {
  return [...notificationsMock];
}

async function mockCreateNotification(
  input: CreateNotificationInput,
): Promise<Notification> {
  const newNotif: Notification = {
    id: Date.now().toString(),
    status: 'pending',
    ...input,
  };
  notificationsMock = [newNotif, ...notificationsMock];
  return newNotif;
}

async function mockUpdateNotificationStatus(
  id: string,
  status: NotificationStatus,
): Promise<Notification> {
  const index = notificationsMock.findIndex((n) => n.id === id);
  if (index === -1) throw new Error('Notificação não encontrada (mock).');

  notificationsMock[index] = {
    ...notificationsMock[index],
    status,
  };

  return notificationsMock[index];
}

async function mockDeleteNotification(id: string): Promise<void> {
  notificationsMock = notificationsMock.filter((n) => n.id !== id);
}

async function mockDeleteNotificationsByRevisionId(
  revisionId: string,
): Promise<void> {
  notificationsMock = notificationsMock.filter(
    (n) => n.revisionId !== revisionId,
  );
}

async function mockUpdateStatusByRevisionId(
  revisionId: string,
  status: NotificationStatus,
): Promise<void> {
  notificationsMock = notificationsMock.map((n) =>
    n.revisionId === revisionId ? { ...n, status } : n,
  );
}

// ----------------------
// REST (ajuste endpoints conforme sua API)
// ----------------------

async function restFetchNotifications(
  token?: string | null,
): Promise<Notification[]> {
  // ex: GET /notifications
  return http.get<Notification[]>('/notifications', token);
}

async function restCreateNotification(
  input: CreateNotificationInput,
  token?: string | null,
): Promise<Notification> {
  // ex: POST /notifications
  return http.post<Notification>('/notifications', input, token);
}

async function restUpdateNotificationStatus(
  id: string,
  status: NotificationStatus,
  token?: string | null,
): Promise<Notification> {
  // ex: PATCH /notifications/:id
  return http.patch<Notification>(
    `/notifications/${id}`,
    { status },
    token,
  );
}

async function restDeleteNotification(
  id: string,
  token?: string | null,
): Promise<void> {
  // ex: DELETE /notifications/:id
  await http.delete(`/notifications/${id}`, token);
}

async function restDeleteByRevision(
  revisionId: string,
  token?: string | null,
): Promise<void> {
  // ex (exemplo): DELETE /notifications/revision/:revisionId
  await http.delete(`/notifications/revision/${revisionId}`, token);
}

async function restUpdateStatusByRevision(
  revisionId: string,
  status: NotificationStatus,
  token?: string | null,
): Promise<void> {
  // ex: PATCH /notifications/revision/:revisionId
  await http.patch(
    `/notifications/revision/${revisionId}`,
    { status },
    token,
  );
}

// ----------------------
// Funções públicas: REST-first + mock fallback
// ----------------------

const shouldUseMockOnly = () => !hasApiConfigured;

export async function fetchNotifications(
  token?: string | null,
): Promise<Notification[]> {
  if (shouldUseMockOnly()) {
    return mockFetchNotifications();
  }

  try {
    return await restFetchNotifications(token);
  } catch (error) {
    console.warn(
      '[notifications] Falha na API, usando mockFetchNotifications:',
      (error as Error).message,
    );
    return mockFetchNotifications();
  }
}

export async function createNotification(
  input: CreateNotificationInput,
  token?: string | null,
): Promise<Notification> {
  if (shouldUseMockOnly()) {
    return mockCreateNotification(input);
  }

  try {
    return await restCreateNotification(input, token);
  } catch (error) {
    console.warn(
      '[notifications] Falha na API, usando mockCreateNotification:',
      (error as Error).message,
    );
    return mockCreateNotification(input);
  }
}

export async function updateNotificationStatus(
  id: string,
  status: NotificationStatus,
  token?: string | null,
): Promise<Notification> {
  if (shouldUseMockOnly()) {
    return mockUpdateNotificationStatus(id, status);
  }

  try {
    return await restUpdateNotificationStatus(id, status, token);
  } catch (error) {
    console.warn(
      '[notifications] Falha na API, usando mockUpdateNotificationStatus:',
      (error as Error).message,
    );
    return mockUpdateNotificationStatus(id, status);
  }
}

export async function deleteNotification(
  id: string,
  token?: string | null,
): Promise<void> {
  if (shouldUseMockOnly()) {
    return mockDeleteNotification(id);
  }

  try {
    return await restDeleteNotification(id, token);
  } catch (error) {
    console.warn(
      '[notifications] Falha na API, usando mockDeleteNotification:',
      (error as Error).message,
    );
    return mockDeleteNotification(id);
  }
}

export async function deleteNotificationsByRevisionId(
  revisionId: string,
  token?: string | null,
): Promise<void> {
  if (shouldUseMockOnly()) {
    return mockDeleteNotificationsByRevisionId(revisionId);
  }

  try {
    return await restDeleteByRevision(revisionId, token);
  } catch (error) {
    console.warn(
      '[notifications] Falha na API, usando mockDeleteNotificationsByRevisionId:',
      (error as Error).message,
    );
    return mockDeleteNotificationsByRevisionId(revisionId);
  }
}

export async function updateStatusByRevisionId(
  revisionId: string,
  status: NotificationStatus,
  token?: string | null,
): Promise<void> {
  if (shouldUseMockOnly()) {
    return mockUpdateStatusByRevisionId(revisionId, status);
  }

  try {
    return await restUpdateStatusByRevision(revisionId, status, token);
  } catch (error) {
    console.warn(
      '[notifications] Falha na API, usando mockUpdateStatusByRevisionId:',
      (error as Error).message,
    );
    return mockUpdateStatusByRevisionId(revisionId, status);
  }
}
