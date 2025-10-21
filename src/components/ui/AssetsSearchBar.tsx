import { useState } from 'react';

export type SortField = 'name' | 'value' | 'status' | 'energyClass' | 'esgScore' | 'squareMeters';
export type SortOrder = 'asc' | 'desc';

export interface SearchFilters {
  searchTerm: string;
  sortField: SortField;
  sortOrder: SortOrder;
  statusFilter: string[];
  energyClassFilter: string[];
}

interface AssetsSearchBarProps {
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults: number;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Pendiente' },
  { value: 'ready_book', label: 'Listo' },
  { value: 'with_book', label: 'En curso' },
  { value: 'completed', label: 'Completado' },
];

const ENERGY_CLASS_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'name', label: 'Nombre' },
  { value: 'value', label: 'Valor' },
  { value: 'status', label: 'Estado' },
  { value: 'energyClass', label: 'Clase energética' },
  { value: 'esgScore', label: 'ESG Score' },
  { value: 'squareMeters', label: 'Superficie' },
];

export default function AssetsSearchBar({ onFiltersChange, totalResults, isLoading }: AssetsSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [energyClassFilter, setEnergyClassFilter] = useState<string[]>([]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    emitFilters({ searchTerm: value });
  };

  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
    emitFilters({ sortField: field });
  };

  const handleSortOrderToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    emitFilters({ sortOrder: newOrder });
  };

  const handleStatusFilterChange = (status: string) => {
    const newFilter = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status];
    setStatusFilter(newFilter);
    emitFilters({ statusFilter: newFilter });
  };

  const handleEnergyClassFilterChange = (energyClass: string) => {
    const newFilter = energyClassFilter.includes(energyClass)
      ? energyClassFilter.filter((c) => c !== energyClass)
      : [...energyClassFilter, energyClass];
    setEnergyClassFilter(newFilter);
    emitFilters({ energyClassFilter: newFilter });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortField('name');
    setSortOrder('asc');
    setStatusFilter([]);
    setEnergyClassFilter([]);
    onFiltersChange({
      searchTerm: '',
      sortField: 'name',
      sortOrder: 'asc',
      statusFilter: [],
      energyClassFilter: [],
    });
  };

  const emitFilters = (overrides: Partial<SearchFilters> = {}) => {
    onFiltersChange({
      searchTerm,
      sortField,
      sortOrder,
      statusFilter,
      energyClassFilter,
      ...overrides,
    });
  };

  const activeFiltersCount = statusFilter.length + energyClassFilter.length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 p-5 mb-6">
      {/* Barra principal de búsqueda y ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        {/* Campo de búsqueda mejorado */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar activos..."
            className="block w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Limpiar búsqueda"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Controles de ordenamiento refinados */}
        <div className="flex gap-2">
          <div className="relative group">
            <select
              value={sortField}
              onChange={(e) => handleSortFieldChange(e.target.value as SortField)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100/50"
              disabled={isLoading}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={handleSortOrderToggle}
            className="px-3 py-2.5 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100/50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
            title={sortOrder === 'asc' ? 'Ascendente (A-Z, menor-mayor)' : 'Descendente (Z-A, mayor-menor)'}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span className="hidden sm:inline">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              showFilters || activeFiltersCount > 0
                ? 'bg-blue-50 border border-blue-200/60 text-blue-700 shadow-sm'
                : 'bg-gray-50/50 border border-gray-200/80 text-gray-700 hover:bg-gray-100/50 hover:border-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading}
            aria-label="Filtros adicionales"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1.5 bg-blue-600 text-white text-[10px] font-semibold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Panel de filtros expandible mejorado */}
      {showFilters && (
        <div
          className="pt-4 mt-3 border-t border-gray-200/50 animate-fadeIn"
          style={{ animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Filtro por estado con chips refinados */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Estado del Libro
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusFilterChange(status.value)}
                    className={`group relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      statusFilter.includes(status.value)
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/30 scale-100'
                        : 'bg-gray-50/80 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200/60'
                    }`}
                  >
                    <span className="relative z-10">{status.label}</span>
                    {statusFilter.includes(status.value) && (
                      <div className="absolute inset-0 rounded-lg bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por clase energética con gradientes */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Calificación Energética
              </label>
              <div className="flex flex-wrap gap-2">
                {ENERGY_CLASS_OPTIONS.map((energyClass) => {
                  const isSelected = energyClassFilter.includes(energyClass);
                  const getEnergyGradient = (cls: string) => {
                    const gradients: Record<string, string> = {
                      A: 'from-green-500 to-green-600 shadow-green-500/30',
                      B: 'from-green-400 to-green-500 shadow-green-400/30',
                      C: 'from-yellow-400 to-yellow-500 shadow-yellow-400/30',
                      D: 'from-yellow-500 to-orange-400 shadow-yellow-500/30',
                      E: 'from-orange-400 to-orange-500 shadow-orange-400/30',
                      F: 'from-orange-500 to-red-500 shadow-red-500/30',
                      G: 'from-red-500 to-red-600 shadow-red-500/30',
                    };
                    return gradients[cls] || 'from-gray-400 to-gray-500';
                  };
                  
                  return (
                    <button
                      key={energyClass}
                      onClick={() => handleEnergyClassFilterChange(energyClass)}
                      className={`group relative w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center ${
                        isSelected
                          ? `bg-gradient-to-br ${getEnergyGradient(energyClass)} text-white shadow-sm scale-100`
                          : 'bg-gray-50/80 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200/60 hover:scale-105'
                      }`}
                    >
                      <span className="relative z-10">{energyClass}</span>
                      {isSelected && (
                        <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Botón para limpiar filtros mejorado */}
          {(activeFiltersCount > 0 || searchTerm || sortField !== 'name' || sortOrder !== 'asc') && (
            <div className="mt-4 pt-3 border-t border-gray-200/50 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {activeFiltersCount > 0 && `${activeFiltersCount} ${activeFiltersCount === 1 ? 'filtro activo' : 'filtros activos'}`}
              </span>
              <button
                onClick={handleClearFilters}
                className="group px-3.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-50/80 rounded-lg hover:bg-red-50 hover:text-red-600 border border-gray-200/60 hover:border-red-200 transition-all duration-200 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* Contador de resultados con diseño sutil */}
      <div className={`flex items-center gap-2 text-xs ${showFilters ? 'mt-0' : 'mt-3'}`}>
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            <span>Cargando</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>
              <span className="font-semibold text-gray-900">{totalResults}</span>{' '}
              {totalResults === 1 ? 'activo' : 'activos'}
              {(searchTerm || activeFiltersCount > 0) && (
                <span className="ml-1 text-gray-400">• filtrado{totalResults !== 1 ? 's' : ''}</span>
              )}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-8px) scale(0.98);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        
        /* Mejora para el select en móvil */
        @media (max-width: 640px) {
          select {
            font-size: 16px; /* Previene zoom en iOS */
          }
        }
      `}</style>
    </div>
  );
}

