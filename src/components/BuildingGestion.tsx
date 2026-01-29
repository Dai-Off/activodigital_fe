import {
  Plus,
  Upload,
  FileSpreadsheet,
  FileCheck,
  Wrench,
  Building as BuildingIcon,
  Users,
  Scale,
  Shield,
  FileChartColumnIncreasing,
  ChevronRight,
  Search,
  Funnel,
  Download,
  Trash2,
  Calendar,
  Receipt,
  FileText,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Building, BuildingsApiService } from "~/services/buildingsApi";
import {
  type Document,
  DocumentsApiService,
} from "~/services/documentsApi";
import { BuildingCertificatesLoading } from "./ui/dashboardLoading";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { SkeletonBase } from "./ui/LoadingSystem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import FileUpload from "./ui/FileUpload";
import { uploadGestionDocument } from "~/services/gestionDocuments";
import { useAuth } from "~/contexts/AuthContext";
import { useToast } from "~/contexts/ToastContext";
import {
  ServiceInvoicesService,
  type ServiceType,
  SERVICE_TYPE_LABELS,
  getServiceTypeLabel
} from "~/services/serviceInvoices";
import { useLanguage } from "~/contexts/LanguageContext";

// Tipo para categorías de documentos
type DocumentCategory = {
  value: string;
  label: string;
  traduct: string;
  icon: typeof FileSpreadsheet;
  bgColor: string;
  iconColor: string;
  isCustom?: boolean; // Para distinguir categorías personalizadas
};


// Categorías base predefinidas
const BASE_DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    value: "financial",
    label: "Financiero/Contable",
    traduct: "financieroContable",
    icon: FileSpreadsheet,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    value: "contracts",
    label: "Contratos",
    traduct: "contratos",
    icon: FileCheck,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    value: "maintenance",
    label: "Mantenimiento",
    traduct: "mantenimiento",
    icon: Wrench,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    value: "public",
    label: "Administración Pública",
    traduct: "administracionPublica",
    icon: BuildingIcon,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    value: "internal",
    label: "Gestión Interna",
    traduct: "gestionInterna",
    icon: Users,
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    value: "legal",
    label: "Jurídico/Legal",
    traduct: "juridicoLegal",
    icon: Scale,
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    value: "certificates",
    label: "Certificaciones",
    traduct: "certificaciones",
    icon: Shield,
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    value: "technical",
    label: "Documentación Técnica",
    traduct: "documentacionTecnica",
    icon: FileChartColumnIncreasing,
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
];

// Iconos disponibles para categorías personalizadas
const AVAILABLE_ICONS = [
  { name: "FileSpreadsheet", component: FileSpreadsheet, label: "Hoja de cálculo" },
  { name: "FileCheck", component: FileCheck, label: "Documento verificado" },
  { name: "Wrench", component: Wrench, label: "Herramienta" },
  { name: "BuildingIcon", component: BuildingIcon, label: "Edificio" },
  { name: "Users", component: Users, label: "Usuarios" },
  { name: "Scale", component: Scale, label: "Balanza" },
  { name: "Shield", component: Shield, label: "Escudo" },
  { name: "FileChartColumnIncreasing", component: FileChartColumnIncreasing, label: "Gráfico" },
  { name: "FileText", component: FileText, label: "Documento" },
  { name: "Calendar", component: Calendar, label: "Calendario" },
  { name: "Receipt", component: Receipt, label: "Recibo" },
];

// Opciones de colores predefinidas
const COLOR_OPTIONS = [
  { bgColor: "bg-blue-50", iconColor: "text-blue-600", solidColor: "bg-blue-500", label: "Azul" },
  { bgColor: "bg-green-50", iconColor: "text-green-600", solidColor: "bg-green-500", label: "Verde" },
  { bgColor: "bg-orange-50", iconColor: "text-orange-600", solidColor: "bg-orange-500", label: "Naranja" },
  { bgColor: "bg-purple-50", iconColor: "text-purple-600", solidColor: "bg-purple-500", label: "Morado" },
  { bgColor: "bg-indigo-50", iconColor: "text-indigo-600", solidColor: "bg-indigo-500", label: "Índigo" },
  { bgColor: "bg-red-50", iconColor: "text-red-600", solidColor: "bg-red-500", label: "Rojo" },
  { bgColor: "bg-teal-50", iconColor: "text-teal-600", solidColor: "bg-teal-500", label: "Verde azulado" },
  { bgColor: "bg-cyan-50", iconColor: "text-cyan-600", solidColor: "bg-cyan-500", label: "Cian" },
  { bgColor: "bg-pink-50", iconColor: "text-pink-600", solidColor: "bg-pink-500", label: "Rosa" },
  { bgColor: "bg-yellow-50", iconColor: "text-yellow-600", solidColor: "bg-yellow-500", label: "Amarillo" },
  { bgColor: "bg-gray-50", iconColor: "text-gray-600", solidColor: "bg-gray-500", label: "Gris" },
  { bgColor: "bg-slate-50", iconColor: "text-slate-600", solidColor: "bg-slate-500", label: "Pizarra" },
];

