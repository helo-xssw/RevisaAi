// src/api/motos.ts
export type Moto = {
  id: string;
  name: string;          // Ex.: "Relâmpago"
  brand: string;         // Ex.: "Yamaha MT 07"
  year: number;
  km: number;
  nextRevisionDate?: string; // opcional
};

// mock em memória
let mockMotos: Moto[] = [
  {
    id: '1',
    name: 'Relâmpago',
    brand: 'Yamaha MT 07',
    year: 2010,
    km: 30500.5,
  },
  {
    id: '2',
    name: 'Biz',
    brand: 'Honda 220',
    year: 2016,
    km: 55200,
  },
];

const LATENCY = 600;

export async function fetchMotos(): Promise<Moto[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // retorna uma cópia, pra não mutarem o array direto
      resolve([...mockMotos]);
    }, LATENCY);
  });
}

type CreateMotoInput = Omit<Moto, 'id'>;

export async function createMoto(data: CreateMotoInput): Promise<Moto> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMoto: Moto = {
        ...data,
        id: Date.now().toString(),
      };
      mockMotos = [newMoto, ...mockMotos];
      resolve(newMoto);
    }, LATENCY);
  });
}

export async function deleteMoto(id: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockMotos = mockMotos.filter((m) => m.id !== id);
      resolve();
    }, LATENCY);
  });
}
