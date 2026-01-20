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

  const handleMethodSelect = (method: UnitCreationMethod) => {
    setSelectedMethod(method);
  };

  const handleCancel = () => {
    if (selectedMethod) {
      setSelectedMethod(null);
      setManualData([]);
    } else {
      // Si no hay método seleccionado, volver a la lista de unidades
      if (buildingId) {
        navigate(`/building/${buildingId}/unidades`);
      } else {
        navigate("/assets/units");
      }
    }
  };

  const handleManualNext = (data: UnitFormData[]) => {
    setManualData(data);
    // TODO: Implementar la lógica de guardado cuando esté disponible el servicio
    handleSubmitMultiple(data);
  };

  const handleCatastroUnitsCreated = async (units: any[]) => {
    if (!buildingId) {
      showError(t('units.errors.noBuilding', 'No se ha especificado el edificio'));
      return;
    }

    if (!units || units.length === 0) {
      showError(t('units.errors.noUnitsCreated', 'No se crearon unidades desde catastro'));
      return;
    }

    const unitCount = units.length;
    showSuccess(
      t('units.success.createdMultiple', `Se ${unitCount === 1 ? 'creó' : 'crearon'} ${unitCount} ${unitCount === 1 ? 'unidad' : 'unidades'} desde catastro exitosamente`)
    );
    
    // Volver a la lista de unidades
    navigate(`/building/${buildingId}/unidades`);
  };


  const handleSubmitMultiple = async (units: UnitFormData[]) => {
    if (!buildingId) {
      showError(t('units.errors.noBuilding', 'No se ha especificado el edificio'));
      return;
    }

    if (units.length === 0) {
      showError(t('units.errors.noUnits', 'No hay unidades para crear'));
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
              ? "ocupada"
              : unit.status === "maintenance"
              ? "mantenimiento"
              : unit.status === "available"
              ? null // El backend usa null para disponible
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
        t('units.success.createdMultiple', `Se ${unitCount === 1 ? 'creó' : 'crearon'} ${unitCount} ${unitCount === 1 ? 'unidad' : 'unidades'} exitosamente`)
      );
      
      // Volver a la lista de unidades
      navigate(`/building/${buildingId}/unidades`);
    } catch (error) {
      console.error('Error creando unidades:', error);
      showError(
        t('units.errors.createFailed', 'No se pudieron crear las unidades. Por favor, inténtalo de nuevo.')
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
        {selectedMethod === 'manual' ? (
          <CreateUnitManual
            onNext={handleManualNext}
            onCancel={handleCancel}
            initialData={manualData.length > 0 ? manualData : undefined}
          />
        ) : (
          <CreateUnitFromCatastro
            onUnitsCreated={handleCatastroUnitsCreated}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default CreateUnitWizard;

