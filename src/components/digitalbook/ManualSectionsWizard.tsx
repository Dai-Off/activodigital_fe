// src/components/digitalbook/ManualSectionsWizard.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Wizard from '../ui/Wizard';
import FileUpload from '../ui/FileUpload';
import {
  getBookByBuilding,
  createDigitalBook,
  updateBookSection,
  type DigitalBook,
} from '../../services/digitalbook';

// Las 8 secciones (igual que las que ya tenías en la UI)
const BOOK_SECTIONS = [
  {
    id: 'general_data',
    title: 'Datos generales del edificio',
    description: 'Información básica y características principales',
    icon: '🏢',
    fields: [
      { name: 'identification', label: 'Identificación del edificio', type: 'textarea', required: true },
      { name: 'ownership', label: 'Titularidad', type: 'text', required: true },
      { name: 'building_typology', label: 'Tipología detallada', type: 'select', options: ['Residencial', 'Comercial', 'Mixto', 'Industrial'], required: true },
      { name: 'primary_use', label: 'Uso principal', type: 'text', required: true },
      { name: 'construction_date', label: 'Fecha de construcción exacta', type: 'date', required: false }
    ]
  },
  {
    id: 'construction_features',
    title: 'Características constructivas y técnicas',
    description: 'Especificaciones técnicas de construcción',
    icon: '🔧',
    fields: [
      { name: 'materials', label: 'Materiales principales', type: 'textarea', required: true },
      { name: 'insulation_systems', label: 'Sistemas de aislamiento', type: 'textarea', required: true },
      { name: 'structural_system', label: 'Sistema estructural', type: 'text', required: true },
      { name: 'facade_type', label: 'Tipo de fachada', type: 'text', required: true },
      { name: 'roof_type', label: 'Tipo de cubierta', type: 'text', required: false }
    ]
  },
  {
    id: 'certificates',
    title: 'Certificados y licencias',
    description: 'Documentación legal y certificaciones',
    icon: '📜',
    fields: [
      { name: 'energy_certificate', label: 'Certificado energético (CEE)', type: 'text', required: true },
      { name: 'building_permits', label: 'Licencias de obra', type: 'textarea', required: true },
      { name: 'habitability_license', label: 'Licencia de habitabilidad', type: 'text', required: true },
      { name: 'fire_certificate', label: 'Certificado contra incendios', type: 'text', required: false },
      { name: 'accessibility_certificate', label: 'Certificado de accesibilidad', type: 'text', required: false }
    ]
  },
  {
    id: 'maintenance',
    title: 'Mantenimiento y conservación',
    description: 'Historial y planes de mantenimiento',
    icon: '🔨',
    fields: [
      { name: 'preventive_plan', label: 'Plan de mantenimiento preventivo', type: 'textarea', required: true },
      { name: 'inspection_schedule', label: 'Programa de revisiones', type: 'textarea', required: true },
      { name: 'incident_history', label: 'Historial de incidencias', type: 'textarea', required: false },
      { name: 'maintenance_contracts', label: 'Contratos de mantenimiento activos', type: 'textarea', required: false }
    ]
  },
  {
    id: 'installations',
    title: 'Instalaciones y consumos',
    description: 'Sistemas e instalaciones del edificio',
    icon: '⚡',
    fields: [
      { name: 'electrical_system', label: 'Sistema eléctrico', type: 'textarea', required: true },
      { name: 'water_system', label: 'Sistema de agua', type: 'textarea', required: true },
      { name: 'gas_system', label: 'Sistema de gas', type: 'textarea', required: false },
      { name: 'hvac_system', label: 'Sistema HVAC', type: 'textarea', required: true },
      { name: 'consumption_history', label: 'Historial de consumos', type: 'textarea', required: false }
    ]
  },
  {
    id: 'reforms',
    title: 'Reformas y rehabilitaciones',
    description: 'Historial de modificaciones y mejoras',
    icon: '🏗️',
    fields: [
      { name: 'renovation_history', label: 'Historial de obras', type: 'textarea', required: true },
      { name: 'structural_modifications', label: 'Modificaciones estructurales', type: 'textarea', required: false },
      { name: 'permits_renovations', label: 'Permisos de reformas', type: 'textarea', required: false },
      { name: 'improvement_investments', label: 'Inversiones en mejoras', type: 'text', required: false }
    ]
  },
  {
    id: 'sustainability',
    title: 'Sostenibilidad y ESG',
    description: 'Criterios ambientales y sostenibilidad',
    icon: '🌱',
    fields: [
      { name: 'energy_indicators', label: 'Indicadores energéticos', type: 'textarea', required: true },
      { name: 'emissions', label: 'Emisiones de CO2', type: 'text', required: true },
      { name: 'water_footprint', label: 'Huella hídrica', type: 'text', required: false },
      { name: 'waste_management', label: 'Gestión de residuos', type: 'textarea', required: false },
      { name: 'green_certifications', label: 'Certificaciones verdes', type: 'textarea', required: false }
    ]
  },
  {
    id: 'attachments',
    title: 'Documentos anexos',
    description: 'Documentación adicional y anexos',
    icon: '📎',
    fields: [
      { name: 'technical_drawings', label: 'Planos técnicos', type: 'textarea', required: false },
      { name: 'operation_manuals', label: 'Manuales de funcionamiento', type: 'textarea', required: false },
      { name: 'financial_reports', label: 'Informes financieros', type: 'textarea', required: false },
      { name: 'insurance_policies', label: 'Pólizas de seguro', type: 'textarea', required: false },
      { name: 'legal_documents', label: 'Documentos legales', type: 'textarea', required: false }
    ]
  }
];

