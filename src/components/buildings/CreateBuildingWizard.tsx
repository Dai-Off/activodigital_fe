// src/components/buildings/CreateBuildingWizard.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import Wizard from "../ui/Wizard";
import CreateBuildingStep1 from "./CreateBuildingStep1";
import CreateBuildingStep2 from "./CreateBuildingStep2";
import CreateBuildingStep3 from "./CreateBuildingStep3";
import CreateBuildingMethodSelection, {
  type BuildingCreationMethod,
} from "./CreateBuildingMethodSelection";
import CreateBuildingFromCatastro from "./CreateBuildingFromCatastro";

import { useToast } from "../../contexts/ToastContext";
import { useLoadingState } from "../ui/LoadingSystem";

import { BuildingsApiService } from "../../services/buildingsApi";
import type {
  CreateBuildingPayload,
  BuildingImage,
} from "../../services/buildingsApi";

import { uploadBuildingImages } from "../../services/imageUpload";
import { SupportContactModal } from "../SupportContactModal";

// -------------------- Types --------------------
export interface BuildingStep1Data {
  name: string;
  address: string;
  constructionYear: string;
  typology: "residential" | "mixed" | "commercial" | "";
  floors: string;
  units: string;
  price: string;
  technicianEmail: string;
  cfoEmail: string;
  propietarioEmail: string;
  squareMeters: string;
  cadastralReference?: string;
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
  typology: "residential" | "mixed" | "commercial";
  floors: string;
  units: string;
  price: string;
  technicianEmail: string;
  cfoEmail: string;
  propietarioEmail: string;
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
  const location = useLocation();
  const { showSuccess, showError, showInfo } = useToast();
  const {
    loading: isSubmitting,
    startLoading,
    stopLoading,
  } = useLoadingState();

  // Obtener el método y el origen desde el state de navegación, si existe
  const navigationState = location.state as { 
    method?: BuildingCreationMethod;
    fromDashboard?: boolean;
  } | null;
  const methodFromState = navigationState?.method;
  const fromDashboard = navigationState?.fromDashboard || false;
  const [selectedMethod, setSelectedMethod] =
    useState<BuildingCreationMethod | null>(methodFromState || null);
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState<BuildingStep1Data | null>(null);
  const [step2Data, setStep2Data] = useState<BuildingStep2Data | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // -------------------- Steps (i18n) --------------------
  const wizardSteps = [
    {
      title: t("generalData"),
      description: t("generalDataDesc"),
    },
    {
      title: t("locationPhotos"),
      description: t("locationPhotosDesc"),
    },
    {
      title: t("summary"),
      description: t("summaryDesc"),
    },
  ];

  // -------------------- Handlers: Method Selection --------------------
  const handleMethodSelection = (method: BuildingCreationMethod) => {
    setSelectedMethod(method);
    setCurrentStep(0); // Ir al paso 0 (Step1 o Catastro)
  };

  const handleMethodSelectionClose = () => {
    navigate(fromDashboard ? "/dashboard" : "/assets");
  };

  // -------------------- Handlers: Catastro --------------------
  const handleCatastroDataLoaded = (
    data: BuildingStep1Data,
    coordinates?: { lat: number; lng: number }
  ) => {
    setStep1Data(data);
    // Inicializar step2Data con la dirección y coordenadas si están disponibles.
    // Si Catastro/geocodificación no devuelve coordenadas válidas,
    // el paso 2 mostrará un mensaje para que el usuario marque la ubicación manualmente.
    const step2DataUpdate: BuildingStep2Data = {
      address: data.address || "",
      latitude: coordinates?.lat ?? 0,
      longitude: coordinates?.lng ?? 0,
      photos: [],
      mainPhotoIndex: 0,
    };

    setStep2Data(step2DataUpdate);
    // A partir de este punto tratamos el flujo como "manual":
    // el paso 0 será el formulario de datos generales con los datos de Catastro pre-rellenados.
    setSelectedMethod("manual");

    setCurrentStep(1); // Ir al paso 1 (Step2)
  };

