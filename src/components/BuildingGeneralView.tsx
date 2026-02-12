import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "~/contexts/ToastContext";
import { BuildingsApiService, type Building } from "~/services/buildingsApi";
import { getBookByBuilding, filterActiveSections, type DigitalBook } from "~/services/digitalbook";
import {
  calculateESGScore,
  getESGScore,
  type ESGResponse,
} from "~/services/esg";
import { FinancialSnapshotsService } from "~/services/financialSnapshots";
import { CalendarApiService } from "~/services/calendar";
import { type BuildingEvent } from "~/types/calendar";
import { EnergyCertificatesService } from "~/services/energyCertificates";
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
  Edit2,
  Save,
  X,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BuildingGeneralViewLoading } from "./ui/dashboardLoading";
import { countBuildingDocuments } from "~/services/gestionDocuments";
import { useLanguage } from "~/contexts/LanguageContext";


export function BuildingGeneralView() {
  // Hooks de navegación y notificaciones
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const { t } = useLanguage();
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
  const [energyEfficiencyData, setEnergyEfficiencyData] = useState<{
    rating: string;
    consumption: number;
    source: 'invoice' | 'certificate' | null;
  } | null>(null);
  const [isEditingCadastralRef, setIsEditingCadastralRef] = useState(false);
  const [tempCadastralRef, setTempCadastralRef] = useState("");
  const [isSavingCadastralRef, setIsSavingCadastralRef] = useState(false);

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

  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    if (id) {
      countBuildingDocuments(id).then(setDocCount);
    }
  }, [id]);

  useEffect(() => {
    // Resetear carrusel al cambiar de edificio / imágenes
    setCurrentImageIndex(0);
    const firstImage = buildingImages[0] || "/image.png";
    setDisplayedImageSrc(firstImage);
    setIsImageLoading(false);
  }, [id, buildingImages]);

  // Pre-cargar la imagen objetivo y evitar "pantalla en blanco" al cambiar
  useEffect(() => {
    const targetSrc = buildingImages[currentImageIndex] || "/image.png";

    // Si ya se está mostrando, no hacer nada
    if (targetSrc === displayedImageSrc) {
      setIsImageLoading(false);
      return;
    }

    let cancelled = false;
    setIsImageLoading(true);

    // Timeout de seguridad para evitar spinner infinito (10 segundos)
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        setDisplayedImageSrc("/image.png");
        setIsImageLoading(false);
      }
    }, 10000);

    // Ojo: en este componente `Image` es un ícono (lucide), por eso usamos un elemento <img> para pre-cargar.
    const img = document.createElement("img");
    img.onload = () => {
      if (cancelled) return;
      clearTimeout(timeoutId);
      setDisplayedImageSrc(targetSrc);
      setIsImageLoading(false);
    };
    img.onerror = () => {
      if (cancelled) return;
      clearTimeout(timeoutId);
      setDisplayedImageSrc("/image.png");
      setIsImageLoading(false);
    };
    img.src = targetSrc;

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [buildingImages, currentImageIndex]); // Removido displayedImageSrc de dependencias para evitar loop

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

        // Paralelizar todas las llamadas independientes para mejorar rendimiento
        const [
          bookResult,
          snapshotsResult,
          expiredResult,
          esgResult,
          unitsResult,
          costsResult,
        ] = await Promise.allSettled([
          // Libro digital
          getBookByBuilding(id).catch(() => null),
          
          // Datos financieros
          FinancialSnapshotsService.getFinancialSnapshots(buildingData.id),
          
          // Documentos vencidos
          getExpiredList({ building_id: id, limit: 5 }),
          
          // Datos ESG
          calculateESGScore(buildingData.id).catch(async () => {
            try {
              return await getESGScore(buildingData.id);
            } catch {
              return null;
            }
          }),
          
          // Unidades
          UnitsApiService.listUnits(buildingData.id),
          
          // Costes mensuales (usa el mes más reciente con datos)
          ServiceInvoicesService.getLatestMonthlyCostsForBuilding(buildingData.id),
        ]);

        // Procesar resultados del libro digital
        if (bookResult.status === "fulfilled" && bookResult.value) {
          setDigitalBook(bookResult.value);
        } else {
          setDigitalBook(null);
        }

        // Procesar resultados financieros
        if (snapshotsResult.status === "fulfilled") {
          const snapshots = snapshotsResult.value;
          const hasData = snapshots && snapshots.length > 0;
          setHasFinancialData(hasData);

          if (hasData) {
            try {
              const analysis = await FinancialAnalysisService.analyzeBuilding(
                buildingData.id,
                buildingData.name,
                snapshots[0],
                buildingData.price || 0
              );
              setFinancialAnalysis(analysis);
            } catch (error) {
              console.error("Error analizando datos financieros:", error);
            }
          }
        } else {
          setHasFinancialData(false);
        }

        // Procesar documentos vencidos
        if (expiredResult.status === "fulfilled") {
          setExpiredDocs(expiredResult.value.items || []);
        }

        // Procesar datos ESG
        setEsgLoading(true);
        if (esgResult.status === "fulfilled" && esgResult.value) {
          setEsgData(esgResult.value);
        } else {
          setEsgData(null);
        }
        setEsgLoading(false);

        // Procesar unidades
        if (unitsResult.status === "fulfilled") {
          setUnits(unitsResult.value || []);
        }

        // Procesar costes mensuales
        if (costsResult.status === "fulfilled") {
          setMonthlyCosts(costsResult.value);
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

  // Cargar datos de eficiencia energética
  useEffect(() => {
    const loadEnergyEfficiency = async () => {
      if (!id || !building) {
        setEnergyEfficiencyData({
          rating: "—",
          consumption: 0,
          source: null,
        });
        return;
      }

      try {
        const certificatesData = await EnergyCertificatesService.getByBuilding(id);
        const certificates = certificatesData.certificates || [];

        if (certificates.length > 0) {
          // Usar el certificado más reciente
          const latestCertificate = certificates.sort((a, b) =>
            new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
          )[0];

          const consumptionValue = latestCertificate.primaryEnergyKwhPerM2Year;
          const consumption = typeof consumptionValue === 'number'
            ? consumptionValue
            : parseFloat(String(consumptionValue || '0'));

          if (isNaN(consumption)) {
            setEnergyEfficiencyData({
              rating: "—",
              consumption: 0,
              source: null,
            });
            return;
          }

          setEnergyEfficiencyData({
            rating: latestCertificate.rating,
            consumption: consumption,
            source: "certificate",
          });
          return;
        }

        // Si no hay certificado, mostrar guion
        setEnergyEfficiencyData({
          rating: "—",
          consumption: 0,
          source: null,
        });
      } catch {
        setEnergyEfficiencyData({
          rating: "—",
          consumption: 0,
          source: null,
        });
      }
    };

    loadEnergyEfficiency();
  }, [id, building]);

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

  // Función para guardar la referencia catastral
  const handleSaveCadastralRef = async () => {
    if (!building?.id) return;

    setIsSavingCadastralRef(true);
    try {
      const updatedBuilding = await BuildingsApiService.updateBuilding(building.id, {
        cadastralReference: tempCadastralRef.trim() || undefined,
      });
      setBuilding(updatedBuilding);
      setIsEditingCadastralRef(false);
      showSuccess("Referencia catastral actualizada correctamente");
    } catch (error) {
      showError("Error al actualizar la referencia catastral");
    } finally {
      setIsSavingCadastralRef(false);
    }
  };

  // Función para cancelar edición
  const handleCancelEditCadastralRef = () => {
    setTempCadastralRef(building?.cadastralReference || "");
    setIsEditingCadastralRef(false);
  };

  // Inicializar el valor temporal cuando se entra en modo edición
  useEffect(() => {
    if (isEditingCadastralRef) {
      setTempCadastralRef(building?.cadastralReference || "");
    }
  }, [isEditingCadastralRef, building?.cadastralReference]);

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



  // Calculate derived metrics - Lógica unificada con BuildingUnits y UnitsListDashboard
  // Una unidad está ocupada SOLO si su status es "ocupada" o "occupied" (case-insensitive)
  const occupancyStats = useMemo(() => {
    if (!units.length) return { percentage: 0, occupied: 0, total: 0 };
    
    const occupiedCount = units.filter((unit) => {
      const statusStr = (unit.status || "").toLowerCase().trim();
      return statusStr === "ocupada" || statusStr === "occupied";
    }).length;
    
    return {
      percentage: Math.round((occupiedCount / units.length) * 100),
      occupied: occupiedCount,
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
    const emptyData = [{ name: t("nodata"), value: 1, color: "#e5e7eb" }];

    if (!events.length) return emptyData;

    const maintenanceEvents = events.filter(e => e.category === 'maintenance');
    if (!maintenanceEvents.length) return emptyData;

    const completed = maintenanceEvents.filter(e => e.status === 'completed').length;
    const inProgress = maintenanceEvents.filter(e => e.status === 'in_progress').length;
    const scheduled = maintenanceEvents.filter(e => e.status === 'pending').length;

    // Atrasado: scheduled in past
    const delayed = maintenanceEvents.filter(e => e.status !== 'completed' && e.status !== 'cancelled' && new Date(e.eventDate) < new Date()).length;

    const result = [
      { name: t("completed"), value: completed, color: "#10b981" },
      { name: t("inprogress"), value: inProgress, color: "#3b82f6" },
      { name: t("scheduled"), value: scheduled, color: "#f59e0b" },
      { name: t("delayed"), value: delayed, color: "#ef4444" },
    ].filter(d => d.value > 0);

    return result.length > 0 ? result : emptyData;
  }, [events]);

  const data = chartData; // Alias para compatibilidad con código existente

  // Mostrar skeleton mientras carga
  if (loading) {
    return <BuildingGeneralViewLoading />;
  }


  // Datos para cuando no hay datos (un círculo gris)
  const emptyData = [{ name: t("nodata"), value: 1, color: "#e5e7eb" }];
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
                <h3 className="text-sm">{t("imagesOfBuilding")}</h3>
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
                      <span>{t("loadingImage")}</span>
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
                <h3 className="text-sm text-black">{t("generalInfo")}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div
                  data-slot="card"
                  className="bg-white text-card-foreground rounded-lg shadow-sm p-3"
                >
                  <h4 className="text-xs text-gray-500 mb-2">
                    {t("generalInfo")}
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{t("year")}</span>
                      <span className="text-sm text-gray-900">{building?.constructionYear || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{t("floors")}</span>
                      <span className="text-sm text-gray-900">{building?.numFloors || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{t("type")}</span>
                      <span className="text-sm text-gray-900">
                        {building ? (building.typology === 'residential' ? t("residential") : building.typology === 'mixed' ? t("mixed") : t("commercial")) : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  data-slot="card"
                  className="bg-white text-card-foreground rounded-lg shadow-sm p-3"
                >
                  <h4 className="text-xs text-gray-500 mb-2">
                    {t("energyEfficiency")}
                  </h4>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded flex items-center justify-center text-white ${energyEfficiencyData?.rating === "A" ? "bg-green-600" :
                        energyEfficiencyData?.rating === "B" ? "bg-green-500" :
                          energyEfficiencyData?.rating === "C" ? "bg-yellow-500" :
                            energyEfficiencyData?.rating === "D" ? "bg-orange-500" :
                              energyEfficiencyData?.rating === "E" ? "bg-orange-600" :
                                energyEfficiencyData?.rating === "F" ? "bg-red-500" :
                                  energyEfficiencyData?.rating === "G" ? "bg-red-600" :
                                    "bg-gray-400"
                      }`}>
                      {energyEfficiencyData?.rating || "—"}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        {energyEfficiencyData?.consumption && energyEfficiencyData.consumption > 0
                          ? `${energyEfficiencyData.consumption.toFixed(2)} kWh/m²·${t("year")}`
                          : "—"}
                      </p>
                      <p className="text-xs text-gray-500">kWh/m²·{t("year")}</p>
                    </div>
                  </div>
                </div>
                <div
                  data-slot="card"
                  className="bg-white text-card-foreground rounded-lg shadow-sm p-3"
                >
                  <h4 className="text-xs text-gray-500 mb-2">
                    {t("occupancy")}
                  </h4>
                  <div className="mb-2">
                    <span className="text-2xl text-gray-900">{occupancyStats.percentage}%</span>
                    <span className="text-xs text-gray-500 ml-1.5">
                      {t("occupied")} ({occupancyStats.occupied}/{occupancyStats.total})
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
              <h3 className="text-sm text-black">{t("activeIdentification")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Hash className="w-3.5 h-3.5 text-gray-600" />
                  <h3 className="text-sm">{t("identifiers")}</h3>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <label className="text-xs text-gray-500">{t("buildingId")}</label>
                    <p className="text-xs text-gray-900">{building?.id || "-"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t("portfolio")}</label>
                    <p className="text-xs text-gray-900"></p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t("technician")}</label>
                    <p className="text-xs text-gray-900">{building?.technicianEmail || "-"}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-xs text-gray-500">
                        {t("cadastralReference")}
                      </label>
                      {!isEditingCadastralRef && (
                        <button
                          type="button"
                          onClick={() => setIsEditingCadastralRef(true)}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          title={`${t("edit")} ${t("cadastralReference")}`}
                        >
                          <Edit2 className="w-3 h-3 text-gray-500" />
                        </button>
                      )}
                    </div>
                    {isEditingCadastralRef ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={tempCadastralRef}
                          onChange={(e) => setTempCadastralRef(e.target.value)}
                          className="w-full text-xs text-gray-900 border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Ej: 1234567VK1234A0001WX"
                          disabled={isSavingCadastralRef}
                        />
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handleSaveCadastralRef}
                            disabled={isSavingCadastralRef}
                            className="p-0.5 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                            title="Guardar"
                          >
                            <Save className="w-3 h-3 text-green-600" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditCadastralRef}
                            disabled={isSavingCadastralRef}
                            className="p-0.5 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                            title="Cancelar"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className="text-xs text-gray-900 truncate"
                        title={building?.cadastralReference || "-"}
                      >
                        {building?.cadastralReference || "-"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-600" />
                  <h3 className="text-sm">{t("building")}</h3>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <label className="text-xs text-gray-500">{t("domain")}</label>
                    <p className="text-xs text-gray-900">{t("fullProperty")}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      {t("address")}
                    </label>
                    <p
                      className="text-xs text-gray-900 truncate"
                      title={building?.address || "-"}
                    >
                      {building?.address || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t("surface")}</label>
                    <p className="text-xs text-gray-900">
                      {building?.squareMeters ? `${building.squareMeters.toLocaleString()} m²` : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-600" />
                  <h3 className="text-sm">{t("typeAndCharacteristics")}</h3>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <label className="text-xs text-gray-500">{t("type")}</label>
                    <p className="text-xs text-gray-900">
                      {building ? (building.typology === 'residential' ? t('residential') : building.typology === 'mixed' ? t('mixed') : t('commercial')) : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      {t("commercialUse")}
                    </label>
                    <p className="text-xs text-gray-900">
                      {building?.typology === 'commercial' ? t('commercial') : building?.typology === 'mixed' ? t('mixed') : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t("subType")}</label>
                    <p className="text-xs text-gray-900"></p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t("units")}</label>
                    <p className="text-xs text-gray-900">{building?.numUnits || "-"}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Target className="w-3.5 h-3.5 text-gray-600" />
                  <h3 className="text-sm">{t("strategy")}</h3>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <label className="text-xs text-gray-500">{t("strategy")}</label>
                    <p className="text-xs text-gray-900">
                      {financialAnalysis ? (financialAnalysis.recommendation.type === 'mejorar' ? t('improvement') : financialAnalysis.recommendation.type === 'mantener' ? t('core') : t('sale')) : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      {t("concept")}
                    </label>
                    <p className="text-xs text-gray-900">
                      {financialAnalysis ? (financialAnalysis.recommendation.type === 'mejorar' ? t('rehabilitation') : financialAnalysis.recommendation.type === 'mantener' ? t('maintenance') : t('disinvestment')) : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t("state")}</label>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${building ? (building.status === 'with_book' ? 'bg-green-100 text-green-700' : building.status === 'ready_book' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700') : 'bg-gray-100 text-gray-700'}`}>
                      {building ? (building.status === 'with_book' ? t('with_book') : building.status === 'ready_book' ? t('ready_book') : t('draft')) : "-"}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t("client")}</label>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-700">
                      {t("pending")}
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
              <h3 className="text-sm text-black">{t("technicalState"  )}</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded p-2 text-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-white/10 rounded">
                      <Book className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs mb-0.5">{t("digitalBook")}</h4>
                      <p className="text-xs text-blue-100">
                        {digitalBook ? (() => {
                          const activeSections = filterActiveSections(digitalBook.sections || []);
                          const totalActive = activeSections.length || 6;
                          const completedActive = activeSections.filter(s => s.complete).length;
                          return Math.round((completedActive / totalActive) * 100);
                        })() : 0}% {t("completed")} • {docCount} {t("documents")}
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
                    {digitalBook ? t("seeBook") : t("createBook")}
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
                      <h4 className="text-xs mb-0.5">{t("financialData")}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/cfo-intake/${id}`)}
                    className="bg-white text-[#1e3a8a] px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-50 transition-colors whitespace-nowrap text-xs h-7"
                  >
                    <Eye className="w-3 h-3" />
                    {t("loadFinancialData")}
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-sm">{t("maintenancePlan")}</h3>
                  </div>
                  {chartData === emptyData && (
                    <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      {t("noDataAvailable")}
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
                    <span className="text-gray-700">{t("completed")}: {events.filter(e => e.category === 'maintenance' && e.status === 'completed').length || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgb(59, 130, 246)" }}
                    ></div>
                    <span className="text-gray-700">{t("inProgress")}: {events.filter(e => e.category === 'maintenance' && e.status === 'in_progress').length || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgb(245, 158, 11)" }}
                    ></div>
                    <span className="text-gray-700">{t("scheduled")}: {events.filter(e => e.category === 'maintenance' && e.status === 'pending').length || "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgb(239, 68, 68)" }}
                    ></div>
                    <span className="text-gray-700">{t("overdue")}: {events.filter(e => e.category === 'maintenance' && e.status !== 'completed' && e.status !== 'cancelled' && new Date(e.eventDate) < new Date()).length || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1 h-3.5 bg-emerald-600 rounded"></div>
              <h3 className="text-sm text-black">{t("monthlyExpenses")}</h3>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-1.5 mb-1.5">
                  <div className="p-1.5 border border-blue-200 bg-blue-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Zap className="w-3 h-3 text-blue-600" />
                      <p className="text-xs text-blue-900">{t("electricity")}</p>
                    </div>
                    <p className="text-sm text-blue-700">{monthlyCosts?.byService['electricity'] ? `€${monthlyCosts.byService['electricity'].toFixed(2)}` : "€-"}</p>
                    <p className="text-xs text-blue-600">{t("building")}</p>
                  </div>
                  <div className="p-1.5 border border-cyan-200 bg-cyan-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Droplet className="w-3 h-3 text-cyan-600" />
                      <p className="text-xs text-cyan-900">{t("water")}</p>
                    </div>
                    <p className="text-sm text-cyan-700">{monthlyCosts?.byService['water'] ? `€${monthlyCosts.byService['water'].toFixed(2)}` : "€-"}</p>
                    <p className="text-xs text-cyan-600">{t("total")}</p>
                  </div>
                  <div className="p-1.5 border border-orange-200 bg-orange-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Flame className="w-3 h-3 text-orange-600" />
                      <p className="text-xs text-orange-900">{t("gas")}</p>
                    </div>
                    <p className="text-sm text-orange-700">{monthlyCosts?.byService['gas'] ? `€${monthlyCosts.byService['gas'].toFixed(2)}` : "€-"}</p>
                    <p className="text-xs text-orange-600">{t("total")}</p>
                  </div>
                  <div className="p-1.5 border border-purple-200 bg-purple-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <FileText className="w-3 h-3 text-purple-600" />
                      <p className="text-xs text-purple-900">{t("ibi")}</p>
                    </div>
                    <p className="text-sm text-purple-700">{monthlyCosts?.byService['ibi'] ? `€${monthlyCosts.byService['ibi'].toFixed(2)}` : "€-"}</p>
                    <p className="text-xs text-purple-600">{t("units")}</p>
                  </div>
                  <div className="p-1.5 border border-amber-200 bg-amber-50 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Trash className="w-3 h-3 text-amber-600" />
                      <p className="text-xs text-amber-900">{t("waste")}</p>
                    </div>
                    <p className="text-sm text-amber-700">{monthlyCosts?.byService['waste'] ? `€${monthlyCosts.byService['waste'].toFixed(2)}` : "€-"}</p>
                    <p className="text-xs text-amber-600">{t("units")}</p>
                  </div>
                  <div className="p-1.5 border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100 rounded">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Euro className="w-3 h-3 text-green-700" />
                      <p className="text-xs text-green-900">{t("total")}</p>
                    </div>
                    <p className="text-sm text-green-800">{monthlyCosts?.total ? `€${monthlyCosts.total.toFixed(2)}` : "€-"}</p>
                    <p className="text-xs text-green-700">{monthlyCosts?.total ? `€${(monthlyCosts.total * 12).toFixed(2)}/año` : "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-1.5 bg-purple-50 border border-purple-200 rounded">
                    <div className="flex items-center gap-0.5 mb-1">
                      <Building2 className="w-2.5 h-2.5 text-purple-600" />
                      <p className="text-xs text-purple-900">
                        {t("communityMeters")}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-blue-600" />
                          <span className="text-gray-700">{t("electricity")}</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Droplet className="w-2.5 h-2.5 text-cyan-600" />
                          <span className="text-gray-700">{t("water")}</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-orange-600" />
                          <span className="text-gray-700">{t("gas")}</span>
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
                      <p className="text-xs text-indigo-900">{t("unitCosts")}</p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Droplet className="w-2.5 h-2.5 text-cyan-600" />
                          <span className="text-gray-700">{t("water")}</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-orange-600" />
                          <span className="text-gray-700">{t("gas")}</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5 text-purple-600" />
                          <span className="text-gray-700">{t("ibi")}</span>
                        </div>
                        <span className="text-gray-900">€-</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Trash2 className="w-2.5 h-2.5 text-amber-600" />
                          <span className="text-gray-700">{t("waste")}</span>
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
              <h3 className="text-sm text-black">{t("auditory")}</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <div className="p-1 bg-purple-100 rounded">
                    <Scale className="w-3 h-3 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm">{t("auditoryRegulatoria")}</h3>
                    <p className="text-xs text-gray-500">Directiva EPBD 2030</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs text-gray-600">
                      {t("currentGrade")}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{_esgData?.status === 'complete' ? _esgData.data.label : "-"}</span>
                      <span className="text-xs text-gray-500">
                        -
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded p-1">
                    <div className="text-xs text-blue-700">{t("objective")}</div>
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
                        <span className="text-gray-600 text-xs">{t("consumption")}</span>
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
                        <span className="text-gray-600 text-xs">{t("emissions")}</span>
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
                    <h3 className="text-sm">{t("auditoryTechnical")}</h3>
                    <p className="text-xs text-gray-500">{t("bookOfBuilding")}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded p-1.5 mb-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5 text-[#1e3a8a]" />
                      <span className="text-xs text-gray-700">{t("completed")}</span>
                    </div>
                    <span className="text-xs text-[#1e3a8a]">{digitalBook ? (() => {
                      const activeSections = filterActiveSections(digitalBook.sections || []);
                      const totalActive = activeSections.length || 6;
                      const completedActive = activeSections.filter(s => s.complete).length;
                      return Math.round((completedActive / totalActive) * 100);
                    })() : 0}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-1">
                    <div
                      className="bg-[#1e3a8a] h-1 rounded-full"
                      style={{ width: digitalBook ? (() => {
                        const activeSections = filterActiveSections(digitalBook.sections || []);
                        const totalActive = activeSections.length || 6;
                        const completedActive = activeSections.filter(s => s.complete).length;
                        return `${Math.round((completedActive / totalActive) * 100)}%`;
                      })() : '0%' }}
                    ></div>
                  </div>
                  <div className="mt-0.5 text-xs text-gray-600">{digitalBook ? (() => {
                    const activeSections = filterActiveSections(digitalBook.sections || []);
                    const completedActive = activeSections.filter(s => s.complete).length;
                    const totalActive = activeSections.length || 6;
                    return `${completedActive}/${totalActive}`;
                  })() : '0/6'} tareas</div>
                </div>
                <div className="space-y-1 flex-1">
                  <div className="text-xs text-gray-700">{t("improvements")}:</div>
                  <div className="bg-orange-50 rounded p-1">
                    <div className="flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-orange-600" />
                      <span className="text-xs text-orange-900">
                        {t("envelope")}: -
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
                    <h3 className="text-sm">{t("auditoryFinancial")}</h3>
                    <p className="text-xs text-gray-500">{t("roiAnalysis")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                  <div className="border-l-2 border-blue-500 pl-1">
                    <div className="text-xs text-gray-600">
                      {t("activeValue")}
                    </div>
                    <div className="text-xs">
                      {financialAnalysis?.metrics.marketValue ? `€${(financialAnalysis.metrics.marketValue / 1000000).toFixed(2)}M` : "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {building?.price && building?.squareMeters ? `${Math.round(building.price / building.squareMeters)} €/m²` : "-"}
                    </div>
                  </div>
                  <div className="border-l-2 border-green-500 bg-green-50 pl-1">
                    <div className="text-xs text-green-700">{t("currentGrade")}</div>
                    <div className="text-xs text-green-600">
                      {financialAnalysis?.metrics.roi ? `${financialAnalysis.metrics.roi.toFixed(2)}%` : "-"}
                    </div>
                    <div className="text-xs text-green-600">{t("annual")}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded p-1.5 mb-1.5 flex-1">
                  <div className="text-xs text-gray-700 mb-1 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5 text-green-600" />
                    <span>{t("postImprovement")}:</span>
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("investment")}:</span>
                      <span className="text-orange-600">
                        {financialAnalysis?.recommendation.financialImpact.investmentRequired ? `€${Math.round(financialAnalysis.recommendation.financialImpact.investmentRequired / 1000)}k` : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("revaluation")}:</span>
                      <span className="text-green-600">
                        {financialAnalysis?.metrics.valueGap ? `+${financialAnalysis.metrics.valueGap.toFixed(1)}%` : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("futureValue")}:</span>
                      <span className="text-green-700">
                        {financialAnalysis?.recommendation.financialImpact.projectedValue ? `€${(financialAnalysis.recommendation.financialImpact.projectedValue / 1000000).toFixed(2)}M` : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1e3a8a] text-white rounded p-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="text-xs">{t("netProfit")}</div>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </div>
                  <div className="text-base">
                    {financialAnalysis?.recommendation.financialImpact.expectedReturn ? `€${Math.round(financialAnalysis.recommendation.financialImpact.expectedReturn / 1000)}k` : "-"}
                  </div>
                  <div className="flex justify-between text-xs mt-0.5 opacity-90">
                    <span>ROI: {financialAnalysis?.recommendation.financialImpact.irr ? `${Math.round(financialAnalysis.recommendation.financialImpact.irr)}%` : "-"}</span>
                    <span>{financialAnalysis?.recommendation.financialImpact.paybackPeriod ? `${(financialAnalysis.recommendation.financialImpact.paybackPeriod / 12).toFixed(1)} ${t("years", "años")}` : "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-green-600 rounded"></div>
                <h3 className="text-sm text-black">{t("rents")}</h3>
              </div>
              <div
                data-slot="card"
                className="bg-white text-card-foreground rounded-lg shadow-sm p-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Euro className="w-3.5 h-3.5 text-green-600" />
                    <h3 className="text-xs">{t("rents")}</h3>
                  </div>
                  <button
                    data-slot="button"
                    className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md gap-1.5 has-[&gt;svg]:px-2.5 text-xs h-6 px-2"
                  >
                    {t("viewDetail")}
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
                      <p className="text-xs text-gray-600">{t("paid")}</p>
                    </div>
                    <div className="text-center p-1.5 bg-amber-50 rounded">
                      <p className="text-xs text-amber-600">{rentStats.pending || "-"}</p>
                      <p className="text-xs text-gray-600">{t("pending")}</p>
                    </div>
                    <div className="text-center p-1.5 bg-red-50 rounded">
                      <p className="text-xs text-red-600">{rentStats.delayed || "-"}</p>
                      <p className="text-xs text-gray-600">{t("delayed")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-[#1e3a8a] rounded"></div>
                <h3 className="text-sm text-black">{t("actionsCalendar")}</h3>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm text-gray-900">{t("nextActions")}</h3>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="p-1.5 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center gap-1 mb-0.5">
                      <TriangleAlert className="w-3 h-3 text-red-600" />
                      <p className="text-xs text-red-900">{t("urgent")}</p>
                    </div>
                    <p className="text-xs text-red-700">{calendarStats.urgent}</p>
                  </div>
                  <div className="p-1.5 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <p className="text-xs text-blue-900">{t("thisMonth")}</p>
                    </div>
                    <p className="text-xs text-blue-700">{calendarStats.thisMonth}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-700 mb-1">
                    {t("priorityActions")}:
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
                      {t("noPendingActions")}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/building/${id}/general-view/calendar`)}
                  className="w-full mt-2 px-2 py-1.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs rounded transition-colors"
                >
                  {t("viewCompleteCalendar")}
                </button>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-3.5 bg-red-600 rounded"></div>
                <h3 className="text-sm text-black">{t("followUpAndAlerts")}</h3>
              </div>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-sm">{t("recentActivity")}</h3>
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
                        <p className="text-xs text-gray-500">{t("noRecentActivity")}.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bell className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="text-sm">{t("nextAlerts")}</h3>
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
                        <p className="text-xs text-gray-500">{t("noUrgentAlerts")}.</p>
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
