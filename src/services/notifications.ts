import { apiFetch } from "./api";
import type { NotificationFilters, Notification } from "../types/notifications";

export interface NotificationListResponse {
  data: Notification[];
  count: number;
  total: number;
  filters: NotificationFilters;
}

export interface CreateNotificationPayload {
  building_id: string;
  type: string;
  title: string;
  priority: number;
  [key: string]: any;
}

export class NotificationApiService {
  /** 1. GET /notifications/unread: Obtiene notificaciones no leídas de un edificio. */
  async getUnreadNotifications(
    userId: string,
    limit: number = 10
  ): Promise<Notification[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    queryParams.append("userId", userId);

    const response = await apiFetch(
      `/notifications/unread?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );
    // Devuelve el array de notificaciones.
    return Array.isArray(response) ? response : response.data || [];
  }

  /** 2. GET /notifications/building: Obtiene el historial completo de notificaciones de un edificio. */
  async getBuildingHistory(
    buildingId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("buildingId", buildingId);
    queryParams.append("limit", limit.toString());
    queryParams.append("offset", offset.toString());

    return await apiFetch(`/notifications/building?${queryParams.toString()}`, {
      method: "GET",
    });
  }

  /** 3. POST /notifications: Crea una nueva notificación. */
  async createNotification(
    payload: CreateNotificationPayload
  ): Promise<boolean> {
    try {
      const response = await apiFetch(`/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return !!response;
    } catch (error) {
      console.error("Error al crear notificación:", error);
      return false;
    }
  }

  /** 4. PUT /notifications/:id/read: Marca una notificación específica como leída. */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await apiFetch(`/notifications/${notificationId}/read`, {
        method: "PUT",
      });
      return response.success || true;
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
      return false;
    }
  }

  /**  */
  async markAllUserAsRead(userId: string): Promise<boolean> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("userId", userId);

      const response = await apiFetch(
        `/notifications/markAll?${queryParams.toString()}`,
        {
          method: "PUT",
        }
      );
      return response.success || true;
    } catch (error) {
      console.error(
        "Error al marcar todas las notificaciones como leídas:",
        error
      );
      return false;
    }
  }

  /** 5. DELETE /notifications/:id: Elimina una notificación específica (requiere buildingId para permisos). */
  async deleteNotification(
    notificationId: string,
    buildingId: string
  ): Promise<boolean> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("buildingId", buildingId);

      const response = await apiFetch(
        `/notifications/${notificationId}?${queryParams.toString()}`,
        {
          method: "DELETE",
        }
      );
      return response.success || true;
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
      return false;
    }
  }

  /** 6. DELETE /notifications/cleanup: Realiza una limpieza masiva de notificaciones antiguas. */
  async cleanupNotifications(
    buildingId: string,
    days: number = 30
  ): Promise<boolean> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("buildingId", buildingId);
      queryParams.append("days", days.toString());

      const response = await apiFetch(
        `/notifications/cleanup?${queryParams.toString()}`,
        {
          method: "DELETE",
        }
      );
      return response.success || true;
    } catch (error) {
      console.error("Error en limpieza de notificaciones:", error);
      return false;
    }
  }

  /** 7. GET /notifications: Obtiene notificaciones filtradas por usuario. */
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("userId", userId);

    const response = await apiFetch(
      `/notifications?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );
    // Devuelve el array de notificaciones del usuario.
    return Array.isArray(response) ? response : response.data || [];
  }
}

export const notificationApiService = new NotificationApiService();
