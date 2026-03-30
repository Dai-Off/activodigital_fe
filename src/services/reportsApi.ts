import { apiFetch } from "./api";
import type { 
  Report, 
  ReportCategory, 
  GenerateReportPayload 
} from "../types/reports";

export class ReportsApiService {
  static async getReports(category?: string): Promise<Report[]> {
    const qs = (category && category !== 'all') ? `?category=${category}` : '';
    const response = await apiFetch(`/reports${qs}`, { method: "GET" });
    return Array.isArray(response) ? response : response.data || [];
  }

  static async getReportFields(): Promise<ReportCategory[]> {
    const response = await apiFetch("/reports/fields", { method: "GET" });
    return Array.isArray(response) ? response : response.data || [];
  }

  static async generateReport(payload: GenerateReportPayload): Promise<Report> {
    const response = await apiFetch("/reports", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return response.data || response;
  }

  static async deleteReport(id: string): Promise<void> {
    await apiFetch(`/reports/${id}`, { method: "DELETE" });
  }
}
