import {
  Building2,
  ChevronRight,
  Circle,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigation } from "../../contexts/NavigationContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  BuildingsApiService,
  type Building,
} from "../../services/buildingsApi";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../ui/sheet";
import { SkeletonSidebarBuildings } from "../ui/LoadingSystem";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const {
    activeSection,
    setActiveSection,
    setActiveTab,
    setViewMode,
    selectedBuildingId,
    setSelectedBuildingId,
    setActiveModule,
  } = useNavigation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [expandedBuildings, setExpandedBuildings] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    buildingType: "",
    energyClass: "",
    city: "",
  });

  // Cargar edificios
  useEffect(() => {
    setLoading(true);
    BuildingsApiService.getAllBuildings()
      .then((data) => {
        setBuildings(data);
        setLoading(false);
      })
      .catch(() => {
        setBuildings([]);
        setLoading(false);
      });
  }, []);

  // Auto-expandir el edificio seleccionado
  useEffect(() => {
    if (selectedBuildingId && !expandedBuildings.includes(selectedBuildingId)) {
      setExpandedBuildings((prev) => [...prev, selectedBuildingId]);
    }
  }, [selectedBuildingId, expandedBuildings]);

  // Obtener lista única de ciudades para el filtro
  const cities = useMemo(() => {
    const uniqueCities = new Set(
      buildings
        .map((b) => {
          // Extraer ciudad de la dirección si existe
          const addressParts = b.address?.split(",");
          return addressParts?.[addressParts.length - 2]?.trim() || "";
        })
        .filter(Boolean)
    );
    return Array.from(uniqueCities).sort((a, b) => a.localeCompare(b));
  }, [buildings]);

  // Aplicar filtros
  const filteredBuildings = useMemo(() => {
    return buildings.filter((building) => {
      if (filters.buildingType && building.typology !== filters.buildingType) {
        return false;
      }
      // Filtro por ciudad
      if (filters.city) {
        const addressParts = building.address?.split(",");
        const city = addressParts?.[addressParts.length - 2]?.trim() || "";
        if (city !== filters.city) return false;
      }
      return true;
    });
  }, [buildings, filters]);

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const clearFilters = () => {
    setFilters({
      buildingType: "",
      energyClass: "",
      city: "",
    });
  };

  const toggleBuildingExpansion = (buildingId: string) => {
    setExpandedBuildings((prev) =>
      prev.includes(buildingId)
        ? prev.filter((id) => id !== buildingId)
        : [...prev, buildingId]
    );
  };

  const handleLogoClick = () => {
    setSelectedBuildingId(null);
    setActiveModule("assets");
    setActiveSection("dashboard");
    setActiveTab("dashboard");
    setViewMode("list");
    navigate("/assets");
    onClose();
  };

  const handleBuildingClick = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setActiveSection("todos");
    setActiveTab("todos");
    setViewMode("detail");
    navigate(`/building/${buildingId}/general-view`);
    onClose();
  };

  const handleAnalysisClick = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setActiveSection("analisis");
    setActiveTab("analisis");
    setViewMode("detail");
    navigate(`/building/${buildingId}/analysis-general`);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[85vw] max-w-sm p-0 overflow-y-auto"
      >
        <SheetTitle className="sr-only">
          {t("navigation", "Navegación")}
        </SheetTitle>
        <SheetDescription className="sr-only">
          {t("buildingListNavigation", "Navegación por la lista de edificios")}
        </SheetDescription>

        <div className="h-full flex flex-col">
          {/* Header con logo */}
          <div className="bg-[#1e3a8a] p-4">
            <button
              onClick={handleLogoClick}
              className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-blue-50 transition-all cursor-pointer mx-auto"
              title={t("backToDashboard", "Volver al dashboard")}
            >
              <Building2 className="w-7 h-7 text-[#1e3a8a]" />
            </button>
            <div className="text-center mt-3">
              <h2 className="text-white text-sm font-bold">ARKIA</h2>
              <p className="text-blue-200 text-xs mt-1">
                {t("assetsList", "Listado de activos")}
              </p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 py-4 bg-white">
            {/* Sección de Filtros */}
            <div className="px-3 mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full px-3 py-2.5 rounded-md flex items-center gap-2 text-sm transition-colors ${
                  hasActiveFilters || showFilters
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="flex-1 text-left">
                  {t("filters2", "Filtros")}
                </span>
                {hasActiveFilters && (
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full min-w-[18px] text-center">
                    {Object.values(filters).filter((v) => v !== "").length}
                  </span>
                )}
              </button>

              {/* Panel de filtros expandible */}
              {showFilters && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 space-y-3">
                  {/* Filtro tipo */}
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-600">
                      {t("type", "Tipo")}
                    </label>
                    <select
                      value={filters.buildingType}
                      onChange={(e) =>
                        setFilters({ ...filters, buildingType: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">{t("all", "Todos")}</option>
                      <option value="residential">
                        {t("residential", "Residencial")}
                      </option>
                      <option value="commercial">
                        {t("commercial", "Comercial")}
                      </option>
                      <option value="mixed">{t("office", "Mixto")}</option>
                    </select>
                  </div>

                  {/* Filtro ciudad */}
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-600">
                      {t("city", "Ciudad")}
                    </label>
                    <select
                      value={filters.city}
                      onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">{t("all", "Todos")}</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Botones de acción */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full px-2 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors text-gray-700 flex items-center justify-center gap-1.5"
                    >
                      <X className="w-3 h-3" />
                      {t("clearFilters", "Limpiar filtros")}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5 px-3">
              {/* Edificios */}
              {loading ? (
                <SkeletonSidebarBuildings />
              ) : (
                filteredBuildings.map((building) => {
                  const isExpanded = expandedBuildings.includes(building.id);
                  const isSelected = selectedBuildingId === building.id;

                  return (
                    <div key={building.id} className="mb-1">
                      {/* Edificio principal */}
                      <button
                        onClick={() => toggleBuildingExpansion(building.id)}
                        className={`w-full px-3 py-3 rounded-md flex items-center gap-2.5 text-sm transition-colors ${
                          isSelected && activeSection === "todos"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                        <Building2 className="w-4 h-4" />
                        <span className="flex-1 text-left truncate leading-relaxed">
                          {building.name}
                        </span>
                      </button>

                      {/* Opciones del edificio */}
                      {isExpanded && (
                        <div className="ml-4 mt-3 space-y-1.5 pl-3 border-l-2 border-gray-200">
                          {/* Vista General */}
                          <button
                            onClick={() => handleBuildingClick(building.id)}
                            className={`w-full px-3 py-2.5 rounded-md flex items-center gap-2.5 text-xs transition-colors ${
                              selectedBuildingId === building.id &&
                              activeSection === "todos"
                                ? "text-blue-600 bg-blue-50 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            <Circle className="w-1.5 h-1.5 fill-current" />
                            <span className="leading-relaxed">
                              {t("generalView", "Vista General")}
                            </span>
                          </button>

                          {/* Análisis general */}
                          <button
                            onClick={() => handleAnalysisClick(building.id)}
                            className={`w-full px-3 py-2.5 rounded-md flex items-center gap-2.5 text-xs transition-colors ${
                              selectedBuildingId === building.id &&
                              activeSection === "analisis"
                                ? "text-blue-600 bg-blue-50 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            <Circle className="w-1.5 h-1.5 fill-current" />
                            <span className="leading-relaxed">
                              {t("generalAnalysis", "Análisis general")}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {!loading && filteredBuildings.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {hasActiveFilters
                    ? t("noBuildingsFound", "No se encontraron edificios")
                    : t("noBuildings", "No hay edificios")}
                </div>
              )}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
