import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { House, User, MapPin, Calendar, Search, SlidersHorizontal, Eye, Plus, X, ArrowUp, ArrowDown, ArrowUpDown, Building2, FilterX, AlertTriangle } from "lucide-react";

import { BuildingsApiService, type Building } from "../services/buildingsApi";
import { UnitsApiService } from "../services/unitsApi";
import { useToast } from "../contexts/ToastContext";
import { SkeletonText, SkeletonUnitsTable } from "./ui/LoadingSystem";
import { Badge } from "./ui/badge";

interface Unit {
  id: string;
  name: string;
  description: string;
  type: string;
  area: number;
  tenant: string | null;
  monthlyRent: number | null;
  status: "occupied" | "available" | "maintenance";
  expirationDate: string | null;
  expiresSoon?: boolean;
}

interface BuildingUnitFromApi {
  id: string;
  buildingId: string;
  name: string | null;
  identifier?: string | null;
  floor?: string | null;
  areaM2?: number | null;
  useType?: string | null;
  status?: string | null;
  rent?: number | null;
  tenant?: string | null;
  rooms?: number | null;
  baths?: number | null;
  rawData?: any;
  createdAt?: string;
  updatedAt?: string;
}

export default function BuildingUnits() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();
  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Unit["status"][]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [sortField, setSortField] = useState<"name" | "type" | "area" | "tenant" | "rent" | "status" | "expiration" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mapear BuildingUnit del backend a Unit del frontend
  const mapApiUnitToUnit = (apiUnit: BuildingUnitFromApi): Unit => {
    // Mapear status del backend al formato del frontend
    let status: "occupied" | "available" | "maintenance" = "available";
    if (apiUnit.status) {
      const statusLower = apiUnit.status.toLowerCase();
      if (statusLower === "ocupada" || statusLower === "occupied") {
        status = "occupied";
      } else if (statusLower === "mantenimiento" || statusLower === "maintenance") {
        status = "maintenance";
      }
    }

    // Construir descripción desde floor y identifier
    const descriptionParts: string[] = [];
    if (apiUnit.floor) descriptionParts.push(`Planta ${apiUnit.floor}`);
    if (apiUnit.identifier) descriptionParts.push(apiUnit.identifier);
    const description = descriptionParts.join(" - ") || "";

    return {
      id: apiUnit.id,
      name: apiUnit.name || apiUnit.identifier || "Sin nombre",
      description,
      type: apiUnit.useType || "N/A",
      area: apiUnit.areaM2 || 0,
      tenant: apiUnit.tenant || null,
      monthlyRent: apiUnit.rent || null,
      status,
      expirationDate: null, // El backend no tiene este campo por ahora
      expiresSoon: false,
    };
  };

  useEffect(() => {
    const loadBuilding = async () => {
      if (!id) return;
      try {
        const data = await BuildingsApiService.getBuildingById(id);
        setBuilding(data);
      } catch {
        setBuilding(null);
      } finally {
        setLoading(false);
      }
    };

    loadBuilding();
  }, [id]);

  useEffect(() => {
    const loadUnits = async () => {
      if (!id) return;
      setUnitsLoading(true);
      try {
        const apiUnits = (await UnitsApiService.listUnits(id)) || [];
        const mappedUnits = apiUnits.map(mapApiUnitToUnit);
        setUnits(mappedUnits);
      } catch (error) {
        console.error("Error cargando unidades:", error);
        setUnits([]);
      } finally {
        setUnitsLoading(false);
      }
    };

    loadUnits();
  }, [id, location.key]); // Recargar cuando cambia la ruta (incluyendo navegación de vuelta)

  // Obtener tipos únicos de unidades para el filtro
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    units.forEach((unit) => {
      if (unit.type && unit.type !== "N/A") {
        types.add(unit.type);
      }
    });
    return Array.from(types).sort();
  }, [units]);

  // Filtrar y ordenar unidades según búsqueda, filtros y ordenamiento
  const filteredUnits = useMemo(() => {
    let result = units;

    // Aplicar búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter((unit) => {
        const nameMatch = unit.name.toLowerCase().includes(searchLower);
        const descriptionMatch = unit.description.toLowerCase().includes(searchLower);
        const tenantMatch = unit.tenant?.toLowerCase().includes(searchLower) || false;
        return nameMatch || descriptionMatch || tenantMatch;
      });
    }

    // Aplicar filtro de estado
    if (statusFilter.length > 0) {
      result = result.filter((unit) => statusFilter.includes(unit.status));
    }

    // Aplicar filtro de tipo
    if (typeFilter.length > 0) {
      result = result.filter((unit) => typeFilter.includes(unit.type));
    }

    // Aplicar ordenamiento
    if (sortField) {
      result = [...result].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "type":
            aValue = a.type.toLowerCase();
            bValue = b.type.toLowerCase();
            break;
          case "area":
            aValue = a.area;
            bValue = b.area;
            break;
          case "tenant":
            aValue = a.tenant?.toLowerCase() || "";
            bValue = b.tenant?.toLowerCase() || "";
            break;
          case "rent":
            aValue = a.monthlyRent ?? 0;
            bValue = b.monthlyRent ?? 0;
            break;
          case "status":
            // Ordenar por estado: occupied > maintenance > available
            const statusOrder = { occupied: 0, maintenance: 1, available: 2 };
            aValue = statusOrder[a.status];
            bValue = statusOrder[b.status];
            break;
          case "expiration":
            aValue = a.expirationDate ? new Date(a.expirationDate).getTime() : 0;
            bValue = b.expirationDate ? new Date(b.expirationDate).getTime() : 0;
            break;
          default:
            return 0;
        }

        // Comparación
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [units, searchTerm, statusFilter, typeFilter, sortField, sortOrder]);

  // Valores calculados para las estadísticas (usando todas las unidades, no las filtradas)
  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.status === "occupied").length;
  const availableUnits = units.filter((u) => u.status === "available").length;
  const maintenanceUnits = units.filter((u) => u.status === "maintenance").length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const totalMonthlyIncome = units
    .filter((u) => u.monthlyRent !== null)
    .reduce((sum, u) => sum + (u.monthlyRent || 0), 0);

  // Contar filtros activos
  const activeFiltersCount = statusFilter.length + typeFilter.length;

  // Handlers para filtros
  const handleStatusFilterToggle = (status: Unit["status"]) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleTypeFilterToggle = (type: string) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setStatusFilter([]);
    setTypeFilter([]);
    setSearchTerm("");
    setSortField(null);
    setSortOrder("asc");
  };

  const handleRequestDeleteUnit = (unit: Unit) => {
    setUnitToDelete(unit);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteUnit = async () => {
    if (!id || !unitToDelete) return;

    setIsDeleting(unitToDelete.id);
    try {
      await UnitsApiService.deleteUnit(id, unitToDelete.id);
      setUnits((prev) => prev.filter((u) => u.id !== unitToDelete.id));
      setIsDeleteModalOpen(false);
      setUnitToDelete(null);
      showSuccess("Unidad eliminada", "La unidad se ha eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando unidad:", error);
      showError("Error al eliminar", "No se pudo eliminar la unidad. Inténtalo de nuevo.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancelDeleteUnit = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setUnitToDelete(null);
  };

  // Handler para cambiar ordenamiento
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      // Si ya está ordenando por este campo, cambiar dirección
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Si es un campo nuevo, ordenar ascendente
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Función para obtener el icono de ordenamiento
  const getSortIcon = (field: typeof sortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
    );
  };

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header con estadísticas */}
      <div className="bg-white rounded-xl p-3 md:p-4 lg:p-6 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
              <House className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div>
          {loading ? (
            <>
                  <SkeletonText lines={1} widths={["w-48"]} className="mb-1" />
                  <SkeletonText lines={1} widths={["w-32"]} />
            </>
          ) : (
            <>
                  <h2 className="text-gray-900 mb-1 text-base md:text-lg lg:text-xl">
                    <span className="hidden sm:inline">Unidades de </span>
                    {building?.name || "Plaza Shopping"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    <span className="hidden sm:inline">Gestión completa de las </span>
                    {totalUnits} unidades
                    <span className="hidden sm:inline"> del edificio</span>
                  </p>
            </>
          )}
            </div>
          </div>
        </div>

        {/* Grid de estadísticas */}
        {loading || unitsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
              {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <SkeletonText lines={1} widths={["w-20"]} className="mb-2" />
                <SkeletonText lines={1} widths={["w-12"]} className="mb-1" />
                <SkeletonText lines={1} widths={["w-16"]} />
                </div>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
            {/* Total Unidades */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">Total Unidades</p>
                <House className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl text-blue-600 mb-1">{totalUnits}</p>
            </div>

            {/* Ocupadas */}
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">Ocupadas</p>
                <User className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl text-green-600 mb-1">{occupiedUnits}</p>
                <p className="text-xs text-gray-500">
                {occupancyRate}% ocupación
                </p>
              </div>

            {/* Disponibles */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">Disponibles</p>
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl text-blue-600 mb-1">{availableUnits}</p>
            </div>

            {/* En Mantenimiento */}
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">En Mantenimiento</p>
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl text-orange-600 mb-1">
                {maintenanceUnits}
              </p>
            </div>
            </div>
          )}
      </div>

      {/* Sección de búsqueda y filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número, nombre o inquilino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 placeholder:text-gray-400 transition-colors outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex-1 sm:flex-none ${
                activeFiltersCount > 0 ? "bg-blue-50 border-blue-300 text-blue-700" : ""
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex-1 sm:flex-none"
              onClick={() => {
                if (id) {
                  navigate(`/building/${id}/unidades/create`);
                }
              }}
            >
              <Plus className="w-4 h-4" />
              Crear Unidad
            </button>
                    </div>
                  </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="pt-4 mt-4 border-t border-gray-200 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Filtro por estado */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  Estado
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "occupied" as const, label: "Ocupado" },
                    { value: "available" as const, label: "Disponible" },
                    { value: "maintenance" as const, label: "En Mantenimiento" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusFilterToggle(status.value)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        statusFilter.includes(status.value)
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por tipo */}
              {uniqueTypes.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Tipo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeFilterToggle(type)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          typeFilter.includes(type)
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
                </div>

            {/* Botón limpiar filtros */}
            {(activeFiltersCount > 0 || searchTerm.trim()) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Limpiar filtros
                </button>
                  </div>
            )}
                  </div>
        )}
                  </div>

      {/* Tabla de unidades */}
      <div className="bg-white rounded-xl p-6 shadow-sm flex-1 overflow-hidden">
        {unitsLoading ? (
          <SkeletonUnitsTable rows={5} />
        ) : (
          <>
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    {/* Unidad */}
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span>Unidad</span>
                        <button
                          onClick={() => handleSort("name")}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Ordenar por nombre"
                        >
                          {getSortIcon("name")}
                        </button>
                      </div>
                    </th>
                    {/* Tipo */}
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span>Tipo</span>
                        <button
                          onClick={() => handleSort("type")}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Ordenar por tipo"
                        >
                          {getSortIcon("type")}
                        </button>
                      </div>
                    </th>
                    {/* Superficie */}
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span>Superficie</span>
                        <button
                          onClick={() => handleSort("area")}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Ordenar por superficie"
                        >
                          {getSortIcon("area")}
                        </button>
                      </div>
                    </th>
                    {/* Inquilino */}
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span>Inquilino</span>
                        <button
                          onClick={() => handleSort("tenant")}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Ordenar por inquilino"
                        >
                          {getSortIcon("tenant")}
                        </button>
                      </div>
                    </th>
                    {/* Renta */}
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span>Renta</span>
                        <button
                          onClick={() => handleSort("rent")}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Ordenar por renta"
                        >
                          {getSortIcon("rent")}
                        </button>
                      </div>
                    </th>
                    {/* Estado */}
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span>Estado</span>
                        <button
                          onClick={() => handleSort("status")}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Ordenar por estado"
                        >
                          {getSortIcon("status")}
                        </button>
                      </div>
                    </th>
                    {/* Vencimiento */}
                    <th className="text-left py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span>Vencimiento</span>
                        <button
                          onClick={() => handleSort("expiration")}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors opacity-60 hover:opacity-100"
                          title="Ordenar por vencimiento"
                        >
                          {getSortIcon("expiration")}
                        </button>
                      </div>
                    </th>
                    {/* Acciones */}
                    <th className="text-right py-3 px-4 text-sm text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12">
                        {units.length === 0 ? (
                          // Estado vacío cuando no hay unidades
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No hay unidades disponibles
                            </h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-md text-center">
                              Comienza creando tu primera unidad para gestionar todas las unidades del edificio de forma organizada.
                            </p>
                            <button
                              onClick={() => {
                                if (id) {
                                  navigate(`/building/${id}/unidades/create`);
                                }
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                            >
                              <Plus className="w-4 h-4" />
                              Crear Primera Unidad
                            </button>
                          </div>
                        ) : (
                          // Estado vacío cuando hay filtros aplicados
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <FilterX className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No se encontraron unidades
                            </h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-md text-center">
                              No hay unidades que coincidan con los filtros aplicados. Intenta ajustar los filtros o la búsqueda.
                            </p>
                            <button
                              onClick={handleClearFilters}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
                            >
                              <X className="w-4 h-4" />
                              Limpiar Filtros
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredUnits.map((unit) => (
                      <tr
                        key={unit.id}
                        className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm text-gray-900">{unit.name}</p>
                            <p className="text-xs text-gray-500">{unit.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{unit.type}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{unit.area} m²</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {unit.tenant || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {unit.monthlyRent ? `${unit.monthlyRent.toLocaleString()}€/mes` : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              unit.status === "occupied"
                                ? "bg-green-100 text-green-700 hover:bg-green-100 border-transparent"
                                : unit.status === "available"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent"
                                : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-transparent"
                            }
                          >
                            {unit.status === "occupied"
                              ? "Ocupado"
                              : unit.status === "available"
                              ? "Disponible"
                              : "En Mantenimiento"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {unit.expirationDate ? (
                              <>
                                <span
                                  className={`text-sm ${
                                    unit.expiresSoon ? "text-orange-600" : "text-gray-600"
                                  }`}
                                >
                                  {unit.expirationDate}
                                </span>
                                {unit.expiresSoon && (
                                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-transparent text-xs">
                                    Expira pronto
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Implementar navegación/edición de unidad
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Ver
                            </button>
                            <button
                              className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRequestDeleteUnit(unit);
                              }}
                              disabled={isDeleting === unit.id}
                            >
                              {isDeleting === unit.id ? (
                                <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <X className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredUnits.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                <span>
                  Mostrando {filteredUnits.length} de {totalUnits} unidades
                  {(activeFiltersCount > 0 || searchTerm.trim()) && (
                    <span className="text-gray-400 ml-1">
                      (filtradas)
                    </span>
                  )}
                </span>
                <span>
                  Ingresos totales:{" "}
                  <strong className="text-gray-900">
                    {totalMonthlyIncome.toLocaleString()}€/mes
                  </strong>
                </span>
              </div>
            )}
          </>
        )}
        </div>

      {/* Modal de confirmación de eliminación de unidad */}
      {isDeleteModalOpen && unitToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleCancelDeleteUnit}
            onKeyDown={(e) => e.key === "Escape" && handleCancelDeleteUnit()}
            role="button"
            tabIndex={0}
            aria-label="Cerrar modal"
          />
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirmar eliminación
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  ¿Estás seguro de que deseas eliminar la unidad{" "}
                  <span className="font-semibold">{unitToDelete.name}</span>? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancelDeleteUnit}
                    disabled={Boolean(isDeleting)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDeleteUnit}
                    disabled={Boolean(isDeleting)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Eliminando...</span>
                      </>
                    ) : (
                      <span>Eliminar unidad</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
