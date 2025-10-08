import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DocumentManager, { type DocumentFile } from '../ui/DocumentManager';
import { PageLoader } from '../ui/LoadingSystem';
import { getBookByBuilding, updateBookSection, type DigitalBook, sectionIdToApiType } from '../../services/digitalbook';
import { listSectionDocuments } from '../../services/documentUpload';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

// Config UI (igual que antes)
const SECTION_CONFIGS = {
  general_data: {
    title: 'Datos generales del edificio',
    description: 'Información básica y características principales',
    icon: '🏢',
    fields: [
      { name: 'identification', label: 'Identificación del edificio', type: 'textarea', required: true },
      { name: 'ownership', label: 'Titularidad', type: 'text', required: true },
      { name: 'building_typology', label: 'Tipología detallada', type: 'select', options: ['Residencial', 'Comercial', 'Mixto', 'Industrial'], required: true },
      { name: 'primary_use', label: 'Uso principal', type: 'text', required: true },
      { name: 'construction_date', label: 'Fecha de construcción exacta', type: 'date', required: false },
    ],
  },
  construction_features: {
    title: 'Características constructivas y técnicas',
    description: 'Especificaciones técnicas de construcción',
    icon: '🔧',
    fields: [
      { name: 'materials', label: 'Materiales principales', type: 'textarea', required: true },
      { name: 'insulation_systems', label: 'Sistemas de aislamiento', type: 'textarea', required: true },
      { name: 'structural_system', label: 'Sistema estructural', type: 'text', required: true },
      { name: 'facade_type', label: 'Tipo de fachada', type: 'text', required: true },
      { name: 'roof_type', label: 'Tipo de cubierta', type: 'text', required: false },
    ],
  },
  certificates: {
    title: 'Certificados y licencias',
    description: 'Documentación legal y certificaciones',
    icon: '📜',
    fields: [
      { name: 'energy_certificate', label: 'Certificado energético (CEE)', type: 'text', required: true },
      { name: 'building_permits', label: 'Licencias de obra', type: 'textarea', required: true },
      { name: 'habitability_license', label: 'Licencia de habitabilidad', type: 'text', required: true },
      { name: 'fire_certificate', label: 'Certificado contra incendios', type: 'text', required: false },
      { name: 'accessibility_certificate', label: 'Certificado de accesibilidad', type: 'text', required: false },
    ],
  },
  maintenance: {
    title: 'Mantenimiento y conservación',
    description: 'Historial y planes de mantenimiento',
    icon: '🔨',
    fields: [
      { name: 'preventive_plan', label: 'Plan de mantenimiento preventivo', type: 'textarea', required: true },
      { name: 'inspection_schedule', label: 'Programa de revisiones', type: 'textarea', required: true },
      { name: 'incident_history', label: 'Historial de incidencias', type: 'textarea', required: false },
      { name: 'maintenance_contracts', label: 'Contratos de mantenimiento activos', type: 'textarea', required: false },
    ],
  },
  installations: {
    title: 'Instalaciones y consumos',
    description: 'Sistemas e instalaciones del edificio',
    icon: '⚡',
    fields: [
      { name: 'electrical_system', label: 'Sistema eléctrico', type: 'textarea', required: true },
      { name: 'water_system', label: 'Sistema de agua', type: 'textarea', required: true },
      { name: 'gas_system', label: 'Sistema de gas', type: 'textarea', required: false },
      { name: 'hvac_system', label: 'Sistema HVAC', type: 'textarea', required: true },
      { name: 'consumption_history', label: 'Historial de consumos', type: 'textarea', required: false },
    ],
  },
  reforms: {
    title: 'Reformas y rehabilitaciones',
    description: 'Historial de modificaciones y mejoras',
    icon: '🏗️',
    fields: [
      { name: 'renovation_history', label: 'Historial de obras', type: 'textarea', required: true },
      { name: 'structural_modifications', label: 'Modificaciones estructurales', type: 'textarea', required: false },
      { name: 'permits_renovations', label: 'Permisos de reformas', type: 'textarea', required: false },
      { name: 'improvement_investments', label: 'Inversiones en mejoras', type: 'text', required: false },
    ],
  },
  sustainability: {
    title: 'Sostenibilidad y ESG',
    description: 'Criterios ambientales y sostenibilidad',
    icon: '🌱',
    fields: [
      { name: 'energy_indicators', label: 'Indicadores energéticos', type: 'textarea', required: true },
      { name: 'emissions', label: 'Emisiones de CO2', type: 'text', required: true },
      { name: 'water_footprint', label: 'Huella hídrica', type: 'text', required: false },
      { name: 'waste_management', label: 'Gestión de residuos', type: 'textarea', required: false },
      { name: 'green_certifications', label: 'Certificaciones verdes', type: 'textarea', required: false },
    ],
  },
  attachments: {
    title: 'Documentos anexos',
    description: 'Documentación adicional y anexos',
    icon: '📎',
    fields: [
      { name: 'technical_drawings', label: 'Planos técnicos', type: 'textarea', required: false },
      { name: 'operation_manuals', label: 'Manuales de funcionamiento', type: 'textarea', required: false },
      { name: 'financial_reports', label: 'Informes financieros', type: 'textarea', required: false },
      { name: 'insurance_policies', label: 'Pólizas de seguro', type: 'textarea', required: false },
      { name: 'legal_documents', label: 'Documentos legales', type: 'textarea', required: false },
    ],
  },
} as const;

