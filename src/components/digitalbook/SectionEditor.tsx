import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DocumentManager, { type DocumentFile } from '../ui/DocumentManager';
import { SkeletonBase, SkeletonText } from '../ui/LoadingSystem';
import { getBookByBuilding, updateBookSection, type DigitalBook, sectionIdToApiType } from '../../services/digitalbook';
import { useToast } from '../../contexts/ToastContext';
import { 
  Building2, 
  Wrench, 
  FileCheck, 
  Settings, 
  Zap, 
  Hammer, 
  Leaf, 
  Paperclip,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileText,
  Save
} from 'lucide-react';


function getSectionConfigs(t: ReturnType<typeof useTranslation>['t']) {
  return {
    general_data: {
  title: t('sections.general_data.title', 'Datos generales del edificio'),
  description: t('sections.general_data.description', 'Información básica y características principales'),
      icon: Building2,
      color: 'blue',
      fields: [
  { name: 'identification', label: t('fields.identification', 'Identificación del edificio'), type: 'textarea', required: true },
  { name: 'ownership', label: t('fields.ownership', 'Titularidad'), type: 'text', required: true },
  { name: 'building_typology', label: t('fields.building_typology', 'Tipología detallada'), type: 'select', options: [t('options.residential', 'Residencial'), t('options.commercial', 'Comercial'), t('options.mixed', 'Mixto'), t('options.industrial', 'Industrial')], required: true },
  { name: 'primary_use', label: t('fields.primary_use', 'Uso principal'), type: 'text', required: true },
  { name: 'construction_date', label: t('fields.construction_date', 'Fecha de construcción exacta'), type: 'date', required: false },
      ],
    },
    construction_features: {
  title: t('sections.construction_features.title', 'Características constructivas y técnicas'),
  description: t('sections.construction_features.description', 'Especificaciones técnicas de construcción'),
      icon: Wrench,
      color: 'purple',
      fields: [
  { name: 'materials', label: t('fields.materials', 'Materiales principales'), type: 'textarea', required: true },
  { name: 'insulation_systems', label: t('fields.insulation_systems', 'Sistemas de aislamiento'), type: 'textarea', required: true },
  { name: 'structural_system', label: t('fields.structural_system', 'Sistema estructural'), type: 'text', required: true },
  { name: 'facade_type', label: t('fields.facade_type', 'Tipo de fachada'), type: 'text', required: true },
  { name: 'roof_type', label: t('fields.roof_type', 'Tipo de cubierta'), type: 'text', required: false },
      ],
    },
    certificates: {
  title: t('sections.certificates.title', 'Certificados y licencias'),
  description: t('sections.certificates.description', 'Documentación legal y certificaciones'),
      icon: FileCheck,
      color: 'green',
      fields: [
  { name: 'energy_certificate', label: t('fields.energy_certificate', 'Certificado energético (CEE)'), type: 'text', required: true },
  { name: 'building_permits', label: t('fields.building_permits', 'Licencias de obra'), type: 'textarea', required: true },
  { name: 'habitability_license', label: t('fields.habitability_license', 'Licencia de habitabilidad'), type: 'text', required: true },
  { name: 'fire_certificate', label: t('fields.fire_certificate', 'Certificado contra incendios'), type: 'text', required: false },
  { name: 'accessibility_certificate', label: t('fields.accessibility_certificate', 'Certificado de accesibilidad'), type: 'text', required: false },
      ],
    },
    maintenance: {
  title: t('sections.maintenance.title', 'Mantenimiento y conservación'),
  description: t('sections.maintenance.description', 'Historial y planes de mantenimiento'),
      icon: Settings,
      color: 'orange',
      fields: [
  { name: 'preventive_plan', label: t('fields.preventive_plan', 'Plan de mantenimiento preventivo'), type: 'textarea', required: true },
  { name: 'inspection_schedule', label: t('fields.inspection_schedule', 'Programa de revisiones'), type: 'textarea', required: true },
  { name: 'incident_history', label: t('fields.incident_history', 'Historial de incidencias'), type: 'textarea', required: false },
  { name: 'maintenance_contracts', label: t('fields.maintenance_contracts', 'Contratos de mantenimiento activos'), type: 'textarea', required: false },
      ],
    },
    installations: {
      title: t('digitalbook.sections.installations.title', 'Instalaciones y consumos'),
      description: t('digitalbook.sections.installations.description', 'Sistemas e instalaciones del edificio'),
      icon: Zap,
      color: 'yellow',
      fields: [
        { name: 'electrical_system', label: t('digitalbook.fields.electrical_system', 'Sistema eléctrico'), type: 'textarea', required: true },
        { name: 'water_system', label: t('digitalbook.fields.water_system', 'Sistema de agua'), type: 'textarea', required: true },
        { name: 'gas_system', label: t('digitalbook.fields.gas_system', 'Sistema de gas'), type: 'textarea', required: false },
        { name: 'hvac_system', label: t('digitalbook.fields.hvac_system', 'Sistema HVAC'), type: 'textarea', required: true },
        { name: 'consumption_history', label: t('digitalbook.fields.consumption_history', 'Historial de consumos'), type: 'textarea', required: false },
      ],
    },
    reforms: {
      title: t('digitalbook.sections.reforms.title', 'Reformas y rehabilitaciones'),
      description: t('digitalbook.sections.reforms.description', 'Historial de modificaciones y mejoras'),
      icon: Hammer,
      color: 'red',
      fields: [
        { name: 'renovation_history', label: t('digitalbook.fields.renovation_history', 'Historial de obras'), type: 'textarea', required: true },
        { name: 'structural_modifications', label: t('digitalbook.fields.structural_modifications', 'Modificaciones estructurales'), type: 'textarea', required: false },
        { name: 'permits_renovations', label: t('digitalbook.fields.permits_renovations', 'Permisos de reformas'), type: 'textarea', required: false },
        { name: 'improvement_investments', label: t('digitalbook.fields.improvement_investments', 'Inversiones en mejoras'), type: 'text', required: false },
      ],
    },
    sustainability: {
      title: t('digitalbook.sections.sustainability.title', 'Sostenibilidad y ESG'),
      description: t('digitalbook.sections.sustainability.description', 'Criterios ambientales y sostenibilidad'),
      icon: Leaf,
      color: 'emerald',
      fields: [
        { name: 'renewableSharePercent', label: t('digitalbook.fields.renewableSharePercent', 'Porcentaje de energía renovable (%)'), type: 'number', required: true },
        { name: 'waterFootprintM3PerM2Year', label: t('digitalbook.fields.waterFootprintM3PerM2Year', 'Huella hídrica (m³/m²·año)'), type: 'number', required: true },
        { name: 'accessibility', label: t('digitalbook.fields.accessibility', 'Nivel de accesibilidad'), type: 'select', options: [
          { value: 'full', label: t('digitalbook.options.accessibility.full', 'Cumple 100% normativa') },
          { value: 'partial', label: t('digitalbook.options.accessibility.partial', 'Parcial (solo acceso básico)') },
          { value: 'none', label: t('digitalbook.options.accessibility.none', 'No cumple') }
        ] as Array<{value: string, label: string}>, required: true },
        { name: 'indoorAirQualityCo2Ppm', label: t('digitalbook.fields.indoorAirQualityCo2Ppm', 'Calidad del aire interior (ppm CO₂)'), type: 'number', required: true },
        { name: 'safetyCompliance', label: t('digitalbook.fields.safetyCompliance', 'Cumplimiento de seguridad'), type: 'select', options: [
          { value: 'full', label: t('digitalbook.options.safetyCompliance.full', 'Cumple todas las normativas') },
          { value: 'pending', label: t('digitalbook.options.safetyCompliance.pending', 'Pendiente de actualización') },
          { value: 'none', label: t('digitalbook.options.safetyCompliance.none', 'No cumple / en infracción') }
        ] as Array<{value: string, label: string}>, required: true },
      ],
    },
    documentation: {
      title: t('digitalbook.sections.documentation.title', 'Documentación complementaria'),
      description: t('digitalbook.sections.documentation.description', 'Archivos y documentos técnicos'),
      icon: Paperclip,
      color: 'indigo',
      fields: [
        { name: 'technical_drawings', label: t('digitalbook.fields.technical_drawings', 'Planos técnicos'), type: 'textarea', required: false },
        { name: 'operation_manuals', label: t('digitalbook.fields.operation_manuals', 'Manuales de funcionamiento'), type: 'textarea', required: false },
        { name: 'financial_reports', label: t('digitalbook.fields.financial_reports', 'Informes financieros'), type: 'textarea', required: false },
        { name: 'insurance_policies', label: t('digitalbook.fields.insurance_policies', 'Pólizas de seguro'), type: 'textarea', required: false },
        { name: 'legal_documents', label: t('digitalbook.fields.legal_documents', 'Documentos legales'), type: 'textarea', required: false },
      ],
    },
  } as const;
}

