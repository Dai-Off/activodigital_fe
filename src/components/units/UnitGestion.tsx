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
import { type Building } from "~/services/buildingsApi";
import { type BuildingUnit } from "~/services/unitsApi";
import {
  type UnitDocument,
  UnitDocumentsApiService,
} from "~/services/unitDocumentsApi";
import { BuildingCertificatesLoading } from "../ui/dashboardLoading";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { SkeletonBase } from "../ui/LoadingSystem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import FileUpload from "../ui/FileUpload";
import { uploadUnitGestionDocument, deleteUnitGestionDocument } from "~/services/unitGestionDocuments";
import { useAuth } from "~/contexts/AuthContext";
import { useToast } from "~/contexts/ToastContext";

// Tipo para categorías de documentos
type DocumentCategory = {
  value: string;
  label: string;
  icon: typeof FileSpreadsheet;
  bgColor: string;
  iconColor: string;
  isCustom?: boolean;
};

// Categorías base predefinidas
const BASE_DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    value: "financial",
    label: "Financiero/Contable",
    icon: FileSpreadsheet,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    value: "contracts",
    label: "Contratos",
    icon: FileCheck,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    value: "maintenance",
    label: "Mantenimiento",
    icon: Wrench,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    value: "public",
    label: "Administración Pública",
    icon: BuildingIcon,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    value: "internal",
    label: "Gestión Interna",
    icon: Users,
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    value: "legal",
    label: "Jurídico/Legal",
    icon: Scale,
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    value: "certificates",
    label: "Certificaciones",
    icon: Shield,
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    value: "technical",
    label: "Documentación Técnica",
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
const getCustomCategoriesKey = (unitId: string) => `unit_gestion_custom_categories_${unitId}`;

