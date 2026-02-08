import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ProgressBar from "../ui/ProgressBar";
import {
  getBookByBuilding,
  processPDFWithAI,
  type DigitalBook,
} from "../../services/digitalbook";
import { useToast } from "../../contexts/ToastContext";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Wrench,
  FileCheck,
  Settings,
  Zap,
  Hammer,
  Leaf,
  Paperclip,
  CheckCircle2,
  Circle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// Configuración de secciones con iconos y colores
const SECTION_CONFIG = (t: any) => ({
  general_data: {
    title: t("generalData"),
    description: t("generalDataDesc"),
    uiId: "general_data",
    icon: Building2,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100/50",
  },
  construction_features: {
    title: t("constructionFeatures"),
    description: t("constructionFeaturesDesc"),
    uiId: "construction_features",
    icon: Wrench,
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100/50",
  },
  certificates_and_licenses: {
    title: t("certificatesAndLicenses"),
    description: t("certificatesAndLicensesDesc"),
    uiId: "certificates",
    icon: FileCheck,
    color: "green",
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100/50",
  },
  maintenance_and_conservation: {
    title: t("maintenanceAndConservation"),
    description: t("maintenanceAndConservationDesc"),
    uiId: "maintenance",
    icon: Settings,
    color: "orange",
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100/50",
  },
  facilities_and_consumption: {
    title: t("facilitiesAndConsumption"),
    description: t("facilitiesAndConsumptionDesc"),
    uiId: "installations",
    icon: Zap,
    color: "yellow",
    gradient: "from-yellow-500 to-yellow-600",
    bgGradient: "from-yellow-50 to-yellow-100/50",
  },
  renovations_and_rehabilitations: {
    title: t("renovationsAndRehabilitations"),
    description: t("renovationsAndRehabilitationsDesc"),
    uiId: "reforms",
    icon: Hammer,
    color: "red",
    gradient: "from-red-500 to-red-600",
    bgGradient: "from-red-50 to-red-100/50",
  },
  sustainability_and_esg: {
    title: t("sustainabilityAndESG"),
    description: t("sustainabilityAndESGDesc"),
    uiId: "sustainability",
    icon: Leaf,
    color: "emerald",
    gradient: "from-emerald-500 to-emerald-600",
    bgGradient: "from-emerald-50 to-emerald-100/50",
  },
  annex_documents: {
    title: t("annexDocuments"),
    description: t("annexDocumentsDesc"),
    uiId: "attachments",
    icon: Paperclip,
    color: "indigo",
    gradient: "from-indigo-500 to-indigo-600",
    bgGradient: "from-indigo-50 to-indigo-100/50",
  },
});

interface DigitalBookHubProps {
  buildingName?: string;
  buildingId?: string;
}

