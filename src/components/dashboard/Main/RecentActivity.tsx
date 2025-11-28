import {
  ArrowUpRight,
  Building2,
  Calendar,
  ChartColumn,
  LucideActivity,
  LucideArrowUpRight,
  LucideCircleCheckBig,
  LucideFileText,
  LucideTrendingUp,
  LucideTriangleAlert,
  LucideUsers,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { RecentActivityLoading } from "~/components/ui/dashboardLoading";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  BuildingsApiService,
  type DashboardStats,
} from "~/services/buildingsApi";
import { getTrazability, type trazabilityList } from "~/services/trazability";
import { formatofechaCorta, howTimeWas } from "~/utils/fechas";
import { capitalize } from "~/utils/funciones.utils";

export function RecentActivity() {
  interface activityInterface {
    type?: number;
    title: string;
    nameUser: string;
    date: string;
    nameBuilding: string;
  }

  interface listDetailsTrazability {
    activeUsers: number;
    completed: number;
    alerts: number;
    updates: number;
  }

  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<trazabilityList[]>([]);
  const [totales, setTotales] = useState<listDetailsTrazability>({
    activeUsers: 0,
    completed: 0,
    alerts: 0,
    updates: 0,
  });
  const [loading, setLoading] = useState(true);

  function getActivityNumber(activity: string) {
    const ActionsValues = {
      'ACTUALIZAR O MODIFICAR DOCUMENTOS': 1,
      'SUBIR DOCUMENTOS': 2,
      'COMPLETAR MANTENIMIENTO': 3,
      'GENERAR INFORMES': 4,
      'PROGRAMAR EVENTOS': 5,
      ALERTAS: 6,
      'ACTUALIZAR LIBRE DEL EDIFICIO': 7,
      'APROBAR PRESUPUESTO': 8,
      'ACTUALIZAR DATOS FINANCIEROS': 9,
      'COMPLETAR INSPECCION ELECTRICA': 10,
      CREAR: 11,
      ELIMINAR: 0,
      APROBAR: 0,
      RECHAZAR: 0,
    }

    return ActionsValues[activity as keyof typeof ActionsValues] || 0;
  }

  useEffect(() => {
    BuildingsApiService.getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getTrazability()
      .then((res) => {
        const { activeUsers, completed, alerts, updates, data } = res;
        setHistory(data);

        setTotales({
          activeUsers: activeUsers,
          completed: completed,
          alerts: alerts,
          updates: updates,
        });
      })
      .catch((err) => console.log(err))
  }, []);

  if (loading) {
    return <RecentActivityLoading />;
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

  function Activity({
    type,
    title,
    nameUser,
    nameBuilding,
    date,
  }: activityInterface) {
    /* Tipos de actividad reciente:
    
    Nota: las tonalidades son: 600 para el tono oscuro del svg y 100 para el fondo del svg

    Caso 1: actualizar o modificar documentos | Icono: FileText | color: blue

    Caso 2: subir documentos | Icono: ArrowUpRight | color: green

    Caso 3: completar mantenimiento | Icono: CircleCheckBig | color: purple

    Caso 4: generar informes | Icono: ChartColumn | color: orange

    Caso 5: programar eventos | Icono: Calendar | color: yellow

    Caso 6: Alertas | Icono: TriangleAlert | color: red

    Caso 7: actualizar libro del edificio | Icono: Building2 | color: blue

    Caso 8: aprobar presupuesto | Icono: CircleCheckBig | color: gray

    Caso 9: actualizar datos financieros | Icono: TrendingUp | color: blue

    Caso 10: completar inspección eléctrica | Icono: Zap | color: purple

    Caso 11: Crear | Icono: ArrowUpRight | color: green
    
    */

    let TypeActivity: any = {
      1: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
      2: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
          <LucideArrowUpRight className="w-4 h-4 text-green-600"></LucideArrowUpRight>
        </div>
      ),
      3: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100">
          <LucideCircleCheckBig className="w-4 h-4 text-purple-600"></LucideCircleCheckBig>
        </div>
      ),
      4: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-100">
          <ChartColumn className="w-4 h-4 text-orange-600"></ChartColumn>
        </div>
      ),
      5: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-yellow-100">
          <Calendar className="w-4 h-4 text-yellow-600"></Calendar>
        </div>
      ),
      6: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
          <TriangleAlert className="w-4 h-4 text-red-600"></TriangleAlert>
        </div>
      ),
      7: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <Building2 className="w-4 h-4 text-blue-600"></Building2>
        </div>
      ),
      8: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
          <LucideCircleCheckBig className="w-4 h-4 text-gray-600"></LucideCircleCheckBig>
        </div>
      ),
      9: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideTrendingUp className="w-4 h-4 text-blue-600"></LucideTrendingUp>
        </div>
      ),
      10: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100">
          <Zap className="w-4 h-4 text-purple-600"></Zap>
        </div>
      ),
      11: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
          <ArrowUpRight className="w-4 h-4 text-green-600"></ArrowUpRight>
        </div>
      ),
    };

    return (
      <div className="cursor-pointer flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
        {type ? TypeActivity[type] : TypeActivity[1]}
        <div className="flex-1 min-w-0">
          <p className="text-xs mb-0.5">
            <span className="text-gray-900">{capitalize(nameUser)}</span>
            <span className="text-gray-600"> {title}</span>
          </p>
          <p className="text-xs text-gray-500">{nameBuilding}</p>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0" title={formatofechaCorta(date)}>{howTimeWas(date)}</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 flex items-center gap-2 flex-shrink-0">
        <div className="p-2 bg-green-100 rounded-lg">
          <LucideActivity className="w-5 h-5 text-green-600"></LucideActivity>
        </div>
        <div>
          <h2 className="text-lg">Actividad Reciente del Sistema</h2>
          <p className="text-xs text-gray-500">
            Todas las acciones y eventos recientes
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <span className="text-sm">Últimas 24 horas</span>
          <span className="text-xs text-gray-500">{history?.length} {history.length > 1 ? 'actividades': "actividad"}</span>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {history && history.length > 0 ? (
            history?.map((act, idx) => (
              <Activity
                key={idx}
                type={getActivityNumber(act.action || '')}
                date={act.createdAt}
                nameBuilding={act.building?.name || 'Edificio Desconocido'}
                nameUser={act?.user?.fullName || 'Usuario Desconocido'}
                title={act.description || 'Actividad sin descripción'}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-12">
              No hay actividades recientes
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Actualizaciones</p>
              <p className="text-xl">{totales?.updates}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
            </div>
          </div>  
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Completadas</p>
              <p className="text-xl">{totales?.completed}</p>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <LucideCircleCheckBig className="w-4 h-4 text-green-600"></LucideCircleCheckBig>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Alertas</p>
              <p className="text-xl">{totales?.alerts}</p>
            </div>
            <div className="p-2 bg-orange-50 rounded">
              <LucideTriangleAlert className="w-4 h-4 text-orange-600"></LucideTriangleAlert>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Usuarios Activos</p>
              <p className="text-xl">{totales?.activeUsers}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded">
              <LucideUsers className="w-4 h-4 text-purple-600"></LucideUsers>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
