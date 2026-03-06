import {
  Building2,
  Euro,
  FileText,
  Hash,
  House,
  MapPin,
  Pen,
  Users,
  Zap,
  X,
  Save,
  Loader2,
  Search,
  Activity,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  BuildingsApiService,
  getBuildingTypologyLabel,
  getBuildingStatusLabel,
  type Building,
} from "../../../services/buildingsApi";
import {
  FinancialSnapshotsService,
  type FinancialSnapshot,
} from "../../../services/financialSnapshots";
import {
  EnergyCertificatesService,
  type PersistedEnergyCertificate,
} from "../../../services/energyCertificates";
import { EditableField } from "./EditableField";
import { useAssetEdit } from "../../../hooks/useAssetEdit";

export function AssetsInformation() {
  const { id } = useParams<{ id: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [snapshot, setSnapshot] = useState<FinancialSnapshot | null>(null);
  const [certificate, setCertificate] =
    useState<PersistedEnergyCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setBuilding(null);
    setSnapshot(null);
    setCertificate(null);

    try {
      const [buildingData, snapshots, energyData] = await Promise.all([
        BuildingsApiService.getBuildingById(id),
        FinancialSnapshotsService.getFinancialSnapshots(id),
        EnergyCertificatesService.getByBuilding(id),
      ]);

      setBuilding(buildingData);
      if (snapshots && snapshots.length > 0) {
        setSnapshot(snapshots[0]);
      }
      if (
        energyData &&
        energyData.certificates &&
        energyData.certificates.length > 0
      ) {
        setCertificate(energyData.certificates[0]);
      }
    } catch (error) {
      console.error("Error fetching building information:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    isEditing,
    saving,
    errors,
    startEditing,
    cancelEditing,
    handleFieldChange,
    getFieldValue,
    saveChanges,
  } = useAssetEdit(building, snapshot, certificate, fetchData);

  const [searchTerm, setSearchTerm] = useState("");

  const normalize = (s: string) =>
    s
      ? s
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";

  const isVisible = (sectionTitle: string, labels: string[]) => {
    if (!searchTerm) return true;
    const term = normalize(searchTerm);
    if (normalize(sectionTitle).includes(term)) return true;
    return labels.some((l) => normalize(l).includes(term));
  };

  const formatValue = (value: any, suffix: string = "") => {
    if (value === undefined || value === null || value === "" || value === 0)
      return "No hay información";
    return `${value}${suffix}`;
  };

  const formatCurrency = (value: any) => {
    if (value === undefined || value === null || value === "" || value === 0)
      return "No hay información";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col overflow-hidden animate-pulse">
        <div className="flex items-center justify-between bg-white border-b border-gray-200 p-5 flex-shrink-0">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-100 rounded"></div>
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 md:p-5 bg-gray-50">
          <div className="max-w-7xl space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4"
                  >
                    <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-gray-100 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-4"
                  >
                    <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-gray-100 rounded"></div>
                      <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 p-5 flex-shrink-0">
        <div>
          <h2 className="text-gray-900">Información del Activo</h2>
          <p className="text-sm text-gray-500">{formatValue(building?.name)}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#1e3a8a] transition-colors" />
            <input
              type="text"
              placeholder="Buscar campo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] w-[200px] sm:w-[300px] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all whitespace-nowrap disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all whitespace-nowrap disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          ) : (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <Pen className="w-4 h-4" />
              Editar Información
            </button>
          )}
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mx-5 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-700">
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5 bg-gray-50">
        <div className="max-w-7xl space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              {/* Identificadores */}
              {isVisible("Identificadores", [
                "ID Inmueble",
                "Referencia Catastral",
                "Cartera",
                "Número de Registro",
              ]) && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                    <Hash className="w-5 h-5 text-[#1e3a8a]" />
                    <h3 className="text-gray-900">Identificadores</h3>
                  </div>
                  <div className="space-y-2">
                    <EditableField
                      label="ID Inmueble"
                      value={building?.id}
                      fieldKey="building.id"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      disabled={true}
                      htmlFor="propertyId"
                    />
                    <EditableField
                      label="Referencia Catastral"
                      value={getFieldValue("building.cadastralReference")}
                      fieldKey="building.cadastralReference"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="cadastralRef"
                    />
                    <EditableField
                      label="Cartera"
                      value={getFieldValue("building.customData.cartera")}
                      fieldKey="building.customData.cartera"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="portfolio"
                    />
                    <EditableField
                      label="Número de Registro"
                      value={getFieldValue(
                        "building.customData.numero_registro",
                      )}
                      fieldKey="building.customData.numero_registro"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="registryNumber"
                    />
                  </div>
                </div>
              )}

              {/* Dirección */}
              {isVisible("Dirección", [
                "Dirección",
                "Ciudad",
                "Provincia",
                "Código Postal",
                "País",
                "Coordenadas",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <MapPin className=" w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">Dirección</h3>
                  </div>
                  <div className="space-y-2">
                    <EditableField
                      label="Dirección"
                      value={getFieldValue("building.address")}
                      fieldKey="building.address"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="address"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Ciudad"
                        value={getFieldValue(
                          "building.addressData.municipality",
                        )}
                        fieldKey="building.addressData.municipality"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="city"
                      />
                      <EditableField
                        label="Provincia"
                        value={getFieldValue("building.addressData.province")}
                        fieldKey="building.addressData.province"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="province"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Código Postal"
                        value={getFieldValue("building.addressData.postalCode")}
                        fieldKey="building.addressData.postalCode"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="postalCode"
                      />
                      <EditableField
                        label="País"
                        value={getFieldValue("building.addressData.country")}
                        fieldKey="building.addressData.country"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="country"
                      />
                    </div>
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-2">
                        <EditableField
                          label="Latitud"
                          value={getFieldValue("building.lat")}
                          fieldKey="building.lat"
                          type="number"
                          isEditing={isEditing}
                          onChange={handleFieldChange}
                          htmlFor="lat"
                        />
                        <EditableField
                          label="Longitud"
                          value={getFieldValue("building.lng")}
                          fieldKey="building.lng"
                          type="number"
                          isEditing={isEditing}
                          onChange={handleFieldChange}
                          htmlFor="lng"
                        />
                      </div>
                    ) : (
                      <div>
                        <label
                          data-slot="label"
                          className="flex items-center gap-2 font-medium select-none text-xs text-gray-600"
                          htmlFor="coordinates"
                        >
                          Coordenadas
                        </label>
                        <p className="text-xs text-gray-900 mt-1">
                          {building?.lat && building?.lng
                            ? `${building.lat}, ${building.lng}`
                            : "No hay información"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Datos Urbanísticos */}
              {isVisible("Datos Urbanísticos", [
                "Calificación",
                "Protección",
                "Ordenanza",
                "Edificabilidad",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <MapPin className=" w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">
                      Datos Urbanísticos
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Calificación"
                        value={getFieldValue(
                          "building.customData.calificacion",
                        )}
                        fieldKey="building.customData.calificacion"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                      <EditableField
                        label="Protección"
                        value={getFieldValue("building.customData.proteccion")}
                        fieldKey="building.customData.proteccion"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Ordenanza"
                        value={getFieldValue("building.customData.ordenanza")}
                        fieldKey="building.customData.ordenanza"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                      <EditableField
                        label="Edificabilidad"
                        value={getFieldValue(
                          "building.customData.edificabilidad",
                        )}
                        fieldKey="building.customData.edificabilidad"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={(v) => formatValue(v, " m²/m²")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tipo de Edificio */}
              {isVisible("Tipo de Edificio", [
                "Tipo Principal",
                "Sub-tipo",
                "Año de Construcción",
                "Unidades",
                "Año de Última Reforma",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <Building2 className=" w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">Tipo de Edificio</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Tipo Principal"
                        value={getFieldValue("building.typology")}
                        fieldKey="building.typology"
                        type="select"
                        options={[
                          { value: "residential", label: "Residencial" },
                          { value: "mixed", label: "Mixto" },
                          { value: "commercial", label: "Comercial" },
                        ]}
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={(v) =>
                          v ? getBuildingTypologyLabel(v) : "No hay información"
                        }
                        htmlFor="buildingType"
                      />
                      <EditableField
                        label="Sub-tipo"
                        value={getFieldValue("building.customData.sub_tipo")}
                        fieldKey="building.customData.sub_tipo"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="subType"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Año de Construcción"
                        value={getFieldValue("building.constructionYear")}
                        fieldKey="building.constructionYear"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="buildingYear"
                      />
                      <EditableField
                        label="Unidades"
                        value={getFieldValue("building.numUnits")}
                        fieldKey="building.numUnits"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="units"
                      />
                    </div>
                    <EditableField
                      label="Año de Última Reforma"
                      value={getFieldValue(
                        "building.customData.ano_ultima_reforma",
                      )}
                      fieldKey="building.customData.ano_ultima_reforma"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="lastReformYear"
                    />
                  </div>
                </div>
              )}

              {/* Características Físicas */}
              {isVisible("Características Físicas", [
                "Plantas",
                "Plazas de Parking",
                "Superficie Total",
                "Superficie Útil",
                "Superficie Común",
                "Habitaciones de Almacenamiento",
                "Ascensores",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <House className="w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">
                      Características Físicas
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Plantas"
                        value={getFieldValue("building.numFloors")}
                        fieldKey="building.numFloors"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="floors"
                      />
                      <EditableField
                        label="Plazas de Parking"
                        value={getFieldValue(
                          "building.customData.plazas_parking",
                        )}
                        fieldKey="building.customData.plazas_parking"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="parkingSpaces"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Superficie Total (m²)"
                        value={getFieldValue("building.squareMeters")}
                        fieldKey="building.squareMeters"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={(v) => formatValue(v, " m²")}
                        htmlFor="totalArea"
                      />
                      <EditableField
                        label="Superficie Útil (m²)"
                        value={getFieldValue(
                          "building.customData.superficie_util",
                        )}
                        fieldKey="building.customData.superficie_util"
                        type="number"
                        formatDisplay={(v) => formatValue(v, " m²")}
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="usableArea"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Superficie Común (m²)"
                        value={getFieldValue(
                          "building.customData.superficie_comun",
                        )}
                        fieldKey="building.customData.superficie_comun"
                        type="number"
                        formatDisplay={(v) => formatValue(v, " m²")}
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="commonArea"
                      />
                      <EditableField
                        label="Habitaciones de Almacenamiento"
                        value={getFieldValue(
                          "building.customData.habitaciones_almacenamiento",
                        )}
                        fieldKey="building.customData.habitaciones_almacenamiento"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="storageRooms"
                      />
                    </div>
                    <EditableField
                      label="Ascensores"
                      value={getFieldValue("building.customData.ascensores")}
                      fieldKey="building.customData.ascensores"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="elevators"
                    />
                  </div>
                </div>
              )}

              {/* Eficiencia Energética */}
              {isVisible("Eficiencia Energética", [
                "Clase Energética",
                "Clase CO₂",
                "Consumo Energético",
                "Emisiones",
                "Fecha Certificación",
                "Vencimiento",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <Zap className="w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">
                      Eficiencia Energética
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Clase Energética"
                        value={getFieldValue("certificate.rating")}
                        fieldKey="certificate.rating"
                        type="select"
                        options={[
                          { value: "A", label: "A" },
                          { value: "B", label: "B" },
                          { value: "C", label: "C" },
                          { value: "D", label: "D" },
                          { value: "E", label: "E" },
                          { value: "F", label: "F" },
                          { value: "G", label: "G" },
                          { value: "ND", label: "ND" },
                        ]}
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        disabled={!certificate}
                      />
                      <EditableField
                        label="Clase CO₂"
                        value={getFieldValue("building.customData.clase_co2")}
                        fieldKey="building.customData.clase_co2"
                        type="select"
                        options={[
                          { value: "A", label: "A" },
                          { value: "B", label: "B" },
                          { value: "C", label: "C" },
                          { value: "D", label: "D" },
                          { value: "E", label: "E" },
                          { value: "F", label: "F" },
                          { value: "G", label: "G" },
                          { value: "ND", label: "ND" },
                        ]}
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                    </div>
                    <EditableField
                      label="Consumo Energético"
                      value={getFieldValue(
                        "certificate.primaryEnergyKwhPerM2Year",
                      )}
                      fieldKey="certificate.primaryEnergyKwhPerM2Year"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={(v) => formatValue(v, " kWh/m²·año")}
                      disabled={!certificate}
                    />
                    <EditableField
                      label="Emisiones"
                      value={getFieldValue(
                        "certificate.emissionsKgCo2PerM2Year",
                      )}
                      fieldKey="certificate.emissionsKgCo2PerM2Year"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={(v) => formatValue(v, " kg CO2/m²·año")}
                      disabled={!certificate}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Fecha Certificación"
                        value={getFieldValue("certificate.issueDate")}
                        fieldKey="certificate.issueDate"
                        type="date"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        disabled={!certificate}
                      />
                      <EditableField
                        label="Vencimiento"
                        value={getFieldValue("certificate.expiryDate")}
                        fieldKey="certificate.expiryDate"
                        type="date"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        disabled={!certificate}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Diagnóstico y Eficiencia (LEE) */}
              {isVisible("Diagnóstico y Eficiencia (LEE)", [
                "Actuaciones Urgentes",
                "Coste Reparaciones Urgentes",
                "Emisiones (Adicional)",
                "Demanda Calefacción",
                "Demanda Refrigeración",
                "Coste Energético Actual",
                "Consumo Energía Primaria",
                "Envolvente Térmica",
                "Instalaciones",
              ]) && (
                <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-100">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h3 className="text-gray-900">
                      Diagnóstico y Eficiencia (LEE)
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <EditableField
                      label="Actuaciones Urgentes"
                      value={getFieldValue(
                        "building.customData.actuaciones_urgentes",
                      )}
                      fieldKey="building.customData.actuaciones_urgentes"
                      type="textarea"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Coste Reparaciones Urgentes (€)"
                        value={getFieldValue(
                          "building.customData.coste_reparaciones",
                        )}
                        fieldKey="building.customData.coste_reparaciones"
                        type="number"
                        suffix=" k€"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                      <EditableField
                        label="Emisiones (Adicional)"
                        value={getFieldValue("building.customData.emisiones")}
                        fieldKey="building.customData.emisiones"
                        type="number"
                        suffix=" kgCO2/m²·año"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Demanda Calefacción"
                        value={getFieldValue(
                          "building.customData.demandaCalefaccion",
                        )}
                        fieldKey="building.customData.demandaCalefaccion"
                        type="number"
                        suffix=" kWh/m²·año"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                      <EditableField
                        label="Demanda Refrigeración"
                        value={getFieldValue(
                          "building.customData.demandaRefrigeracion",
                        )}
                        fieldKey="building.customData.demandaRefrigeracion"
                        type="number"
                        suffix=" kWh/m²·año"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                    </div>
                    <EditableField
                      label="Consumo Energía Primaria"
                      value={getFieldValue(
                        "building.customData.consumoEnergia",
                      )}
                      fieldKey="building.customData.consumoEnergia"
                      type="number"
                      suffix=" kWh/m²·año"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                    />
                    <EditableField
                      label="Coste Energético Actual"
                      value={getFieldValue(
                        "building.customData.costeEnergetico",
                      )}
                      fieldKey="building.customData.costeEnergetico"
                      type="number"
                      suffix=" k€/año"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                    />
                    <EditableField
                      label="Envolvente Térmica"
                      value={getFieldValue("building.customData.envolvente")}
                      fieldKey="building.customData.envolvente"
                      type="textarea"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                    />
                    <EditableField
                      label="Instalaciones"
                      value={getFieldValue("building.customData.instalaciones")}
                      fieldKey="building.customData.instalaciones"
                      type="textarea"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              )}

              {/* Titularidad y Representación */}
              {isVisible("Titularidad y Representación", [
                "Régimen",
                "CIF",
                "Presidente",
                "Administrador",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <Users className=" w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">
                      Titularidad y Representación
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Régimen"
                        value={getFieldValue("building.customData.regimen")}
                        fieldKey="building.customData.regimen"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                      <EditableField
                        label="CIF"
                        value={getFieldValue("building.customData.cif")}
                        fieldKey="building.customData.cif"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Presidente"
                        value={getFieldValue("building.customData.presidente")}
                        fieldKey="building.customData.presidente"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                      />
                      <EditableField
                        label="Administrador"
                        value={getFieldValue(
                          "building.customData.administrador",
                        )}
                        fieldKey="building.customData.administrador"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="propertyManager"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Gestión y Proveedores */}
              {isVisible("Gestión y Proveedores", [
                "Empresa de Mantenimiento",
                "Compañía de Seguros",
                "Número de Póliza",
                "Prima de Seguro",
                "Fecha de Vencimiento de Seguro",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <Building2 className=" w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">
                      Gestión y Proveedores
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <EditableField
                      label="Empresa de Mantenimiento"
                      value={getFieldValue(
                        "building.customData.empresa_mantenimiento",
                      )}
                      fieldKey="building.customData.empresa_mantenimiento"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="maintenanceCompany"
                    />
                    <EditableField
                      label="Compañía de Seguros"
                      value={getFieldValue(
                        "building.customData.compania_seguros",
                      )}
                      fieldKey="building.customData.compania_seguros"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="insuranceCompany"
                    />
                    <EditableField
                      label="Número de Póliza"
                      value={getFieldValue("building.customData.numero_poliza")}
                      fieldKey="building.customData.numero_poliza"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="insurancePolicy"
                    />
                    <EditableField
                      label="Prima de Seguro (€)"
                      value={getFieldValue("snapshot.opex_seguros_anual_eur")}
                      fieldKey="snapshot.opex_seguros_anual_eur"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={formatCurrency}
                      htmlFor="insurancePremium"
                      disabled={!snapshot}
                    />
                    <EditableField
                      label="Fecha de Vencimiento de Seguro"
                      value={getFieldValue(
                        "building.customData.vencimiento_seguro",
                      )}
                      fieldKey="building.customData.vencimiento_seguro"
                      type="date"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="insuranceExpiry"
                    />
                  </div>
                </div>
              )}

              {/* Instalaciones y Servicios */}
              {isVisible("Instalaciones y Servicios", [
                "Calefacción",
                "Aire Acondicionado",
                "Suministro de Agua",
                "Electricidad",
                "Internet",
                "Seguridad",
                "Accesibilidad",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <Building2 className="w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">
                      Instalaciones y Servicios
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <EditableField
                      label="Calefacción"
                      value={getFieldValue("building.customData.calefaccion")}
                      fieldKey="building.customData.calefaccion"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="heating"
                    />
                    <EditableField
                      label="Aire Acondicionado"
                      value={getFieldValue(
                        "building.customData.aire_acondicionado",
                      )}
                      fieldKey="building.customData.aire_acondicionado"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="cooling"
                    />
                    <EditableField
                      label="Suministro de Agua"
                      value={getFieldValue(
                        "building.customData.suministro_agua",
                      )}
                      fieldKey="building.customData.suministro_agua"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="waterSupply"
                    />
                    <EditableField
                      label="Electricidad"
                      value={getFieldValue("building.customData.electricidad")}
                      fieldKey="building.customData.electricidad"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="electricity"
                    />
                    <EditableField
                      label="Internet"
                      value={getFieldValue("building.customData.internet")}
                      fieldKey="building.customData.internet"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="internet"
                    />
                    <EditableField
                      label="Seguridad"
                      value={getFieldValue("building.customData.seguridad")}
                      fieldKey="building.customData.seguridad"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="security"
                    />
                    <EditableField
                      label="Accesibilidad"
                      value={getFieldValue("building.customData.accesibilidad")}
                      fieldKey="building.customData.accesibilidad"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="accessibility"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-2">
              {/* Estrategia */}
              {isVisible("Estrategia", [
                "Tipo de Estrategia",
                "Estado",
                "Fecha de Adquisición",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <FileText className=" w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">Estrategia</h3>
                  </div>
                  <div className="space-y-2">
                    <EditableField
                      label="Tipo de Estrategia"
                      value={getFieldValue(
                        "building.customData.tipo_estrategia",
                      )}
                      fieldKey="building.customData.tipo_estrategia"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      htmlFor="strategy"
                    />
                    {/* Estado — special rendering */}
                    <EditableField
                      label="Estado"
                      value={getFieldValue("building.status")}
                      fieldKey="building.status"
                      type="select"
                      options={[
                        { value: "draft", label: "Borrador" },
                        { value: "ready_book", label: "Listo para libro" },
                        { value: "with_book", label: "Con libro" },
                      ]}
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={(v) => {
                        if (!v) return "No hay información";
                        return getBuildingStatusLabel(v);
                      }}
                      htmlFor="strategyStatus"
                    />
                    <EditableField
                      label="Fecha de Adquisición"
                      value={building?.createdAt?.split("T")[0]}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="acquisitionDate"
                    />
                  </div>
                </div>
              )}

              {/* Ocupación */}
              {isVisible("Ocupación", [
                "Unidades Ocupadas",
                "Total Unidades",
                "Tasa de Ocupación",
                "Unidades Vacantes",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <Users className="w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">Ocupación</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Unidades Ocupadas"
                        value={getFieldValue(
                          "building.customData.unidades_ocupadas",
                        )}
                        fieldKey="building.customData.unidades_ocupadas"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="occupiedUnits"
                      />
                      <EditableField
                        label="Total Unidades"
                        value={building?.numUnits}
                        fieldKey=""
                        isEditing={false}
                        onChange={() => {}}
                        disabled={true}
                        htmlFor="totalUnits"
                      />
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none text-xs text-gray-600"
                      >
                        Tasa de Ocupación
                      </label>
                      <div className="mt-1.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-900">
                            No hay información
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: "0%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Unidades Vacantes"
                        value={getFieldValue(
                          "building.customData.unidades_vacantes",
                        )}
                        fieldKey="building.customData.unidades_vacantes"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="vacantUnits"
                      />
                      <EditableField
                        label="Tasa de Ocupación"
                        value={getFieldValue(
                          "building.customData.tasa_ocupacion",
                        )}
                        fieldKey="building.customData.tasa_ocupacion"
                        type="number"
                        formatDisplay={(v) => formatValue(v, "%")}
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        htmlFor="occupancyRate"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Información Financiera */}
              {isVisible("Información Financiera", [
                "Precio de Compra",
                "Valor Actual",
                "Renta Anual",
                "Renta Mensual",
                "IBI",
                "Cuotas de Comunidad",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <Euro className="w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">
                      Información Financiera
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <EditableField
                      label="Precio de Compra (€)"
                      value={getFieldValue("building.price")}
                      fieldKey="building.price"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={formatCurrency}
                      htmlFor="purchasePrice"
                    />
                    <EditableField
                      label="Valor Actual (€)"
                      value={getFieldValue("building.potentialValue")}
                      fieldKey="building.potentialValue"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={formatCurrency}
                      htmlFor="currentValue"
                    />
                    <EditableField
                      label="Renta Anual (€)"
                      value={getFieldValue(
                        "snapshot.ingresos_brutos_anuales_eur",
                      )}
                      fieldKey="snapshot.ingresos_brutos_anuales_eur"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={formatCurrency}
                      htmlFor="annualRent"
                      disabled={!snapshot}
                    />
                    <EditableField
                      label="Renta Mensual (€)"
                      value={
                        snapshot?.ingresos_brutos_anuales_eur
                          ? snapshot.ingresos_brutos_anuales_eur / 12
                          : null
                      }
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      formatDisplay={formatCurrency}
                      htmlFor="monthlyRent"
                    />
                    <EditableField
                      label="IBI (€)"
                      value={getFieldValue("building.customData.ibi_eur")}
                      fieldKey="building.customData.ibi_eur"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={formatCurrency}
                      htmlFor="ibiAmount"
                    />
                    <EditableField
                      label="Cuotas de Comunidad (€)"
                      value={getFieldValue(
                        "building.customData.cuotas_comunidad_eur",
                      )}
                      fieldKey="building.customData.cuotas_comunidad_eur"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={formatCurrency}
                      htmlFor="communityFees"
                    />
                  </div>
                </div>
              )}

              {/* Normativa y Certificaciones */}
              {isVisible("Normativa y Certificaciones", [
                "Certificado Energético",
                "Seguridad contra Incendios",
                "Accesibilidad",
                "Amianto",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <Building2 className="w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">
                      Normativa y Certificaciones
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <EditableField
                      label="Certificado Energético"
                      value={certificate ? "Sí" : "No"}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                    />
                    <EditableField
                      label="Seguridad contra Incendios"
                      value={getFieldValue(
                        "building.customData.seguridad_incendios",
                      )}
                      fieldKey="building.customData.seguridad_incendios"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                    />
                    <EditableField
                      label="Accesibilidad"
                      value={getFieldValue(
                        "building.customData.accesibilidad_normativa",
                      )}
                      fieldKey="building.customData.accesibilidad_normativa"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                    />
                    <EditableField
                      label="Amianto"
                      value={getFieldValue("building.customData.amianto")}
                      fieldKey="building.customData.amianto"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              )}

              {/* Costes Operativos */}
              {isVisible("Costes Operativos", [
                "Coste de Electricidad",
                "Coste de Agua",
                "Coste de Gas",
                "Coste de Limpieza",
                "Coste de Seguridad",
                "Coste de Mantenimiento",
                "Coste de Jardinería",
                "Coste de Residuos",
                "Coste de Mantenimiento de Ascensores",
                "Coste de Mantenimiento de Sistema de Incendios",
                "Coste de Mantenimiento de HVAC",
                "Impuesto Predial",
                "Otros Costes",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <Euro className="w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">Costes Operativos</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Coste de Electricidad (€)"
                        value={getFieldValue("snapshot.opex_energia_anual_eur")}
                        fieldKey="snapshot.opex_energia_anual_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="electricityCost"
                        disabled={!snapshot}
                      />
                      <EditableField
                        label="Coste de Agua (€)"
                        value={getFieldValue(
                          "building.customData.coste_agua_eur",
                        )}
                        fieldKey="building.customData.coste_agua_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="waterCost"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Coste de Gas (€)"
                        value={getFieldValue(
                          "building.customData.coste_gas_eur",
                        )}
                        fieldKey="building.customData.coste_gas_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="gasCost"
                      />
                      <EditableField
                        label="Coste de Limpieza (€)"
                        value={getFieldValue(
                          "building.customData.coste_limpieza_eur",
                        )}
                        fieldKey="building.customData.coste_limpieza_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="cleaningCost"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Coste de Seguridad (€)"
                        value={getFieldValue(
                          "building.customData.coste_seguridad_eur",
                        )}
                        fieldKey="building.customData.coste_seguridad_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="securityCost"
                      />
                      <EditableField
                        label="Coste de Mantenimiento (€)"
                        value={getFieldValue(
                          "snapshot.opex_mantenimiento_anual_eur",
                        )}
                        fieldKey="snapshot.opex_mantenimiento_anual_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="maintenanceCost"
                        disabled={!snapshot}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Coste de Jardinería (€)"
                        value={getFieldValue(
                          "building.customData.coste_jardineria_eur",
                        )}
                        fieldKey="building.customData.coste_jardineria_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="gardeningCost"
                      />
                      <EditableField
                        label="Coste de Residuos (€)"
                        value={getFieldValue(
                          "building.customData.coste_residuos_eur",
                        )}
                        fieldKey="building.customData.coste_residuos_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="wasteCost"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Coste de Mantenimiento de Ascensores (€)"
                        value={getFieldValue(
                          "building.customData.coste_mantenimiento_ascensores_eur",
                        )}
                        fieldKey="building.customData.coste_mantenimiento_ascensores_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="elevatorMaintenanceCost"
                      />
                      <EditableField
                        label="Coste de Mantenimiento de Sistema de Incendios (€)"
                        value={getFieldValue(
                          "building.customData.coste_mantenimiento_incendios_eur",
                        )}
                        fieldKey="building.customData.coste_mantenimiento_incendios_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="fireSystemMaintenanceCost"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <EditableField
                        label="Coste de Mantenimiento de HVAC (€)"
                        value={getFieldValue(
                          "building.customData.coste_mantenimiento_hvac_eur",
                        )}
                        fieldKey="building.customData.coste_mantenimiento_hvac_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="hvacMaintenanceCost"
                      />
                      <EditableField
                        label="Impuesto Predial (€)"
                        value={getFieldValue(
                          "building.customData.impuesto_predial_eur",
                        )}
                        fieldKey="building.customData.impuesto_predial_eur"
                        type="number"
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                        formatDisplay={formatCurrency}
                        htmlFor="propertyTax"
                      />
                    </div>
                    <EditableField
                      label="Otros Costes (€)"
                      value={getFieldValue("snapshot.opex_otros_anual_eur")}
                      fieldKey="snapshot.opex_otros_anual_eur"
                      type="number"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
                      formatDisplay={formatCurrency}
                      htmlFor="otherCosts"
                      disabled={!snapshot}
                    />
                  </div>
                </div>
              )}

              {/* Notas Adicionales */}
              {isVisible("Notas Adicionales", [
                "Notas",
                "Notas Adicionales",
              ]) && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                    <FileText className="w-4 h-4 text-[#1e3a8a]" />
                    <h3 className="text-sm text-gray-900">Notas Adicionales</h3>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700">
                      {formatValue(snapshot?.meta?.notas, "") ===
                      "No hay información"
                        ? "No hay notas adicionales"
                        : snapshot?.meta?.notas}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
