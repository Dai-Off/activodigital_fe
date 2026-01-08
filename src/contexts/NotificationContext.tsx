// src/contexts/NotificationContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { notificationApiService } from "../services/notifications";
import type { Notification, NotificationFilters } from "../types/notifications";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  activeBuildingIds: string[];
  unreadNotifications: Notification[];

  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  fetchUserNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  setNotificationBuildingFilters: (ids: string[]) => void;
  UnreadNotifications: () => Promise<void>;
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
  const [unreadNotifications, setUnreadNot] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeBuildingIds, setActiveBuildingIds] = useState<string[]>([]);
  const { user } = useAuth();

  const setNotificationBuildingFilters = useCallback((ids: string[]) => {
    setActiveBuildingIds(ids);
  }, []);

  // Socket.io integration
  useEffect(() => {
    if (!user?.userId) return;

    // Conectar al socket
    const socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
      {
        path: "/socket.io",
        transports: ["websocket"], // Forzar websocket para evitar polling inicial si es posible
      }
    );

    socket.on("connect", () => {
      // Unirse a la sala del usuario
      socket.emit("join", user.userId);
    });

    socket.on("notification:new", (newNotification: Notification) => {
      // Mostrar toast
      toast.info(newNotification.title, {
        description: newNotification.message || "Nueva notificación recibida",
      });

      // Actualizar contador
      setUnreadCount((prev) => prev + 1);

      // Actualizar lista de notificaciones (si estamos viendo todas o si coincide con los filtros actuales)
      setNotifications((prev) => [newNotification, ...prev]);

      // Actualizar lista de no leídas
      setUnreadNot((prev) => [newNotification, ...prev]);
    });

    return () => {
      console.log("[NotificationContext] Disconnecting socket");
      socket.disconnect();
    };
  }, [user?.userId]);

  // Actualiza el conteo de no leídas
  const refreshUnreadCount = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const unread = await notificationApiService.getUnreadNotifications(
        user.userId
      );
      setUnreadCount(unread.length);
    } catch (err) {
      console.error("Error updating unread count:", err);
    }
  }, [user?.userId]);

  // Obtiene todas las notificaciones no leídas
  const UnreadNotifications = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const unread = await notificationApiService.getUnreadNotifications(
        user.userId
      );
      setUnreadNot(unread);
    } catch (err) {
      console.error("Error updating unread count:", err);
    }
  }, [user?.userId]);

  // Obtiene notificaciones de Edificio (Historial)
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

  // Obtiene notificaciones de Usuario (Personal)
  const fetchUserNotifications = useCallback(async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const userNotifications =
        await notificationApiService.getUserNotifications(user.userId);
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
  }, [user?.userId]);

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
    unreadNotifications,
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
    UnreadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
