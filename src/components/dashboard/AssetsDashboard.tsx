import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Calendar,
  Users,
  Home,
  Activity,
  BarChart3
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { BuildingsApiService, type DashboardStats } from "../../services/buildingsApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateBuildingMethodSelection from "../buildings/CreateBuildingMethodSelection";

export function AssetsDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    BuildingsApiService.getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">{t('generalDashboard', 'Dashboard General')}</h1>
            <p className="text-sm text-gray-500">{t('executiveSummary', 'Resumen ejecutivo del portfolio de activos')}</p>
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Layout Principal - Dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - KPIs principales (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPIs en fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Skeleton KPI */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg w-12 h-12 animate-pulse" />
                    <div className="w-5 h-5 bg-blue-100 rounded animate-pulse" />
                  </div>
                  <div className="h-9 w-16 bg-gray-200 rounded mb-1 animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Información adicional en grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Skeleton Cards */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg w-9 h-9 animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha - Gráfico circular (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
              <div className="h-5 w-48 bg-gray-200 rounded mx-auto mb-6 animate-pulse" />
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 mb-6">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="14"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#93c5fd"
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray="220 439.82"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="h-10 w-12 bg-gray-200 rounded mb-1 animate-pulse" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {[1, 2].map((i) => (
                    <div key={i} className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="h-8 w-8 bg-blue-200 rounded mb-1 mx-auto animate-pulse" />
                      <div className="h-3 w-20 bg-gray-200 rounded mx-auto animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
            <h1 className="text-2xl mb-1">{t('generalDashboard', 'Dashboard General')}</h1>
            <p className="text-sm text-gray-500">{t('executiveSummary', 'Resumen ejecutivo del portfolio de activos')}</p>
          </div>
        </div>
        <div className="text-center py-12 text-gray-500">{t('errorLoadingStats', 'Error al cargar estadísticas')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título y Botón Registrar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">{t('generalDashboard', 'Dashboard General')}</h1>
          <p className="text-sm text-gray-500">{t('executiveSummary', 'Resumen ejecutivo del portfolio de activos')}</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Building2 className="w-4 h-4" />
          <span>{t('createBuilding', 'Crear edificio')}</span>
        </button>
      </div>

      {/* Modal de selección de método */}
      <CreateBuildingMethodSelection
        isOpen={isCreateModalOpen}
        onSelectMethod={(method) => {
          setIsCreateModalOpen(false);
          navigate('/edificios/crear', { state: { method } });
        }}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Layout Principal - Dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - KPIs principales (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPIs en fila */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total de edificios */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl mb-1 text-gray-900">{stats.totalAssets}</div>
              <div className="text-sm text-gray-600">{t('energyBuildings', 'Edificios energéticos')}</div>
            </div>

            {/* Libros completados */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl mb-1 text-gray-900">{stats.completedBooks}</div>
              <div className="text-sm text-gray-600">{t('completedBooks', 'Libros completados')}</div>
            </div>

            {/* Pendientes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl mb-1 text-gray-900">{stats.pendingBooks}</div>
              <div className="text-sm text-gray-600">{t('pending', 'Pendientes')}</div>
            </div>
          </div>

          {/* Información adicional en grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-sm text-gray-600">{t('totalSurface2', 'Superficie Total')}</h4>
              </div>
              <div className="text-2xl text-gray-900">{stats.totalSurfaceArea > 0 ? stats.totalSurfaceArea.toLocaleString('es-ES', { maximumFractionDigits: 0 }) : '0'} m²</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-sm text-gray-600">{t('dominantTypology', 'Tipología Dominante')}</h4>
              </div>
              <div className="text-2xl text-gray-900">
                {stats.mostCommonTypology 
                  ? stats.mostCommonTypology === 'residential' ? t('residential', 'Residencial')
                    : stats.mostCommonTypology === 'commercial' ? t('commercial', 'Comercial')
                    : t('office', 'Mixto')
                  : '-'}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-sm text-gray-600">{t('avgUnits2', 'Promedio Unidades')}</h4>
              </div>
              <div className="text-2xl text-gray-900">{Math.round(stats.averageUnitsPerBuilding) || 0}</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-sm text-gray-600">{t('avgAge2', 'Edad Promedio')}</h4>
              </div>
              <div className="text-2xl text-gray-900">{stats.averageBuildingAge > 0 ? `${Math.round(stats.averageBuildingAge)} ${t('years', 'años')}` : '-'}</div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Gráfico circular (1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-base mb-6 text-center">{t('buildingBooksCompleted', '% libros del edificio completados')}</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 mb-6">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="14"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#3b82f6"
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={`${(stats.completionPercentage / 100) * 439.82} 439.82`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl mb-1">{Math.round(stats.completionPercentage)}%</span>
                  <span className="text-xs text-gray-500">{t('completed', 'Completado')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl text-blue-600 mb-1">{stats.completedBooks}</div>
                  <div className="text-xs text-gray-600">{t('completedBooks', 'Libros completados')}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl text-blue-600 mb-1">{stats.pendingBooks}</div>
                  <div className="text-xs text-gray-600">{t('pending', 'Pendientes')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

