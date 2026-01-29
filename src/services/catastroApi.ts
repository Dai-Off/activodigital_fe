// src/services/catastroApi.ts
import { apiFetch } from './api';

// -------------------- Interfaces para respuestas de la API --------------------

export interface Provincia {
  codigo: string;
  nombre: string;
}

export interface Municipio {
  codigoMunicipioIne: string;
  nombreMunicipio: string;
}

export interface Via {
  codigoVia: string;
  nombreVia: string;
  tipoVia?: string;
}

// Estructura real de la respuesta de la API
export interface ReferenciaCatastral {
  referenciaCatastral: string;
  pc1?: string;
  pc2?: string;
  car?: string;
  cc1?: string;
  cc2?: string;
}

export interface DireccionCatastro {
  codigoProvinciaIne?: string;
  codigoMunicipioIne?: string;
  nombreProvincia?: string;
  nombreMunicipio?: string;
  codigoPostal?: string;
  tipoVia?: string;
  nombreVia?: string;
  numero?: string;
  escalera?: string;
  planta?: string;
  puerta?: string;
  direccionCompleta?: string;
}

export interface DatosEconomicos {
  uso?: string;
  superficieConstruida?: string | number;
  coeficienteParticipacion?: string;
  añoConstruccion?: string | number;
}

export interface UnidadConstructiva {
  uso?: string;
  escalera?: string;
  planta?: string;
  puerta?: string;
  superficieTotal?: string | number;
  tipologiaConstructiva?: string;
}

export interface InmuebleCatastro {
  tipoBien?: string;
  referenciaCatastral?: ReferenciaCatastral;
  direccion?: DireccionCatastro;
  datosEconomicos?: DatosEconomicos;
  unidadesConstructivas?: UnidadConstructiva[];
  coordenadas?: {
    lat?: number | string;
    lng?: number | string;
    x?: number | string;
    y?: number | string;
  };
}

export interface CatastroApiResponse {
  numeroInmuebles?: number;
  inmuebles?: InmuebleCatastro[];
  errores?: string[];
}

// Interfaz para compatibilidad con el código existente
export interface InmuebleResponse extends Omit<InmuebleCatastro, 'direccion'> {
  // Campos adicionales para compatibilidad
  rc?: string;
  direccion?: string | DireccionCatastro;
  provincia?: string;
  municipio?: string;
  nombreVia?: string;
  tipoVia?: string;
  numero?: string;
  escalera?: string;
  planta?: string;
  puerta?: string;
  x?: number | string;
  y?: number | string;
  lat?: number;
  lng?: number;
  superficie?: number;
  superficieConstruida?: number;
  anyoConstruccion?: number;
  anyo?: number;
  constructionYear?: number;
  uso?: string;
  tipologia?: string;
  typology?: 'residential' | 'mixed' | 'commercial';
  plantas?: number;
  numFloors?: number;
  plantasBajo?: number;
  plantasAltura?: number;
  unidades?: number;
  numUnits?: number;
  viviendas?: number;
  [key: string]: any;
}

// Interfaz para los datos mapeados al formato del edificio
export interface CatastroBuildingData {
  name: string;
  address: string;
  cadastralReference?: string;
  constructionYear?: number;
  typology?: 'residential' | 'mixed' | 'commercial';
  numFloors?: number;
  numUnits?: number;
  lat?: number;
  lng?: number;
  squareMeters?: number;
}

// -------------------- Unidades por dirección (XML) --------------------

export interface CatastroAddressParams {
  provincia: string;
  municipio: string;
  siglaVia: string;
  calle: string;
  numero: string;
  bloque?: string;
  escalera?: string;
  planta?: string;
  puerta?: string;
}

/**
 * Llama al backend para obtener las unidades de un inmueble a partir de su
 * dirección, devolviendo únicamente el XML crudo que viene de Catastro.
 *
 * Usa la misma capa estándar de `apiFetch` (incluye automáticamente el token
 * de autenticación del usuario desde local/sessionStorage).
 */
