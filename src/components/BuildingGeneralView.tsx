import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "~/contexts/ToastContext";
import { BuildingsApiService, type Building } from "~/services/buildingsApi";
import { getBookByBuilding, type DigitalBook } from "~/services/digitalbook";
import {
  calculateESGScore,
  getESGScore,
  type ESGResponse,
} from "~/services/esg";
import { FinancialSnapshotsService } from "~/services/financialSnapshots";
import { CalendarApiService } from "~/services/calendar";
import { type BuildingEvent } from "~/types/calendar";
import { FinancialAnalysisService } from "~/services/financialAnalysisService";
import { type FinancialAnalysis } from "~/types/financialAnalysis";
import { getExpiredList, type ExpiredDocument } from "~/services/expiredApi";
import { UnitsApiService, type BuildingUnit } from "~/services/unitsApi";
import { ServiceInvoicesService, type MonthlyServiceCosts } from "~/services/serviceInvoices";
import {
  ArrowUpRight,
  Bell,
  CheckCircle,
  Book,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplet,
  Euro,
  Eye,
  FileText,
  Flame,
  Hash,
  House,
  Image,
  MapPin,
  Scale,
  Shield,
  Target,
  Trash,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Wrench,
  Zap,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BuildingGeneralViewLoading } from "./ui/dashboardLoading";

