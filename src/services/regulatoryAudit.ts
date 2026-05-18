import { apiFetch } from "./api";
import { type RegulatoryAuditResult } from "../types/regulatoryAudit";

export const regulatoryAuditApi = {
  getRegulatoryAudit: async (
    buildingId: string,
  ): Promise<RegulatoryAuditResult> => {
    try {
      const response = await apiFetch(
        `/regulatory-audit/building/${buildingId}`,
        {
          method: "GET",
        },
      );
      // El backend ahora devuelve { data: result, message: '...' }
      return response.data as RegulatoryAuditResult;
    } catch (error) {
      console.error("Error in regulatoryAuditApi:", error);
      throw error;
    }
  },
};
