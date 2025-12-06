import { NotificationsContext } from '@/contexts/notificationsContext';
import { useContext } from 'react';

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      'useNotifications deve ser usado dentro de NotificationsProvider',
    );
  }
  return ctx;
}
