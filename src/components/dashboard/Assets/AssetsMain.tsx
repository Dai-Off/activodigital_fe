import {
  Building2,
  Search,
  SlidersHorizontal,
  Check,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateBuildingMethodSelection from "~/components/buildings/CreateBuildingMethodSelection";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  BuildingsApiService,
  type DashboardStats,
  type Building,
} from "~/services/buildingsApi";

export function AssetsMain() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      BuildingsApiService.getDashboardStats(),
      BuildingsApiService.getAllBuildings(),
    ])
      .then(([statsData, buildingsData]) => {
        setStats(statsData);
        setBuildings(buildingsData);
      })
      .catch(() => {
        setStats(null);
        setBuildings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col gap-3">
        {/* Header skeleton */}
        <div className="bg-white rounded-xl p-3 md:p-4 lg:p-6 shadow-sm flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg w-9 h-9 md:w-10 md:h-10 animate-pulse" />
              <div>
                <div className="h-6 md:h-7 lg:h-8 w-48 md:w-56 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-3 md:h-4 w-24 md:w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-9 md:h-10 w-full sm:w-40 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* 4 estadísticas skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="h-3 md:h-4 w-20 md:w-24 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-6 md:h-8 w-12 md:w-16 bg-gray-300 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Búsqueda y filtros skeleton */}
          <div className="space-y-4 mt-6">
            <div className="flex flex-col gap-2">
              <div className="flex-1 relative">
                <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 h-10 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-10 w-16 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Lista de edificios skeleton - Mobile cards */}
        <div className="lg:hidden flex-1 overflow-auto pr-1">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex gap-3 p-3">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-100 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="space-y-1">
                          <div className="h-2 w-12 bg-gray-100 rounded animate-pulse" />
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de edificios skeleton - Desktop table */}
        <div className="hidden lg:block flex-1 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <th key={i} className="p-4">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4">
                      <div className="h-10 w-10 bg-gray-100 rounded animate-pulse" />
                    </td>
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <td key={j} className="p-4">
                        <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">
              {t("generalDashboard", "Dashboard General")}
            </h1>
            <p className="text-sm text-gray-500">
              {t(
                "executiveSummary",
                "Resumen ejecutivo del portfolio de activos"
              )}
            </p>
          </div>
        </div>
        <div className="text-center py-12 text-gray-500">
          {t("errorLoadingStats", "Error al cargar estadísticas")}
        </div>
      </div>
    );
  }

  // Calcular cumplimiento promedio (placeholder - ajustar según datos reales)
  const complianceAverage = 79; // Esto debería venir de stats
  const totalSurface = stats.totalSurfaceArea > 0
    ? (stats.totalSurfaceArea / 1000).toFixed(1) + "k"
    : "0";

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-white rounded-xl p-3 md:p-4 lg:p-6 shadow-sm flex-shrink-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl">Gestión de Edificios</h2>
            <p className="text-xs md:text-sm text-gray-500">{stats.totalAssets} edificios</p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          + Crear Edificio
        </button>
      </div>

      {/* Modal de selección de método */}
      <CreateBuildingMethodSelection
        isOpen={isCreateModalOpen}
        onSelectMethod={(method) => {
          setIsCreateModalOpen(false);
          navigate("/building/create", { state: { method } });
        }}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Edificios</p>
          <p className="text-2xl text-blue-600">{stats.totalAssets}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Cumplimiento Promedio</p>
          <p className="text-2xl text-green-600">{complianceAverage}%</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Libros Completos</p>
          <p className="text-2xl text-purple-600">{stats.completedBooks}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Superficie Total</p>
          <p className="text-2xl text-orange-600">{totalSurface} m²</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, dirección..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-gray-500">{stats.totalAssets} de {stats.totalAssets} edificios</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="name">Nombre</option>
            <option value="surface">Superficie</option>
            <option value="year">Año</option>
            <option value="energyClass">Clase Energética</option>
            <option value="compliance">Cumplimiento</option>
            <option value="occupancy">Ocupación</option>
          </select>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            A-Z
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 border-gray-300">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="lg:hidden flex-1 overflow-auto pr-1">
        <div className="space-y-3">
          {buildings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
              No hay edificios disponibles
            </div>
          ) : (
            buildings.map((building) => {

              const getComplianceColor = (percentage: number) => {
                if (percentage >= 80) return "bg-green-500";
                if (percentage >= 60) return "bg-yellow-500";
                return "bg-red-500";
              };

              // Calcular cumplimiento (placeholder - ajustar según datos reales)
              const compliancePercentage = 100; // Esto debería venir de los datos del edificio

              return (
                <div
                  key={building.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/building/${building.id}/general-view`)}
                >
                  <div className="flex gap-3 p-3">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {building.images && building.images.length > 0 ? (
                        <img
                          src={building.images[0].url}
                          alt={building.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1 truncate">
                        {building.name}
                      </h3>
                      {building.address && (
                        <p className="text-xs text-gray-500 mb-2 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {building.address}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Tipo:</span>
                          <span className="font-medium truncate">
                            {building.typology === "residential"
                              ? "Residencial"
                              : building.typology === "commercial"
                              ? "Comercial"
                              : "Mixto"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Clase:</span>
                          <span className="text-gray-400">-</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Superficie:</span>
                          <span className="font-medium">
                            {building.squareMeters
                              ? `${building.squareMeters.toLocaleString()} m²`
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Año:</span>
                          <span className="font-medium">{building.constructionYear || "-"}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all ${getComplianceColor(
                              compliancePercentage
                            )}`}
                            style={{ width: `${compliancePercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {compliancePercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Vista Desktop - Tabla */}
      <div className="hidden lg:block flex-1 overflow-auto pr-1">
        <div className="bg-white w-fit rounded-xl p-6 shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>Imagen</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>Edificio</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>ID</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>Tipo</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>Superficie</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>Año</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>Certificado</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>Libro</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>Cumplimiento</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {buildings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">
                    No hay edificios disponibles
                  </td>
                </tr>
              ) : (
                buildings.map((building) => {

                  const getComplianceColor = (percentage: number) => {
                    if (percentage >= 80) return "bg-green-500";
                    if (percentage >= 60) return "bg-yellow-500";
                    return "bg-red-500";
                  };

                  const compliancePercentage = 100;

                  return (
                    <tr
                      key={building.id}
                      className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/building/${building.id}/general-view`)}
                    >
                      <td className="py-3 px-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-200">
                          {building.images && building.images.length > 0 ? (
                            <img
                              src={building.images[0].url}
                              alt={building.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900 font-medium">
                            {building.name}
                          </p>
                          {building.address && (
                            <div className="flex items-start gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{building.address}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {building.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {building.typology === "residential"
                          ? "Residencial"
                          : building.typology === "commercial"
                          ? "Comercial"
                          : "Mixto"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {building.squareMeters
                          ? `${building.squareMeters.toLocaleString()} m²`
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {building.constructionYear || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-400">-</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          <Check className="w-3 h-3" />
                          Completo
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                            <div
                              className={`h-2 rounded-full ${getComplianceColor(
                                compliancePercentage
                              )}`}
                              style={{ width: `${compliancePercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-700">
                            {compliancePercentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
