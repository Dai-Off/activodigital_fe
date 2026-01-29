import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Building2, MapPin, Search, SlidersHorizontal, Users } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { BuildingsApiService, type Building } from "~/services/buildingsApi";
import { UnitsApiService, type BuildingUnit } from "~/services/unitsApi";
import { SkeletonUnitsTable } from "~/components/ui/LoadingSystem";

type StatusFilter = "ocupada" | "disponible" | "mantenimiento" | "all";

interface UnitWithBuilding extends BuildingUnit {
  buildingName?: string;
  buildingAddress?: string | null;
}

export function UnitsListDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [units, setUnits] = useState<UnitWithBuilding[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const buildingsData = await BuildingsApiService.getAllBuildings();
        console.log(
          "🔍 [UnitsListDashboard] Edificios cargados:",
          buildingsData.length,
          buildingsData.map((b) => ({ id: b.id, name: b.name }))
        );
        setBuildings(buildingsData);

        const unitsResults = await Promise.all(
          buildingsData.map(async (building) => {
            try {
              const buildingUnits =
                (await UnitsApiService.listUnits(building.id)) || [];
              console.log(
                "📦 [UnitsListDashboard] Unidades para edificio",
                building.id,
                building.name,
                "-",
                buildingUnits.length
              );
              return buildingUnits.map<UnitWithBuilding>((unit) => ({
                ...unit,
                buildingName: building.name,
                buildingAddress: building.address ?? null,
              }));
            } catch (error) {
              console.error(
                "❌ [UnitsListDashboard] Error cargando unidades para edificio",
                building.id,
                building.name,
                error
              );
              return [];
            }
          })
        );

        const flatUnits = unitsResults.flat();
        console.log(
          "✅ [UnitsListDashboard] Total unidades cargadas:",
          flatUnits.length
        );
        setUnits(flatUnits);
      } catch (error) {
        console.error("Error cargando listado global de unidades:", error);
        setBuildings([]);
        setUnits([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalUnits = units.length;
  const occupiedUnits = units.filter(
    (u) => (u.status || "").toLowerCase() === "ocupada"
  ).length;
  const availableUnits = units.filter(
    (u) => (u.status || "").toLowerCase() === "disponible"
  ).length;
  const maintenanceUnits = units.filter(
    (u) => (u.status || "").toLowerCase() === "mantenimiento"
  ).length;

  const filteredUnits = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return units.filter((unit) => {
      if (buildingFilter !== "all" && unit.buildingId !== buildingFilter) {
        return false;
      }

      if (statusFilter !== "all") {
        const unitStatus = (unit.status || "").toLowerCase();
        if (unitStatus !== statusFilter) {
          return false;
        }
      }

      if (!term) return true;

      const haystack = [
        unit.name,
        unit.identifier,
        unit.useType,
        unit.tenant,
        unit.buildingName,
        unit.floor,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [units, buildingFilter, statusFilter, searchTerm]);

  if (loading && buildings.length === 0) {
    return (
      <div className="h-full flex flex-col gap-3">
        <div className="bg-white rounded-xl p-3 md:p-4 lg:p-6 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg w-9 h-9 animate-pulse" />
            <div>
              <div className="h-5 w-48 bg-gray-200 rounded mb-1 animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="h-3 w-20 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-5 w-10 bg-gray-300 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm flex-1 flex items-center justify-center">
          <SkeletonUnitsTable rows={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header y filtros */}
      <div className="bg-white rounded-xl p-3 md:p-4 lg:p-6 shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl">
                {t("unitsglobalTitle", "Listado de unidades")}
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                {t(
                  "unitsglobalSubtitle",
                  "Todas las unidades de los edificios de tu portfolio"
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t(
                  "units.searchPlaceholder",
                  "Buscar por unidad, edificio, inquilino..."
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 border-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t("filters2", "Filtros")}</span>
            </button>
          </div>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-2">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600 mb-1">
              {t("units.totalUnits", "Total unidades")}
            </p>
            <p className="text-xl md:text-2xl text-blue-600">{totalUnits}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600 mb-1">
              {t("units.occupiedUnits", "Ocupadas")}
            </p>
            <p className="text-xl md:text-2xl text-green-600">{occupiedUnits}</p>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600 mb-1">
              {t("units.availableUnits", "Disponibles")}
            </p>
            <p className="text-xl md:text-2xl text-sky-600">{availableUnits}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600 mb-1">
              {t("units.maintenanceUnits", "En mantenimiento")}
            </p>
            <p className="text-xl md:text-2xl text-amber-600">
              {maintenanceUnits}
            </p>
          </div>
        </div>

        {/* Panel de filtros */}
        {filtersOpen && (
          <div className="mt-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs mb-1.5 text-gray-600">
                  {t("units.buildingFilter", "Edificio")}
                </label>
                <select
                  value={buildingFilter}
                  onChange={(e) => setBuildingFilter(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">
                    {t("allBuildings", "Todos los edificios")}
                  </option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1.5 text-gray-600">
                  {t("units.status", "Estado")}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">
                    {t("all", "Todos")}
                  </option>
                  <option value="ocupada">
                    {t("units.status.occupied", "Ocupada")}
                  </option>
                  <option value="disponible">
                    {t("units.status.available", "Disponible")}
                  </option>
                  <option value="mantenimiento">
                    {t("units.status.maintenance", "En mantenimiento")}
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setBuildingFilter("all");
                    setStatusFilter("all");
                    setSearchTerm("");
                  }}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1.5 text-gray-700"
                >
                  <Activity className="w-3 h-3" />
                  {t("clearFilters", "Limpiar filtros")}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {t("units.showing", "Mostrando")} {filteredUnits.length}{" "}
              {t("units.of", "de")} {totalUnits} {t("units.unitsLabel", "unidades")}
            </p>
          </div>
        )}
      </div>

      {/* Tabla de unidades */}
      <div className="hidden lg:block flex-1 overflow-auto pr-1">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <SkeletonUnitsTable rows={8} />
          ) : filteredUnits.length === 0 ? (
            <div className="py-10 text-center text-gray-500 text-sm">
              {searchTerm || buildingFilter !== "all" || statusFilter !== "all"
                ? t(
                    "units.noUnitsWithFilters",
                    "No se encontraron unidades con los filtros aplicados"
                  )
                : t(
                    "units.noUnitsYet",
                    "Aún no hay unidades registradas en tus edificios"
                  )}
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                    {t("units.unit", "Unidad")}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                    {t("units.building", "Edificio")}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                    {t("units.floor", "Planta")}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                    {t("units.type", "Tipo")}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                    {t("units.tenant", "Inquilino")}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                    {t("units.rent", "Renta")}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                    {t("units.status", "Estado")}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                    {t("units.expiration", "Vencimiento")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => {
                  const status = (unit.status || "").toLowerCase();
                  const isKnownStatus =
                    status === "ocupada" ||
                    status === "mantenimiento" ||
                    status === "disponible";

                  const statusClasses =
                    status === "ocupada"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : status === "mantenimiento"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : status === "disponible"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "";

                  const statusLabel =
                    status === "ocupada"
                      ? t("units.status.occupied", "Ocupada")
                      : status === "mantenimiento"
                      ? t("units.status.maintenance", "En mantenimiento")
                      : status === "disponible"
                      ? t("units.status.available", "Disponible")
                      : "-";

                  return (
                    <tr
                      key={`${unit.buildingId}-${unit.id}`}
                      className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() =>
                        navigate(`/building/${unit.buildingId}/unidades/${unit.id}`)
                      }
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {unit.name || unit.identifier || "Sin nombre"}
                          </span>
                          {unit.identifier && (
                            <span className="text-xs text-gray-500">
                              {unit.identifier}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <div className="flex items-start gap-1.5">
                          <Building2 className="w-4 h-4 mt-0.5 text-gray-400" />
                          <div>
                            <p className="font-medium text-xs md:text-sm">
                              {unit.buildingName || "—"}
                            </p>
                            {unit.buildingAddress && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="line-clamp-1">
                                  {unit.buildingAddress}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {unit.floor || "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {unit.useType || "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {unit.tenant ? (
                          unit.tenant
                        ) : (
                          <span className="inline-block w-full text-center text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {unit.rent != null ? (
                          `€${unit.rent.toLocaleString()}`
                        ) : (
                          <span className="inline-block w-full text-center text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {isKnownStatus ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs ${statusClasses}`}
                          >
                            {statusLabel}
                          </span>
                        ) : (
                          <span className="inline-block w-full text-center text-gray-400 text-xs">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {unit.rawData?.expirationDate ? (
                          (() => {
                            try {
                              const date = new Date(unit.rawData.expirationDate);
                              return date.toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              });
                            } catch {
                              return unit.rawData.expirationDate;
                            }
                          })()
                        ) : (
                          <span className="inline-block w-full text-center text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Vista móvil: lista sencilla */}
      <div className="lg:hidden flex-1 overflow-auto pr-1">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <SkeletonUnitsTable rows={5} />
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 text-sm">
            {searchTerm || buildingFilter !== "all" || statusFilter !== "all"
              ? t(
                  "units.noUnitsWithFilters",
                  "No se encontraron unidades con los filtros aplicados"
                )
              : t(
                  "units.noUnitsYet",
                  "Aún no hay unidades registradas en tus edificios"
                )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUnits.map((unit) => (
              <div
                key={`${unit.buildingId}-${unit.id}`}
                className="bg-white rounded-lg shadow-sm p-3 flex flex-col gap-1 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() =>
                  navigate(`/building/${unit.buildingId}/unidades/${unit.id}`)
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {unit.name || unit.identifier || "Sin nombre"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {unit.buildingName || "—"}
                    </p>
                  </div>
                  {unit.rent != null && (
                    <p className="text-sm font-semibold text-green-600">
                      €{unit.rent.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                  <span>{unit.useType || "—"}</span>
                  <span>{unit.floor ? `Planta ${unit.floor}` : "—"}</span>
                  <span>{unit.tenant || "—"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


