export interface Building {
  id: string;
  name: string;
  address: string;
  cadastralReference?: string;
  constructionYear: number;
  typology: 'residential' | 'mixed' | 'commercial';
  numFloors: number;
  numUnits: number;
  price: number;
  technicianEmail: string;
  lat?: number;
  lng?: number;
  status: 'draft' | 'ready_book' | 'with_book';
  createdAt: string;
  updatedAt: string;
  images?: BuildingPhoto[];
  ownerId?: string;
  userId?: string;
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

// Estados para los formularios de creación
export interface BuildingFormStep1 {
  name: string;
  address: string;
  constructionYear: string;
  typology: Building['typology'];
  floors: string;
  units: string;
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