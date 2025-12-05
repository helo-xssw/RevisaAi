import {
    CreateRevisionInput,
    Revision,
    revisionsApi,
    UpdateRevisionInput,
} from '@/api/revisions';
import React, { createContext, useCallback, useState } from 'react';

type RevisionContextData = {
  revisions: Revision[];
  loading: boolean;
  listByMoto: (motoId: string) => Promise<void>;
  getRevisionById: (id?: string) => Revision | undefined;
  create: (input: CreateRevisionInput) => Promise<Revision>;
  update: (id: string, input: UpdateRevisionInput) => Promise<Revision>;
  remove: (id: string) => Promise<void>;
};

export const RevisionsContext = createContext<RevisionContextData>(
  {} as RevisionContextData,
);

export function RevisionsProvider({ children }: { children: React.ReactNode }) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);

  const listByMoto = useCallback(async (motoId: string) => {
    setLoading(true);
    const data = await revisionsApi.listByMoto(motoId);
    setRevisions(data);
    setLoading(false);
  }, []);

  const getRevisionById = (id?: string) =>
    revisions.find((r) => r.id === id);

  async function create(input: CreateRevisionInput) {
    const created = await revisionsApi.create(input);
    setRevisions((prev) => [created, ...prev]);
    return created;
  }

  async function update(id: string, input: UpdateRevisionInput) {
    const updated = await revisionsApi.update(id, input);
    setRevisions((prev) =>
      prev.map((r) => (r.id === id ? updated : r)),
    );
    return updated;
  }

  async function remove(id: string) {
    await revisionsApi.remove(id);
    setRevisions((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <RevisionsContext.Provider
      value={{
        revisions,
        loading,
        listByMoto,
        getRevisionById,
        create,
        update,
        remove,
      }}
    >
      {children}
    </RevisionsContext.Provider>
  );
}