export function BuildingGeneralView() {
  // Hooks de navegación y notificaciones
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useToast();

  // Estado para datos del edificio
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState<Building | null>(null);
  const [digitalBook, setDigitalBook] = useState<DigitalBook | null>(null);
  const [_esgData, setEsgData] = useState<ESGResponse | null>(null);
  const [_esgLoading, setEsgLoading] = useState(false);
  const [_hasFinancialData, setHasFinancialData] = useState<boolean | null>(
    null
  );
  const [events, setEvents] = useState<BuildingEvent[]>([]);
  const [financialAnalysis, setFinancialAnalysis] = useState<FinancialAnalysis | null>(null);
  const [expiredDocs, setExpiredDocs] = useState<ExpiredDocument[]>([]);
  const [units, setUnits] = useState<BuildingUnit[]>([]);
  const [monthlyCosts, setMonthlyCosts] = useState<MonthlyServiceCosts | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayedImageSrc, setDisplayedImageSrc] = useState<string>("/image.png");
  const [isImageLoading, setIsImageLoading] = useState(false);

  const buildingImages = useMemo(() => {
    const fallback = "/image.png";
    const urls =
      building?.images
        ?.map((img) => img?.url)
        .filter((u): u is string => Boolean(u && u.trim() !== "")) ?? [];

    // Dedup manteniendo orden
    const unique = Array.from(new Set(urls));
    return unique.length ? unique : [fallback];
  }, [building?.images]);

  useEffect(() => {
    // Resetear carrusel al cambiar de edificio / imágenes
    setCurrentImageIndex(0);
    setDisplayedImageSrc(buildingImages[0] || "/image.png");
    setIsImageLoading(false);
  }, [id, buildingImages.length]);

  // Pre-cargar la imagen objetivo y evitar “pantalla en blanco” al cambiar
  useEffect(() => {
    const targetSrc = buildingImages[currentImageIndex] || "/image.png";

    // Si ya se está mostrando, no hacer nada
    if (targetSrc === displayedImageSrc) return;

    let cancelled = false;
    setIsImageLoading(true);

    // Ojo: en este componente `Image` es un ícono (lucide), por eso usamos un elemento <img> para pre-cargar.
    const img = document.createElement("img");
    img.onload = () => {
      if (cancelled) return;
      setDisplayedImageSrc(targetSrc);
      setIsImageLoading(false);
    };
    img.onerror = () => {
      if (cancelled) return;
      setDisplayedImageSrc("/image.png");
      setIsImageLoading(false);
    };
    img.src = targetSrc;

    return () => {
      cancelled = true;
    };
  }, [buildingImages, currentImageIndex, displayedImageSrc]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % buildingImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + buildingImages.length) % buildingImages.length
    );
  };

  // Función para cargar datos ESG - Ready to use when needed
  /*
  const loadESGData = async () => {
    const buildingId = building?.id || id;
    if (!buildingId) return;

    setEsgLoading(true);
    try {
      const esgResponse = await calculateESGScore(buildingId);
      setEsgData(esgResponse);
    } catch (error) {
      console.error("Error cargando ESG:", error);
      try {
        const savedESG = await getESGScore(buildingId);
        setEsgData(savedESG);
      } catch {
        setEsgData(null);
      }
    } finally {
      setEsgLoading(false);
    }
  };
  */

  // Función para crear libro digital
  const handleCreateDigitalBook = async () => {
    if (!building?.id) return;

    try {
      const { getOrCreateBookForBuilding } = await import(
        "~/services/digitalbook"
      );
      const createdBook = await getOrCreateBookForBuilding(building.id);
      setDigitalBook(createdBook);
      navigate(`/digital-book/hub/${building.id}`, {
        state: {
          buildingId: building.id,
          buildingName: building.name,
          isNewBook: true,
        },
      });
    } catch (error) {
      showError("Error al crear el libro del edificio");
    }
  };

  // Función para ver libro digital
  const handleViewDigitalBook = () => {
    if (!building?.id) return;
    navigate(`/digital-book/hub/${building.id}`, {
      state: {
        buildingId: building.id,
        buildingName: building.name,
        isNewBook: false,
      },
    });
  };

  // Función para navegar a datos financieros - Ready to use when needed
  /*
  const handleFinancialData = () => {
    if (!building?.id) return;
    if (hasFinancialData) {
      navigate(`/cfo-due-diligence/${building.id}`);
    } else {
      navigate(`/cfo-intake/${building.id}`);
    }
  };
  */

  // Cargar datos del edificio al montar
  useEffect(() => {
    const loadBuilding = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const buildingData = await BuildingsApiService.getBuildingById(id);
        setBuilding(buildingData);

        // Cargar libro digital si existe
        try {
          const book = await getBookByBuilding(id);
          setDigitalBook(book);
        } catch (e) {
          setDigitalBook(null);
        }

        // Cargar datos financieros y análisis
        try {
          const snapshots =
            await FinancialSnapshotsService.getFinancialSnapshots(
              buildingData.id
            );
          const hasData = snapshots && snapshots.length > 0;
          setHasFinancialData(hasData);

          if (hasData) {
            const analysis = await FinancialAnalysisService.analyzeBuilding(
              buildingData.id,
              buildingData.name,
              snapshots[0],
              buildingData.price || 0
            );
            setFinancialAnalysis(analysis);
          }
        } catch (error) {
          console.error("Error cargando datos financieros:", error);
          setHasFinancialData(false);
        }

        // Cargar documentos vencidos (alertas)
        try {
          const expiredResponse = await getExpiredList({
            building_id: id,
            limit: 5,
          });
          setExpiredDocs(expiredResponse.items || []);
        } catch (error) {
          console.error("Error cargando documentos vencidos:", error);
        }

        // Cargar datos ESG
        setEsgLoading(true);
        try {
          const esgResponse = await calculateESGScore(buildingData.id);
          setEsgData(esgResponse);
        } catch (error) {
          console.error("Error cargando ESG:", error);
          try {
            const savedESG = await getESGScore(buildingData.id);
            setEsgData(savedESG);
          } catch {
            setEsgData(null);
          }
        } finally {
          setEsgLoading(false);
        }

        // Cargar unidades
        try {
          const unitsData = await UnitsApiService.listUnits(buildingData.id);
          setUnits(unitsData || []);
        } catch (error) {
          console.error("Error cargando unidades:", error);
        }

        // Cargar costes mensuales (mes actual)
        try {
          const now = new Date();
          const costs = await ServiceInvoicesService.getMonthlyCostsForBuilding(
            buildingData.id,
            now.getFullYear(),
            now.getMonth() + 1
          );
          setMonthlyCosts(costs);
        } catch (error) {
          console.error("Error cargando costes mensuales:", error);
        }

        setLoading(false);
      } catch (error) {
        showError(
          "Error al cargar edificio",
          "No se pudo cargar la información del edificio"
        );
        navigate("/assets");
        setLoading(false);
      }
    };

    loadBuilding();
  }, [id, navigate, showError]);

  // Cargar eventos del edificio
  useEffect(() => {
    const loadEvents = async () => {
      if (!id) return;
      try {
        const calendarApi = new CalendarApiService();
        const response = await calendarApi.getBuildingEvents(id);
        setEvents(response.data || []);
      } catch (error) {
        console.error("Error cargando eventos:", error);
        setEvents([]);
      }
    };

    loadEvents();
  }, [id]);

  // Cálculos para el calendario de acciones
  const calendarStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const urgent = events.filter((e) => e.priority === "urgent").length;
    const thisMonth = events.filter((e) => {
      const eventDate = new Date(e.eventDate);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    }).length;

    // Obtener la acción prioritaria (más urgente y más próxima)
    const priorityAction = [...events]
      .filter((e) => e.status !== "completed" && e.status !== "cancelled")
      .sort((a, b) => {
        // Primero por prioridad
        const priorityScore: Record<string, number> = {
          urgent: 4,
          high: 3,
          normal: 2,
          low: 1,
        };
        const scoreDiff =
          (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
        if (scoreDiff !== 0) return scoreDiff;

        // Luego por fecha próxima
        return (
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        );
      })[0];

    return { urgent, thisMonth, priorityAction };
  }, [events]);

  

  // Calculate derived metrics
  const occupancyStats = useMemo(() => {
    if (!units.length) return { percentage: 0, occupied: 0, total: 0 };
    const occupied = units.filter(u => u.status === 'occupied' || u.tenant).length;
    return {
      percentage: Math.round((occupied / units.length) * 100),
      occupied,
      total: units.length
    };
  }, [units]);

  const rentStats = useMemo(() => {
    if (!units.length) return { total: 0, potential: 0, paid: 0, pending: 0, delayed: 0 };
    const total = units.reduce((acc, u) => acc + (u.rent || 0), 0);
    // Mocking invoice status for now as we don't have that data
    return {
      total: 0, // collected
      potential: total,
      paid: 0,
      pending: 0,
      delayed: 0
    };
  }, [units]);

  // Datos para el gráfico (dinámicos según eventos)
  const chartData = useMemo(() => {
    // Si no hay eventos, devolvemos skeleton de "Sin datos"
    const emptyData = [{ name: "Sin datos", value: 1, color: "#e5e7eb" }];
    
    if (!events.length) return emptyData;
    
    const maintenanceEvents = events.filter(e => e.category === 'maintenance');
    if (!maintenanceEvents.length) return emptyData;

    const completed = maintenanceEvents.filter(e => e.status === 'completed').length;
    const inProgress = maintenanceEvents.filter(e => e.status === 'in_progress').length;
    const scheduled = maintenanceEvents.filter(e => e.status === 'pending').length;
    
    // Atrasado: scheduled in past
    const delayed = maintenanceEvents.filter(e => e.status !== 'completed' && e.status !== 'cancelled' && new Date(e.eventDate) < new Date()).length;

    const result = [
      { name: "Completado", value: completed, color: "#10b981" },
      { name: "En curso", value: inProgress, color: "#3b82f6" },
      { name: "Programado", value: scheduled, color: "#f59e0b" },
      { name: "Atrasado", value: delayed, color: "#ef4444" },
    ].filter(d => d.value > 0);

    return result.length > 0 ? result : emptyData;
  }, [events]);

  const data = chartData; // Alias para compatibilidad con código existente

  // Mostrar skeleton mientras carga
  if (loading) {
    return <BuildingGeneralViewLoading />;
  }


  // Datos para cuando no hay datos (un círculo gris)
  const emptyData = [{ name: "Sin datos", value: 1, color: "#e5e7eb" }];
  // const chartData = data.some(d => d.value > 0) ? data : emptyData; // Ya calculado arriba

  const innerRadius = 30; // 30px
  const outerRadius = 50; // 50px

  const COLORS = data.map((d) => d.color);

  return (
    <div className="flex-1 overflow-y-auto mt-2 pr-1">
      <div className="space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              {/* Nombre del edificio */}
              <div className="mb-3 pb-2.5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                  {building?.name || "Edificio"}
                </h2>
                {building?.address && (
                  <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{building.address}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 mb-1.5">
                <Image className="w-3.5 h-3.5 text-gray-600" />
                <h3 className="text-sm">Imágenes del Edificio</h3>
              </div>
              <div className="relative w-full h-[140px] bg-gray-100 rounded overflow-hidden">
                <img
                  key={`${building?.id || "building"}-img-${currentImageIndex}-${buildingImages[currentImageIndex]?.substring(0, 30)}`}
                  src={displayedImageSrc}
                  alt={`${building?.name || "Edificio"} - Imagen ${currentImageIndex + 1
                    }`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // fallback si falla una URL firmada
                    (e.currentTarget as HTMLImageElement).src = "/image.png";
                  }}
                />

                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/15 backdrop-blur-[1px]">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-black/55 text-white text-xs shadow-sm">
                      <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
                      <span>Cargando imagen…</span>
                    </div>
                  </div>
                )}

                {buildingImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                  {currentImageIndex + 1} / {buildingImages.length}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-[#1e3a8a] rounded"></div>
                <h3 className="text-sm text-black">Información General</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div
                  data-slot="card"
                  className="bg-white text-card-foreground rounded-lg shadow-sm p-3"
                >
                  <h4 className="text-xs text-gray-500 mb-2">
                    Información General
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Año</span>
                      <span className="text-sm text-gray-900">{building?.constructionYear || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Plantas</span>
                      <span className="text-sm text-gray-900">{building?.numFloors || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Tipo</span>
                      <span className="text-sm text-gray-900">
                        {building ? (building.typology === 'residential' ? 'Residencial' : building.typology === 'mixed' ? 'Mixto' : 'Comercial') : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  data-slot="card"
                  className="bg-white text-card-foreground rounded-lg shadow-sm p-3"
                >
                  <h4 className="text-xs text-gray-500 mb-2">
                    Eficiencia Energética
                  </h4>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded flex items-center justify-center text-white bg-orange-500">
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
                  className="bg-white text-card-foreground rounded-lg shadow-sm p-3"
                >
                  <h4 className="text-xs text-gray-500 mb-2">
                    Ocupación del Activo
                  </h4>
                  <div className="mb-2">
                    <span className="text-2xl text-gray-900">{occupancyStats.percentage}%</span>
                    <span className="text-xs text-gray-500 ml-1.5">
                      ocupado ({occupancyStats.occupied}/{occupancyStats.total})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${occupancyStats.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1 h-3.5 bg-slate-700 rounded"></div>
              <h3 className="text-sm text-black">Identificación del Activo</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Hash className="w-3.5 h-3.5 text-gray-600" />
                  <h3 className="text-sm">Identificadores</h3>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <label className="text-xs text-gray-500">ID Inmueble</label>
                    <p className="text-xs text-gray-900">{building?.id || "-"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Portfolio</label>
                    <p className="text-xs text-gray-900"></p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Gestor</label>
                    <p className="text-xs text-gray-900">{building?.technicianEmail || "-"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      Referencia Catastral
                    </label>
                    <p
                      className="text-xs text-gray-900 truncate"
                      title={building?.cadastralReference || "-"}
                    >
                      {building?.cadastralReference || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-600" />
                  <h3 className="text-sm">Inmueble</h3>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <label className="text-xs text-gray-500">Dominio</label>
                    <p className="text-xs text-gray-900">Propiedad Plena</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      Referencia Catastral
                    </label>
                    <p
                      className="text-xs text-gray-900 truncate"
                      title={building?.address || "-"}
                    >
                      {building?.address || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Superficie</label>
                    <p className="text-xs text-gray-900">
                      {building?.squareMeters ? `${building.squareMeters.toLocaleString()} m²` : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-600" />
                  <h3 className="text-sm">Tipo y Características</h3>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <label className="text-xs text-gray-500">Tipo</label>
                    <p className="text-xs text-gray-900">
                      {building ? (building.typology === 'residential' ? 'Residencial' : building.typology === 'mixed' ? 'Mixto' : 'Comercial') : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      Uso Comercial
                    </label>
                    <p className="text-xs text-gray-900">
                      {building?.typology === 'commercial' ? 'Comercial' : building?.typology === 'mixed' ? 'Mixto' : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Sub-tipo</label>
                    <p className="text-xs text-gray-900"></p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Unidades</label>
                    <p className="text-xs text-gray-900">{building?.numUnits || "-"}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Target className="w-3.5 h-3.5 text-gray-600" />
                  <h3 className="text-sm">Estrategia</h3>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <label className="text-xs text-gray-500">Estrategia</label>
                    <p className="text-xs text-gray-900">
                      {financialAnalysis ? (financialAnalysis.recommendation.type === 'mejorar' ? 'Valor añadido' : financialAnalysis.recommendation.type === 'mantener' ? 'Core' : 'Venta') : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      Concepto
                    </label>
                    <p className="text-xs text-gray-900">
                      {financialAnalysis ? (financialAnalysis.recommendation.type === 'mejorar' ? 'Rehabilitación' : financialAnalysis.recommendation.type === 'mantener' ? 'Mantenimiento' : 'Desinversión') : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Estado</label>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${building ? (building.status === 'with_book' ? 'bg-green-100 text-green-700' : building.status === 'ready_book' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700') : 'bg-gray-100 text-gray-700'}`}>
                      {building ? (building.status === 'with_book' ? 'Con libro' : building.status === 'ready_book' ? 'Listo' : 'Borrador') : "-"}
                    </span>
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
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1 h-3.5 bg-orange-600 rounded"></div>
              <h3 className="text-sm text-black">Estado Técnico</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded p-2 text-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-white/10 rounded">
                      <Book className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs mb-0.5">Libro del Edificio</h4>
                      <p className="text-xs text-blue-100">
                        {digitalBook ? Math.round(((digitalBook.progress || 0) / 8) * 100) : 0}% completado • {digitalBook?.sections?.filter(s => s.complete).length || 0} secciones
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={
                      digitalBook
                        ? handleViewDigitalBook
                        : handleCreateDigitalBook
                    }
                    className="bg-white text-[#1e3a8a] px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-50 transition-colors whitespace-nowrap text-xs h-7"
                  >
                    <Eye className="w-3 h-3" />
                    {digitalBook ? "Ver Libro" : "Crear Libro"}
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded p-2 text-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-white/10 rounded">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs mb-0.5">Datos financieros</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/cfo-intake/${id}`)}
                    className="bg-white text-[#1e3a8a] px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-50 transition-colors whitespace-nowrap text-xs h-7"
                  >
                    <Eye className="w-3 h-3" />
                    Cargar Datos Financieros
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-sm">Plan de Mantenimiento</h3>
                  </div>
                  {chartData === emptyData && (
                    <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      Sin datos disponibles
                    </span>
                  )}
                </div>
                <div className="h-[120px] mb-1.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius} // Radio interior (para crear el agujero)
                        outerRadius={outerRadius} // Radio exterior
                        fill="#8884d8"
                        paddingAngle={0}
                        stroke="#fff"
                      >
                        {data.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgb(16, 185, 129)" }}
                    ></div>
                    <span className="text-gray-700">Completado: {events.filter(e => e.category === 'maintenance' && e.status === 'completed').length || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgb(59, 130, 246)" }}
                    ></div>
                    <span className="text-gray-700">En curso: {events.filter(e => e.category === 'maintenance' && e.status === 'in_progress').length || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgb(245, 158, 11)" }}
                    ></div>
                    <span className="text-gray-700">Programado: {events.filter(e => e.category === 'maintenance' && e.status === 'pending').length || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgb(239, 68, 68)" }}
                    ></div>
                    <span className="text-gray-700">Atrasado: {events.filter(e => e.category === 'maintenance' && e.status !== 'completed' && e.status !== 'cancelled' && new Date(e.eventDate) < new Date()).length || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1 h-3.5 bg-emerald-600 rounded"></div>
              <h3 className="text-sm text-black">Costes Mensuales</h3>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-1.5 mb-1.5">
                  <div className="p-1.5 border border-blue-200 bg-blue-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Zap className="w-3 h-3 text-blue-600" />
                      <p className="text-xs text-blue-900">Electricidad</p>
                    </div>
                    <p className="text-sm text-blue-700">€{monthlyCosts?.byService['electricity'] || "-"}</p>
                    <p className="text-xs text-blue-600">Edificio</p>
                  </div>
                  <div className="p-1.5 border border-cyan-200 bg-cyan-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Droplet className="w-3 h-3 text-cyan-600" />
                      <p className="text-xs text-cyan-900">Agua</p>
                    </div>
                    <p className="text-sm text-cyan-700">€{monthlyCosts?.byService['water'] || "-"}</p>
                    <p className="text-xs text-cyan-600">Total</p>
                  </div>
                  <div className="p-1.5 border border-orange-200 bg-orange-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Flame className="w-3 h-3 text-orange-600" />
                      <p className="text-xs text-orange-900">Gas</p>
                    </div>
                    <p className="text-sm text-orange-700">€{monthlyCosts?.byService['gas'] || "-"}</p>
                    <p className="text-xs text-orange-600">Total</p>
                  </div>
                  <div className="p-1.5 border border-purple-200 bg-purple-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <FileText className="w-3 h-3 text-purple-600" />
                      <p className="text-xs text-purple-900">IBI</p>
                    </div>
                    <p className="text-sm text-purple-700">€{monthlyCosts?.byService['ibi'] || "-"}</p>
                    <p className="text-xs text-purple-600">Unidades</p>
                  </div>
                  <div className="p-1.5 border border-amber-200 bg-amber-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Trash className="w-3 h-3 text-amber-600" />
                      <p className="text-xs text-amber-900">Basuras</p>
                    </div>
                    <p className="text-sm text-amber-700">€{monthlyCosts?.byService['waste'] || "-"}</p>
                    <p className="text-xs text-amber-600">Unidades</p>
                  </div>
                  <div className="p-1.5 border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Euro className="w-3 h-3 text-green-700" />
                      <p className="text-xs text-green-900">Total</p>
                    </div>
                    <p className="text-sm text-green-800">€{monthlyCosts?.total || "-"}</p>
                    <p className="text-xs text-green-700">{monthlyCosts?.total ? `€${monthlyCosts.total * 12}/año` : "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-1.5 bg-purple-50 border border-purple-200 rounded">
                    <div className="flex items-center gap-0.5 mb-1">
                      <Building2 className="w-2.5 h-2.5 text-purple-600" />
                      <p className="text-xs text-purple-900">
                        Contadores Comunitarios
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-blue-600" />
                          <span className="text-gray-700">Electricidad</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Droplet className="w-2.5 h-2.5 text-cyan-600" />
                          <span className="text-gray-700">Agua</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-orange-600" />
                          <span className="text-gray-700">Gas</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="pt-0.5 mt-0.5 border-t border-purple-300 flex items-center justify-between">
                        <span className="text-xs text-purple-900">
                          Subtotal
                        </span>
                        <span className="text-xs text-purple-800">€-</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5 bg-indigo-50 border border-indigo-200 rounded">
                    <div className="flex items-center gap-0.5 mb-1">
                      <House className="w-2.5 h-2.5 text-indigo-600" />
                      <p className="text-xs text-indigo-900">Costes Unidades</p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Droplet className="w-2.5 h-2.5 text-cyan-600" />
                          <span className="text-gray-700">Agua</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-orange-600" />
                          <span className="text-gray-700">Gas</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5 text-purple-600" />
                          <span className="text-gray-700">IBI</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Trash2 className="w-2.5 h-2.5 text-amber-600" />
                          <span className="text-gray-700">Basuras</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="pt-0.5 mt-0.5 border-t border-indigo-300 flex items-center justify-between">
                        <span className="text-xs text-indigo-900">
                          Subtotal
                        </span>
                        <span className="text-xs text-indigo-800">€-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1 h-3.5 bg-teal-600 rounded"></div>
              <h3 className="text-sm text-black">Auditoría</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <div className="p-1 bg-purple-100 rounded">
                    <Scale className="w-3 h-3 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm">Auditoría Regulatoria</h3>
                    <p className="text-xs text-gray-500">Directiva EPBD 2030</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">
                      Calificación Actual
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{_esgData?.status === 'complete' ? _esgData.data.label : "-"}</span>
                      <span className="text-xs text-gray-500">
                        -
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded p-1">
                    <div className="text-xs text-blue-700">Objetivo</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">-</span>
                      <span className="text-xs text-blue-600">-</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-0.5 text-xs">
                        <TriangleAlert className="w-2.5 h-2.5 text-gray-400" />
                        <span className="text-gray-600 text-xs">Consumo</span>
                      </div>
                      <span className="text-xs text-gray-400">-</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-gray-300"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-0.5 text-xs">
                        <TriangleAlert className="w-2.5 h-2.5 text-gray-400" />
                        <span className="text-gray-600 text-xs">Emisiones</span>
                      </div>
                      <span className="text-xs text-gray-400">-</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-gray-300"
                        style={{ width: "0%" }}
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
                    <Wrench className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-sm">Auditoría Técnica</h3>
                    <p className="text-xs text-gray-500">Libro del Edificio</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded p-1.5 mb-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5 text-[#1e3a8a]" />
                      <span className="text-xs text-gray-700">Completado</span>
                    </div>
                    <span className="text-xs text-[#1e3a8a]">{digitalBook ? Math.round(((digitalBook.progress || 0) / 8) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-1">
                    <div
                      className="bg-[#1e3a8a] h-1 rounded-full"
                      style={{ width: digitalBook ? `${((digitalBook.progress || 0) / 8) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <div className="mt-0.5 text-xs text-gray-600">{digitalBook?.sections?.filter(s => s.complete).length || 0}/8 tareas</div>
                </div>
                <div className="space-y-1 flex-1">
                  <div className="text-xs text-gray-700">Mejoras:</div>
                  <div className="bg-orange-50 rounded p-1">
                    <div className="flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-orange-600" />
                      <span className="text-xs text-orange-900">
                        Envolvente: -
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded p-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5 text-orange-600" />
                      <span className="text-xs text-orange-900">
                        HVAC: -
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-1 border-t border-gray-200 bg-blue-50 rounded p-1 mt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-600">-</span>
                    <span className="text-green-600">-</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <div className="p-1 bg-green-100 rounded">
                    <Euro className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm">Auditoría Financiera</h3>
                    <p className="text-xs text-gray-500">ROI Valoración</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                  <div className="border-l-2 border-blue-500 pl-1">
                    <div className="text-xs text-gray-600">
                      Valor del Activo
                    </div>
                    <div className="text-xs">
                      {financialAnalysis?.metrics.marketValue ? `€${(financialAnalysis.metrics.marketValue / 1000000).toFixed(2)}M` : "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {building?.price && building?.squareMeters ? `${Math.round(building.price / building.squareMeters)} €/m²` : "-"}
                    </div>
                  </div>
                  <div className="border-l-2 border-green-500 bg-green-50 pl-1">
                    <div className="text-xs text-green-700">ROI Actual</div>
                    <div className="text-xs text-green-600">
                      {financialAnalysis?.metrics.roi ? `${financialAnalysis.metrics.roi.toFixed(2)}%` : "-"}
                    </div>
                    <div className="text-xs text-green-600">Anual</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded p-1.5 mb-1.5 flex-1">
                  <div className="text-xs text-gray-700 mb-1 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5 text-green-600" />
                    <span>Post-mejora:</span>
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Inversión:</span>
                      <span className="text-orange-600">
                        {financialAnalysis?.recommendation.financialImpact.investmentRequired ? `€${Math.round(financialAnalysis.recommendation.financialImpact.investmentRequired / 1000)}k` : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revalorización:</span>
                      <span className="text-green-600">
                        {financialAnalysis?.metrics.valueGap ? `+${financialAnalysis.metrics.valueGap.toFixed(1)}%` : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor Futuro:</span>
                      <span className="text-green-700">
                         {financialAnalysis?.recommendation.financialImpact.projectedValue ? `€${(financialAnalysis.recommendation.financialImpact.projectedValue / 1000000).toFixed(2)}M` : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1e3a8a] text-white rounded p-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="text-xs">Ganancia Neta</div>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </div>
                  <div className="text-base">
                    {financialAnalysis?.recommendation.financialImpact.expectedReturn ? `€${Math.round(financialAnalysis.recommendation.financialImpact.expectedReturn / 1000)}k` : "-"}
                  </div>
                  <div className="flex justify-between text-xs mt-0.5 opacity-90">
                    <span>ROI: {financialAnalysis?.recommendation.financialImpact.irr ? `${Math.round(financialAnalysis.recommendation.financialImpact.irr)}%` : "-"}</span>
                    <span>{financialAnalysis?.recommendation.financialImpact.paybackPeriod ? `${(financialAnalysis.recommendation.financialImpact.paybackPeriod / 12).toFixed(1)} años` : "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-green-600 rounded"></div>
                <h3 className="text-sm text-black">Rentas</h3>
              </div>
              <div
                data-slot="card"
                className="bg-white text-card-foreground rounded-lg shadow-sm p-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Euro className="w-3.5 h-3.5 text-green-600" />
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
                      {new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-xs text-green-600">{rentStats.total > 0 ? `€${rentStats.total}` : "-"}</p>
                      <p className="text-xs text-gray-500">/ {rentStats.potential > 0 ? `€${rentStats.potential}` : "-"}</p>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-600 h-1.5 rounded-full transition-all"
                        style={{ width: rentStats.potential > 0 ? `${(rentStats.total / rentStats.potential) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {rentStats.potential > 0 ? `${Math.round((rentStats.total / rentStats.potential) * 100)}% cobrado` : "-"}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="text-center p-1.5 bg-green-50 rounded">
                      <p className="text-xs text-green-600">{rentStats.paid || "-"}</p>
                      <p className="text-xs text-gray-600">Pagadas</p>
                    </div>
                    <div className="text-center p-1.5 bg-amber-50 rounded">
                      <p className="text-xs text-amber-600">{rentStats.pending || "-"}</p>
                      <p className="text-xs text-gray-600">Pendientes</p>
                    </div>
                    <div className="text-center p-1.5 bg-red-50 rounded">
                      <p className="text-xs text-red-600">{rentStats.delayed || "-"}</p>
                      <p className="text-xs text-gray-600">Retrasadas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-[#1e3a8a] rounded"></div>
                <h3 className="text-sm text-black">Calendario de Acciones</h3>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm text-gray-900">Próximas Acciones</h3>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="p-1.5 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center gap-1 mb-0.5">
                      <TriangleAlert className="w-3 h-3 text-red-600" />
                      <p className="text-xs text-red-900">Urgentes</p>
                    </div>
                    <p className="text-xs text-red-700">{calendarStats.urgent}</p>
                  </div>
                  <div className="p-1.5 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <p className="text-xs text-blue-900">Este Mes</p>
                    </div>
                    <p className="text-xs text-blue-700">{calendarStats.thisMonth}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-700 mb-1">
                    Acciones Prioritarias:
                  </p>
                  {calendarStats.priorityAction ? (
                    <div className="flex items-center justify-between p-1.5 rounded text-xs bg-orange-50 border border-orange-200">
                      <span className="text-gray-700 truncate flex-1 flex items-center gap-0.5">
                        {calendarStats.priorityAction.title}
                      </span>
                      <span className="ml-1.5 text-orange-700">
                        {(() => {
                          const diff =
                            new Date(
                              calendarStats.priorityAction.eventDate
                            ).getTime() - new Date().getTime();
                          const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                          if (days < 0) return "Vencido";
                          if (days === 0) return "Hoy";
                          return `${days}d`;
                        })()}
                      </span>
                    </div>
                  ) : (
                    <div className="p-1.5 rounded text-xs bg-gray-50 border border-gray-100 text-gray-500 text-center">
                      No hay acciones pendientes
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/building/${id}/general-view/calendar`)}
                  className="w-full mt-2 px-2 py-1.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs rounded transition-colors"
                >
                  Ver Calendario Completo
                </button>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-red-600 rounded"></div>
                <h3 className="text-sm text-black">Seguimiento y Alertas</h3>
              </div>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-sm">Actividad Reciente</h3>
                  </div>
                  <div className="space-y-1.5">
                    {events.filter(e => e.status === 'completed').slice(-3).reverse().map(event => (
                      <div key={event.id} className="flex items-start gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0 bg-green-500"></div>
                        <div>
                          <p className="text-xs text-gray-900">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {events.filter(e => e.status === 'completed').length === 0 && (
                      <div className="py-4 text-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-xs text-gray-500">Sin actividad reciente registrada.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bell className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-sm">Próximas Alertas</h3>
                  </div>
                  <div className="space-y-1">
                    {[...expiredDocs, ...events.filter(e => e.status !== 'completed' && e.priority === 'urgent')].slice(0, 4).map((item) => {
                      const isDoc = 'tipo_documento' in item;
                      return (
                        <div key={isDoc ? `doc-${item.id}` : `event-${item.id}`} className="flex items-center gap-1.5 p-1.5 rounded bg-red-50 text-red-600">
                          <TriangleAlert className="w-3 h-3 flex-shrink-0" />
                          <p className="text-xs text-gray-900">
                            {isDoc ? `${item.tipo_documento} vencido (${item.contenido_extraido.vigencia || 'Sin fecha'})` : `${item.title} (Urgente)`}
                          </p>
                        </div>
                      );
                    })}
                    {expiredDocs.length === 0 && events.filter(e => e.status !== 'completed' && e.priority === 'urgent').length === 0 && (
                      <div className="text-center py-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                        <CheckCircle className="w-5 h-5 text-green-500/50 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">No hay alertas urgentes pendientes.</p>
                      </div>
                    )}
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
