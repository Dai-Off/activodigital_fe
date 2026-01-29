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
} from "~/services/buildingsApi";

export function Statistics() {
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
          <p className="text-xs opacity-90 mb-0.5">{t("totalBuildings")}</p>
          <p className="text-2xl mb-0.5">{stats.totalAssets}</p>
          <p className="text-xs opacity-75"></p>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
          <LucideCircleCheckBig className="w-5 h-5 mb-1.5 opacity-80"></LucideCircleCheckBig>
          <p className="text-xs opacity-90 mb-0.5">{t("compliance")}</p>
          <p className="text-2xl mb-0.5">0%</p>
          <p className="text-xs opacity-75">{t("generalAverage")}</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
          <LucideFileText className="w-5 h-5 mb-1.5 opacity-80"></LucideFileText>
          <p className="text-xs opacity-90 mb-0.5">{t("completedBooks")}</p>
          <p className="text-2xl mb-0.5">{stats.completedBooks}</p>
          <p className="text-xs opacity-75">{t("of")} {stats.totalAssets} {t("buildings")}</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
          <LucideTriangleAlert className="w-5 h-5 mb-1.5 opacity-80"></LucideTriangleAlert>
          <p className="text-xs opacity-90 mb-0.5">{t("activeAlerts")}</p>
          <p className="text-2xl mb-0.5">0</p>
          <p className="text-xs opacity-75"></p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <h3 className="text-sm mb-2">{t("distributionByType")}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-24">
                <p className="text-xs text-gray-700">{t("offices")}</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full flex items-center px-2"
                    style={{ width: "41.6667%" }}
                  >
                    <span className="text-xs text-white">5</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24">
                <p className="text-xs text-gray-700">{t("residential")}</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full flex items-center px-2"
                    style={{ width: "33.3333%" }}
                  >
                    <span className="text-xs text-white">4</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24">
                <p className="text-xs text-gray-700">{t("commercial")}</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-purple-500 h-4 rounded-full flex items-center px-2"
                    style={{ width: "16.6667%" }}
                  >
                    <span className="text-xs text-white">2</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24">
                <p className="text-xs text-gray-700">{t("mixed")}</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-orange-500 h-4 rounded-full flex items-center px-2"
                    style={{ width: "8.33333%" }}
                  >
                    <span className="text-xs text-white">1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <h3 className="text-sm mb-2">{t("keyMetrics")}</h3>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">{t("totalArea")}</span>
                <span className="text-sm">125,450 m²</span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">{t("totalUnits")}</span>
                <span className="text-sm">200</span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">{t("occupancyRate")}</span>
                <span className="text-sm">92%</span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">{t("portfolioValue")}</span>
                <span className="text-sm">€84.5M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm">{t("energyEfficiency")}</h3>
            <Zap className="w-4 h-4 text-yellow-600"></Zap>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl">
              {stats.averageEnergyClass ? stats.averageEnergyClass : "-"}
            </span>
            <span className="text-xs text-gray-500">{t("averageClass")}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm">{t("maintenance")}</h3>
            <Clock className="w-4 h-4 text-blue-600"></Clock>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl">0</span>
            <span className="text-xs text-gray-500">{t("scheduledThisMonth")}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm">{t("averageROI")}</h3>
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
