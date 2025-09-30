// src/services/api.ts
// Wrapper centralizado: adjunta Authorization, evita cache y maneja timeouts/errores.

//
// 1) Base URLs dinámicos
//
const getApiBaseUrl = () => {
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  // 1. Si hay VITE_API_BASE, usarlo (dev o prod)
  if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE;

  // 2. Localhost sin VITE_API_BASE → backend local
  if (isLocalhost) return 'http://localhost:3000';

  // 3. Producción sin VITE_API_BASE → backend por defecto
  return 'https://activodigital-be.fly.dev';
};

export const API_BASE_URL = getApiBaseUrl();
export const CERTIFICATE_EXTRACTOR_URL =
  import.meta.env.VITE_CERTIFICATE_EXTRACTOR_URL ||
  'https://energy-certificate-extractor.fly.dev';

//
// 2) Utilidades
//
const DEFAULT_TIMEOUT_MS = 25_000; // Fly.io frío
let _loggedOnce = false;

function getAccessToken(): string | null {
  // Preferencia: sessionStorage > localStorage (evita tokens “pegados” entre sesiones)
  return (
    window.sessionStorage.getItem('access_token') ||
    window.localStorage.getItem('access_token')
  );
}

// Error con status para poder diferenciar (401, 403, 404, etc.)
export class HttpError extends Error {
  status: number;
  body?: any;
  constructor(message: string, status: number, body?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

//
// 3) Fetch principal (API)
//
export async function apiFetch(
  path: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
) {
  // Normaliza URL
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  // Headers base
  const headers = new Headers(options.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  // Content-Type automático salvo que venga FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Adjunta token
  try {
    const token = getAccessToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (import.meta.env.DEV && !_loggedOnce) {
      console.log('🔧 API_BASE_URL:', API_BASE_URL);
      console.log('🔧 Hostname:', window.location.hostname);
      console.log('🔧 VITE_API_BASE env var:', import.meta.env.VITE_API_BASE);
      console.log('🔑 Authorization header (apiFetch):', headers.get('Authorization'));
      _loggedOnce = true;
    }
  } catch {
    // no-op
  }

  // Evitar cache intermedio (mitiga 304 con contenido cambiado por usuario)
  if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store');

  // Abort/timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
      cache: 'no-store', // evita reusar respuestas
      credentials: 'omit', // no cookies
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === 'AbortError') {
      throw new Error(
        'Tiempo de espera agotado. El servidor puede estar iniciándose. Intenta de nuevo.'
      );
    }
    throw new Error('No se pudo conectar con el servidor. Verifica tu red o CORS.');
  } finally {
    clearTimeout(timeoutId);
  }

  // Intento de parseo (JSON si corresponde)
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

  if (!response.ok) {
    const msgFromBody =
      (isJson && payload && (payload.message || payload.error)) || response.statusText || 'Request failed';
    // Lanza HttpError preservando status y body (útil para manejar 401 arriba)
    throw new HttpError(
      typeof msgFromBody === 'string' ? msgFromBody : JSON.stringify(msgFromBody),
      response.status,
      payload
    );
  }

  return isJson ? payload : payload; // devuelve JSON o texto (según content-type)
}

//
// 4) Fetch del extractor de certificados (sin auth)
//
export async function certificateExtractorFetch(
  path: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
) {
  const url = `${CERTIFICATE_EXTRACTOR_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado. El servicio de extracción puede estar iniciándose.');
    }
    throw new Error('No se pudo conectar con el servicio de extracción de certificados.');
  } finally {
    clearTimeout(timeoutId);
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

  if (!response.ok) {
    const msgFromBody =
      (isJson && payload && (payload.message || payload.error)) || response.statusText || 'Request failed';
    throw new Error(typeof msgFromBody === 'string' ? msgFromBody : JSON.stringify(msgFromBody));
  }

  return isJson ? payload : payload;
}
