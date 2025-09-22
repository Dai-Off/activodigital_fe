import { certificateExtractorFetch } from './api';
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

// Función para verificar salud del servicio
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
