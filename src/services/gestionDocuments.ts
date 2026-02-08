import { createClient } from '@supabase/supabase-js';
import { apiFetch } from './api';

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

// Tipos MIME permitidos para documentos de gestión
export const ALLOWED_GESTION_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'text/plain': ['.txt'],
};

export interface GestionDocument {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  title?: string;
  uploadedAt: string;
  uploadedBy: string;
  category: string;
  buildingId: string;
  storageFileName?: string; // Nombre completo del archivo en storage
  // Campos adicionales de la BD
  status?: string;
  expirationDate?: string;
  contractProvider?: string;
  contractAmount?: string;
  contractExpiration?: string;
  contractRenewal?: string;
  subcategory?: string;
  notes?: string;
}

export interface GestionDocumentUploadResult {
  success: boolean;
  document?: GestionDocument;
  error?: string;
}

/**
 * Sube un documento de gestión a Supabase Storage
 * @param file - Archivo a subir
 * @param buildingId - ID del edificio
 * @param category - Categoría del documento (financial, contracts, maintenance, etc.)
 * @param userId - ID del usuario que sube el archivo
 * @returns Resultado de la subida
 */
export async function uploadGestionDocument(
  file: File,
  buildingId: string,
  category: string,
  userId: string
): Promise<GestionDocumentUploadResult> {
  try {
    // Validar tipo de archivo
    const allowedTypes = Object.keys(ALLOWED_GESTION_TYPES);
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
    // Sanitizar el nombre original para incluirlo en el nombre del archivo
    const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, ''); // Quitar extensión
    const sanitizedOriginalName = originalNameWithoutExt
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 100); // Permitir nombres más largos
    
    // Incluir el nombre original en el nombre del archivo para poder extraerlo después
    const filename = `${buildingId}/${category}/${timestamp}_${randomId}_${sanitizedOriginalName}.${fileExtension}`;

    // Subir archivo a Supabase Storage
    const supabase = getSupabaseClient();
    const { error: uploadError } = await supabase.storage
      .from('building-documents')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error subiendo documento de gestión:', uploadError);
      
      // Mensaje más claro si el bucket no existe
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
        return {
          success: false,
          error: 'El bucket "building-documents" no existe en Supabase Storage. Por favor, créalo en el panel de Supabase o contacta al administrador.'
        };
      }
      
      return {
        success: false,
        error: `Error subiendo documento: ${uploadError.message}`
      };
    }

    // Obtener URL firmada (válida por 1 año)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('building-documents')
      .createSignedUrl(filename, 60 * 60 * 24 * 365); // 1 año de validez

    if (signedUrlError) {
      console.error('Error generando URL firmada:', signedUrlError);
      return {
        success: false,
        error: `Error generando URL: ${signedUrlError.message}`
      };
    }

    // Guardar metadatos en la base de datos
    const storageFileName = filename.split('/').pop() || filename;
    const signedUrlExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const response = await apiFetch('/building-documents', {
        method: 'POST',
        body: JSON.stringify({
          building_id: buildingId,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          storage_bucket: 'building-documents',
          storage_path: filename,
          storage_file_name: storageFileName,
          category: category,
          subcategory: 'General',
          status: 'activo',
          title: file.name,
          signed_url: signedUrlData.signedUrl,
          signed_url_expires_at: signedUrlExpiresAt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        console.error('Error guardando documento en BD:', errorData);
        // No fallar completamente, el archivo ya está en Storage
        // Pero registrar el error para debugging
      }

      const dbDocument = await response.json().catch(() => null);
      const documentId = dbDocument?.data?.id || `${buildingId}_${category}_${timestamp}_${randomId}`;

      const uploadedDocument: GestionDocument = {
        id: documentId,
        url: signedUrlData.signedUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        title: file.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: userId,
        category,
        buildingId,
        storageFileName: storageFileName
      };

      return {
        success: true,
        document: uploadedDocument
      };
    } catch (dbError) {
      console.error('Error guardando documento en BD (continuando con Storage):', dbError);
      // Si falla la BD, aún retornamos éxito porque el archivo está en Storage
      const uploadedDocument: GestionDocument = {
        id: `${buildingId}_${category}_${timestamp}_${randomId}`,
        url: signedUrlData.signedUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        title: file.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: userId,
        category,
        buildingId,
        storageFileName: storageFileName
      };

      return {
        success: true,
        document: uploadedDocument
      };
    }

  } catch (error) {
    console.error('Error inesperado subiendo documento de gestión:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
}

/**
 * Cuenta todos los documentos de gestión de un edificio
 * @param buildingId - ID del edificio
 * @returns Número total de documentos
 */
export async function countBuildingDocuments(buildingId: string): Promise<number> {
  try {
    const supabase = getSupabaseClient();
    let totalCount = 0;

    // 1. Obtenemos las carpetas (categorías) dentro del edificio
    const { data: categories, error: catError } = await supabase.storage
      .from('building-documents')
      .list(buildingId);

    if (catError || !categories) {
      console.error('Error al obtener categorías para conteo:', catError);
      return 0;
    }

    const { data: files, error: filesError } = await supabase.storage
      .from('digital-book-documents')
      .list(buildingId);

    if (filesError || !files) {
      console.error('Error al obtener categorías para conteo:', catError);
      return 0;
    }

    // 2. Recorremos cada categoría para contar sus archivos
    for (const cat of categories) {
      // Si el nombre tiene punto, es un archivo suelto en la raíz (poco común en tu estructura)
      // Si no tiene punto, es una carpeta de categoría
      const isFolder = !cat.name.includes('.');
      
      if (isFolder) {
        const { data: files } = await supabase.storage
          .from('building-documents')
          .list(`${buildingId}/${cat.name}`);

        if (files) {
          const fileCount = files.filter(f => f.name.includes('.')).length;
          totalCount += fileCount;
        }
      } else {
        totalCount++;
      }
    }
    
    for (const cat of files) {
      const isFolder = !cat.name.includes('.');
      
      if (isFolder) {
        const { data: files } = await supabase.storage
          .from('digital-book-documents')
          .list(`${buildingId}/${cat.name}`);

        if (files) {
          const fileCount = files.filter(f => f.name.includes('.')).length;
          totalCount += fileCount;
        }
      } else {
        totalCount++;
      }
    }

    return totalCount;
  } catch (error) {
    console.error('Error inesperado contando documentos:', error);
    return 0;
  }
}

/**
 * Lista todos los documentos de gestión de un edificio desde la base de datos
 * @param buildingId - ID del edificio
 * @param category - Categoría opcional para filtrar
 * @param uploadedBy - ID del usuario (para metadata) - ya no se usa, se obtiene de BD
 * @returns Array de documentos de gestión
 */
export async function listGestionDocuments(
  buildingId: string,
  category?: string,
  _uploadedBy?: string
): Promise<GestionDocument[]> {
  try {
    // Leer desde la base de datos en lugar de Storage
    let url = `/building-documents/building/${buildingId}`;
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    const response = await apiFetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Error obteniendo documentos desde BD, intentando fallback a Storage');
      // Fallback a Storage si la BD falla (para documentos antiguos)
      return await listGestionDocumentsFromStorage(buildingId, category);
    }

    const data = await response.json();
    const documents = data.data || [];

    // Mapear documentos de BD al formato GestionDocument
    return documents.map((doc: any) => {
      // Regenerar URL firmada si es necesario (si expiró o no existe)
      // TODO: Implementar regeneración de URL si expiró
      const documentUrl = doc.signed_url || '';

      return {
        id: doc.id,
        url: documentUrl,
        fileName: doc.file_name,
        fileSize: doc.file_size,
        mimeType: doc.mime_type,
        title: doc.title || doc.file_name,
        uploadedAt: doc.uploaded_at,
        uploadedBy: doc.uploaded_by || '',
        category: doc.category,
        buildingId: doc.building_id,
        storageFileName: doc.storage_file_name,
        // Campos adicionales de la BD
        status: doc.status || 'activo',
        expirationDate: doc.expiration_date || undefined,
        contractProvider: doc.contract_provider || undefined,
        contractAmount: doc.contract_amount || undefined,
        contractExpiration: doc.contract_expiration || undefined,
        contractRenewal: doc.contract_renewal || undefined,
        subcategory: doc.subcategory || 'General',
        notes: doc.notes || undefined
      };
    });

  } catch (error) {
    console.error('Error inesperado listando documentos de gestión:', error);
    // Fallback a Storage si hay error
    return await listGestionDocumentsFromStorage(buildingId, category);
  }
}

/**
 * Función de fallback: lista documentos desde Storage (para documentos antiguos o si BD falla)
 */
async function listGestionDocumentsFromStorage(
  buildingId: string,
  category?: string
): Promise<GestionDocument[]> {
  try {
    const supabase = getSupabaseClient();
    
    const path = category 
      ? `${buildingId}/${category}`
      : `${buildingId}`;
    
    const { data, error } = await supabase.storage
      .from('building-documents')
      .list(path, { 
        limit: 100, 
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error || !data) {
      console.error('Error listando documentos de Storage:', error);
      return [];
    }

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
        txt: 'text/plain'
      };
      return map[ext] || 'application/octet-stream';
    };

    const results: GestionDocument[] = [];
    
    if (!category) {
      const { data: categories } = await supabase.storage
        .from('building-documents')
        .list(buildingId);
      
      if (categories) {
        for (const cat of categories) {
          const hasExtension = cat.name.includes('.');
          if (!hasExtension) {
            const { data: files } = await supabase.storage
              .from('building-documents')
              .list(`${buildingId}/${cat.name}`, { limit: 100 });
            
            if (files) {
              for (const file of files) {
                const fileHasExtension = file.name.includes('.');
                if (!fileHasExtension) continue;
                
                const filePath = `${buildingId}/${cat.name}/${file.name}`;
                const { data: signed } = await supabase.storage
                  .from('building-documents')
                  .createSignedUrl(filePath, 60 * 60 * 24 * 365);
                
                if (!signed?.signedUrl) continue;
                
                let originalFileName = file.name;
                const match = file.name.match(/^(\d+)_([a-z0-9]+)_(.+)$/);
                if (match) {
                  originalFileName = match[3];
                }
                
                results.push({
                  id: `${buildingId}_${cat.name}_${file.name}`,
                  url: signed.signedUrl,
                  fileName: originalFileName,
                  fileSize: (file as any).metadata?.size ?? (file as any).size ?? 0,
                  mimeType: toMime(file.name),
                  title: originalFileName,
                  uploadedAt: (file as any).updated_at || new Date().toISOString(),
                  uploadedBy: '',
                  category: cat.name,
                  buildingId,
                  storageFileName: file.name
                });
              }
            }
          }
        }
      }
    } else {
      for (const file of data) {
        const fileHasExtension = file.name.includes('.');
        if (!fileHasExtension) continue;
        
        const filePath = `${buildingId}/${category}/${file.name}`;
        const { data: signed } = await supabase.storage
          .from('building-documents')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365);
        
        if (!signed?.signedUrl) continue;
        
        let originalFileName = file.name;
        const match = file.name.match(/^(\d+)_([a-z0-9]+)_(.+)$/);
        if (match) {
          originalFileName = match[3];
        }
        
        results.push({
          id: `${buildingId}_${category}_${file.name}`,
          url: signed.signedUrl,
          fileName: originalFileName,
          fileSize: (file as any).metadata?.size ?? (file as any).size ?? 0,
          mimeType: toMime(file.name),
          title: originalFileName,
          uploadedAt: (file as any).updated_at || new Date().toISOString(),
          uploadedBy: '',
          category,
          buildingId,
          storageFileName: file.name
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error en fallback a Storage:', error);
    return [];
  }
}

/**
 * Elimina un documento de gestión de Supabase Storage y de la base de datos
 * @param documentUrl - URL del documento a eliminar (puede contener el ID del documento)
 * @param buildingId - ID del edificio
 * @param category - Categoría del documento
 * @param storageFileName - Nombre del archivo en storage
 * @returns Resultado de la eliminación
 */
export async function deleteGestionDocument(
  _documentUrl: string,
  buildingId: string,
  category: string,
  storageFileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Intentar extraer el ID del documento de la URL o buscar por storage_path
    let documentId: string | null = null;

    // Si tenemos el ID en algún formato, intentar usarlo
    // Primero intentar buscar el documento en la BD por storage_path
    try {
      const listResponse = await apiFetch(`/building-documents/building/${buildingId}?category=${encodeURIComponent(category)}`, {
        method: 'GET',
      });

      if (listResponse.ok) {
        const listData = await listResponse.json();
        const documents = listData.data || [];
        
        // Buscar el documento que coincida con storageFileName
        const matchingDoc = documents.find((doc: any) => 
          doc.storage_file_name === storageFileName || 
          doc.storage_path.includes(storageFileName)
        );

        if (matchingDoc) {
          documentId = matchingDoc.id;
        }
      }
    } catch (bdError) {
      console.warn('No se pudo buscar documento en BD, continuando con eliminación de Storage:', bdError);
    }

    // Eliminar de la base de datos si tenemos el ID
    if (documentId) {
      try {
        const deleteResponse = await apiFetch(`/building-documents/${documentId}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          console.warn('Error eliminando documento de BD, continuando con Storage:', await deleteResponse.text());
        }
      } catch (dbError) {
        console.warn('Error eliminando documento de BD, continuando con Storage:', dbError);
      }
    }

    // Eliminar de Storage
    const supabase = getSupabaseClient();
    
    // Listar archivos en la categoría para encontrar el archivo correcto
    const { data: files, error: listError } = await supabase.storage
      .from('building-documents')
      .list(`${buildingId}/${category}`, { limit: 100 });

    if (listError) {
      console.error('Error listando archivos:', listError);
      // Si ya eliminamos de BD, consideramos éxito parcial
      if (documentId) {
        return { success: true };
      }
      return {
        success: false,
        error: `Error listando archivos: ${listError.message}`
      };
    }

    // Buscar el archivo que contiene el nombre original en su nombre de storage
    const fileToDelete = files?.find(file => {
      if (file.name.includes(storageFileName)) {
        return true;
      }
      const match = file.name.match(/^(\d+)_([a-z0-9]+)_(.+)$/);
      if (match && match[3] === storageFileName) {
        return true;
      }
      return false;
    });

    if (!fileToDelete) {
      // Si ya eliminamos de BD, consideramos éxito
      if (documentId) {
        return { success: true };
      }
      return {
        success: false,
        error: 'No se encontró el archivo a eliminar'
      };
    }

    const filePath = `${buildingId}/${category}/${fileToDelete.name}`;
    const { error } = await supabase.storage
      .from('building-documents')
      .remove([filePath]);

    if (error) {
      console.error('Error eliminando documento de Storage:', error);
      // Si ya eliminamos de BD, consideramos éxito parcial
      if (documentId) {
        return { success: true };
      }
      return {
        success: false,
        error: `Error eliminando documento: ${error.message}`
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Error inesperado eliminando documento de gestión:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
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




