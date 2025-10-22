// src/services/notifications.ts
import { apiFetch } from './api';
import type { 
  NotificationFilters, 
  NotificationResponse, 
  UnreadCountResponse 
} from '../types/notifications';

export class NotificationService {
  /**
   * Obtiene las notificaciones del usuario con filtros opcionales
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<NotificationResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.offset) queryParams.append('offset', filters.offset.toString());

    const queryString = queryParams.toString();
    const path = queryString ? `/notifications?${queryString}` : '/notifications';

    return await apiFetch(path);
  }

  /**
   * Obtiene el conteo de notificaciones no leídas
   */
  async getUnreadCount(): Promise<number> {
    const response: UnreadCountResponse = await apiFetch('/notifications/unread-count');
    return response.unreadCount;
  }

  /**
   * Marca una notificación como leída
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await apiFetch(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      return response.success;
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      return false;
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<number> {
    try {
      const response = await apiFetch('/notifications/mark-all-read', {
        method: 'PUT'
      });
      return response.count;
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      return 0;
    }
  }

  /**
   * Elimina una notificación
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await apiFetch(`/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      return response.success;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      return false;
    }
  }

  /**
   * Elimina notificaciones antiguas
   */
  async deleteOldNotifications(daysOld: number = 30): Promise<number> {
    try {
      const response = await apiFetch(`/notifications/cleanup?days=${daysOld}`, {
        method: 'DELETE'
      });
      return response.count;
    } catch (error) {
      console.error('Error al eliminar notificaciones antiguas:', error);
      return 0;
    }
  }
}

// Instancia singleton del servicio
export const notificationService = new NotificationService();
