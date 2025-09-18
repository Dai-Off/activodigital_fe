import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '../ui/ProgressBar';

// Datos hardcodeados para demostrar la funcionalidad
const BOOK_SECTIONS = [
  {
    id: 'general_data',
    title: 'Datos generales del edificio',
    description: 'Información básica y características principales',
    isCompleted: false,
    icon: '🏢'
  },
  {
    id: 'construction_features',
    title: 'Características constructivas y técnicas',
    description: 'Especificaciones técnicas de construcción',
    isCompleted: false,
    icon: '🔧'
  },
  {
    id: 'certificates',
    title: 'Certificados y licencias',
    description: 'Documentación legal y certificaciones',
    isCompleted: false,
    icon: '📜'
  },
  {
    id: 'maintenance',
    title: 'Mantenimiento y conservación',
    description: 'Historial y planes de mantenimiento',
    isCompleted: false,
    icon: '🔨'
  },
  {
    id: 'installations',
    title: 'Instalaciones y consumos',
    description: 'Sistemas e instalaciones del edificio',
    isCompleted: false,
    icon: '⚡'
  },
  {
    id: 'reforms',
    title: 'Reformas y rehabilitaciones',
    description: 'Historial de modificaciones y mejoras',
    isCompleted: false,
    icon: '🏗️'
  },
  {
    id: 'sustainability',
    title: 'Sostenibilidad y ESG',
    description: 'Criterios ambientales y sostenibilidad',
    isCompleted: false,
    icon: '🌱'
  },
  {
    id: 'attachments',
    title: 'Documentos anexos',
    description: 'Documentación adicional y anexos',
    isCompleted: false,
    icon: '📎'
  }
];

interface DigitalBookHubProps {
  // Para demostrar, estos datos vendrían de props o estado global
  buildingName?: string;
  buildingId?: string;
}

const DigitalBookHub: React.FC<DigitalBookHubProps> = ({
  buildingName = "Torre Central",
  buildingId = "building-1"
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado local para demostrar progreso
  const [sections, setSections] = useState(BOOK_SECTIONS);
  const completedSections = sections.filter(s => s.isCompleted).length;
  const totalSections = sections.length;
  
  // Obtener datos del estado de navegación si es un edificio nuevo
  // const buildingData = location.state?.buildingData;
  const isNewBuilding = location.state?.isNewBuilding || false;

  const handleManualEntry = () => {
    navigate('/libro-digital/manual', { 
      state: { 
        buildingName,
        buildingId,
        sections 
      } 
    });
  };

  const handlePDFImport = () => {
    navigate('/libro-digital/pdf-import', { 
      state: { 
        buildingName,
        buildingId,
        sections 
      } 
    });
  };

  const handleSectionClick = (sectionId: string) => {
    navigate(`/libro-digital/section/${sectionId}`, {
      state: {
        buildingName,
        buildingId,
        sectionId
      }
    });
  };

  // Simulación de marcar sección como completada (para demo)
  const toggleSectionComplete = (sectionId: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, isCompleted: !section.isCompleted }
          : section
      )
    );
  };

  const getStatusMessage = () => {
    if (completedSections === 0) {
      return "Libro en borrador – ninguna sección completada";
    } else if (completedSections === totalSections) {
      return "¡Libro Digital completado!";
    } else {
      return `En progreso – ${completedSections} de ${totalSections} secciones completadas`;
    }
  };

  const getStatusColor = () => {
    if (completedSections === 0) return "text-gray-600";
    if (completedSections === totalSections) return "text-green-600";
    return "text-blue-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
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
              <li className="text-gray-900 font-medium">
                Libro Digital - {buildingName}
              </li>
            </ol>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Libro Digital
              </h1>
              <p className="text-lg text-gray-600">
                {buildingName}
              </p>
            </div>

            {/* Badge de estado */}
            <div className="text-right">
              <div className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusMessage()}
              </div>
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

        {/* Barra de progreso principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <ProgressBar
            current={completedSections}
            total={totalSections}
            label="Progreso del Libro Digital"
            size="lg"
          />
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Completar todas las secciones para finalizar el libro</span>
            <span>{Math.round((completedSections / totalSections) * 100)}% completado</span>
          </div>
        </div>

        {/* Opciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Opción 1: Completar manualmente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">
                  Completar Manualmente
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Rellena cada sección paso a paso con formularios guiados. 
                Ideal para tener control total sobre la información.
              </p>
              
              <button
                onClick={handleManualEntry}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Completar Manualmente
              </button>
            </div>
          </div>

          {/* Opción 2: Importar desde PDF */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">
                  Importar desde PDF
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Sube un PDF existente y mapea las páginas a cada sección. 
                Perfecto si ya tienes documentación preparada.
              </p>
              
              <button
                onClick={handlePDFImport}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Importar desde PDF
              </button>
            </div>
          </div>
        </div>

        {/* Checklist de secciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Secciones del Libro Digital
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Revisa y completa cada sección. Haz clic en cualquier sección para editarla directamente.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleSectionClick(section.id)}
              >
                <div className="flex items-center">
                  {/* Número e icono */}
                  <div className="flex items-center">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        section.isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {section.isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="ml-3 text-2xl">{section.icon}</span>
                  </div>

                  {/* Contenido */}
                  <div className="ml-4 flex-1">
                    <h3 className={`text-base font-medium ${
                      section.isCompleted ? 'text-gray-900 line-through' : 'text-gray-900'
                    }`}>
                      {section.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {section.description}
                    </p>
                  </div>

                  {/* Estado y acciones */}
                  <div className="ml-4 flex items-center gap-3">
                    {section.isCompleted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completada
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Pendiente
                      </span>
                    )}

                    {/* Botón demo para marcar/desmarcar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSectionComplete(section.id);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {section.isCompleted ? 'Desmarcar' : 'Marcar completa'}
                    </button>

                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer con acciones adicionales */}
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