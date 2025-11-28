// src/components/ui/NotificationBell.tsx
import React, { useEffect, useState } from "react";
import { useNotifications } from "../../contexts/NotificationContext";
import NotificationPanel from "./NotificationPanel";

const NotificationBell: React.FC = () => {
  const { unreadCount, refreshUnreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative">
      {/* Bell Icon - Estilo consistente con otros botones */}
      <button
        onClick={togglePanel}
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        aria-label="Notificaciones"
        title="Notificaciones"
      >
        <svg
          className={`w-4 h-4 transition-all duration-200 ${
            isOpen ? "text-blue-600" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>

        {/* Badge de conteo - Más sutil */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <NotificationPanel onClose={() => setIsOpen(false)} />
        </>
      )}
    </div>
  );
};

export default NotificationBell;
