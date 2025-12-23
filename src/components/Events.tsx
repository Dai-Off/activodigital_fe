import { Activity, Calendar, CircleAlertIcon, ClipboardList, ClockIcon, FileText, Lightbulb, Users, Wrench } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { calendarApiService } from "~/services/calendar"
import type { BuildingEvent, EventCategory, EventExecution } from "~/types/calendar"
import { useSearchParams } from "react-router-dom";
import { SkeletonEvents } from "./ui/LoadingSystem";

export const getExecutionBg = (execution: EventExecution) => {
    switch (execution) {
        case "scheduled":
        case "confirmed":
            return "bg-green-100 text-green-700";
        case "pending":
            return "bg-orange-100 text-orange-700";
        case "refused":
            return "bg-purple-100 text-purple-700";
        case "urgent":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const getCategoryIcon = (category: EventCategory) => {
    switch (category) {
        case "maintenance":
            return <Wrench className="w-3.5 h-3.5 text-orange-600" />;
        case "inspections":
            return <CircleAlertIcon className="w-3.5 h-3.5 text-yellow-600" />;
        case "contract":
            return <FileText className="w-3.5 h-3.5 text-blue-600" />;
        case "audit":
            return <Lightbulb className="w-3.5 h-3.5 text-purple-600" />;
        case "operations":
            return <Activity className="w-3.5 h-3.5 text-green-600" />;
        case "general":
            return <Users className="w-3.5 h-3.5 text-teal-600" />;
        case "expiration":
            return <ClockIcon className="w-4 h-4 text-red-600" />;
        default:
            return <ClipboardList className="w-3.5 h-3.5 text-gray-600" />;
    }
};

const getCategoryBg = (category: EventCategory, intecity?: number) => {
    switch (category) {
        case "maintenance":
            return `bg-orange-${intecity || "100"}`;
        case "inspections":
            return `bg-yellow-${intecity || "100"}`;
        case "meeting":
        case "audit":
            return `bg-purple-${intecity || "100"}`;
        case "contract":
            return `bg-blue-${intecity || "100"}`;
        case "operations":
            return `bg-green-${intecity || "100"}`;
        case "general":
            return `bg-yellow-${intecity || "100"}`;
        case "expiration":
            return `bg-red-${intecity || "100"}`;
        default:
            return `bg-gray-${intecity || "100"}`;
    }
};


export const Events = () => {
    const [events, setEvents] = useState<BuildingEvent[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [count, setCount] = useState<number>(0)
    const [currentDate, setCurrentDate] = useState(new Date());

    const [searchParams] = useSearchParams();
    const viewParam = searchParams.get('view') || 'general';

    useEffect(() => {
        setLoading(true);
        Promise.all([
            calendarApiService.getAllEvents()
        ])
            .then(([res1]) => {
                setEvents(res1?.data)
                setCount(res1?.count)
                setLoading(false);
            })
            .catch(() => {
                setEvents([])
                setCount(0)
                setLoading(false);
            });
    }, []);

    const eventsFilter = useMemo(() => {
        if (viewParam === "general" || !viewParam) return events;
        return events.filter(e => e.category === viewParam);
    }, [viewParam, events]);

    const categoryCounts = useMemo(() => {
        return events.reduce((acc, event) => {
            const cat = event.category;
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {} as Record<EventCategory, number>);
    }, [events]);

    let secondaryLabelExecution = {
        scheduled: "Programado",
        urgent: "Urgente",
        pending: "Pendiente",
        confirmed: "Confirmado",
        refused: "Rechazado"
    }

    const formatEventDate = (dateString: string | undefined, type: 'date' | 'time'): string => {
        if (!dateString) return '--';

        const date = new Date(dateString);

        // Validar si la fecha es válida
        if (isNaN(date.getTime())) return '--';

        if (type === 'date') {
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${day}/${month}/${year}`; // Formato DD/MM/YY
        } else {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`; // Formato HH:MM
        }
    };

    const weekDays = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        const day = currentDate.getDay();
        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            return d;
        });
    }, [currentDate]);

    const monthData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const firstDayWeekday = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        return {
            days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            blankDays: Array.from({ length: firstDayWeekday }, (_, i) => i),
            monthName: firstDayOfMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
        };
    }, [currentDate]);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const showData = (events: BuildingEvent[], viewParam: string) => {

        return (
            <>
                {events.map((event, idx) => {
                    let executionValue = event?.execution ? event?.execution : 'pending';
                    let labelExe = secondaryLabelExecution[executionValue as keyof typeof secondaryLabelExecution];

                    if (viewParam === "month") {
                        return (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getCategoryBg(event.category, 500)}`}></div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-900 truncate">{event?.title}</p>
                                        <p className="text-xs text-gray-500">{event?.buildingName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-xs text-gray-500">{formatEventDate(event?.eventDate, 'date')}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${getExecutionBg(executionValue)}`}>{labelExe}</span>
                                    {/* <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">{labelExe}</span> */}
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className={`p-2 rounded-lg flex-shrink-0 ${getCategoryBg(event.category)}`}>
                                    {getCategoryIcon(event.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-900">{event?.title}</p>
                                    <p className="text-xs text-gray-500">{event?.buildingName}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-900">{formatEventDate(event?.eventDate, 'date')}</p>
                                    <p className="text-xs text-gray-500">{formatEventDate(event?.eventDate, 'time')}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ${getExecutionBg(executionValue)}`}>{labelExe}</span>
                            </div>
                        )
                    }
                })
                }
            </>
        )
    }


    const nextWeek = () => {
        const next = new Date(currentDate);
        next.setDate(currentDate.getDate() + 7);
        setCurrentDate(next);
    };

    const prevWeek = () => {
        const prev = new Date(currentDate);
        prev.setDate(currentDate.getDate() - 7);
        setCurrentDate(prev);
    };

    const goToday = () => {
        setCurrentDate(new Date());
    };


    if (loading) return <SkeletonEvents />

    return (
        <>
            <div className="flex-1 overflow-y-auto p-6">
                {['maintenance', 'inspections', 'expiration', 'general'].includes(viewParam) && (<div className="bg-white rounded-xl p-6 shadow-sm"><div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 ">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-600 " />
                    </div>
                    <div>
                        <h2 className="text-lg">Agenda de Eventos</h2>
                        <p className="text-xs text-gray-500">{count} eventos próximos</p>
                    </div>
                </div>
                    <div className="space-y-2">
                        {showData(eventsFilter, viewParam)}
                    </div>
                </div>
                )}

                {viewParam === "week" && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Vista Semanal</h2>
                                    <p className="text-xs text-gray-500">
                                        {weekDays[0].toLocaleDateString('es-ES', { day: 'numeric' })} -
                                        {weekDays[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goToday}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors"
                                >
                                    Hoy
                                </button>
                                <button
                                    onClick={prevWeek}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={nextWeek}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {weekDays.map((date, i) => {
                                const isToday = new Date().toDateString() === date.toDateString();
                                const dateStr = date.toISOString().split('T')[0];
                                const dayEvents = events.filter(e => e.eventDate?.startsWith(dateStr));

                                return (
                                    <div
                                        key={i}
                                        className={`border rounded-lg p-2 min-h-[180px] transition-colors ${isToday ? 'border-orange-500 bg-orange-50/30' : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <div className={`text-center text-xs mb-2 pb-2 border-b ${isToday ? 'border-orange-200' : 'border-gray-200'}`}>
                                            <p className={`${isToday ? 'text-orange-600 font-bold' : 'text-gray-900 font-medium'} capitalize`}>
                                                {date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            {dayEvents.map((event, idx) => (
                                                <div key={idx} className={`p-1.5 rounded text-[10px] border-l-2 ${getExecutionBg(event.execution || 'pending')}`}>
                                                    <p className="font-bold mb-0.5">{formatEventDate(event.eventDate, 'time')}</p>
                                                    <p className="truncate">{event.title}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-semibold mb-2">Eventos de la semana</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <p className="text-xs text-gray-600">Mantenimientos</p>
                                    <p className="text-orange-600 font-bold">{categoryCounts?.maintenance || 0}</p>
                                </div>
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <p className="text-xs text-gray-600">Vencimientos</p>
                                    <p className="text-red-600 font-bold">{categoryCounts?.expiration || 0}</p>
                                </div>
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <p className="text-xs text-gray-600">Auditorías</p>
                                    <p className="text-purple-600 font-bold">{categoryCounts?.audit || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewParam === "month" && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Calendario de Eventos</h2>
                                    <p className="text-xs text-gray-500 capitalize">{monthData.monthName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={goToday} className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50">Hoy</button>
                                <button onClick={prevMonth} className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50">←</button>
                                <button onClick={nextMonth} className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-50">→</button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs text-gray-600 font-medium">
                                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <div key={d} className="p-1">{d}</div>)}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {/* Espacios vacíos mes anterior */}
                                {monthData.blankDays.map(i => (
                                    <div key={`blank-${i}`} className="aspect-square bg-gray-50 border border-transparent rounded p-1"></div>
                                ))}

                                {/* Días del mes */}
                                {monthData.days.map(day => {
                                    const isToday = day === new Date().getDate() &&
                                        currentDate.getMonth() === new Date().getMonth() &&
                                        currentDate.getFullYear() === new Date().getFullYear();

                                    // Filtrar eventos para este día específico
                                    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const dayEvents = events.filter(e => e.eventDate?.startsWith(dateKey));

                                    return (
                                        <div key={day} className={`aspect-square border rounded p-1 text-xs transition-all relative cursor-pointer hover:bg-blue-50 ${isToday ? 'border-blue-400 bg-blue-100' : 'border-gray-200'}`}>
                                            <span className={`absolute top-0.5 left-1 ${isToday ? 'font-bold text-blue-700' : ''}`}>{day}</span>

                                            {/* Puntos indicadores de eventos */}
                                            <div className="absolute bottom-1 left-0 right-0 flex gap-0.5 justify-center">
                                                {dayEvents.slice(0, 3).map((event, idx) => (
                                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${getCategoryBg(event.category, 500)}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3">Próximos eventos</h3>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {showData(events, viewParam)}
                            </div>
                        </div>


                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-semibold mb-2">Eventos del mes</h3>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-gray-600">Contratos</p>
                                    <p className="text-blue-600 font-bold">{categoryCounts?.contract || 0}</p>
                                </div>
                                <div className="p-2 bg-orange-50 rounded-lg text-center">
                                    <p className="text-[10px] text-gray-600 uppercase">Mantenimientos</p>
                                    <p className="text-orange-600 font-bold">{categoryCounts?.maintenance || 0}</p>
                                </div>
                                <div className="p-2 bg-red-50 rounded-lg text-center">
                                    <p className="text-[10px] text-gray-600 uppercase">Vencimientos</p>
                                    <p className="text-red-600 font-bold">{categoryCounts?.expiration || 0}</p>
                                </div>
                                <div className="p-2 bg-purple-50 rounded-lg text-center">
                                    <p className="text-[10px] text-gray-600 uppercase">Reuniones</p>
                                    <p className="text-purple-600 font-bold">{categoryCounts?.general || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )

}