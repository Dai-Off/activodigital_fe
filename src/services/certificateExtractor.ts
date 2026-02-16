import { certificateExtractorFetch, apiFetch } from './api';
import type { EnergyCertificateReviewEditable, EnergyRatingLetter, EnergyCertificateKind } from '../types/buildings';

// Tipos de respuesta del certificate extractor
export interface CertificateExtractorResponse {
  normative: string;
  building_type: string;
  address: string;
  municipality: string;
  postal_code: string;
  autonomous_community: string;
  cadastral_reference: string;
  rating_letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  energy_consumption_kwh_m2y: number;
  co2_emissions_kg_m2y: number;
  registry_code: string;
  registry_date: string;
  valid_until: string;
  country_code: string;
  source_filename: string;
}

// Función para mapear respuesta de IA a nuestros tipos
export function mapAIResponseToReviewData(aiResponse: CertificateExtractorResponse): EnergyCertificateReviewEditable {
  return {
    rating: aiResponse.rating_letter as EnergyRatingLetter,
    primaryEnergyKwhPerM2Year: aiResponse.energy_consumption_kwh_m2y,
    emissionsKgCo2PerM2Year: aiResponse.co2_emissions_kg_m2y,
    certificateNumber: aiResponse.registry_code,
    scope: 'building' as EnergyCertificateKind, // Por defecto edificio, se puede ajustar después
    issuerName: aiResponse.normative || 'Técnico Certificador',
    issueDate: aiResponse.registry_date,
    expiryDate: aiResponse.valid_until,
    propertyReference: aiResponse.cadastral_reference,
    notes: `Extraído automáticamente de ${aiResponse.source_filename}. Dirección: ${aiResponse.address}, ${aiResponse.municipality} (${aiResponse.postal_code})`,
  };
}

// Función para extraer datos de certificado energético
export async function extractCertificateData(imageFile: File): Promise<CertificateExtractorResponse> {
  const formData = new FormData();
  // El backend espera el campo 'file'
  formData.append('file', imageFile, imageFile.name);

  try {
    const response = await certificateExtractorFetch('/extract', {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    }, 60000); // 60 segundos timeout para procesamiento de IA

    // El backend puede responder { success, data } o directamente el objeto
    if (response && typeof response === 'object' && 'success' in response) {
      if ((response as any).success && (response as any).data) {
        return (response as any).data as CertificateExtractorResponse;
      }
      const errMsg = (response as any).error || 'Extracción fallida';
      throw new Error(errMsg);
    }

    return response as CertificateExtractorResponse;
  } catch (error) {
    console.error('Error extracting certificate data:', error);
    throw new Error(`Error al procesar el certificado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// Función para verificar salud del servicio (extractor externo)
export async function checkCertificateExtractorHealth(): Promise<boolean> {
  try {
    await certificateExtractorFetch('/health', {
      method: 'GET',
    });
    return true;
  } catch (error) {
    console.warn('Certificate extractor service is not available:', error);
    return false;
  }
}

// ——— Procesamiento asíncrono vía backend (cola Redis) ———

/** Encola el procesamiento del certificado; la app no se bloquea y el usuario recibe notificación al terminar. */
export async function extractCertificateDataAsync(params: {
  image_url: string;
  document_filename: string;
  building_id: string;
  storage_path?: string;
  storage_file_name?: string;
  file_size?: number;
  mime_type?: string;
}): Promise<{ job_id: string }> {
  const response = await apiFetch('/ai/extract-certificate-async', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return { job_id: response.job_id };
}

export interface CertificateJobResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  image_url?: string;
  document_filename?: string;
  extracted_data?: CertificateExtractorResponse | null;
  error_message?: string | null;
  storage_path?: string;
  storage_file_name?: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
  updated_at: string;
}

/** Obtiene el estado y datos de un job de certificado (para abrir el modal de revisión). */
export async function getCertificateJob(jobId: string): Promise<CertificateJobResponse> {
  const response = await apiFetch(`/ai/certificate-job/${jobId}`, { method: 'GET' });
  return response as CertificateJobResponse;
}
