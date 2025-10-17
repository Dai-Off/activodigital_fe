// src/services/esg.ts
// Servicio para obtener la calificación ESG de un edificio

import { apiFetch } from './api';

export interface ESGEnvironmental {
  ceePoints: number;
  consumptionPoints: number;
  emissionsPoints: number;
  renewablePoints: number;
  waterPoints: number;
  subtotalRaw: number;
  normalized: number;
}

export interface ESGSocial {
  accessibilityPoints: number;
  airQualityPoints: number;
  safetyPoints: number;
  subtotalRaw: number;
  normalized: number;
}

export interface ESGGovernance {
  digitalLogPoints: number;
  compliancePoints: number;
  subtotalRaw: number;
  normalized: number;
}

export interface ESGData {
  environmental: ESGEnvironmental;
  social: ESGSocial;
  governance: ESGGovernance;
  total: number;
  label: string;
  // Flag opcional del backend para indicar si el cálculo está completo
  complete?: boolean;
}

export interface ESGIncompleteResponse {
  status: 'incomplete';
  missingData: string[];
  message: string;
}

export interface ESGCompleteResponse {
  status: 'complete';
  data: ESGData;
}

export type ESGResponse = ESGCompleteResponse | ESGIncompleteResponse;

/**
 * Obtiene la calificación ESG guardada de un edificio
 * @param buildingId - ID del edificio
 * @returns La respuesta ESG del edificio
 */
export async function getESGScore(buildingId: string): Promise<ESGResponse> {
  try {
    const response = await apiFetch(`/esg/building/${buildingId}`, {
      method: 'GET',
    });
    
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Calcula y guarda el ESG de un edificio (solo para técnicos)
 * @param buildingId - ID del edificio
 * @returns La respuesta ESG calculada
 */
export async function calculateESGScore(buildingId: string): Promise<ESGResponse> {
  try {
    const response = await apiFetch('/esg/calculate', {
      method: 'POST',
      body: JSON.stringify({ building_id: buildingId }),
    });
    
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Mapea el label del ESG a un color de estrella
 */
export function getESGLabelColor(label: string): string {
  const labelLower = label.toLowerCase();
  
  if (labelLower.includes('premium')) {
    return '#00CED1'; // Celeste diamante (Dark Turquoise)
  }
  if (labelLower.includes('platinum') || labelLower.includes('platino') || labelLower.includes('excelente')) {
    return '#E5E4E2'; // Platino
  }
  if (labelLower.includes('gold') || labelLower.includes('oro') || labelLower.includes('avanzado')) {
    return '#D4AF37'; // Oro
  }
  if (labelLower.includes('silver') || labelLower.includes('plata') || labelLower.includes('intermedio')) {
    return '#C0C0C0'; // Plata
  }
  if (labelLower.includes('bronze') || labelLower.includes('bronce') || labelLower.includes('básico')) {
    return '#CD7F32'; // Bronce
  }
  // Crítico o cualquier otro label
  return '#9CA3AF'; // Gris
}

/**
 * Mapea una puntuación ESG numérica a un color de estrella
 */
export function getESGColorFromScore(score: number): string {
  if (score >= 90) {
    return '#00CED1'; // Celeste diamante (Premium)
  }
  if (score >= 75) {
    return '#E5E4E2'; // Platino
  }
  if (score >= 60) {
    return '#D4AF37'; // Oro
  }
  if (score >= 40) {
    return '#C0C0C0'; // Plata
  }
  if (score >= 20) {
    return '#CD7F32'; // Bronce
  }
  return '#9CA3AF'; // Gris (Crítico)
}

