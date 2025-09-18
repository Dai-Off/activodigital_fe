import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import FileUpload from '../ui/FileUpload';

// Configuración de las secciones
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
      { name: 'construction_date', label: 'Fecha de construcción exacta', type: 'date', required: false }
    ]
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
      { name: 'roof_type', label: 'Tipo de cubierta', type: 'text', required: false }
    ]
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
      { name: 'accessibility_certificate', label: 'Certificado de accesibilidad', type: 'text', required: false }
    ]
  },
  maintenance: {
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
  installations: {
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
  reforms: {
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
  sustainability: {
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
  attachments: {
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
};

const SectionEditor: React.FC = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();
  const location = useLocation();

  // Obtener datos del estado de navegación
  const buildingName = location.state?.buildingName || "Torre Central";
  const buildingId = location.state?.buildingId || "building-1";

  // Obtener configuración de la sección
  const sectionConfig = sectionId ? SECTION_CONFIGS[sectionId as keyof typeof SECTION_CONFIGS] : null;

  // Estado local del formulario
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<File[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!sectionConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sección no encontrada</h1>
          <p className="text-gray-600 mb-4">La sección "{sectionId}" no existe.</p>
          <button 
            onClick={() => navigate('/libro-digital/hub')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Hub
          </button>
        </div>
      </div>
    );
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleDocumentsChange = (files: File[]) => {
    setDocuments(files);
  };

  const handleSave = () => {
    console.log('Guardando sección:', {
      sectionId,
      buildingId,
      formData,
      documents,
      isCompleted
    });
    
    alert('Sección guardada correctamente');
  };

  const handleSaveAndComplete = () => {
    setIsCompleted(true);
    handleSave();
    
    // Navegar de vuelta al hub
    setTimeout(() => {
      navigate('/libro-digital/hub', {
        state: {
          buildingName,
          buildingId,
          message: `Sección "${sectionConfig.title}" completada exitosamente`
        }
      });
    }, 500);
  };

  const renderField = (field: any) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              field.required && !value ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        );
      
      case 'select':
        return (
          <select
            key={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              field.required && !value ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona una opción</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'date':
        return (
          <input
            key={field.name}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              field.required && !value ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        );
      
      default: // text
        return (
          <input
            key={field.name}
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              field.required && !value ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        );
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = sectionConfig.fields.filter(field => field.required);
    return requiredFields.every(field => {
      const value = formData[field.name];
      return value && value.toString().trim().length > 0;
    });
  };

  const canComplete = validateForm();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
                Editar Sección
              </li>
            </ol>
          </nav>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          
          {/* Header de la sección */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{sectionConfig.icon}</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {sectionConfig.title}
                  </h1>
                  <p className="text-gray-600">
                    {sectionConfig.description}
                  </p>
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

            {/* Subida de documentos */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Documentos de la sección
              </h3>
              <FileUpload
                onFilesSelected={handleDocumentsChange}
                acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
                maxFiles={5}
                maxSizeInMB={10}
                label="Subir documentos relacionados"
                description="Arrastra documentos aquí o haz clic para seleccionar (PDF, imágenes, Word)"
              />
              
              {/* Lista de documentos actuales */}
              {documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Documentos subidos ({documents.length}):
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {documents.map((file, index) => (
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
          </div>

          {/* Footer con botones */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
              
              {/* Información de validación */}
              <div className="text-sm text-gray-600">
                {canComplete ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Sección lista para completar</span>
                  </div>
                ) : (
                  <span>Completa los campos obligatorios (*) para marcar como terminada</span>
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
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Guardar Borrador
                </button>
                
                <button
                  onClick={handleSaveAndComplete}
                  disabled={!canComplete}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar y Completar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;