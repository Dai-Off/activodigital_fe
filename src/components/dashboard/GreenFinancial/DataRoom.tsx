import {
  Building2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  CircleAlert,
  CircleCheck,
  Clock,
  Download,
  Info,
  Loader2,
  LucideAward,
  LucideScale,
  LucideWrench,
  TriangleAlert,
  Upload,
  AlertCircle,
  FileText,
} from "lucide-react";
import { DataRoomExportService } from "~/services/dataRoomExport";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import DocumentItem, { type DocumentStatus } from "./componentes/DocumentItem";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
// import { useNavigation } from "~/contexts/NavigationContext";
import {
  fetchDataRoomAudit,
  uploadDataRoomFile,
  uploadDataRoomBatch,
  fetchBatchJobs,
  classifyBatchJob,
  downloadDossierPdf,
} from "~/services/dataRoom";
import { toast } from "sonner";
import documentsData from "./documents.json";

function ManualClassifyCombobox({
  jobId,
  options,
  onClassify,
  t,
}: {
  jobId: string;
  options: { value: string; label: string }[];
  onClassify: (jobId: string, checklistId: string) => Promise<void>;
  t: any;
}) {
  const [open, setOpen] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleSelect = async (selectedValue: string) => {
    const selectedOpt = options.find(
      (o) =>
        o.label.toLowerCase() === selectedValue.toLowerCase() ||
        o.value.toLowerCase() === selectedValue.toLowerCase(),
    );
    if (selectedOpt) {
      setIsClassifying(true);
      setOpen(false);
      await onClassify(jobId, selectedOpt.value);
      setIsClassifying(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={isClassifying}
          className="flex items-center justify-between ml-2 w-48 md:w-56 px-2.5 py-1.5 text-[11px] text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-all font-medium"
        >
          <span className="truncate">
            {isClassifying
              ? t("dataRoom.classifying") || "Clasificando..."
              : t("dataRoom.classifyPlaceholder") || "Buscar tipo de doc..."}
          </span>
          <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] p-0 shadow-2xl border-gray-200 bg-white z-[100]"
        align="start"
      >
        <Command
          filter={(value, search) => {
            const normalize = (s: string) =>
              s
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            return normalize(value).includes(normalize(search)) ? 1 : 0;
          }}
          className="bg-white"
        >
          <CommandInput
            placeholder={
              t("dataRoom.classifyPlaceholder") || "Buscar tipo de doc..."
            }
            className="h-9 text-[11px]"
          />
          <CommandList>
            <CommandEmpty className="py-2 text-[11px] text-center text-gray-500">
              No se encontraron resultados
            </CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={handleSelect}
                  className="text-[11px] py-1.5 cursor-pointer"
                >
                  <span className="truncate">{opt.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const DataRoom = () => {
  const { t } = useTranslation();
  const { buildingId: selectedBuildingId } = useParams<{
    buildingId: string;
  }>();
  const [auditData, setAuditData] = useState<Record<string, any>>({});
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [isDownloadingDossier, setIsDownloadingDossier] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [batchJobs, setBatchJobs] = useState<any[]>([]);
  const batchFileInputRef = useRef<HTMLInputElement>(null);
  const batchPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_BATCH_FILES = 5;

  interface Category {
    id: string;
    name: string;
    icon: typeof Building2;
    guide: string;
    color: string;
    mandatory: number;
    verified: number;
    optional: number;
    subcategories: number;
  }

  interface Document {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    type: "mandatory" | "optional";
    status: "verified" | "pending" | "rejected";
  }

  // Definición base de categorías (sin conteos)
  const categoryDefs = [
    {
      id: "technical",
      name: t("dataRoom.technicalDocs"),
      icon: LucideWrench,
      guide: t("dataRoom.guideTechnical"),
      color: "blue",
    },
    {
      id: "legal",
      name: t("dataRoom.legalDocs"),
      icon: LucideScale,
      guide: t("dataRoom.guideLegal"),
      color: "purple",
    },
    {
      id: "financial",
      name: t("dataRoom.financialDocs"),
      icon: LucideAward,
      guide: t("dataRoom.guideFinancial"),
      color: "green",
    },
    {
      id: "fiscal",
      name: t("dataRoom.fiscalDocs"),
      icon: LucideAward,
      guide: t("dataRoom.guideFiscal"),
      color: "orange",
    },
  ];

  const documents: Document[] = documentsData as Document[];

  const loadAuditData = useCallback(
    async (isInitial: boolean = false) => {
      if (!selectedBuildingId) return;

      if (isInitial) {
        setIsLoadingAudit(true);
      }

      try {
        const data = await fetchDataRoomAudit(selectedBuildingId);
        const auditMap = (data || []).reduce((acc: any, audit: any) => {
          const key = audit.checklist_id || audit.checklistId;
          if (key) {
            acc[key] = audit;
          }
          return acc;
        }, {});
        setAuditData(auditMap);
      } catch (error) {
        console.error("Error loading audit data:", error);
      } finally {
        setIsLoadingAudit(false);
      }
    },
    [selectedBuildingId],
  );

  const loadBatchJobs = useCallback(async () => {
    if (!selectedBuildingId) return;
    try {
      const jobs = await fetchBatchJobs(selectedBuildingId);
      setBatchJobs(jobs || []);

      // Auto-poll si hay jobs activos
      const hasActive = (jobs || []).some(
        (j: any) => j.status === "queued" || j.status === "processing",
      );
      if (hasActive && !batchPollRef.current) {
        batchPollRef.current = setInterval(async () => {
          try {
            const updated = await fetchBatchJobs(selectedBuildingId);
            setBatchJobs(updated || []);
            const stillActive = (updated || []).some(
              (j: any) => j.status === "queued" || j.status === "processing",
            );
            if (!stillActive && batchPollRef.current) {
              clearInterval(batchPollRef.current);
              batchPollRef.current = null;
              // Recargar audit data al terminar para reflejar clasificaciones
              loadAuditData(false);
            }
          } catch {
            /* silently retry */
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Error loading batch jobs:", error);
    }
  }, [selectedBuildingId, loadAuditData]);
  // Eliminamos auditData de dependencias para evitar recursividad

  // Carga inicial
  useEffect(() => {
    loadAuditData(true);
    loadBatchJobs();
    return () => {
      if (batchPollRef.current) {
        clearInterval(batchPollRef.current);
        batchPollRef.current = null;
      }
    };
  }, [selectedBuildingId, loadAuditData, loadBatchJobs]);

  // Polling para actualizar estados cuando hay archivos en cola o procesándose
  useEffect(() => {
    const hasActiveJobs = Object.values(auditData).some(
      (audit) => audit.status === "queued" || audit.status === "processing",
    );

    if (hasActiveJobs) {
      const interval = setInterval(() => {
        loadAuditData(false);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [auditData, loadAuditData]);

  const handleUpload = async (checklistId: string, file: File) => {
    if (!selectedBuildingId) {
      toast.error(
        t("dataRoom.errors.noBuildingSelected") ||
          "Seleccione un edificio primero",
      );
      return;
    }

    const toastId = toast.loading(
      t("dataRoom.uploading") || "Subiendo archivo...",
    );

    try {
      // 1. Subir archivo al backend
      await uploadDataRoomFile(selectedBuildingId, checklistId, file);
      toast.success(
        t("dataRoom.uploadSuccess") || "Archivo subido correctamente",
        { id: toastId },
      );

      // 2. Recargar datos de auditoría
      loadAuditData(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error.message ||
          t("dataRoom.uploadError") ||
          "Error al subir el archivo",
        { id: toastId },
      );
    }
  };

  const handleBatchUpload = async (files: File[]) => {
    if (!selectedBuildingId) {
      toast.error(
        t("dataRoom.errors.noBuildingSelected") ||
          "Seleccione un edificio primero",
      );
      return;
    }

    if (files.length > MAX_BATCH_FILES) {
      toast.error(
        t("dataRoom.errors.tooManyFiles") ||
          `Máximo ${MAX_BATCH_FILES} archivos por lote`,
      );
      return;
    }

    if (files.length === 0) return;

    const toastId = toast.loading(
      t("dataRoom.uploadingBatch") || `Subiendo ${files.length} archivo(s)...`,
    );

    try {
      await uploadDataRoomBatch(selectedBuildingId, files);
      toast.success(
        t("dataRoom.uploadBatchSuccess") ||
          `${files.length} archivo(s) encolado(s) para clasificación IA`,
        { id: toastId },
      );
      loadAuditData(false);
      loadBatchJobs();
    } catch (error: any) {
      console.error("Batch upload error:", error);
      toast.error(
        error.message ||
          t("dataRoom.uploadError") ||
          "Error al subir los archivos",
        { id: toastId },
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).slice(
      0,
      MAX_BATCH_FILES,
    );
    if (droppedFiles.length > 0) {
      handleBatchUpload(droppedFiles);
    }
  };

  const handleBatchFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
      ? Array.from(e.target.files).slice(0, MAX_BATCH_FILES)
      : [];
    if (selected.length > 0) {
      handleBatchUpload(selected);
    }
    if (e.target) e.target.value = "";
  };

  const getDocumentStatus = (docId: string): DocumentStatus => {
    const audit = auditData[docId];
    if (!audit) return "pending";

    if (audit.status === "queued") return "queued";
    if (audit.status === "processing") return "processing";

    if (
      audit.status === "uploaded" ||
      audit.status === "verified" ||
      audit.status === "review" ||
      audit.status === "acepted" ||
      audit.status === "accepted"
    )
      return "verified";
    if (audit.status === "rejected" || audit.status === "failed")
      return "rejected";
    return "pending";
  };

  const handleManualClassify = async (jobId: string, checklistId: string) => {
    // Validar si ya existe un archivo verificado para este checklistId
    const existingAudit = auditData[checklistId];
    if (
      existingAudit &&
      ["verified", "accepted", "acepted", "uploaded", "review"].includes(
        existingAudit.status,
      )
    ) {
      toast.error(
        t("dataRoom.errors.alreadyUploaded") ||
          "Ya existe un archivo verificado para este tipo de documento",
      );
      return;
    }

    try {
      await classifyBatchJob(jobId, checklistId);
      toast.success(
        t("dataRoom.classifySuccess") || "Documento clasificado manualmente",
      );
      loadBatchJobs();
      loadAuditData(false);
    } catch (error: any) {
      toast.error(
        error.message ||
          t("dataRoom.classifyError") ||
          "Error al clasificar documento",
      );
    }
  };

  const allDocsOptions = useMemo(() => {
    return documents
      .filter((d) => {
        const audit = auditData[d.id];
        // Ocultar si ya está verificado o aceptado
        if (
          audit &&
          ["verified", "accepted", "acepted", "uploaded", "review"].includes(
            audit.status,
          )
        ) {
          return false;
        }
        return true;
      })
      .map((d) => {
        const key = `dataRoom.subcategories.${d.id}`;
        let trans = t(key);
        if (trans === key) {
          trans = d.name || d.id;
        }
        return {
          value: d.id,
          label: trans,
        };
      });
  }, [documents, t, auditData]);

  // Extraer metadatos del documento (nombre de archivo, fecha, etc.)
  const getDocumentMetadata = (docId: string) => {
    const audit = auditData[docId];
    if (!audit || !audit.file_name) return undefined;

    return {
      filename: audit.file_name,
      size: audit.size || "N/A",
      date: audit.uploaded_at
        ? new Date(audit.uploaded_at).toLocaleDateString()
        : "N/A",
    };
  };

  // Extraer datos extraídos por la IA si existen
  const getDocumentExtractedData = (docId: string) => {
    const audit = auditData[docId];
    if (!audit || !audit.extracted_data) return undefined;

    // Convertir el objeto de datos extraídos en el formato que espera DocumentItem [{label, value}]
    try {
      const data =
        typeof audit.extracted_data === "string"
          ? JSON.parse(audit.extracted_data)
          : audit.extracted_data;

      return Object.entries(data).map(([key, val]) => ({
        label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: String(val),
      }));
    } catch (e) {
      console.error("Error parsing extracted_data:", e);
      return undefined;
    }
  };

  // Conteos dinámicos calculados desde el array documents
  const categories: Category[] = categoryDefs.map((cat) => {
    const catDocs = documents.filter((doc) => doc.category === cat.id);
    const mandatoryCount = catDocs.filter((d) => d.type === "mandatory").length;
    const optionalCount = catDocs.filter((d) => d.type === "optional").length;
    const subcategoriesCount = new Set(catDocs.map((d) => d.subcategory)).size;
    const verifiedCount = catDocs.filter(
      (d) => getDocumentStatus(d.id) === "verified",
    ).length;

    return {
      ...cat,
      mandatory: mandatoryCount,
      verified: verifiedCount,
      optional: optionalCount,
      subcategories: subcategoriesCount,
    };
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0].id,
  );

  const selectedCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
    setOpenSubcategories([]);
  };

  // Estado para controlar qué subcategorías están abiertas
  const [openSubcategories, setOpenSubcategories] = useState<string[]>([]);

  const toggleSubcategory = (subcategory: string) => {
    setOpenSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory],
    );
  };

  // Agrupar documentos por subcategoría según la categoría seleccionada
  const groupedDocuments = useMemo(() => {
    const filtered = documents.filter(
      (doc) => doc.category === selectedCategory.id,
    );
    const groups: Record<string, Document[]> = {};
    filtered.forEach((doc) => {
      if (!groups[doc.subcategory]) {
        groups[doc.subcategory] = [];
      }
      groups[doc.subcategory].push(doc);
    });
    return groups;
  }, [selectedCategory.id]);

  // Mapa de nombre de subcategoría (español) a clave de traducción
  const subcategoryKeyMap: Record<string, string> = {
    "Constitución y gobernanza": "constitucionGobernanza",
    "Propiedad del edificio": "propiedadEdificio",
    "Compliance y regulatorio": "complianceRegulatorio",
    "Proyecto y construcción": "proyectoConstruccion",
    "Instalaciones y sistemas": "instalacionesSistemas",
    "Inspecciones técnicas": "inspeccionesTecnicas",
    "Certificación energética EPBD": "certificacionEnergeticaEPBD",
    "Sostenibilidad y taxonomía EU": "sostenibilidadTaxonomiaEU",
    "Certificaciones ambientales": "certificacionesAmbientales",
    "Auditoría energética EPBD completa": "auditoriaEnergeticaEPBD",
    "Auditoría técnica del edificio": "auditoriaTecnicaEdificio",
    "Cumplimiento EPBD": "cumplimientoEPBD",
    "Taxonomía europea de actividades sostenibles": "taxonomiaEuropea",
    "Regulación financiera sostenible": "regulacionFinancieraSostenible",
    "Due diligence técnico-legal": "dueDiligenceTecnicoLegal",
    "Contratos de arrendamiento": "contratosArrendamiento",
    "Contratos de servicios y mantenimiento": "contratosServiciosMantenimiento",
    "Contratos de obra y proveedores": "contratosObraProveedores",
    "Otros acuerdos relevantes": "otrosAcuerdos",
    "Seguros del edificio": "segurosEdificio",
    "Garantías y avales": "garantiasAvales",
    "Estados financieros": "estadosFinancieros",
    "Análisis financiero del activo": "analisisFinancieroActivo",
    "Deuda y financiación actual": "deudaFinanciacionActual",
    "Valoración del inmueble": "valoracionInmueble",
    "Análisis de mercado inmobiliario": "analisisMercadoInmobiliario",
    "Posicionamiento estratégico": "posicionamientoEstrategico",
    "Modelo financiero completo": "modeloFinancieroCompleto",
    "Análisis de financiación verde": "analisisFinanciacionVerde",
    "ROI y rentabilidad": "roiRentabilidad",
    "KYC y compliance bancario": "kycComplianceBancario",
    "Información complementaria": "informacionComplementaria",
    "Documentos específicos green finance": "documentosGreenFinance",
    "Proyecto de rehabilitación energética": "proyectoRehabilitacionEnergetica",
    "Propuesta de mejoras energéticas": "propuestaMejorasEnergeticas",
    "Análisis de viabilidad del CAPEX": "analisisViabilidadCAPEX",
    "Libro del edificio": "libroEdificio",
    "Gestión operativa": "gestionOperativa",
    "Facility management": "facilityManagement",
    "Estudio de contaminación": "estudioContaminacion",
    "Gestión ambiental": "gestionAmbiental",
    "Normativa urbanística aplicable": "normativaUrbanistica",
    "Licencias y permisos": "licenciasPermisos",
    "Protección y catalogación": "proteccionCatalogacion",
  };

  // Función para obtener el nombre traducido de una subcategoría
  const getSubcategoryName = (rawName: string): string => {
    const key = subcategoryKeyMap[rawName];
    if (key) {
      return t(`dataRoom.subcategories.${key}`);
    }
    return rawName; // Fallback al nombre original
  };

  // Mapa de categoría a clave de notas
  const notesKeyMap: Record<string, string> = {
    technical: "notesTechnical",
    legal: "notesLegal",
    financial: "notesFinancial",
    fiscal: "notesFiscal",
  };

  const handleDownloadChecklist = () => {
    const categoryKeyMap: Record<string, string> = {
      technical: "technicalDocs",
      legal: "legalDocs",
      financial: "financialDocs",
      fiscal: "fiscalDocs",
    };

    const filteredDocuments = documents
      .filter((doc) => doc.category === selectedCategory.id)
      // Enriquecer con el status real de auditData
      .map((doc) => ({
        ...doc,
        status: getDocumentStatus(doc.id), // verified | pending | rejected
      }));

    DataRoomExportService.exportChecklist(filteredDocuments, {
      translateSubcategory: getSubcategoryName,
      translateCategory: (catId: string) =>
        t(`dataRoom.${categoryKeyMap[catId]}`) || catId,
      translateType: (type: string) =>
        type === "mandatory"
          ? t("dataRoom.obligatory")
          : t("dataRoom.optionalLabel"),
      translateStatus: (status: string) =>
        t(`dataRoom.${status}Status`) || status,
      fileName: `Checklist_${selectedCategory.name}_${new Date().toISOString().split("T")[0]}`,
    });
  };

  // ─── Métricas globales calculadas desde auditData ───────────────────────
  const mandatoryDocs = documents.filter((d) => d.type === "mandatory");
  const totalDocs = documents.length;

  const verifiedStatuses = new Set([
    "uploaded",
    "verified",
    "review",
    "acepted",
    "accepted",
  ]);
  const rejectedStatuses = new Set(["rejected", "failed"]);

  // Solo contar audits que correspondan a documentos clasificados (excluir __auto__ y claves no reconocidas)
  const knownDocIds = new Set(documents.map((d) => d.id));
  const classifiedAudits = Object.entries(auditData).filter(([key]) =>
    knownDocIds.has(key),
  );

  const verifiedCount = classifiedAudits.filter(([, a]: [string, any]) =>
    verifiedStatuses.has(a.status),
  ).length;

  const rejectedCount = classifiedAudits.filter(([, a]: [string, any]) =>
    rejectedStatuses.has(a.status),
  ).length;

  const inReviewCount = classifiedAudits.filter(
    ([, a]: [string, any]) =>
      a.status === "queued" || a.status === "processing",
  ).length;

  const pendingCount =
    totalDocs - verifiedCount - rejectedCount - inReviewCount;

  const mandatoryVerifiedCount = mandatoryDocs.filter((d) => {
    const audit = auditData[d.id];
    return audit && verifiedStatuses.has(audit.status);
  }).length;

  const dossierPercentage =
    mandatoryDocs.length > 0
      ? Math.round((mandatoryVerifiedCount / mandatoryDocs.length) * 100)
      : 0;
  // Indica si una categoría tiene algún documento en cola o procesándose
  const categoryHasUploading = (categoryId: string): boolean =>
    documents
      .filter((d) => d.category === categoryId)
      .some((d) => auditData[d.id]?.status === "processing");
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div>
      <div className="hidden md:flex items-center justify-end gap-3 md:gap-4">
        <div className="text-left md:text-right">
          <div className="text-[10px] md:text-xs text-gray-900">
            {t("dataRoom.dossierCompletion")}
          </div>
          <div className="text-base md:text-lg text-[#1e3a8a]">
            {dossierPercentage}%
          </div>
        </div>
        <button
          disabled={isDownloadingDossier}
          onClick={async () => {
            setIsDownloadingDossier(true);
            try {
              await downloadDossierPdf(selectedBuildingId!);
            } catch (err: any) {
              toast.error(err.message || "Error al descargar el dossier");
            } finally {
              setIsDownloadingDossier(false);
            }
          }}
          className="px-3 md:px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isDownloadingDossier ? (
            <Loader2
              className="w-3 h-3 md:w-4 md:h-4 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Download className="w-3 h-3 md:w-4 md:h-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">
            {isDownloadingDossier
              ? "Generando..."
              : t("dataRoom.downloadDossier")}
          </span>
          <span className="sm:hidden">{t("dataRoom.download")}</span>
        </button>
      </div>
      <div className="hidden md:block bg-[#1e3a8a] text-white rounded-lg p-3 my-3 md:p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xs md:text-sm mb-0.5 truncate">
              {t("dataRoom.title")}
            </h1>
            <p className="text-[10px] md:text-xs text-blue-200 truncate">
              {t("dataRoom.subtitle")}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-2 md:p-4">
          <p className="text-[10px] md:text-sm text-gray-600 mb-0.5 md:mb-1">
            {t("dataRoom.totalDocs")}
          </p>
          <p className="text-lg md:text-2xl text-[#1e3a8a]">{totalDocs}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-green-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <CircleCheck
              className="w-3 h-3 md:w-4 md:h-4 text-green-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.verified")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-green-600">{verifiedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-orange-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <Clock
              className="w-3 h-3 md:w-4 md:h-4 text-orange-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.review")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-orange-600">{inReviewCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <TriangleAlert
              className="w-3 h-3 md:w-4 md:h-4 text-gray-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.pending")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-gray-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-red-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <CircleAlert
              className="w-3 h-3 md:w-4 md:h-4 text-red-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.rejected")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-red-600">{rejectedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-[#1e3a8a] p-2 md:hidden">
          <p className="text-[10px] text-gray-600 mb-0.5">
            {t("dataRoom.completion")}
          </p>
          <p className="text-lg text-[#1e3a8a]">{dossierPercentage}%</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 my-3 md:my-6 p-3 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <button
            className={
              "p-2 md:p-4 rounded-lg transition-all text-left border-2 " +
              (selectedCategory.id === "technical"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200")
            }
            onClick={() => handleCategorySelect("technical")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                <LucideWrench className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="text-xs md:text-sm text-gray-900 truncate">
                    {t("dataRoom.technicalDocs")}
                  </div>
                  {/* DEMO: indicador de subida activa */}
                  {categoryHasUploading("technical") && (
                    <span
                      className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0"
                      title="Procesando..."
                    />
                  )}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[0].mandatory +
                    categories[0].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-blue-600"
                style={{
                  width: `${(categories[0].verified / (categories[0].mandatory + categories[0].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[0].verified,
                total: categories[0].mandatory + categories[0].optional,
              })}
            </div>
          </button>
          <button
            className={
              "p-2 md:p-4 rounded-lg border-2 transition-all text-left " +
              (selectedCategory.id === "legal"
                ? "border-purple-600 bg-purple-50"
                : "border-gray-200 hover:bg-gray-50")
            }
            onClick={() => handleCategorySelect("legal")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                <LucideScale className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="text-xs md:text-sm text-gray-900 truncate">
                    {t("dataRoom.legalDocs")}
                  </div>
                  {categoryHasUploading("legal") && (
                    <span
                      className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0"
                      title="Procesando..."
                    />
                  )}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[1].mandatory +
                    categories[1].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-purple-600"
                style={{
                  width: `${(categories[1].verified / (categories[1].mandatory + categories[1].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[1].verified,
                total: categories[1].mandatory + categories[1].optional,
              })}
            </div>
          </button>
          <button
            className={
              "p-2 md:p-4 rounded-lg border-2 transition-all text-left " +
              (selectedCategory.id === "financial"
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50")
            }
            onClick={() => handleCategorySelect("financial")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                <LucideAward className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="text-xs md:text-sm text-gray-900 truncate">
                    {t("dataRoom.financialDocs")}
                  </div>
                  {categoryHasUploading("financial") && (
                    <span
                      className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0"
                      title="Procesando..."
                    />
                  )}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[2].mandatory +
                    categories[2].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-green-600"
                style={{
                  width: `${(categories[2].verified / (categories[2].mandatory + categories[2].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[2].verified,
                total: categories[2].mandatory + categories[2].optional,
              })}
            </div>
          </button>
          <button
            className={
              "p-2 md:p-4 rounded-lg border-2 transition-all text-left " +
              (selectedCategory.id === "fiscal"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50")
            }
            onClick={() => handleCategorySelect("fiscal")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-orange-100 text-orange-600 flex-shrink-0">
                <LucideAward className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  {t("dataRoom.fiscalDocs")}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[3].mandatory +
                    categories[3].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-orange-600"
                style={{
                  width: `${(categories[3].verified / (categories[3].mandatory + categories[3].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[3].verified,
                total: categories[3].mandatory + categories[3].optional,
              })}
            </div>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 lg:h-[950px]">
        <div className="lg:col-span-8 min-h-0">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div
                  className={`p-2 md:p-3 rounded-lg bg-${selectedCategory.color}-100 text-${selectedCategory.color}-600 flex-shrink-0`}
                >
                  <selectedCategory.icon />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm md:text-lg text-gray-900 truncate">
                    {selectedCategory.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {t("dataRoom.verifDocsStatus", {
                      verif: selectedCategory.verified,
                      total:
                        selectedCategory.mandatory + selectedCategory.optional,
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 md:p-8 mb-4 md:mb-6 transition-all cursor-pointer ${
                isDragOver
                  ? "border-blue-500 bg-blue-50 scale-[1.01] shadow-lg"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onClick={() => batchFileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={batchFileInputRef}
                onChange={handleBatchFileSelect}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
              />
              <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                <Upload
                  className={`lucide lucide-upload w-8 h-8 md:w-12 md:h-12 transition-colors ${
                    isDragOver ? "text-blue-500" : "text-gray-400"
                  }`}
                  aria-hidden="true"
                />
                <div className="text-center">
                  <p
                    className={`text-xs md:text-sm mb-0.5 md:mb-1 ${
                      isDragOver ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    <span className="hidden sm:inline">
                      {isDragOver
                        ? t("dataRoom.dropHere") || "Suelta los archivos aquí"
                        : t("dataRoom.dragAndDrop")}
                    </span>
                    <span className="sm:hidden">
                      {t("dataRoom.dragAndDropShort")}
                    </span>
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-600">
                    {t("dataRoom.fileLimits")} •{" "}
                    {t("dataRoom.maxFiles") || "Máx. 5 archivos"}
                  </p>
                  <p className="text-[10px] md:text-xs text-blue-600 mt-1">
                    {t("dataRoom.aiClassification") ||
                      "La IA clasificará automáticamente tus documentos"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    batchFileInputRef.current?.click();
                  }}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm"
                >
                  {t("dataRoom.selectFiles")}
                </button>
              </div>
            </div>

            {/* Lista de batch jobs */}
            {batchJobs.length > 0 && (
              <div className="mb-4 md:mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {t("dataRoom.batchJobsTitle") ||
                    "Archivos subidos por Drag & Drop"}
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {batchJobs
                    .filter((job: any) => job.checklistId === "__auto__")
                    .map((job: any) => {
                      const statusConfig: Record<
                        string,
                        {
                          color: string;
                          bg: string;
                          icon: React.ReactNode;
                          label: string;
                        }
                      > = {
                        queued: {
                          color: "text-yellow-700",
                          bg: "bg-yellow-50 border-yellow-200",
                          icon: (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ),
                          label: t("dataRoom.queuedStatus") || "En cola",
                        },
                        processing: {
                          color: "text-blue-700",
                          bg: "bg-blue-50 border-blue-200",
                          icon: (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ),
                          label:
                            t("dataRoom.processingStatus") || "Analizando...",
                        },
                        completed: {
                          color: "text-green-700",
                          bg: "bg-green-50 border-green-200",
                          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                          label: t("dataRoom.verifiedStatus") || "Verificado",
                        },
                        failed: {
                          color: "text-red-700",
                          bg: "bg-red-50 border-red-200",
                          icon: <AlertCircle className="w-3.5 h-3.5" />,
                          label: t("dataRoom.rejectedStatus") || "Rechazado",
                        },
                        rejected: {
                          color: "text-red-700",
                          bg: "bg-red-50 border-red-200",
                          icon: <AlertCircle className="w-3.5 h-3.5" />,
                          label: t("dataRoom.rejectedStatus") || "Rechazado",
                        },
                      };
                      const cfg =
                        statusConfig[job.status] || statusConfig.queued;
                      const isAutoUnresolved = job.checklistId === "__auto__";

                      return (
                        <div
                          key={job.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${cfg.bg}`}
                        >
                          <FileText
                            className={`w-4 h-4 flex-shrink-0 ${cfg.color}`}
                          />
                          <span className="flex-1 truncate text-gray-800 font-medium">
                            {job.fileName}
                          </span>
                          {isAutoUnresolved &&
                            (job.status === "completed" ||
                              job.status === "failed") && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-gray-500 italic">
                                  {t("dataRoom.unclassified") ||
                                    "No clasificado"}
                                </span>
                                <ManualClassifyCombobox
                                  jobId={job.id}
                                  options={allDocsOptions}
                                  onClassify={handleManualClassify}
                                  t={t}
                                />
                              </div>
                            )}
                          {!isAutoUnresolved &&
                            job.checklistId &&
                            job.status === "completed" && (
                              <span className="text-[10px] text-green-600 truncate max-w-[120px]">
                                →{" "}
                                {job.checklistId
                                  .replace(/_/g, " ")
                                  .slice(0, 40)}
                              </span>
                            )}
                          <span
                            className={`flex items-center gap-1 flex-shrink-0 font-semibold ${cfg.color}`}
                          >
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="space-y-2 md:space-y-3 flex-1 overflow-y-auto min-h-0 pr-1">
              {isLoadingAudit ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                documents
                  .filter(
                    (doc) =>
                      doc.category === selectedCategory.id &&
                      doc.type === "mandatory",
                  )
                  .map((doc) => (
                    <DocumentItem
                      key={doc.id}
                      id={doc.id}
                      title={doc.name}
                      description={getSubcategoryName(doc.subcategory)}
                      status={getDocumentStatus(doc.id)}
                      metadata={getDocumentMetadata(doc.id)}
                      extractedData={getDocumentExtractedData(doc.id)}
                      isObligatory={true}
                      onUpload={(file) => handleUpload(doc.id, file)}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 min-h-0 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm text-gray-900 mb-0.5">
                      {t("dataRoom.guideTitle")}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {selectedCategory.guide}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-blue-600">
                      {selectedCategory.mandatory + selectedCategory.optional}
                    </div>
                    <div className="text-xs text-gray-600">
                      {t("dataRoom.totalDocuments")}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">
                      {t("dataRoom.obligatoryItems")}
                    </div>
                    <div className="text-xl text-red-600">
                      {selectedCategory.mandatory}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">
                      {t("dataRoom.optionalItems")}
                    </div>
                    <div className="text-xl text-gray-600">
                      {selectedCategory.optional}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">
                      {t("dataRoom.categoriesCount")}
                    </div>
                    <div className="text-xl text-blue-600">
                      {Object.keys(groupedDocuments).length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(groupedDocuments).map(
                  ([subcategoryName, docs]) => {
                    const mandatoryCount = docs.filter(
                      (d) => d.type === "mandatory",
                    ).length;
                    const isOpen = openSubcategories.includes(subcategoryName);
                    return (
                      <div
                        key={subcategoryName}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSubcategory(subcategoryName)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {isOpen ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                            <div className="text-left">
                              <h4 className="text-sm text-gray-900 mb-0.5">
                                {getSubcategoryName(subcategoryName)}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs text-gray-600">
                                {docs.length}{" "}
                                {t("dataRoom.docsCount", {
                                  count: docs.length,
                                })}
                              </div>
                              <div className="text-xs text-red-600">
                                {mandatoryCount} {t("dataRoom.obligatoryItems")}
                              </div>
                            </div>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-3 space-y-2">
                            {docs.map((doc, idx) => (
                              <DocumentItem
                                key={doc.id || idx}
                                id={doc.id}
                                title={doc.name}
                                description={getSubcategoryName(
                                  doc.subcategory,
                                )}
                                status={getDocumentStatus(doc.id)}
                                metadata={getDocumentMetadata(doc.id)}
                                extractedData={getDocumentExtractedData(doc.id)}
                                isObligatory={doc.type === "mandatory"}
                                onUpload={(file) => handleUpload(doc.id, file)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Download
                    className="lucide lucide-download w-6 h-6 text-green-600 mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm text-gray-900 mb-2">
                      {t("dataRoom.downloadChecklistTitle")}
                    </h4>
                    <p className="text-xs text-gray-700 mb-3">
                      {t("dataRoom.downloadChecklistDesc")}
                    </p>
                    <button
                      onClick={handleDownloadChecklist}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                    >
                      <Download
                        className="lucide lucide-download w-4 h-4"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">
                        {t("dataRoom.downloadChecklistBtn", {
                          category: selectedCategory.name,
                        })}
                      </span>
                      <span className="sm:hidden">
                        {t("dataRoom.download")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm text-gray-900 mb-2">
                      {t(`dataRoom.${notesKeyMap[selectedCategory.id]}.title`)}
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>
                        •{" "}
                        <strong>
                          {t(
                            `dataRoom.${notesKeyMap[selectedCategory.id]}.note1Label`,
                          )}
                          :
                        </strong>{" "}
                        {t(
                          `dataRoom.${notesKeyMap[selectedCategory.id]}.note1`,
                        )}
                      </li>
                      <li>
                        •{" "}
                        <strong>
                          {t(
                            `dataRoom.${notesKeyMap[selectedCategory.id]}.note2Label`,
                          )}
                          :
                        </strong>{" "}
                        {t(
                          `dataRoom.${notesKeyMap[selectedCategory.id]}.note2`,
                        )}
                      </li>
                      <li>
                        •{" "}
                        <strong>
                          {t(
                            `dataRoom.${notesKeyMap[selectedCategory.id]}.note3Label`,
                          )}
                          :
                        </strong>{" "}
                        {t(
                          `dataRoom.${notesKeyMap[selectedCategory.id]}.note3`,
                        )}
                      </li>
                      <li>
                        •{" "}
                        <strong>
                          {t(
                            `dataRoom.${notesKeyMap[selectedCategory.id]}.note4Label`,
                          )}
                          :
                        </strong>{" "}
                        {t(
                          `dataRoom.${notesKeyMap[selectedCategory.id]}.note4`,
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRoom;
