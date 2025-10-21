import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../ui/FileUpload';

interface PdfImportProps {
  buildingName?: string;
  buildingId?: string;
}

interface ImportedDocument {
  id: string;
  name: string;
  size: number;
  pages: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  extractedSections?: string[];
}

const PdfImport: React.FC<PdfImportProps> = ({
  buildingName = "Torre Central",
  buildingId = "building-1"
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [uploadedDocuments, setUploadedDocuments] = useState<ImportedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    setIsProcessing(true);
    
    // Crear documentos con estado inicial
    const newDocs: ImportedDocument[] = files.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      pages: Math.floor(Math.random() * 50) + 10, // Simular número de páginas
      status: 'uploading'
    }));

    setUploadedDocuments(prev => [...prev, ...newDocs]);

    // Simular proceso de carga y análisis
    for (let i = 0; i < newDocs.length; i++) {
      const doc = newDocs[i];
      
      // Actualizar a "processing"
      setTimeout(() => {
        setUploadedDocuments(prev => 
          prev.map(d => d.id === doc.id ? { ...d, status: 'processing' } : d)
        );
      }, 1000 + (i * 500));

      // Actualizar a "ready" con secciones extraídas
      setTimeout(() => {
        const extractedSections = [
          'Datos generales del edificio',
          'Características constructivas y técnicas',
          'Certificados y licencias'
        ].slice(0, Math.floor(Math.random() * 3) + 1);

        setUploadedDocuments(prev => 
          prev.map(d => d.id === doc.id ? { 
            ...d, 
            status: 'ready',
            extractedSections
          } : d)
        );
      }, 3000 + (i * 500));
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 4000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return t('zeroBytes', '0 Bytes');
    const k = 1024;
    const sizes = [t('bytes', 'Bytes'), t('kb', 'KB'), t('mb', 'MB'), t('gb', 'GB')];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Subiendo...</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <div className="animate-pulse w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Analizando...</span>
          </div>
        );
      case 'ready':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Listo</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Error</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setUploadedDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleProcessDocuments = () => {
    // Simular procesamiento y navegación al wizard con datos pre-completados
    const readyDocs = uploadedDocuments.filter(doc => doc.status === 'ready');
    
    if (readyDocs.length > 0) {
      navigate('/libro-digital/manual', {
        state: {
          buildingId,
          buildingName,
          importedData: readyDocs,
          message: `${readyDocs.length} documento(s) procesado(s) exitosamente`
        }
      });
    }
  };

  const readyDocuments = uploadedDocuments.filter(doc => doc.status === 'ready');
  const canProcess = readyDocuments.length > 0 && !isProcessing;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        
        {/* Header */}
        <div className="mb-8">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <button 
                  onClick={() => navigate('/activos')}
                  className="hover:text-blue-600"
                >
                  Activos
                </button>
              </li>
              <li>
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/libro-digital/hub')}
                  className="hover:text-blue-600"
                >
                  Libro Digital
                </button>
              </li>
              <li>
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">
                Importación PDF - {buildingName}
              </li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Importar desde PDF
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sube documentos PDF existentes y nuestro sistema extraerá automáticamente 
              la información para completar las secciones del libro digital.
            </p>
          </div>
        </div>

        {/* Área de subida */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Subir documentos PDF
          </h2>
          
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes={['application/pdf']}
            maxFiles={10}
            maxSizeInMB={50}
            label="Arrastra archivos PDF aquí o haz clic para seleccionar"
            description="Sube hasta 10 archivos PDF (máximo 50MB cada uno). Soportamos certificados energéticos, planos técnicos, informes de mantenimiento y más."
            multiple
          />
        </div>

        {/* Lista de documentos subidos */}
        {uploadedDocuments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Documentos procesados ({uploadedDocuments.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="p-6">
                  <div className="flex items-start justify-between">
                    
                    {/* Información del documento */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {doc.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{doc.pages} páginas</span>
                        </div>
                        
                        {/* Secciones extraídas */}
                        {doc.extractedSections && doc.extractedSections.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Secciones identificadas:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {doc.extractedSections.map((section, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {section}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Estado y acciones */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      {getStatusIcon(doc.status)}
                      
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones finales */}
        {uploadedDocuments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
              
              {/* Resumen */}
              <div className="text-sm text-gray-600">
                {readyDocuments.length} de {uploadedDocuments.length} documentos procesados
                {isProcessing && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Procesando documentos...</span>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/libro-digital/hub')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleProcessDocuments}
                  disabled={!canProcess}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canProcess 
                    ? `Continuar con ${readyDocuments.length} documento(s)`
                    : isProcessing 
                      ? 'Procesando...'
                      : 'Esperando documentos'
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Tipos de documentos soportados
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Certificados energéticos</li>
                  <li>Planos técnicos y arquitectónicos</li>
                  <li>Informes de mantenimiento</li>
                  <li>Certificados de instalaciones</li>
                  <li>Documentos legales y licencias</li>
                  <li>Informes de sostenibilidad</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfImport;