// src/hooks/useMotos.ts
import { MotosContext } from '@/contexts/motosContext';
import { useContext } from 'react';

export function useMotos() {
  const ctx = useContext(MotosContext);
  if (!ctx) {
    throw new Error('useMotos deve ser usado dentro de MotosProvider');
  }
  return ctx;
}
