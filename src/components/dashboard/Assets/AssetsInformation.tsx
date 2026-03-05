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
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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

export function AssetsInformation() {
  const { id } = useParams<{ id: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [snapshot, setSnapshot] = useState<FinancialSnapshot | null>(null);
  const [certificate, setCertificate] =
    useState<PersistedEnergyCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setBuilding(null);
    setSnapshot(null);
    setCertificate(null);

    const fetchData = async () => {
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
    };

    fetchData();
  }, [id]);

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
      <div className="flex items-center justify-between bg-white border-b border-gray-200 p-5 flex-shrink-0">
        <div>
          <h2 className="text-gray-900">Información del Activo</h2>
          <p className="text-sm text-gray-500">{formatValue(building?.name)}</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all whitespace-nowrap">
          <Pen className="w-4 h-4" />
          Editar Información
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 md:p-5 bg-gray-50">
        <div className="max-w-7xl space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                  <Hash className="w-5 h-5 text-[#1e3a8a]" />
                  <h3 className="text-gray-900">Identificadores</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="propertyId"
                    >
                      ID Inmueble
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatValue(building?.id)}
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="cadastralRef"
                    >
                      Referencia Catastral
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatValue(building?.cadastralReference)}
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="portfolio"
                    >
                      Cartera
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="registryNumber"
                    >
                      Número de Registro
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <MapPin className=" w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">Dirección</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="address"
                    >
                      Dirección
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatValue(building?.address)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="city"
                      >
                        Ciudad
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(building?.addressData?.municipality)}
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="province"
                      >
                        Provincia
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(building?.addressData?.province)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="postalCode"
                      >
                        Código Postal
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(building?.addressData?.postalCode)}
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="country"
                      >
                        País
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(building?.addressData?.country)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
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
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Building2 className=" w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">Tipo de Edificio</h3>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="buildingType"
                      >
                        Tipo Principal
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {building?.typology
                          ? getBuildingTypologyLabel(building.typology)
                          : "No hay información"}
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="subType"
                      >
                        Sub-tipo
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="buildingYear"
                      >
                        Año de Construcción
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(building?.constructionYear)}
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="units"
                      >
                        Unidades
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(building?.numUnits)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="lastReformYear"
                    >
                      Año de Última Reforma
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <House className="w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">
                    Características Físicas
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="floors"
                      >
                        Plantas
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(building?.numFloors)}
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="parkingSpaces"
                      >
                        Plazas de Parking
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="totalArea"
                      >
                        Superficie Total (m²)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(building?.squareMeters, " m²")}
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="usableArea"
                      >
                        Superficie Útil (m²)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="commonArea"
                      >
                        Superficie Común (m²)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="storageRooms"
                      >
                        Habitaciones de Almacenamiento
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="elevators"
                    >
                      Ascensores
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Zap className="w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">
                    Eficiencia Energética
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      >
                        Clase Energética
                      </label>
                      <p className="text-xs text-gray-900 mt-1 font-medium">
                        {formatValue(certificate?.rating)}
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      >
                        Clase CO₂
                      </label>
                      <p className="text-xs text-gray-900 mt-1 font-medium">
                        {formatValue(certificate?.rating)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                    >
                      Consumo Energético
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatValue(
                        certificate?.primaryEnergyKwhPerM2Year,
                        " kWh/m²·año",
                      )}
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                    >
                      Emisiones
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatValue(
                        certificate?.emissionsKgCo2PerM2Year,
                        " kg CO2/m²·año",
                      )}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      >
                        Fecha Certificación
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(certificate?.issueDate)}
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      >
                        Vencimiento
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(certificate?.expiryDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Building2 className=" w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">
                    Gestión y Proveedores
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="propertyManager"
                    >
                      Gestor del Inmueble
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="maintenanceCompany"
                    >
                      Empresa de Mantenimiento
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="insuranceCompany"
                    >
                      Compañía de Seguros
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="insurancePolicy"
                    >
                      Número de Póliza
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="insurancePremium"
                    >
                      Prima de Seguro (€)
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatCurrency(snapshot?.opex_seguros_anual_eur)}
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="insuranceExpiry"
                    >
                      Fecha de Vencimiento de Seguro
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Building2 className="w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">
                    Instalaciones y Servicios
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="heating"
                    >
                      Calefacción
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="cooling"
                    >
                      Aire Acondicionado
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="waterSupply"
                    >
                      Suministro de Agua
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="electricity"
                    >
                      Electricidad
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="internet"
                    >
                      Internet
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="security"
                    >
                      Seguridad
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="accessibility"
                    >
                      Accesibilidad
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <FileText className=" w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">Estrategia</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="strategy"
                    >
                      Tipo de Estrategia
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="strategyStatus"
                    >
                      Estado
                    </label>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs mt-1 ${
                        building?.status
                          ? getBuildingStatusColor(building.status)
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {building?.status
                        ? getBuildingStatusLabel(building.status)
                        : "No hay información"}
                    </span>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="acquisitionDate"
                    >
                      Fecha de Adquisición
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatValue(building?.createdAt?.split("T")[0])}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Users className="w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">Ocupación</h3>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="occupiedUnits"
                      >
                        Unidades Ocupadas
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="totalUnits"
                      >
                        Total Unidades
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatValue(building?.numUnits)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
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
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="vacantUnits"
                      >
                        Unidades Vacantes
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="occupancyRate"
                      >
                        Tasa de Ocupación
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Euro className="w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">
                    Información Financiera
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="purchasePrice"
                    >
                      Precio de Compra (€)
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatCurrency(building?.price)}
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="currentValue"
                    >
                      Valor Actual (€)
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatCurrency(building?.potentialValue)}
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="annualRent"
                    >
                      Renta Anual (€)
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatCurrency(snapshot?.ingresos_brutos_anuales_eur)}
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="monthlyRent"
                    >
                      Renta Mensual (€)
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {snapshot?.ingresos_brutos_anuales_eur
                        ? formatCurrency(
                            snapshot.ingresos_brutos_anuales_eur / 12,
                          )
                        : "No hay información"}
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="ibiAmount"
                    >
                      IBI (€)
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="communityFees"
                    >
                      Cuotas de Comunidad (€)
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Building2 className="w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">
                    Normativa y Certificaciones
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                    >
                      Certificado Energético
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {certificate ? "Sí" : "No"}
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                    >
                      Seguridad contra Incendios
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                    >
                      Accesibilidad
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                    >
                      Amianto
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      No hay información
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-200">
                  <Euro className="w-4 h-4 text-[#1e3a8a]" />
                  <h3 className="text-sm text-gray-900">Costes Operativos</h3>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="electricityCost"
                      >
                        Coste de Electricidad (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatCurrency(snapshot?.opex_energia_anual_eur)}
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="waterCost"
                      >
                        Coste de Agua (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="gasCost"
                      >
                        Coste de Gas (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="cleaningCost"
                      >
                        Coste de Limpieza (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="securityCost"
                      >
                        Coste de Seguridad (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="maintenanceCost"
                      >
                        Coste de Mantenimiento (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        {formatCurrency(snapshot?.opex_mantenimiento_anual_eur)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="gardeningCost"
                      >
                        Coste de Jardinería (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="wasteCost"
                      >
                        Coste de Residuos (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="elevatorMaintenanceCost"
                      >
                        Coste de Mantenimiento de Ascensores (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="fireSystemMaintenanceCost"
                      >
                        Coste de Mantenimiento de Sistema de Incendios (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="hvacMaintenanceCost"
                      >
                        Coste de Mantenimiento de HVAC (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                    <div>
                      <label
                        data-slot="label"
                        className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                        htmlFor="propertyTax"
                      >
                        Impuesto Predial (€)
                      </label>
                      <p className="text-xs text-gray-900 mt-1">
                        No hay información
                      </p>
                    </div>
                  </div>
                  <div>
                    <label
                      data-slot="label"
                      className="flex items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-xs text-gray-600"
                      htmlFor="otherCosts"
                    >
                      Otros Costes (€)
                    </label>
                    <p className="text-xs text-gray-900 mt-1">
                      {formatCurrency(snapshot?.opex_otros_anual_eur)}
                    </p>
                  </div>
                </div>
              </div>
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
