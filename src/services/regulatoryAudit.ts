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
      // apiFetch ya maneja el parseo de JSON y los errores HTTP (401, 404, etc.)
      return response as RegulatoryAuditResult;
    } catch (error) {
      console.error("Error in regulatoryAuditApi:", error);
      throw error;
    }
  },
};
