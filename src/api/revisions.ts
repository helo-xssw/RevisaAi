// src/api/revisions.ts
import { hasApiConfigured, http } from './http';

export type RevisionStatus = 'pending' | 'done';

export type Revision = {
  id: string;
  motoId: string;
  title: string;
  service: string;
  details?: string;
  date: string; // ISO
  time: string; // ISO
  km?: number;
  status: RevisionStatus;
  autoReminderEnabled: boolean;
  autoReminderInterval?: string;
  createdAt?: string;
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
  status?: RevisionStatus;
};

// ----------------------
// MOCK em memória
// ----------------------

let revisionsMock: Revision[] = [
  {
    id: '1',
    motoId: '1',
    title: 'Troca de Óleo',
    service: 'Óleo do motor',
    details: 'Moto está com problema de carburador...',
    date: new Date().toISOString(),
    time: new Date().toISOString(),
    status: 'pending',
    km: 30500,
    autoReminderEnabled: false,
  },
  {
    id: '2',
    motoId: '1',
    title: 'Revisão Geral',
    service: 'Motor, faróis e freio',
    details: 'Revisão geral para venda da moto.',
    date: new Date().toISOString(),
    time: new Date().toISOString(),
    status: 'pending',
    km: 30500,
    autoReminderEnabled: false,
  },
  {
    id: '3',
    motoId: '1',
    title: 'Troca de Kit',
    service: 'Corrente, coroa e pinhão',
    details:
      'Folga excessiva na corrente e dentes da coroa/pinhão irregulares.',
    date: new Date().toISOString(),
    time: new Date().toISOString(),
    status: 'done',
    km: 15650,
    autoReminderEnabled: true,
    autoReminderInterval: 'Três meses',
  },
];

async function mockFetchRevisions(): Promise<Revision[]> {
  return [...revisionsMock];
}

async function mockCreateRevision(
  input: CreateRevisionInput,
): Promise<Revision> {
  const newRev: Revision = {
    id: Date.now().toString(),
    status: 'pending',
    ...input,
  };
  revisionsMock = [newRev, ...revisionsMock];
  return newRev;
}

async function mockUpdateRevision(
  id: string,
  input: UpdateRevisionInput,
): Promise<Revision> {
  const index = revisionsMock.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Revisão não encontrada (mock).');

  revisionsMock[index] = {
    ...revisionsMock[index],
    ...input,
  };

  return revisionsMock[index];
}

async function mockDeleteRevision(id: string): Promise<void> {
  revisionsMock = revisionsMock.filter((r) => r.id !== id);
}

// ----------------------
// REST (ajuste endpoints conforme sua API)
// ----------------------

async function restFetchRevisions(
  token?: string | null,
): Promise<Revision[]> {
  // ex: GET /revisions
  return http.get<Revision[]>('/revisions', token);
}

async function restCreateRevision(
  input: CreateRevisionInput,
  token?: string | null,
): Promise<Revision> {
  // ex: POST /revisions
  return http.post<Revision>('/revisions', input, token);
}

async function restUpdateRevision(
  id: string,
  input: UpdateRevisionInput,
  token?: string | null,
): Promise<Revision> {
  // ex: PATCH /revisions/:id
  return http.patch<Revision>(`/revisions/${id}`, input, token);
}

async function restDeleteRevision(
  id: string,
  token?: string | null,
): Promise<void> {
  // ex: DELETE /revisions/:id
  await http.delete(`/revisions/${id}`, token);
}

// ----------------------
// Funções públicas: REST-first + mock fallback
// ----------------------

const shouldUseMockOnly = () => !hasApiConfigured;

export async function fetchRevisions(
  token?: string | null,
): Promise<Revision[]> {
  if (shouldUseMockOnly()) {
    return mockFetchRevisions();
  }

  try {
    return await restFetchRevisions(token);
  } catch (error) {
    console.warn(
      '[revisions] Falha na API, usando mockFetchRevisions:',
      (error as Error).message,
    );
    return mockFetchRevisions();
  }
}

export async function createRevision(
  input: CreateRevisionInput,
  token?: string | null,
): Promise<Revision> {
  if (shouldUseMockOnly()) {
    return mockCreateRevision(input);
  }

  try {
    return await restCreateRevision(input, token);
  } catch (error) {
    console.warn(
      '[revisions] Falha na API, usando mockCreateRevision:',
      (error as Error).message,
    );
    return mockCreateRevision(input);
  }
}

export async function updateRevision(
  id: string,
  input: UpdateRevisionInput,
  token?: string | null,
): Promise<Revision> {
  if (shouldUseMockOnly()) {
    return mockUpdateRevision(id, input);
  }

  try {
    return await restUpdateRevision(id, input, token);
  } catch (error) {
    console.warn(
      '[revisions] Falha na API, usando mockUpdateRevision:',
      (error as Error).message,
    );
    return mockUpdateRevision(id, input);
  }
}

export async function deleteRevision(
  id: string,
  token?: string | null,
): Promise<void> {
  if (shouldUseMockOnly()) {
    return mockDeleteRevision(id);
  }

  try {
    return await restDeleteRevision(id, token);
  } catch (error) {
    console.warn(
      '[revisions] Falha na API, usando mockDeleteRevision:',
      (error as Error).message,
    );
    return mockDeleteRevision(id);
  }
}

export async function markRevisionDone(
  id: string,
  token?: string | null,
): Promise<Revision> {
  return updateRevision(
    id,
    { status: 'done' },
    token,
  );
}
