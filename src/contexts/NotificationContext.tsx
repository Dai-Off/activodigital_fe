// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { notificationService } from '../services/notifications';
import type { Notification, NotificationFilters, NotificationStatus } from '../types/notifications';

// Interfaz del contexto
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  
  // Polling discreto (solo para notificaciones importantes)
  startDiscretePolling: () => void;
  stopDiscretePolling: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook para usar el contexto
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Props del provider
interface NotificationProviderProps {
  children: ReactNode;
  pollingInterval?: number; // en milisegundos, default 10 segundos (más reactivo)
}

// Provider del contexto
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  pollingInterval = 10000 // 10 segundos por defecto (más reactivo)
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Obtener notificaciones
  const fetchNotifications = useCallback(async (filters: NotificationFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await notificationService.getNotifications(filters);
      setNotifications(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener notificaciones';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener conteo de no leídas
  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  // Marcar como leída
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const success = await notificationService.markAsRead(notificationId);
      if (success) {
        // Actualizar estado local
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, status: 'read' as NotificationStatus, readAt: new Date().toISOString() }
              : notification
          )
        );
        
        // Actualizar conteo
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      const count = await notificationService.markAllAsRead();
      if (count > 0) {
        // Actualizar estado local
        setNotifications(prev => 
          prev.map(notification => ({
            ...notification,
            status: 'read' as NotificationStatus,
            readAt: notification.readAt || new Date().toISOString()
          }))
        );
        
        // Actualizar conteo
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  // Eliminar notificación
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const success = await notificationService.deleteNotification(notificationId);
      if (success) {
        // Actualizar estado local
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // Actualizar conteo si era no leída
        if (notification?.status === 'unread') {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  // Iniciar polling discreto (solo para notificaciones importantes)
  const startDiscretePolling = useCallback(() => {
    if (pollingIntervalId) return; // Ya está corriendo
    
    const intervalId = setInterval(() => {
      // Solo verificar conteo de no leídas, no cargar todas las notificaciones
      refreshUnreadCount();
    }, pollingInterval);
    
    setPollingIntervalId(intervalId);
  }, [pollingInterval, pollingIntervalId, refreshUnreadCount]);

  // Detener polling discreto
  const stopDiscretePolling = useCallback(() => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      setPollingIntervalId(null);
    }
  }, [pollingIntervalId]);

  // Cargar datos iniciales y iniciar polling
  useEffect(() => {
    const checkTokenAndLoad = () => {
      // Verificar si hay token antes de hacer peticiones
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      if (token) {
        fetchNotifications({ limit: 20 });
        refreshUnreadCount();
        
        // Iniciar polling automáticamente solo si hay token
        startDiscretePolling();
      } else {
        // Si no hay token, detener polling y limpiar datos
        stopDiscretePolling();
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    // Verificar inmediatamente
    checkTokenAndLoad();

    // Escuchar cambios en localStorage para detectar login/logout
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        checkTokenAndLoad();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchNotifications, refreshUnreadCount, startDiscretePolling, stopDiscretePolling]);

  // Limpiar polling al desmontar
  useEffect(() => {
    return () => {
      stopDiscretePolling();
    };
  }, [stopDiscretePolling]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshUnreadCount,
    startDiscretePolling,
    stopDiscretePolling,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
