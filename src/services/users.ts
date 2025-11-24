import { apiFetch } from './api';

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getUserProfile() {
  return apiFetch('/users/profile', { method: 'GET' });
}

export async function getRoles() {
  return apiFetch('/users/roles', { method: 'GET' });
}

export async function getAllUsers() {
  return apiFetch('/users/all-users', { method: 'GET' });
}

export async function editUser(id: string, data: any) {
  return apiFetch(`/users/edit/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: string) {
  return apiFetch(`/users/create${id}`, {
    method: 'DELETE',
  });
}

export async function createUser(data: any) {
  return apiFetch('/users/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
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

