import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CalendarApiService } from "~/services/calendar";
import {
  type BuildingEvent,
  type EventCategory,
  type EventPriority,
  type EventStatus,
} from "~/types/calendar";
import {
  Calendar,
  TriangleAlert,
  Funnel,
  Wrench,
  FileText,
  ClipboardList,
  Activity,
  Clock,
  Building2,
  Users,
  Lightbulb,
} from "lucide-react";
import { BuildingCalendarLoading } from "./ui/dashboardLoading";

// --- Helpers para UI ---

// 1. Mapeo de estilos basado en prioridad
const getPriorityStyles = (priority: EventPriority) => {
  switch (priority) {
    // La maqueta usa border-red-500 bg-red-50 para urgentes
    case "urgent":
      return "border-red-500 bg-red-50";
    // La maqueta usa border-orange-500 bg-orange-50 para algunos de alta prioridad
    case "high":
      return "border-orange-500 bg-orange-50";
    case "normal":
      return "border-blue-500/50 bg-blue-50";
    case "low":
      return "border-gray-300 bg-white";
    default:
      return "border-gray-300 bg-white";
  }
};

// 2. Mapeo de iconos basado en categoría (Expandido para reflejar la maqueta)
const getCategoryIcon = (category: EventCategory) => {
  switch (category) {
    case "maintenance":
      return <Wrench className="w-3.5 h-3.5 text-orange-600" />;
    case "contract":
      return <FileText className="w-3.5 h-3.5 text-blue-600" />;
    case "audit":
      // Si tuvieras un campo de subcategoría aquí lo usarías. Usaremos Lightbulb por defecto.
      return <Lightbulb className="w-3.5 h-3.5 text-purple-600" />;
    case "operations":
      return <Activity className="w-3.5 h-3.5 text-green-600" />;
    case "general":
      // Usaremos Users para simular una reunión de la comunidad/junta
      return <Users className="w-3.5 h-3.5 text-teal-600" />;
    default:
      return <ClipboardList className="w-3.5 h-3.5 text-gray-600" />;
  }
};

const getCategoryBg = (category: EventCategory) => {
  switch (category) {
    case "maintenance":
      return "bg-orange-100";
    case "contract":
      return "bg-blue-100";
    case "audit":
      return "bg-purple-100";
    case "operations":
      return "bg-green-100";
    case "general":
      return "bg-teal-100";
    default:
      return "bg-gray-100";
  }
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  // Usa "long" para el mes en la agrupación, pero "short" en el detalle del evento
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(date);
};

const getRelativeTime = (isoString: string) => {
  const diff = new Date(isoString).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "Vencido";
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  if (days < 14) return `En ${days} días`;
  if (days < 60) return "En 2 semanas"; // Aproximación simple
  if (days < 90) return "En 1 mes";
  return `En ${Math.round(days / 30)} meses`;
};

// --- Componente para Etiquetas (Badges) ---

interface EventBadgesProps {
  priority: EventPriority;
  status: EventStatus;
  category: EventCategory; // Usamos category para simular la etiqueta secundaria
}

const EventBadges = ({ priority, status, category }: EventBadgesProps) => {
  const isUrgent = priority === "urgent";
  const isPending = status === "pending";

  // Mapeo simple de la categoría para simular la etiqueta secundaria (ej: Financiero, Técnico, etc.)
  const secondaryLabel = {
    maintenance: "Técnico",
    contract: "Legal",
    audit: "Regulatorio", // O Financiero/Técnico, lo dejaremos en Regulatorio por defecto
    operations: "Operativo",
    general: "Administrativo",
  }[category];

  // Estilos base para la etiqueta secundaria
  let secondaryStyle =
    "px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] rounded-full";

  // La maqueta muestra la etiqueta de categoría (ej: Regulatorio/Financiero) Y la de estado (Urgente/Próximo)

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {/* 1. Etiqueta Secundaria/Categoría (si se requiere) */}
      {/* Se puede omitir si la categoría es General y no hay una subcategoría relevante */}
      {category !== "general" && (
        <span className={secondaryStyle}>{secondaryLabel}</span>
      )}

      {/* 2. Etiqueta de Prioridad/Estado */}
      {isUrgent ? (
        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] uppercase rounded-full">
          Urgente
        </span>
      ) : (
        isPending && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full">
            Próximo
          </span>
        )
      )}
    </div>
  );
};

// --- Componente Principal ---

