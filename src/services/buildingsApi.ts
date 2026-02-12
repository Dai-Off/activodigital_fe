import { apiFetch } from "./api";
import type { BuildingAddressData } from "../types/location";

// Interfaces para edificios (backend API)
export interface Building {
  id: string;
  name: string;
  address: string;
  addressData?: BuildingAddressData;
  cadastralReference?: string;
  constructionYear?: number;
  typology: "residential" | "mixed" | "commercial";
  numFloors?: number;
  numUnits?: number;
  lat?: number;
  lng?: number;
  images: BuildingImage[];
  status: "draft" | "ready_book" | "with_book";
  price?: number;
  technicianEmail?: string;
  cfoEmail?: string;
  propietarioEmail?: string;
  ownerId: string;
  // Campos financieros
  rehabilitationCost?: number; // Coste de rehabilitación (por defecto 0)
  potentialValue?: number; // Valor potencial (por defecto 0)
  squareMeters?: number; // Superficie en metros cuadrados
  createdAt: string;
  updatedAt: string;
  porcentBook?: number;
}

export interface BuildingImage {
  id: string;
  url: string;
  title: string;
  filename: string;
  isMain: boolean;
  uploadedAt: string;
}

export interface CreateBuildingPayload {
  name: string;
  // Dirección en texto plano (string legible).
  // Se mantiene por compatibilidad y para usos de UI rápidos.
  address: string;
  addressData?: BuildingAddressData;
  cadastralReference?: string;
  constructionYear?: number;
  typology: "residential" | "mixed" | "commercial";
  numFloors?: number;
  numUnits?: number;
  lat?: number;
  lng?: number;
  images?: BuildingImage[];
  price?: number;
  technicianEmail?: string;
  cfoEmail?: string;
  propietarioEmail?: string;
  // Campos financieros
  rehabilitationCost?: number; // Coste de rehabilitación (por defecto 0)
  potentialValue?: number; // Valor potencial (por defecto 0)
  squareMeters?: number; // Superficie en metros cuadrados
}

export interface UpdateBuildingPayload extends Partial<CreateBuildingPayload> { }

export interface TechnicianAssignmentPayload {
  buildingId: string;
  technicianEmail: string;
}

// Tipos para validación de asignaciones
export interface ValidationResult {
  isValid: boolean;
  errors: {
    technician?: string;
    cfo?: string;
    propietario?: string;
  };
}

export interface ValidateAssignmentsResponse {
  technicianValidation: ValidationResult;
  cfoValidation: ValidationResult;
  propietarioValidation?: ValidationResult;
  overallValid: boolean;
}

export interface ValidateAssignmentsRequest {
  technicianEmail?: string;
  cfoEmail?: string;
  propietarioEmail?: string;
}

export interface Technician {
  id: string;
  email: string;
  fullName: string;
  role: {
    name: string;
  };
}

// Estadísticas del dashboard
export interface DashboardStats {
  // Métricas financieras
  totalValue: number;
  totalAssets: number;
  totalRehabilitationCost: number;
  totalPotentialValue: number;

  // Métricas ambientales y energéticas
  totalSurfaceArea: number;
  totalEmissions: number;
  averageEnergyClass: string | null;
  averageEnergyRating: number | null;

  // Métricas de completitud
  completedBooks: number;
  pendingBooks: number;
  draftBooks: number;
  completionPercentage: number;

  // Financiación verde
  greenFinancingEligiblePercentage: number;
  greenFinancingEligibleCount: number;

  // Promedios
  averageUnitsPerBuilding: number;
  averageBuildingAge: number;
  averageFloorsPerBuilding: number;
  complianceAverage: number;

  // Tipología
  mostCommonTypology: string | null;
  typologyDistribution: {
    residential: number;
    mixed: number;
    commercial: number;
  };

  // ESG
  averageESGScore: number | null;

  // Nuevas métricas
  averageOccupancy: number | null;
  nextEventsCount: number;
  topPerformingBuildings: {
    id: string;
    name: string;
    type: string;
    percentage: number;
  }[];

