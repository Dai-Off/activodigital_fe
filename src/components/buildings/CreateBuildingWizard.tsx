import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import Wizard from '../ui/Wizard';
import CreateBuildingStep1 from './CreateBuildingStep1';
import CreateBuildingStep2 from './CreateBuildingStep2';
import CreateBuildingStep3 from './CreateBuildingStep3';
import { BuildingsApiService } from '../../services/buildingsApi';
import type { CreateBuildingPayload } from '../../services/buildingsApi';
import { useLoadingState } from '../ui/LoadingSystem';

// Tipos para los datos del formulario
export interface BuildingStep1Data {
  name: string;
  address: string;
  constructionYear: string;
  typology: 'residential' | 'mixed' | 'commercial' | '';
  floors: string;
  units: string;
  price: string;
  technicianEmail: string;
  cfoEmail: string;
  // Campos financieros
  rehabilitationCost: string; // Coste de rehabilitación
  potentialValue: string;     // Valor potencial
}

interface BuildingStep2Data {
  latitude: number;
  longitude: number;
  address: string;
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
  price: string;
  technicianEmail: string;
  cfoEmail: string;
  // Campos financieros
  rehabilitationCost: string; // Coste de rehabilitación
  potentialValue: string;     // Valor potencial
  latitude: number;
  longitude: number;
  photos: File[];
  mainPhotoIndex: number;
}

const CreateBuildingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const { loading: isSubmitting, startLoading, stopLoading } = useLoadingState();
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState<BuildingStep1Data | null>(null);
  const [step2Data, setStep2Data] = useState<BuildingStep2Data | null>(null);

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
    // Mostrar notificación de borrador guardado
    showInfo('Borrador guardado', 'Los datos se han guardado temporalmente');
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
    showInfo('Borrador guardado', 'Ubicación y fotos guardadas temporalmente');
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

    startLoading();
    
    try {
      // Preparar datos para el backend
      const buildingPayload: CreateBuildingPayload = {
        name: step1Data.name,
        address: step2Data.address, // Usar address del paso 2
        constructionYear: parseInt(step1Data.constructionYear),
        typology: step1Data.typology as 'residential' | 'mixed' | 'commercial',
        numFloors: parseInt(step1Data.floors),
        numUnits: parseInt(step1Data.units),
        price: step1Data.price ? parseFloat(step1Data.price) : undefined,
        technicianEmail: step1Data.technicianEmail || undefined,
        cfoEmail: step1Data.cfoEmail || undefined,
        // Campos financieros
        rehabilitationCost: step1Data.rehabilitationCost ? parseFloat(step1Data.rehabilitationCost) : 0,
        potentialValue: step1Data.potentialValue ? parseFloat(step1Data.potentialValue) : 0,
        lat: step2Data.latitude,
        lng: step2Data.longitude,
        // TODO: Procesar imágenes - por ahora las omitimos
        images: []
      };

      console.log('Enviando al backend:', buildingPayload);
      
      // Guardar en el backend real
      const savedBuilding = await BuildingsApiService.createBuilding(buildingPayload);
      
      console.log('Edificio guardado exitosamente:', savedBuilding);
      
      // Mostrar notificación de éxito
      showSuccess('Edificio creado exitosamente');
      
      // Navegar de vuelta a la lista
      navigate('/activos');
      
    } catch (error) {
      console.error('Error guardando edificio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      showError(
        'Error al crear el activo',
        errorMessage
      );
    } finally {
      stopLoading();
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