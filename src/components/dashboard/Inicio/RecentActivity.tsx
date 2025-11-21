import {
  Building2,
  LucideActivity,
  LucideArrowUpRight,
  LucideCalendar,
  LucideChartColumn,
  LucideCircleCheckBig,
  LucideFileText,
  LucideTrendingUp,
  LucideTriangleAlert,
  LucideUsers,
  LucideZap,
} from "lucide-react";

export function RecentActivity() {
  interface activityInterface {
    type: number;
    title: string;
    nameUser: string;
    date: string;
    nameBuilding: string;
  }
  function Activity({
    type,
    title,
    nameUser,
    nameBuilding,
    date,
  }: activityInterface) {
    let TypeActivity: any = {
      1: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
      2: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
      3: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
      4: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
      5: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
      6: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
      7: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
      8: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
      9: (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
          <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
        </div>
      ),
    };
    console.log(type);
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
          <span className="text-xs text-gray-500">28 actividades</span>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-2">
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
              <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Ana García</span>
                <span className="text-gray-600">
                  {" "}
                  Actualizó certificado energético
                </span>
              </p>
              <p className="text-xs text-gray-500">Plaza Shopping</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">5 min</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
              <LucideArrowUpRight className="w-4 h-4 text-green-600"></LucideArrowUpRight>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Carlos Rodríguez</span>
                <span className="text-gray-600"> Subió nuevo documento</span>
              </p>
              <p className="text-xs text-gray-500">Torre Norte</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">15 min</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100">
              <LucideCircleCheckBig className="w-4 h-4 text-purple-600"></LucideCircleCheckBig>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">María López</span>
                <span className="text-gray-600">
                  {" "}
                  Completó mantenimiento HVAC
                </span>
              </p>
              <p className="text-xs text-gray-500">Edificio Central</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">1h</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-100">
              <LucideChartColumn className="w-4 h-4 text-orange-600"></LucideChartColumn>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Pedro Martínez</span>
                <span className="text-gray-600">
                  {" "}
                  Generó informe financiero
                </span>
              </p>
              <p className="text-xs text-gray-500">Plaza Shopping</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">2h</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-yellow-100">
              <LucideCalendar className="w-4 h-4 text-yellow-600"></LucideCalendar>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Laura Sánchez</span>
                <span className="text-gray-600"> Programó inspección</span>
              </p>
              <p className="text-xs text-gray-500">Torre Norte</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">3h</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
              <LucideTriangleAlert className="w-4 h-4 text-red-600"></LucideTriangleAlert>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Ana García</span>
                <span className="text-gray-600"> Creó nueva alerta</span>
              </p>
              <p className="text-xs text-gray-500">Edificio Central</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">5h</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
              <Building2 className="w-4 h-4 text-blue-600"></Building2>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Juan Torres</span>
                <span className="text-gray-600">
                  {" "}
                  Actualizó libro del edificio
                </span>
              </p>
              <p className="text-xs text-gray-500">Plaza Shopping</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">Ayer</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
              <LucideCircleCheckBig className="w-4 h-4 text-gray-600"></LucideCircleCheckBig>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">María López</span>
                <span className="text-gray-600"> Aprobó presupuesto</span>
              </p>
              <p className="text-xs text-gray-500">Torre Norte</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">2d</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
              <LucideFileText className="w-4 h-4 text-blue-600"></LucideFileText>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Pedro Martínez</span>
                <span className="text-gray-600">
                  {" "}
                  Modificó contrato de alquiler
                </span>
              </p>
              <p className="text-xs text-gray-500">Edificio Central</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">2d</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
              <LucideTriangleAlert className="w-4 h-4 text-red-600"></LucideTriangleAlert>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Laura Sánchez</span>
                <span className="text-gray-600"> Registró incidencia</span>
              </p>
              <p className="text-xs text-gray-500">Plaza Shopping</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">3d</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
              <LucideTrendingUp className="w-4 h-4 text-blue-600"></LucideTrendingUp>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Carlos Rodríguez</span>
                <span className="text-gray-600">
                  {" "}
                  Actualizó datos financieros
                </span>
              </p>
              <p className="text-xs text-gray-500">Torre Norte</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">3d</span>
          </div>
          <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100">
              <LucideZap className="w-4 h-4 text-purple-600"></LucideZap>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-0.5">
                <span className="text-gray-900">Ana García</span>
                <span className="text-gray-600">
                  {" "}
                  Completó inspección eléctrica
                </span>
              </p>
              <p className="text-xs text-gray-500">Edificio Central</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">4d</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Actualizaciones</p>
              <p className="text-xl">12</p>
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
              <p className="text-xl">8</p>
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
              <p className="text-xl">3</p>
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
              <p className="text-xl">5</p>
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