  // Métricas de crecimiento
  assetsGrowth: number;
  complianceGrowth: number;
  alertsGrowth: number;
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
    const response = await apiFetch("/edificios", { method: "GET" });
    // La API puede devolver directamente el array o wrapped en { data: [...] }
    const buildings = Array.isArray(response) ? response : response.data || [];
    console.log(`[BuildingsApiService.getAllBuildings] Respuesta del backend:`, {
      isArray: Array.isArray(response),
      hasData: !!response.data,
      buildingsCount: buildings.length,
      buildings: buildings.map((b: Building) => ({ id: b.id, name: b.name, owner_id: b.ownerId }))
    });
    return buildings;
  }

  // Obtener un edificio específico
  static async getBuildingById(id: string): Promise<Building> {
    const response = await apiFetch(`/edificios/${id}`, { method: "GET" });
    return response.data || response;
  }

  // Crear un nuevo edificio (solo PROPIETARIOS)
  static async createBuilding(
    payload: CreateBuildingPayload
  ): Promise<Building> {
    const response = await apiFetch("/edificios", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.data || response;
  }

  // Subir imágenes para un edificio
  static async uploadBuildingImages(
    buildingId: string,
    images: BuildingImage[]
  ): Promise<BuildingImage[]> {
    const response = await apiFetch(`/edificios/${buildingId}/images`, {
      method: "POST",
      body: JSON.stringify({ images }),
    });
    return response.data || response;
  }

  // Eliminar una imagen de un edificio
  static async deleteBuildingImage(
    buildingId: string,
    imageId: string
  ): Promise<void> {
    await apiFetch(`/edificios/${buildingId}/images/${imageId}`, {
      method: "DELETE",
    });
  }

  // Actualizar un edificio existente
  static async updateBuilding(
    id: string,
    payload: UpdateBuildingPayload
  ): Promise<Building> {
    const response = await apiFetch(`/edificios/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return response.data || response;
  }

  // Obtener lista de técnicos disponibles (solo PROPIETARIOS)
  static async getTechnicians(): Promise<Technician[]> {
    const response = await apiFetch("/users/technicians", { method: "GET" });
    return Array.isArray(response) ? response : response.data || [];
  }

  // Asignar técnico a un edificio (solo PROPIETARIOS)
  static async assignTechnician(
    payload: TechnicianAssignmentPayload
  ): Promise<void> {
    await apiFetch("/users/assign-technician", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Obtener estadísticas del dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiFetch("/dashboard/stats", { method: "GET" });
    return response.data || response;
  }

  // Validar asignaciones de técnico y CFO antes de crear edificio
  static async validateUserAssignments(
    payload: ValidateAssignmentsRequest
  ): Promise<ValidateAssignmentsResponse> {
    const response = await apiFetch("/edificios/validate-assignments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.data || response;
  }
}

// Funciones de utilidad
export const formatBuildingValue = (price?: number): string => {
  const value = price || 0;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatear coste de rehabilitación
export const formatRehabilitationCost = (cost?: number): string => {
  const value = cost || 0;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatear valor potencial
export const formatPotentialValue = (value?: number): string => {
  const val = value || 0;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

export const getBuildingStatusLabel = (status: Building["status"]): string => {
  switch (status) {
    case "draft":
      return "Pendiente";
    case "ready_book":
      return "Listo para libro";
    case "with_book":
      return "Con libro del edificio";
    default:
      return status;
  }
};

export const getBuildingTypologyLabel = (
  typology: Building["typology"]
): string => {
  switch (typology) {
    case "residential":
      return "Residencial";
    case "mixed":
      return "Mixto";
    case "commercial":
      return "Comercial";
    default:
      return typology;
  }
};

export const getBuildingStatusColor = (status: Building["status"]): string => {
  switch (status) {
    case "draft":
      return "text-orange-600 bg-orange-100";
    case "ready_book":
      return "text-blue-600 bg-blue-100";
    case "with_book":
      return "text-green-600 bg-green-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};
