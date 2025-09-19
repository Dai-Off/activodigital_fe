
import { apiFetch } from './api';
import type { Building } from '../types/buildings';

export const buildingService = {
  // Obtener todos los edificios del usuario
  getAll: async (): Promise<Building[]> => {
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

  // Eliminar edificio (si el backend lo permite)
  delete: async (id: string): Promise<void> => {
    // Si hay endpoint DELETE, usarlo. Si no, omitir.
    // return apiFetch(`/edificios/${id}`, { method: 'DELETE' });
    throw new Error('No implementado en backend');
  },
};

// El resto de servicios locales legacy han sido eliminados para usar solo la API REST.

