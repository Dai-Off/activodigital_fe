import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wizard from '../ui/Wizard';
import CreateBuildingStep1 from './CreateBuildingStep1';
import CreateBuildingStep2 from './CreateBuildingStep2';
import CreateBuildingStep3 from './CreateBuildingStep3';

// Tipos para los datos del formulario
interface BuildingStep1Data {
  name: string;
  address: string;
  constructionYear: string;
  typology: 'residential' | 'mixed' | 'commercial' | '';
  floors: string;
  units: string;
}

interface BuildingStep2Data {
  latitude: number;
  longitude: number;
  photos: File[];
  mainPhotoIndex: number;
}

interface CompleteBuildingData {
  name: string;
  address: string;
  constructionYear: string;
  typology: 'residential' | 'mixed' | 'commercial'; // Sin string vacío
  floors: string;
  units: string;
  latitude: number;
  longitude: number;
  photos: File[];
  mainPhotoIndex: number;
}

const CreateBuildingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState<BuildingStep1Data | null>(null);
  const [step2Data, setStep2Data] = useState<BuildingStep2Data | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pasos del wizard
  const wizardSteps = [
    {
      title: 'Datos Generales',
      description: 'Información básica del edificio'
    },
    {
      title: 'Ubicación y Fotos',
      description: 'Localización y elementos visuales'
    },
    {
      title: 'Resumen',
      description: 'Revisar información antes de continuar'
    }
  ];

  // Manejar paso 1 - Datos generales
  const handleStep1Next = (data: BuildingStep1Data) => {
    setStep1Data(data);
    setCurrentStep(1);
  };

  const handleStep1SaveDraft = (data: BuildingStep1Data) => {
    setStep1Data(data);
    // Mostrar mensaje de borrador guardado
    alert('Borrador guardado correctamente');
  };

  // Manejar paso 2 - Ubicación y fotos
  const handleStep2Next = (data: BuildingStep2Data) => {
    setStep2Data(data);
    setCurrentStep(2);
  };

  const handleStep2Previous = () => {
    setCurrentStep(0);
  };

  const handleStep2SaveDraft = (data: Partial<BuildingStep2Data>) => {
    // Guardar datos parciales del paso 2
    if (data.photos && data.photos.length > 0) {
      setStep2Data(prev => ({ ...prev, ...data } as BuildingStep2Data));
    }
    alert('Borrador guardado correctamente');
  };

  // Manejar paso 3 - Resumen
  const handleEditData = () => {
    setCurrentStep(0);
  };

  const handleEditLocation = () => {
    setCurrentStep(1);
  };

  const handleSaveFinal = async () => {
    if (!step1Data || !step2Data) return;

    setIsSubmitting(true);
    
    try {
      // Simular guardado en el backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const completeData: CompleteBuildingData = {
        ...step1Data,
        typology: step1Data.typology as 'residential' | 'mixed' | 'commercial',
        ...step2Data
      };

      console.log('Edificio guardado:', completeData);
      
      // Mostrar mensaje de éxito y navegar
      alert('Edificio guardado exitosamente. Puedes completar el libro digital más tarde.');
      navigate('/activos'); // O donde corresponda
      
    } catch (error) {
      console.error('Error guardando edificio:', error);
      alert('Error al guardar el edificio. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDigitalBook = async () => {
    if (!step1Data || !step2Data) return;

    setIsSubmitting(true);
    
    try {
      // Simular guardado en el backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const completeData: CompleteBuildingData = {
        ...step1Data,
        typology: step1Data.typology as 'residential' | 'mixed' | 'commercial',
        ...step2Data
      };

      console.log('Edificio guardado, navegando al libro digital:', completeData);
      
      // Navegar al hub del libro digital (WF-30)
      navigate('/libro-digital/hub', { 
        state: { 
          buildingData: completeData,
          isNewBuilding: true 
        } 
      });
      
    } catch (error) {
      console.error('Error guardando edificio:', error);
      alert('Error al guardar el edificio. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Datos completos para el resumen
  const getCompleteData = (): CompleteBuildingData | null => {
    if (!step1Data || !step2Data) return null;
    
    // Asegurar que la tipología no esté vacía
    if (!step1Data.typology) return null;
    
    return {
      ...step1Data,
      typology: step1Data.typology as 'residential' | 'mixed' | 'commercial',
      ...step2Data
    };
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CreateBuildingStep1
            onNext={handleStep1Next}
            onSaveDraft={handleStep1SaveDraft}
            initialData={step1Data || {}}
          />
        );
      
      case 1:
        return (
          <CreateBuildingStep2
            onNext={handleStep2Next}
            onPrevious={handleStep2Previous}
            onSaveDraft={handleStep2SaveDraft}
            initialData={step2Data || {}}
            buildingName={step1Data?.name || 'Nuevo Edificio'}
          />
        );
      
      case 2:
        const completeData = getCompleteData();
        if (!completeData) return null;
        
        return (
          <CreateBuildingStep3
            buildingData={completeData}
            onEditData={handleEditData}
            onEditLocation={handleEditLocation}
            onGoToDigitalBook={handleGoToDigitalBook}
            onSaveFinal={handleSaveFinal}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header del wizard */}
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
              <li className="text-gray-900 font-medium">
                Crear Edificio
              </li>
            </ol>
          </nav>
        </div>

        {/* Wizard con pasos */}
        <Wizard
          steps={wizardSteps}
          currentStep={currentStep}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          {/* Overlay de carga durante el envío */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Guardando edificio...</p>
              </div>
            </div>
          )}

          {/* Contenido del paso actual */}
          <div className="relative">
            {renderCurrentStep()}
          </div>
        </Wizard>

        {/* Footer con información adicional */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            ¿Necesitas ayuda? Consulta nuestra{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              guía de creación de edificios
            </a>
            {' '}o{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              contacta con soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateBuildingWizard;