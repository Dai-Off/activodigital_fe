import {
  Building as BuildingIcon,
  FileSpreadsheet,
  FileCheck,
  Wrench,
  Users,
  Scale,
  Shield,
  FileChartColumnIncreasing,
  ChevronRight,
  Search,
  Funnel,
  Download,
  Trash2,
  Eye,
  House,
  FileText,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { BuildingsApiService, type Building } from "~/services/buildingsApi";
import { type Document, DocumentsApiService } from "~/services/documentsApi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { SkeletonBase } from "./ui/LoadingSystem";
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
import { useToast } from "~/contexts/ToastContext";

// Categorías base
const BASE_DOCUMENT_CATEGORIES = [
  {
    value: "financial",
    label: "Financiero/Contable",
    icon: FileSpreadsheet,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    value: "contracts",
    label: "Contratos",
    icon: FileCheck,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    value: "maintenance",
    label: "Mantenimiento",
    icon: Wrench,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    value: "public",
    label: "Administración Pública",
    icon: BuildingIcon,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    value: "internal",
    label: "Gestión Interna",
    icon: Users,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    value: "legal",
    label: "Jurídico/Legal",
    icon: Scale,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    value: "certificates",
    label: "Certificaciones",
    icon: Shield,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    value: "technical",
    label: "Documentación Técnica",
    icon: FileChartColumnIncreasing,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
];

// Helper para obtener el badge según el estado
const getStatusBadge = (status: Document["status"]) => {
  const statusConfig = {
    aprobado: {
      label: "Verificado",
      className: "bg-green-100 text-green-700 border border-green-200",
    },
    activo: {
      label: "Vigente",
      className: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    pendiente: {
      label: "Revisión Pendiente",
      className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    },
    "proximo-vencer": {
      label: "Próximo a vencer",
      className: "bg-orange-100 text-orange-700 border border-orange-200",
    },
  };

  const config = statusConfig[status] || statusConfig.activo;
  return (
    <Badge className={config.className} data-slot="badge">
      {config.label}
    </Badge>
  );
};

// Helper para obtener el badge de escaneo
const getScanBadge = (status: Document["status"]) => {
  if (status === "aprobado" || status === "activo") {
    return (
      <Badge className="bg-green-100 text-green-700 border border-green-200 text-xs" data-slot="badge">
        ✓ Escaneo OK
      </Badge>
    );
  } else if (status === "pendiente") {
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs" data-slot="badge">
        ⏳ Escaneando
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs" data-slot="badge">
        ✗ Error Escaneo
      </Badge>
    );
  }
};

// Componente para cada item de documento
const DocumentItem = ({
  document,
  buildingName,
  unitName,
  onView,
  onDownload,
  onDelete,
}: {
  document: Document & { buildingId: string; buildingName: string; unitName?: string };
  buildingName: string;
  unitName?: string;
  onView: (url: string) => void;
  onDownload: (url: string, fileName: string) => void;
  onDelete: (document: Document & { buildingId: string }) => void;
}) => {
  const IconComponent = FileText; // Por ahora usamos FileText para todos

  return (
    <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2 ${document.iconBgColor || 'bg-blue-100'} rounded-lg flex-shrink-0`}>
            <IconComponent className={`w-4 h-4 ${document.iconColor || 'text-blue-600'}`} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-xs truncate">{document.name}</p>
              {unitName && (
                <Badge className="bg-green-100 text-green-700 border border-green-200 text-xs flex items-center gap-1 flex-shrink-0" data-slot="badge">
                  <House className="w-3 h-3" aria-hidden="true" />
                  {unitName}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
              <BuildingIcon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{buildingName}</span>
              <span>•</span>
              <span className="truncate">{document.subcategory || "General"}</span>
              <span>•</span>
              <span>{document.date}</span>
              <span>•</span>
              <span>{document.size}</span>
              {document.contractInfo?.importe && (
                <>
                  <span>•</span>
                  <span className="text-green-600">{document.contractInfo.importe}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 flex-wrap">
            {getScanBadge(document.status)}
            {getStatusBadge(document.status)}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              title="Ver documento"
              onClick={() => document.url && onView(document.url)}
            >
              <Eye className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              title="Descargar documento"
              onClick={() => document.url && onDownload(document.url, document.name)}
            >
              <Download className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              title="Eliminar documento"
              onClick={() => onDelete(document)}
            >
              <Trash2 className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


export function GeneralGestion() {
  const { showSuccess, showError } = useToast();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(false); // Inicializar en false hasta que haya edificios
  const [allDocuments, setAllDocuments] = useState<(Document & { buildingId: string; buildingName: string; unitName?: string })[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    edificios: 0,
    activos: 0,
    pendientes: 0,
    aprobados: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>("all");
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState<(Document & { buildingId: string }) | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar edificios
  useEffect(() => {
    // No necesitamos setLoading(true) porque ya está inicializado en true
    BuildingsApiService.getAllBuildings()
      .then((data) => {
        setBuildings(data);
        setStats(prev => ({ ...prev, edificios: data.length }));
      })
      .catch((error) => {
        console.error("Error cargando edificios:", error);
        setBuildings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Cargar documentos de todos los edificios en paralelo para mejor rendimiento
  useEffect(() => {
    if (buildings.length === 0) {
      setDocumentsLoading(false);
      return;
    }

    setDocumentsLoading(true);
    const loadAllDocuments = async () => {
      try {
        // Cargar todos los documentos en paralelo usando Promise.all
        const documentPromises = buildings.map(async (building) => {
          try {
            const response = await DocumentsApiService.getBuildingDocuments(building.id);
            return response.documents.map(doc => ({
              ...doc,
              buildingId: building.id,
              buildingName: building.name,
              unitName: undefined, // Por ahora no hay unidades, se puede agregar después
            }));
          } catch (error) {
            console.error(`Error cargando documentos de ${building.name}:`, error);
            return []; // Retornar array vacío en caso de error
          }
        });

        // Esperar a que todas las peticiones se completen en paralelo
        const documentsArrays = await Promise.all(documentPromises);
        const documentsWithBuilding = documentsArrays.flat();

        setAllDocuments(documentsWithBuilding);
        
        // Calcular estadísticas globales
        setStats({
          total: documentsWithBuilding.length,
          edificios: buildings.length,
          activos: documentsWithBuilding.filter(d => d.status === "activo").length,
          pendientes: documentsWithBuilding.filter(d => d.status === "pendiente").length,
          aprobados: documentsWithBuilding.filter(d => d.status === "aprobado").length,
        });
      } catch (error) {
        console.error("Error cargando documentos:", error);
        setAllDocuments([]);
      } finally {
        setDocumentsLoading(false);
      }
    };

    loadAllDocuments();
  }, [buildings]);

  // Obtener unidades únicas (por ahora vacío, se puede expandir)
  const uniqueUnits = useMemo(() => {
    const units = new Set<string>();
    allDocuments.forEach(doc => {
      if (doc.unitName) {
        units.add(doc.unitName);
      }
    });
    return Array.from(units).sort();
  }, [allDocuments]);

  // Filtrar documentos
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((doc) => {
      // Filtro por edificio
      const matchesBuilding = selectedBuildingFilter === "all" || doc.buildingId === selectedBuildingFilter;

      // Filtro por unidad
      const matchesUnit = selectedUnitFilter === "all" || doc.unitName === selectedUnitFilter;

      // Filtro por categoría
      const matchesCategory = selectedCategoryFilter === null || 
        doc.categoryValue === selectedCategoryFilter;

      // Filtro por búsqueda
      const matchesSearch =
        searchTerm === "" ||
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.subcategory.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesBuilding && matchesUnit && matchesCategory && matchesSearch;
    });
  }, [allDocuments, selectedBuildingFilter, selectedUnitFilter, selectedCategoryFilter, searchTerm]);

  // Calcular conteos por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    BASE_DOCUMENT_CATEGORIES.forEach(cat => {
      counts[cat.value] = allDocuments.filter(doc => doc.categoryValue === cat.value).length;
    });
    return counts;
  }, [allDocuments]);

  // Mostrar skeleton solo durante la carga inicial de edificios
  // Una vez que los edificios están cargados, mostrar el contenido aunque los documentos aún se estén cargando
  if (loading) {
    return (
      <div className="h-full flex flex-col gap-4">
        {/* Header con estadísticas skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg w-9 h-9 animate-pulse" />
            <div>
              <div className="h-5 w-64 bg-gray-200 rounded mb-1 animate-pulse" />
              <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="h-3 w-20 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-5 w-8 bg-gray-300 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Categorías skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
          <div className="h-4 w-20 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="p-3 rounded-lg border-2 border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg w-9 h-9 animate-pulse" />
                  <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-3 w-16 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Búsqueda y filtros skeleton */}
        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
              <div className="relative flex-1 max-w-md">
                <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="h-10 flex-1 sm:flex-none sm:w-48 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-10 flex-1 sm:flex-none sm:w-40 bg-gray-100 rounded-lg animate-pulse" />
              </div>
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse hidden sm:block" />
              <div className="h-9 w-16 bg-gray-100 rounded-lg animate-pulse flex-shrink-0" />
            </div>
          </div>

          {/* Lista de documentos skeleton */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Funciones para acciones de documentos
  const handleViewDocument = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
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

  const handleDeleteDocument = (document: Document & { buildingId: string }) => {
    setDeletingDocument(document);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDocument) return;

    setIsDeleting(true);
    try {
      const { deleteGestionDocument } = await import("~/services/gestionDocuments");
      const result = await deleteGestionDocument(
        deletingDocument.url || '',
        deletingDocument.buildingId,
        deletingDocument.categoryValue || '',
        deletingDocument.storageFileName || ''
      );

      if (result.success) {
        showSuccess("Documento eliminado", "El documento se ha eliminado correctamente");
        
        // Recargar documentos
        const updatedDocuments = allDocuments.filter(d => d.id !== deletingDocument.id);
        setAllDocuments(updatedDocuments);
        setStats({
          total: updatedDocuments.length,
          edificios: buildings.length,
          activos: updatedDocuments.filter(d => d.status === "activo").length,
          pendientes: updatedDocuments.filter(d => d.status === "pendiente").length,
          aprobados: updatedDocuments.filter(d => d.status === "aprobado").length,
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

  return (
    <>
    <div className="h-full flex flex-col gap-4">
        {/* Header con estadísticas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <BuildingIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Gestión General de la Plataforma</h2>
              <p className="text-sm text-gray-500">Vista consolidada de todos los documentos de edificios y unidades</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 mt-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total Documentos</p>
              <p className="text-blue-600">{stats.total}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Edificios</p>
              <p className="text-green-600">{stats.edificios}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Activos</p>
              <p className="text-purple-600">{stats.activos}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Pendientes</p>
              <p className="text-yellow-600">{stats.pendientes}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Aprobados</p>
              <p className="text-indigo-600">{stats.aprobados}</p>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
          <h3 className="text-sm mb-3">Categorías</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
            {BASE_DOCUMENT_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategoryFilter === category.value;
              const fileCount = categoryCounts[category.value] || 0;

              return (
                <button
                  key={category.value}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
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
                      <IconComponent className={`w-5 h-5 ${category.iconColor}`} aria-hidden="true" />
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform text-gray-400 ${isSelected ? "text-blue-600" : ""}`} aria-hidden="true" />
                  </div>
                  <p className="text-xs mb-1">{category.label}</p>
                  <p className="text-xs text-gray-500">{fileCount} archivo{fileCount !== 1 ? "s" : ""}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <Input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-xs"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="relative flex-1 sm:flex-none min-w-0">
                  <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                  <select
                    value={selectedBuildingFilter}
                    onChange={(e) => setSelectedBuildingFilter(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-xs bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors w-full sm:min-w-[180px]"
                  >
                    <option value="all">Todos los edificios</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" aria-hidden="true" />
                </div>
                <div className="relative flex-1 sm:flex-none min-w-0">
                  <House className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                  <select
                    value={selectedUnitFilter}
                    onChange={(e) => setSelectedUnitFilter(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-xs bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors w-full sm:min-w-[150px]"
                  >
                    <option value="all">Todas las unidades</option>
                    {uniqueUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" aria-hidden="true" />
                </div>
              </div>
              <p className="text-xs text-gray-500 whitespace-nowrap">{filteredDocuments.length} de {stats.total} docs</p>
              <Button variant="outline" size="sm" className="text-xs flex-shrink-0">
                <Funnel className="w-3 h-3 mr-2" aria-hidden="true" />
                Más
              </Button>
            </div>
          </div>

          {/* Lista de documentos */}
          <div className="flex-1 overflow-y-auto p-4">
            {documentsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <SkeletonBase className="w-10 h-10 rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <SkeletonBase className="h-4 w-48" />
                            <SkeletonBase className="h-5 w-16 rounded-full" />
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <SkeletonBase className="h-3 w-3 rounded" />
                            <SkeletonBase className="h-3 w-24" />
                            <SkeletonBase className="h-3 w-1" />
                            <SkeletonBase className="h-3 w-32" />
                            <SkeletonBase className="h-3 w-1" />
                            <SkeletonBase className="h-3 w-20" />
                            <SkeletonBase className="h-3 w-1" />
                            <SkeletonBase className="h-3 w-16" />
                          </div>
                          <div className="flex items-center gap-2">
                            <SkeletonBase className="h-5 w-20 rounded-full" />
                            <SkeletonBase className="h-5 w-16 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <SkeletonBase className="w-8 h-8 rounded" />
                        <SkeletonBase className="w-8 h-8 rounded" />
                        <SkeletonBase className="w-8 h-8 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDocuments.length > 0 ? (
              <div className="space-y-2">
                {filteredDocuments.map((document) => (
                  <DocumentItem
                    key={`${document.buildingId}-${document.id}`}
                    document={document}
                    buildingName={document.buildingName}
                    unitName={document.unitName}
                    onView={handleViewDocument}
                    onDownload={handleDownloadDocument}
                    onDelete={handleDeleteDocument}
                  />
                ))}
              </div>
            ) : searchTerm || selectedBuildingFilter !== "all" || selectedCategoryFilter ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    No se encontraron documentos
                  </h3>
                  <p className="text-sm text-gray-500">
                    Intenta ajustar los filtros de búsqueda.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay documentos cargados
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    No hay documentos cargados en la plataforma.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </>
  );
}

