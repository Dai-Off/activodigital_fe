// src/services/documentProcessing.ts
// Servicio para procesar documentos con IA y crear/actualizar libros digitales

import { apiFetch } from './api';
import type { DigitalBook } from './digitalbook';

type ApiEnvelope<T> = { data: T };

/**
 * POST /documents/create-book
 * Crea un libro del edificio procesando un documento con IA
 */
export async function createBookFromDocument(
  buildingId: string,
  file: File
): Promise<DigitalBook> {
  const formData = new FormData();
  formData.append('buildingId', buildingId);
  formData.append('document', file);

  // Timeout mayor para procesamiento con IA (60 segundos)
  const resp = await apiFetch(
    `/documents/create-book`, 
    {
      method: 'POST',
      body: formData,
      // No establecer Content-Type - FormData lo hace automáticamente con boundary
    },
    60000 // 60 segundos de timeout
  );

  return (resp as ApiEnvelope<DigitalBook>)?.data;
}

/**
 * POST /documents/update-book/:id
 * Actualiza un libro del edificio existente procesando un documento con IA
 */
export async function updateBookFromDocument(
  bookId: string,
  file: File
): Promise<DigitalBook> {
  const formData = new FormData();
  formData.append('document', file);

  // Timeout mayor para procesamiento con IA (60 segundos)
  const resp = await apiFetch(
    `/documents/update-book/${bookId}`, 
    {
      method: 'POST',
      body: formData,
    },
    60000 // 60 segundos de timeout
  );

  return (resp as ApiEnvelope<DigitalBook>)?.data;
}

