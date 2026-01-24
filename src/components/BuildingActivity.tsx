import { useEffect, useState } from "react";
import { getTrazability, type trazabilityList } from "~/services/trazability";
import { formatofechaCorta } from "~/utils/fechas";
import { timeAgo } from "~/utils/timeAgo";
import { BuildingActivityLoading } from "./ui/dashboardLoading";
import { useParams } from "react-router-dom";

export function BuildingActivity() {
  const [activity, setActivity] = useState<trazabilityList[] | undefined>([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<any>();

  useEffect(() => {
    if (!id) return;
    getTrazability(id)
      .then((data) => setActivity(data.data))
      .catch((error) => {
        console.error("Error al cargar la actividad reciente:", error);
        setActivity(undefined);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <BuildingActivityLoading />;
  }

  if (!activity || activity.length === 0) {
    return (
      <div className="text-center pt-4">
        No se ha encontrado actividad reciente para este edificio.
      </div>
    );
  }

  function getActivityNumber(activity: string) {
    const ActionsValues = {
      "ACTUALIZAR O MODIFICAR DOCUMENTOS": 1,
      "SUBIR DOCUMENTOS": 2,
      "COMPLETAR MANTENIMIENTO": 3,
      "GENERAR INFORMES": 4,
      "PROGRAMAR EVENTOS": 5,
      ALERTAS: 6,
      "ACTUALIZAR LIBRO DEL EDIFICIO": 7,
      "APROBAR PRESUPUESTO": 8,
      "ACTUALIZAR DATOS FINANCIEROS": 9,
      "COMPLETAR INSPECCION ELECTRICA": 10,
      CREAR: 11,
      ELIMINAR: 12,
      CARGA: 13,
      APROBAR: 14,
      RECHAZAR: 15,
    };

    return ActionsValues[activity as keyof typeof ActionsValues] || 0;
  }

  function RecentActivity({
    text,
    type,
    date,
  }: {
    text: string;
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
      8: "bg-gray-600",
      9: "bg-blue-600",
      10: "bg-purple-600",
      11: "bg-green-600",
      12: "bg-red-600",
      13: "bg-yellow-600",
      14: "bg-gray-600",
      15: "bg-red-600",
    };

    date = formatofechaCorta(date);
    date = timeAgo(date);
    return (
      <div className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50">
        <div
          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${ColorCase[type]}`}
        ></div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-900">{text}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden mt-2">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="bg-white rounded-lg p-3 shadow-sm h-full">
            <h2 className="text-sm mb-3">Actividad Reciente</h2>
            <div className="space-y-2">
              {activity.map((act) => {
                return (
                  <RecentActivity
                    key={act.id}
                    date={act.createdAt}
                    text={act.description || "No hay descripción"}
                    type={getActivityNumber(act.action || "")}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
