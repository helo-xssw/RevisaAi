import { RevisionsContext } from '@/contexts/revisionsContext';
import { useContext } from 'react';

export function useRevisions() {
  const ctx = useContext(RevisionsContext);
  if (!ctx) {
    throw new Error(
      'useRevisions deve ser usado dentro de RevisionsProvider',
    );
  }
  return ctx;
}
