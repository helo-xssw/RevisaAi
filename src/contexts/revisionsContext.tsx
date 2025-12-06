import {
    CreateRevisionInput,
    Revision,
    RevisionStatus,
    UpdateRevisionInput,
    createRevision as createRevisionApi,
    deleteRevision as deleteRevisionApi,
    fetchRevisions as fetchRevisionsApi,
    updateRevision as updateRevisionApi
} from '@/api/revisions';
import { useAuth } from '@/hooks/useAuth';
import React, {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useState,
} from 'react';

type RevisionsContextData = {
  revisions: Revision[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id?: string) => Revision | undefined;
  getByMoto: (motoId?: string) => Revision[];
  create: (input: CreateRevisionInput) => Promise<Revision>;
  update: (id: string, input: UpdateRevisionInput) => Promise<Revision>;
  remove: (id: string) => Promise<void>;
  setStatus: (id: string, status: RevisionStatus) => Promise<Revision>;
};

export const RevisionsContext =
  createContext<RevisionsContextData | undefined>(undefined);

type Props = { children: ReactNode };

export function RevisionsProvider({ children }: Props) {
  const { token, isLoggedIn } = useAuth();
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRevisions = useCallback(async () => {
    if (!isLoggedIn) {
      setRevisions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchRevisionsApi(token);
      setRevisions(data);
    } catch (err: any) {
      console.error('[RevisionsContext] loadRevisions', err);
      setError(
        err?.message ?? 'Não foi possível carregar as revisões.',
      );
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    loadRevisions();
  }, [loadRevisions]);

  function getById(id?: string) {
    if (!id) return undefined;
    return revisions.find((r) => r.id === id);
  }

  function getByMoto(motoId?: string) {
    if (!motoId) return [];
    return revisions.filter((r) => r.motoId === motoId);
  }

  async function create(
    input: CreateRevisionInput,
  ): Promise<Revision> {
    try {
      const created = await createRevisionApi(input, token);
      setRevisions((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      console.error('[RevisionsContext] create', err);
      throw new Error(
        err?.message ?? 'Não foi possível criar a revisão.',
      );
    }
  }

  async function update(
    id: string,
    input: UpdateRevisionInput,
  ): Promise<Revision> {
    try {
      const updated = await updateRevisionApi(id, input, token);
      setRevisions((prev) =>
        prev.map((r) => (r.id === id ? updated : r)),
      );
      return updated;
    } catch (err: any) {
      console.error('[RevisionsContext] update', err);
      throw new Error(
        err?.message ?? 'Não foi possível atualizar a revisão.',
      );
    }
  }

  async function remove(id: string): Promise<void> {
    try {
      await deleteRevisionApi(id, token);
      setRevisions((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      console.error('[RevisionsContext] remove', err);
      throw new Error(
        err?.message ?? 'Não foi possível remover a revisão.',
      );
    }
  }

  async function setStatus(
    id: string,
    status: RevisionStatus,
  ): Promise<Revision> {
    return update(id, { status });
  }

  const value: RevisionsContextData = {
    revisions,
    loading,
    error,
    refresh: loadRevisions,
    getById,
    getByMoto,
    create,
    update,
    remove,
    setStatus,
  };

  return (
    <RevisionsContext.Provider value={value}>
      {children}
    </RevisionsContext.Provider>
  );
}
