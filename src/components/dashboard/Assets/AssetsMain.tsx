import {
  Building2,
  Search,
  Check,
  MapPin,
  X,
  Filter,
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
import { EnergyCertificatesService, type PersistedEnergyCertificate } from "~/services/energyCertificates";
import { getLatestRating, getCEEColor } from "~/utils/energyCalculations";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function AssetsMain() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [energyCertificates, setEnergyCertificates] = useState<PersistedEnergyCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [columnFilters, setColumnFilters] = useState({
    typology: [] as string[],
    year: [] as string[],
    surface: { min: "", max: "" },
    energyClass: [] as string[],
    compliance: [] as string[],
  });

  const filteredBuildings = buildings.filter((building) => {
    // 1. Global Search (Name, Address, Ref)
    const query = searchQuery.toLowerCase().trim();
    const matchesGlobalSearch = !query || 
      building.name.toLowerCase().includes(query) ||
      (building.address && building.address.toLowerCase().includes(query)) ||
      (building.cadastralReference && building.cadastralReference.toLowerCase().includes(query));

    if (!matchesGlobalSearch) return false;

    // 2. Column Filters
    
    // Typology
    if (columnFilters.typology.length > 0) {
      // Map API values to simple keys used in UI
      const normalizeType = (t: string) => {
        const lower = (t || "").toLowerCase();
        if (lower.includes("resid") || lower.includes("vivienda")) return "residential";
        if (lower.includes("comerc") || lower.includes("local") || lower.includes("negocio")) return "commercial";
        if (lower.includes("oficin") || lower.includes("mix") || lower.includes("despacho")) return "mixed";
        return lower;
      };
      
      const buildingType = normalizeType(building.typology);
      if (!columnFilters.typology.includes(buildingType)) return false;
    }

    // Year
    if (columnFilters.year.length > 0) {
      const yearStr = (building.constructionYear || "").toString();
      // Simple text match for now (can be expanded to ranges if needed)
      const matchesYear = columnFilters.year.some(filterYear => yearStr.includes(filterYear));
      if (!matchesYear) return false;
    }

    // Surface
    const surface = building.squareMeters || 0;
    const minSurface = columnFilters.surface.min ? parseFloat(columnFilters.surface.min) : null;
    const maxSurface = columnFilters.surface.max ? parseFloat(columnFilters.surface.max) : null;

    if (minSurface !== null && surface < minSurface) return false;
    if (maxSurface !== null && surface > maxSurface) return false;

    // Energy Class
    if (columnFilters.energyClass.length > 0) {
      const certs = energyCertificates.filter(c => c.buildingId === building.id);
      const rating = certs.length > 0 ? getLatestRating(certs) : "-";
      if (!columnFilters.energyClass.includes(rating)) return false;
    }

    // Compliance
    if (columnFilters.compliance.length > 0) {
      const compliancePercentage = building.porcentBook || 0;
      const status = compliancePercentage === 100 ? "completed" : "incomplete";
      if (!columnFilters.compliance.includes(status)) return false;
    }

    return true;
  });

  const sortedBuildings = [...filteredBuildings].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (sortOrder === "asc") return nameA.localeCompare(nameB);
    return nameB.localeCompare(nameA);
  });

  useEffect(() => {
    Promise.all([
      BuildingsApiService.getDashboardStats(),
      BuildingsApiService.getAllBuildings(),
      EnergyCertificatesService.getAll(),
    ])
      .then(([statsData, buildingsData, certsData]) => {
        setStats(statsData);
        setBuildings(buildingsData);
        setEnergyCertificates(certsData);
      })
      .catch((err) => {
        console.error("Error loading buildings:", err);
        setStats(null);
        setBuildings([]);
        setEnergyCertificates([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleClearFilters = () => {
    setColumnFilters({
      typology: [],
      year: [],
      surface: { min: "", max: "" },
      energyClass: [],
      compliance: [],
    });
    setSearchQuery("");
  };

  const hasActiveFilters = 
    searchQuery ||
    columnFilters.typology.length > 0 ||
    columnFilters.year.length > 0 ||
    columnFilters.surface.min ||
    columnFilters.surface.max ||
    columnFilters.energyClass.length > 0 ||
    columnFilters.compliance.length > 0;

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
              {t("generalDashboard")}
            </h1>
            <p className="text-sm text-gray-500">
              {t(
                "executiveSummary"
              )}
            </p>
          </div>
        </div>
        <div className="text-center py-12 text-gray-500">
          {t("errorLoadingStats")}
        </div>
      </div>
    );
  }

  // Calcular cumplimiento promedio (placeholder - ajustar según datos reales)
  const complianceAverage = stats.complianceAverage; // Esto debería venir de stats
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
              <h2 className="text-lg md:text-xl lg:text-2xl">{t("buildingManagement")}</h2>
              <p className="text-xs md:text-sm text-gray-500">{stats.totalAssets} {t("buildings")}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            + {t("createBuilding", "Crear Edificio")}
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
            <p className="text-sm text-gray-600 mb-1">{t("totalBuildings")}</p>
            <p className="text-2xl text-blue-600">{stats.totalAssets}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{t("complianceAverage")}</p>
            <p className="text-2xl text-green-600">{complianceAverage}%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{t("completedBooks")}</p>
            <p className="text-2xl text-purple-600">{stats.completedBooks}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{t("totalSurfaceArea")}</p>
            <p className="text-2xl text-orange-600">{totalSurface} m²</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("search")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {hasActiveFilters && (
                <button 
                  onClick={handleClearFilters}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t("clearFilters", "Limpiar filtros")}
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500">{filteredBuildings.length} {t("of")} {stats.totalAssets} {t("buildings")}</div>
          </div>
        </div>
      </div>

      <div className="lg:hidden flex-1 overflow-auto pr-1">
        <div className="space-y-3">
          {sortedBuildings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
              {searchQuery ? "No se encontraron resultados" : "No hay edificios disponibles"}
            </div>
          ) : (
            sortedBuildings.map((building) => {
              const getComplianceColor = (percentage: number) => {
                if (percentage >= 80) return "bg-green-500";
                if (percentage >= 60) return "bg-yellow-500";
                return "bg-red-500";
              };
              const compliancePercentage = building.porcentBook || 0;
              const certs = energyCertificates.filter(c => c.buildingId === building.id);
              const currentRating = certs.length > 0 ? getLatestRating(certs) : "-";

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
                          <span className="text-gray-500">{t("type")}:</span>
                          <span className="font-medium truncate">
                            {building.typology === "residential"
                              ? t("residential")
                              : building.typology === "commercial"
                                ? t("commercial")
                                : t("office")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">{t("energyClass")}:</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-gray-500">Clase:</span>
                          <span className={`${currentRating !== "-" ? getCEEColor(currentRating) + " text-white px-1.5 rounded text-[10px] font-bold" : "text-gray-400"}`}>
                            {currentRating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">{t("surface")}:</span>
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
                            className={`h-full transition-all ${getComplianceColor(compliancePercentage)}`}
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
      <div className="hidden lg:block flex-1 pr-1">
        <div className="bg-white w-full rounded-xl overflow-x-auto p-6 border border-gray-200 min-h-[500px]">
          <table className="w-full table-auto min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600 w-[100px]">
                  <span>{t("image")}</span>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 min-w-[320px]">
                   <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}>
                    <span>{t("building")}</span>
                    <div className="flex flex-col opacity-70">
                      <svg className={`w-2 h-2 ${sortOrder === "asc" ? "text-blue-600" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-8 8h16l-8-8z"/></svg>
                      <svg className={`w-2 h-2 ${sortOrder === "desc" ? "text-blue-600" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 20l8-8H4l8 8z"/></svg>
                    </div>
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600 w-[150px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-0 focus-visible:outline-none ${columnFilters.typology.length > 0 ? "text-blue-600 font-medium" : ""}`}>
                      <span>{t("typology")}</span>
                      <Filter className={`w-3 h-3 ${columnFilters.typology.length > 0 ? "text-blue-600" : "text-gray-400"}`} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-white opacity-100 shadow-xl border border-gray-200">
                      {[
                        { value: "residential", label: t("residential") },
                        { value: "commercial", label: t("commercial") },
                        { value: "mixed", label: t("mixed") },
                      ].map((option) => (
                        <DropdownMenuCheckboxItem
                          key={option.value}
                          checked={columnFilters.typology.includes(option.value)}
                          onCheckedChange={(checked) => {
                            setColumnFilters(prev => ({
                              ...prev,
                              typology: checked 
                                ? [...prev.typology, option.value]
                                : prev.typology.filter(t => t !== option.value)
                            }));
                          }}
                        >
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600 w-[140px]">
                  <Popover>
                    <PopoverTrigger className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-0 focus-visible:outline-none ${columnFilters.surface.min || columnFilters.surface.max ? "text-blue-600 font-medium" : ""}`}>
                      <span>{t("surface")}</span>
                      <svg className={`w-3 h-3 ${columnFilters.surface.min || columnFilters.surface.max ? "text-blue-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4 bg-white opacity-100 shadow-xl border border-gray-200" align="start">
                      <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Rango m²</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={columnFilters.surface.min}
                            onChange={(e) => setColumnFilters(prev => ({ ...prev, surface: { ...prev.surface, min: e.target.value } }))}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={columnFilters.surface.max}
                            onChange={(e) => setColumnFilters(prev => ({ ...prev, surface: { ...prev.surface, max: e.target.value } }))}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600 w-[110px]">
                   <Popover>
                    <PopoverTrigger className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-0 focus-visible:outline-none ${columnFilters.year.length > 0 ? "text-blue-600 font-medium" : ""}`}>
                      <span>{t("year")}</span>
                      <svg className={`w-3 h-3 ${columnFilters.year.length > 0 ? "text-blue-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 bg-white opacity-100 shadow-xl border border-gray-200" align="start">
                       <input
                        type="text"
                        placeholder="Filtrar por año..."
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        value={columnFilters.year[0] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setColumnFilters(prev => ({ ...prev, year: val ? [val] : [] }));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </th>
                <th className="text-center py-3 px-4 text-sm text-gray-600 w-[120px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className={`flex items-center justify-center gap-1.5 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-0 focus-visible:outline-none mx-auto ${columnFilters.energyClass.length > 0 ? "text-blue-600 font-medium" : ""}`}>
                      <span>{t("certificate")}</span>
                      <Filter className={`w-3 h-3 ${columnFilters.energyClass.length > 0 ? "text-blue-600" : "text-gray-400"}`} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-32 bg-white opacity-100 shadow-xl border border-gray-200">
                      {["A", "B", "C", "D", "E", "F", "G"].map((label) => (
                         <DropdownMenuCheckboxItem
                          key={label}
                          checked={columnFilters.energyClass.includes(label)}
                          onCheckedChange={(checked) => {
                            setColumnFilters(prev => ({
                              ...prev,
                              energyClass: checked 
                                ? [...prev.energyClass, label]
                                : prev.energyClass.filter(t => t !== label)
                            }));
                          }}
                        >
                          {label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600 w-[140px]">
                   <span>{t("book")}</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600 w-[180px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-0 focus-visible:outline-none ${columnFilters.compliance.length > 0 ? "text-blue-600 font-medium" : ""}`}>
                      <span>{t("compliance")}</span>
                      <Filter className={`w-3 h-3 ${columnFilters.compliance.length > 0 ? "text-blue-600" : "text-gray-400"}`} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-white opacity-100 shadow-xl border border-gray-200">
                      {[
                        { value: "completed", label: t("completed") },
                        { value: "incomplete", label: t("incomplete") },
                      ].map((option) => (
                         <DropdownMenuCheckboxItem
                          key={option.value}
                          checked={columnFilters.compliance.includes(option.value)}
                          onCheckedChange={(checked) => {
                            setColumnFilters(prev => ({
                              ...prev,
                              compliance: checked 
                                ? [...prev.compliance, option.value]
                                : prev.compliance.filter(t => t !== option.value)
                            }));
                          }}
                        >
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBuildings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                       <Building2 className="w-10 h-10 text-gray-200" />
                       <p>{searchQuery || hasActiveFilters ? t("noResultsFound") : t("noBuildingsAvailable")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedBuildings.map((building) => {
                  const getComplianceColor = (percentage: number) => {
                    if (percentage >= 80) return "bg-[#00c853]";
                    if (percentage >= 60) return "bg-yellow-500";
                    return "bg-red-500";
                  };
                  const compliancePercentage = building.porcentBook || 0;
                  const certs = energyCertificates.filter(c => c.buildingId === building.id);
                  const currentRating = certs.length > 0 ? getLatestRating(certs) : "-";
                  const status = compliancePercentage === 100 
                    ? { label: t("completed"), icon: Check, color: 'bg-[#e8fbf3] text-[#00c853]' }
                    : { label: t("incomplete"), icon: X, color: 'bg-red-50 text-red-600' };

                  return (
                    <tr
                      key={building.id}
                      className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/building/${building.id}/general-view`)}
                    >
                      <td className="py-4 px-4">
                        <div className="w-14 h-11 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          {building.images && building.images.length > 0 ? (
                            <img
                              src={building.images[0].url}
                              alt={building.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="min-w-[280px]">
                          <p className="text-sm text-gray-900 font-semibold mb-0.5">
                            {building.name}
                          </p>
                          {building.address && (
                            <div className="flex items-start gap-1 text-[11px] text-gray-500">
                              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{building.address}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {building.typology === "residential"
                          ? t("residential")
                          : building.typology === "commercial"
                            ? t("commercial")
                            : t("mixed")}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {building.squareMeters
                          ? `${building.squareMeters.toLocaleString()} m²`
                          : "-"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {building.constructionYear || "-"}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {currentRating !== "-" ? (
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold mx-auto ${getCEEColor(currentRating)}`}>
                            {currentRating}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${status.color}`}>
                          <status.icon className="w-3.5 h-3.5" /> {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-[100px]">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${getComplianceColor(compliancePercentage)}`}
                              style={{ width: `${compliancePercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-gray-600 min-w-[35px]">
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