// Funciones para guardar/cargar categorías personalizadas desde localStorage
const getCustomCategoriesKey = (buildingId: string) => `gestion_custom_categories_${buildingId}`;

const loadCustomCategories = (buildingId: string): DocumentCategory[] => {
  try {
    const stored = localStorage.getItem(getCustomCategoriesKey(buildingId));
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Reconstruir los iconos desde los nombres
    return parsed.map((cat: any) => {
      const iconData = AVAILABLE_ICONS.find(ic => ic.name === cat.iconName);
      return {
        ...cat,
        icon: iconData?.component || FileText,
      };
    });
  } catch (error) {
    console.error("Error cargando categorías personalizadas:", error);
    return [];
  }
};

const saveCustomCategories = (buildingId: string, categories: DocumentCategory[]) => {
  try {
    // Guardar solo los datos serializables (sin los componentes de icono)
    const serializable = categories.map(cat => ({
      ...cat,
      iconName: AVAILABLE_ICONS.find(ic => ic.component === cat.icon)?.name || "FileText",
      icon: undefined, // No guardar el componente
    }));
    localStorage.setItem(getCustomCategoriesKey(buildingId), JSON.stringify(serializable));
  } catch (error) {
    console.error("Error guardando categorías personalizadas:", error);
  }
};

// Mapeo de tipos de icono a componentes
const ICON_MAP: Record<string, typeof FileSpreadsheet> = {
  FileSpreadsheet,
  FileCheck,
  Wrench,
  BuildingIcon,
  Users,
  Scale,
  Shield,
  FileChartColumnIncreasing,
};

// Helper para obtener el componente de icono
const getIconComponent = (iconType: string) => {
  return ICON_MAP[iconType] || FileText;
};

// Helper para obtener el badge según el estado
const getStatusBadge = (status: Document["status"]) => {
  const statusConfig = {
    aprobado: {
      label: "Aprobado",
      className: "bg-green-100 text-green-700 border-transparent",
    },
    activo: {
      label: "Activo",
      className: "bg-blue-100 text-blue-700 border-transparent",
    },
    pendiente: {
      label: "Pendiente",
      className: "bg-yellow-100 text-yellow-700 border-transparent",
    },
    "proximo-vencer": {
      label: "Próximo a vencer",
      className: "bg-orange-100 text-orange-700 border-transparent",
    },
  };

  const config = statusConfig[status];
  return (
    <Badge className={config.className} data-slot="badge">
      {config.label}
    </Badge>
  );
};

