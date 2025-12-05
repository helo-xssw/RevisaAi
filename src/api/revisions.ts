import { http } from './http';

export type Revision = {
  id: string;
  motoId: string;
  title: string;
  service: string;
  details?: string;
  date: string; // ISO
  time: string; // ISO
  km?: number;
  status: 'pending' | 'done';
  autoReminderEnabled: boolean;
  autoReminderInterval?: string;
  createdAt: string;
};

export type CreateRevisionInput = {
  motoId: string;
  title: string;
  service: string;
  details?: string;
  date: string; // ISO
  time: string; // ISO
  km?: number;
  autoReminderEnabled: boolean;
  autoReminderInterval?: string;
};

export type UpdateRevisionInput = Partial<CreateRevisionInput> & {
  status?: 'pending' | 'done';
};

export const revisionsApi = {
  async listByMoto(motoId: string): Promise<Revision[]> {
    return http.get(`/motos/${motoId}/revisions`);
  },

  async getById(id: string): Promise<Revision> {
    return http.get(`/revisions/${id}`);
  },

  async create(input: CreateRevisionInput): Promise<Revision> {
    return http.post('/revisions', input);
  },

  async update(id: string, input: UpdateRevisionInput): Promise<Revision> {
    return http.patch(`/revisions/${id}`, input);
  },

  async remove(id: string): Promise<{ success: boolean }> {
    return http.delete(`/revisions/${id}`);
  },
};
