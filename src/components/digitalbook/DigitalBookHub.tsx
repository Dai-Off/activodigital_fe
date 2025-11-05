import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ProgressBar from '../ui/ProgressBar';
import { getBookByBuilding, processPDFWithAI, type DigitalBook } from '../../services/digitalbook';
import { PageLoader } from '../ui/LoadingSystem';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import SkeletonSection from '../ui/SkeletonSection';
import { useTranslation } from 'react-i18next';

// Datos hardcodeados para demostrar la funcionalidad
const SECTION_LABELS = (t: any) => ({
  general_data: { title: t('generalData', 'Datos generales del edificio'), description: t('generalDataDesc', 'Información básica y características principales'), uiId: 'general_data' },
  construction_features: { title: t('constructionFeatures', 'Características constructivas y técnicas'), description: t('constructionFeaturesDesc', 'Especificaciones técnicas de construcción'), uiId: 'construction_features' },
  certificates_and_licenses: { title: t('certificatesAndLicenses', 'Certificados y licencias'), description: t('certificatesAndLicensesDesc', 'Documentación legal y certificaciones'), uiId: 'certificates' },
  maintenance_and_conservation: { title: t('maintenanceAndConservation', 'Mantenimiento y conservación'), description: t('maintenanceAndConservationDesc', 'Historial y planes de mantenimiento'), uiId: 'maintenance' },
  facilities_and_consumption: { title: t('facilitiesAndConsumption', 'Instalaciones y consumos'), description: t('facilitiesAndConsumptionDesc', 'Sistemas e instalaciones del edificio'), uiId: 'installations' },
  renovations_and_rehabilitations: { title: t('renovationsAndRehabilitations', 'Reformas y rehabilitaciones'), description: t('renovationsAndRehabilitationsDesc', 'Historial de modificaciones y mejoras'), uiId: 'reforms' },
  sustainability_and_esg: { title: t('sustainabilityAndESG', 'Sostenibilidad y ESG'), description: t('sustainabilityAndESGDesc', 'Criterios ambientales y sostenibilidad'), uiId: 'sustainability' },
  annex_documents: { title: t('annexDocuments', 'Documentos anexos'), description: t('annexDocumentsDesc', 'Documentación adicional y anexos'), uiId: 'attachments' },
});

interface DigitalBookHubProps {
  buildingName?: string;
  buildingId?: string;
}

