// src/components/buildings/CreateBuildingMethodSelection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Database, X, AlertTriangle, RefreshCw } from 'lucide-react';

export type BuildingCreationMethod = 'manual' | 'catastro';

interface CreateBuildingMethodSelectionProps {
  isOpen: boolean;
  onSelectMethod: (method: BuildingCreationMethod) => void;
  onClose: () => void;
  /** Indica si la API de Catastro está disponible */
  isCadastreOnline?: boolean;
  /** Diagnóstico granular del estado de Catastro (ok, timeout, falso_200, etc.) */
  catastroStatus?: string;
  /** Callback para reintentar la comprobación de estado de Catastro */
  onRetryCatastro?: () => void;
  /** Indica si la comprobación de estado está en curso */
  isCheckingCatastro?: boolean;
}

/**
 * Devuelve la clave i18n del mensaje de aviso según el estado de Catastro.
 * Permite mostrar mensajes más específicos al usuario.
 */
const obtenerClaveAviso = (status: string): string => {
  switch (status) {
    case 'timeout':
      return 'catastroTimeout';
    case 'falso_200':
      return 'catastroFalso200';
    default:
      // 'error_http', 'error_red', 'forzado_offline', etc.
      return 'catastroUnavailable';
  }
};

/**
 * Devuelve la clave i18n de la etiqueta del badge según el estado de Catastro.
 */
const obtenerEtiquetaBadge = (status: string): string => {
  switch (status) {
    case 'timeout':
      return 'catastroStatusTimeout';
    case 'falso_200':
      return 'catastroStatusDegraded';
    default:
      return 'catastroStatusOffline';
  }
};

const CreateBuildingMethodSelection: React.FC<CreateBuildingMethodSelectionProps> = ({
  isOpen,
  onSelectMethod,
  onClose,
  isCadastreOnline = true,
  catastroStatus = '',
  onRetryCatastro,
  isCheckingCatastro = false,
}) => {
  const { t } = useTranslation();

  // Prevenir scroll cuando el modal está abierto
  React.useEffect(() => {
    if (isOpen) {
      // Guardar el valor actual del overflow y la posición del scroll
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const scrollY = window.scrollY;
      
      // Deshabilitar scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Restaurar cuando se cierre
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determinar mensajes según el status del backend
  const claveAviso = obtenerClaveAviso(catastroStatus);
  const claveBadge = obtenerEtiquetaBadge(catastroStatus);

  return (
    <>
      {/* Overlay - responsive: ancho completo en móvil, con margen en escritorio */}
      <div 
        className="fixed bg-black/40 backdrop-blur-sm z-[60] pointer-events-auto overflow-hidden inset-0"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label={t('close')}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />
      
      {/* Contenido del modal - responsive: centrado con padding adecuado */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-4 md:p-6 pointer-events-auto max-h-[90vh] overflow-y-auto border-0 relative">
          
          {/* Spinner de carga dentro del modal */}
          {isCheckingCatastro && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-xl">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-medium text-gray-700">
                {t('verifyingCatastro', 'Verificando conexión con Catastro...')}
              </p>
            </div>
          )}
        {/* Encabezado */}
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <div className="flex-1 pr-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {t('selectMethod')}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {t('selectMethodDesc')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aviso de Catastro no disponible — mensaje granular según status + botón Reintentar */}
        {!isCadastreOnline && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs md:text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span className="flex-1">{t(claveAviso)}</span>
            {onRetryCatastro && (
              <button
                type="button"
                onClick={onRetryCatastro}
                disabled={isCheckingCatastro}
                className="inline-flex items-center gap-1 rounded-md bg-amber-100 hover:bg-amber-200 px-2.5 py-1 text-xs font-medium text-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                aria-label={t('catastroRetry')}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingCatastro ? 'animate-spin' : ''}`} />
                {t('catastroRetry')}
              </button>
            )}
          </div>
        )}

        {/* Opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Opción Manual */}
          <button
            type="button"
            onClick={() => onSelectMethod('manual')}
            className="group relative p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-100 transition-all duration-200 text-left"
          >
            <div className="flex flex-col items-start">
              <div className="mb-3 p-2 md:p-3 bg-white rounded-lg group-hover:bg-gray-50 transition-colors border border-gray-200">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </div>
              <h3 className="text-sm md:text-base font-medium text-gray-700 mb-1 md:mb-2">
                {t('manualMethod')}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {t('manualMethodDesc')}
              </p>
            </div>
          </button>

          {/* Opción Catastro */}
          <button
            type="button"
            onClick={() => isCadastreOnline && onSelectMethod('catastro')}
            disabled={!isCadastreOnline}
            className={`group relative p-4 md:p-6 border rounded-lg transition-all duration-200 text-left ${
              isCadastreOnline
                ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100 cursor-pointer'
                : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex flex-col items-start">
              <div className={`mb-3 p-2 md:p-3 rounded-lg transition-colors border border-gray-200 ${
                isCadastreOnline ? 'bg-white group-hover:bg-gray-50' : 'bg-gray-50'
              }`}>
                <Database className={`w-4 h-4 md:w-5 md:h-5 ${isCadastreOnline ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-sm md:text-base font-medium mb-1 md:mb-2 ${
                isCadastreOnline ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {t('catastroMethod')}
              </h3>
              <p className={`text-xs md:text-sm ${isCadastreOnline ? 'text-gray-500' : 'text-gray-400'}`}>
                {isCadastreOnline
                  ? t('catastroMethodDesc')
                  : t('catastroUnavailableShort')}
              </p>
            </div>
            {!isCadastreOnline && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  <AlertTriangle className="w-3 h-3" />
                  {t(claveBadge)}
                </span>
              </div>
            )}
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default CreateBuildingMethodSelection;
