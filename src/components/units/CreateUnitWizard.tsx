// src/components/units/CreateUnitWizard.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import CreateUnitMethodSelection, {
  type UnitCreationMethod,
} from "./CreateUnitMethodSelection";
import CreateUnitFromCatastro from "./CreateUnitFromCatastro";
import CreateUnitManual, { type UnitFormData } from "./CreateUnitManual";

import { useToast } from "../../contexts/ToastContext";
import { useLoadingState } from "../ui/LoadingSystem";
import { UnitsApiService, type CreateBuildingUnitRequest } from "../../services/unitsApi";
import type { FrontendUnit } from "../../utils/catastroUnits";

// -------------------- Component --------------------
const CreateUnitWizard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: buildingId } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const {
    startLoading,
    stopLoading,
  } = useLoadingState();

  const [selectedMethod, setSelectedMethod] =
    useState<UnitCreationMethod | null>(null);
  const [manualData, setManualData] = useState<UnitFormData[]>([]);
  const [catastroImportedData, setCatastroImportedData] = useState<UnitFormData[]>([]);
  const [catastroUnits, setCatastroUnits] = useState<FrontendUnit[]>([]);
  const [isReviewStep, setIsReviewStep] = useState(false);

  const handleMethodSelect = (method: UnitCreationMethod) => {
    setSelectedMethod(method);
  };

  const handleCancel = () => {
    if (!selectedMethod) {
      // Si no hay método seleccionado, volver a la lista de unidades
      if (buildingId) {
        navigate(`/building/${buildingId}/unidades`);
      } else {
        navigate("/assets/units");
      }
      return;
    }

    // Si estamos en algún paso del wizard, volver al selector inicial
    setSelectedMethod(null);
    setManualData([]);
    setCatastroImportedData([]);
    setCatastroUnits([]);
    setIsReviewStep(false);
  };

  const handleManualNext = (data: UnitFormData[]) => {
    setManualData(data);
    // TODO: Implementar la lógica de guardado cuando esté disponible el servicio
    handleSubmitMultiple(data);
  };

  const mapFrontendUnitToFormData = (unit: FrontendUnit): UnitFormData => {
    return {
      id: undefined,
      name: unit.name,
      typology: unit.useType || '',
      area: unit.areaM2 != null ? String(unit.areaM2) : '',
      floor: unit.floor || '',
      door: unit.identifier || '',
      tenant: '',
      monthlyRent: '',
      status: 'available',
      expirationDate: '',
    };
  };

  const handleCatastroUnitsCreated = async (units: FrontendUnit[]) => {
    if (!buildingId) {
      showError(t("noBuilding"));
      return;
    }

    if (!units || units.length === 0) {
      showError(
        t("noUnitsCreated")
      );
      return;
    }

    // Guardamos las unidades importadas y pasamos al paso de revisión
    setCatastroUnits(units);
    setIsReviewStep(true);

    const unitCount = units.length;
    showSuccess(
      t("loadedFromCatastro ", { count: unitCount })
    );
  };

  const handleStartManualFromCatastro = () => {
    if (!catastroUnits.length) return;
    const mapped = catastroUnits.map(mapFrontendUnitToFormData);
    setCatastroImportedData(mapped);
    setSelectedMethod("manual");
    setIsReviewStep(false);
  };

  const handleDiscardCatastroImport = () => {
    setCatastroUnits([]);
    setCatastroImportedData([]);
    setIsReviewStep(false);
    setSelectedMethod(null);
  };


  const handleSubmitMultiple = async (units: UnitFormData[]) => {
    if (!buildingId) {
      showError(t('noBuilding'));
      return;
    }

    if (units.length === 0) {
      showError(t('noUnitsCreated'));
      return;
    }

    startLoading();
    try {
      console.log('🔍 [CreateUnitWizard] Unidades recibidas del formulario:', units.length, units);

      const payloads: CreateBuildingUnitRequest[] = units.map((unit, index) => {
        const identifierParts: string[] = [];
        if (unit.floor) identifierParts.push(String(unit.floor));
        if (unit.door) identifierParts.push(String(unit.door));
        const identifier = identifierParts.length > 0 ? identifierParts.join("-") : null;

        // Asegurar que name no esté vacío - usar identifier o un nombre por defecto
        const name = unit.name?.trim() || identifier || `Unidad ${index + 1}`;

        const payload = {
          // id temporal del form NO se envía; backend genera id
          name: name,
          identifier,
          floor: unit.floor || null,
          areaM2: unit.area ? parseFloat(unit.area) : null,
          useType: unit.typology || null,
          status:
            unit.status === "occupied"
              ? t("occupied")
              : unit.status === "maintenance"
                ? t("maintenance")
                : unit.status === "available"
                  ? t("available")
                  : null,
          rent:
            unit.monthlyRent && unit.monthlyRent.trim().length > 0
              ? parseFloat(unit.monthlyRent)
              : null,
          tenant: unit.tenant?.trim() || null,
          rooms: null,
          baths: null,
          rawData: {
            source: "manual_form",
            expirationDate: unit.expirationDate || null,
          },
        };
        console.log(`📝 [CreateUnitWizard] Payload ${index + 1}/${units.length}:`, payload);
        return payload;
      });

      console.log('📤 [CreateUnitWizard] Payloads a enviar:', payloads.length, payloads);
      const result = await UnitsApiService.upsertUnits(buildingId, payloads);
      console.log('✅ [CreateUnitWizard] Respuesta del backend:', result?.length, result);

      const unitCount = units.length;
      showSuccess(
        t('createdMultiple', `Se ${unitCount === 1 ? 'creó' : 'crearon'} ${unitCount} ${unitCount === 1 ? 'unidad' : 'unidades'} exitosamente`)
      );

      // Volver a la lista de unidades
      navigate(`/building/${buildingId}/unidades`);
    } catch (error) {
      console.error('Error creando unidades:', error);
      showError(
        t('createFailed')
      );
    } finally {
      stopLoading();
    }
  };

  // Si no hay método seleccionado, mostrar el selector
  if (!selectedMethod) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CreateUnitMethodSelection
            isOpen={true}
            onSelectMethod={handleMethodSelect}
            onClose={handleCancel}
          />
        </div>
      </div>
    );
  }

  // Renderizar el formulario según el método seleccionado
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedMethod === "manual" && (
          <CreateUnitManual
            onNext={handleManualNext}
            onCancel={handleCancel}
            initialData={
              catastroImportedData.length > 0
                ? catastroImportedData
                : manualData.length > 0
                  ? manualData
                  : undefined
            }
          />
        )}

        {selectedMethod === "catastro" && !isReviewStep && (
          <CreateUnitFromCatastro
            onUnitsCreated={handleCatastroUnitsCreated}
            onCancel={handleCancel}
            onGoManual={() => {
              // Pasar directamente al flujo manual si el usuario lo prefiere
              setSelectedMethod("manual");
            }}
          />
        )}

        {selectedMethod === "catastro" && isReviewStep && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t("reviewImportedUnits")}
              </h1>
              <p className="text-gray-600">
                {t("loadedFromCatastro", { count: catastroUnits.length })}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("unit")}
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("floor")}
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("door")} / {t("identifier")}
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("useType")}
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("area")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {catastroUnits.map((unit, index) => (
                      <tr key={`${unit.identifier}-${index}`}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {unit.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {unit.floor ?? "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {unit.identifier}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {unit.useType ?? "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {unit.areaM2 != null ? `${unit.areaM2} m²` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <button
                type="button"
                onClick={handleDiscardCatastroImport}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
              >
                {t("discardImport")}
              </button>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsReviewStep(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
                >
                  {t("backToSearch")}
                </button>
                <button
                  type="button"
                  onClick={handleStartManualFromCatastro}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
                >
                  {t("editUnitsAndContinue")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUnitWizard;