  const handleCatastroCancel = () => {
    // Si no hay método desde state, volver al modal de selección
    if (!methodFromState) {
      setSelectedMethod(null);
      setStep1Data(null);
      setCurrentStep(0);
    } else {
      // Si viene desde state, volver según el origen
      navigate(fromDashboard ? "/dashboard" : "/assets");
    }
  };

  // -------------------- Handlers: Step 1 --------------------
  const handleStep1Next = (data: BuildingStep1Data) => {
    setStep1Data(data);
    setCurrentStep(1);
  };

  const handleStep1Cancel = () => {
    // Si no hay método desde state, volver al modal de selección
    if (!methodFromState) {
      setSelectedMethod(null);
      setStep1Data(null);
    } else {
      // Si viene desde state, volver según el origen
      navigate(fromDashboard ? "/dashboard" : "/assets");
    }
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
    setStep2Data((prev) => {
      const base: BuildingStep2Data = prev ?? {
        latitude: data.latitude ?? 0,
        longitude: data.longitude ?? 0,
        address: data.address ?? "",
        photos: data.photos ?? [],
        mainPhotoIndex: data.mainPhotoIndex ?? 0,
      };
      return { ...base, ...data };
    });
    showInfo(t("draftSavedTitle"), t("draftSavedDesc"));
  };

  // -------------------- Handlers: Step 3 --------------------
  const handleEditData = () => setCurrentStep(0);
  const handleEditLocation = () => setCurrentStep(1);

