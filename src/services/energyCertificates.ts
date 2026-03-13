import { apiFetch } from "./api";
import type {
  EnergyCertificateReviewEditable,
  EnergyCertificateKind,
  AIExtractedEnergyCertificateData,
} from "../types/buildings";

// Tipos para respuestas del backend
export interface EnergyCertificateSession {
  id: string;
  buildingId: string;
  kind: EnergyCertificateKind;
  status:
    | "uploaded"
    | "processing"
    | "extracted"
    | "reviewed"
    | "confirmed"
    | "failed";
  documents: string[];
  extractedData?: AIExtractedEnergyCertificateData;
  editedData?: EnergyCertificateReviewEditable;
  reviewerUserId?: string;
  errorMessage?: string;
  // Información de la imagen subida a Supabase Storage
  imageUrl?: string;
  imageFilename?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersistedEnergyCertificate {
  id: string;
  buildingId: string;
  kind: EnergyCertificateKind;
  rating: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "ND";
  primaryEnergyKwhPerM2Year: number;
  emissionsKgCo2PerM2Year: number;
  certificateNumber: string;
  scope: EnergyCertificateKind;
  issuerName: string;
  issueDate: string;
  expiryDate: string;
  propertyReference?: string;
  notes?: string;
  sourceDocumentUrl?: string;
  sourceSessionId?: string;
  // Información de la imagen almacenada en Supabase Storage
  imageUrl?: string;
  imageFilename?: string;
  imageUploadedAt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetEnergyCertificatesResponse {
  sessions: EnergyCertificateSession[];
  certificates: PersistedEnergyCertificate[];
}

export class EnergyCertificatesService {
  /**
   * Crear sesión simple de certificado energético (solo buildingId)
   * POST /certificados-energeticos/sessions/simple
   */
  static async createSimpleSession(
    buildingId: string,
  ): Promise<EnergyCertificateSession> {
    const response = await apiFetch(
      "/certificados-energeticos/sessions/simple",
      {
        method: "POST",
        body: JSON.stringify({ buildingId }),
      },
    );
    return response.data;
  }

  /**
   * Crear sesión con documentos (para uso futuro)
   * POST /certificados-energeticos/sessions
   */
  static async createSession(
    buildingId: string,
    kind: EnergyCertificateKind,
    documents: any[],
  ): Promise<EnergyCertificateSession> {
    const response = await apiFetch("/certificados-energeticos/sessions", {
      method: "POST",
      body: JSON.stringify({
        buildingId,
        kind,
        documents,
      }),
    });
    return response.data;
  }

  /**
   * Procesar certificado con datos de IA desde el frontend
   * POST /certificados-energeticos/process-ai-data
   */
  static async updateWithAIData(
    sessionId: string,
    extractedData: AIExtractedEnergyCertificateData,
  ): Promise<EnergyCertificateSession> {
    const response = await apiFetch(
      "/certificados-energeticos/process-ai-data",
      {
        method: "POST",
        body: JSON.stringify({ sessionId, extractedData }),
      },
    );
    return response.data;
  }

  /**
   * Confirmar certificado energético y guardarlo definitivamente
   * POST /certificados-energeticos/sessions/:sessionId/confirm
   */
  static async confirmCertificate(
    sessionId: string,
    finalData: EnergyCertificateReviewEditable,
  ): Promise<PersistedEnergyCertificate> {
    const response = await apiFetch(
      `/certificados-energeticos/sessions/${sessionId}/confirm`,
      {
        method: "POST",
        body: JSON.stringify(finalData),
      },
    );
    return response.data;
  }

  /**
   * Obtener sesiones y certificados de un edificio específico
   * GET /certificados-energeticos/building/:buildingId
   */
  static async getByBuilding(
    buildingId: string,
  ): Promise<GetEnergyCertificatesResponse> {
    const response = await apiFetch(
      `/certificados-energeticos/building/${buildingId}`,
    );
    return response.data;
  }

  /**
   * Obtener todos los certificados energéticos del usuario
   * GET /certificados-energeticos
   */
  static async getAll(): Promise<PersistedEnergyCertificate[]> {
    const response = await apiFetch("/certificados-energeticos");
    return response.data || [];
  }

  /**
   * Eliminar sesión de certificado energético
   * DELETE /certificados-energeticos/sessions/:sessionId
   */
  static async deleteSession(sessionId: string): Promise<void> {
    await apiFetch(`/certificados-energeticos/sessions/${sessionId}`, {
      method: "DELETE",
    });
  }

  /**
   * Actualizar certificado energético confirmado (edición inline)
   * PUT /certificados-energeticos/:certificateId
   */
  static async updateCertificate(
    certificateId: string,
    data: Partial<
      Pick<
        PersistedEnergyCertificate,
        | "rating"
        | "primaryEnergyKwhPerM2Year"
        | "emissionsKgCo2PerM2Year"
        | "issueDate"
        | "expiryDate"
        | "certificateNumber"
        | "issuerName"
        | "notes"
      >
    >,
  ): Promise<PersistedEnergyCertificate> {
    // Convertir camelCase a snake_case para la DB
    const dbPayload: Record<string, any> = {};
    if (data.rating !== undefined) dbPayload.rating = data.rating;
    if (data.primaryEnergyKwhPerM2Year !== undefined)
      dbPayload.primary_energy_kwh_per_m2_year = data.primaryEnergyKwhPerM2Year;
    if (data.emissionsKgCo2PerM2Year !== undefined)
      dbPayload.emissions_kg_co2_per_m2_year = data.emissionsKgCo2PerM2Year;
    if (data.issueDate !== undefined) dbPayload.issue_date = data.issueDate;
    if (data.expiryDate !== undefined) dbPayload.expiry_date = data.expiryDate;
    if (data.certificateNumber !== undefined)
      dbPayload.certificate_number = data.certificateNumber;
    if (data.issuerName !== undefined) dbPayload.issuer_name = data.issuerName;
    if (data.notes !== undefined) dbPayload.notes = data.notes;

    const response = await apiFetch(
      `/certificados-energeticos/${certificateId}`,
      {
        method: "PUT",
        body: JSON.stringify(dbPayload),
      },
    );
    return response.data;
  }

  /**
   * Eliminar certificado energético confirmado
   * DELETE /certificados-energeticos/:certificateId
   */
  static async deleteCertificate(certificateId: string): Promise<void> {
    await apiFetch(`/certificados-energeticos/${certificateId}`, {
      method: "DELETE",
    });
  }

  /**
   * Obtener documentos de una sesión específica
   * GET /certificados-energeticos/sessions/:sessionId/documents
   */
  static async getSessionDocuments(sessionId: string): Promise<any[]> {
    const response = await apiFetch(
      `/certificados-energeticos/sessions/${sessionId}/documents`,
    );
    return response.data;
  }
}