export function BuildingCalendar() {
  const { id: buildingId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<BuildingEvent[]>([]);
  const [filterCategory, setFilterCategory] = useState<EventCategory | "all">(
    "all"
  );

  // Hooks must be called before any conditional returns
  useEffect(() => {
    if (!buildingId) return;
    
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const calendarApi = new CalendarApiService();
        // @ts-ignore - Asumiendo que response.data viene con la estructura BuildingEvent[]
        const response = await calendarApi.getBuildingEvents(buildingId);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [buildingId]);

  const filteredEvents = useMemo(() => {
    return filterCategory === "all"
      ? events
      : events.filter((e) => e.category === filterCategory);
  }, [events, filterCategory]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, BuildingEvent[]> = {};
    filteredEvents.forEach((event) => {
      const date = new Date(event.eventDate);
      const key = new Intl.DateTimeFormat("es-ES", {
        month: "long",
        year: "numeric",
      }).format(date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });
    Object.keys(groups).forEach((key) => {
      groups[key].sort(
        (a, b) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      );
    });
    return groups;
  }, [filteredEvents]);

  const urgentCount = events.filter((e) => e.priority === "urgent").length;

  // Conditional returns after all hooks
  if (!buildingId) return "No se encontró un edificio";
  if (loading) return <BuildingCalendarLoading />;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white rounded-lg p-2 shadow-sm mb-2 flex-shrink-0">
        {/* ... (Header estático de la maqueta) ... */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs text-gray-900">Calendario de Acciones</h2>
              <p className="text-xs text-gray-600">
                {events.length} acciones programadas
              </p>
            </div>
          </div>
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 rounded">
              <TriangleAlert className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs text-red-700">
                {urgentCount} Urgentes
              </span>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <div className="flex items-center gap-1 text-xs text-gray-600 mr-1">
            <Funnel className="w-3 h-3" />
            <span>Filtrar:</span>
          </div>
          {[
            { id: "all", label: "Todas" },
            { id: "maintenance", label: "Mantenimiento" },
            { id: "audit", label: "Auditoría" },
            { id: "contract", label: "Contratos" },
            { id: "operations", label: "Operaciones" }, // Agregado Operaciones
            { id: "general", label: "General" }, // Agregado General
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() =>
                setFilterCategory(filter.id as EventCategory | "all")
              }
              className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                filterCategory === filter.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label} (
              {filter.id === "all"
                ? events.length
                : events.filter((e) => e.category === filter.id).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          {Object.entries(groupedEvents).map(([month, monthEvents]) => (
            <div key={month}>
              {/* Encabezado del Mes */}
              <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-blue-600 px-2 py-1.5 mb-2 rounded-r shadow-sm z-10">
                <h3 className="text-xs text-gray-900 capitalize">{month}</h3>
                <p className="text-xs text-gray-500">
                  {monthEvents.length} acciones
                </p>
              </div>
              <div className="space-y-2 ml-2">
                {monthEvents.map((event, eventIndex, eventArray) => {
                  // Determina si es el último evento del grupo (para eliminar la línea vertical)
                  const isLastEventInGroup =
                    eventIndex === eventArray.length - 1;

                  return (
                    <div key={event.id} className="relative group">
                      {/* Línea de tiempo vertical (solo si no es el último evento del grupo) */}
                      {!isLastEventInGroup && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
                      )}

                      {/* Tarjeta del Evento */}
                      <div
                        className={`relative border-l-4 rounded shadow-sm p-2 hover:shadow-md transition-shadow bg-white ${getPriorityStyles(
                          event.priority
                        )}`}
                      >
                        <div className="flex items-start gap-2">
                          {/* Icono de Categoría */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${getCategoryBg(
                              event.category
                            )}`}
                          >
                            {getCategoryIcon(event.category)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5 mb-0.5">
                              <h4 className="text-xs text-gray-900 truncate">
                                {event.title}
                              </h4>
                              {/* BADGES DINÁMICOS (Punto 3) */}
                              <EventBadges
                                priority={event.priority}
                                status={event.status as EventStatus}
                                category={event.category}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-snug">
                              {event.description || "Sin descripción"}
                            </p>
                            <div className="flex items-center gap-3 text-xs">
                              {/* Fecha */}
                              <div className="flex items-center gap-1 text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span className="">
                                  {formatDate(event.eventDate)}
                                </span>
                                <span className="text-gray-400">
                                  ({getRelativeTime(event.eventDate)})
                                </span>
                              </div>
                              {/* Activo Relacionado */}
                              {event.relatedAsset && (
                                <div className="flex items-center gap-1 text-gray-500 truncate max-w-[120px]">
                                  <Building2 className="w-3 h-3 flex-shrink-0" />
                                  <span
                                    className="truncate"
                                    title={event.relatedAsset}
                                  >
                                    {event.relatedAsset}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex-shrink-0 shadow-sm">
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {Object.keys(groupedEvents).length === 0 && (
            <div className="text-center py-8 text-gray-500 text-xs">
              No hay eventos para mostrar con los filtros actuales.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
