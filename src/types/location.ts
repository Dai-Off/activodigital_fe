// src/types/location.ts

// Dirección estructurada para edificios
export interface BuildingAddressData {
  fullAddress: string;
  province?: string;
  municipality?: string;
  streetType?: string;
  streetName?: string;
  number?: string;
  stair?: string;
  floor?: string;
  door?: string;
  postalCode?: string;
  country?: string;
  // Campo de escape para información adicional (códigos, ids, etc.)
  extra?: Record<string, any>;
}

// Valor que devuelve el selector de ubicación
export interface BuildingLocationValue extends BuildingAddressData {
  lat?: number;
  lng?: number;
}


