import { Building2, ChevronRight, Circle, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigation } from "../../contexts/NavigationContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { BuildingsApiService, type Building } from "../../services/buildingsApi";
import { SkeletonSidebarBuildings } from "../ui/LoadingSystem";

export function SecondaryNav() {
  const { activeSection, setActiveSection, setActiveTab, setViewMode, selectedBuildingId, setSelectedBuildingId } = useNavigation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [expandedBuildings, setExpandedBuildings] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    buildingType: '',
    energyClass: '',
    city: '',
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
      setExpandedBuildings(prev => [...prev, selectedBuildingId]);
    }
  }, [selectedBuildingId, expandedBuildings]);

  // Obtener lista única de ciudades para el filtro
  const cities = useMemo(() => {
    const uniqueCities = new Set(buildings.map(b => {
      const addressParts = b.address?.split(',');
      return addressParts?.[addressParts.length - 2]?.trim() || '';
    }).filter(Boolean));
    return Array.from(uniqueCities).sort();
  }, [buildings]);

  // Aplicar filtros
  const filteredBuildings = useMemo(() => {
    return buildings.filter(building => {
      if (filters.buildingType && building.typology !== filters.buildingType) {
        return false;
      }
      if (filters.city) {
        const addressParts = building.address?.split(',');
        const city = addressParts?.[addressParts.length - 2]?.trim() || '';
        if (city !== filters.city) return false;
      }
      return true;
    });
  }, [buildings, filters]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const clearFilters = () => {
    setFilters({
      buildingType: '',
      energyClass: '',
      city: '',
    });
  };

  const toggleBuildingExpansion = (buildingId: string) => {
    setExpandedBuildings(prev => 
      prev.includes(buildingId) 
        ? prev.filter(id => id !== buildingId)
        : [...prev, buildingId]
    );
  };

  return (
    <div className="hidden lg:block fixed lg:left-16 top-[88px] lg:w-64 md:w-48 h-[calc(100vh-88px)] bg-white border-r border-gray-200 overflow-y-auto shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <nav className="py-4">
        {/* Sección de Filtros */}
        <div className="px-3 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full px-3 py-2.5 rounded-md flex items-center gap-2 text-sm transition-colors ${
              hasActiveFilters || showFilters
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="flex-1 text-left">{t('filters2', 'Filtros')}</span>
            {hasActiveFilters && (
              <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full min-w-[18px] text-center">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>

          {/* Panel de filtros expandible */}
          {showFilters && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 space-y-3">
              {/* Filtro tipo */}
              <div>
                <label className="block text-xs mb-1.5 text-gray-600">{t('type', 'Tipo')}</label>
                <select
                  value={filters.buildingType}
                  onChange={(e) => setFilters({ ...filters, buildingType: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">{t('all', 'Todos')}</option>
                  <option value="residential">{t('residential', 'Residencial')}</option>
                  <option value="commercial">{t('commercial', 'Comercial')}</option>
                  <option value="mixed">{t('office', 'Mixto')}</option>
                </select>
              </div>

              {/* Filtro ciudad */}
              <div>
                <label className="block text-xs mb-1.5 text-gray-600">{t('city', 'Ciudad')}</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">{t('all', 'Todos')}</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Botón limpiar */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1.5 text-gray-700"
                >
                  <X className="w-3 h-3" />
                  {t('clearFilters', 'Limpiar filtros')}
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
                    isSelected && activeSection === 'todos'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  <Building2 className="w-4 h-4" />
                  <span className="flex-1 text-left truncate leading-relaxed">{building.name}</span>
                </button>

                {/* Opciones del edificio */}
                {isExpanded && (
                  <div className="ml-4 mt-3 space-y-1.5 pl-3 border-l-2 border-gray-200">
                    {/* Vista General */}
                    <button
                      onClick={() => {
                        setSelectedBuildingId(building.id);
                        setActiveSection('todos');
                        setActiveTab('todos');
                        setViewMode('detail');
                        navigate(`/edificio/${building.id}`);
                      }}
                      className={`w-full px-3 py-2.5 rounded-md flex items-center gap-2.5 text-xs transition-colors ${
                        selectedBuildingId === building.id && activeSection === 'todos'
                          ? 'text-blue-600 bg-blue-50 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Circle className="w-1.5 h-1.5 fill-current" />
                      <span className="leading-relaxed">{t('generalView', 'Vista General')}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }))}
        </div>
      </nav>
    </div>
  );
}

