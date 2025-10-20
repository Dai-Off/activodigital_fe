// src/services/digitalbook.ts

import { apiFetch } from './api';

/**
 * Mapeo de IDs de sección (UI) → tipos de API.
 * Mantener sincronizado con el backend:
 *  general_data | construction_features | certificates_and_licenses
 *  | maintenance_and_conservation | facilities_and_consumption
 *  | renovations_and_rehabilitations | sustainability_and_esg | annex_documents
 */
export const sectionIdToApiType: Record<string, string> = {
  // UI → API
  general_data: 'general_data',
  construction_features: 'construction_features',
  certificates: 'certificates_and_licenses',
  maintenance: 'maintenance_and_conservation',
  installations: 'facilities_and_consumption',
  reforms: 'renovations_and_rehabilitations',
  sustainability: 'sustainability_and_esg',
  attachments: 'annex_documents',
};

// Conjunto de tipos válidos de la API (detección directa)
const API_TYPES = new Set([
  'general_data',
  'construction_features',
  'certificates_and_licenses',
  'maintenance_and_conservation',
  'facilities_and_consumption',
  'renovations_and_rehabilitations',
  'sustainability_and_esg',
  'annex_documents',
]);

// ===== Tipos =====

export type DigitalBookSection = {
  id: string; // UUID interno de tu backend
  type:
    | 'general_data'
    | 'construction_features'
    | 'certificates_and_licenses'
    | 'maintenance_and_conservation'
    | 'facilities_and_consumption'
    | 'renovations_and_rehabilitations'
    | 'sustainability_and_esg'
    | 'annex_documents';
  complete: boolean;
  content: Record<string, any>;
};

export type DigitalBook = {
  id: string;
  buildingId: string;
  source: 'manual' | 'pdf';
  status: 'draft' | 'in_progress' | 'complete';
  progress: number; // 0-8
  sections: DigitalBookSection[];
  createdAt: string;
  updatedAt: string;
};

type ApiEnvelope<T> = { data: T };

// =====================================

/** Anti-cache param */
const nocache = () => `t=${Date.now()}`;

/**
 * GET /libros-digitales/building/:buildingId
 * - Usa apiFetch (adjunta Authorization)
 * - Fuerza no-store + query anti-cache
 * - Devuelve `DigitalBook | null`
 * - 404 se trata como "libro no existe" (null), NO como error
 */
export async function getBookByBuilding(buildingId: string): Promise<DigitalBook | null> {
  try {
    const resp = await apiFetch(
      `/libros-digitales/building/${buildingId}?${nocache()}`,
      { method: 'GET', cache: 'no-store' }
    );
    return (resp as ApiEnvelope<DigitalBook | null>)?.data ?? null;
  } catch (error: any) {
    // 404 = libro no existe (caso normal, no es error)
    if (error?.status === 404 || error?.message?.includes('no encontrado')) {
      return null;
    }
    // Otros errores sí se propagan
    throw error;
  }
}

/**
 * POST /libros-digitales
 * Body: { buildingId, source: 'manual' | 'pdf' }
 * - Devuelve el libro creado (DigitalBook)
 */
export async function createDigitalBook(params: {
  buildingId: string;
  source: 'manual' | 'pdf';
}): Promise<DigitalBook> {
  const resp = await apiFetch(`/libros-digitales`, {
    method: 'POST',
    cache: 'no-store',
    body: JSON.stringify(params),
  });
  return (resp as ApiEnvelope<DigitalBook>)?.data;
}

/** Detecta si es UUID (v4 típico) */
const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

/**
 * Resuelve el tipo de sección de API a partir de:
 * - clave UI (p.ej. 'certificates') → mapeo
 * - tipo API directo (p.ej. 'certificates_and_licenses')
 * - UUID de sección, si se provee `book` → busca en `book.sections`
 */
