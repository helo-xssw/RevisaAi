import { RevisionsContext } from '@/contexts/revisionsContext';
import { useContext } from 'react';

export function useRevisions() {
  return useContext(RevisionsContext);
}
