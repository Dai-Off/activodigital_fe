import {
  Building2,
  Clock,
  Zap,
  LucideChartColumn,
  LucideCircleCheckBig,
  LucideFileText,
  LucideTriangleAlert,
  LucideTrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { StatisticsLoading } from "~/components/ui/dashboardLoading";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  BuildingsApiService,
  type DashboardStats,
  type Building,
} from "~/services/buildingsApi";

export function Statistics() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      BuildingsApiService.getDashboardStats(),
      BuildingsApiService.getAllBuildings()
    ])
      .then(([statsData, buildingsData]) => {
        setStats(statsData);
        setBuildings(buildingsData);
      })
      .catch((err) => {
        console.error('[Statistics] Error al cargar:', err);
        setStats(null);
        setBuildings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const calculateTotalPortfolioValue = () => {
    if (!buildings || buildings.length === 0) return '-';
    
    const total = buildings.reduce((acc, building) => acc + (building.price || 0), 0);
    
    if (total === 0) return '-';

    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(total);
  };

  if (loading) {
    return <StatisticsLoading />;
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-gray-500">
          {t("errorLoadingStats", "Error al cargar estadísticas")}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 flex items-center gap-2 flex-shrink-0">
        <div className="p-2 bg-blue-100 rounded-lg">
          <LucideChartColumn className="w-5 h-5 text-blue-600"></LucideChartColumn>
        </div>
        <div>
          <h2 className="text-lg">Estadísticas Generales</h2>
          <p className="text-xs text-gray-500">Métricas y KPIs del sistema</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
          <Building2 className="w-5 h-5 mb-1.5 opacity-80"></Building2>
          <p className="text-xs opacity-90 mb-0.5">Total Edificios</p>
          <p className="text-2xl mb-0.5">{stats.totalAssets}</p>
          <p className="text-xs opacity-75"></p>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
          <LucideCircleCheckBig className="w-5 h-5 mb-1.5 opacity-80"></LucideCircleCheckBig>
          <p className="text-xs opacity-90 mb-0.5">Cumplimiento</p>
          <p className="text-2xl mb-0.5">0%</p>
          <p className="text-xs opacity-75">Promedio general</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
          <LucideFileText className="w-5 h-5 mb-1.5 opacity-80"></LucideFileText>
          <p className="text-xs opacity-90 mb-0.5">Libros Completados</p>
          <p className="text-2xl mb-0.5">{stats.completedBooks}</p>
          <p className="text-xs opacity-75">de {stats.totalAssets} edificios</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
          <LucideTriangleAlert className="w-5 h-5 mb-1.5 opacity-80"></LucideTriangleAlert>
          <p className="text-xs opacity-90 mb-0.5">Alertas Activas</p>
          <p className="text-2xl mb-0.5">{stats.nextEventsCount}</p>
          <p className="text-xs opacity-75"></p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <h3 className="text-sm mb-2">Distribución por Tipo</h3>
          <div className="space-y-2">
            {[
              { label: 'Residencial', value: stats.typologyDistribution.residential, color: 'bg-green-500' },
              { label: 'Comercial', value: stats.typologyDistribution.commercial, color: 'bg-purple-500' },
              { label: 'Mixto', value: stats.typologyDistribution.mixed, color: 'bg-orange-500' },
            ].map((item) => {
              const percentage = stats.totalAssets > 0 ? (item.value / stats.totalAssets) * 100 : 0;
              return (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-24">
                    <p className="text-xs text-gray-700">{t(item.label.toLowerCase(), item.label)}</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`${item.color} h-4 rounded-full flex items-center px-2 transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      >
                        {item.value > 0 && (
                          <span className="text-xs text-white">{item.value}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <h3 className="text-sm mb-2">Métricas Clave</h3>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Superficie Total</span>
                <span className="text-sm">
                  {stats.totalSurfaceArea > 0 
                    ? `${new Intl.NumberFormat('es-ES').format(stats.totalSurfaceArea)} m²`
                    : '-'}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Unidades Totales</span>
                <span className="text-sm">
                  {stats.totalAssets > 0 
                    ? (stats.totalAssets * (stats.averageUnitsPerBuilding || 0))
                    : '-'}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Tasa Ocupación</span>
                <span className="text-sm">
                  {stats.averageOccupancy && stats.averageOccupancy > 0 ? `${stats.averageOccupancy}%` : '-'}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Valor Portfolio</span>
                <span className="text-sm">
                  {calculateTotalPortfolioValue()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm">Eficiencia Energética</h3>
            <Zap className="w-4 h-4 text-yellow-600"></Zap>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl">
              {stats.averageEnergyClass ? stats.averageEnergyClass : "-"}
            </span>
            <span className="text-xs text-gray-500">Promedio de clase</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm">Mantenimientos</h3>
            <Clock className="w-4 h-4 text-blue-600"></Clock>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl">{stats.nextEventsCount}</span>
            <span className="text-xs text-gray-500">Programados este mes</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm">ROI Medio</h3>
            <LucideTrendingUp className="w-4 h-4 text-green-600"></LucideTrendingUp>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl">-</span>
            <span className="text-xs text-green-600"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
