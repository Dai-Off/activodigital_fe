import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Tipos de notificaciones
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Interfaz para una notificación
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Interfaz del contexto
interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook para usar el contexto
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Props del provider
interface ToastProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Generar ID único
  const generateId = useCallback((): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }, []);

  // Mostrar notificación
  const showToast = useCallback((toast: Omit<Toast, 'id'>): void => {
    const id = generateId();
    const newToast: Toast = {
      id,
      duration: 5000, // 5 segundos por defecto
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-hide después del duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  }, [generateId]);

  // Ocultar notificación
  const hideToast = useCallback((id: string): void => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Funciones de conveniencia
  const showSuccess = useCallback((title: string, message?: string): void => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string): void => {
    showToast({ type: 'error', title, message, duration: 7000 }); // Errores duran más
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string): void => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string): void => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const value: ToastContextType = {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
