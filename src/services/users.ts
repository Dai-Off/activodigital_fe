import { apiFetch } from './api';

export async function getUserProfile() {
  return apiFetch('/users/profile', { method: 'GET' });
}

export async function updateUserProfile(data: any) {
  return apiFetch('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getTechnicians() {
  return apiFetch('/users/technicians', { method: 'GET' });
}

export async function assignTechnician(payload: { buildingId: string; technicianEmail: string }) {
  return apiFetch('/users/assign-technician', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
