// src/components/buildings/CreateBuildingMethodSelection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Database, X } from 'lucide-react';

export type BuildingCreationMethod = 'manual' | 'catastro';

interface CreateBuildingMethodSelectionProps {
  isOpen: boolean;
  onSelectMethod: (method: BuildingCreationMethod) => void;
  onClose: () => void;
}

const CreateBuildingMethodSelection: React.FC<CreateBuildingMethodSelectionProps> = ({
  isOpen,
  onSelectMethod,
  onClose,
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

  return (
    <>
      {/* Overlay - responsive: full width en mobile, con margen en desktop */}
      <div 
        className="fixed bg-black/40 backdrop-blur-sm z-[60] pointer-events-auto overflow-hidden inset-0"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Cerrar modal"
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />
      
      {/* Modal Content - responsive: centrado con padding adecuado */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-4 md:p-6 pointer-events-auto max-h-[90vh] overflow-y-auto border-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <div className="flex-1 pr-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {t('buildingWizard.selectMethod', 'Selecciona cómo crear el edificio')}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {t('buildingWizard.selectMethodDesc', 'Elige el método que prefieras para cargar los datos del edificio')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
            aria-label={t('common.close', 'Cerrar')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
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
                {t('buildingWizard.manualMethod', 'Cargar datos manualmente')}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {t(
                  'buildingWizard.manualMethodDesc',
                  'Completa el formulario paso a paso con la información del edificio'
                )}
              </p>
            </div>
          </button>

          {/* Opción Catastro */}
          <button
            type="button"
            onClick={() => onSelectMethod('catastro')}
            className="group relative p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-100 transition-all duration-200 text-left"
          >
            <div className="flex flex-col items-start">
              <div className="mb-3 p-2 md:p-3 bg-white rounded-lg group-hover:bg-gray-50 transition-colors border border-gray-200">
                <Database className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </div>
              <h3 className="text-sm md:text-base font-medium text-gray-700 mb-1 md:mb-2">
                {t('buildingWizard.catastroMethod', 'Cargar desde Catastro')}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {t(
                  'buildingWizard.catastroMethodDesc',
                  'Ingresa el ID de catastro y obtén automáticamente toda la información del edificio'
                )}
              </p>
            </div>
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default CreateBuildingMethodSelection;

