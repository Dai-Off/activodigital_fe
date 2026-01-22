import { listUnitGestionDocuments, formatUnitFileSize, type UnitGestionDocument } from "./unitGestionDocuments";

// Tipos para documentos de unidades
export type UnitDocumentStatus = "aprobado" | "activo" | "pendiente" | "proximo-vencer";

export interface UnitContractInfo {
  proveedor?: string;
  importe?: string;
  vencimiento?: string;
  renovacion?: string;
}

export interface UnitDocument {
  id: string;
  name: string;
  status: UnitDocumentStatus;
  category: string;
  subcategory: string;
  date: string;
  size: string;
  fileType: string;
  iconType: string; // Tipo de icono para mapear al componente
  iconBgColor: string;
  iconColor: string;
  contractInfo?: UnitContractInfo;
  expirationDate?: string;
  url?: string; // URL para descargar/ver
  // Información adicional para operaciones
  storageFileName?: string; // Nombre del archivo en storage (para eliminar)
  categoryValue?: string; // Valor de la categoría (financial, contracts, etc.)
}

export interface UnitDocumentsResponse {
  documents: UnitDocument[];
  total: number;
  aprobados: number;
  activos: number;
  pendientes: number;
  proximosVencer: number;
}

// Mapeo de categorías de valor a nombre completo
const UNIT_CATEGORY_MAP: Record<string, string> = {
  financial: "Financiero/Contable",
  contracts: "Contratos",
  maintenance: "Mantenimiento",
  public: "Administración Pública",
  internal: "Gestión Interna",
  legal: "Jurídico/Legal",
  certificates: "Certificaciones",
  technical: "Documentación Técnica",
};

// Mapeo de tipo MIME a iconType
const MIME_TO_ICON: Record<string, string> = {
  'application/pdf': 'FileText',
  'application/msword': 'FileText',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'FileText',
  'application/vnd.ms-excel': 'FileSpreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'FileSpreadsheet',
  'application/vnd.ms-powerpoint': 'FileText',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'FileText',
  'image/jpeg': 'FileText',
  'image/png': 'FileText',
  'text/plain': 'FileText',
};

// Mapeo de categorías a colores
const UNIT_CATEGORY_COLORS: Record<string, { bg: string; icon: string }> = {
  financial: { bg: "bg-blue-50", icon: "text-blue-600" },
  contracts: { bg: "bg-green-50", icon: "text-green-600" },
  maintenance: { bg: "bg-orange-50", icon: "text-orange-600" },
  public: { bg: "bg-purple-50", icon: "text-purple-600" },
  internal: { bg: "bg-indigo-50", icon: "text-indigo-600" },
  legal: { bg: "bg-red-50", icon: "text-red-600" },
  certificates: { bg: "bg-teal-50", icon: "text-teal-600" },
  technical: { bg: "bg-cyan-50", icon: "text-cyan-600" },
};

/**
 * Convierte un UnitGestionDocument a UnitDocument
 */
function mapUnitGestionToDocument(gestionDoc: UnitGestionDocument): UnitDocument {
  const categoryName = UNIT_CATEGORY_MAP[gestionDoc.category] || gestionDoc.category;
  const colors = UNIT_CATEGORY_COLORS[gestionDoc.category] || { bg: "bg-gray-50", icon: "text-gray-600" };
  const iconType = MIME_TO_ICON[gestionDoc.mimeType] || 'FileText';
  const fileExtension = gestionDoc.fileName.split('.').pop()?.toUpperCase() || 'FILE';
  const uploadDate = new Date(gestionDoc.uploadedAt);
  // Formato YYYY-MM-DD para coincidir con el HTML
  const year = uploadDate.getFullYear();
  const month = String(uploadDate.getMonth() + 1).padStart(2, '0');
  const day = String(uploadDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  // Por defecto, todos los documentos subidos son "activos"
  const status: UnitDocumentStatus = "activo";

  return {
    id: gestionDoc.id,
    name: gestionDoc.title || gestionDoc.fileName,
    status,
    category: categoryName,
    subcategory: "General", // Por defecto, se puede expandir después
    date: formattedDate,
    size: formatUnitFileSize(gestionDoc.fileSize),
    fileType: fileExtension,
    iconType,
    iconBgColor: colors.bg,
    iconColor: colors.icon,
    url: gestionDoc.url,
    // Información adicional para operaciones
    storageFileName: gestionDoc.storageFileName || gestionDoc.id.split('_').slice(3).join('_'), // Nombre del archivo en storage
    categoryValue: gestionDoc.category, // Valor de la categoría (financial, contracts, etc.)
  };
}

/**
 * Servicio para gestionar documentos de una unidad
 */
export class UnitDocumentsApiService {
  /**
   * Obtiene todos los documentos de una unidad
   * @param buildingId - ID del edificio
   * @param unitId - ID de la unidad
   * @returns Lista de documentos y estadísticas
   */
  static async getUnitDocuments(
    buildingId: string,
    unitId: string
  ): Promise<UnitDocumentsResponse> {
    try {
      // Obtener documentos de gestión desde Supabase
      const gestionDocs = await listUnitGestionDocuments(buildingId, unitId);
      
      // Mapear a formato UnitDocument
      const documents = gestionDocs.map(mapUnitGestionToDocument);

      // Calcular estadísticas
      const stats = {
        total: documents.length,
        aprobados: documents.filter(d => d.status === "aprobado").length,
        activos: documents.filter(d => d.status === "activo").length,
        pendientes: documents.filter(d => d.status === "pendiente").length,
        proximosVencer: documents.filter(d => d.status === "proximo-vencer").length,
      };

      return {
        documents,
        ...stats,
      };
    } catch (error) {
      console.error("Error obteniendo documentos de unidad:", error);
      // En caso de error, retornar datos vacíos
      return {
        documents: [],
        total: 0,
        aprobados: 0,
        activos: 0,
        pendientes: 0,
        proximosVencer: 0,
      };
    }
  }

  /**
   * Elimina un documento
   * @param buildingId - ID del edificio
   * @param unitId - ID de la unidad
   * @param documentId - ID del documento
   */
  static async deleteDocument(
    _buildingId: string,
    _unitId: string,
    _documentId: string
  ): Promise<void> {
    try {
      // TODO: Implementar cuando la API esté lista
      throw new Error("API no implementada aún");
    } catch (error) {
      console.error("Error eliminando documento de unidad:", error);
      throw error;
    }
  }

  /**
   * Descarga un documento
   * @param documentUrl - URL del documento
   */
  static async downloadDocument(documentUrl: string): Promise<void> {
    try {
      // Abrir en nueva pestaña o descargar
      window.open(documentUrl, "_blank");
    } catch (error) {
      console.error("Error descargando documento de unidad:", error);
      throw error;
    }
  }
}