type UiSectionKey = keyof typeof SECTION_CONFIGS;

const SectionEditor: React.FC = () => {
  const navigate = useNavigate();
  const { sectionId, buildingId: buildingIdParam } = useParams<{ sectionId: string; buildingId: string }>();
  const location = useLocation();
  const { isRole } = useAuth();

  const buildingId = buildingIdParam || location.state?.buildingId || '';
  const buildingName = location.state?.buildingName || 'Torre Central';
  const userId = location.state?.userId || 'user-1'; // TODO: Obtener del contexto de autenticación

  const sectionConfig =
    sectionId && SECTION_CONFIGS[sectionId as UiSectionKey] ? SECTION_CONFIGS[sectionId as UiSectionKey] : null;

  const [book, setBook] = React.useState<DigitalBook | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [documents, setDocuments] = React.useState<DocumentFile[]>([]);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const { showSuccess, showError } = useToast();
  const isOwner = isRole('propietario');

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!buildingId) {
        setLoadError('Falta buildingId en la ruta.');
        setLoading(false);
        return;
      }
      if (!sectionConfig) {
        setLoadError(`La sección "${sectionId}" no existe.`);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(null);

      try {
        const b = await getBookByBuilding(buildingId);
        if (!mounted) return;
        if (!b) {
          setLoadError('No se encontró libro digital para este edificio.');
          setLoading(false);
          return;
        }
        setBook(b);

        const apiType = sectionIdToApiType[sectionId as string];
        const backendSection =
          b.sections.find((s) => s.id === sectionId) ||
          b.sections.find((s) => apiType && s.type === apiType) ||
          null;

        setFormData(backendSection?.content ?? {});
        // Rehidratar documentos
        const backendDocuments = (backendSection?.content as any)?.documents as DocumentFile[] | undefined;
        if (Array.isArray(backendDocuments) && backendDocuments.length > 0) {
          setDocuments(backendDocuments);
        } else {
          // Fallback: listar desde Storage para esta sección
          try {
            const docs = await listSectionDocuments(b.id, sectionId as string, userId);
            if (mounted) setDocuments(docs as unknown as DocumentFile[]);
          } catch (_) {
            // ignorar fallback error
          }
        }
        setIsCompleted(Boolean(backendSection?.complete));
      } catch (e: any) {
        if (!mounted) return;
        setLoadError(e?.message || 'No se pudo cargar la sección.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [buildingId, sectionId, sectionConfig]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleDocumentsChange = (docs: DocumentFile[]) => setDocuments(docs);

  const validateForm = (): boolean => {
    if (!sectionConfig) return false;
    const required = sectionConfig.fields.filter((f) => f.required);
    return required.every((f) => {
      const v = formData[f.name];
      return v && typeof v === 'string' && v.trim().length > 0;
    });
  };

  const save = async (complete: boolean) => {
    if (!book) throw new Error('Libro no cargado.');
    if (!sectionId) throw new Error('Sección no válida.');

    // Incluir los documentos en el payload de contenido
    const contentToSave = { ...formData, documents };

    const updated = await updateBookSection({ id: book.id, sections: book.sections }, sectionId, contentToSave, complete);
    setBook(updated);

    const apiType = sectionIdToApiType[sectionId as string];
    const newSection =
      updated.sections.find((s) => s.id === sectionId) || updated.sections.find((s) => apiType && s.type === apiType) || null;

    setIsCompleted(Boolean(newSection?.complete));
  };

  // Auto-completar en silencio UNA vez cuando el formulario pase a válido (solo para técnicos)
  const autoCompletedRef = React.useRef(false);
  React.useEffect(() => {
    if (isOwner) return; // Propietarios no pueden auto-guardar
    const valid = validateForm();
    if (!book || !sectionId) return;
    if (valid && !isCompleted && !autoCompletedRef.current) {
      (async () => {
        try {
          autoCompletedRef.current = true;
          await save(true);
          setIsCompleted(true);
        } catch (e) {
          console.error('Auto-complete save failed', e);
          autoCompletedRef.current = false;
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, documents, book, sectionId, isOwner]);

  const handleSaveDraft = async () => {
    try {
      await save(false);
      showSuccess('Borrador guardado', 'La sección se guardó como borrador.');
    } catch (e) {
      console.error(e);
      showError('No se pudo guardar', e instanceof Error ? e.message : 'Error guardando el borrador.');
    }
  };


  const handleSave = async () => {
    try {
      setIsSaving(true);
      const willComplete = validateForm();
      await save(willComplete);
      if (willComplete) setIsCompleted(true);
      showSuccess('Guardado', 'Los cambios se guardaron correctamente.');
    } catch (e) {
      console.error(e);
      showError('No se pudo guardar', e instanceof Error ? e.message : 'Error guardando la sección.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field: { name: string; label: string; type: string; required?: boolean; options?: readonly string[] | string[] }) => {
    const value = formData[field.name] ?? '';
    const baseCls = 'w-full px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ';
    const cls = baseCls + (field.required && !value ? 'border-red-300' : 'border-gray-300');

    if (isOwner) {
      return (
        <div key={field.name} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700">
          {String(value || '') || '—'}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea key={field.name} value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} placeholder={field.label} rows={3} className={cls} />
      );
    }
    if (field.type === 'select') {
      return (
        <select key={field.name} value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} className={cls}>
          <option value="">Selecciona una opción</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }
    if (field.type === 'date') {
      return <input key={field.name} type="date" value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} className={cls} />;
    }
    return <input key={field.name} type="text" value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} placeholder={field.label} className={cls} />;
  };

  if (!sectionConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sección no encontrada</h1>
          <p className="text-gray-600 mb-4">La sección "{sectionId}" no existe.</p>
          <button onClick={() => navigate(`/libro-digital/hub/${buildingId}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Volver al Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        {/* Header navegación */}
        <div className="mb-8">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <button onClick={() => navigate('/activos')} className="hover:text-blue-600">
                  Activos
                </button>
              </li>
              <li>
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <button onClick={() => navigate(`/libro-digital/hub/${buildingId}`, { state: { buildingId, buildingName } })} className="hover:text-blue-600">
                  Libro Digital
                </button>
              </li>
              <li>
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">Editar Sección</li>
            </ol>
          </nav>
        </div>

        {loading ? (
          <PageLoader message="Cargando sección..." />
        ) : loadError ? (
          <div className="text-center py-20 text-red-500">
            <div>{loadError}</div>
            <button
              onClick={() => navigate(`/libro-digital/hub/${buildingId}`, { state: { buildingId, buildingName } })}
              className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Volver al Hub del Libro Digital
            </button>
          </div>
        ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header de la sección */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{sectionConfig.title}</h1>
                    <p className="text-gray-600">{sectionConfig.description}</p>
                </div>
              </div>
              
              {(isCompleted || validateForm()) && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-600">Completada</span>
                </div>
              )}
            </div>
          </div>

          {/* Formulario */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectionConfig.fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>

              {/* Documentos de la sección */}
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos de la sección</h3>
                {book && !isOwner && (
                  <DocumentManager
                    bookId={book.id}
                    sectionType={sectionId || 'general_data'}
                    userId={userId}
                    existingDocuments={documents}
                    onDocumentsUpdated={handleDocumentsChange}
                    maxDocuments={20}
                    maxSizeMB={10}
                label="Subir documentos relacionados"
                    description="Arrastra documentos aquí o haz clic para seleccionar (PDF, imágenes, Word, Excel)"
                  />
              )}
                {isOwner && (
                  <div>
                    {documents.length > 0 ? (
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Icono del documento */}
                              <div className="flex-shrink-0">
                                {doc.mimeType.includes('pdf') ? (
                                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                ) : doc.mimeType.includes('image') ? (
                                  <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                ) : doc.mimeType.includes('word') || doc.mimeType.includes('document') ? (
                                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              {/* Información del documento */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(doc.uploadedAt).toLocaleDateString('es-ES')} • {(doc.fileSize / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            {/* Botón de descarga */}
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver documento"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-900 mb-1">No hay documentos cargados</p>
                        <p className="text-sm text-gray-500">El técnico aún no ha subido documentos a esta sección</p>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>

            {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
              <div className="text-sm text-gray-600">
                  {isOwner && (
                    <span className="flex items-center gap-2 text-blue-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Modo solo lectura - Contacta al técnico para editar
                    </span>
                  )}
                  {!isOwner && !isCompleted && !validateForm() && (
                    <span>Completa los campos obligatorios (*) para marcar como terminada</span>
                  )}
              </div>

              <div className="flex gap-3">
                <button
                    onClick={() => navigate(`/libro-digital/hub/${buildingId}`, { state: { buildingId, buildingName } })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {isOwner ? 'Volver al Libro Digital' : 'Cancelar'}
                </button>
                
                {!isOwner && (
                <button
                      onClick={handleSaveDraft}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Guardar Borrador
                </button>
                )}
                {!isOwner && (
                <button
                  onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  )}
                  Guardar
                </button>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default SectionEditor;
