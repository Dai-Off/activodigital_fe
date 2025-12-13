// types/insurance.ts

/**
 * Define la estructura de un ítem individual de cobertura.
 * Ej: El detalle de "Incendio" o "Responsabilidad Civil".
 */
export interface CoverageItem {
  covered: boolean;
  amount: number;
  deductible?: number; // Opcional, por si alguna no tiene deducible
}

/**
 * Estructura del objeto JSON almacenado en la base de datos.
 * Puedes extender las claves según lo que necesites (fire, theft, etc.)
 */
export interface InsuranceCoverageDetails {
  fire?: CoverageItem;
  earthquake?: CoverageItem;
  theft?: CoverageItem;
  civil_liability?: CoverageItem;
  water_damage?: CoverageItem;
  glass_breakage?: CoverageItem;
  // Index signature para permitir tipos de cobertura personalizados extra
  [key: string]: CoverageItem | undefined;
}

/**
 * Tipos de estado posibles para una póliza
 */
export type InsuranceStatus = "active" | "expired" | "canceled" | "pending";

/**
 * Entidad principal: Póliza de Seguro
 * (Formato CamelCase para uso en el Frontend)
 */
export interface InsurancePolicy {
  id: string;
  buildingId: string;
  policyNumber: string;
  status: InsuranceStatus;
  coverageType: string; // Ej: 'all_risk', 'basic'
  insurer: string;
  issueDate: string; // ISO Date string
  expirationDate: string; // ISO Date string
  annualPremium: number;
  coverageDetails: InsuranceCoverageDetails;
  documentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Filtros para el listado de seguros
 */
export interface InsuranceFilters {
  status?: string;
  limit?: number;
  offset?: number;
}
