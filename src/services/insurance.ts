import { apiFetch } from "./api";
// Asumo que tienes los tipos definidos en una ruta similar,
// si no, puedes definirlos aquí mismo o ajustar la importación.
import type { InsurancePolicy, InsuranceFilters } from "../types/insurance";

export interface InsuranceListResponse {
  data: InsurancePolicy[];
  count: number;
}

export interface CreateInsurancePayload {
  buildingId: string;
  policyNumber: string;
  status: string;
  coverageType: string;
  insurer: string;
  issueDate: string;
  expirationDate: string;
  annualPremium: number;
  coverageDetails: any; // O la interfaz detallada de coberturas
  documentUrl?: string;
  [key: string]: any;
}

export interface UpdateInsurancePayload
  extends Partial<CreateInsurancePayload> {}

export class InsuranceApiService {
  /** 1. GET /insurances: Obtiene la lista de seguros de un edificio con filtros. */
  async getBuildingInsurances(
    buildingId: string,
    filters: InsuranceFilters = {}
  ): Promise<InsuranceListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("buildingId", buildingId);

    if (filters.status) {
      queryParams.append("status", filters.status);
    }
    if (filters.limit) {
      queryParams.append("limit", filters.limit.toString());
    }
    if (filters.offset) {
      queryParams.append("offset", filters.offset.toString());
    }

    // Nota: Asumo que la ruta base en tu backend para este módulo es /insurances
    const response = await apiFetch(`/insurances?${queryParams.toString()}`, {
      method: "GET",
    });

    return response;
  }

  /** 2. GET /insurances/:id: Obtiene el detalle de un seguro específico. */
  async getInsuranceById(insuranceId: string): Promise<InsurancePolicy | null> {
    try {
      const response = await apiFetch(`/insurances/${insuranceId}`, {
        method: "GET",
      });
      return response.data || response;
    } catch (error) {
      console.error("Error al obtener detalle del seguro:", error);
      return null;
    }
  }

  /** 3. POST /insurances: Crea una nueva póliza de seguro. */
  async createInsurance(payload: CreateInsurancePayload): Promise<boolean> {
    try {
      const response = await apiFetch(`/insurances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return !!response;
    } catch (error) {
      console.error("Error al crear seguro:", error);
      return false;
    }
  }

  /** 4. PUT /insurances/:id: Actualiza una póliza existente. */
  async updateInsurance(
    insuranceId: string,
    payload: UpdateInsurancePayload
  ): Promise<boolean> {
    try {
      const response = await apiFetch(`/insurances/${insuranceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return !!response; // O response.success si tu backend lo devuelve así
    } catch (error) {
      console.error("Error al actualizar seguro:", error);
      return false;
    }
  }

  /** 5. DELETE /insurances/:id: Elimina una póliza. */
  async deleteInsurance(insuranceId: string): Promise<boolean> {
    try {
      const response = await apiFetch(`/insurances/${insuranceId}`, {
        method: "DELETE",
      });
      return response.success || true;
    } catch (error) {
      console.error("Error al eliminar seguro:", error);
      return false;
    }
  }
}

export const insuranceApiService = new InsuranceApiService();
