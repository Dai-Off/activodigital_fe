import { apiFetch } from "./api";
import type { TechnicalAuditResponse } from "../types/technicalAudit";

/**
 * Obtiene la auditoría técnica de un edificio por ID
 */
export async function getTechnicalAudit(
  buildingId: string,
): Promise<TechnicalAuditResponse> {
  return await apiFetch(`/edificios/${buildingId}/audits/technical`, {
    method: "GET",
  });
}