  const handleSaveFinal = async () => {
    if (!step1Data || !step2Data) {
      showError(
        t("error"),
        t("missingFormData")
      );
      return;
    }

    if (!step2Data.address || step2Data.address.trim() === "") {
      showError(
        t("error"),
        t("addressRequired")
      );
      return;
    }

    // Numeric parsing with safe defaults
    const year = Number.parseInt(step1Data.constructionYear, 10);
    const floors = Number.parseInt(step1Data.floors, 10);
    const units = step1Data.units ? Number.parseInt(step1Data.units, 10) : undefined;
    const price = step1Data.price
      ? Number.parseFloat(step1Data.price)
      : undefined;
    const squareMeters = step1Data.squareMeters
      ? Number.parseFloat(step1Data.squareMeters)
      : undefined;

    if (Number.isNaN(year) || Number.isNaN(floors)) {
      showError(
        t("error"),
        t("numericFieldsInvalid")
      );
      return;
    }

    startLoading();

    try {
      // Preparar referencia catastral - solo incluir si tiene valor válido
      const cadastralRef = step1Data.cadastralReference?.trim();
      const cadastralReference = cadastralRef && cadastralRef.length > 0 ? cadastralRef : undefined;

      // Tipología segura: si viene vacía (casos de Catastro sin uso claro), asumimos 'residential'
      const safeTypology =
        (step1Data.typology as "residential" | "mixed" | "commercial" | "") || "residential";

      const buildingPayload: CreateBuildingPayload = {
        name: step1Data.name,
        address: step2Data.address,
        cadastralReference,
        constructionYear: year,
        typology: safeTypology,
        numFloors: floors,
        numUnits: units && !Number.isNaN(units) ? units : undefined,
        price,
        technicianEmail: step1Data.technicianEmail || undefined,
        cfoEmail: step1Data.cfoEmail || undefined,
        propietarioEmail: step1Data.propietarioEmail || undefined,
        squareMeters,
        lat: step2Data.latitude,
        lng: step2Data.longitude,
        images: [],
      };

      // Persist building
      const savedBuilding = await BuildingsApiService.createBuilding(
        buildingPayload
      );

      // Upload images (if any)
      if (step2Data.photos?.length) {
        const uploadResults = await uploadBuildingImages(
          step2Data.photos,
          savedBuilding.id,
          step2Data.mainPhotoIndex
        );

        const failed = uploadResults.filter((r) => !r.success);
        if (failed.length) {
          showError(
            t("warning"),
            t(
              "someImagesFailed",
              "{{failed}} de {{total}} imágenes no se pudieron subir. El edificio se creó correctamente.",
              { failed: failed.length, total: uploadResults.length }
            )
          );
        }

        const buildingImages: BuildingImage[] = uploadResults
          .filter((r) => r.success && r.image)
          .map((r) => ({
            id: r.image!.id,
            url: r.image!.url,
            title: r.image!.filename,
            filename: r.image!.filename,
            isMain: r.image!.isMain,
            uploadedAt: r.image!.uploadedAt.toISOString(),
          }));

        // Validar que todas las URLs sean únicas
        const uniqueUrls = new Set(buildingImages.map(img => img.url));
        if (uniqueUrls.size !== buildingImages.length) {
          console.warn('[CreateBuildingWizard] Advertencia: Se detectaron URLs duplicadas en las imágenes', {
            total: buildingImages.length,
            unicas: uniqueUrls.size,
            urls: buildingImages.map(img => ({ id: img.id, url: img.url.substring(0, 50) + '...' }))
          });
        }

        // Filtrar imágenes duplicadas por URL antes de guardar
        const uniqueImages = buildingImages.filter((img, index, self) => 
          index === self.findIndex(i => i.url === img.url)
        );

        if (uniqueImages.length !== buildingImages.length) {
          console.warn(`[CreateBuildingWizard] Se filtraron ${buildingImages.length - uniqueImages.length} imágenes duplicadas`);
        }

        if (uniqueImages.length) {
          await BuildingsApiService.uploadBuildingImages(
            savedBuilding.id,
            uniqueImages
          );
        }
      }

      showSuccess(
        t("successTitle"),
        t("buildingCreatedSuccess")
      );

      // Navegar con un estado para forzar recarga de la lista
      navigate(fromDashboard ? "/dashboard" : "/assets", {
        state: { refresh: true, timestamp: Date.now() },
        replace: false,
      });
    } catch (err: unknown) {
      // Normalize error
      const rawMessage =
        err instanceof Error
          ? err.message
          : t("unknownError");
      let title = t("errorCreatingAsset");
      let message = rawMessage;

      const lower = rawMessage.toLowerCase();
      const roleConflict =
        lower.includes("rol") ||
        lower.includes("role") ||
        lower.includes("ya asignado") ||
        lower.includes("already assigned") ||
        lower.includes("propietario") ||
        lower.includes("owner") ||
        lower.includes("técnico") ||
        lower.includes("technician") ||
        lower.includes("cfo") ||
        lower.includes("invitación") ||
        lower.includes("invitation") ||
        lower.includes("asignación") ||
        lower.includes("assignment");

      if (roleConflict) {
        title = t("roleConflict");
        if (
          step1Data.technicianEmail &&
          step1Data.cfoEmail &&
          step1Data.propietarioEmail
        ) {
          message = t(
            "roleConflictDetailAll",
            {
              tech: step1Data.technicianEmail,
              cfo: step1Data.cfoEmail,
              prop: step1Data.propietarioEmail,
            }
          );
        } else if (step1Data.technicianEmail && step1Data.cfoEmail) {
          message = t(
            "roleConflictDetailBoth",
            { tech: step1Data.technicianEmail, cfo: step1Data.cfoEmail }
          );
        } else if (step1Data.technicianEmail && step1Data.propietarioEmail) {
          message = t(
            "roleConflictDetailTechProp",
            {
              tech: step1Data.technicianEmail,
              prop: step1Data.propietarioEmail,
            }
          );
        } else if (step1Data.cfoEmail && step1Data.propietarioEmail) {
          message = t(
            "roleConflictDetailCfoProp",
            { cfo: step1Data.cfoEmail, prop: step1Data.propietarioEmail }
          );
        } else if (step1Data.technicianEmail) {
          message = t(
            "roleConflictDetailTech",
            { email: step1Data.technicianEmail }
          );
        } else if (step1Data.cfoEmail) {
          message = t(
            "roleConflictDetailCfo",
            { email: step1Data.cfoEmail }
          );
        } else if (step1Data.propietarioEmail) {
          message = t(
            "roleConflictDetailProp",
            { email: step1Data.propietarioEmail }
          );
        } else {
          message = t("roleConflictDetailGeneric");
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

    const safeTypology =
      (step1Data.typology as "residential" | "mixed" | "commercial" | "") || "residential";

    return {
      ...step1Data,
      typology: safeTypology,
      ...step2Data,
    };
  };

  // -------------------- Render current step --------------------
  const renderCurrentStep = () => {
    // Paso 0: Step1 (manual) o Catastro
    if (currentStep === 0) {
      if (selectedMethod === "catastro") {
        return (
          <CreateBuildingFromCatastro
            onDataLoaded={handleCatastroDataLoaded}
            onCancel={handleCatastroCancel}
          />
        );
      } else {
        return (
          <CreateBuildingStep1
            onNext={handleStep1Next}
            onCancel={handleStep1Cancel}
            initialData={step1Data || {}}
          />
        );
      }
    }

    // Paso 1: Step2 (Ubicación y Fotos)
    if (currentStep === 1) {
      return (
        <CreateBuildingStep2
          onNext={handleStep2Next}
          onPrevious={handleStep2Previous}
          onSaveDraft={handleStep2SaveDraft}
          initialData={step2Data || ({} as Partial<BuildingStep2Data>)}
          buildingName={
            step1Data?.name || t("newBuilding")
          }
        />
      );
    }

    // Paso 2: Step3 (Resumen)
    if (currentStep === 2) {
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

    return null;
  };

  // -------------------- JSX --------------------
  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Breadcrumb / Header */}
        <div className="mb-4 md:mb-8">
          <nav className="mb-2 md:mb-4" aria-label={t("breadcrumb")}>
            <ol className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-500">
              <li>
                <button
                  type="button"
                  onClick={() => navigate(fromDashboard ? "/dashboard" : "/assets")}
                  className="hover:text-blue-600"
                  aria-label={fromDashboard ? t("backToDashboard") : t("backToAssets")}
                >
                  {fromDashboard ? t("dashboard") : t("assets")}
                </button>
              </li>
              <li aria-hidden="true">
                <svg
                  className="w-3 h-3 md:w-4 md:h-4 mx-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">
                {t("createBuilding")}
              </li>
            </ol>
          </nav>
        </div>

        {/* Modal de selección de método - solo si no viene método desde state */}
        {!methodFromState && (
          <CreateBuildingMethodSelection
            isOpen={selectedMethod === null}
            onSelectMethod={handleMethodSelection}
            onClose={handleMethodSelectionClose}
          />
        )}

        {/* Wizard - Solo mostrar si ya se seleccionó un método */}
        {selectedMethod !== null && (
          <Wizard
            steps={wizardSteps}
            currentStep={currentStep}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6"
          >
            <div className="relative">{renderCurrentStep()}</div>
          </Wizard>
        )}

        {/* Footer Help */}
        {/* <div className="mt-4 md:mt-8 text-center text-xs md:text-sm text-gray-500">
          <p>
            {t("needHelp")}{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              {t("buildingCreationGuide")}
            </a>{" "}
            {t("or")}{" "}
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {t("contactSupport")}
            </button>
          </p>
        </div> */}
      </div>

      <SupportContactModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        initialCategory="technical"
        initialSubject={t("contactSupport")}
        context={`Create Building Wizard - ${window.location.href}`}
      />
    </div>
  );
};

export default CreateBuildingWizard;
