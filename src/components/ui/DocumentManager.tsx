import { useTranslation } from 'react-i18next';
import React, { useState, useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { 
  uploadDocument, 
  deleteDocument,
  formatFileSize,
  ALLOWED_DOCUMENT_TYPES
} from '../../services/documentUpload';
import FileUpload from './FileUpload';

export interface DocumentFile {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  title?: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface DocumentManagerProps {
  bookId: string;
  sectionType: string;
  userId: string;
  existingDocuments: DocumentFile[];
  onDocumentsUpdated: (documents: DocumentFile[]) => void;
  maxDocuments?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
  label?: string;
  description?: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  bookId,
  sectionType,
  userId,
  existingDocuments,
  onDocumentsUpdated,
  maxDocuments = 20,
  maxSizeMB = 10,
  acceptedTypes = Object.keys(ALLOWED_DOCUMENT_TYPES),
  className = '',
  label = 'Subir documentos',
  description = 'Arrastra archivos aquí o haz clic para seleccionar'
}) => {
  const { t } = useTranslation();
  label = t('uploadDocuments', label);
  description = t('dragOrClick', description);
  const { showSuccess, showError, showInfo } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Manejar subida de nuevos documentos
  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Verificar límite de documentos
    if (existingDocuments.length + files.length > maxDocuments) {
      showError(
        'Límite de documentos excedido',
        `Solo puedes subir hasta ${maxDocuments} documentos. Actualmente tienes ${existingDocuments.length}.`
      );
      return;
    }

    setIsUploading(true);
    showInfo('Subiendo documentos...', 'Los documentos se están procesando');

    try {
      const uploadPromises = files.map((file) => 
        uploadDocument(file, bookId, sectionType, userId)
      );

      const uploadResults = await Promise.all(uploadPromises);

      // Verificar resultados
      const successfulUploads = uploadResults.filter(result => result.success && result.document);
      const failedUploads = uploadResults.filter(result => !result.success);

      if (failedUploads.length > 0) {
        console.warn('Algunos documentos no se pudieron subir:', failedUploads);
        showError(
          'Error en algunos documentos',
          `${failedUploads.length} de ${uploadResults.length} documentos no se pudieron subir.`
        );
      }

      if (successfulUploads.length > 0) {
        // Convertir a formato DocumentFile
        const newDocuments: DocumentFile[] = successfulUploads.map(result => ({
          id: result.document!.id,
          url: result.document!.url,
          fileName: result.document!.fileName,
          fileSize: result.document!.fileSize,
          mimeType: result.document!.mimeType,
          title: result.document!.title,
          uploadedAt: result.document!.uploadedAt,
          uploadedBy: result.document!.uploadedBy
        }));

        // Actualizar estado local
        const updatedDocuments = [...existingDocuments, ...newDocuments];
        onDocumentsUpdated(updatedDocuments);

        showSuccess(
          'Documentos subidos',
          `${successfulUploads.length} documento(s) subido(s) correctamente.`
        );
      }

    } catch (error) {
      console.error('Error subiendo documentos:', error);
      showError(
        'Error subiendo documentos',
        error instanceof Error ? error.message : 'Error desconocido'
      );
    } finally {
      setIsUploading(false);
    }
  }, [bookId, sectionType, userId, existingDocuments, maxDocuments, onDocumentsUpdated, showError, showInfo, showSuccess]);

  // Manejar eliminación de documento
  const handleDeleteDocument = useCallback(async (documentId: string, documentUrl: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      return;
    }

    setIsDeleting(documentId);
    
    try {
      // Eliminar de Supabase Storage
      const deleteResult = await deleteDocument(documentUrl);
      
      if (!deleteResult.success) {
        throw new Error(deleteResult.error || 'Error eliminando documento');
      }

      // Actualizar estado local
      const updatedDocuments = existingDocuments.filter(doc => doc.id !== documentId);
      onDocumentsUpdated(updatedDocuments);

      showSuccess('Documento eliminado', 'El documento se ha eliminado correctamente.');

    } catch (error) {
      console.error('Error eliminando documento:', error);
      showError(
        'Error eliminando documento',
        error instanceof Error ? error.message : 'Error desconocido'
      );
    } finally {
      setIsDeleting(null);
    }
  }, [existingDocuments, onDocumentsUpdated, showError, showSuccess]);

  // Manejar descarga de documento
  const handleDownloadDocument = useCallback((documentUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const canUploadMore = existingDocuments.length < maxDocuments;

  // Profesional minimal file icons (no emojis)
  const renderIcon = (mime: string) => {
    const base = (cls: string) => (
      <svg className={`w-5 h-5 ${cls}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6"/>
      </svg>
    );
    if (mime.includes('pdf')) return base('text-red-500');
    if (mime.includes('word') || mime.includes('document')) return base('text-blue-600');
    if (mime.includes('excel') || mime.includes('spreadsheet')) return base('text-green-600');
    if (mime.includes('powerpoint') || mime.includes('presentation')) return base('text-orange-500');
    if (mime.includes('image')) return base('text-gray-500');
    if (mime.includes('zip')) return base('text-yellow-600');
    return base('text-gray-400');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Subida de archivos */}
      {canUploadMore && (
        <FileUpload
          onFilesSelected={handleFilesSelected}
          acceptedTypes={acceptedTypes}
          maxFiles={maxDocuments - existingDocuments.length}
          maxSizeInMB={maxSizeMB}
          label={label}
          description={description}
          disabled={isUploading}
        />
      )}

      {/* Estado de carga */}
      {isUploading && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Subiendo documentos...</span>
        </div>
      )}

      {/* Lista de documentos */}
      {existingDocuments.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-sm font-medium text-gray-700">
            Documentos ({existingDocuments.length}/{maxDocuments})
          </h3>
          
          <div className="space-y-1.5">
            {existingDocuments.map((document) => {
              const isDeletingThis = isDeleting === document.id;
              
              return (
                <div 
                  key={document.id} 
                  className="flex items-center gap-3 p-2.5 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
                >
                  {/* Ícono */}
                  <div className="shrink-0">{renderIcon(document.mimeType)}</div>
                  
                  {/* Información del documento */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {document.title || document.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(document.fileSize)} • {new Date(document.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex items-center gap-2">
                    {/* Botón de descarga */}
                    <button
                      type="button"
                      onClick={() => handleDownloadDocument(document.url, document.fileName)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Descargar documento"
                      disabled={isDeletingThis}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    
                    {/* Botón de eliminar */}
                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(document.id, document.url)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar documento"
                      disabled={isDeletingThis}
                    >
                      {isDeletingThis ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay documentos */}
      {existingDocuments.length === 0 && !isUploading && (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay documentos subidos. Arrastra archivos o haz clic arriba para comenzar.
        </p>
      )}

      {/* Información de límite */}
      {existingDocuments.length >= maxDocuments && (
        <p className="text-sm text-gray-500 text-center">
          Has alcanzado el límite máximo de {maxDocuments} documentos.
        </p>
      )}
    </div>
  );
};

export default DocumentManager;

