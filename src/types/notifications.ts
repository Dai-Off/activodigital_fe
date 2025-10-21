// src/types/notifications.ts
export const NotificationType = {
  AI_PROCESSING_START: 'ai_processing_start',
  AI_PROCESSING_PROGRESS: 'ai_processing_progress', 
  AI_PROCESSING_COMPLETE: 'ai_processing_complete',
  AI_PROCESSING_ERROR: 'ai_processing_error',
  BOOK_CREATED: 'book_created',
  BOOK_UPDATED: 'book_updated',
  GENERAL: 'general'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const NotificationStatus = {
  UNREAD: 'unread',
  READ: 'read'
} as const;

export type NotificationStatus = typeof NotificationStatus[keyof typeof NotificationStatus];

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  metadata?: Record<string, any>;
  createdAt: string;
  readAt?: string;
}

export interface NotificationFilters {
  status?: NotificationStatus;
  type?: NotificationType;
  limit?: number;
  offset?: number;
}

export interface NotificationResponse {
  data: Notification[];
  count: number;
  filters: NotificationFilters;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