const DigitalBookHub: React.FC<DigitalBookHubProps> = ({
  buildingName = "Torre Central",
  buildingId: buildingIdProp = "building-1",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { buildingId: buildingIdParam } = useParams();
  const { showToast } = useToast();

  // Priorizar: state > URL param > prop
  const buildingId =
    location.state?.buildingId || buildingIdParam || buildingIdProp;
  const buildingNameFinal = location.state?.buildingName || buildingName;

  const [book, setBook] = useState<DigitalBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFile, setProcessingFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [backgroundProcessing, setBackgroundProcessing] = useState(false);
  const [updatingSections, setUpdatingSections] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Todos los roles pueden editar
  const canEdit = true;

  const { t } = useTranslation();
  const sections = useMemo(() => {
    const config = SECTION_CONFIG(t);
    if (!book || !book.sections || book.sections.length === 0) {
      return Object.entries(config).map(([_type, meta]) => ({
        key: meta.uiId,
        title: meta.title,
        description: meta.description,
        isCompleted: false,
        icon: meta.icon,
        color: meta.color,
        gradient: meta.gradient,
        bgGradient: meta.bgGradient,
      }));
    }
    return book.sections.map((s) => {
      const meta = config[s.type] || {
        title: s.type,
        description: "",
        uiId: s.type,
        icon: FileCheck,
        color: "gray",
        gradient: "from-gray-500 to-gray-600",
        bgGradient: "from-gray-50 to-gray-100/50",
      };
      return {
        key: meta.uiId,
        title: meta.title,
        description: meta.description,
        isCompleted: Boolean(s.complete),
        icon: meta.icon,
        color: meta.color,
        gradient: meta.gradient,
        bgGradient: meta.bgGradient,
      };
    });
  }, [book, t]);

  const completedSections =
    book?.sections.filter((s) => s.complete).length ?? 0;
  const totalSections = book?.sections.length ?? 8;

  const isNewBuilding = location.state?.isNewBuilding || false;

  const handlePDFImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea PDF
    if (file.type !== "application/pdf") {
      showToast({
        type: "error",
        title: t("invalidFileType"),
        message: t("onlyPDFAllowed"),
        duration: 5000,
      });
      return;
    }

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast({
        type: "error",
        title: t("fileTooLarge"),
        message: t("fileSizeLimit"),
        duration: 5000,
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingFile(file);
      setProgress(0);
      setTimeElapsed(0);

      // Simular progreso mientras se procesa
      const progressInterval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 1000);

      // Simular pasos de procesamiento
      const steps = [
        t("uploadingFile"),
        t("extractingText"),
        t("processingWithAI"),
        t("validatingData"),
        t("creatingBuildingBook"),
      ];

      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        if (stepIndex < steps.length) {
          setCurrentStep(steps[stepIndex]);
          stepIndex++;
        }
      }, 8000);

      // Llamar a la API de procesamiento con IA
      await processPDFWithAI(buildingId, file);

      // Completar progreso
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      setProgress(100);
      setCurrentStep(t("processingCompleted"));

      // El éxito se maneja a través de notificaciones del sistema

      // Actualizar el libro
      setTimeout(() => {
        setUpdatingSections(true);
        loadBook(false).then(() => {
          setTimeout(() => {
            setUpdatingSections(false);
          }, 1000);
        });
        setIsProcessing(false);
        setProcessingFile(null);
        setProgress(0);
        setCurrentStep("");
        setBackgroundProcessing(false);
        // Limpiar el input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error procesando PDF con IA:", error);

      // Los errores se manejan a través de notificaciones del sistema

      setIsProcessing(false);
      setProcessingFile(null);
      setProgress(0);
      setCurrentStep("");
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, "0")}`
      : `${secs}s`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 👉 Aquí pasamos buildingId en la URL
  const handleSectionClick = (sectionId: string) => {
    navigate(`/digital-book/section/${buildingId}/${sectionId}`, {
      state: {
        buildingName: buildingNameFinal,
        buildingId,
        sectionId,
        userRole: location.state?.userRole,
      },
    });
  };

  const loadBook = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setLoading(true);
      }
      try {
        const b = await getBookByBuilding(buildingId);
        setBook(b);
      } catch (error) {
        // Errores reales (no 404, que ya se maneja en getBookByBuilding)
        console.error("Error cargando libro del edificio:", error);
        setBook(null);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [buildingId]
  );

  // Load on mount and when building changes
  useEffect(() => {
    (async () => {
      await loadBook();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingId]);

  // useEffect deshabilitado - causaba peticiones infinitas
  // useEffect(() => {
  //   const onFocus = () => { loadBook(false); };
  //   ...
  // }, [loadBook, backgroundProcessing]);

  // Detectar cuando el usuario sale de la pantalla durante el procesamiento
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue =
          "El procesamiento de IA está en curso. ¿Estás seguro de que quieres salir?";
        setBackgroundProcessing(true);
        showToast({
          type: "info",
          title: t("processingInBackground"),
          message:
            t("processingInBackgroundMessage"),
          duration: 8000,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isProcessing) {
        setBackgroundProcessing(true);
        showToast({
          type: "info",
          title: t("processingInBackground"),
          message:
            t("processingInBackgroundMessage"),
          duration: 8000,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isProcessing, showToast]);

  // If navigation brought a message (e.g., completed), refresh once
  useEffect(() => {
    if (location.state?.message) {
      loadBook(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.message]);

  // Polling deshabilitado - causaba problemas de rendimiento
  // useEffect(() => {
  //   if (!location.state?.refreshBook || pollingStartedRef.current) return;
  //   // ... polling code removed
  // }, [buildingId]);

  const getStatusMessage = () => {
    if (completedSections === 0)
      return t("bookInProgress");
    if (completedSections === totalSections)
      return t("bookCompleted");
    return `${t("inProgress")} – ${completedSections} ${t("of")} ${totalSections} ${t("sectionsCompleted")}`;
  };

  const getStatusColor = () => {
    if (completedSections === 0) return "text-gray-600";
    if (completedSections === totalSections) return "text-green-600";
    return "text-blue-600";
  };

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        {/* Skeleton Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Skeleton Sections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {t("digitalBook")}
          </h1>
          <p className="text-sm text-gray-600">{buildingNameFinal}</p>
        </div>

        <div className="text-right">
          <div className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusMessage()}
          </div>
          {isNewBuilding && (
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {t("newBuildingRecentlyCreated")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Estructura desktop: progreso (2/3) + importar (1/3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Panel Progreso */}
        <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1">
              <h2 className="text-base font-medium text-gray-900 mb-1">
                {t("buildingBookProgress")}
              </h2>
              <p className="text-xs text-gray-500">
                {t("completeAllSectionsToFinishBook")}
              </p>
            </div>
            <div className="text-right ml-4">
              <div className="text-sm font-medium text-gray-900">
                {completedSections} de {totalSections}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {Math.round((completedSections / totalSections) * 100)}% {t("completed")}
              </div>
            </div>
          </div>
          <ProgressBar
            current={completedSections}
            total={totalSections}
            size="lg"
          />
        </div>

        {/* Panel Importar PDF - Solo para técnicos */}
        {canEdit && (
          <div
            className={`bg-white rounded-lg border overflow-hidden transition-all ${
              backgroundProcessing
                ? "border-orange-200 bg-orange-50/30"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0 ${
                    backgroundProcessing ? "bg-orange-50" : "bg-gray-50"
                  }`}
                >
                  {backgroundProcessing ? (
                    <svg
                      className="w-5 h-5 text-orange-600 animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {backgroundProcessing
                      ? t("processingInBackground")
                      : t("importContentFromPDF")}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {backgroundProcessing
                      ? t("processingInBackgroundMessage")
                      : t("importContentFromPDFMessage")}
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-3">
                <button
                  onClick={handlePDFImport}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                  {isProcessing ? t("processing") : t("uploadPDF")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Área de progreso */}
      {isProcessing && processingFile && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">
                  {processingFile.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatFileSize(processingFile.size)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{formatTime(timeElapsed)}</span>
                <span>{Math.round(progress)}% {t("completed")}</span>
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{currentStep || "Iniciando procesamiento..."}</span>
              <span>{t("estimatedTime")}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Pasos */}
          <div className="flex gap-2 text-xs">
            {[t("upload"), t("extraction"), t("ai"), t("validation"), t("creation")].map(
              (step, index) => (
                <div
                  key={step}
                  className={`px-2 py-1 rounded ${
                    progress / 20 > index
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {step}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Checklist de secciones */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 bg-gray-50 rounded-md">
              <Sparkles className="w-4 h-4 text-gray-600" />
            </div>
            <h2 className="text-base font-medium text-gray-900">
              {t("buildingBookSections")}
            </h2>
          </div>
          <p className="text-xs text-gray-500 ml-8">
            {canEdit
              ? t("generalDataMessage")
              : t("generalDataMessage2")}
          </p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {updatingSections
              ? // Mostrar skeleton mientras se actualizan las secciones
                Object.entries(SECTION_CONFIG(t)).map(([_, meta]) => (
                  <div
                    key={meta.uiId}
                    className="p-6 bg-gray-50 rounded-lg animate-pulse"
                  >
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                ))
              : // Mostrar secciones normales con diseño acorde a la web
                sections.map((section, index) => {
                  const IconComponent = section.icon || FileCheck;
                  return (
                    <div
                      key={section.key}
                      className={`
                      group bg-white rounded-lg border transition-all duration-200 cursor-pointer
                      ${
                        section.isCompleted
                          ? "border-blue-200 hover:border-blue-300"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                      onClick={() => handleSectionClick(section.key)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSectionClick(section.key)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Icono con fondo de color suave */}
                          <div
                            className={`
                          flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center
                          ${section.isCompleted ? "bg-blue-50" : "bg-gray-50"}
                        `}
                          >
                            <IconComponent
                              className={`
                            w-5 h-5
                            ${
                              section.isCompleted
                                ? "text-blue-600"
                                : "text-gray-600"
                            }
                          `}
                              strokeWidth={2}
                            />
                          </div>

                          {/* Contenido */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-950 transition-colors">
                                {section.title}
                              </h3>
                              {section.isCompleted ? (
                                <div className="flex-shrink-0">
                                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                    <CheckCircle2
                                      className="w-3 h-3 text-white"
                                      strokeWidth={2.5}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-shrink-0">
                                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-500">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed">
                              {section.description}
                            </p>

                            {/* Badge de estado */}
                            <div className="flex items-center gap-1.5 mt-2">
                              {section.isCompleted ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {t('completed')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600">
                                  <Circle className="w-3 h-3" />
                                  {t('pending')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Flecha */}
                          <div className="flex-shrink-0">
                            <div
                              className={`
                            w-7 h-7 rounded-md flex items-center justify-center
                            transition-all duration-200
                            ${
                              section.isCompleted
                                ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                                : "bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"
                            }
                            group-hover:translate-x-0.5
                          `}
                            >
                              <ChevronRight
                                className="w-3.5 h-3.5"
                                strokeWidth={2.5}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div className="text-sm text-gray-600">
          <p>
            💡 {t("buildingBookSectionsMessage")}
          </p>
        </div>

        <div className="flex gap-3">
          {completedSections === totalSections && (
            <button
              onClick={() =>
                alert(
                  "¡Libro del Edificio completado! Funcionalidad de exportación próximamente."
                )
              }
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {t("exportBuildingBook")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalBookHub;
