 
import { apiFetch } from './api';
import type { Building } from '../types/buildings';

export const buildingService = {
  // Obtener todos los edificios del usuario
  getAll: async (): Promise<Building[]> => {
    return apiFetch('/edificios', { method: 'GET' });
  },

  // Obtener todos los edificios del usuario
  getAllWithFinancialData: async (): Promise<Building[]> => {
    return apiFetch('/edificios', { method: 'GET' });
  },

  // Obtener edificio por ID
  getById: async (id: string): Promise<Building> => {
    return apiFetch(`/edificios/${id}`, { method: 'GET' });
  },

  // Crear edificio
  create: async (data: Partial<Building>): Promise<Building> => {
    return apiFetch('/edificios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar edificio
  update: async (id: string, updates: Partial<Building>): Promise<Building> => {
    return apiFetch(`/edificios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Eliminar edificio
  delete: async (id: string): Promise<void> => {
    return apiFetch(`/edificios/${id}`, { method: 'DELETE' });
  },
};

// El resto de servicios locales legacy han sido eliminados para usar solo la API REST.

