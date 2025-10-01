import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Verifica VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
}

// Función para obtener el cliente de Supabase con autenticación
const getSupabaseClient = () => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  });
  
  return supabase;
};

// Tipos MIME permitidos
export const ALLOWED_DOCUMENT_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'text/plain': ['.txt'],
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
};

export interface UploadedDocument {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  title?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DocumentUploadResult {
  success: boolean;
  document?: UploadedDocument;
  error?: string;
}

/**
 * Sube un documento a Supabase Storage
 * @param file - Archivo a subir
 * @param bookId - ID del libro digital
 * @param sectionType - Tipo de sección (proyecto_tecnico, documentacion_administrativa, etc.)
 * @param userId - ID del usuario que sube el archivo
 * @returns Resultado de la subida
 */
export async function uploadDocument(
  file: File,
  bookId: string,
  sectionType: string,
  userId: string
): Promise<DocumentUploadResult> {
  try {
    // Validar tipo de archivo
    const allowedTypes = Object.keys(ALLOWED_DOCUMENT_TYPES);
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Tipo de archivo no permitido: ${file.type}`
      };
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'El archivo no puede superar los 10MB'
      };
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'bin';
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50);
    
    const filename = `${bookId}/${sectionType}/${timestamp}_${randomId}.${fileExtension}`;

    // Subir archivo a Supabase Storage
    const supabase = getSupabaseClient();
    const { error: uploadError } = await supabase.storage
      .from('digital-book-documents')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error subiendo documento:', uploadError);
      return {
        success: false,
        error: `Error subiendo documento: ${uploadError.message}`
      };
    }

    // Obtener URL firmada (válida por 1 año)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('digital-book-documents')
      .createSignedUrl(filename, 60 * 60 * 24 * 365); // 1 año de validez

    if (signedUrlError) {
      console.error('Error generando URL firmada:', signedUrlError);
      return {
        success: false,
        error: `Error generando URL: ${signedUrlError.message}`
      };
    }

    const uploadedDocument: UploadedDocument = {
      id: `${bookId}_${sectionType}_${timestamp}_${randomId}`,
      url: signedUrlData.signedUrl,
      fileName: sanitizedFileName,
      fileSize: file.size,
      mimeType: file.type,
      title: file.name,
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId
    };

    return {
      success: true,
      document: uploadedDocument
    };

  } catch (error) {
    console.error('Error inesperado subiendo documento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
}

/**
 * Sube múltiples documentos para una sección
 * @param files - Array de archivos
 * @param bookId - ID del libro digital
 * @param sectionType - Tipo de sección
 * @param userId - ID del usuario
 * @returns Array de resultados de subida
 */
export async function uploadDocuments(
  files: File[],
  bookId: string,
  sectionType: string,
  userId: string
): Promise<DocumentUploadResult[]> {
  const uploadPromises = files.map((file) => 
    uploadDocument(file, bookId, sectionType, userId)
  );

  return Promise.all(uploadPromises);
}

/**
 * Elimina un documento de Supabase Storage
 * @param documentUrl - URL del documento a eliminar
 * @returns Resultado de la eliminación
 */
export async function deleteDocument(documentUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Extraer el path del archivo de la URL
    const url = new URL(documentUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'digital-book-documents');
    
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      return {
        success: false,
        error: 'URL de documento inválida'
      };
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    const supabase = getSupabaseClient();
    const { error } = await supabase.storage
      .from('digital-book-documents')
      .remove([filePath]);

    if (error) {
      console.error('Error eliminando documento:', error);
      return {
        success: false,
        error: `Error eliminando documento: ${error.message}`
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Error inesperado eliminando documento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
}

/**
 * Obtiene todos los documentos de una sección
 * @param bookId - ID del libro digital
 * @param sectionType - Tipo de sección
 * @returns Array de URLs de documentos
 */
export async function getDocuments(bookId: string, sectionType: string): Promise<string[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage
      .from('digital-book-documents')
      .list(`${bookId}/${sectionType}`, {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('Error obteniendo documentos:', error);
      return [];
    }

    // Generar URLs firmadas para cada archivo
    const documentUrls = await Promise.all(
      data.map(async (file) => {
        const { data: signedUrlData } = await supabase.storage
          .from('digital-book-documents')
          .createSignedUrl(`${bookId}/${sectionType}/${file.name}`, 60 * 60 * 24 * 365);
        return signedUrlData?.signedUrl || '';
      })
    );

    return documentUrls.filter(url => url !== '');

  } catch (error) {
    console.error('Error inesperado obteniendo documentos:', error);
    return [];
  }
}

/**
 * Lista documentos existentes en Storage para una sección y devuelve objetos DocumentFile mínimos.
 * Útil como fallback de rehidratación cuando el backend aún no guardó referencias.
 */
export async function listSectionDocuments(
  bookId: string,
  sectionType: string,
  uploadedBy: string
): Promise<UploadedDocument[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from('digital-book-documents')
    .list(`${bookId}/${sectionType}`, { limit: 100, offset: 0 });

  if (error || !data) return [];

  const toMime = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (!ext) return 'application/octet-stream';
    const map: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      txt: 'text/plain',
      zip: 'application/zip'
    };
    return map[ext] || 'application/octet-stream';
  };

  const results: UploadedDocument[] = [];
  for (const file of data) {
    const path = `${bookId}/${sectionType}/${file.name}`;
    const { data: signed } = await supabase.storage
      .from('digital-book-documents')
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    if (!signed?.signedUrl) continue;
    results.push({
      id: `${bookId}_${sectionType}_${file.name}`,
      url: signed.signedUrl,
      fileName: file.name,
      fileSize: (file as any).metadata?.size ?? (file as any).size ?? 0,
      mimeType: toMime(file.name),
      title: file.name,
      uploadedAt: (file as any).updated_at || new Date().toISOString(),
      uploadedBy
    });
  }
  return results;
}

/**
 * Obtiene el ícono según el tipo MIME
 */
export function getDocumentIcon(mimeType: string): string {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('zip')) return '📦';
  if (mimeType.includes('text')) return '📋';
  return '📎';
}

/**
 * Formatea el tamaño del archivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