export async function fetchCatastroUnitsXmlByAddress(
  params: CatastroAddressParams
): Promise<string> {
  const searchParams = new URLSearchParams();

  // Campos obligatorios
  searchParams.append('provincia', params.provincia);
  searchParams.append('municipio', params.municipio);
  searchParams.append('siglaVia', params.siglaVia);
  searchParams.append('calle', params.calle);
  searchParams.append('numero', params.numero);

  // Campos opcionales solo si tienen valor
  if (params.bloque) searchParams.append('bloque', params.bloque);
  if (params.escalera) searchParams.append('escalera', params.escalera);
  if (params.planta) searchParams.append('planta', params.planta);
  if (params.puerta) searchParams.append('puerta', params.puerta);

  let response: any;
  try {
    response = await apiFetch(
      `/catastroApi/unidades-por-direccion?${searchParams.toString()}`,
      {
        method: 'GET',
      }
    );
  } catch (error: any) {
    const message =
      (error && error.message) ||
      'No se pudieron obtener las unidades desde Catastro. Por favor, inténtalo de nuevo.';

    // Normalizar mensajes muy técnicos a algo entendible
    if (error?.status === 403 || error?.status === 401) {
      throw new Error(
        'No se ha podido acceder a la información de Catastro para esta dirección. ' +
          'Por favor, verifica que tienes sesión iniciada y, si el problema persiste, contacta con soporte.'
      );
    }

    throw new Error(
      message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')
        ? 'No se pudo conectar con el servicio de Catastro. Verifica tu conexión a internet e inténtalo de nuevo.'
        : message
    );
  }

  if (!response || typeof response !== 'object' || typeof (response as any).xml !== 'string') {
    throw new Error(
      'La respuesta del servicio de Catastro no es válida. Vuelve a intentarlo en unos minutos.'
    );
  }

  return (response as any).xml;
}

// -------------------- Servicio de API de Catastro --------------------

// Normalizadores defensivos para adaptarnos a distintos formatos de respuesta,
// pero respetando la estructura original cuando ya viene como { codigo, nombre }.
function normalizeProvinces(raw: any[]): Provincia[] {
  if (!raw || raw.length === 0) return [];
  const first = raw[0];
  if (first && typeof first === 'object' && 'codigo' in first && 'nombre' in first) {
    return raw as Provincia[];
  }

  return raw.map((item, index) => {
    // Catastro devuelve provincias como { nombre, codigoProvinciaIne } pero
    // las APIs de búsqueda por dirección esperan el NOMBRE como parámetro
    // (?provincia=MADRID). Para mantener compatibilidad con pantallas
    // existentes, usamos siempre el nombre como "codigo" público.
    const codigo =
      item?.nombre ??
      item?.codigoProvinciaIne ??
      item?.codigo ??
      item?.code ??
      item?.id ??
      String(index);
    const nombre =
      item?.nombre ?? item?.name ?? item?.provincia ?? item?.descripcion ?? `Provincia ${index + 1}`;
    return { codigo: String(codigo), nombre: String(nombre) };
  });
}

function normalizeMunicipalities(raw: any[]): Municipio[] {
  if (!raw || raw.length === 0) return [];
  const first = raw[0];
  if (first && typeof first === 'object' && 'codigo' in first && 'nombre' in first) {
    return raw as Municipio[];
  }

  return raw.map((item, index) => {
    const codigo =
      // Catastro devuelve municipios como { codigoMunicipioIne, nombreMunicipio, ... }
      // pero las APIs de búsqueda por dirección esperan el NOMBRE del municipio
      // (?municipio=MADRID). Igual que con provincias, usamos siempre el
      // nombre como "codigo" para los selects del frontend.
      item?.nombreMunicipio ??
      item?.codigoMunicipioIne ??
      item?.codigo ??
      item?.code ??
      item?.id ??
      item?.codigoINE ??
      String(index);
    const nombre =
      item?.nombreMunicipio ??
      item?.nombre ??
      item?.name ??
      item?.municipio ??
      item?.descripcion ??
      `Municipio ${index + 1}`;
    return { codigo: String(codigo), nombre: String(nombre) };
  });
}

function normalizeStreets(raw: any[]): Via[] {
  if (!raw || raw.length === 0) return [];
  const first = raw[0];
  if (first && typeof first === 'object' && 'codigo' in first && 'nombre' in first) {
    return raw as Via[];
  }

  return raw.map((item, index) => {
    const codigo = item?.codigo ?? item?.code ?? item?.id ?? String(index);
    const nombre =
      item?.nombre ?? item?.name ?? item?.via ?? item?.descripcion ?? `Vía ${index + 1}`;
    const tipoVia = item?.tipoVia ?? item?.tipo ?? item?.sigla ?? undefined;
    return { codigo: String(codigo), nombre: String(nombre), tipoVia };
  });
}

