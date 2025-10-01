import React, { useState } from 'react';
import DocumentManager, { type DocumentFile } from '../ui/DocumentManager';
import type { ProyectoTecnico } from '../../types/digitalbook';

interface ProyectoTecnicoSectionProps {
  bookId: string;
  userId: string;
  initialData?: ProyectoTecnico;
  onSave: (data: ProyectoTecnico) => Promise<void>;
  onNext?: () => void;
  onPrevious?: () => void;
}

/**
 * Componente de ejemplo para la sección Proyecto Técnico
 * Muestra cómo integrar DocumentManager para subir documentos
 */
const ProyectoTecnicoSection: React.FC<ProyectoTecnicoSectionProps> = ({
  bookId,
  userId,
  initialData,
  onSave,
  onNext,
  onPrevious
}) => {
  const [proyectoTecnico, setProyectoTecnico] = useState<ProyectoTecnico>(
    initialData || {}
  );
  const [isSaving, setIsSaving] = useState(false);

  // Manejadores para actualizar cada campo de documentos
  const handleProyectoEjecucionUpdate = (documents: DocumentFile[]) => {
    setProyectoTecnico(prev => ({
      ...prev,
      proyectoEjecucion: documents
    }));
  };

  const handleModificacionesUpdate = (documents: DocumentFile[]) => {
    setProyectoTecnico(prev => ({
      ...prev,
      modificacionesProyecto: documents
    }));
  };

  const handleMemoriaObraUpdate = (documents: DocumentFile[]) => {
    setProyectoTecnico(prev => ({
      ...prev,
      memoriaObra: documents
    }));
  };

  const handlePlanosUpdate = (documents: DocumentFile[]) => {
    setProyectoTecnico(prev => ({
      ...prev,
      planos: documents
    }));
  };

  // Guardar cambios
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(proyectoTecnico);
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar y continuar
  const handleSaveAndNext = async () => {
    await handleSave();
    onNext?.();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Proyecto Técnico</h2>
        <p className="text-sm text-gray-600 mt-1">
          Sube la documentación técnica del proyecto: proyecto de ejecución, planos, memoria de obra, etc.
        </p>
      </div>

      {/* Proyecto de Ejecución */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Proyecto de Ejecución</h3>
        <p className="text-sm text-gray-600">
          Documentos del proyecto de ejecución (PDF, DWG, etc.)
        </p>
        <DocumentManager
          bookId={bookId}
          sectionType="proyecto_tecnico"
          userId={userId}
          existingDocuments={proyectoTecnico.proyectoEjecucion || []}
          onDocumentsUpdated={handleProyectoEjecucionUpdate}
          maxDocuments={10}
          label="Subir proyecto de ejecución"
          description="Arrastra archivos PDF, DWG o haz clic para seleccionar"
        />
      </div>

      {/* Modificaciones al Proyecto */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Modificaciones al Proyecto</h3>
        <p className="text-sm text-gray-600">
          Documentos de modificaciones realizadas al proyecto original
        </p>
        <DocumentManager
          bookId={bookId}
          sectionType="proyecto_tecnico"
          userId={userId}
          existingDocuments={proyectoTecnico.modificacionesProyecto || []}
          onDocumentsUpdated={handleModificacionesUpdate}
          maxDocuments={10}
          label="Subir modificaciones"
        />
      </div>

      {/* Memoria de Obra */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Memoria de Obra</h3>
        <p className="text-sm text-gray-600">
          Memoria descriptiva de la obra ejecutada
        </p>
        <DocumentManager
          bookId={bookId}
          sectionType="proyecto_tecnico"
          userId={userId}
          existingDocuments={proyectoTecnico.memoriaObra || []}
          onDocumentsUpdated={handleMemoriaObraUpdate}
          maxDocuments={5}
          label="Subir memoria de obra"
        />
      </div>

      {/* Planos */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Planos</h3>
        <p className="text-sm text-gray-600">
          Planos técnicos del edificio (plantas, alzados, secciones, etc.)
        </p>
        <DocumentManager
          bookId={bookId}
          sectionType="proyecto_tecnico"
          userId={userId}
          existingDocuments={proyectoTecnico.planos || []}
          onDocumentsUpdated={handlePlanosUpdate}
          maxDocuments={20}
          label="Subir planos"
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

export default ProyectoTecnicoSection;

