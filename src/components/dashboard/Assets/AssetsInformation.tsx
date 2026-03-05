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
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  BuildingsApiService,
  getBuildingTypologyLabel,
  getBuildingStatusLabel,
  getBuildingStatusColor,
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
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="portfolio"
                  />
                  <EditableField
                    label="Número de Registro"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="registryNumber"
                  />
                </div>
              </div>

              {/* Dirección */}
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
                      value={getFieldValue("building.addressData.municipality")}
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

              {/* Tipo de Edificio */}
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
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
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
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="lastReformYear"
                  />
                </div>
              </div>

              {/* Características Físicas */}
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
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
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
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="usableArea"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <EditableField
                      label="Superficie Común (m²)"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="commonArea"
                    />
                    <EditableField
                      label="Habitaciones de Almacenamiento"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="storageRooms"
                    />
                  </div>
                  <EditableField
                    label="Ascensores"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="elevators"
                  />
                </div>
              </div>

              {/* Eficiencia Energética */}
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
                      value={certificate?.rating}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
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
                    value={getFieldValue("certificate.emissionsKgCo2PerM2Year")}
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

              {/* Gestión y Proveedores */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Building2 className=" w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">
                    Gestión y Proveedores
                  </h3>
                </div>
                <div className="space-y-2">
                  <EditableField
                    label="Gestor del Inmueble"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="propertyManager"
                  />
                  <EditableField
                    label="Empresa de Mantenimiento"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="maintenanceCompany"
                  />
                  <EditableField
                    label="Compañía de Seguros"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="insuranceCompany"
                  />
                  <EditableField
                    label="Número de Póliza"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
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
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="insuranceExpiry"
                  />
                </div>
              </div>

              {/* Instalaciones y Servicios */}
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
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="heating"
                  />
                  <EditableField
                    label="Aire Acondicionado"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="cooling"
                  />
                  <EditableField
                    label="Suministro de Agua"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="waterSupply"
                  />
                  <EditableField
                    label="Electricidad"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="electricity"
                  />
                  <EditableField
                    label="Internet"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="internet"
                  />
                  <EditableField
                    label="Seguridad"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="security"
                  />
                  <EditableField
                    label="Accesibilidad"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="accessibility"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-2">
              {/* Estrategia */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <FileText className=" w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">Estrategia</h3>
                </div>
                <div className="space-y-2">
                  <EditableField
                    label="Tipo de Estrategia"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
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

              {/* Ocupación */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Users className="w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">Ocupación</h3>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <EditableField
                      label="Unidades Ocupadas"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
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
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="vacantUnits"
                    />
                    <EditableField
                      label="Tasa de Ocupación"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="occupancyRate"
                    />
                  </div>
                </div>
              </div>

              {/* Información Financiera */}
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
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="ibiAmount"
                  />
                  <EditableField
                    label="Cuotas de Comunidad (€)"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                    htmlFor="communityFees"
                  />
                </div>
              </div>

              {/* Normativa y Certificaciones */}
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
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                  />
                  <EditableField
                    label="Accesibilidad"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                  />
                  <EditableField
                    label="Amianto"
                    value={null}
                    fieldKey=""
                    isEditing={false}
                    onChange={() => {}}
                    disabled={true}
                  />
                </div>
              </div>

              {/* Costes Operativos */}
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
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="waterCost"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <EditableField
                      label="Coste de Gas (€)"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="gasCost"
                    />
                    <EditableField
                      label="Coste de Limpieza (€)"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="cleaningCost"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <EditableField
                      label="Coste de Seguridad (€)"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
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
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="gardeningCost"
                    />
                    <EditableField
                      label="Coste de Residuos (€)"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="wasteCost"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <EditableField
                      label="Coste de Mantenimiento de Ascensores (€)"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="elevatorMaintenanceCost"
                    />
                    <EditableField
                      label="Coste de Mantenimiento de Sistema de Incendios (€)"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="fireSystemMaintenanceCost"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <EditableField
                      label="Coste de Mantenimiento de HVAC (€)"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
                      htmlFor="hvacMaintenanceCost"
                    />
                    <EditableField
                      label="Impuesto Predial (€)"
                      value={null}
                      fieldKey=""
                      isEditing={false}
                      onChange={() => {}}
                      disabled={true}
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

              {/* Notas Adicionales */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
