// src/components/ui/NotificationPanel.tsx
import React from "react";
import { useNotifications } from "../../contexts/NotificationContext";
import { useAuth } from "../../contexts/AuthContext";
import type { Notification } from "../../types/notifications";

interface NotificationPanelProps {
  onClose?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = () => {
  // Obtener datos del contexto de manera segura
  let notifications: Notification[] = [];
  let unreadCount = 0;
  let isLoading = false;
  let error: string | null = null;
  let markAsRead: (id: string) => Promise<void> = async () => {};
  let markAllAsRead: (userId: string) => Promise<void> = async () => {};
  let deleteNotification: (id: string) => Promise<void> = async () => {};
  let fetchNotifications: (filters?: any) => Promise<void> = async () => {};

  try {
    const context = useNotifications();
    notifications = context.notifications || [];
    unreadCount = context.unreadCount || 0;
    isLoading = context.isLoading || false;
    error = context.error || null;
    markAsRead = context.markAsRead || (async () => {});
    markAllAsRead = context.markAllAsRead || (async () => {});
    deleteNotification = context.deleteNotification || (async () => {});
    fetchNotifications = context.fetchNotifications || (async () => {});
  } catch (err) {
    console.error("Error obteniendo contexto de notificaciones:", err);
    error = "Error al cargar notificaciones";
  }

  const { user } = useAuth();

  // Obtener icono según el tipo (compacto)
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ai_processing_complete":
        return (
          <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "ai_processing_error":
        return (
          <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center">
            <svg
              className="w-4 h-4 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.status === "unread") {
      await markAsRead(notification.id);
    }
  };

  const handleDelete = async (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    await deleteNotification(notificationId);
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
      {/* Header compacto */}
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900">Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Acciones compactas */}
        {notifications.some((n) => n.status === "unread") && (
          <div className="mt-2">
            <button
              onClick={() => user?.userId && markAllAsRead(user.userId)}
              className="text-xs text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Marcar todas como leídas
            </button>
          </div>
        )}
      </div>

      {/* Content compacto */}
      <div className="max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Cargando...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-red-600 text-sm">Error al cargar</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center">
            <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Sin notificaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleMarkAsRead(notification)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleMarkAsRead(notification)}
                role="button"
                tabIndex={0}
                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  notification.status === "unread"
                    ? "bg-blue-50/30 border-l-2 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            notification.status === "unread"
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                          {notification.status === "unread" && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full font-medium">
                              Nuevo
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                        title="Eliminar"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer compacto */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => fetchNotifications({ limit: 50 })}
          className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded transition-colors"
        >
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
