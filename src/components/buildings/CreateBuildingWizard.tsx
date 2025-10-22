import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import Wizard from '../ui/Wizard';
import CreateBuildingStep1 from './CreateBuildingStep1';
import CreateBuildingStep2 from './CreateBuildingStep2';
import CreateBuildingStep3 from './CreateBuildingStep3';
import { BuildingsApiService } from '../../services/buildingsApi';
import type { CreateBuildingPayload, BuildingImage } from '../../services/buildingsApi';
import { useLoadingState } from '../ui/LoadingSystem';
import { uploadBuildingImages } from '../../services/imageUpload';

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
  squareMeters: string;       // Superficie en metros cuadrados
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
  squareMeters: string;       // Superficie en metros cuadrados
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
  const { t } = useTranslation();
  const wizardSteps = [
    {
  title: t('generalData', 'Datos Generales'),
  description: t('generalDataDesc', 'Información básica del edificio')
    },
    {
  title: t('locationPhotos', 'Ubicación y Fotos'),
  description: t('locationPhotosDesc', 'Localización y elementos visuales')
    },
    {
  title: t('summary', 'Resumen'),
  description: t('summaryDesc', 'Revisar información antes de continuar')
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
  showInfo(t('draftSaved'), t('dataSavedTemporarily'));
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
    showInfo(t('draftSaved'), t('locationAndPhotosSaved'));
  };

  // Manejar paso 3 - Resumen
  const handleEditData = () => {
    setCurrentStep(0);
  };

  const handleEditLocation = () => {
    setCurrentStep(1);
  };

  const handleSaveFinal = async () => {
    if (!step1Data || !step2Data) {
      showError(t('error'), t('buildings.missingFormData', 'Faltan datos del formulario. Por favor, completa todos los pasos.'));
      return;
    }

    // Validar que la dirección no esté vacía
    if (!step2Data.address || step2Data.address.trim() === '') {
      showError(t('error'), t('buildings.addressRequired'));
      return;
    }

    startLoading();
    
    // La validación principal de roles ocurre en el Paso 1
    // Esta es solo una validación de respaldo por seguridad
    
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
        squareMeters: step1Data.squareMeters ? parseFloat(step1Data.squareMeters) : undefined,
        lat: step2Data.latitude,
        lng: step2Data.longitude,
        // Inicialmente sin imágenes, las subiremos después
        images: []
      };

      console.log('Datos del paso 1:', step1Data);
      console.log('Datos del paso 2:', step2Data);
      console.log('Enviando al backend:', buildingPayload);
      
      // Guardar en el backend real
      const savedBuilding = await BuildingsApiService.createBuilding(buildingPayload);
      
      console.log('Edificio guardado exitosamente:', savedBuilding);
      
      // Si hay imágenes, subirlas a Supabase
      if (step2Data.photos && step2Data.photos.length > 0) {
        // Ya no mostramos toast; el botón mostrará spinner
        
        const uploadResults = await uploadBuildingImages(
          step2Data.photos,
          savedBuilding.id,
          step2Data.mainPhotoIndex
        );

        // Verificar si todas las subidas fueron exitosas
        const failedUploads = uploadResults.filter(result => !result.success);
        if (failedUploads.length > 0) {
          console.warn('Algunas imágenes no se pudieron subir:', failedUploads);
          showError(
            'Advertencia',
            `${failedUploads.length} de ${uploadResults.length} imágenes no se pudieron subir. El edificio se creó correctamente.`
          );
        }

        // Preparar imágenes para el backend
        const buildingImages: BuildingImage[] = uploadResults
          .filter(result => result.success && result.image)
          .map(result => ({
            id: result.image!.id,
            url: result.image!.url,
            title: result.image!.filename,
            filename: result.image!.filename,
            isMain: result.image!.isMain,
            uploadedAt: result.image!.uploadedAt.toISOString()
          }));

        // Actualizar el edificio con las URLs de las imágenes
        if (buildingImages.length > 0) {
          await BuildingsApiService.uploadBuildingImages(savedBuilding.id, buildingImages);
        }
      }
      
      // Mostrar notificación de éxito
      showSuccess(t('buildings.buildingCreatedSuccess'));
      
      // Navegar de vuelta a la lista
      navigate('/activos');
      
    } catch (error) {
      console.error('Error guardando edificio:', error);
      
      // Mejorar los mensajes de error según el tipo de conflicto
      let errorMessage = error instanceof Error ? error.message : t('unknownError', 'Error desconocido');
      let errorTitle = t('buildings.errorCreatingAsset');
      
      // Detectar errores de roles duplicados o conflictos de usuario del backend
      const lowerError = errorMessage.toLowerCase();
      if (lowerError.includes('rol') || 
          lowerError.includes('role') || 
          lowerError.includes('ya asignado') ||
          lowerError.includes('already assigned') ||
          lowerError.includes('propietario') ||
          lowerError.includes('owner') ||
          lowerError.includes('técnico') ||
          lowerError.includes('technician') ||
          lowerError.includes('cfo')) {
        errorTitle = t('buildings.roleConflict');
        
        // Mensajes específicos según qué usuario causó el error
        if (step1Data.technicianEmail && step1Data.cfoEmail) {
          errorMessage = `Uno de los usuarios asignados ya tiene un rol incompatible:\n\n` +
                        `• Técnico (${step1Data.technicianEmail}): No puede ser CFO o propietario\n` +
                        `• CFO (${step1Data.cfoEmail}): No puede ser técnico o propietario\n\n` +
                        `Por favor, verifica los emails ingresados.`;
        } else if (step1Data.technicianEmail) {
          errorMessage = `El usuario "${step1Data.technicianEmail}" ya tiene un rol incompatible. Un técnico no puede ser CFO o propietario de otro edificio. Por favor, usa un email diferente o deja el campo vacío.`;
        } else if (step1Data.cfoEmail) {
          errorMessage = `El usuario "${step1Data.cfoEmail}" ya tiene un rol incompatible. Un CFO no puede ser técnico o propietario de otro edificio. Por favor, usa un email diferente o deja el campo vacío.`;
        } else {
          errorMessage = 'Uno de los usuarios asignados ya tiene un rol incompatible en el sistema. Por favor, verifica los emails ingresados.';
        }
      }
      
      showError(errorTitle, errorMessage);
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
            buildingName={step1Data?.name || t('buildings.newBuilding', 'Nuevo Edificio')}
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
            isSaving={isSubmitting}
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
                  {t('assets')}
                </button>
              </li>
              <li>
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">
                {t('createBuilding')}
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

          {/* Contenido del paso actual */}
          <div className="relative">
            {renderCurrentStep()}
          </div>
        </Wizard>

        {/* Footer con información adicional */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {t('needHelp')}{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              {t('buildingCreationGuide')}
            </a>
            {' '}{t('or')}{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              {t('contactSupport')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateBuildingWizard;