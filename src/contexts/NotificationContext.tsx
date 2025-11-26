// src/contexts/NotificationContext.tsx
import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { notificationApiService } from "../services/notifications";
import type { Notification, NotificationFilters } from "../types/notifications";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  activeBuildingIds: string[];

  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  fetchUserNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  setNotificationBuildingFilters: (ids: string[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeBuildingIds, setActiveBuildingIds] = useState<string[]>([]);

  const setNotificationBuildingFilters = useCallback((ids: string[]) => {
    setActiveBuildingIds(ids);
  }, []);

  // Actualiza el conteo de no leídas
  const refreshUnreadCount = useCallback(async () => {
    // Nota: Esta lógica asume conteo por edificio. Si estamos en modo "Usuario",
    // quizás deberíamos filtrar localmente o llamar al endpoint de usuario.
    if (activeBuildingIds.length === 0) {
      setUnreadCount(0);
      return;
    }
    const buildingId = activeBuildingIds[0];
    try {
      const unread = await notificationApiService.getUnreadNotifications(
        buildingId
      );
      setUnreadCount(unread.length);
    } catch (err) {
      console.error("Error updating unread count:", err);
    }
  }, [activeBuildingIds]);

  // 1. Obtiene notificaciones de Edificio (Historial)
  const fetchNotifications = useCallback(
    async (explicitFilters: NotificationFilters = {}) => {
      if (activeBuildingIds.length === 0) {
        setNotifications([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const notificationPromises = activeBuildingIds.map((buildingId) =>
          notificationApiService.getBuildingHistory(
            buildingId,
            explicitFilters.limit,
            explicitFilters.offset
          )
        );

        const responses = await Promise.all(notificationPromises);
        const allNotifications = responses.flatMap((response) => response.data);

        setNotifications(allNotifications);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error cargando historial"
        );
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    },
    [activeBuildingIds]
  );

  // 2. Obtiene notificaciones de Usuario (Personal)
  const fetchUserNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userNotifications =
        await notificationApiService.getUserNotifications();
      setNotifications(userNotifications);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error cargando notificaciones de usuario"
      );
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Marca una sola como leída
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationApiService.markAsRead(notificationId);
        // Optimista
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, readAt: new Date().toISOString() }
              : n
          )
        );
        refreshUnreadCount();
      } catch (err) {
        console.error("Error marking as read:", err);
        fetchNotifications(); // Revertir
      }
    },
    [refreshUnreadCount, fetchNotifications]
  );

  // Marca TODAS las visibles como leídas
  const markAllAsRead = useCallback(
    async (userId: string) => {
      if (!userId) {
        console.error("markAllAsRead requires a userId.");
        return;
      }

      const now = new Date().toISOString();
      setNotifications((prev) =>
        prev.map((n) => (n.readAt ? n : { ...n, readAt: now }))
      );
      setUnreadCount(0);

      try {
        // 2. Llamada al servicio masivo del backend.
        await notificationApiService.markAllUserAsRead(userId);
      } catch (err) {
        console.error("Error al marcar todas como leídas en el servidor:", err);
        refreshUnreadCount();
      }
    },
    [refreshUnreadCount]
  );

  // Eliminar notificación
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      const targetNotification = notifications.find(
        (n) => n.id === notificationId
      );
      const buildingId = targetNotification?.buildingId || activeBuildingIds[0];

      if (!buildingId) return;

      try {
        await notificationApiService.deleteNotification(
          notificationId,
          buildingId
        );
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        refreshUnreadCount();
      } catch (err) {
        console.error("Error deleting notification:", err);
        fetchNotifications();
      }
    },
    [notifications, activeBuildingIds, refreshUnreadCount, fetchNotifications]
  );

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    activeBuildingIds,
    setNotificationBuildingFilters,
    fetchNotifications,
    fetchUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
