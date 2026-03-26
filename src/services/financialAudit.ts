import { apiFetch } from "./api";
import type { FinancialAuditResponse } from "../types/financialAudit";

/**
 * Obtiene la auditoría financiera de un edificio por ID
 */
export async function getFinancialAudit(
  buildingId: string,
): Promise<FinancialAuditResponse> {
  return await apiFetch(`/edificios/${buildingId}/audits/financial`, {
    method: "GET",
  });
}
