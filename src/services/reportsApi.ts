import { apiFetch } from "./api";

export interface Report {
  id: string;
  title: string;
  description?: string;
  category: string;
  format: "pdf" | "excel";
  status: "generating" | "completed" | "failed";
  file_url?: string;
  building_ids: string[];
  selected_fields: string[];
  created_at: string;
  created_by: string;
}

export interface ReportField {
  id: string;
  label: string;
  type: string;
  value?: any;
}

export interface ReportCategory {
  id: string;
  title: string;
  icon: string;
  fields: ReportField[];
}

export interface GenerateReportPayload {
  title: string;
  buildingIds: string[];
  selectedFields: string[];
  format: "pdf" | "excel";
  category?: string;
  config?: any;
}

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