const DigitalBookHub: React.FC<DigitalBookHubProps> = ({
  buildingName = 'Torre Central',
  buildingId: buildingIdProp = 'building-1',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { buildingId: buildingIdParam } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Priorizar: state > URL param > prop
  const buildingId = location.state?.buildingId || buildingIdParam || buildingIdProp;
  const buildingNameFinal = location.state?.buildingName || buildingName;

  const [book, setBook] = useState<DigitalBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFile, setProcessingFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [backgroundProcessing, setBackgroundProcessing] = useState(false);
  const [updatingSections, setUpdatingSections] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Solo técnicos pueden editar, administradores, propietarios y CFO solo pueden leer
  const canEdit = user?.role === 'tecnico';

  const { t } = useTranslation();
  const sections = useMemo(() => {
    const labels = SECTION_LABELS(t);
    if (!book || !book.sections || book.sections.length === 0) {
      return Object.entries(labels).map(([_type, meta]) => ({
        key: meta.uiId,
        title: meta.title,
        description: meta.description,
        isCompleted: false
      }));
    }
    return book.sections.map((s) => {
      const meta = labels[s.type] || { title: s.type, description: '', uiId: s.type };
      return { key: meta.uiId, title: meta.title, description: meta.description, isCompleted: Boolean(s.complete) };
    });
  }, [book, t]);

  const completedSections = book?.sections.filter((s) => s.complete).length ?? 0;
  const totalSections = book?.sections.length ?? 8;

  const isNewBuilding = location.state?.isNewBuilding || false;


  const handlePDFImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea PDF
    if (file.type !== 'application/pdf') {
      showToast({
        type: 'error',
        title: 'Tipo de archivo no válido',
        message: 'Solo se permiten archivos PDF',
        duration: 5000
      });
      return;
    }

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast({
        type: 'error',
        title: 'Archivo demasiado grande',
        message: 'El archivo no puede superar los 10MB',
        duration: 5000
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingFile(file);
      setProgress(0);
      setTimeElapsed(0);
      
      // Simular progreso mientras se procesa
      const progressInterval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 1000);
      
      // Simular pasos de procesamiento
      const steps = [
        'Subiendo archivo...',
        'Extrayendo texto del PDF...',
        'Procesando con IA...',
        'Validando datos...',
        'Creando libro del edificio...'
      ];
      
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        if (stepIndex < steps.length) {
          setCurrentStep(steps[stepIndex]);
          stepIndex++;
        }
      }, 8000);
      
      // Llamar a la API de procesamiento con IA
      await processPDFWithAI(buildingId, file);
      
      // Completar progreso
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      setProgress(100);
      setCurrentStep('¡Procesamiento completado!');
      
      // El éxito se maneja a través de notificaciones del sistema
      
      // Actualizar el libro
      setTimeout(() => {
        setUpdatingSections(true);
        loadBook(false).then(() => {
          setTimeout(() => {
            setUpdatingSections(false);
          }, 1000);
        });
        setIsProcessing(false);
        setProcessingFile(null);
        setProgress(0);
        setCurrentStep('');
        setBackgroundProcessing(false);
        // Limpiar el input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
      
    } catch (error: any) {
      console.error('Error procesando PDF con IA:', error);
      
      // Los errores se manejan a través de notificaciones del sistema
      
      setIsProcessing(false);
      setProcessingFile(null);
      setProgress(0);
      setCurrentStep('');
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  // 👉 Aquí pasamos buildingId en la URL
  const handleSectionClick = (sectionId: string) => {
    navigate(`/libro-digital/section/${buildingId}/${sectionId}`, {
      state: { buildingName: buildingNameFinal, buildingId, sectionId, userRole: location.state?.userRole },
    });
  };

  const loadBook = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const b = await getBookByBuilding(buildingId);
      setBook(b);
    } catch (error) {
      // Errores reales (no 404, que ya se maneja en getBookByBuilding)
      console.error('Error cargando libro del edificio:', error);
      setBook(null);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [buildingId]);

  // Load on mount and when building changes
  useEffect(() => {
    (async () => {
      await loadBook();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingId]);

  // useEffect deshabilitado - causaba peticiones infinitas
  // useEffect(() => {
  //   const onFocus = () => { loadBook(false); };
  //   ...
  // }, [loadBook, backgroundProcessing]);

  // Detectar cuando el usuario sale de la pantalla durante el procesamiento
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = 'El procesamiento de IA está en curso. ¿Estás seguro de que quieres salir?';
        setBackgroundProcessing(true);
        showToast({
          type: 'info',
          title: 'Procesamiento en background',
          message: 'El procesamiento continuará en segundo plano. Te notificaremos cuando termine.',
          duration: 8000
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isProcessing) {
        setBackgroundProcessing(true);
        showToast({
          type: 'info',
          title: 'Procesamiento en background',
          message: 'El procesamiento continuará en segundo plano. Te notificaremos cuando termine.',
          duration: 8000
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isProcessing, showToast]);

  // If navigation brought a message (e.g., completed), refresh once
  useEffect(() => {
    if (location.state?.message) {
      loadBook(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.message]);

  // Polling deshabilitado - causaba problemas de rendimiento
  // useEffect(() => {
  //   if (!location.state?.refreshBook || pollingStartedRef.current) return;
  //   // ... polling code removed
  // }, [buildingId]);

  const getStatusMessage = () => {
    if (completedSections === 0) return 'Libro en borrador – ninguna sección completada';
    if (completedSections === totalSections) return '¡Libro del Edificio completado!';
    return `En progreso – ${completedSections} de ${totalSections} secciones completadas`;
  };

  const getStatusColor = () => {
    if (completedSections === 0) return 'text-gray-600';
    if (completedSections === totalSections) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="pt-2 pb-8 max-w-full">
        <div className="px-4 sm:px-6 lg:px-8">
        {loading && (<PageLoader message="Cargando libro del edificio..." />)}
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <button onClick={() => navigate('/activos')} className="hover:text-blue-600">
                  Activos
                </button>
              </li>
              <li>
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">Libro del Edificio - {buildingNameFinal}</li>
            </ol>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Libro del Edificio</h1>
              <p className="text-sm sm:text-base text-gray-600">{buildingNameFinal}</p>
            </div>

            <div className="text-right">
              <div className={`text-sm font-medium ${getStatusColor()}`}>{getStatusMessage()}</div>
              {isNewBuilding && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Edificio recién creado
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estructura desktop: progreso (2/3) + importar (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Panel Progreso */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Progreso del Libro del Edificio</h2>
                <p className="text-sm text-gray-600 mt-1">Completar todas las secciones para finalizar el libro</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{completedSections} de {totalSections}</div>
                <div className="text-xs text-gray-500">{Math.round((completedSections / totalSections) * 100)}% completado</div>
              </div>
            </div>
            <ProgressBar current={completedSections} total={totalSections} size="lg" />
          </div>

          {/* Panel Importar PDF - Solo para técnicos */}
          {canEdit && (
            <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-shadow ${
              backgroundProcessing ? 'border-orange-200 bg-orange-50' : 'border-gray-200 hover:shadow-md'
            }`}>
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg border ${
                    backgroundProcessing ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'
                  }`}>
                    {backgroundProcessing ? (
                      <svg className="w-6 h-6 text-orange-600 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4m0 12v4m10-10h-4M6 12H2"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <path d="M14 2v6h6"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {backgroundProcessing ? 'Procesando en background...' : 'Importar contenido desde PDF'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {backgroundProcessing 
                        ? 'El procesamiento de IA continúa en segundo plano' 
                        : 'Sube un PDF y mapea las páginas a cada sección del libro.'
                      }
                    </p>
                  </div>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={handlePDFImport}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14"/>
                      <path d="M5 12h14"/>
                    </svg>
                    {isProcessing ? 'Procesando...' : 'Cargar PDF'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input de archivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Área de progreso */}
        {isProcessing && processingFile && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{processingFile.name}</h3>
                  <span className="text-sm text-gray-500">{formatFileSize(processingFile.size)}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{formatTime(timeElapsed)}</span>
                  <span>{Math.round(progress)}% completado</span>
                </div>
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{currentStep || 'Iniciando procesamiento...'}</span>
                <span>Tiempo estimado: 30-90 segundos</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Pasos */}
            <div className="flex gap-2 text-xs">
              {['Subida', 'Extracción', 'IA', 'Validación', 'Creación'].map((step, index) => (
                <div key={step} className={`px-2 py-1 rounded ${
                  (progress / 20) > index 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist de secciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Secciones del Libro del Edificio</h2>
            <p className="mt-1 text-sm text-gray-600">
              {canEdit 
                ? 'Revisa y completa cada sección. Haz clic en cualquier sección para editarla directamente.'
                : 'Revisa el contenido de cada sección completada por el técnico asignado.'
              }
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {updatingSections ? (
              // Mostrar skeleton mientras se actualizan las secciones
              Object.entries(SECTION_LABELS).map(([_, meta]) => (
                <div key={meta.uiId} className="p-6">
                  <SkeletonSection
                    title={meta.title}
                    description={meta.description}
                    isCompleted={false}
                  />
                </div>
              ))
            ) : (
              // Mostrar secciones normales
              sections.map((section, index) => (
                <div 
                  key={section.key} 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleSectionClick(section.key)}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold mr-3 ${
                        section.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {section.isCompleted ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className={`text-base font-medium text-gray-900`}>{section.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{section.description}</p>
                    </div>

                    <div className="ml-4 flex items-center gap-3">
                      {section.isCompleted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completado</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">No completado</span>
                      )}

                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-start">
          <div className="text-sm text-gray-600">
            <p>💡 Puedes guardar tu progreso en cualquier momento y continuar más tarde.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/activos')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Volver a Activos
            </button>

            {completedSections === totalSections && (
              <button
                onClick={() => alert('¡Libro del Edificio completado! Funcionalidad de exportación próximamente.')}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Exportar Libro Completado
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalBookHub;