function resolveApiType(
  sectionKeyOrId: string,
  book?: Pick<DigitalBook, 'sections'>
): string {
  // 1) Si es clave UI conocida
  if (sectionIdToApiType[sectionKeyOrId]) return sectionIdToApiType[sectionKeyOrId];

  // 2) Si ya es un tipo API válido
  if (API_TYPES.has(sectionKeyOrId)) return sectionKeyOrId;

  // 3) Si parece UUID y tenemos el libro, buscar la sección por id
  if (isUUID(sectionKeyOrId) && book?.sections?.length) {
    const found = book.sections.find((s) => s.id === sectionKeyOrId);
    if (found?.type && API_TYPES.has(found.type)) return found.type;
  }

  // 4) Error claro
  throw new Error(
    `Section mapping no encontrado para "${sectionKeyOrId}". ` +
      `Pasa una clave UI válida (${Object.keys(sectionIdToApiType).join(', ')}), ` +
      `un tipo API (${[...API_TYPES].join(', ')}) ` +
      `o un UUID junto con el objeto 'book' que incluya sections.`
  );
}

/**
 * PUT /libros-digitales/:bookId/sections/:sectionType
 * Body: { content, complete }
 *
 * Firma flexible:
 * - (bookId: string, sectionKeyOrId: string, content, complete?)
 * - (book: Pick<DigitalBook,'id'|'sections'>, sectionKeyOrId: string, content, complete?)
 *
 * Donde `sectionKeyOrId` puede ser:
 *  - clave UI (ej. 'certificates')
 *  - tipo API (ej. 'certificates_and_licenses')
 *  - UUID de sección (si además pasas `book` para resolver)
 */
export async function updateBookSection(
  bookOrId: string | Pick<DigitalBook, 'id' | 'sections'>,
  sectionKeyOrId: string,
  content: Record<string, any>,
  complete = false
): Promise<DigitalBook> {
  const bookId = typeof bookOrId === 'string' ? bookOrId : bookOrId.id;
  const bookForResolve = typeof bookOrId === 'string' ? undefined : bookOrId;

  const apiType = resolveApiType(sectionKeyOrId, bookForResolve);

  const resp = await apiFetch(`/libros-digitales/${bookId}/sections/${apiType}`, {
    method: 'PUT',
    cache: 'no-store',
    body: JSON.stringify({ content, complete }),
  });

  return (resp as ApiEnvelope<DigitalBook>)?.data;
}

/**
 * Helper: GET-or-CREATE robusto.
 * - Intenta obtener el libro por buildingId.
 * - Si no existe → crea y devuelve.
 * - Si el backend responde "ya existe", se hace un GET final.
 */
export async function getOrCreateBookForBuilding(buildingId: string): Promise<DigitalBook> {
  try {
    const existing = await getBookByBuilding(buildingId);
    if (existing && existing.id) return existing;
  } catch {
    // Intentaremos crear
  }

  try {
    const created = await createDigitalBook({ buildingId, source: 'manual' });
    return created;
  } catch (err: any) {
    const msg = String(err?.message ?? '');
    if (/ya tiene un libro digital/i.test(msg) || /ya existe/i.test(msg)) {
      const again = await getBookByBuilding(buildingId);
      if (again && again.id) return again;
    }
    throw err;
  }
}

/** Helper: devolver solo el ID del libro (creándolo si hace falta) */
export async function getBookIdOrThrow(buildingId: string): Promise<string> {
  const book = await getOrCreateBookForBuilding(buildingId);
  if (!book?.id) throw new Error('No se pudo obtener/crear el libro digital.');
  return book.id;
}

/**
 * POST /libros-digitales/upload-ai
 * Procesa un PDF con IA y crea/actualiza el libro digital automáticamente
 */
export async function processPDFWithAI(
  buildingId: string,
  file: File
): Promise<{
  data: DigitalBook;
  message: string;
  metadata: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    extractedTextLength: number;
    sectionsGenerated: number;
  };
}> {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('buildingId', buildingId);

  const resp = await apiFetch('/libros-digitales/upload-ai', {
    method: 'POST',
    cache: 'no-store',
    body: formData,
  });

  return resp as any;
}