interface ManualSectionsWizardProps {
  buildingName?: string;
  buildingId?: string;
  startSection?: string;
}

type SectionFormState = Record<string, any>;

const ManualSectionsWizard: React.FC<ManualSectionsWizardProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const buildingId = location.state?.buildingId || props.buildingId || 'building-1';
  const buildingName = location.state?.buildingName || props.buildingName || 'Torre Central';
  const startSection = location.state?.startSection || props.startSection;

  const [book, setBook] = React.useState<DigitalBook | null>(null);
  const [loadingBook, setLoadingBook] = React.useState(true);
  const [bookError, setBookError] = React.useState<string | null>(null);

  const initialStep = startSection
    ? Math.max(0, BOOK_SECTIONS.findIndex(s => s.id === startSection))
    : 0;

  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [sectionData, setSectionData] = React.useState<SectionFormState>({});
  const [sectionDocuments, setSectionDocuments] = React.useState<Record<string, File[]>>({});
  const [completedSections, setCompletedSections] = React.useState<Set<string>>(new Set());

  // Cargar/crear libro
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingBook(true);
      setBookError(null);
      try {
        const existing = await getBookByBuilding(buildingId);
        if (!mounted) return;

        if (existing && existing.id) {
          setBook(existing);
        } else {
          const created = await createDigitalBook({ buildingId, source: 'manual' });
          if (!mounted) return;
          setBook(created);
        }
      } catch (err: any) {
        // Si el backend devolviera 404 aquí, intentamos crear
        const msg = String(err?.message ?? '');
        if (/404/.test(msg) || /not found/i.test(msg)) {
          try {
            const created = await createDigitalBook({ buildingId, source: 'manual' });
            if (!mounted) return;
            setBook(created);
          } catch (e: any) {
            if (!mounted) return;
            setBook(null);
            setBookError(e?.message || 'No se pudo crear el libro digital.');
          }
        } else {
          if (!mounted) return;
          setBook(null);
          setBookError('No se pudo cargar el libro digital. Vuelve al hub y selecciona el libro existente.');
        }
      } finally {
        if (mounted) setLoadingBook(false);
      }
    })();
    return () => { mounted = false; };
  }, [buildingId]);

  // Sincroniza datos iniciales desde el libro
  React.useEffect(() => {
    if (!book?.sections?.length) return;

    // Inicializar datos de formulario por **clave UI** (type) y por **UUID** (id) por si luego quieres leer por cualquiera.
    const initialData: Record<string, any> = {};
    const completed = new Set<string>();

    for (const s of book.sections) {
      // Guarda tanto por type (api) como por id (uuid) y por clave UI (si coincide con tu BOOK_SECTIONS.id)
      initialData[s.type] = s.content ?? {};
      initialData[s.id] = s.content ?? {};
      const uiKey = BOOK_SECTIONS.find(b => b.id === s.type)?.id;
      if (uiKey) initialData[uiKey] = s.content ?? {};

      if (s.complete) {
        // Marcamos completa la clave UI si coincide con type
        if (uiKey) completed.add(uiKey);
      }
    }

    setSectionData(initialData);
    setCompletedSections(completed);
  }, [book]);

  const currentUiSection = BOOK_SECTIONS[currentStep];

  const handleFieldChange = (fieldName: string, value: string) => {
    setSectionData(prev => ({
      ...prev,
      [currentUiSection.id]: {
        ...prev[currentUiSection.id],
        [fieldName]: value
      }
    }));
  };

  const handleDocumentsChange = (files: File[]) => {
    setSectionDocuments(prev => ({
      ...prev,
      [currentUiSection.id]: files
    }));
  };

  const validateCurrentSection = (): boolean => {
    const currentData = sectionData[currentUiSection.id] || {};
    const requiredFields = currentUiSection.fields.filter(f => f.required);
    return requiredFields.every(field => {
      const value = currentData[field.name];
      return value && value.toString().trim().length > 0;
    });
  };

  // Guarda la sección actual (borrador o completa)
  const saveSection = async (markComplete: boolean) => {
    if (!book) throw new Error('No se pudo cargar el libro digital.');

    const currentData = sectionData[currentUiSection.id] || {};

    // Llamada robusta: pasamos el libro { id, sections } + la clave UI (p.ej. 'certificates')
    // El servicio resolverá a tipo API o a partir de UUID si alguna vez cambias a usar IDs de sección del backend.
    const updated = await updateBookSection(
      { id: book.id, sections: book.sections },
      currentUiSection.id,
      currentData,
      markComplete
    );

    // Refrescar estado local con el libro actualizado
    setBook(updated);

    // Recalcular "completedSections" desde backend
    const newlyCompleted = new Set<string>();
    for (const s of updated.sections) {
      const uiKey = BOOK_SECTIONS.find(b => b.id === s.type)?.id;
      if (uiKey && s.complete) newlyCompleted.add(uiKey);
    }
    setCompletedSections(newlyCompleted);
  };

  const handleNext = async () => {
    if (!validateCurrentSection()) {
      alert('Por favor completa todos los campos obligatorios antes de continuar.');
      return;
    }
    try {
      await saveSection(true);
      if (currentStep < BOOK_SECTIONS.length - 1) {
        setCurrentStep(s => s + 1);
      } else {
        // último paso → volver al hub
        navigate('/libro-digital/hub', {
          state: { buildingName, buildingId, message: '¡Libro Digital completado exitosamente!' }
        });
      }
    } catch (e) {
      console.error(e);
      alert('Error guardando la sección.');
    }
  };

  const handlePrevious = async () => {
    if (currentStep === 0) return;
    try {
      // Guardamos como borrador al retroceder
      await saveSection(false);
      setCurrentStep(s => Math.max(0, s - 1));
    } catch (e) {
      console.error(e);
      setCurrentStep(s => Math.max(0, s - 1));
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveSection(false);
      alert('Borrador guardado correctamente');
    } catch (e) {
      console.error(e);
      alert('Error guardando el borrador.');
    }
  };

  const renderField = (field: any) => {
    const currentData = sectionData[currentUiSection.id] || {};
    const value = currentData[field.name] || '';

    const cls = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      field.required && !value ? 'border-red-300' : 'border-gray-300'
    }`;

    if (field.type === 'textarea') {
      return (
        <textarea
          key={field.name}
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          placeholder={field.label}
          rows={3}
          className={cls}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          key={field.name}
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className={cls}
        >
          <option value="">Selecciona una opción</option>
          {field.options?.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'date') {
      return (
        <input
          key={field.name}
          type="date"
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className={cls}
        />
      );
    }

    return (
      <input
        key={field.name}
        type="text"
        value={value}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
        placeholder={field.label}
        className={cls}
      />
    );
  };

  const wizardSteps = BOOK_SECTIONS.map((section) => ({
    title: section.title,
    description: section.description,
    isCompleted: completedSections.has(section.id)
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loadingBook ? (
          <div className="text-center py-20 text-gray-500">Cargando libro digital...</div>
        ) : !book ? (
          <div className="text-center py-20 text-red-500">
            <div>No se pudo cargar el libro digital.</div>
            {bookError && <span className="block mt-2 text-xs text-red-400">{bookError}</span>}
            <button
              onClick={() => navigate('/libro-digital/hub', { state: { buildingId, buildingName } })}
              className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Volver al Hub del Libro Digital
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <nav className="mb-4">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <button onClick={() => navigate('/activos')} className="hover:text-blue-600">Activos</button>
                  </li>
                  <li>
                    <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <button onClick={() => navigate('/libro-digital/hub')} className="hover:text-blue-600">Libro Digital</button>
                  </li>
                  <li>
                    <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li className="text-gray-900 font-medium">Carga Manual - {buildingName}</li>
                </ol>
              </nav>
            </div>

            <Wizard steps={wizardSteps} currentStep={currentStep} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="text-center pb-6 border-b border-gray-200">
                  <div className="text-6xl mb-4">{BOOK_SECTIONS[currentStep].icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{BOOK_SECTIONS[currentStep].title}</h2>
                  <p className="text-gray-600">{BOOK_SECTIONS[currentStep].description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {BOOK_SECTIONS[currentStep].fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>

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
                  {sectionDocuments[BOOK_SECTIONS[currentStep].id]?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Documentos subidos ({sectionDocuments[BOOK_SECTIONS[currentStep].id].length}):
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {sectionDocuments[BOOK_SECTIONS[currentStep].id].map((file, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Guardar borrador
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 sm:ml-auto"
                  >
                    {currentStep === BOOK_SECTIONS.length - 1 ? 'Finalizar Libro Digital' : 'Siguiente'}
                  </button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  Sección {currentStep + 1} de {BOOK_SECTIONS.length} • {completedSections.size} completadas
                </div>
              </div>
            </Wizard>
          </>
        )}
      </div>
    </div>
  );
};

export default ManualSectionsWizard;
