// src/components/ui/DiscreteNotification.tsx
import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationStatus } from '../../types/notifications';

const DiscreteNotification: React.FC = () => {
  const { unreadCount, fetchNotifications } = useNotifications();
  const [lastUnreadCount, setLastUnreadCount] = useState(0);

  // Verificar nuevas notificaciones importantes
  useEffect(() => {
    if (unreadCount > lastUnreadCount) {
      // Hay nuevas notificaciones - actualizar la lista automáticamente
      fetchNotifications({ limit: 20, status: NotificationStatus.UNREAD });
    }
    
    setLastUnreadCount(unreadCount);
  }, [unreadCount, lastUnreadCount, fetchNotifications]);

  // No renderizar nada visible - solo maneja la lógica de actualización
  return null;
};

export default DiscreteNotification;
