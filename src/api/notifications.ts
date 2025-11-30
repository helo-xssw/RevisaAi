// src/api/notifications.ts
export type Notification = {
  id: string;
  motoName: string;       // Ex.: "Honda Biz"
  description: string;    // Ex.: "Troca de óleo"
  completed: boolean;
  createdAt: string;
};

let mockNotifications: Notification[] = [
  {
    id: '1',
    motoName: 'Honda Biz',
    description: 'Troca de óleo',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    motoName: 'Yamaha 360',
    description: 'Troca de kit',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    motoName: 'Honda PCX',
    description: 'Revisão Geral',
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

const LATENCY = 600;

// Buscar todas as notificações
export async function fetchNotifications(): Promise<Notification[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockNotifications]);
    }, LATENCY);
  });
}

// Marcar uma notificação como concluída
export async function completeNotification(
  id: string,
): Promise<Notification> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockNotifications.findIndex((n) => n.id === id);
      if (index === -1) {
        return reject(new Error('Notificação não encontrada.'));
      }

      mockNotifications[index] = {
        ...mockNotifications[index],
        completed: true,
      };

      resolve({ ...mockNotifications[index] });
    }, LATENCY);
  });
}

// Marcar todas como concluídas (opcional, para futuro)
export async function completeAllNotifications(): Promise<Notification[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockNotifications = mockNotifications.map((n) => ({
        ...n,
        completed: true,
      }));
      resolve([...mockNotifications]);
    }, LATENCY);
  });
}
