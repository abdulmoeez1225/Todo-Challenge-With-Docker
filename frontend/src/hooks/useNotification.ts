import { useState, useCallback } from 'react';

import type { NotificationState } from '../types';

interface UseNotificationReturn {
  notification: NotificationState | null;
  showNotification: (message: string, type?: NotificationState['type']) => void;
  hideNotification: () => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

  const showNotification = useCallback(
    (message: string, type: NotificationState['type'] = 'info') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};
