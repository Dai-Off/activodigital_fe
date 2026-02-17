import * as XLSX from "xlsx";

// Interfaz para los documentos que se exportarán
interface ExportDocument {
  name: string;
  category: string;
  subcategory: string;
  type: string;
  status: string;
}

// Interfaz para las opciones de traducción
interface ExportOptions {
  // Función para traducir el nombre de la subcategoría
  translateSubcategory: (rawName: string) => string;
  // Función para traducir el nombre de la categoría
  translateCategory: (categoryId: string) => string;
  // Función para traducir el tipo de documento (obligatorio/opcional)
  translateType: (type: string) => string;
  // Función para traducir el estado del documento
  translateStatus: (status: string) => string;
  // Nombre del archivo de salida (sin extensión)
  fileName?: string;
}

/**
 * Servicio para exportar documentos del DataRoom a Excel
 */
export class DataRoomExportService {
  /**
   * Genera y descarga un archivo Excel con el checklist completo de documentos
   * @param documents - Array de documentos a exportar
   * @param options - Opciones de traducción y configuración
   */
  static exportChecklist(
    documents: ExportDocument[],
    options: ExportOptions,
  ): void {
    const {
      translateSubcategory,
      translateCategory,
      translateType,
      translateStatus,
      fileName = "Checklist_DataRoom",
    } = options;

    // Construir datos para el Excel
    const data = documents.map((doc) => ({
      Categoría: translateCategory(doc.category),
      Subcategoría: translateSubcategory(doc.subcategory),
      Documento: doc.name,
      Tipo: translateType(doc.type),
      Estado: translateStatus(doc.status),
    }));

    // Crear Worksheet y Workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Checklist");

    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      { wch: 25 }, // Categoría
      { wch: 40 }, // Subcategoría
      { wch: 55 }, // Documento
      { wch: 15 }, // Tipo
      { wch: 15 }, // Estado
    ];

    // Descargar archivo
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  /**
   * Exporta solo los documentos obligatorios de una categoría específica
   * @param documents - Array completo de documentos
   * @param categoryId - ID de la categoría a filtrar
   * @param options - Opciones de traducción y configuración
   */
  static exportByCategoryMandatory(
    documents: ExportDocument[],
    categoryId: string,
    options: ExportOptions,
  ): void {
    const filtered = documents.filter(
      (doc) => doc.category === categoryId && doc.type === "mandatory",
    );
    this.exportChecklist(filtered, options);
  }
}
