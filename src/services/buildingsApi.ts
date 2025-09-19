import { apiFetch } from './api';

// Interfaces para edificios (backend API)
export interface Building {
  id: string;
  name: string;
  address: string;
  cadastralReference?: string;
  constructionYear?: number;
  typology: 'residential' | 'mixed' | 'commercial';
  numFloors?: number;
  numUnits?: number;
  lat?: number;
  lng?: number;
  images: BuildingImage[];
  status: 'draft' | 'ready_book' | 'with_book';
  price?: number;
  technicianEmail?: string;
  ownerId: string;
  // Campos financieros
  rehabilitationCost?: number; // Coste de rehabilitación (por defecto 0)
  potentialValue?: number;     // Valor potencial (por defecto 0)
  createdAt: string;
  updatedAt: string;
}

export interface BuildingImage {
  id: string;
  url: string;
  title: string;
  isMain: boolean;
}

export interface CreateBuildingPayload {
  name: string;
  address: string;
  cadastralReference?: string;
  constructionYear?: number;
  typology: 'residential' | 'mixed' | 'commercial';
  numFloors?: number;
  numUnits?: number;
  lat?: number;
  lng?: number;
  images?: BuildingImage[];
  price?: number;
  technicianEmail?: string;
  // Campos financieros
  rehabilitationCost?: number; // Coste de rehabilitación (por defecto 0)
  potentialValue?: number;     // Valor potencial (por defecto 0)
}

export interface UpdateBuildingPayload extends Partial<CreateBuildingPayload> {}

export interface TechnicianAssignmentPayload {
  buildingId: string;
  technicianEmail: string;
}

export interface Technician {
  id: string;
  email: string;
  fullName: string;
  role: {
    name: string;
  };
}

// Respuesta de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Servicios de edificios conectados al backend
export class BuildingsApiService {
  
  // Obtener todos los edificios del usuario (filtrado por rol en backend)
  static async getAllBuildings(): Promise<Building[]> {
    const response = await apiFetch('/edificios', { method: 'GET' });
    // La API puede devolver directamente el array o wrapped en { data: [...] }
    return Array.isArray(response) ? response : response.data || [];
  }

  // Obtener un edificio específico
  static async getBuildingById(id: string): Promise<Building> {
    const response = await apiFetch(`/edificios/${id}`, { method: 'GET' });
    return response.data || response;
  }

  // Crear un nuevo edificio (solo TENEDORES)
  static async createBuilding(payload: CreateBuildingPayload): Promise<Building> {
    const response = await apiFetch('/edificios', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data || response;
  }

  // Actualizar un edificio existente
  static async updateBuilding(id: string, payload: UpdateBuildingPayload): Promise<Building> {
    const response = await apiFetch(`/edificios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response.data || response;
  }

  // Obtener lista de técnicos disponibles (solo TENEDORES)
  static async getTechnicians(): Promise<Technician[]> {
    const response = await apiFetch('/users/technicians', { method: 'GET' });
    return Array.isArray(response) ? response : response.data || [];
  }

  // Asignar técnico a un edificio (solo TENEDORES)
  static async assignTechnician(payload: TechnicianAssignmentPayload): Promise<void> {
    await apiFetch('/users/assign-technician', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

// Funciones de utilidad
export const formatBuildingValue = (price?: number): string => {
  const value = price || 0;
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatear coste de rehabilitación
export const formatRehabilitationCost = (cost?: number): string => {
  const value = cost || 0;
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatear valor potencial
export const formatPotentialValue = (value?: number): string => {
  const val = value || 0;
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

export const getBuildingStatusLabel = (status: Building['status']): string => {
  switch (status) {
    case 'draft':
      return 'Pendiente libro digital';
    case 'ready_book':
      return 'Listo para libro';
    case 'with_book':
      return 'Con libro digital';
    default:
      return status;
  }
};

export const getBuildingTypologyLabel = (typology: Building['typology']): string => {
  switch (typology) {
    case 'residential':
      return 'Residencial';
    case 'mixed':
      return 'Mixto';
    case 'commercial':
      return 'Comercial';
    default:
      return typology;
  }
};

export const getBuildingStatusColor = (status: Building['status']): string => {
  switch (status) {
    case 'draft':
      return 'text-orange-600 bg-orange-100';
    case 'ready_book':
      return 'text-blue-600 bg-blue-100';
    case 'with_book':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};
