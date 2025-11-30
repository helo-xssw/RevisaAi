// src/contexts/motosContext.tsx
import { Moto, createMoto, deleteMoto, fetchMotos } from '@/api/motos';
import React, {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useState,
} from 'react';

type CreateMotoPayload = Omit<Moto, 'id'>;

type MotosContextData = {
  motos: Moto[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addMoto: (data: CreateMotoPayload) => Promise<void>;
  removeMoto: (id: string) => Promise<void>;
};

export const MotosContext = createContext<MotosContextData | undefined>(
  undefined,
);

type Props = { children: ReactNode };

export function MotosProvider({ children }: Props) {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadMotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMotos();
      setMotos(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar as motos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMotos();
  }, [loadMotos]);

  async function addMoto(data: CreateMotoPayload) {
    const moto = await createMoto(data);
    setMotos((prev) => [moto, ...prev]);
  }

  async function removeMoto(id: string) {
    await deleteMoto(id);
    setMotos((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <MotosContext.Provider
      value={{
        motos,
        loading,
        error,
        refresh: loadMotos,
        addMoto,
        removeMoto,
      }}
    >
      {children}
    </MotosContext.Provider>
  );
}
