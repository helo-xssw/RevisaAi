import { NotificationsContext } from '@/contexts/notificationsContext';
import { useContext } from 'react';

export function useNotifications() {
  return useContext(NotificationsContext);
}
