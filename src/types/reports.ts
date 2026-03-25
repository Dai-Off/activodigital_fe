export type ReportStatus = "pending" | "generating" | "completed" | "failed";
export type ReportFormat = "pdf" | "excel";

export interface Report {
  id: string;
  title: string;
  description?: string;
  category: string;
  format: ReportFormat;
  status: ReportStatus;
  file_url?: string;
  file_size?: number;
  building_ids: string[];
  selected_fields: string[];
  config?: any;
  error_message?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
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
  format: ReportFormat;
  category?: string;
  config?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoBase64?: string;
    [key: string]: any;
  };
}
