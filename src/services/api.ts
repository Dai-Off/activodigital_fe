export const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
export const CERTIFICATE_EXTRACTOR_URL = import.meta.env.VITE_CERTIFICATE_EXTRACTOR_URL || 'https://energy-certificate-extractor.fly.dev';

const DEFAULT_TIMEOUT_MS = 25000; // 25s para servicios en frío (Fly.io)

export async function apiFetch(path: string, options: RequestInit = {}, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(options.headers || {});
  
  // Solo establecer Content-Type si no es FormData
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  // Adjunta token si existe
  try {
    const token = window.localStorage.getItem('access_token') || window.sessionStorage.getItem('access_token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  } catch {}

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers, signal: controller.signal });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado. El servidor puede estar iniciándose. Intenta de nuevo.');
    }
    throw new Error('No se pudo conectar con el servidor. Verifica tu red o CORS.');
  } finally {
    clearTimeout(id);
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = (data && (data.message || data.error)) || response.statusText || 'Request failed';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  return data;
}

// Función específica para el certificate extractor (sin autenticación)
export async function certificateExtractorFetch(path: string, options: RequestInit = {}, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
  const url = `${CERTIFICATE_EXTRACTOR_URL}${path.startsWith('/') ? path : `/${path}`}`;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, { ...options, signal: controller.signal });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado. El servicio de extracción puede estar iniciándose.');
    }
    throw new Error('No se pudo conectar con el servicio de extracción de certificados.');
  } finally {
    clearTimeout(id);
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = (data && (data.message || data.error)) || response.statusText || 'Request failed';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  return data;
}


