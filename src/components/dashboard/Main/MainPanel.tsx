import {
  ArrowRight,
  Building2,
  Calendar,
  CircleCheckBig,
  Clock,
  FileText,
  LucideArrowUpRight,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainPanelLoading } from "~/components/ui/dashboardLoading";
import { useLanguage } from "~/contexts/LanguageContext";
import { useNotifications } from "~/contexts/NotificationContext";
import {
  BuildingsApiService,
  type DashboardStats,
} from "~/services/buildingsApi";
import { getTimeRemaining } from "~/utils/getTimeRemaining";

export function MainPanel() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const {
    fetchUserNotifications,
    refreshUnreadCount,
    UnreadNotifications,
    unreadNotifications,
    notifications,
    unreadCount,
  } = useNotifications();
  const [buildingNames, setBuildingNames] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    BuildingsApiService.getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
    fetchUserNotifications();
    UnreadNotifications();
    refreshUnreadCount();
  }, [fetchUserNotifications, UnreadNotifications, refreshUnreadCount]);

  useEffect(() => {
    const fetchBuildingNames = async () => {
      if (!unreadNotifications || unreadNotifications.length === 0) return;

      const uniqueIds = [
        ...new Set(unreadNotifications.map((n) => n.buildingId)),
      ];

      const idsToFetch = uniqueIds.filter((id) => !buildingNames[id]);

      if (idsToFetch.length === 0) return;

      try {
        const promises = idsToFetch.map((id) =>
          BuildingsApiService.getBuildingById(id).catch(() => null)
        );

        const buildings = await Promise.all(promises);

        const newNames: Record<string, string> = {};
        buildings.forEach((b) => {
          if (b) newNames[b.id] = b.name;
        });

        setBuildingNames((prev) => ({ ...prev, ...newNames }));
      } catch (error) {
        console.error(
          "Error cargando nombres de edificios en MainPanel",
          error
        );
      }
    };

    fetchBuildingNames();
  }, [unreadNotifications]);

  if (loading) {
    return <MainPanelLoading />;
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

  let urgentCount = unreadNotifications.filter((not) => not.priority > 2);
  let percentageBooks = 0;
  if (stats.pendingBooks || stats.completedBooks) {
    percentageBooks = stats.pendingBooks / stats.completedBooks;
  }

  /* Componentes anidados */
  function PendingAlerts({
    text,
    nameBuilding,
    date,
    value,
  }: {
    text: string;
    nameBuilding: string;
    date: string;
    value: number;
  }) {
    const values: any = {
      3: {
        name: "URGENTE",
        icon: <TriangleAlert className="w-4 h-4 text-red-600"></TriangleAlert>,
        color: "bg-red-600",
      },
      2: {
        name: "PRÓXIMO",
        icon: <Clock className="w-4 h-4 text-orange-600"></Clock>,
        color: "bg-orange-600",
      },
      1: {
        name: "PENDIENTE",
        icon: <FileText className="w-4 h-4 text-yellow-600"></FileText>,
        color: "bg-yellow-600",
      },
    };
    date = getTimeRemaining(date);
    console.log(value);
    return (
      <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-100 rounded">
        <div className="p-1.5 bg-red-100 rounded flex-shrink-0">
          {values[value].icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs mb-0.5">{text}</p>
              <p className="text-xs text-gray-600">
                {nameBuilding} - {date}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-0.5 ${values[value].color} text-white rounded flex-shrink-0`}
            >
              {values[value].name}
            </span>
          </div>
        </div>
      </div>
    );
  }

  function PerformanceBuilding({
    name,
    type,
    percentage,
  }: {
    name: string;
    type: string;
    percentage: number;
  }) {
    let BarColor = "bg-green-500";
    if (percentage < 80 && percentage > 60) {
      BarColor = "bg-amber-500";
    } else if (percentage <= 60) {
      BarColor = "bg-red-500";
    }
    return (
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{name}</span>
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
              {type}
            </span>
          </div>
          <span className="text-xs">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`${BarColor} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  }

  function RecentActivity({
    text,
    type,
    nameBuilding,
    date,
  }: {
    text: string;
    nameBuilding: string;
    date: string;
    type: number;
  }) {
    const ColorCase: any = {
      1: "bg-blue-600",
      2: "bg-green-600",
      3: "bg-purple-600",
      4: "bg-orange-600",
      5: "bg-yellow-600",
      6: "bg-red-600",
      7: "bg-blue-600",
      8: "bg-blue-600",
      9: "bg-purple-600",
    };
    return (
      <div className="flex items-start gap-2">
        <div
          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ColorCase[type]}`}
        ></div>
        <div className="flex-1 min-w-0">
          <p className="text-xs mb-0.5">{text}</p>
          <p className="text-xs text-gray-500">{nameBuilding}</p>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Layout Principal */}
      {/* 4 KPIs superiores */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">
                {t("Total Buildings", "Total Edificios")}
              </p>
              <p className="text-2xl mb-0.5">{stats.totalAssets}</p>
              <div className="flex items-center gap-0.5 text-xs text-green-600">
                <LucideArrowUpRight className="w-3 h-3"></LucideArrowUpRight>
                <span>+2 este mes</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600"></Building2>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">
                {t("Compliance", "Cumplimiento")}
              </p>
              <p className="text-2xl mb-0.5">{stats.totalAssets}%</p>
              <div className="flex items-center gap-0.5 text-xs text-green-600">
                <LucideArrowUpRight className="w-3 h-3"></LucideArrowUpRight>
                <span>+5% vs. anterior</span>
              </div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CircleCheckBig className="w-5 h-5 text-green-600"></CircleCheckBig>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">
                {t("Pending Alerts", "Alertas Pendientes")}
              </p>
              <p className="text-2xl mb-0.5">{unreadCount}</p>
              <div className="flex items-center gap-0.5 text-xs text-red-600">
                <LucideArrowUpRight className="w-3 h-3"></LucideArrowUpRight>
                <span>{urgentCount.length} urgentes</span>
              </div>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <TriangleAlert className="w-5 h-5 text-orange-600"></TriangleAlert>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">
                {t("Completed Books", "Libros Completos")}
              </p>
              <p className="text-2xl mb-0.5">
                {stats.pendingBooks} / {stats.completedBooks}
              </p>
              <div className="flex items-center gap-0.5 text-xs text-blue-600">
                <span>{percentageBooks}% completado</span>
              </div>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600"></FileText>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque KPIs inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-shrink-0">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm">Alertas Urgentes</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                Ver todas
              </button>
            </div>
            <div className="p-3 space-y-2">
              {notifications.map((not) => {
                if (not.priority > 0) {
                  return (
                    <PendingAlerts
                      key={not.id}
                      date={not.expiration as string}
                      nameBuilding={buildingNames[not.buildingId]}
                      text={not.title}
                      value={not.priority}
                    />
                  );
                }
              })}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm">Rendimiento por Edificio</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                Ver todas
              </button>
            </div>
            <div className="p-3 overflow-y-auto" style={{ maxHeight: "320px" }}>
              <div className="space-y-3">
                <PerformanceBuilding
                  name="Plaza Shopping"
                  type="Comercial"
                  percentage={79}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 min-h-0">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-3 text-white flex-shrink-0">
            <h3 className="text-sm mb-2 opacity-90">Resumen del Sistema</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-blue-400/30">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 opacity-80"></Zap>
                  <span className="text-xs">Eficiencia Energética</span>
                </div>
                <span className="text-sm">
                  {stats.averageEnergyClass ? stats.averageEnergyClass : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-blue-400/30">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 opacity-80"></Users>
                  <span className="text-xs">Ocupación Media</span>
                </div>
                <span className="text-sm">-</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-blue-400/30">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 opacity-80"></FileText>
                  <span className="text-xs">Docs. Pendientes</span>
                </div>
                <span className="text-sm">
                  {stats.pendingBooks ? stats.pendingBooks : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 opacity-80"></Calendar>
                  <span className="text-xs">Próximos eventos</span>
                </div>
                <span className="text-sm">-</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
            <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-sm">Actividad Reciente</h3>
            </div>
            <div className="p-3 flex-1 overflow-auto">
              <div className="space-y-3">
                <RecentActivity
                  date="Hace 2h"
                  nameBuilding="Plaza Shopping"
                  text="Actualiza libro del edificio"
                  type={7}
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-shrink-0">
            <div className="px-3 py-2 border-b border-gray-100">
              <h3 className="text-sm">Acciones Rápidas</h3>
            </div>
            <div className="p-3 space-y-1.5">
              <button
                onClick={() => {
                  navigation("/buildings/create");
                }}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors border border-gray-200 group"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-blue-600"></Building2>
                  <span className="text-xs text-gray-900">Nuevo Edificio</span>
                </div>

                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors"></ArrowRight>
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors border border-gray-200 group">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-600"></FileText>
                  <span className="text-xs text-gray-900">Generar Informe</span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors"></ArrowRight>
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors border border-gray-200 group">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600"></Calendar>
                  <span className="text-xs text-gray-900">
                    Programar Inspección
                  </span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors"></ArrowRight>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
