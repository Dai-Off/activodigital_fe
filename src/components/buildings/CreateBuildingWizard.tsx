// src/components/buildings/CreateBuildingWizard.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Wizard from '../ui/Wizard';
import CreateBuildingStep1 from './CreateBuildingStep1';
import CreateBuildingStep2 from './CreateBuildingStep2';
import CreateBuildingStep3 from './CreateBuildingStep3';

import { useToast } from '../../contexts/ToastContext';
import { useLoadingState } from '../ui/LoadingSystem';

import { BuildingsApiService } from '../../services/buildingsApi';
import type {
  CreateBuildingPayload,
  BuildingImage
} from '../../services/buildingsApi';

import { uploadBuildingImages } from '../../services/imageUpload';

// -------------------- Types --------------------
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
  propietarioEmail: string;
  rehabilitationCost: string;
  potentialValue: string;
  squareMeters: string;
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
  typology: 'residential' | 'mixed' | 'commercial';
  floors: string;
  units: string;
  price: string;
  technicianEmail: string;
  cfoEmail: string;
  propietarioEmail: string;
  rehabilitationCost: string;
  potentialValue: string;
  squareMeters: string;
  latitude: number;
  longitude: number;
  photos: File[];
  mainPhotoIndex: number;
}

// -------------------- Component --------------------
const CreateBuildingWizard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const { loading: isSubmitting, startLoading, stopLoading } = useLoadingState();

  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState<BuildingStep1Data | null>(null);
  const [step2Data, setStep2Data] = useState<BuildingStep2Data | null>(null);

  // -------------------- Steps (i18n) --------------------
  const wizardSteps = [
    {
      title: t('buildingWizard.generalData', 'Datos Generales'),
      description: t('buildingWizard.generalDataDesc', 'Información básica del edificio')
    },
    {
      title: t('buildingWizard.locationPhotos', 'Ubicación y Fotos'),
      description: t('buildingWizard.locationPhotosDesc', 'Localización y elementos visuales')
    },
    {
      title: t('buildingWizard.summary', 'Resumen'),
      description: t('buildingWizard.summaryDesc', 'Revisar información antes de continuar')
    }
  ];

  // -------------------- Handlers: Step 1 --------------------
  const handleStep1Next = (data: BuildingStep1Data) => {
    setStep1Data(data);
    setCurrentStep(1);
  };

  const handleStep1SaveDraft = (data: BuildingStep1Data) => {
    setStep1Data(data);
    showInfo(
      t('common.draftSavedTitle', 'Borrador guardado'),
      t('buildingWizard.dataSavedTemporarily', 'Los datos se han guardado temporalmente.')
    );
  };

  // -------------------- Handlers: Step 2 --------------------
  const handleStep2Next = (data: BuildingStep2Data) => {
    setStep2Data(data);
    setCurrentStep(2);
  };

  const handleStep2Previous = () => {
    setCurrentStep(0);
  };

  const handleStep2SaveDraft = (data: Partial<BuildingStep2Data>) => {
    setStep2Data(prev => {
      const base: BuildingStep2Data = prev ?? {
        latitude: data.latitude ?? 0,
        longitude: data.longitude ?? 0,
        address: data.address ?? '',
        photos: data.photos ?? [],
        mainPhotoIndex: data.mainPhotoIndex ?? 0
      };
      return { ...base, ...data };
    });
    showInfo(
      t('common.draftSavedTitle', 'Borrador guardado'),
      t('buildingWizard.locationAndPhotosSaved', 'Ubicación y fotos guardadas temporalmente.')
    );
  };

  // -------------------- Handlers: Step 3 --------------------
  const handleEditData = () => setCurrentStep(0);
  const handleEditLocation = () => setCurrentStep(1);

  const handleSaveFinal = async () => {
    if (!step1Data || !step2Data) {
      showError(
        t('common.error', 'Error'),
        t(
          'buildings.missingFormData',
          'Faltan datos del formulario. Completa todos los pasos.'
        )
      );
      return;
    }

    if (!step2Data.address || step2Data.address.trim() === '') {
      showError(t('common.error', 'Error'), t('buildings.addressRequired', 'La dirección es obligatoria.'));
      return;
    }

    // Numeric parsing with safe defaults
    const year = Number.parseInt(step1Data.constructionYear, 10);
    const floors = Number.parseInt(step1Data.floors, 10);
    const units = Number.parseInt(step1Data.units, 10);
    const price = step1Data.price ? Number.parseFloat(step1Data.price) : undefined;
    const rehabilitationCost = step1Data.rehabilitationCost ? Number.parseFloat(step1Data.rehabilitationCost) : 0;
    const potentialValue = step1Data.potentialValue ? Number.parseFloat(step1Data.potentialValue) : 0;
    const squareMeters = step1Data.squareMeters ? Number.parseFloat(step1Data.squareMeters) : undefined;

    if (Number.isNaN(year) || Number.isNaN(floors) || Number.isNaN(units)) {
      showError(
        t('common.error', 'Error'),
        t('buildingWizard.numericFieldsInvalid', 'Revisa los campos numéricos: año, plantas y unidades.')
      );
      return;
    }

    startLoading();

    try {
      const buildingPayload: CreateBuildingPayload = {
        name: step1Data.name,
        address: step2Data.address,
        constructionYear: year,
        typology: step1Data.typology as 'residential' | 'mixed' | 'commercial',
        numFloors: floors,
        numUnits: units,
        price,
        technicianEmail: step1Data.technicianEmail || undefined,
        cfoEmail: step1Data.cfoEmail || undefined,
        propietarioEmail: step1Data.propietarioEmail || undefined,
        rehabilitationCost,
        potentialValue,
        squareMeters,
        lat: step2Data.latitude,
        lng: step2Data.longitude,
        images: []
      };

      // Persist building
      const savedBuilding = await BuildingsApiService.createBuilding(buildingPayload);

      // Upload images (if any)
      if (step2Data.photos?.length) {
        const uploadResults = await uploadBuildingImages(
          step2Data.photos,
          savedBuilding.id,
          step2Data.mainPhotoIndex
        );

        const failed = uploadResults.filter(r => !r.success);
        if (failed.length) {
          showError(
            t('common.warning', 'Advertencia'),
            t(
              'buildingWizard.someImagesFailed',
              '{{failed}} de {{total}} imágenes no se pudieron subir. El edificio se creó correctamente.',
              { failed: failed.length, total: uploadResults.length }
            )
          );
        }

        const buildingImages: BuildingImage[] = uploadResults
          .filter(r => r.success && r.image)
          .map(r => ({
            id: r.image!.id,
            url: r.image!.url,
            title: r.image!.filename,
            filename: r.image!.filename,
            isMain: r.image!.isMain,
            uploadedAt: r.image!.uploadedAt.toISOString()
          }));

        if (buildingImages.length) {
          await BuildingsApiService.uploadBuildingImages(savedBuilding.id, buildingImages);
        }
      }

      showSuccess(
        t('buildings.successTitle', 'Éxito'),
        t('buildings.buildingCreatedSuccess', 'Edificio creado correctamente.')
      );

      navigate('/activos');
    } catch (err: unknown) {
      // Normalize error
      const rawMessage =
        err instanceof Error ? err.message : t('common.unknownError', 'Error desconocido');
      let title = t('buildings.errorCreatingAsset', 'No se pudo crear el activo');
      let message = rawMessage;

      const lower = rawMessage.toLowerCase();
      const roleConflict =
        lower.includes('rol') ||
        lower.includes('role') ||
        lower.includes('ya asignado') ||
        lower.includes('already assigned') ||
        lower.includes('propietario') ||
        lower.includes('owner') ||
        lower.includes('técnico') ||
        lower.includes('technician') ||
        lower.includes('cfo') ||
        lower.includes('invitación') ||
        lower.includes('invitation') ||
        lower.includes('asignación') ||
        lower.includes('assignment');

      if (roleConflict) {
        title = t('buildings.roleConflict', 'Conflicto de roles asignados');
        if (step1Data.technicianEmail && step1Data.cfoEmail && step1Data.propietarioEmail) {
          message =
            t(
              'buildings.roleConflictDetailAll',
              'Uno de los usuarios asignados ya tiene un rol incompatible:\n\n• Técnico ({{tech}}): No puede ser CFO o propietario\n• CFO ({{cfo}}): No puede ser técnico o propietario\n• Propietario ({{prop}}): No puede ser técnico o CFO\n\nVerifica que todos los correos sean diferentes.',
              { tech: step1Data.technicianEmail, cfo: step1Data.cfoEmail, prop: step1Data.propietarioEmail }
            );
        } else if (step1Data.technicianEmail && step1Data.cfoEmail) {
          message =
            t(
              'buildings.roleConflictDetailBoth',
              'Uno de los usuarios asignados ya tiene un rol incompatible:\n\n• Técnico ({{tech}}): No puede ser CFO o propietario\n• CFO ({{cfo}}): No puede ser técnico o propietario\n\nVerifica los correos.',
              { tech: step1Data.technicianEmail, cfo: step1Data.cfoEmail }
            );
        } else if (step1Data.technicianEmail && step1Data.propietarioEmail) {
          message =
            t(
              'buildings.roleConflictDetailTechProp',
              'Uno de los usuarios asignados ya tiene un rol incompatible:\n\n• Técnico ({{tech}}): No puede ser propietario\n• Propietario ({{prop}}): No puede ser técnico\n\nVerifica los correos.',
              { tech: step1Data.technicianEmail, prop: step1Data.propietarioEmail }
            );
        } else if (step1Data.cfoEmail && step1Data.propietarioEmail) {
          message =
            t(
              'buildings.roleConflictDetailCfoProp',
              'Uno de los usuarios asignados ya tiene un rol incompatible:\n\n• CFO ({{cfo}}): No puede ser propietario\n• Propietario ({{prop}}): No puede ser CFO\n\nVerifica los correos.',
              { cfo: step1Data.cfoEmail, prop: step1Data.propietarioEmail }
            );
        } else if (step1Data.technicianEmail) {
          message = t(
            'buildings.roleConflictDetailTech',
            'El usuario "{{email}}" ya tiene un rol incompatible. Un técnico no puede ser CFO o propietario. Usa otro email o deja el campo vacío.',
            { email: step1Data.technicianEmail }
          );
        } else if (step1Data.cfoEmail) {
          message = t(
            'buildings.roleConflictDetailCfo',
            'El usuario "{{email}}" ya tiene un rol incompatible. Un CFO no puede ser técnico o propietario. Usa otro email o deja el campo vacío.',
            { email: step1Data.cfoEmail }
          );
        } else if (step1Data.propietarioEmail) {
          message = t(
            'buildings.roleConflictDetailProp',
            'El usuario "{{email}}" ya tiene un rol incompatible. Un propietario no puede ser técnico o CFO. Usa otro email o deja el campo vacío.',
            { email: step1Data.propietarioEmail }
          );
        } else {
          message = t(
            'buildings.roleConflictDetailGeneric',
            'Alguno de los usuarios asignados tiene un rol incompatible. Verifica los correos.'
          );
        }
      }

      showError(title, message);
    } finally {
      stopLoading();
    }
  };

  // -------------------- Summary Data --------------------
  const getCompleteData = (): CompleteBuildingData | null => {
    if (!step1Data || !step2Data) return null;
    if (!step1Data.typology) return null;

    return {
      ...step1Data,
      typology: step1Data.typology as 'residential' | 'mixed' | 'commercial',
      ...step2Data
    };
  };

  // -------------------- Render current step --------------------
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CreateBuildingStep1
            onNext={handleStep1Next}
            onSaveDraft={handleStep1SaveDraft}
            initialData={step1Data || ({} as Partial<BuildingStep1Data>)}
          />
        );

      case 1:
        return (
          <CreateBuildingStep2
            onNext={handleStep2Next}
            onPrevious={handleStep2Previous}
            onSaveDraft={handleStep2SaveDraft}
            initialData={step2Data || ({} as Partial<BuildingStep2Data>)}
            buildingName={step1Data?.name || t('buildings.newBuilding', 'Nuevo Edificio')}
          />
        );

      case 2: {
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
      }

      default:
        return null;
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Header */}
        <div className="mb-8">
          <nav className="mb-4" aria-label={t('nav.breadcrumb', 'Breadcrumb')}>
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/activos')}
                  className="hover:text-blue-600"
                  aria-label={t('nav.backToAssets', 'Volver a Activos')}
                >
                  {t('assets', 'Activos')}
                </button>
              </li>
              <li aria-hidden="true">
                <svg className="w-4 h-4 mx-1" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">
                {t('buildings.createBuilding', 'Crear Edificio')}
              </li>
            </ol>
          </nav>
        </div>

        {/* Wizard */}
        <Wizard
          steps={wizardSteps}
          currentStep={currentStep}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="relative">{renderCurrentStep()}</div>
        </Wizard>

        {/* Footer Help */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {t('help.needHelp', '¿Necesitas ayuda?')}{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              {t('buildings.buildingCreationGuide', 'Guía de creación de edificios')}
            </a>{' '}
            {t('common.or', 'o')}{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              {t('help.contactSupport', 'Contactar soporte')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateBuildingWizard;
