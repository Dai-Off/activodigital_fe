import React, { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalFrameProps {
  active: boolean;
  onClose: () => void;
  icon: ReactNode;
  title: string;
  subtitle?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "4xl" | "5xl";
}

/** Bloquea el scroll del body y html cuando la modal está abierta */
function useModalScrollLock(active: boolean) {
  useEffect(() => {
    if (active) {
      const prevHtml = document.documentElement.style.overflow;
      const prevBody = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prevHtml;
        document.body.style.overflow = prevBody;
      };
    }
  }, [active]);
}

/** Marco reutilizable para modales: overlay, header, scroll lock, blur */
const ModalFrame: React.FC<ModalFrameProps> = ({
  active,
  onClose,
  icon,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "5xl",
}) => {
  useModalScrollLock(active);

  if (!active) return null;

  const maxWidthClass = maxWidth === "4xl" ? "max-w-4xl" : "max-w-5xl";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[90] p-2 sm:p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${maxWidthClass} max-h-[90dvh] sm:max-h-[92vh] flex flex-col min-h-0`}
      >
        {/* Header */}
        <div className="bg-[#1e3a8a] px-3 sm:px-4 py-3 rounded-t-xl flex-shrink-0">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="bg-white/10 p-1.5 rounded flex-shrink-0">{icon}</div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm text-white">{title}</h2>
                {subtitle != null && subtitle !== "" && (
                  <p className="text-[10px] sm:text-xs text-blue-200 truncate">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10 flex-shrink-0"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 bg-white text-xs">{children}</div>

        {footer != null && (
          <div className="border-t bg-gray-50 flex-shrink-0">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default ModalFrame;
export { useModalScrollLock };
