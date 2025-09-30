import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import FileUpload from '../ui/FileUpload';
import { getBookByBuilding, updateBookSection, type DigitalBook, sectionIdToApiType } from '../../services/digitalbook';

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

  const buildingId = buildingIdParam || location.state?.buildingId || '';
  const buildingName = location.state?.buildingName || 'Torre Central';

  const sectionConfig =
    sectionId && SECTION_CONFIGS[sectionId as UiSectionKey] ? SECTION_CONFIGS[sectionId as UiSectionKey] : null;

  const [book, setBook] = React.useState<DigitalBook | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [documents, setDocuments] = React.useState<File[]>([]);
  const [isCompleted, setIsCompleted] = React.useState(false);

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

  const handleDocumentsChange = (files: File[]) => setDocuments(files);

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

    const updated = await updateBookSection({ id: book.id, sections: book.sections }, sectionId, formData, complete);
    setBook(updated);

    const apiType = sectionIdToApiType[sectionId as string];
    const newSection =
      updated.sections.find((s) => s.id === sectionId) || updated.sections.find((s) => apiType && s.type === apiType) || null;

    setIsCompleted(Boolean(newSection?.complete));
  };

  const handleSaveDraft = async () => {
    try {
      await save(false);
      alert('Borrador guardado correctamente');
    } catch (e) {
      console.error(e);
      alert('Error guardando el borrador.');
    }
  };

  const handleSaveAndComplete = async () => {
    try {
      if (!validateForm()) {
        alert('Completa los campos obligatorios antes de finalizar.');
        return;
      }
      await save(true);
      alert('Sección guardada y marcada como completada.');
      navigate(`/libro-digital/hub/${buildingId}`, {
        state: { buildingName, buildingId, message: `Sección "${sectionConfig?.title}" completada exitosamente` },
      });
    } catch (e) {
      console.error(e);
      alert('Error guardando la sección.');
    }
  };

  const renderField = (field: { name: string; label: string; type: string; required?: boolean; options?: readonly string[] | string[] }) => {
    const value = formData[field.name] ?? '';
    const baseCls = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ';
    const cls = baseCls + (field.required && !value ? 'border-red-300' : 'border-gray-300');

    if (field.type === 'textarea') {
      return (
        <textarea key={field.name} value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} placeholder={field.label} rows={4} className={cls} />
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="text-center py-20 text-gray-500">Cargando sección...</div>
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
                  <div className="text-4xl">{sectionConfig.icon}</div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{sectionConfig.title}</h1>
                    <p className="text-gray-600">{sectionConfig.description}</p>
                  </div>
                </div>

                {isCompleted && (
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

              {/* Subida de documentos (visual) */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos de la sección</h3>
                <FileUpload
                  onFilesSelected={handleDocumentsChange}
                  acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
                  maxFiles={5}
                  maxSizeInMB={10}
                  label="Subir documentos relacionados"
                  description="Arrastra documentos aquí o haz clic para seleccionar (PDF, imágenes, Word)"
                />

                {documents.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Documentos subidos ({documents.length}):</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {documents.map((file, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                <div className="text-sm text-gray-600">
                  {validateForm() ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Sección lista para completar
                    </span>
                  ) : (
                    <span>Completa los campos obligatorios (*) para marcar como terminada</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/libro-digital/hub/${buildingId}`, { state: { buildingId, buildingName } })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>

                    <button
                      onClick={handleSaveDraft}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Guardar Borrador
                    </button>

                  <button
                    onClick={handleSaveAndComplete}
                    disabled={!validateForm()}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Guardar y Completar
                  </button>
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