export class CatastroApiService {
  /**
   * Obtiene la lista de provincias
   */
  static async getProvinces(): Promise<Provincia[]> {
    try {
      const response = await apiFetch('/CatastroApi/provincias');

      // La API puede devolver directamente el array o envolverlo en { data: [...] } o { provincias: [...] }
      const raw =
        (Array.isArray(response) && response) ||
        (Array.isArray((response as any)?.data) && (response as any).data) ||
        (Array.isArray((response as any)?.provincias) && (response as any).provincias) ||
        [];

      return normalizeProvinces(raw);
    } catch (error: any) {
      // Manejar error 403 específicamente
      if (error?.status === 403) {
        throw new Error('Error de autenticación con la API de Catastro.\n\nEl servicio no puede acceder a la información catastral debido a un problema de credenciales.\n\nPor favor, contacta con soporte técnico para verificar la configuración de la API de Catastro.');
      }
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`No se pudieron obtener las provincias: ${message}`);
    }
  }

  /**
   * Obtiene la lista de municipios de una provincia
   */
  static async getMunicipalities(provincia: string): Promise<Municipio[]> {
    try {
      const params = new URLSearchParams({ provincia });
      const response = await apiFetch(`/CatastroApi/municipios?${params.toString()}`);

      const raw =
        (Array.isArray(response) && response) ||
        (Array.isArray((response as any)?.data) && (response as any).data) ||
        (Array.isArray((response as any)?.municipios) && (response as any).municipios) ||
        [];

      return normalizeMunicipalities(raw);
    } catch (error: any) {
      if (error?.status === 403) {
        throw new Error('Error de autenticación con la API de Catastro.\n\nEl servicio no puede acceder a la información catastral debido a un problema de credenciales.\n\nPor favor, contacta con soporte técnico para verificar la configuración de la API de Catastro.');
      }
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`No se pudieron obtener los municipios: ${message}`);
    }
  }

  /**
   * Obtiene la lista de vías de un municipio
   */
  static async getStreets(
    provincia: string,
    municipio: string,
    nombreVia?: string,
    tipoVia?: string
  ): Promise<Via[]> {
    try {
      const params = new URLSearchParams({ provincia, municipio });
      if (nombreVia) params.append('nombreVia', nombreVia);
      if (tipoVia) params.append('tipoVia', tipoVia);
      
      const response = await apiFetch(`/CatastroApi/vias?${params.toString()}`);

      const raw =
        (Array.isArray(response) && response) ||
        (Array.isArray((response as any)?.data) && (response as any).data) ||
        (Array.isArray((response as any)?.vias) && (response as any).vias) ||
        [];

      return normalizeStreets(raw);
    } catch (error: any) {
      if (error?.status === 403) {
        throw new Error('Error de autenticación con la API de Catastro.\n\nEl servicio no puede acceder a la información catastral debido a un problema de credenciales.\n\nPor favor, contacta con soporte técnico para verificar la configuración de la API de Catastro.');
      }
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`No se pudieron obtener las vías: ${message}`);
    }
  }

  /**
   * Obtiene un inmueble por código catastral (RC)
   */
  static async getBuildingByRC(rc: string): Promise<InmuebleResponse> {
    try {
      // Validar formato básico del código catastral
      const trimmedRc = rc.trim();
      if (!trimmedRc) {
        throw new Error('El código catastral es obligatorio. Por favor, ingresa el código completo del edificio.');
      }

      // Validar longitud mínima del código catastral
      if (trimmedRc.length < 14) {
        throw new Error(`El código catastral parece estar incompleto. Tiene ${trimmedRc.length} caracteres, pero normalmente tiene entre 14 y 20 caracteres. Verifica que copiaste el código completo sin espacios.`);
      }

      // Validar formato básico (debe contener letras y números)
      const rcPattern = /^[0-9A-Za-z]+$/;
      if (!rcPattern.test(trimmedRc)) {
        throw new Error('El código catastral contiene caracteres no válidos. El código solo debe contener letras y números, sin espacios ni símbolos especiales.');
      }

      const params = new URLSearchParams({ rc: trimmedRc });
      let response: CatastroApiResponse;
      
      try {
        response = await apiFetch(`/CatastroApi/inmuebleRc?${params.toString()}`) as CatastroApiResponse;
      } catch (fetchError: any) {
        // Manejar error 403 específicamente primero
        if (fetchError?.status === 403) {
          throw new Error('Error de autenticación con la API de Catastro.\n\nEl servicio no puede acceder a la información catastral debido a un problema de credenciales.\n\nPor favor, contacta con soporte técnico para verificar la configuración de la API de Catastro.');
        }
        
        // Si el error 500 viene de la API externa de Catastro (tiene source o details específicos)
        if (fetchError?.status === 500) {
          const errorBody = fetchError?.body || {};
          // Verificar si el error viene de la API externa de Catastro
          if (errorBody.source === 'catastro_external_api' || 
              errorBody.details?.includes('Error de autenticación con la API de Catastro') ||
              errorBody.error?.includes('Error HTTP: 403')) {
            throw new Error('Error de autenticación con la API de Catastro.\n\nEl servicio no puede acceder a la información catastral debido a un problema de credenciales.\n\nPor favor, contacta con soporte técnico para verificar la configuración de la API de Catastro.');
          }
        }
        
        // Capturar errores de red o de la API
        const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
        
        if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
          throw new Error('No se pudo conectar con el servicio de catastro. Esto puede deberse a:\n\n• Problemas con tu conexión a internet\n• El servicio de catastro está temporalmente no disponible\n\nPor favor, verifica tu conexión e inténtalo de nuevo en unos momentos.');
        }
        
        if (errorMessage.includes('404') || errorMessage.includes('Not Found') || fetchError?.status === 404) {
          throw new Error(`No se encontró ningún edificio con el código catastral "${trimmedRc}".\n\nPosibles causas:\n• El código catastral es incorrecto o tiene un error\n• El inmueble no está registrado en el catastro\n• El código corresponde a otro tipo de bien (terreno, etc.)\n\n💡 Consejo: Verifica que el código esté completo y sin espacios. El código catastral suele encontrarse en escrituras, recibos del IBI o certificados catastrales.`);
        }
        
        if (errorMessage.includes('400') || errorMessage.includes('Bad Request') || fetchError?.status === 400) {
          throw new Error(`El código catastral "${trimmedRc}" no es válido.\n\nPor favor, verifica:\n• Que el código tenga entre 14 y 20 caracteres\n• Que no contenga espacios ni símbolos especiales\n• Que hayas copiado el código completo desde el documento original`);
        }
        
        if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error') || fetchError?.status === 500) {
          // Verificar si el error viene de la API externa de Catastro
          const errorBody = fetchError?.body || {};
          if (errorBody.source === 'catastro_external_api' || 
              errorBody.details?.includes('Error de autenticación con la API de Catastro')) {
            throw new Error('Error de autenticación con la API de Catastro.\n\nEl servicio no puede acceder a la información catastral debido a un problema de credenciales.\n\nPor favor, contacta con soporte técnico para verificar la configuración de la API de Catastro.');
          }
          throw new Error('El servicio de catastro está experimentando problemas técnicos en este momento. Por favor, inténtalo de nuevo en unos minutos. Si el problema persiste, puedes intentar buscar el edificio por dirección o coordenadas.');
        }
        
        if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
          throw new Error('La búsqueda está tardando demasiado. Esto puede deberse a:\n\n• El servicio de catastro está muy ocupado\n• Problemas de conectividad\n\nPor favor, espera unos segundos e inténtalo de nuevo.');
        }
        
        throw new Error('No se pudo obtener la información del edificio en este momento. Por favor, inténtalo de nuevo más tarde o prueba buscar por dirección o coordenadas.');
      }
      
      // Verificar que la respuesta sea válida
      if (!response || typeof response !== 'object') {
        throw new Error('La respuesta del servicio de catastro no es válida. Por favor, inténtalo de nuevo.');
      }
      
      // Verificar si la API devolvió errores (manejar null/undefined de forma segura)
      if (response.errores && Array.isArray(response.errores) && response.errores.length > 0) {
        const errorMessages = response.errores
          .map((e: any) => {
            if (typeof e === 'string') return e;
            if (e && typeof e === 'object') {
              if (e.descripcion) return e.descripcion;
              if (e.mensaje) return e.mensaje;
            }
            return null;
          })
          .filter((msg): msg is string => msg !== null && typeof msg === 'string')
          .join(', ');
        
        if (errorMessages) {
          // Mensajes más amigables según el tipo de error
          const lowerError = errorMessages.toLowerCase();
          if (lowerError.includes('no encontrado') || 
              lowerError.includes('no existe') ||
              lowerError.includes('no se encontró')) {
            throw new Error(`No se encontró ningún edificio con el código catastral "${trimmedRc}". Verifica que el código sea correcto.`);
          }
          
          throw new Error(errorMessages);
        }
      }
      
      // Verificar si hay inmuebles en la respuesta
      if (!response.inmuebles || !Array.isArray(response.inmuebles) || response.inmuebles.length === 0) {
        throw new Error(`No se encontró ningún edificio con el código catastral "${trimmedRc}".\n\nPosibles causas:\n• El código catastral es incorrecto o incompleto\n• El inmueble no está registrado en el catastro\n• El código corresponde a un terreno u otro tipo de bien inmueble\n\n💡 Consejo: Verifica el código en documentos oficiales como escrituras o recibos del IBI. También puedes intentar buscar por dirección.`);
      }
      
      const inmueble = response.inmuebles[0];
      if (!inmueble) {
        throw new Error(`No se encontró ningún edificio con el código catastral "${trimmedRc}".\n\nPor favor, verifica que:\n• El código esté completo y correcto\n• No haya espacios o caracteres adicionales\n• El código corresponda a un edificio, no a un terreno`);
      }
      
      // Normalizar para compatibilidad
      return {
        ...inmueble,
        rc: inmueble.referenciaCatastral?.referenciaCatastral || trimmedRc,
      } as InmuebleResponse;
    } catch (error) {
      // Si ya es un Error con mensaje descriptivo en español, relanzarlo
      if (error instanceof Error) {
        const message = error.message;
        
        // Si el mensaje ya está en español y es amigable, usarlo
        if (message.includes('No se encontró') || 
            message.includes('formato incorrecto') || 
            message.includes('no puede estar vacío') ||
            message.includes('No se pudo conectar') ||
            message.includes('no es válido') ||
            message.includes('inténtalo de nuevo')) {
          throw error;
        }
        
        // Si es un error técnico en inglés, convertirlo a mensaje amigable
        if (message.includes('Cannot read') || 
            message.includes('null') || 
            message.includes('undefined') ||
            message.includes('reading') ||
            message.includes('TypeError') ||
            message.includes('ReferenceError')) {
          throw new Error('Hubo un problema al procesar la información del catastro. Por favor, inténtalo de nuevo. Si el problema persiste, intenta buscar el edificio por dirección o coordenadas.');
        }
      }
      
      // Para cualquier otro error, proporcionar un mensaje útil con alternativas
      throw new Error(`No se pudo obtener la información del edificio con el código "${rc.trim()}".\n\nTe sugerimos:\n• Verificar que el código catastral esté completo y correcto\n• Intentar buscar por dirección si conoces la ubicación exacta\n• Intentar buscar por coordenadas si tienes acceso a ellas\n• Contactar con soporte si el problema persiste`);
    }
  }

  /**
   * Obtiene un inmueble por dirección
   */
  static async getBuildingByAddress(
    provincia: string,
    municipio: string,
    nombreVia: string,
    tipoVia: string,
    numero: string,
    escalera?: string,
    planta?: string,
    puerta?: string
  ): Promise<InmuebleResponse> {
    try {
      const params = new URLSearchParams({
        provincia,
        municipio,
        nombreVia,
        tipoVia,
        numero,
      });
      if (escalera) params.append('escalera', escalera);
      if (planta) params.append('planta', planta);
      if (puerta) params.append('puerta', puerta);

      const response = await apiFetch(`/CatastroApi/inmuebleLoc?${params.toString()}`) as CatastroApiResponse;
      // La API devuelve un objeto con inmuebles array, tomar el primero
      if (response.inmuebles && response.inmuebles.length > 0) {
        const inmueble = response.inmuebles[0];
        return {
          ...inmueble,
          rc: inmueble.referenciaCatastral?.referenciaCatastral,
        } as InmuebleResponse;
      }
      
      // Construir dirección para el mensaje de error
      const direccionCompleta = `${tipoVia ? tipoVia + ' ' : ''}${nombreVia}, ${numero}${escalera ? ', Esc. ' + escalera : ''}${planta ? ', Pl. ' + planta : ''}${puerta ? ', Puerta ' + puerta : ''}`;
      
      throw new Error(`No se encontró ningún inmueble en la dirección: ${direccionCompleta}\n\nPosibles causas:\n• La dirección no está registrada correctamente en el catastro\n• El número de calle es incorrecto o no existe\n• Los datos de escalera, planta o puerta no coinciden\n• El inmueble corresponde a un terreno u otro tipo de bien\n\n💡 Consejo: Intenta buscar sin especificar escalera, planta o puerta, o verifica la dirección en documentos oficiales. También puedes buscar por código catastral si lo conoces.`);
    } catch (error: any) {
      // Manejar error 403 específicamente primero
      if (error?.status === 403) {
        throw new Error('Error de autenticación con la API de Catastro.\n\nEl servicio no puede acceder a la información catastral debido a un problema de credenciales.\n\nPor favor, contacta con soporte técnico para verificar la configuración de la API de Catastro.');
      }
      
      // Si ya es un Error con mensaje descriptivo, relanzarlo
      if (error instanceof Error) {
        const message = error.message;
        
        // Si el mensaje ya contiene información útil, usarlo
        if (message.includes('No se encontró') || 
            message.includes('dirección') ||
            message.includes('Posibles causas') ||
            message.includes('Consejo')) {
          throw error;
        }
        
        // Manejar errores de red
        if (message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')) {
          throw new Error('No se pudo conectar con el servicio de catastro. Verifica tu conexión a internet e inténtalo de nuevo.');
        }
        
        // Errores de timeout
        if (message.includes('timeout') || message.includes('Timeout')) {
          throw new Error('La búsqueda está tardando demasiado. Por favor, espera unos segundos e inténtalo de nuevo.');
        }
      }
      
      throw new Error(`No se pudo obtener el inmueble por dirección.\n\nSi el problema persiste:\n• Verifica que todos los datos de la dirección sean correctos\n• Intenta buscar por código catastral si lo conoces\n• Intenta buscar por coordenadas si tienes acceso a ellas`);
    }
  }

  /**
   * Obtiene un inmueble por coordenadas (x, y)
   */
  static async getBuildingByCoordinates(x: string | number, y: string | number): Promise<InmuebleResponse> {
    try {
      // Validar formato de coordenadas
      const coordX = typeof x === 'string' ? parseFloat(x.trim()) : x;
      const coordY = typeof y === 'string' ? parseFloat(y.trim()) : y;
      
      if (isNaN(coordX) || isNaN(coordY)) {
        throw new Error('Las coordenadas deben ser números válidos. Por favor, verifica que hayas ingresado valores numéricos correctos.');
      }
      
      // Validar rangos de coordenadas geográficas (aproximados para España)
      if (coordX < -10 || coordX > 5 || coordY < 35 || coordY > 44) {
        throw new Error(`Las coordenadas (X: ${coordX}, Y: ${coordY}) están fuera del rango válido para España.\n\nVerifica que:\n• Las coordenadas estén en el sistema de referencia correcto\n• La longitud (X) debe estar aproximadamente entre -10 y 5\n• La latitud (Y) debe estar aproximadamente entre 35 y 44`);
      }
      
      const params = new URLSearchParams({
        x: String(coordX),
        y: String(coordY),
      });
      const response = await apiFetch(`/CatastroApi/inmuebleXY?${params.toString()}`) as CatastroApiResponse;
      
      // La API devuelve un objeto con inmuebles array, tomar el primero
      if (response.inmuebles && response.inmuebles.length > 0) {
        const inmueble = response.inmuebles[0];
        return {
          ...inmueble,
          rc: inmueble.referenciaCatastral?.referenciaCatastral,
        } as InmuebleResponse;
      }
      
      throw new Error(`No se encontró ningún inmueble en las coordenadas especificadas (X: ${coordX}, Y: ${coordY}).\n\nPosibles causas:\n• Las coordenadas no corresponden a un edificio registrado en el catastro\n• Las coordenadas corresponden a un terreno u otro tipo de bien inmueble\n• Las coordenadas están en un sistema de referencia diferente\n• El punto está fuera de la zona de cobertura del catastro\n\n💡 Consejo: Verifica que las coordenadas sean correctas y estén en el sistema de referencia adecuado. También puedes intentar buscar por dirección si la conoces.`);
    } catch (error: any) {
      // Manejar error 403 específicamente primero
      if (error?.status === 403) {
        throw new Error('Error de autenticación con la API de Catastro.\n\nEl servicio no puede acceder a la información catastral debido a un problema de credenciales.\n\nPor favor, contacta con soporte técnico para verificar la configuración de la API de Catastro.');
      }
      
      // Si ya es un Error con mensaje descriptivo, relanzarlo
      if (error instanceof Error) {
        const message = error.message;
        
        // Si el mensaje ya contiene información útil, usarlo
        if (message.includes('No se encontró') || 
            message.includes('coordenadas') ||
            message.includes('rango válido') ||
            message.includes('números válidos') ||
            message.includes('Posibles causas') ||
            message.includes('Consejo')) {
          throw error;
        }
        
        // Manejar errores de red
        if (message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')) {
          throw new Error('No se pudo conectar con el servicio de catastro. Verifica tu conexión a internet e inténtalo de nuevo.');
        }
        
        // Errores de timeout
        if (message.includes('timeout') || message.includes('Timeout')) {
          throw new Error('La búsqueda está tardando demasiado. Por favor, espera unos segundos e inténtalo de nuevo.');
        }
      }
      
      throw new Error(`No se pudo obtener el inmueble por coordenadas.\n\nSi el problema persiste:\n• Verifica que las coordenadas sean correctas y estén en el sistema adecuado\n• Intenta buscar por dirección si la conoces\n• Intenta buscar por código catastral si lo tienes`);
    }
  }

  /**
   * Geocodifica una dirección usando Nominatim
   */
  static async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'ActivoDigital/1.0'
          }
        }
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
      return null;
    } catch (error) {
      console.error('Error en geocodificación:', error);
      return null;
    }
  }

  /**
   * Mapea los datos de la API de catastro al formato esperado por el wizard
   */
  static async mapToBuildingData(inmueble: InmuebleResponse): Promise<CatastroBuildingData> {
    // Extraer dirección - puede venir como string o como objeto DireccionCatastro
    let address = '';
    let direccionObj: DireccionCatastro | null = null;
    
    if (typeof inmueble.direccion === 'string') {
      address = inmueble.direccion;
    } else if (inmueble.direccion) {
      direccionObj = inmueble.direccion as DireccionCatastro;
      // Usar direccionCompleta si está disponible
      if (direccionObj.direccionCompleta) {
        address = direccionObj.direccionCompleta;
      } else {
        // Construir dirección desde los campos
        const addressParts: string[] = [];
        if (direccionObj.tipoVia) addressParts.push(direccionObj.tipoVia);
        if (direccionObj.nombreVia) addressParts.push(direccionObj.nombreVia);
        if (direccionObj.numero) addressParts.push(direccionObj.numero);
        if (direccionObj.escalera) addressParts.push(`Esc. ${direccionObj.escalera}`);
        if (direccionObj.planta) addressParts.push(`Pl. ${direccionObj.planta}`);
        if (direccionObj.puerta) addressParts.push(`Puerta ${direccionObj.puerta}`);
        address = addressParts.join(' ');
      }
    }
    
    // Si no hay dirección, construir desde campos individuales (compatibilidad)
    if (!address) {
      const addressParts: string[] = [];
      if (inmueble.tipoVia) addressParts.push(inmueble.tipoVia);
      if (inmueble.nombreVia) addressParts.push(inmueble.nombreVia);
      if (inmueble.numero) addressParts.push(inmueble.numero);
      if (inmueble.escalera) addressParts.push(`Esc. ${inmueble.escalera}`);
      if (inmueble.planta) addressParts.push(`Pl. ${inmueble.planta}`);
      if (inmueble.puerta) addressParts.push(`Puerta ${inmueble.puerta}`);
      address = addressParts.join(' ');
    }
    
    // Construir nombre del edificio
    const rc = inmueble.rc || inmueble.referenciaCatastral?.referenciaCatastral || '';
    const name = address || `Inmueble ${rc}`.trim();

    // Extraer año de construcción
    let constructionYear: number | undefined;
    if (inmueble.datosEconomicos?.añoConstruccion) {
      const year = inmueble.datosEconomicos.añoConstruccion;
      constructionYear = typeof year === 'string' ? parseInt(year, 10) : year;
    } else {
      constructionYear = 
        inmueble.constructionYear || 
        inmueble.anyoConstruccion || 
        inmueble.anyo || 
        undefined;
    }

    // Mapear tipología desde datosEconomicos.uso
    let typology: 'residential' | 'mixed' | 'commercial' | undefined;
    const uso = (inmueble.datosEconomicos?.uso || inmueble.uso || inmueble.tipologia || '').toLowerCase();
    if (uso.includes('residencial') || uso.includes('vivienda') || uso.includes('viviendas')) {
      typology = 'residential';
    } else if (uso.includes('comercial') || uso.includes('comercio') || uso.includes('oficinas') || uso.includes('oficina')) {
      typology = 'commercial';
    } else if (uso.includes('mixto') || uso.includes('mixed')) {
      typology = 'mixed';
    } else {
      typology = inmueble.typology;
    }

    // Extraer coordenadas
    let lat: number | undefined;
    let lng: number | undefined;
    
    // Intentar diferentes campos posibles para coordenadas
    if (inmueble.lat != null && inmueble.lng != null) {
      lat = typeof inmueble.lat === 'string' ? parseFloat(inmueble.lat) : inmueble.lat;
      lng = typeof inmueble.lng === 'string' ? parseFloat(inmueble.lng) : inmueble.lng;
    } else if (inmueble.latitude != null && inmueble.longitude != null) {
      lat = typeof inmueble.latitude === 'string' ? parseFloat(inmueble.latitude) : inmueble.latitude;
      lng = typeof inmueble.longitude === 'string' ? parseFloat(inmueble.longitude) : inmueble.longitude;
    } else if (inmueble.x != null && inmueble.y != null) {
      const x = typeof inmueble.x === 'string' ? parseFloat(inmueble.x) : inmueble.x;
      const y = typeof inmueble.y === 'string' ? parseFloat(inmueble.y) : inmueble.y;
      
      // Asignamos las coordenadas tal como vienen
      // Podrían ser coordenadas geográficas o UTM/otro sistema
      lng = x;
      lat = y;
    } else if (inmueble.coordenadas) {
      // Si viene como objeto coordenadas
      const coords = inmueble.coordenadas;
      if (coords.lat != null && coords.lng != null) {
        lat = typeof coords.lat === 'string' ? parseFloat(coords.lat) : coords.lat;
        lng = typeof coords.lng === 'string' ? parseFloat(coords.lng) : coords.lng;
      }
    }
    
    // Validar que las coordenadas sean válidas (no 0,0 y dentro de rangos válidos)
    if (lat != null && lng != null) {
      if (lat === 0 && lng === 0) {
        console.warn('⚠️ Coordenadas son 0,0 - descartando');
        lat = undefined;
        lng = undefined;
      } else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn('⚠️ Coordenadas fuera de rango válido - descartando:', { lat, lng });
        lat = undefined;
        lng = undefined;
      }
    } else {
      console.warn('⚠️ No se encontraron coordenadas en la respuesta - se intentará geocodificar la dirección');
    }

    // Extraer superficie
    let squareMeters: number | undefined;
    if (inmueble.datosEconomicos?.superficieConstruida) {
      const superficie = inmueble.datosEconomicos.superficieConstruida;
      squareMeters = typeof superficie === 'string' ? parseFloat(superficie) : superficie;
    } else {
      squareMeters = inmueble.squareMeters || inmueble.superficie || inmueble.superficieConstruida;
    }
    
    // Contar unidades desde unidadesConstructivas
    let numUnits: number | undefined;
    if (inmueble.unidadesConstructivas && inmueble.unidadesConstructivas.length > 0) {
      numUnits = inmueble.unidadesConstructivas.length;
    } else {
      numUnits = inmueble.numUnits || inmueble.unidades || inmueble.viviendas;
    }
    
    // Extraer número de plantas desde unidadesConstructivas
    let numFloors: number | undefined;
    if (inmueble.unidadesConstructivas && inmueble.unidadesConstructivas.length > 0) {
      // Obtener plantas únicas, excluyendo plantas especiales como "SM" (sótano/ático)
      const plantasUnicas = new Set(
        inmueble.unidadesConstructivas
          .map(uc => uc.planta)
          .filter(p => {
            if (!p || p === '') return false;
            // Excluir plantas especiales que no son plantas normales
            const plantaLower = p.toString().toLowerCase();
            if (plantaLower === 'sm' || plantaLower === 'sótano' || plantaLower === 'atico') return false;
            // Incluir plantas numéricas (00, 01, 02, etc.) y negativas (-1, -2, etc.)
            return true;
          })
      );
      numFloors = plantasUnicas.size;
    } else {
      numFloors = inmueble.numFloors || inmueble.plantas || inmueble.plantasAltura;
    }

    // Si no hay coordenadas, intentar geocodificar la dirección
    if ((lat == null || lng == null) && address) {
      const geocoded = await this.geocodeAddress(address);
      if (geocoded) {
        lat = geocoded.lat;
        lng = geocoded.lng;
      } else {
        console.warn('⚠️ No se pudieron obtener coordenadas por geocodificación');
      }
    }

    // Extraer referencia catastral - asegurar que siempre se extraiga si está disponible
    let cadastralReference: string | undefined;
    if (inmueble.rc) {
      cadastralReference = inmueble.rc.trim();
    } else if (inmueble.referenciaCatastral?.referenciaCatastral) {
      cadastralReference = inmueble.referenciaCatastral.referenciaCatastral.trim();
    }
    // Solo asignar si tiene valor (no string vacío después del trim)
    cadastralReference = cadastralReference && cadastralReference.length > 0 ? cadastralReference : undefined;

    return {
      name,
      address,
      cadastralReference,
      constructionYear,
      typology,
      numFloors,
      numUnits,
      lat,
      lng,
      squareMeters,
    };
  }
}
