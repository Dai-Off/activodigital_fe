import { apiFetch } from './api';

export async function createDigitalBook(payload: { buildingId: string; source: 'manual' | 'pdf' }) {
  return apiFetch('/libros-digitales', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getDigitalBooks() {
  return apiFetch('/libros-digitales', { method: 'GET' });
}

export async function getDigitalBookById(id: string) {
  return apiFetch(`/libros-digitales/${id}`, { method: 'GET' });
}

export async function updateDigitalBook(id: string, data: any) {
  return apiFetch(`/libros-digitales/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getBookByBuilding(buildingId: string) {
  return apiFetch(`/libros-digitales/building/${buildingId}`, { method: 'GET' });
}

export async function updateBookSection(bookId: string, sectionType: string, data: any) {
  return apiFetch(`/libros-digitales/${bookId}/sections/${sectionType}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
