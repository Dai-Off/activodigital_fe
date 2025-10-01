import React, { useState } from 'react';
import DocumentManager from '../ui/DocumentManager';
import type { DocumentacionAdministrativa } from '../../types/digitalbook';

interface DocumentacionAdministrativaSectionProps {
  bookId: string;
  userId: string;
  initialData?: DocumentacionAdministrativa;
  onSave: (data: DocumentacionAdministrativa) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
}

/**
 * Componente de ejemplo para la sección Documentación Administrativa
 */
const DocumentacionAdministrativaSection: React.FC<DocumentacionAdministrativaSectionProps> = ({
  bookId,
  userId,
  initialData,
  onSave,
  onNext,
  onPrevious
}) => {
  const [documentacion, setDocumentacion] = useState<DocumentacionAdministrativa>(
    initialData || {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(documentacion);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndNext = async () => {
    await handleSave();
    onNext?.();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Documentación Administrativa y Legal</h2>
        <p className="text-sm text-gray-600 mt-1">
          Sube las licencias, autorizaciones y documentación legal del edificio.
        </p>
      </div>

      {/* Licencias de Obra */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Licencias de Obra</h3>
        <DocumentManager
          bookId={bookId}
          sectionType="documentacion_administrativa"
          userId={userId}
          existingDocuments={documentacion.licenciasObra || []}
          onDocumentsUpdated={(docs) => setDocumentacion(prev => ({ ...prev, licenciasObra: docs }))}
          maxDocuments={10}
          label="Subir licencias de obra"
        />
      </div>

      {/* Licencia de Primera Ocupación */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Licencia de Primera Ocupación</h3>
        <DocumentManager
          bookId={bookId}
          sectionType="documentacion_administrativa"
          userId={userId}
          existingDocuments={documentacion.licenciaPrimeraOcupacion || []}
          onDocumentsUpdated={(docs) => setDocumentacion(prev => ({ ...prev, licenciaPrimeraOcupacion: docs }))}
          maxDocuments={5}
          label="Subir licencia de primera ocupación"
        />
      </div>

      {/* Autorizaciones Administrativas */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Autorizaciones Administrativas</h3>
        <DocumentManager
          bookId={bookId}
          sectionType="documentacion_administrativa"
          userId={userId}
          existingDocuments={documentacion.autorizacionesAdministrativas || []}
          onDocumentsUpdated={(docs) => setDocumentacion(prev => ({ ...prev, autorizacionesAdministrativas: docs }))}
          maxDocuments={10}
          label="Subir autorizaciones"
        />
      </div>

      {/* Garantías de Agentes */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Garantías de Agentes</h3>
        <DocumentManager
          bookId={bookId}
          sectionType="documentacion_administrativa"
          userId={userId}
          existingDocuments={documentacion.garantiasAgentes || []}
          onDocumentsUpdated={(docs) => setDocumentacion(prev => ({ ...prev, garantiasAgentes: docs }))}
          maxDocuments={10}
          label="Subir garantías"
        />
      </div>

      {/* Seguro Decenal */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Seguro Decenal</h3>
        <DocumentManager
          bookId={bookId}
          sectionType="documentacion_administrativa"
          userId={userId}
          existingDocuments={documentacion.seguroDecenal || []}
          onDocumentsUpdated={(docs) => setDocumentacion(prev => ({ ...prev, seguroDecenal: docs }))}
          maxDocuments={5}
          label="Subir seguro decenal"
        />
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Anterior
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndNext}
            disabled={isSaving}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Guardar y Continuar →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentacionAdministrativaSection;

