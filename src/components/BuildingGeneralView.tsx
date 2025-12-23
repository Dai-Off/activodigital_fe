import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowUpRight,
  Bell,
  Book,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  Droplet,
  Euro,
  Eye,
  FileCheck,
  FileText,
  Flame,
  Hash,
  House,
  Image,
  Lightbulb,
  MapPin,
  Scale,
  Shield,
  Target,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Wrench,
  Zap,
} from "lucide-react";
import { Chevron } from "react-day-picker";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ServiceInvoicesService,
  type MonthlyServiceCosts,
} from "~/services/serviceInvoices";

export function BuildingGeneralView() {
  interface ChartData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
  }

  const { id: buildingId } = useParams<{ id: string }>();

  const [monthlyCosts, setMonthlyCosts] = useState<MonthlyServiceCosts | null>(
    null
  );
  const [loadingCosts, setLoadingCosts] = useState(false);
  const [costsError, setCostsError] = useState<string | null>(null);

  const data: ChartData[] = [
    { name: "Sector A", value: 400, color: "#10b981" }, // Verde
    { name: "Sector B", value: 300, color: "#3b82f6" }, // Azul
    { name: "Sector C", value: 200, color: "#f59e0b" }, // Amarillo/Ámbar
    { name: "Sector D", value: 100, color: "#ef4444" }, // Rojo
  ];

  const innerRadius = 30; // 30px
  const outerRadius = 50; // 50px

  const COLORS = data.map((d) => d.color);

  const formatCurrency = (value: number | undefined) => {
    if (!value || Number.isNaN(value)) return "€0";
    return `€${value.toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const totalMonth = monthlyCosts?.total ?? 0;
  const estimatedYearTotal = totalMonth * 12;

  useEffect(() => {
    if (!buildingId) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12

    setLoadingCosts(true);
    setCostsError(null);

    ServiceInvoicesService.getMonthlyCostsForBuilding(buildingId, year, month)
      .then((costs) => {
        setMonthlyCosts(costs);
      })
      .catch((error: unknown) => {
        console.error("Error cargando costes mensuales:", error);
        setCostsError(
          "No se pudieron cargar los costes mensuales. Inténtalo más tarde."
        );
      })
      .finally(() => {
        setLoadingCosts(false);
      });
  }, [buildingId]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto mt-2 pr-1">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5 space-y-2">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Image className="w-3.5 h-3.5 text-gray-600" />
                <h3 className="text-xs">Imágenes del Edificio</h3>
              </div>
              <div className="relative w-full h-[140px] bg-gray-100 rounded overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1758113107218-6fbb090db3ff?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjBleHRlcmlvcnxlbnwxfHx8fDE3NjI3MjAxMjR8MA&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080"
                  alt="Plaza Shopping"
                  className="w-full h-full object-cover"
                />
                <button className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors">
                  <Chevron className=" w-3.5 h-3.5" />
                </button>
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                  1 / 2
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-blue-600 rounded"></div>
                <h3 className="text-xs text-black">Información General</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div
                  data-slot="card"
                  className="bg-card border-gray-200 text-card-foreground flex flex-col gap-6 rounded-xl border p-3"
                >
                  <h4 className="text-xs text-gray-500 mb-2">
                    Información General
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Año</span>
                      <span className="text-sm text-gray-900">1990</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Plantas</span>
                      <span className="text-sm text-gray-900">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Tipo</span>
                      <span className="text-sm text-gray-900">Comercial</span>
                    </div>
                  </div>
                </div>
                <div
                  data-slot="card"
                  className="bg-card border-gray-200 text-card-foreground flex flex-col gap-6 rounded-xl border p-3"
                >
                  <h4 className="text-xs text-gray-500 mb-2">
                    Eficiencia Energética
                  </h4>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded flex items-center justify-center text-white text-sm bg-orange-500">
                      D
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">85.42 kWh/m²·año</p>
                      <p className="text-xs text-gray-500">kWh/m²·año</p>
                    </div>
                  </div>
                </div>
                <div
                  data-slot="card"
                  className="bg-card border-gray-200 text-card-foreground flex flex-col gap-6 rounded-xl border p-3"
                >
                  <h4 className="text-xs text-gray-500 mb-2">
                    Ocupación del Activo
                  </h4>
                  <div className="mb-2">
                    <span className="text-xl text-gray-900">89%</span>
                    <span className="text-xs text-gray-500 ml-1.5">
                      ocupado
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: "89%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-orange-600 rounded"></div>
                <h3 className="text-xs text-black">Estado Técnico</h3>
              </div>
              <div className="space-y-1.5">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded p-2 text-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 bg-white/10 rounded">
                        <Book className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs mb-0.5">Libro del Edificio</h4>
                        <p className="text-xs text-blue-100">
                          100% completado • 08/11/2024
                        </p>
                      </div>
                    </div>
                    <button className="bg-white text-blue-600 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-50 transition-colors whitespace-nowrap text-xs">
                      <Eye className="w-3 h-3" />
                      Ver Libro
                    </button>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded p-2 text-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 bg-white/10 rounded">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs mb-0.5">
                          Certificados Energéticos
                        </h4>
                        <p className="text-xs text-blue-100">
                          2 certificados • 2 vigentes
                        </p>
                      </div>
                    </div>
                    <button className="bg-white text-blue-600 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-50 transition-colors whitespace-nowrap text-xs">
                      <Eye className="w-3 h-3" />
                      Ver Certificados
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Wrench className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-xs">Plan de Mantenimiento</h3>
                  </div>
                  <div className="h-[120px] mb-1.5">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          dataKey="value"
                          nameKey="name"
                          cx="50%" // Centro X
                          cy="50%" // Centro Y
                          innerRadius={innerRadius} // Radio interior (para crear el agujero)
                          outerRadius={outerRadius} // Radio exterior
                          fill="#8884d8" // Color de relleno por defecto
                          paddingAngle={0} // Sin padding entre sectores
                          stroke="#fff" // Borde blanco como en tu SVG
                          // startAngle={90} // Puedes ajustar el ángulo de inicio si es necesario
                          // endAngle={-270} // Puedes ajustar el ángulo final si es necesario
                        >
                          {data.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              // Si quieres manejar el tabindex como en tu SVG
                              tabIndex={-1}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "rgb(16, 185, 129)" }}
                      ></div>
                      <span className="text-gray-700">Completado: 40%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "rgb(59, 130, 246)" }}
                      ></div>
                      <span className="text-gray-700">En curso: 25%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "rgb(245, 158, 11)" }}
                      ></div>
                      <span className="text-gray-700">Programado: 20%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: " rgb(239, 68, 68)" }}
                      ></div>
                      <span className="text-gray-700">Atrasado: 15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-indigo-600 rounded"></div>
                <h3 className="text-xs text-black">Ubicación</h3>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-900">
                        Carretera de Miraflores, Colmenar Viejo
                      </p>
                      <p className="text-xs text-gray-500">
                        Colmenar Viejo, Madrid
                      </p>
                    </div>
                  </div>
                  <div className="h-[80px] bg-gray-100 rounded flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-5 h-5 mx-auto mb-0.5 text-gray-400" />
                      <p className="text-xs">Vista del mapa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-blue-600 rounded"></div>
                <h3 className="text-xs text-black">Calendario de Acciones</h3>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-xs text-gray-900">Próximas Acciones</h3>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="p-1.5 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center gap-1 mb-0.5">
                      <TriangleAlert className="w-3 h-3 text-red-600" />
                      <p className="text-xs text-red-900">Urgentes</p>
                    </div>
                    <p className="text-xs text-red-700">1</p>
                  </div>
                  <div className="p-1.5 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <p className="text-xs text-blue-900">Este Mes</p>
                    </div>
                    <p className="text-xs text-blue-700">12</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-700 mb-1">
                    Acciones Prioritarias:
                  </p>
                  <div className="flex items-center justify-between p-1.5 rounded text-xs bg-orange-50 border border-orange-200">
                    <span className="text-gray-700 truncate flex-1 flex items-center gap-0.5">
                      Contrato Local 101
                    </span>
                    <span className="ml-1.5 text-orange-700">17d</span>
                  </div>
                </div>
                <button className="w-full mt-2 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                  Ver Calendario Completo
                </button>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-red-600 rounded"></div>
                <h3 className="text-xs text-black">Seguimiento y Alertas</h3>
              </div>
              <div className="space-y-1.5">
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-xs">Actividad Reciente</h3>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0 bg-green-500"></div>
                      <div>
                        <p className="text-xs text-gray-900">CEE renovado</p>
                        <p className="text-xs text-gray-500">hace 2 días</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0 bg-blue-500"></div>
                      <div>
                        <p className="text-xs text-gray-900">
                          Mantenimiento HVAC completado
                        </p>
                        <p className="text-xs text-gray-500">hace una semana</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0 bg-orange-500"></div>
                      <div>
                        <p className="text-xs text-gray-900">
                          Inspección de ascensor programada
                        </p>
                        <p className="text-xs text-gray-500">en 3 días</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bell className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-xs">Próximas Alertas</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 p-1.5 rounded bg-red-50 text-red-600">
                      <TriangleAlert className="w-3 h-3 flex-shrink-0" />
                      <p className="text-xs text-gray-900">
                        Revisión de ascensor vence en 15 días
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded bg-yellow-50 text-yellow-600">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <p className="text-xs text-gray-900">
                        Mantenimiento RITE trimestral
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-purple-600 rounded"></div>
                <h3 className="text-xs text-black">
                  Recomendaciones Inteligentes
                </h3>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-2 border border-purple-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
                  <h3 className="text-xs text-purple-900">
                    Recomendaciones IA
                  </h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-start gap-1">
                    <div className="w-1 h-1 rounded-full bg-purple-400 mt-1 flex-shrink-0"></div>
                    <p className="text-xs text-gray-700">
                      Consumo 15% bajo media de edificios comerciales en Madrid
                    </p>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="w-1 h-1 rounded-full bg-purple-400 mt-1 flex-shrink-0"></div>
                    <p className="text-xs text-gray-700">
                      Posibilidad de calificación A+ con mejoras en aislamiento
                    </p>
                  </div>
                  <div className="flex items-start gap-1">
                    <div className="w-1 h-1 rounded-full bg-purple-400 mt-1 flex-shrink-0"></div>
                    <p className="text-xs text-gray-700">
                      15% tareas vencidas - priorizar revisión HVAC
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-7 space-y-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-slate-700 rounded"></div>
                <h3 className="text-xs text-black">
                  Identificación del Activo
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-white rounded-lg shadow-sm p-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Hash className="w-3.5 h-3.5 text-grays-600" />
                    <h3 className="text-xs">Identificadores</h3>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <label className="text-xs text-gray-500">
                        ID Inmueble
                      </label>
                      <p className="text-xs text-gray-900"></p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Portfolio</label>
                      <p className="text-xs text-gray-900"></p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Referencia Catastral
                      </label>
                      <p
                        className="text-xs text-gray-900 truncate"
                        title="1234567890"
                      >
                        1234567890
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-xs">Dirección</h3>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-900">
                      Carretera de Miraflores
                    </p>
                    <p className="text-xs text-gray-500">
                      Colmenar Viejo, Madrid
                    </p>
                    <p className="text-xs text-gray-500">28780, España</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-xs">Tipo de Edificio</h3>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <label className="text-xs text-gray-500">Tipo</label>
                      <p className="text-xs text-gray-900">Comercial</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Sub-tipo</label>
                      <p className="text-xs text-gray-900"></p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Unidades</label>
                      <p className="text-xs text-gray-900">30</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <h3 className="text-xs">Estrategia</h3>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <label className="text-xs text-gray-500">
                        Estrategia
                      </label>
                      <p className="text-xs text-gray-900">Valor añadido</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Estado</label>
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs"></span>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Cliente</label>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-700">
                        Pendiente
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-emerald-600 rounded"></div>
                <h3 className="text-xs text-black">Costes Mensuales</h3>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] text-gray-500">
                    Basado en las facturas de servicios registradas
                  </p>
                  {loadingCosts && (
                    <span className="text-[11px] text-gray-500">
                      Cargando...
                    </span>
                  )}
                </div>
                {costsError && (
                  <div className="mb-2 rounded border border-red-200 bg-red-50 px-2 py-1">
                    <p className="text-[11px] text-red-700">{costsError}</p>
                  </div>
                )}
                <div className="grid grid-cols-6 gap-1.5 mb-2">
                  <div className="p-1.5 border border-blue-200 bg-blue-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Zap className="w-3 h-3 text-blue-600" />
                      <p className="text-xs text-blue-900">Electricidad</p>
                    </div>
                    <p className="text-xs text-blue-700">
                      {formatCurrency(monthlyCosts?.byService.electricity)}
                    </p>
                    <p className="text-xs text-blue-600">Edificio</p>
                  </div>
                  <div className="p-1.5 border border-cyan-200 bg-cyan-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Droplet className="w-3 h-3 text-cyan-600" />
                      <p className="text-xs text-cyan-900">Agua</p>
                    </div>
                    <p className="text-xs text-cyan-700">
                      {formatCurrency(monthlyCosts?.byService.water)}
                    </p>
                    <p className="text-xs text-cyan-600">Total</p>
                  </div>
                  <div className="p-1.5 border border-orange-200 bg-orange-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Flame className="w-3 h-3 text-orange-600" />
                      <p className="text-xs text-orange-900">Gas</p>
                    </div>
                    <p className="text-xs text-orange-700">
                      {formatCurrency(monthlyCosts?.byService.gas)}
                    </p>
                    <p className="text-xs text-orange-600">Total</p>
                  </div>
                  <div className="p-1.5 border border-purple-200 bg-purple-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <FileText className="w-3 h-3 text-purple-600" />
                      <p className="text-xs text-purple-900">IBI</p>
                    </div>
                    <p className="text-xs text-purple-700">
                      {formatCurrency(monthlyCosts?.byService.ibi)}
                    </p>
                    <p className="text-xs text-purple-600">Unidades</p>
                  </div>
                  <div className="p-1.5 border border-amber-200 bg-amber-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Trash2 className="w-3 h-3 text-amber-600" />
                      <p className="text-xs text-amber-900">Basuras</p>
                    </div>
                    <p className="text-xs text-amber-700">
                      {formatCurrency(monthlyCosts?.byService.waste)}
                    </p>
                    <p className="text-xs text-amber-600">Unidades</p>
                  </div>
                  <div className="p-1.5 border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Euro className="w-3 h-3 text-green-600" />
                      <p className="text-xs text-green-900">Total</p>
                    </div>
                    <p className="text-xs text-green-800">
                      {formatCurrency(totalMonth)}
                    </p>
                    <p className="text-xs text-green-700">
                      {formatCurrency(estimatedYearTotal)}/año
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-purple-50 border border-purple-200 rounded">
                    <div className="flex items-center gap-1 mb-1.5">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      <p className="text-xs text-purple-900">
                        Contadores Comunitarios
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-600" />
                          <span className="text-gray-700">Electricidad</span>
                        </div>
                        <span className="text-gray-900">
                          {formatCurrency(monthlyCosts?.byService.electricity)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-cyan-600" />
                          <span className="text-gray-700">Agua</span>
                        </div>
                        <span className="text-gray-900">
                          {formatCurrency(monthlyCosts?.byService.water)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-600" />
                          <span className="text-gray-700">Gas</span>
                        </div>
                        <span className="text-gray-900">
                          {formatCurrency(monthlyCosts?.byService.gas)}
                        </span>
                      </div>
                      <div className="pt-1 mt-1 border-t border-purple-300 flex items-center justify-between">
                        <span className="text-xs text-purple-900">
                          Subtotal
                        </span>
                        <span className="text-xs text-purple-800">
                          {formatCurrency(
                            (monthlyCosts?.byService.electricity ?? 0) +
                              (monthlyCosts?.byService.water ?? 0) +
                              (monthlyCosts?.byService.gas ?? 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-indigo-50 border border-indigo-200 rounded">
                    <div className="flex items-center gap-1 mb-1.5">
                      <House className="w-3.5 h-3.5 text-indigo-600" />
                      <p className="text-xs text-indigo-900">Costes Unidades</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-cyan-600" />
                          <span className="text-gray-700">Agua</span>
                        </div>
                        <span className="text-gray-900">
                          {formatCurrency(monthlyCosts?.byService.water)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-600" />
                          <span className="text-gray-700">Gas</span>
                        </div>
                        <span className="text-gray-900">
                          {formatCurrency(monthlyCosts?.byService.gas)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-purple-600" />
                          <span className="text-gray-700">IBI</span>
                        </div>
                        <span className="text-gray-900">
                          {formatCurrency(monthlyCosts?.byService.ibi)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Trash2 className="w-3 h-3 text-amber-600" />
                          <span className="text-gray-700">Basuras</span>
                        </div>
                        <span className="text-gray-900">
                          {formatCurrency(monthlyCosts?.byService.waste)}
                        </span>
                      </div>
                      <div className="pt-1 mt-1 border-t border-indigo-300 flex items-center justify-between">
                        <span className="text-xs text-indigo-900">
                          Subtotal
                        </span>
                        <span className="text-xs text-indigo-800">
                          {formatCurrency(
                            (monthlyCosts?.byService.water ?? 0) +
                              (monthlyCosts?.byService.gas ?? 0) +
                              (monthlyCosts?.byService.ibi ?? 0) +
                              (monthlyCosts?.byService.waste ?? 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-green-600 rounded"></div>
                <h3 className="text-xs text-black">Rentas</h3>
              </div>
              <div
                data-slot="card"
                className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Euro className="w-4 h-4 text-green-600" />
                    <h3 className="text-xs">Rentas</h3>
                  </div>
                  <button
                    data-slot="button"
                    className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md gap-1.5 has-[&gt;svg]:px-2.5 text-xs h-6 px-2"
                  >
                    Ver Detalle
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">
                      Diciembre 2024
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-xs text-green-600">€5550</p>
                      <p className="text-xs text-gray-500">/ €7400</p>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-600 h-1.5 rounded-full transition-all"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      75.0% cobrado
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="text-center p-1.5 bg-green-50 rounded">
                      <p className="text-xs text-green-600">6</p>
                      <p className="text-xs text-gray-600">Pagadas</p>
                    </div>
                    <div className="text-center p-1.5 bg-amber-50 rounded">
                      <p className="text-xs text-amber-600">1</p>
                      <p className="text-xs text-gray-600">Pendientes</p>
                    </div>
                    <div className="text-center p-1.5 bg-red-50 rounded">
                      <p className="text-xs text-red-600">1</p>
                      <p className="text-xs text-gray-600">Retrasadas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-teal-600 rounded"></div>
                <h3 className="text-xs text-black">Auditoría</h3>
              </div>
              <div className="space-y-1.5">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="p-1 bg-purple-100 rounded">
                      <Scale className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xs">Auditoría Regulatoria</h3>
                      <p className="text-xs text-gray-500">
                        Directiva EPBD 2030
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                    <div className="bg-gray-50 rounded p-1">
                      <div className="text-xs text-gray-600">
                        Calificación Actual
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">D</span>
                        <span className="text-xs text-gray-500">
                          85.42 kWh/m²·año
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded p-1">
                      <div className="text-xs text-blue-700">Objetivo</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600">D</span>
                        <span className="text-xs text-blue-600">65 kWh/m²</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-0.5 text-xs">
                          <TriangleAlert className="w-2.5 h-2.5 text-orange-600" />
                          <span className="text-gray-600 text-xs">Consumo</span>
                        </div>
                        <span className="text-xs text-orange-600">+20.4</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="h-1 rounded-full bg-orange-500"
                          style={{ width: "76.0946%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-0.5 text-xs">
                          <TriangleAlert className="w-3.5 h-3.5 text-orange-600" />
                          <span className="text-gray-600 text-xs">
                            Emisiones
                          </span>
                        </div>
                        <span className="text-xs text-orange-600">+4.7</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="h-1 rounded-full bg-orange-500"
                          style={{ width: "71.6846%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 pt-1 border-t border-gray-200">
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <div>• EPBD IV (2024/1275)</div>
                      <div>• RD 390/2021</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="p-1 bg-orange-100 rounded">
                      <Wrench className="w-3 h-3 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xs">Auditoría Técnica</h3>
                      <p className="text-xs text-gray-500">
                        Libro del Edificio
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded p-1.5 mb-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1">
                        <FileCheck className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-gray-700">
                          Completado
                        </span>
                      </div>
                      <span className="text-xs text-blue-700">100%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-1">
                      <div
                        className="bg-blue-600 h-1 rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-600">
                      8/8 tareas
                    </div>
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="text-xs text-gray-700">Mejoras:</div>
                    <div className="bg-orange-50 rounded p-1">
                      <div className="flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-orange-600" />
                        <span className="text-xs text-orange-900">
                          Envolvente: -18 kWh/m²
                        </span>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded p-1">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5 text-orange-600" />
                        <span className="text-xs text-orange-900">
                          HVAC: -12 kWh/m²
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-gray-200 bg-blue-50 rounded p-1 mt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-600">-58 kWh/m²</span>
                      <span className="text-green-600">€450k inv.</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="p-1 bg-green-100 rounded">
                      <Euro className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xs">Auditoría Financiera</h3>
                      <p className="text-xs text-gray-500">ROI Valoración</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                    <div className="border-l-2 border-blue-500 pl-1">
                      <div className="text-xs text-gray-600">
                        Valor del Activo
                      </div>
                      <div className="text-xs">€8.50M</div>
                      <div className="text-xs text-gray-500">1574 €/m²</div>
                    </div>
                    <div className="border-l-2 border-green-500 bg-green-50 pl-1">
                      <div className="text-xs text-green-700">ROI Actual</div>
                      <div className="text-xs text-green-600">8.00%</div>
                      <div className="text-xs text-green-600">Anual</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded p-1.5 mb-1.5 flex-1">
                    <div className="text-xs text-gray-700 mb-1 flex items-center gap-0.5">
                      <TrendingUp className="w-2.5 h-2.5 text-blue-600" />
                      <span>Post-mejora:</span>
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inversión:</span>
                        <span className="text-orange-600">€473k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revalorización:</span>
                        <span className="text-green-600">+12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor Futuro:</span>
                        <span className="text-green-700">€9.52M</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-600 text-white rounded p-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="text-xs">Ganancia Neta</div>

                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </div>
                    <div className="text-sm">€548k</div>
                    <div className="flex justify-between text-xs mt-0.5 opacity-90">
                      <span>ROI: 216%</span>
                      <span>6.5 años</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
