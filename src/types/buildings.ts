export interface Building {
  valuePerM2?: number;
  valuePerUnit?: number;
  annualVariation?: number;
  lastValuationDate?: string;
  id: string;
  name: string;
  address: string;
  cadastralReference?: string;
  constructionYear?: number;
  typology: 'residential' | 'mixed' | 'commercial';
  floors?: number;
  units?: number;
  numFloors?: number;
  numUnits?: number;
  lat?: number;
  lng?: number;
  images?: any[];
  status: 'draft' | 'ready_book' | 'with_book';
  price?: number;
  technicianEmail?: string;
  cfoEmail?: string;
  ownerId?: string;
  rehabilitationCost?: number;
  potentialValue?: number;
  squareMeters?: number;
  createdAt: string;
  updatedAt: string;
  mainPhotoId?: string;
}

export interface BuildingPhoto {
  id: string;
  buildingId: string;
  filename: string;
  url: string; // Para almacenamiento local, será data URL
  isMain: boolean;
  uploadedAt: Date;
}

export interface BuildingBook {
  id: string;
  buildingId: string;
  status: 'draft' | 'in_progress' | 'completed';
  progress: number; // 0-8 secciones completadas
  createdAt: Date;
  updatedAt: Date;
}

export interface BookSection {
  id: string;
  bookId: string;
  sectionType: 
    | 'general_data'           // Datos generales del edificio
    | 'construction_features'  // Características constructivas y técnicas
    | 'certificates'           // Certificados y licencias
    | 'maintenance'            // Mantenimiento y conservación
    | 'installations'          // Instalaciones y consumos
    | 'reforms'                // Reformas y rehabilitaciones
    | 'sustainability'         // Sostenibilidad y ESG
    | 'attachments';           // Documentos anexos
  
  content: Record<string, any>; // Contenido flexible por sección
  documents: BookDocument[];
  isCompleted: boolean;
  completedAt?: Date;
}

export interface BookDocument {
  id: string;
  filename: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

export interface BookUpload {
  id: string;
  bookId: string;
  filename: string;
  url: string;
  pageMapping: BookPageMapping[];
  uploadedAt: Date;
}

export interface BookPageMapping {
  sectionType: BookSection['sectionType'];
  pages: number[]; // Páginas del PDF asignadas a esta sección
}

// ==============================
// Certificados Energéticos (CEE)
// ==============================

export type EnergyCertificateKind =
  | 'building'
  | 'dwelling'
  | 'commercial_unit';

export type EnergyRatingLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'ND';

export interface EnergyCertificateDocument {
  id: string;
  buildingId: string;
  kind: EnergyCertificateKind;
  filename: string;
  url: string;
  mimeType: string;
  uploadedAt: Date;
}

export type AIExtractionStatus =
  | 'uploaded'      // Archivos subidos por el técnico
  | 'processing'    // IA procesando OCR/visión
  | 'extracted'     // IA extrajo datos, pendientes de revisión
  | 'reviewed'      // Técnico revisó/ajustó
  | 'confirmed'     // Técnico dio el check final para guardar
  | 'failed';       // Error en extracción

export interface ExtractedField<T> {
  value: T | null;
  confidence: number; // 0-1
  source?: string;    // página, bbox, modelo, etc.
  suggestions?: T[];  // alternativas propuestas por IA
}

export interface AIExtractedEnergyCertificateData {
  rating: ExtractedField<EnergyRatingLetter>;
  primaryEnergyKwhPerM2Year: ExtractedField<number>;   // kWh/m²·año
  emissionsKgCo2PerM2Year: ExtractedField<number>;     // kgCO₂/m²·año
  certificateNumber: ExtractedField<string>;
  scope: ExtractedField<EnergyCertificateKind>;        // ámbito evaluado
  issuerName: ExtractedField<string>;                  // técnico certificador
  issueDate: ExtractedField<string>;                   // ISO date string
  expiryDate: ExtractedField<string>;                  // ISO date string
  propertyReference: ExtractedField<string>;           // referencia catastral u otra
  notes?: ExtractedField<string>;
}

export interface EnergyCertificateReviewEditable {
  rating?: EnergyRatingLetter;
  primaryEnergyKwhPerM2Year?: number;
  emissionsKgCo2PerM2Year?: number;
  certificateNumber?: string;
  scope?: EnergyCertificateKind;
  issuerName?: string;
  issueDate?: string;  // ISO
  expiryDate?: string; // ISO
  propertyReference?: string;
  notes?: string;
}

export interface EnergyCertificateUploadSession {
  id: string;
  buildingId: string;
  kind: EnergyCertificateKind;
  status: AIExtractionStatus;
  documents: EnergyCertificateDocument[];
  extracted?: AIExtractedEnergyCertificateData; // rellenado cuando status = 'extracted'
  edited?: EnergyCertificateReviewEditable;      // modificaciones del técnico
  reviewerUserId?: string;                       // técnico que revisa
  createdAt: Date;
  updatedAt: Date;
  errorMessage?: string;
}

export interface PersistedEnergyCertificate {
  id: string;
  buildingId: string;
  kind: EnergyCertificateKind;
  rating: EnergyRatingLetter;
  primaryEnergyKwhPerM2Year: number;
  emissionsKgCo2PerM2Year: number;
  certificateNumber: string;
  scope: EnergyCertificateKind;
  issuerName: string;
  issueDate: string;  // ISO
  expiryDate: string; // ISO
  propertyReference?: string;
  notes?: string;
  sourceSessionId?: string; // de qué sesión de subida provino
  createdAt: Date;
  updatedAt: Date;
}

// Estados para los formularios de creación
export interface BuildingFormStep1 {
  name: string;
  address: string;
  constructionYear: string;
  typology: Building['typology'];
  floors: string;
  units: string;
  price: string;
  technicianEmail: string;
  cfoEmail: string;
  // Campos financieros
  rehabilitationCost: string; // Coste de rehabilitación
  potentialValue: string;     // Valor potencial
  squareMeters: string;       // Superficie en metros cuadrados
}

export interface BuildingFormStep2 {
  latitude: number;
  longitude: number;
  photos: File[];
  mainPhotoIndex: number;
}

// Utilidades para el progreso del libro
export const BOOK_SECTIONS: Array<{
  type: BookSection['sectionType'];
  title: string;
  description: string;
}> = [
  {
    type: 'general_data',
    title: 'Datos generales del edificio',
    description: 'Información básica y características principales'
  },
  {
    type: 'construction_features',
    title: 'Características constructivas y técnicas',
    description: 'Especificaciones técnicas de construcción'
  },
  {
    type: 'certificates',
    title: 'Certificados y licencias',
    description: 'Documentación legal y certificaciones'
  },
  {
    type: 'maintenance',
    title: 'Mantenimiento y conservación',
    description: 'Historial y planes de mantenimiento'
  },
  {
    type: 'installations',
    title: 'Instalaciones y consumos',
    description: 'Sistemas e instalaciones del edificio'
  },
  {
    type: 'reforms',
    title: 'Reformas y rehabilitaciones',
    description: 'Historial de modificaciones y mejoras'
  },
  {
    type: 'sustainability',
    title: 'Sostenibilidad y ESG',
    description: 'Criterios ambientales y sostenibilidad'
  },
  {
    type: 'attachments',
    title: 'Documentos anexos',
    description: 'Documentación adicional y anexos'
  }
];