import {
    CreateMotoInput,
    Moto,
    UpdateMotoInput,
    createMoto as createMotoApi,
    deleteMoto as deleteMotoApi,
    fetchMotos as fetchMotosApi,
    updateMoto as updateMotoApi,
} from '@/api/motos';
import { useAuth } from '@/hooks/useAuth';
import React, {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useState,
} from 'react';

type MotosContextData = {
  motos: Moto[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateMotoInput) => Promise<Moto>;
  update: (id: string, input: UpdateMotoInput) => Promise<Moto>;
  remove: (id: string) => Promise<void>;
};

export const MotosContext = createContext<MotosContextData | undefined>(
  undefined,
);

type Props = { children: ReactNode };

export function MotosProvider({ children }: Props) {
  const { token, isLoggedIn } = useAuth();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMotos = useCallback(async () => {
    if (!isLoggedIn) {
      setMotos([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchMotosApi(token);
      setMotos(data);
    } catch (err: any) {
      console.error('[MotosContext] loadMotos', err);
      setError(
        err?.message ?? 'Não foi possível carregar suas motos.',
      );
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    loadMotos();
  }, [loadMotos]);

  async function create(input: CreateMotoInput): Promise<Moto> {
    try {
      const created = await createMotoApi(input, token);
      setMotos((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      console.error('[MotosContext] create', err);
      throw new Error(
        err?.message ?? 'Não foi possível criar a moto.',
      );
    }
  }

  async function update(
    id: string,
    input: UpdateMotoInput,
  ): Promise<Moto> {
    try {
      const updated = await updateMotoApi(id, input, token);
      setMotos((prev) =>
        prev.map((m) => (m.id === id ? updated : m)),
      );
      return updated;
    } catch (err: any) {
      console.error('[MotosContext] update', err);
      throw new Error(
        err?.message ?? 'Não foi possível atualizar a moto.',
      );
    }
  }

  async function remove(id: string): Promise<void> {
    try {
      await deleteMotoApi(id, token);
      setMotos((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      console.error('[MotosContext] remove', err);
      throw new Error(
        err?.message ?? 'Não foi possível remover a moto.',
      );
    }
  }

  const value: MotosContextData = {
    motos,
    loading,
    error,
    refresh: loadMotos,
    create,
    update,
    remove,
  };

  return (
    <MotosContext.Provider value={value}>
      {children}
    </MotosContext.Provider>
  );
}
