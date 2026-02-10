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

export interface UploadedCertificateImage {
  id: string;
  url: string;
  filename: string;
  uploadedAt: Date;
  sessionId?: string;
  storagePath: string;
  storageFileName: string;
}

export interface CertificateImageUploadResult {
  success: boolean;
  image?: UploadedCertificateImage;
  error?: string;
}

/**
 * Sube una imagen de certificado energético a Supabase Storage
 * @param file - Archivo de imagen del certificado
 * @param buildingId - ID del edificio
 * @param sessionId - ID de la sesión de certificado (opcional)
 * @returns Resultado de la subida
 */
export async function uploadCertificateImage(
  file: File, 
  buildingId: string, 
  sessionId?: string
): Promise<CertificateImageUploadResult> {
  try {
    // Validar tipo de archivo (solo imágenes)
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'El archivo debe ser una imagen'
      };
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'La imagen no puede superar los 10MB'
      };
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `${buildingId}/${timestamp}_${randomId}.${fileExtension}`;

    // Subir archivo a Supabase Storage
    const supabase = getSupabaseClient();
    const { error } = await supabase.storage
      .from('energy-certificates')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo imagen de certificado:', error);
      return {
        success: false,
        error: `Error subiendo imagen: ${error.message}`
      };
    }

    // Obtener URL firmada (funciona con buckets privados)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('energy-certificates')
      .createSignedUrl(filename, 60 * 60 * 24 * 365); // 1 año de validez

    if (signedUrlError) {
      console.error('Error generando URL firmada:', signedUrlError);
      return {
        success: false,
        error: `Error generando URL: ${signedUrlError.message}`
      };
    }

    const storageFileName = `${timestamp}_${randomId}.${fileExtension}`;
    const uploadedImage: UploadedCertificateImage = {
      id: `${buildingId}_${timestamp}_${randomId}`,
      url: signedUrlData.signedUrl,
      filename: file.name,
      uploadedAt: new Date(),
      sessionId,
      storagePath: filename,
      storageFileName,
    };

    return {
      success: true,
      image: uploadedImage
    };

  } catch (error) {
    console.error('Error inesperado subiendo imagen de certificado:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
}

/**
 * Elimina una imagen de certificado de Supabase Storage
 * @param imageUrl - URL de la imagen a eliminar
 * @returns Resultado de la eliminación
 */
export async function deleteCertificateImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Extraer el path del archivo de la URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'energy-certificates');
    
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      return {
        success: false,
        error: 'URL de imagen inválida'
      };
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    const supabase = getSupabaseClient();
    const { error } = await supabase.storage
      .from('energy-certificates')
      .remove([filePath]);

    if (error) {
      console.error('Error eliminando imagen de certificado:', error);
      return {
        success: false,
        error: `Error eliminando imagen: ${error.message}`
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Error inesperado eliminando imagen de certificado:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
}

/**
 * Obtiene todas las imágenes de certificados de un edificio
 * @param buildingId - ID del edificio
 * @returns Array de URLs de imágenes
 */
export async function getCertificateImages(buildingId: string): Promise<string[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage
      .from('energy-certificates')
      .list(buildingId, {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('Error obteniendo imágenes de certificados:', error);
      return [];
    }

    // Generar URLs firmadas para cada archivo
    const imageUrls = await Promise.all(
      data.map(async (file) => {
        const { data: signedUrlData } = await supabase.storage
          .from('energy-certificates')
          .createSignedUrl(`${buildingId}/${file.name}`, 60 * 60 * 24 * 365);
        return signedUrlData?.signedUrl || '';
      })
    );

    return imageUrls;

  } catch (error) {
    console.error('Error inesperado obteniendo imágenes de certificados:', error);
    return [];
  }
}
