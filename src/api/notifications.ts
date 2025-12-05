import { http } from './http';

export type NotificationStatus = 'pending' | 'done';

export type Notification = {
  id: string;
  motoId: string;
  revisionId: string;
  title: string;
  description: string;
  status: NotificationStatus;
  createdAt: string;
};

export type CreateNotificationInput = {
  motoId: string;
  revisionId: string;
  title: string;
  description: string;
};

export const notificationsApi = {
  async list(): Promise<Notification[]> {
    return http.get('/notifications');
  },

  async create(input: CreateNotificationInput): Promise<Notification> {
    return http.post('/notifications', input);
  },

  async markDone(id: string): Promise<Notification> {
    return http.patch(`/notifications/${id}`, { status: 'done' });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return http.delete(`/notifications/${id}`);
  },

  async deleteByRevision(revisionId: string): Promise<{ success: boolean }> {
    return http.delete(`/notifications/revision/${revisionId}`);
  },

  async markDoneByRevision(revisionId: string): Promise<{ success: boolean }> {
    return http.patch(`/notifications/revision/${revisionId}`, {
      status: 'done',
    });
  },
};
