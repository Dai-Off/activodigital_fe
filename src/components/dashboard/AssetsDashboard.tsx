import { useLanguage } from "../../contexts/LanguageContext";
import {
  BuildingsApiService,
  type DashboardStats,
} from "../../services/buildingsApi";
import { useState, useEffect, Fragment } from "react";
import { PanelPrincipal } from "./Inicio/PanelPrincipal";
import { Estadisticas } from "./Inicio/Estadisticas";
import { ActividadReciente } from "./Inicio/ActividadReciente";

export function AssetsDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
                    <div
                      key={i}
                      className="text-center p-3 bg-blue-50 rounded-lg"
                    >
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
        <div className="text-center py-12 text-gray-500">
          {t("errorLoadingStats", "Error al cargar estadísticas")}
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <ActividadReciente stats={stats}></ActividadReciente>
    </Fragment>
  );
}