// Componente para cada item de documento
const DocumentItem = ({
  document,
  onDownload,
  onDelete
}: {
  document: Document;
  onDownload: (url: string, fileName: string) => void;
  onDelete: (document: Document) => void;
}) => {
  const IconComponent = getIconComponent(document.iconType);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 ${document.iconBgColor} rounded-lg`}>
            <IconComponent
              className={`w-5 h-5 ${document.iconColor}`}
              aria-hidden="true"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm text-gray-900 truncate">{document.name}</h4>
              {getStatusBadge(document.status)}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Receipt className="w-3 h-3" aria-hidden="true" />
                {document.category} • {document.subcategory}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                {document.date}
              </span>
              <span>{document.size}</span>
              <span className="text-gray-400">•</span>
              <span className="uppercase">{document.fileType}</span>
              {document.expirationDate && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-orange-600">
                    Vence: {document.expirationDate}
                  </span>
                </>
              )}
            </div>
            {document.contractInfo && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-4 gap-3 text-xs">
                  {document.contractInfo.proveedor && (
                    <div>
                      <span className="text-gray-500">Proveedor:</span>
                      <p className="text-gray-900">
                        {document.contractInfo.proveedor}
                      </p>
                    </div>
                  )}
                  {document.contractInfo.importe && (
                    <div>
                      <span className="text-gray-500">Importe:</span>
                      <p className="text-gray-900">
                        {document.contractInfo.importe}
                      </p>
                    </div>
                  )}
                  {document.contractInfo.vencimiento && (
                    <div>
                      <span className="text-gray-500">Vencimiento:</span>
                      <p className="text-gray-900">
                        {document.contractInfo.vencimiento}
                      </p>
                    </div>
                  )}
                  {document.contractInfo.renovacion && (
                    <div>
                      <span className="text-gray-500">Renovación:</span>
                      <p className="text-gray-900">
                        {document.contractInfo.renovacion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1 ml-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-green-50"
            title="Descargar documento"
            onClick={() => document.url && onDownload(document.url, document.name)}
          >
            <Download className="w-4 h-4 text-gray-600" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-50"
            title="Eliminar documento"
            onClick={() => onDelete(document)}
          >
            <Trash2 className="w-4 h-4 text-gray-600" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente de estado vacío
const EmptyDocumentsState = ({ onUpload }: { onUpload: () => void }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No hay documentos cargados
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-md">
        Comienza subiendo tu primer documento para gestionar toda la
        documentación del edificio de forma organizada.
      </p>
      <Button
        onClick={onUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Upload className="w-4 h-4 mr-2" />
        Subir Primer Documento
      </Button>
    </div>
  </div>
);

// Componente de loading para documentos
const DocumentsLoadingState = () => (
  <div className="space-y-2">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
      >
        <div className="flex items-start gap-3">
          <SkeletonBase className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-4 w-3/4" />
            <SkeletonBase className="h-3 w-1/2" />
          </div>
          <SkeletonBase className="w-32 h-8" />
        </div>
      </div>
    ))}
  </div>
);

export function BuildingGestion() {
  const { t } = useLanguage()
  const { id: buildingId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    aprobados: 0,
    activos: 0,
    pendientes: 0,
    proximosVencer: 0,
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para categorías (base + personalizadas)
  const [customCategories, setCustomCategories] = useState<DocumentCategory[]>([]);
  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>(BASE_DOCUMENT_CATEGORIES);

  // Estado para modal de crear categoría
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(COLOR_OPTIONS[0]);

  // Estado para modal de factura de servicio
  const [isServiceInvoiceModalOpen, setIsServiceInvoiceModalOpen] = useState(false);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | null>(null);
  const [serviceInvoiceData, setServiceInvoiceData] = useState({
    service_type: 'electricity' as ServiceType,
    invoice_date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    amount_eur: 0,
    units: null as number | null,
    notes: '',
    provider: '',
    invoice_number: '',
    period_start: '',
    period_end: '',
    expiration_date: '',
  });

  // Cargar categorías personalizadas al montar el componente
  useEffect(() => {
    if (!buildingId) return;
    const loaded = loadCustomCategories(buildingId);
    setCustomCategories(loaded);
    setDocumentCategories([...BASE_DOCUMENT_CATEGORIES, ...loaded]);
  }, [buildingId]);

  // Cargar datos del edificio
  useEffect(() => {
    if (!buildingId) {
      setLoading(false);
      return;
    }
    BuildingsApiService.getBuildingById(buildingId)
      .then((data) => setBuilding(data))
      .finally(() => setLoading(false));
  }, [buildingId]);

  // Cargar documentos
  useEffect(() => {
    if (!buildingId) {
      setDocumentsLoading(false);
      return;
    }

    setDocumentsLoading(true);
    DocumentsApiService.getBuildingDocuments(buildingId)
      .then((response) => {
        setDocuments(response.documents);
        setStats({
          total: response.total,
          aprobados: response.aprobados,
          activos: response.activos,
          pendientes: response.pendientes,
          proximosVencer: response.proximosVencer,
        });
      })
      .catch((error) => {
        console.error("Error cargando documentos:", error);
        setDocuments([]);
      })
      .finally(() => {
        setDocumentsLoading(false);
      });
  }, [buildingId]);

  if (loading) {
    return <BuildingCertificatesLoading />;
  }

  const handleFilesSelected = (files: File[]) => {
    console.log('Archivos seleccionados:', files);
    if (files.length > 0) {
      const file = files[0];
      console.log('Estableciendo archivo seleccionado:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
      setSelectedFile(file);
    } else {
      console.log('No se seleccionaron archivos válidos');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError("Error", "Por favor selecciona un archivo");
      return;
    }
    if (!selectedCategory) {
      showError("Error", "Por favor selecciona una categoría");
      return;
    }
    if (!buildingId) {
      showError("Error", "No se pudo identificar el edificio");
      return;
    }
    if (!user?.userId) {
      showError("Error", "No se pudo identificar el usuario");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadGestionDocument(
        selectedFile,
        buildingId,
        selectedCategory,
        user.userId
      );

      if (result.success && result.document) {
        // Verificar si es una factura de servicio (categoría Financiero/Contable)
        const isFinancialCategory = selectedCategory === "financial" ||
          documentCategories.find(cat => cat.value === selectedCategory)?.label === "Financiero/Contable";

        // Si es categoría financiera, preguntar si es una factura de servicio
        if (isFinancialCategory && result.document.url) {
          setUploadedDocumentUrl(result.document.url);
          // Cerrar el modal de upload antes de abrir el de factura
          setIsUploadModalOpen(false);
          setSelectedFile(null);
          setSelectedCategory("");
          setIsServiceInvoiceModalOpen(true);
        } else {
          showSuccess("Documento subido", "El documento se ha subido correctamente");

          // Recargar documentos
          reloadDocuments();

          // Cerrar modal y resetear
          setIsUploadModalOpen(false);
          setSelectedFile(null);
          setSelectedCategory("");
        }
      } else {
        showError("Error al subir", result.error || "No se pudo subir el documento");
      }
    } catch (error) {
      console.error("Error subiendo documento:", error);
      showError("Error", "Ocurrió un error inesperado al subir el documento");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setSelectedCategory("");
  };

  // Función helper para recargar documentos
  const reloadDocuments = () => {
    if (!buildingId) return;
    setDocumentsLoading(true);
    DocumentsApiService.getBuildingDocuments(buildingId)
      .then((response) => {
        setDocuments(response.documents);
        setStats({
          total: response.total,
          aprobados: response.aprobados,
          activos: response.activos,
          pendientes: response.pendientes,
          proximosVencer: response.proximosVencer,
        });
      })
      .catch((error) => {
        console.error("Error recargando documentos:", error);
      })
      .finally(() => {
        setDocumentsLoading(false);
      });
  };

  // Manejar creación de factura de servicio
  const isValidUuid = (value: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value);

  // Manejar creación de factura de servicio
  const handleCreateServiceInvoice = async () => {
    if (!buildingId || !uploadedDocumentUrl) {
      showError("Error", "Faltan datos necesarios");
      return;
    }

    if (!isValidUuid(buildingId)) {
      showError("Error", "El identificador del edificio no es válido. Guarda el edificio antes de registrar la factura.");
      return;
    }

    if (!serviceInvoiceData.amount_eur || serviceInvoiceData.amount_eur <= 0) {
      showError("Error", "El importe debe ser mayor a 0");
      return;
    }

    try {
      const documentFilename =
        selectedFile?.name ||
        uploadedDocumentUrl?.split("/").pop()?.split("?")[0] ||
        null;

      await ServiceInvoicesService.createServiceInvoice({
        building_id: buildingId,
        invoice_date: serviceInvoiceData.invoice_date,
        service_type: serviceInvoiceData.service_type,
        amount_eur: serviceInvoiceData.amount_eur,
        units: serviceInvoiceData.units || null,
        notes: serviceInvoiceData.notes || null,
        document_url: uploadedDocumentUrl,
        document_filename: documentFilename,
        provider: serviceInvoiceData.provider || null,
        invoice_number: serviceInvoiceData.invoice_number || null,
        period_start: serviceInvoiceData.period_start || null,
        period_end: serviceInvoiceData.period_end || null,
        expiration_date: serviceInvoiceData.expiration_date || null,
      });

      showSuccess("Factura creada", "La factura de servicio se ha registrado correctamente");

      // Recargar documentos
      reloadDocuments();

      // Cerrar modales y resetear
      setIsServiceInvoiceModalOpen(false);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setSelectedCategory("");
      setUploadedDocumentUrl(null);
      setServiceInvoiceData({
        service_type: 'electricity',
        invoice_date: new Date().toISOString().split('T')[0],
        amount_eur: 0,
        units: null,
        notes: '',
        provider: '',
        invoice_number: '',
        period_start: '',
        period_end: '',
        expiration_date: '',
      });
    } catch (error: any) {
      console.error("Error creando factura de servicio:", error);
      showError(
        "Error",
        error?.message || "Ocurrió un error al crear la factura de servicio"
      );
    }
  };

  // Manejar cancelación de factura de servicio (solo cerrar modal, el PDF ya está subido)
  const handleCancelServiceInvoice = () => {
    setIsServiceInvoiceModalOpen(false);
    // El documento ya está subido, así que recargamos y cerramos todo
    reloadDocuments();
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setSelectedCategory("");
    setUploadedDocumentUrl(null);
    setServiceInvoiceData({
      service_type: 'electricity',
      invoice_date: new Date().toISOString().split('T')[0],
      amount_eur: 0,
      units: null,
      notes: '',
      provider: '',
      invoice_number: '',
      period_start: '',
      period_end: '',
      expiration_date: '',
    });
    showSuccess("Documento subido", "El documento se ha subido correctamente");
  };

  // Funciones para acciones de documentos
  const handleDownloadDocument = (url: string, fileName: string) => {
    if (url) {
      // Crear un enlace temporal para descargar
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteDocument = (document: Document) => {
    setDeletingDocument(document);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDocument || !buildingId) return;

    setIsDeleting(true);
    try {
      // Extraer el nombre del archivo en storage desde el ID
      // El ID tiene formato: buildingId_category_storageFileName
      const idParts = deletingDocument.id.split('_');
      if (idParts.length < 3) {
        showError("Error", "No se pudo identificar el archivo a eliminar");
        return;
      }

      // El nombre del archivo en storage está en el ID después de buildingId_category_
      // Obtener el valor de la categoría desde el nombre de categoría
      const categoryValue = deletingDocument.categoryValue ||
        documentCategories.find((cat: DocumentCategory) => cat.label === deletingDocument.category)?.value ||
        idParts[1];

      // Necesitamos el nombre completo del archivo en storage
      // Buscar el documento en la lista para obtener el storageFileName
      const fullDocument = documents.find(d => d.id === deletingDocument.id);
      if (!fullDocument?.storageFileName) {
        showError("Error", "No se pudo identificar el archivo a eliminar");
        return;
      }

      const { deleteGestionDocument } = await import("~/services/gestionDocuments");
      const result = await deleteGestionDocument(
        deletingDocument.url || '',
        buildingId,
        categoryValue,
        fullDocument.storageFileName
      );

      if (result.success) {
        showSuccess("Documento eliminado", "El documento se ha eliminado correctamente");

        // Recargar documentos
        setDocumentsLoading(true);
        DocumentsApiService.getBuildingDocuments(buildingId)
          .then((response) => {
            setDocuments(response.documents);
            setStats({
              total: response.total,
              aprobados: response.aprobados,
              activos: response.activos,
              pendientes: response.pendientes,
              proximosVencer: response.proximosVencer,
            });
          })
          .catch((error) => {
            console.error("Error recargando documentos:", error);
          })
          .finally(() => {
            setDocumentsLoading(false);
          });

        setIsDeleteModalOpen(false);
        setDeletingDocument(null);
      } else {
        showError("Error al eliminar", result.error || "No se pudo eliminar el documento");
      }
    } catch (error) {
      console.error("Error eliminando documento:", error);
      showError("Error", "Ocurrió un error inesperado al eliminar el documento");
    } finally {
      setIsDeleting(false);
    }
  };

  // Manejar eliminación de categoría personalizada
  const handleDeleteCategory = (categoryValue: string, categoryLabel: string) => {
    if (!buildingId) return;

    // Verificar si hay documentos en esta categoría
    const documentsInCategory = documents.filter(
      doc => doc.category === categoryLabel
    );

    if (documentsInCategory.length > 0) {
      showError(
        "No se puede eliminar",
        `Esta categoría tiene ${documentsInCategory.length} documento(s). Elimina los documentos primero.`
      );
      return;
    }

    // Eliminar de las categorías personalizadas
    const updatedCustom = customCategories.filter(
      cat => cat.value !== categoryValue
    );
    setCustomCategories(updatedCustom);
    setDocumentCategories([...BASE_DOCUMENT_CATEGORIES, ...updatedCustom]);
    saveCustomCategories(buildingId, updatedCustom);

    // Si estaba seleccionada como filtro, limpiar el filtro
    if (selectedCategoryFilter === categoryValue) {
      setSelectedCategoryFilter(null);
    }

    showSuccess("Éxito", "Categoría eliminada correctamente");
  };

  // Manejar creación de nueva categoría
  const handleCreateCategory = () => {
    if (!buildingId || !newCategoryName.trim()) {
      showError("Error", "El nombre de la categoría es requerido");
      return;
    }

    // Validar que el nombre no exista
    const nameExists = documentCategories.some(
      cat => cat.label.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    if (nameExists) {
      showError("Error", "Ya existe una categoría con ese nombre");
      return;
    }

    // Generar un valor único para la categoría
    const newValue = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newCategory: DocumentCategory = {
      value: newValue,
      label: newCategoryName.trim(),
      traduct: newCategoryName.trim(),
      icon: FileText, // Icono por defecto para categorías personalizadas
      bgColor: newCategoryColor.bgColor,
      iconColor: newCategoryColor.iconColor,
      isCustom: true,
    };

    const updatedCustom = [...customCategories, newCategory];
    setCustomCategories(updatedCustom);
    setDocumentCategories([...BASE_DOCUMENT_CATEGORIES, ...updatedCustom]);
    saveCustomCategories(buildingId, updatedCustom);

    // Limpiar formulario y cerrar modal
    setNewCategoryName("");
    setNewCategoryColor(COLOR_OPTIONS[0]);
    setIsCreateCategoryModalOpen(false);
    showSuccess("Éxito", "Categoría creada correctamente");
  };

  // Generar mapeo dinámico de valores de categoría a nombres completos
  const CATEGORY_VALUE_TO_NAME: Record<string, string> = documentCategories.reduce((acc, cat) => {
    // Si usas traducción, envuelve cat.label en t()
    acc[cat.value] = t(cat.label);
    return acc;
  }, {} as Record<string, string>);

  // Filtrar documentos según búsqueda, filtros y categoría seleccionada
  const filteredDocuments = documents.filter((doc) => {
    // Filtro por categoría
    const matchesCategory = selectedCategoryFilter === null ||
      doc.category === CATEGORY_VALUE_TO_NAME[selectedCategoryFilter];

    // Filtro por búsqueda
    const matchesSearch =
      searchTerm === "" ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.subcategory.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por estado
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && doc.status === "activo") ||
      (statusFilter === "pending" && doc.status === "pendiente") ||
      (statusFilter === "approved" && doc.status === "aprobado") ||
      (statusFilter === "expiring" && doc.status === "proximo-vencer");

    return matchesCategory && matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-hidden mt-2">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="mb-1">{t("gestionOfActivo")}</h2>
                  <p className="text-xs text-gray-500">
                    {building?.name || "Cargando nombre del edificio..."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-xs"
                    onClick={() => setIsCreateCategoryModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("nuevaCategoria")}
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t("subirDocumento")}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3 mt-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">{t("totalDocumentos")}</p>
                  <p className="text-blue-600">{stats.total}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">{t("aprobados")}</p>
                  <p className="text-green-600">{stats.aprobados}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">{t("activos")}</p>
                  <p className="text-blue-600">{stats.activos}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">{t("pendientes")}</p>
                  <p className="text-yellow-600">{stats.pendientes}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    {t("proximosVencer")}
                  </p>
                  <p className="text-orange-600">{stats.proximosVencer}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm">{t("categoriasDocumentos")}</h3>
                {selectedCategoryFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setSelectedCategoryFilter(null)}
                  >
                    {t("verTodas")}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {documentCategories.map((category) => {
                  const IconComponent = category.icon;
                  // Calcular el conteo de documentos por categoría dinámicamente
                  const categoryFileCount = documents.filter((doc) => {
                    return doc.category === CATEGORY_VALUE_TO_NAME[category.value];
                  }).length;

                  const isSelected = selectedCategoryFilter === category.value;

                  const isCustom = category.isCustom || false;

                  return (
                    <div
                      key={category.value}
                      className="relative group"
                    >
                      {/* Botón de eliminar - posicionado absolutamente en la esquina superior derecha */}
                      {isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.value, category.label);
                          }}
                          className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white border border-gray-300 rounded-full p-1.5 shadow-sm hover:shadow-md hover:bg-red-50 hover:border-red-300 text-gray-400 hover:text-red-600"
                          title={t("eliminarCategoria")}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left cursor-pointer ${isSelected
                          ? `border-blue-500 bg-blue-50 ${category.bgColor}`
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => {
                          // Si ya está seleccionada, deseleccionar (mostrar todas)
                          if (isSelected) {
                            setSelectedCategoryFilter(null);
                          } else {
                            setSelectedCategoryFilter(category.value);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 ${category.bgColor} rounded-lg`}>
                            <IconComponent
                              className={`w-5 h-5 ${category.iconColor}`}
                              aria-hidden="true"
                            />
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${isSelected ? "text-blue-600" : "text-gray-400"
                              }`}
                            aria-hidden="true"
                          />
                        </div>
                        <p className={`text-xs mb-1 ${isSelected ? "font-semibold text-blue-900" : ""}`}>
                          {t(category.traduct)}
                        </p>
                        <p className={`text-xs ${isSelected ? "text-blue-700" : "text-gray-500"}`}>
                          {categoryFileCount} {t("files")}{categoryFileCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      type="text"
                      placeholder={t("buscarDocumentos")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-xs focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {filteredDocuments.length} {t("of")} {stats.total} {t("documents")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs hover:bg-gray-50 ${showFilters
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-300"
                      }`}
                  >
                    <Funnel className="w-3 h-3" aria-hidden="true" />
                    <span>{t("filters")}</span>
                  </button>
                </div>
              </div>
              {showFilters && (
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative z-10">
                      <label className="block text-xs text-gray-600 mb-2">
                        {t("status")}
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-200/40 focus:border-blue-300 bg-white cursor-pointer"
                      >
                        <option value="all">{t("all")}</option>
                        <option value="active">{t("active")}</option>
                        <option value="pending">{t("pending")}</option>
                        <option value="approved">{t("approved")}</option>
                        <option value="expired">{t("expired")}</option>
                        <option value="expiring">{t("expiring")}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de documentos */}
            {documentsLoading ? (
              <DocumentsLoadingState />
            ) : filteredDocuments.length > 0 ? (
              <div className="space-y-2">
                {filteredDocuments.map((document) => (
                  <DocumentItem
                    key={document.id}
                    document={document}
                    onDownload={handleDownloadDocument}
                    onDelete={handleDeleteDocument}
                  />
                ))}
              </div>
            ) : searchTerm || statusFilter !== "all" ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {t("noDocumentsFound")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("tryAdjustingFilters")}
                  </p>
                </div>
              </div>
            ) : (
              <EmptyDocumentsState
                onUpload={() => setIsUploadModalOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-md shadow-xl bg-white !bg-white">
          <DialogHeader className="!bg-white">
            <DialogTitle className="mb-3">{t("uploadDocument")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 !bg-white">
            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                {t("category")}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200/40 focus:border-blue-300"
              >
                <option value="">Selecciona categoría...</option>
                {documentCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">{t("file")}</label>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                acceptedTypes={[
                  'application/pdf',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'application/vnd.ms-excel',
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  'application/vnd.ms-powerpoint',
                  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                  'image/jpeg',
                  'image/png',
                  'text/plain'
                ]}
                multiple={false}
                maxFiles={1}
                maxSizeInMB={10}
                label={t("uploadDocument")}
                description={selectedFile ? selectedFile.name : t("dragOrClickToSelect")}
                disabled={isUploading}
              />
              {selectedFile && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                  ✓ {t("fileSelected")} {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </div>
              )}
              {!selectedCategory && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  ⚠ {t("selectCategoryToEnableUpload")}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-4 sm:flex-row !bg-white">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 text-sm"
              disabled={isUploading}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleUpload}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading || !selectedFile || !selectedCategory}
              title={
                !selectedFile
                  ? "Selecciona un archivo"
                  : !selectedCategory
                    ? "Selecciona una categoría"
                    : isUploading
                      ? "Subiendo..."
                      : "Subir documento"
              }
            >
              {isUploading ? "Subiendo..." : "Subir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsDeleteModalOpen(false);
          setDeletingDocument(null);
        }
      }}>
        <AlertDialogContent className="bg-white !bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Eliminar Documento
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              ¿Estás seguro de que deseas eliminar el documento <strong>"{deletingDocument?.name}"</strong>?
              <br />
              <span className="text-xs text-gray-500 mt-2 block">
                Esta acción no se puede deshacer. El archivo se eliminará permanentemente.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingDocument(null);
              }}
              disabled={isDeleting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de crear categoría */}
      <Dialog open={isCreateCategoryModalOpen} onOpenChange={setIsCreateCategoryModalOpen}>
        <DialogContent className="max-w-md shadow-xl bg-white !bg-white">
          <DialogHeader className="!bg-white">
            <DialogTitle className="!bg-white mb-3">Crear Nueva Categoría</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 !bg-white">
            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Nombre de la categoría
              </label>
              <Input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ej: Documentación Especial"
                className="w-full focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
              />
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((color, index) => {
                  const isSelected = newCategoryColor.bgColor === color.bgColor;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setNewCategoryColor(color)}
                      className={`h-10 rounded border-2 transition-all ${isSelected
                        ? "border-gray-900 scale-110"
                        : "border-gray-200 hover:border-gray-300"
                        } ${color.solidColor}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-xs text-blue-800">
                ℹ️ Las categorías personalizadas te permiten organizar documentos específicos de tu edificio
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-4 sm:flex-row !bg-white">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateCategoryModalOpen(false);
                setNewCategoryName("");
                setNewCategoryColor(COLOR_OPTIONS[0]);
              }}
              className="flex-1 text-sm"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCategory}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
              disabled={!newCategoryName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Categoría
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de factura de servicio */}
      <Dialog open={isServiceInvoiceModalOpen} onOpenChange={setIsServiceInvoiceModalOpen}>
        <DialogContent className="max-w-md shadow-xl bg-white flex flex-col max-h-[90vh]">
          <DialogHeader className="!bg-white">
            <DialogTitle className="mb-3">Registrar Factura de Servicio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 !bg-white overflow-y-auto pr-2 flex-1 px-1">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-xs text-blue-800">
                ℹ️ El documento PDF ya ha sido subido. Completa los datos para registrar la factura en el sistema.
              </p>
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Tipo de Servicio <span className="text-red-500">*</span>
              </label>
              <select
                value={serviceInvoiceData.service_type}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  service_type: e.target.value as ServiceType
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200/40 focus:border-blue-300"
              >
                {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map((type) => (
                  <option key={type} value={type}>
                    {getServiceTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Fecha de la Factura <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={serviceInvoiceData.invoice_date}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  invoice_date: e.target.value
                })}
                className="w-full focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Importe (EUR) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={serviceInvoiceData.amount_eur || ''}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  amount_eur: parseFloat(e.target.value) || 0
                })}
                placeholder="0.00"
                className="w-full focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
              />
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Unidades Consumidas (opcional)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={serviceInvoiceData.units || ''}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  units: e.target.value ? parseFloat(e.target.value) : null
                })}
                placeholder="Opcional"
                className="w-full focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
              />
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Proveedor (opcional)
              </label>
              <Input
                type="text"
                value={serviceInvoiceData.provider || ''}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  provider: e.target.value
                })}
                placeholder="Proveedor"
                className="w-full focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
              />
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Número de Factura (opcional)
              </label>
              <Input
                type="text"
                value={serviceInvoiceData.invoice_number || ''}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  invoice_number: e.target.value
                })}
                placeholder="Número de Factura"
                className="w-full focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
              />
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Periodo de inicio <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={serviceInvoiceData.period_start || ''}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  period_start: e.target.value
                })}
                placeholder="Fecha de inicio"
                className="w-full focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
              />
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Periodo de fin <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={serviceInvoiceData.period_end || ''}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  period_end: e.target.value
                })}
                placeholder="Fecha de fin"
                className="w-full focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
              />
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Fecha de vencimiento <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={serviceInvoiceData.expiration_date || ''}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  expiration_date: e.target.value
                })}
                placeholder="Fecha de vencimiento"
                className="w-full focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
              />
            </div>

            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Notas (opcional)
              </label>
              <textarea
                value={serviceInvoiceData.notes}
                onChange={(e) => setServiceInvoiceData({
                  ...serviceInvoiceData,
                  notes: e.target.value
                })}
                placeholder="Notas adicionales sobre la factura..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-200/40 focus:border-blue-300"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-4 sm:flex-row !bg-white">
            <Button
              variant="outline"
              onClick={handleCancelServiceInvoice}
              className="flex-1 text-sm"
            >
              Omitir
            </Button>
            <Button
              onClick={handleCreateServiceInvoice}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
              disabled={!serviceInvoiceData.amount_eur || serviceInvoiceData.amount_eur <= 0 || !serviceInvoiceData.period_start || !serviceInvoiceData.period_end || !serviceInvoiceData.expiration_date || !serviceInvoiceData.invoice_date}
            >
              Registrar Factura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
