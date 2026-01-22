// src/services/unitsApi.ts
// Servicio centralizado para gestionar unidades de edificios (CRUD).

import { apiFetch } from "./api";

export interface BuildingUnit {
  id: string;
  buildingId: string;
  name: string | null;
  identifier?: string | null;
  floor?: string | null;
  areaM2?: number | null;
  useType?: string | null;
  status?: string | null;
  rent?: number | null;
  tenant?: string | null;
  rooms?: number | null;
  baths?: number | null;
  rawData?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBuildingUnitRequest {
  id?: string;
  name: string | null;
  identifier?: string | null;
  floor?: string | null;
  areaM2?: number | null;
  useType?: string | null;
  status?: string | null;
  rent?: number | null;
  tenant?: string | null;
  rooms?: number | null;
  baths?: number | null;
  rawData?: any;
}

export class UnitsApiService {
  static async listUnits(buildingId: string) {
    const response = await apiFetch(`/edificios/${buildingId}/units`, {
      method: "GET",
    });
    return response?.data as BuildingUnit[] | undefined;
  }

  static async upsertUnits(buildingId: string, units: CreateBuildingUnitRequest[]) {
    console.log('📤 [UnitsApiService] Enviando unidades al backend:', {
      buildingId,
      unitsCount: units.length,
      units: units.map(u => ({ name: u.name, identifier: u.identifier, floor: u.floor, areaM2: u.areaM2 }))
    });
    
    const body = { units };
    console.log('📤 [UnitsApiService] Body completo:', JSON.stringify(body, null, 2));
    
    const response = await apiFetch(`/edificios/${buildingId}/units`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    
    console.log('✅ [UnitsApiService] Respuesta recibida:', {
      dataLength: response?.data?.length,
      data: response?.data
    });
    
    return response?.data as BuildingUnit[] | undefined;
  }

  static async importFromCatastro(buildingId: string, rc: string) {
    const response = await apiFetch(`/edificios/${buildingId}/units/from-catastro`, {
      method: "POST",
      body: JSON.stringify({ rc }),
    });
    return response?.data as BuildingUnit[] | undefined;
  }

  static async deleteUnit(buildingId: string, unitId: string) {
    await apiFetch(`/edificios/${buildingId}/units/${unitId}`, {
      method: "DELETE",
    });
  }
}


