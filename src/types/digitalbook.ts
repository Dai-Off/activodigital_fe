// Tipos para el Libro Digital

// Archivo de documento cargado en Supabase Storage
export interface DocumentFile {
  id: string;
  url: string; // Signed URL de Supabase Storage
  fileName: string;
  fileSize: number; // en bytes
  mimeType: string;
  title?: string;
  uploadedAt: string; // ISO date
  uploadedBy: string; // userId que subió el archivo
}

// Estado del libro digital
export const LibroDigitalEstado = {
  EN_BORRADOR: 'en_borrador',
  VALIDADO: 'validado',
  PUBLICADO: 'publicado'
} as const;

export type LibroDigitalEstado = typeof LibroDigitalEstado[keyof typeof LibroDigitalEstado];

// Tipos de secciones principales
export const LibroDigitalSectionType = {
  DATOS_GENERALES: 'datos_generales',
  AGENTES_INTERVINIENTES: 'agentes_intervinientes',
  PROYECTO_TECNICO: 'proyecto_tecnico',
  DOCUMENTACION_ADMINISTRATIVA: 'documentacion_administrativa',
  MANUAL_USO_MANTENIMIENTO: 'manual_uso_mantenimiento',
  REGISTRO_INCIDENCIAS_ACTUACIONES: 'registro_incidencias_actuaciones',
  CERTIFICADOS_GARANTIAS: 'certificados_garantias',
  ANEXOS_PLANOS: 'anexos_planos'
} as const;

export type LibroDigitalSectionType = typeof LibroDigitalSectionType[keyof typeof LibroDigitalSectionType];

// Sección: Proyecto Técnico
export interface ProyectoTecnico {
  proyectoEjecucion?: DocumentFile[]; // Proyecto de ejecución (PDFs, DWGs, etc.)
  modificacionesProyecto?: DocumentFile[]; // Modificaciones al proyecto
  memoriaObra?: DocumentFile[]; // Memoria descriptiva de la obra
  planos?: DocumentFile[]; // Planos técnicos
}

// Sección: Documentación Administrativa y Legal
export interface DocumentacionAdministrativa {
  licenciasObra?: DocumentFile[]; // Licencias de obra
  licenciaPrimeraOcupacion?: DocumentFile[]; // Licencia de primera ocupación
  autorizacionesAdministrativas?: DocumentFile[]; // Autorizaciones administrativas
  garantiasAgentes?: DocumentFile[]; // Garantías de agentes
  seguroDecenal?: DocumentFile[]; // Seguro decenal
}

// Sección: Manual de Uso y Mantenimiento
export interface ManualUsoMantenimiento {
  instruccionesUso?: DocumentFile[]; // Instrucciones de uso
  planMantenimientoPreventivo?: DocumentFile[]; // Plan de mantenimiento preventivo
  recomendacionesConservacion?: DocumentFile[]; // Recomendaciones de conservación
  documentacionInstalaciones?: DocumentFile[]; // Documentación de instalaciones (ascensores, calderas, etc.)
}

// Sección: Registro de Incidencias y Actuaciones
export interface RegistroObraRehabilitacionItem {
  fecha: string; // ISO date
  tipo: string;
  coste?: number;
  evidencia?: DocumentFile[]; // Evidencias documentales
}

export interface RegistroIncidenciasActuaciones {
  incidencias?: any[];
  obrasRehabilitacion?: RegistroObraRehabilitacionItem[];
  mantenimientos?: any[];
}

// Sección: Certificados y Garantías
export interface CertificadoEnergeticoItem {
  clase: string; // A-G
  consumo: number; // kWh/m²·año
  emisionesCO2: number; // kgCO₂eq/m²·año
  fechaEmision: string; // ISO
  fechaCaducidad?: string; // ISO
  archivo?: DocumentFile[]; // Archivos del certificado
}

export interface CertificadosGarantias {
  certificadosEnergeticos?: CertificadoEnergeticoItem[];
  certificadosInstalaciones?: DocumentFile[]; // Certificados de instalaciones
  garantiasMaterialesEquipos?: DocumentFile[]; // Garantías de materiales y equipos
}

// Sección: Anexos y Planos
export interface AnexosPlanos {
  planosAdjuntos?: DocumentFile[]; // Planos (PDF/DWG/etc.)
  otrosAnexos?: DocumentFile[]; // Otros anexos (DOC/XLS/etc.)
}