const loadCustomCategories = (unitId: string): DocumentCategory[] => {
  try {
    const stored = localStorage.getItem(getCustomCategoriesKey(unitId));
    if (!stored) return [];
    const parsed = JSON.parse(stored);
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

const saveCustomCategories = (unitId: string, categories: DocumentCategory[]) => {
  try {
    const serializable = categories.map(cat => ({
      ...cat,
      iconName: AVAILABLE_ICONS.find(ic => ic.component === cat.icon)?.name || "FileText",
      icon: undefined,
    }));
    localStorage.setItem(getCustomCategoriesKey(unitId), JSON.stringify(serializable));
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

const getIconComponent = (iconType: string) => {
  return ICON_MAP[iconType] || FileText;
};

const getStatusBadge = (status: UnitDocument["status"]) => {
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

const DocumentItem = ({ 
  document, 
  onDownload,
  onDelete
}: { 
  document: UnitDocument;
  onDownload: (url: string, fileName: string) => void;
  onDelete: (document: UnitDocument) => void;
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
            </div>
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
        documentación de la unidad de forma organizada.
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

interface UnitGestionProps {
  buildingId: string;
  unitId: string;
  building?: Building | null;
  unit?: BuildingUnit | null;
}

export function UnitGestion({ buildingId, unitId, building, unit }: UnitGestionProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documents, setDocuments] = useState<UnitDocument[]>([]);
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
  const [deletingDocument, setDeletingDocument] = useState<UnitDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estado para categorías (base + personalizadas)
  const [customCategories, setCustomCategories] = useState<DocumentCategory[]>([]);
  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>(BASE_DOCUMENT_CATEGORIES);
  
  // Estado para modal de crear categoría
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(COLOR_OPTIONS[0]);

  // Cargar categorías personalizadas al montar el componente
  useEffect(() => {
    if (!unitId) return;
    const loaded = loadCustomCategories(unitId);
    setCustomCategories(loaded);
    setDocumentCategories([...BASE_DOCUMENT_CATEGORIES, ...loaded]);
  }, [unitId]);

  // Cargar documentos
  useEffect(() => {
    if (!buildingId || !unitId) {
      setDocumentsLoading(false);
      setLoading(false);
      return;
    }

    setDocumentsLoading(true);
    UnitDocumentsApiService.getUnitDocuments(buildingId, unitId)
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
        console.error("Error cargando documentos de unidad:", error);
        setDocuments([]);
      })
      .finally(() => {
        setDocumentsLoading(false);
        setLoading(false);
      });
  }, [buildingId, unitId]);

  if (loading) {
    return <BuildingCertificatesLoading />;
  }

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    } else {
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
    if (!buildingId || !unitId) {
      showError("Error", "No se pudo identificar el edificio o la unidad");
      return;
    }
    if (!user?.userId) {
      showError("Error", "No se pudo identificar el usuario");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadUnitGestionDocument(
        selectedFile,
        buildingId,
        unitId,
        selectedCategory,
        user.userId
      );

      if (result.success && result.document) {
        showSuccess("Documento subido", "El documento se ha subido correctamente");
        
        // Recargar documentos
        reloadDocuments();
        
        // Cerrar modal y resetear
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setSelectedCategory("");
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

  const reloadDocuments = () => {
    if (!buildingId || !unitId) return;
    setDocumentsLoading(true);
    UnitDocumentsApiService.getUnitDocuments(buildingId, unitId)
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

  const handleDownloadDocument = (url: string, fileName: string) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteDocument = (document: UnitDocument) => {
    setDeletingDocument(document);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDocument || !buildingId || !unitId) return;

    setIsDeleting(true);
    try {
      const categoryValue = deletingDocument.categoryValue || 
        documentCategories.find((cat: DocumentCategory) => cat.label === deletingDocument.category)?.value ||
        deletingDocument.category.toLowerCase().replace(/\s+/g, '_');
      
      const fullDocument = documents.find(d => d.id === deletingDocument.id);
      if (!fullDocument?.storageFileName) {
        showError("Error", "No se pudo identificar el archivo a eliminar");
        return;
      }

      const result = await deleteUnitGestionDocument(
        deletingDocument.url || '',
        buildingId,
        unitId,
        categoryValue,
        fullDocument.storageFileName
      );

      if (result.success) {
        showSuccess("Documento eliminado", "El documento se ha eliminado correctamente");
        reloadDocuments();
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

  const handleDeleteCategory = (categoryValue: string, categoryLabel: string) => {
    if (!unitId) return;

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

    const updatedCustom = customCategories.filter(
      cat => cat.value !== categoryValue
    );
    setCustomCategories(updatedCustom);
    setDocumentCategories([...BASE_DOCUMENT_CATEGORIES, ...updatedCustom]);
    saveCustomCategories(unitId, updatedCustom);

    if (selectedCategoryFilter === categoryValue) {
      setSelectedCategoryFilter(null);
    }

    showSuccess("Éxito", "Categoría eliminada correctamente");
  };

  const handleCreateCategory = () => {
    if (!unitId || !newCategoryName.trim()) {
      showError("Error", "El nombre de la categoría es requerido");
      return;
    }

    const nameExists = documentCategories.some(
      cat => cat.label.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    if (nameExists) {
      showError("Error", "Ya existe una categoría con ese nombre");
      return;
    }

    const newValue = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const newCategory: DocumentCategory = {
      value: newValue,
      label: newCategoryName.trim(),
      icon: FileText,
      bgColor: newCategoryColor.bgColor,
      iconColor: newCategoryColor.iconColor,
      isCustom: true,
    };

    const updatedCustom = [...customCategories, newCategory];
    setCustomCategories(updatedCustom);
    setDocumentCategories([...BASE_DOCUMENT_CATEGORIES, ...updatedCustom]);
    saveCustomCategories(unitId, updatedCustom);

    setNewCategoryName("");
    setNewCategoryColor(COLOR_OPTIONS[0]);
    setIsCreateCategoryModalOpen(false);
    showSuccess("Éxito", "Categoría creada correctamente");
  };

  const CATEGORY_VALUE_TO_NAME: Record<string, string> = documentCategories.reduce((acc, cat) => {
    acc[cat.value] = cat.label;
    return acc;
  }, {} as Record<string, string>);

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategoryFilter === null || 
      doc.category === CATEGORY_VALUE_TO_NAME[selectedCategoryFilter];

    const matchesSearch =
      searchTerm === "" ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.subcategory.toLowerCase().includes(searchTerm.toLowerCase());

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
                  <h2 className="mb-1">Gestión de la Unidad</h2>
                  <p className="text-xs text-gray-500">
                    {building?.name || "Edificio"} - {unit?.name || unit?.identifier || "Unidad"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => setIsCreateCategoryModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Categoría
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Documento
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3 mt-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Documentos</p>
                  <p className="text-blue-600">{stats.total}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Aprobados</p>
                  <p className="text-green-600">{stats.aprobados}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Activos</p>
                  <p className="text-blue-600">{stats.activos}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Pendientes</p>
                  <p className="text-yellow-600">{stats.pendientes}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    Próximos a vencer
                  </p>
                  <p className="text-orange-600">{stats.proximosVencer}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm">Categorías de Documentos</h3>
                {selectedCategoryFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setSelectedCategoryFilter(null)}
                  >
                    Ver todas
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {documentCategories.map((category) => {
                  const IconComponent = category.icon;
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
                      {isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.value, category.label);
                          }}
                          className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white border border-gray-300 rounded-full p-1.5 shadow-sm hover:shadow-md hover:bg-red-50 hover:border-red-300 text-gray-400 hover:text-red-600"
                          title="Eliminar categoría"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      <div 
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left cursor-pointer ${
                          isSelected 
                            ? `border-blue-500 bg-blue-50 ${category.bgColor}` 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
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
                            className={`w-4 h-4 transition-transform ${
                              isSelected ? "text-blue-600" : "text-gray-400"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                        <p className={`text-xs mb-1 ${isSelected ? "font-semibold text-blue-900" : ""}`}>
                          {category.label}
                        </p>
                        <p className={`text-xs ${isSelected ? "text-blue-700" : "text-gray-500"}`}>
                          {categoryFileCount} archivo{categoryFileCount !== 1 ? "s" : ""}
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
                      placeholder="Buscar documentos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-xs focus-visible:border-blue-300 focus-visible:ring-blue-200/30"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {filteredDocuments.length} de {stats.total} documentos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs hover:bg-gray-50 ${
                      showFilters
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    <Funnel className="w-3 h-3" aria-hidden="true" />
                    <span>Filtros</span>
                  </button>
                </div>
              </div>
              {showFilters && (
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative z-10">
                      <label className="block text-xs text-gray-600 mb-2">
                        Estado
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-200/40 focus:border-blue-300 bg-white cursor-pointer"
                      >
                        <option value="all">Todos</option>
                        <option value="active">Activo</option>
                        <option value="pending">Pendiente</option>
                        <option value="approved">Aprobado</option>
                        <option value="expiring">Próximo a vencer</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                    No se encontraron documentos
                  </h3>
                  <p className="text-sm text-gray-500">
                    Intenta ajustar los filtros de búsqueda.
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
            <DialogTitle className="mb-3">Subir Documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 !bg-white">
            <div className="!bg-white">
              <label className="block text-sm text-gray-700 mb-1">
                Categoría
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
              <label className="block text-sm text-gray-700 mb-1">Archivo</label>
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
                label="Subir documento"
                description={selectedFile ? selectedFile.name : "Arrastra o haz clic para seleccionar"}
                disabled={isUploading}
              />
              {selectedFile && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                  ✓ Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </div>
              )}
              {!selectedCategory && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  ⚠ Selecciona una categoría para habilitar la subida
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
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading || !selectedFile || !selectedCategory}
            >
              {isUploading ? "Subiendo..." : "Subir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                      className={`h-10 rounded border-2 transition-all ${
                        isSelected
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
                ℹ️ Las categorías personalizadas te permiten organizar documentos específicos de tu unidad
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
    </div>
  );
}

