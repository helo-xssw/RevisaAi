// src/api/motos.ts
import { hasApiConfigured, http } from './http';

export type Moto = {
  id: string;
  name: string;
  brand: string;
  model?: string;
  year?: number;
  plate?: string;
  km?: number;
  color?: string;
  createdAt?: string;
};

export type CreateMotoInput = {
  name: string;
  brand: string;
  model?: string;
  year?: number;
  plate?: string;
  km?: number;
  color?: string;
};

export type UpdateMotoInput = Partial<CreateMotoInput>;

// ----------------------
// MOCK em memória
// ----------------------

let motosMock: Moto[] = [
  {
    id: '1',
    name: 'Honda Biz',
    brand: 'Honda',
    model: 'Biz 125',
    year: 2020,
    plate: 'ABC-1234',
    km: 20500,
    color: 'Prata',
  },
  {
    id: '2',
    name: 'Yamaha 360',
    brand: 'Yamaha',
    model: 'Factor 150',
    year: 2019,
    plate: 'XYZ-5678',
    km: 15650,
    color: 'Preta',
  },
];

async function mockFetchMotos(): Promise<Moto[]> {
  return [...motosMock];
}

async function mockCreateMoto(input: CreateMotoInput): Promise<Moto> {
  const newMoto: Moto = {
    id: Date.now().toString(),
    ...input,
  };
  motosMock = [newMoto, ...motosMock];
  return newMoto;
}

async function mockUpdateMoto(
  id: string,
  input: UpdateMotoInput,
): Promise<Moto> {
  const index = motosMock.findIndex((m) => m.id === id);
  if (index === -1) {
    throw new Error('Moto não encontrada (mock).');
  }
  motosMock[index] = {
    ...motosMock[index],
    ...input,
  };
  return motosMock[index];
}

async function mockDeleteMoto(id: string): Promise<void> {
  motosMock = motosMock.filter((m) => m.id !== id);
}

// ----------------------
// REST
// (ajuste os endpoints conforme sua API)
// ----------------------

async function restFetchMotos(token?: string | null): Promise<Moto[]> {
  // ex: GET /motos
  return http.get<Moto[]>('/motos', token);
}

async function restCreateMoto(
  input: CreateMotoInput,
  token?: string | null,
): Promise<Moto> {
  // ex: POST /motos
  return http.post<Moto>('/motos', input, token);
}

async function restUpdateMoto(
  id: string,
  input: UpdateMotoInput,
  token?: string | null,
): Promise<Moto> {
  // ex: PUT /motos/:id
  return http.put<Moto>(`/motos/${id}`, input, token);
}

async function restDeleteMoto(
  id: string,
  token?: string | null,
): Promise<void> {
  // ex: DELETE /motos/:id
  await http.delete(`/motos/${id}`, token);
}

// ----------------------
// Funções públicas: REST-first + mock fallback
// ----------------------

const shouldUseMockOnly = () => !hasApiConfigured;

export async function fetchMotos(
  token?: string | null,
): Promise<Moto[]> {
  if (shouldUseMockOnly()) {
    return mockFetchMotos();
  }

  try {
    return await restFetchMotos(token);
  } catch (error) {
    console.warn(
      '[motos] Falha na API, usando mockFetchMotos:',
      (error as Error).message,
    );
    return mockFetchMotos();
  }
}

export async function createMoto(
  input: CreateMotoInput,
  token?: string | null,
): Promise<Moto> {
  if (shouldUseMockOnly()) {
    return mockCreateMoto(input);
  }

  try {
    return await restCreateMoto(input, token);
  } catch (error) {
    console.warn(
      '[motos] Falha na API, usando mockCreateMoto:',
      (error as Error).message,
    );
    return mockCreateMoto(input);
  }
}

export async function updateMoto(
  id: string,
  input: UpdateMotoInput,
  token?: string | null,
): Promise<Moto> {
  if (shouldUseMockOnly()) {
    return mockUpdateMoto(id, input);
  }

  try {
    return await restUpdateMoto(id, input, token);
  } catch (error) {
    console.warn(
      '[motos] Falha na API, usando mockUpdateMoto:',
      (error as Error).message,
    );
    return mockUpdateMoto(id, input);
  }
}

export async function deleteMoto(
  id: string,
  token?: string | null,
): Promise<void> {
  if (shouldUseMockOnly()) {
    return mockDeleteMoto(id);
  }

  try {
    return await restDeleteMoto(id, token);
  } catch (error) {
    console.warn(
      '[motos] Falha na API, usando mockDeleteMoto:',
      (error as Error).message,
    );
    return mockDeleteMoto(id);
  }
}
