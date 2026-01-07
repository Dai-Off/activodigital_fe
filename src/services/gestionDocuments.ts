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

    const uploadedDocument: GestionDocument = {
      id: `${buildingId}_${category}_${timestamp}_${randomId}`,
      url: signedUrlData.signedUrl,
      fileName: file.name, // Guardar el nombre original completo
      fileSize: file.size,
      mimeType: file.type,
      title: file.name, // Nombre original para mostrar
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId,
      category,
      buildingId
    };

    return {
      success: true,
      document: uploadedDocument
    };

  } catch (error) {
    console.error('Error inesperado subiendo documento de gestión:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
}

/**
 * Lista todos los documentos de gestión de un edificio
 * @param buildingId - ID del edificio
 * @param category - Categoría opcional para filtrar
 * @param uploadedBy - ID del usuario (para metadata)
 * @returns Array de documentos de gestión
 */
export async function listGestionDocuments(
  buildingId: string,
  category?: string,
  uploadedBy?: string
): Promise<GestionDocument[]> {
  try {
    const supabase = getSupabaseClient();
    
    // Si hay categoría específica, listar solo esa carpeta
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
      console.error('Error listando documentos de gestión:', error);
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
    
    // Si no hay categoría, necesitamos listar recursivamente todas las categorías
    if (!category) {
      // Listar todas las categorías (carpetas)
      const { data: categories } = await supabase.storage
        .from('building-documents')
        .list(buildingId);
      
      if (categories) {
        for (const cat of categories) {
          // Verificar si es una carpeta (no tiene extensión de archivo)
          const hasExtension = cat.name.includes('.');
          if (!hasExtension) {
            // Es una carpeta (categoría), listar sus archivos
            const { data: files } = await supabase.storage
              .from('building-documents')
              .list(`${buildingId}/${cat.name}`, { limit: 100 });
            
            if (files) {
              for (const file of files) {
                // Verificar si es un archivo (tiene extensión)
                const fileHasExtension = file.name.includes('.');
                if (!fileHasExtension) continue; // Es una subcarpeta, saltar
                
                const filePath = `${buildingId}/${cat.name}/${file.name}`;
                const { data: signed } = await supabase.storage
                  .from('building-documents')
                  .createSignedUrl(filePath, 60 * 60 * 24 * 365);
                
                if (!signed?.signedUrl) continue;
                
                // Extraer el nombre original del nombre del archivo
                // Formato nuevo: timestamp_randomId_originalName.ext
                // Formato antiguo: timestamp_randomId.ext (sin nombre original)
                let originalFileName = file.name;
                
                // Buscar el patrón: número_timestamp_randomId_resto.ext
                const match = file.name.match(/^(\d+)_([a-z0-9]+)_(.+)$/);
                if (match) {
                  // Formato nuevo con nombre original
                  const restOfName = match[3]; // Todo después de timestamp_randomId_
                  originalFileName = restOfName;
                } else {
                  // Formato antiguo o formato diferente, usar el nombre completo
                  originalFileName = file.name;
                }
                
                results.push({
                  id: `${buildingId}_${cat.name}_${file.name}`,
                  url: signed.signedUrl,
                  fileName: originalFileName, // Nombre original extraído (para mostrar)
                  fileSize: (file as any).metadata?.size ?? (file as any).size ?? 0,
                  mimeType: toMime(file.name),
                  title: originalFileName, // Usar el nombre original para mostrar
                  uploadedAt: (file as any).updated_at || new Date().toISOString(),
                  uploadedBy: uploadedBy || '',
                  category: cat.name,
                  buildingId,
                  storageFileName: file.name // Nombre completo en storage para operaciones
                });
              }
            }
          }
        }
      }
    } else {
      // Solo listar archivos de la categoría especificada
      for (const file of data) {
        // Verificar si es un archivo (tiene extensión)
        const fileHasExtension = file.name.includes('.');
        if (!fileHasExtension) continue; // Es una carpeta, saltar
        
        const filePath = `${buildingId}/${category}/${file.name}`;
        const { data: signed } = await supabase.storage
          .from('building-documents')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365);
        
        if (!signed?.signedUrl) continue;
        
        // Extraer el nombre original del nombre del archivo
        // Formato nuevo: timestamp_randomId_originalName.ext
        // Formato antiguo: timestamp_randomId.ext (sin nombre original)
        let originalFileName = file.name;
        
        // Buscar el patrón: número_timestamp_randomId_resto.ext
        const match = file.name.match(/^(\d+)_([a-z0-9]+)_(.+)$/);
        if (match) {
          // Formato nuevo con nombre original
          const restOfName = match[3]; // Todo después de timestamp_randomId_
          originalFileName = restOfName;
        } else {
          // Formato antiguo o formato diferente, usar el nombre completo
          originalFileName = file.name;
        }
        
        results.push({
          id: `${buildingId}_${category}_${file.name}`,
          url: signed.signedUrl,
          fileName: originalFileName, // Nombre original extraído (para mostrar)
          fileSize: (file as any).metadata?.size ?? (file as any).size ?? 0,
          mimeType: toMime(file.name),
          title: originalFileName, // Usar el nombre original para mostrar
          uploadedAt: (file as any).updated_at || new Date().toISOString(),
          uploadedBy: uploadedBy || '',
          category,
          buildingId,
          storageFileName: file.name // Nombre completo en storage para operaciones
        });
      }
    }

    return results;

  } catch (error) {
    console.error('Error inesperado listando documentos de gestión:', error);
    return [];
  }
}

/**
 * Elimina un documento de gestión de Supabase Storage
 * @param documentUrl - URL del documento a eliminar
 * @param buildingId - ID del edificio
 * @param category - Categoría del documento
 * @param fileName - Nombre del archivo
 * @returns Resultado de la eliminación
 */
export async function deleteGestionDocument(
  _documentUrl: string,
  buildingId: string,
  category: string,
  storageFileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // El storageFileName puede ser el nombre original o el nombre completo en storage
    // Necesitamos encontrar el archivo real en storage
    const supabase = getSupabaseClient();
    
    // Listar archivos en la categoría para encontrar el archivo correcto
    const { data: files, error: listError } = await supabase.storage
      .from('building-documents')
      .list(`${buildingId}/${category}`, { limit: 100 });

    if (listError) {
      console.error('Error listando archivos:', listError);
      return {
        success: false,
        error: `Error listando archivos: ${listError.message}`
      };
    }

    // Buscar el archivo que contiene el nombre original en su nombre de storage
    // El formato es: timestamp_randomId_originalName.ext
    const fileToDelete = files?.find(file => {
      // Si el storageFileName es el nombre original, buscar archivos que lo contengan
      if (file.name.includes(storageFileName)) {
        return true;
      }
      // También intentar extraer el nombre original del nombre en storage
      const match = file.name.match(/^(\d+)_([a-z0-9]+)_(.+)$/);
      if (match && match[3] === storageFileName) {
        return true;
      }
      return false;
    });

    if (!fileToDelete) {
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
      console.error('Error eliminando documento de gestión:', error);
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