type UiSectionKey = keyof ReturnType<typeof getSectionConfigs>;


const SectionEditor: React.FC = () => {
  const { t } = useTranslation();
  const { sectionId, buildingId: buildingIdParam } = useParams<{ sectionId: string; buildingId: string }>();
  const location = useLocation();

  const buildingId = buildingIdParam || location.state?.buildingId || '';
  const buildingName = location.state?.buildingName || 'Torre Central';
  const userId = location.state?.userId || 'user-1';

  const [book, setBook] = React.useState<DigitalBook | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [documents, setDocuments] = React.useState<DocumentFile[]>([]);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { showSuccess, showError } = useToast();
  
  // Todos los roles pueden editar
  const canEdit = true;

  // Cargar UNA SOLA VEZ al montar - SIN DEPENDENCIAS
  React.useEffect(() => {
    if (hasLoaded) return; // Ya cargado, no volver a ejecutar
    setHasLoaded(true);
    
    let mounted = true;
    
    (async () => {
      console.log('🔍 SectionEditor - Iniciando carga', { buildingId, sectionId });
      
      if (!buildingId || !sectionId) {
        console.log('❌ SectionEditor - Datos inválidos');
        setLoadError('Datos inválidos');
        setLoading(false);
        return;
      }

      try {
        console.log('📡 SectionEditor - Llamando getBookByBuilding...');
        const b = await getBookByBuilding(buildingId);
        console.log('✅ SectionEditor - Libro recibido:', b);
        console.log('🔍 SectionEditor - mounted:', mounted);
        
        if (!mounted) {
          console.log('⚠️ SectionEditor - Componente desmontado, abortando');
          return;
        }
        
        console.log('✅ SectionEditor - mounted check passed');
        
        if (!b) {
          console.log('❌ SectionEditor - No se encontró libro');
          setLoadError('No se encontró el libro del edificio.');
          setLoading(false);
          return;
        }
        
        console.log('📄 SectionEditor - Buscando sección...', { sectionId, sections: b.sections });

        const apiType = sectionIdToApiType[sectionId as string];
        console.log('📄 SectionEditor - apiType:', apiType);
        
        let backendSection = null;
        if (b.sections && Array.isArray(b.sections)) {
          for (const s of b.sections) {
            if (s.id === sectionId || (apiType && s.type === apiType)) {
              backendSection = s;
              break;
            }
          }
        }
        
        console.log('📄 SectionEditor - Sección encontrada:', backendSection);

        if (backendSection) {
          const content = backendSection.content ?? {};
          setFormData(content);
          setIsCompleted(Boolean(backendSection.complete));
          
          const backendDocuments = content.documents as DocumentFile[] | undefined;
        if (Array.isArray(backendDocuments) && backendDocuments.length > 0) {
          setDocuments(backendDocuments);
          }
        }
        
        console.log('✅ SectionEditor - Antes de setBook y setLoading');
        setBook(b);
        setLoading(false);
        console.log('✅ SectionEditor - Carga completada');
      } catch (e: any) {
        console.error('❌ SectionEditor - Error:', e);
        if (!mounted) return;
        setLoadError(e?.message || 'Error al cargar.');
        setLoading(false);
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ABSOLUTAMENTE SIN DEPENDENCIAS

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
    if (!book || !sectionId) throw new Error('Libro no cargado.');

    const contentToSave = { ...formData, documents };

    const updated = await updateBookSection({ id: book.id, sections: book.sections }, sectionId, contentToSave, complete);
    setBook(updated);

    const apiType = sectionIdToApiType[sectionId as string];
    const newSection = updated.sections.find((s) => s.id === sectionId || (apiType && s.type === apiType));

    setIsCompleted(Boolean(newSection?.complete));

    if (sectionId === 'sustainability') {
      window.dispatchEvent(new CustomEvent('esg-data-updated'));
    }
  };

  const handleSaveDraft = async () => {
    if (!canEdit) return;
    try {
      setIsSaving(true);
      await save(false);
      showSuccess('Borrador guardado', 'La sección se guardó como borrador.');
    } catch (e) {
      console.error(e);
      showError('No se pudo guardar', e instanceof Error ? e.message : 'Error guardando el borrador.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!canEdit) return;
    try {
      setIsSaving(true);
      const willComplete = validateForm();
      await save(willComplete);
      showSuccess('Sección guardada', willComplete ? 'La sección está completa.' : 'Guardado con éxito.');
    } catch (e) {
      console.error(e);
      showError('Error al guardar', e instanceof Error ? e.message : 'No se pudo guardar.');
    } finally {
      setIsSaving(false);
    }
  };

  const SECTION_CONFIGS = getSectionConfigs(t);
  const sectionConfig = sectionId && SECTION_CONFIGS[sectionId as UiSectionKey] ? SECTION_CONFIGS[sectionId as UiSectionKey] : null;

  if (loadError) {
      return (
      <div className="p-4">
        <p className="text-red-600">{loadError}</p>
        </div>
      );
    }
  if (!sectionConfig) {
    return (
      <div className="p-4">
        <p className="text-red-600">Sección no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="pt-2 pb-8 max-w-full">
        <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center gap-4 mb-4">
              <SkeletonBase className="w-16 h-16 rounded-lg" />
              <div className="flex-1">
                <SkeletonText lines={1} widths={['w-64']} className="mb-2" />
                <SkeletonText lines={1} widths={['w-96']} className="mb-2" />
                <SkeletonText lines={1} widths={['w-48']} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-4">
              {sectionConfig.icon && typeof sectionConfig.icon !== 'string' ? (
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-gray-50">
                  {React.createElement(sectionConfig.icon, {
                    className: 'w-5 h-5 text-gray-600',
                    strokeWidth: 2
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-md">
                  <span className="text-xl">{sectionConfig.icon}</span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-medium text-gray-900">{sectionConfig.title}</h1>
                <p className="text-xs text-gray-500 mt-0.5">{sectionConfig.description}</p>
                <p className="text-xs text-gray-400 mt-1">{buildingName}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <SkeletonBase className="w-8 h-8 rounded-md" />
                    <div className="ml-3 flex-1">
                      <SkeletonText lines={1} widths={['w-16']} className="mb-1.5" />
                      <SkeletonText lines={1} widths={['w-24']} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center ${
                      isCompleted ? 'bg-blue-50' : 'bg-gray-50'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" strokeWidth={2} />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-600" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xs font-medium text-gray-500 mb-0.5">Estado</h3>
                    <p className={`text-sm font-medium ${isCompleted ? 'text-blue-600' : 'text-gray-600'}`}>
                      {isCompleted ? 'Completa' : 'En progreso'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-md bg-gray-50 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-600" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xs font-medium text-gray-500 mb-0.5">Campos</h3>
                    <p className="text-sm font-medium text-gray-600">{sectionConfig.fields.length} campos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-md flex items-center justify-center bg-gray-50">
                      {canEdit ? (
                        <Edit className="w-4 h-4 text-gray-600" strokeWidth={2} />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xs font-medium text-gray-500 mb-0.5">Permisos</h3>
                    <p className="text-sm font-medium text-gray-600">{canEdit ? 'Editable' : 'Solo lectura'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-5 py-3 border-b border-gray-200">
            {loading ? (
              <SkeletonText lines={1} widths={['w-48']} />
            ) : (
              <h2 className="text-sm font-medium text-gray-900">Información de la Sección</h2>
            )}
          </div>
          
          <div className="p-5">
            {loading ? (
              /* Form Fields Skeleton */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={i > 4 ? 'lg:col-span-2' : ''}>
                    <SkeletonText lines={1} widths={['w-32']} className="mb-2" />
                    {i > 4 ? (
                      <SkeletonBase className="h-24 w-full rounded-md" />
                    ) : (
                      <SkeletonBase className="h-10 w-full rounded-md" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Form Fields */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {sectionConfig.fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'lg:col-span-2' : ''}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      disabled={!canEdit}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder={`Ingresa ${field.label.toLowerCase()}...`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      disabled={!canEdit}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecciona una opción</option>
                      {Array.isArray(field.options) &&
                        field.options.map((opt) => {
                          if (typeof opt === 'string') {
                            return (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            );
                          } else {
                            return (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            );
                          }
                        })}
                    </select>
                  ) : (
                    <input
                      name={field.name}
                      disabled={!canEdit}
                      type={field.type || 'text'}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder={`Ingresa ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
              </div>
            )}

            {/* Documents Section */}
            {!loading && canEdit && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Documentos Adjuntos</h3>
                <DocumentManager
                  bookId={buildingId}
                  sectionType={sectionId || ''}
                  userId={userId}
                  existingDocuments={documents || []}
                  onDocumentsUpdated={handleDocumentsChange}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!loading && canEdit && (
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-3.5 h-3.5" strokeWidth={2} />
                {isSaving ? 'Guardando...' : 'Guardar Borrador'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                {isSaving ? 'Guardando...' : 'Guardar Sección'}
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;
