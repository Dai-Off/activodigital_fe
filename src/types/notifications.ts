/**
 * src/types/notifications.ts
 */

export const NotificationType = {
  MAINTENANCE: "maintenance",
  FINANCIAL: "financial",
  EXPIRATION: "expiration",
  RENEWAL: "renewal",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

// Reintroducimos el estado de notificación para que el servicio compile
export const NotificationStatus = {
  UNREAD: "unread",
  READ: "read",
} as const;

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export interface Notification {
  id: string;
  buildingId: string;
  type: NotificationType;
  title: string;
  expiration: string | null;
  priority: number;
  readAt?: string;
  message?: string;
  createdAt: string;
  status?: NotificationStatus;
}

export interface CreateNotificationRequest {
  building_id: string;
  type: NotificationType;
  title: string;
  expiration: string | null;
  priority: number;
}

export interface NotificationFilters {
  // Añadimos el nuevo campo de filtro
  buildingIds?: string[];
  // Añadimos el filtro de estado (necesario para el frontend)
  status?: NotificationStatus;
  type?: NotificationType;
  limit?: number;
  offset?: number;
}
