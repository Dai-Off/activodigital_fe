import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ProgressBar from '../ui/ProgressBar';
import { getBookByBuilding, type DigitalBook } from '../../services/digitalbook';
import { PageLoader } from '../ui/LoadingSystem';
import { useAuth } from '../../contexts/AuthContext';

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

  // Priorizar: state > URL param > prop
  const buildingId = location.state?.buildingId || buildingIdParam || buildingIdProp;
  const buildingNameFinal = location.state?.buildingName || buildingName;

  const [book, setBook] = useState<DigitalBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Propietario solo puede leer, no editar
  const canEdit = user?.role !== 'propietario';

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
    navigate('/libro-digital/pdf-import', {
      state: { buildingName: buildingNameFinal, buildingId, sections },
    });
  };

  // 👉 Aquí pasamos buildingId en la URL
  const handleSectionClick = (sectionId: string) => {
    navigate(`/libro-digital/section/${buildingId}/${sectionId}`, {
      state: { buildingName: buildingNameFinal, buildingId, sectionId, userRole: location.state?.userRole },
    });
  };

  const loadBook = useCallback(async () => {
    setLoading(true);
    try {
      const b = await getBookByBuilding(buildingId);
      setBook(b);
    } catch (error) {
      // Errores reales (no 404, que ya se maneja en getBookByBuilding)
      console.error('Error cargando libro digital:', error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  }, [buildingId]);

  // Load on mount and when building changes
  useEffect(() => {
    (async () => {
      await loadBook();
    })();
  }, [loadBook]);

  // Reload when window regains focus or tab becomes visible
  useEffect(() => {
    const onFocus = () => { loadBook(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') loadBook(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [loadBook]);

  // If navigation brought a message (e.g., completed), refresh once
  useEffect(() => {
    if (location.state?.message) {
      loadBook();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.message]);

  const getStatusMessage = () => {
    if (completedSections === 0) return 'Libro en borrador – ninguna sección completada';
    if (completedSections === totalSections) return '¡Libro Digital completado!';
    return `En progreso – ${completedSections} de ${totalSections} secciones completadas`;
  };

  const getStatusColor = () => {
    if (completedSections === 0) return 'text-gray-600';
    if (completedSections === totalSections) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        {loading && (<PageLoader message="Cargando libro digital..." />)}
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
              <li className="text-gray-900 font-medium">Libro Digital - {buildingNameFinal}</li>
            </ol>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Libro Digital</h1>
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
                <h2 className="text-lg font-semibold text-gray-900">Progreso del Libro Digital</h2>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg border border-blue-100">
                    <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <path d="M14 2v6h6"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Importar contenido desde PDF</h3>
                    <p className="text-sm text-gray-600 mt-1">Sube un PDF y mapea las páginas a cada sección del libro.</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={handlePDFImport}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14"/>
                      <path d="M5 12h14"/>
                    </svg>
                    Cargar PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checklist de secciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Secciones del Libro Digital</h2>
            <p className="mt-1 text-sm text-gray-600">
              {canEdit 
                ? 'Revisa y completa cada sección. Haz clic en cualquier sección para editarla directamente.'
                : 'Revisa el contenido de cada sección completada por el técnico asignado.'
              }
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {sections.map((section, index) => (
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
            ))}
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
                onClick={() => alert('¡Libro Digital completado! Funcionalidad de exportación próximamente.')}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Exportar Libro Completado
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalBookHub;
