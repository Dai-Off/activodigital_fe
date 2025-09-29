// Configuración dinámica de API
const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // 1. Si hay VITE_API_BASE configurado, usarlo (tanto en localhost como en producción)
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  // 2. Si estamos en localhost y NO hay VITE_API_BASE, usar backend local
  if (isLocalhost) {
    return 'http://localhost:3000';
  }
  
  // 3. Si estamos en producción y NO hay VITE_API_BASE, usar backend de producción por defecto
  return 'https://activodigital-be.fly.dev';
};

export const API_BASE_URL = getApiBaseUrl();
export const CERTIFICATE_EXTRACTOR_URL = import.meta.env.VITE_CERTIFICATE_EXTRACTOR_URL || 'https://energy-certificate-extractor.fly.dev';

// Debug: Log the API URL being used (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 API_BASE_URL:', API_BASE_URL);
  console.log('🔧 Hostname:', window.location.hostname);
  console.log('🔧 VITE_API_BASE env var:', import.meta.env.VITE_API_BASE);
}

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


