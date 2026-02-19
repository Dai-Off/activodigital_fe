import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { BuildingsApiService, type Building } from '../services/buildingsApi';
import { getBookByBuilding } from '../services/digitalbook';
import { getESGScore } from '../services/esg';
import { EnergyCertificatesService } from '../services/energyCertificates';
import { Badge } from './ui/badge';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { useLoadingState, SkeletonBase, SkeletonText } from './ui/LoadingSystem';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lightbulb, 
  Zap,
  Home,
  Wrench,
  TrendingUp,
  Info,
  Loader2,
  FileText,
  Target,
  BarChart3,
  Euro,
  Clock,
  Link2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '~/contexts/LanguageContext';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'red' | 'yellow' | 'green';
  category: 'energetico' | 'estructural' | 'normativo' | 'financiero';
  changes: string[];
  estimatedCost?: number;
  estimatedTime?: string;
  impactoPrevisto?: {
    tipo: string;
    valor: string;
  };
  rangoInversion?: [number, number];
  dependencias?: string[];
  notas?: string;
  semaforo?: 'verde' | 'amarillo' | 'rojo';
}

interface ChecklistResumen {
  diagnostico_previo?: string;
  diagnostico_tecnico?: string;
  diagnostico_energetico?: string;
  diagnostico_renovables?: string;
  accesibilidad_y_salubridad?: string;
  diagnostico_economico_financiero?: string;
  pasaporte_y_libro_digital?: string;
  obligaciones_plazo_EPBD?: string;
}

interface EBPDCompliance {
  complies: boolean;
  score: number;
  currentRating?: string; // Opcional - debe venir del certificado energético
  targetRating?: string; // Opcional - debe venir del análisis
  mainIssues: string[];
  recommendations: Recommendation[];
  fundamento?: string;
  referenciasLegales?: string[];
  cumplimientoActual?: string;
  cumplimientoProyectado2030?: string;
  semaforoGlobal?: 'verde' | 'amarillo' | 'rojo';
  checklistResumen?: ChecklistResumen;
  datosEntradaUtilizados?: {
    emisiones_kgco2_m2?: string;
    energia_primaria_kwh_m2?: string;
    esg_total_score?: number;
    esg_label?: string;
  };
}

// Respuesta del API - estructura completa
interface APIResponse {
  cumplimiento_actual: string;
  cumplimiento_proyectado_2030: string;
  fundamento: string;
  referencias_legales: string[];
  datos_entrada_utilizados?: {
    emisiones_kgco2_m2?: string;
    energia_primaria_kwh_m2?: string;
    esg_total_score?: number;
    esg_label?: string;
  };
  checklist_resumen?: ChecklistResumen;
  semaforo_global?: 'verde' | 'amarillo' | 'rojo';
  medidas_recomendadas: APIMedida[];
}

interface APIMedida {
  id: string;
  categoria: string;
  descripcion: string;
  impacto_previsto: {
    tipo: string;
    valor: string;
  };
  prioridad: number;
  rango_inversion_eur: [number, number];
  retorno_anios: string;
  dependencias: string[];
  notas: string;
  semaforo?: 'verde' | 'amarillo' | 'rojo';
}


const ASSESS_ENDPOINT = 'https://orquestador-clasificador-n8n-v2.fly.dev/webhook/arkia/ai/assess';

export default function BuildingAnalysisGeneral() {
  const { id } = useParams<{ id: string }>();
  const { loading, startLoading, stopLoading } = useLoadingState(true);
  const [building, setBuilding] = useState<Building | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState('');
  const [analysisLoaded, setAnalysisLoaded] = useState(false);
  
  const { t } = useLanguage()
  // Datos del análisis - solo datos reales del API, sin hardcodeo
  const [complianceData, setComplianceData] = useState<EBPDCompliance | null>(null);
  const [missingDataError, setMissingDataError] = useState<string | null>(null);
  
  // Ref para rastrear el id actual y evitar condiciones de carrera
  const currentIdRef = useRef<string | undefined>(id);

  // Limpiar estados cuando cambia el id del edificio
  useEffect(() => {
    // Actualizar la referencia del id actual
    currentIdRef.current = id;
    
    // Resetear todos los estados relacionados con el análisis
    setComplianceData(null);
    setAnalysisLoaded(false);
    setLoadingAnalysis(false);
    setAnalysisMessage('');
    setBuilding(null);
    
    // Cargar el nuevo edificio
    if (id) {
      loadBuilding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Cargar análisis después de que el building esté disponible
  useEffect(() => {
    // Verificar que el building cargado corresponde al id actual y que el id no ha cambiado
    const currentId = currentIdRef.current;
    
    // Cleanup function: cancelar cualquier operación si el id cambia
    return () => {
      // Si el id cambió, limpiar estados
      if (currentIdRef.current !== currentId) {
        console.log('🧹 Limpiando análisis porque el id cambió de', currentId, 'a', currentIdRef.current);
        setComplianceData(null);
        setAnalysisLoaded(false);
        setLoadingAnalysis(false);
        setAnalysisMessage('');
      }
    };
  }, [id]);

  // Cargar análisis después de que el building esté disponible (efecto separado)
  useEffect(() => {
    // Verificar que el building cargado corresponde al id actual y que el id no ha cambiado
    const currentId = currentIdRef.current;
    if (building && currentId && building.id === currentId && !analysisLoaded && !loadingAnalysis) {
      console.log('🔄 Iniciando carga de análisis para edificio:', currentId, 'building.id:', building.id);
      // Primero intentar cargar desde localStorage con el id actual
      const cachedData = loadAnalysisFromCache(currentId);
      if (cachedData) {
        // Verificar nuevamente que el id no ha cambiado antes de establecer los datos
        if (currentIdRef.current === currentId && building.id === currentId) {
          console.log('✅ Análisis cargado desde cache para edificio:', currentId);
          setComplianceData(cachedData);
          setAnalysisLoaded(true);
          setLoadingAnalysis(false);
        } else {
          console.log('⚠️ El id cambió durante la carga del cache, cancelando', {
            currentIdRef: currentIdRef.current,
            currentId,
            buildingId: building.id
          });
        }
      } else {
        // Verificar nuevamente que el id no ha cambiado antes de cargar del API
        if (currentIdRef.current === currentId && building.id === currentId) {
          console.log('📡 No hay cache, cargando análisis del API para edificio:', currentId);
          loadAnalysis();
        } else {
          console.log('⚠️ El id cambió antes de cargar del API, cancelando', {
            currentIdRef: currentIdRef.current,
            currentId,
            buildingId: building.id
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [building, id]);

  const loadBuilding = async () => {
    if (!id) return;
    startLoading();
    try {
      const data = await BuildingsApiService.getBuildingById(id);
      setBuilding(data);
    } catch (error) {
      console.error('Error loading building:', error);
    } finally {
      stopLoading();
    }
  };

  // Cargar análisis desde localStorage
  const loadAnalysisFromCache = (buildingId: string): EBPDCompliance | null => {
    try {
      const cacheKey = `ebpd_analysis_${buildingId}`;
      console.log('🔍 Buscando cache con clave:', cacheKey, 'para edificio:', buildingId);
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const parsed = JSON.parse(cached);
        // Verificar que tenga timestamp y datos válidos
        if (parsed.data && parsed.timestamp) {
          // Opcional: invalidar cache después de X horas (por ejemplo, 24 horas)
          const cacheAge = Date.now() - parsed.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
          
          if (cacheAge < maxAge) {
            console.log('✅ Cargando análisis desde cache para edificio:', buildingId);
            return parsed.data;
          } else {
            console.log('⚠️ Cache expirado para edificio:', buildingId, 'se recargará del servidor');
            localStorage.removeItem(cacheKey);
          }
        }
      } else {
        console.log('ℹ️ No se encontró cache para edificio:', buildingId);
      }
    } catch (error) {
      console.warn('Error cargando cache para edificio:', buildingId, error);
    }
    return null;
  };

  // Guardar análisis en localStorage
  const saveAnalysisToCache = (buildingId: string, data: EBPDCompliance) => {
    const cacheKey = `ebpd_analysis_${buildingId}`;
    console.log('💾 Guardando análisis en cache con clave:', cacheKey, 'para edificio:', buildingId);
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log('✅ Análisis guardado en cache para edificio:', buildingId);
    } catch (error) {
      console.warn('Error guardando en cache:', error);
      // Si localStorage está lleno, intentar limpiar caches antiguos
      try {
        const keys = Object.keys(localStorage);
        const analysisKeys = keys.filter(k => k.startsWith('ebpd_analysis_'));
        if (analysisKeys.length > 10) {
          // Eliminar los más antiguos
          const keyTimestamps = analysisKeys.map(key => {
            try {
              const cached = localStorage.getItem(key);
              if (cached) {
                const parsed = JSON.parse(cached);
                return { key, timestamp: parsed.timestamp || 0 };
              }
            } catch {
              return { key, timestamp: 0 };
            }
            return { key, timestamp: 0 };
          });
          keyTimestamps.sort((a, b) => a.timestamp - b.timestamp);
          // Eliminar los 5 más antiguos
          keyTimestamps.slice(0, 5).forEach(({ key }) => {
            localStorage.removeItem(key);
          });
          // Intentar guardar de nuevo
          const retryCacheData = {
            data,
            timestamp: Date.now(),
          };
          localStorage.setItem(cacheKey, JSON.stringify(retryCacheData));
        }
      } catch (cleanupError) {
        console.warn('Error en limpieza de cache:', cleanupError);
      }
    }
  };

  // Formatear texto: quitar guiones bajos y capitalizar
  const formatText = (text: string | undefined | null): string => {
    if (!text) return '-';
    return text
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Verificar que todos los datos críticos estén presentes antes de ejecutar el análisis
  const validateRequiredData = async (buildingId: string): Promise<{ valid: boolean; missingData: string[] }> => {
    const missingData: string[] = [];
    
    try {
      // Verificar libro digital
      const digitalBook = await getBookByBuilding(buildingId).catch(() => null);
      if (!digitalBook || !digitalBook.status) {
        missingData.push('Libro digital del edificio');
      }
      
      // Verificar certificado energético
      const certificatesData = await EnergyCertificatesService.getByBuilding(buildingId).catch(() => null);
      const certificate = certificatesData?.certificates?.[0];
      if (!certificate) {
        missingData.push('Certificado energético (CEE)');
      } else {
        if (!certificate.rating) {
          missingData.push('Rating del certificado energético');
        }
        if (!certificate.primaryEnergyKwhPerM2Year) {
          missingData.push('Consumo energético primario (kWh/m²·año)');
        }
        if (!certificate.emissionsKgCo2PerM2Year) {
          missingData.push('Emisiones CO₂ (kg CO₂eq/m²·año)');
        }
      }
      
      // Verificar ESG completo
      const esgResult = await getESGScore(buildingId).catch(() => null);
      if (!esgResult || esgResult.status !== 'complete') {
        if (esgResult?.status === 'incomplete' && esgResult.missingData) {
          // Agregar cada dato faltante del ESG como elemento separado
          esgResult.missingData.forEach((item: string) => {
            missingData.push(item);
          });
        } else {
          missingData.push('Score ESG completo');
        }
      }
    } catch (error) {
      console.error('Error validando datos:', error);
      missingData.push('Error al verificar datos');
    }
    
    return {
      valid: missingData.length === 0,
      missingData
    };
  };

  const loadAnalysis = async () => {
    const currentId = currentIdRef.current;
    if (!currentId || !building) {
      console.log('⚠️ No se puede cargar análisis: id o building faltante', { id: currentId, building: building?.id });
      return;
    }
    
    // Verificar que el building corresponde al id actual
    if (building.id !== currentId) {
      console.log('⚠️ El building no corresponde al id actual, cancelando carga', { 
        buildingId: building.id, 
        currentId: currentId 
      });
      return;
    }
    
    // Verificar nuevamente que el id no ha cambiado
    if (currentIdRef.current !== currentId) {
      console.log('⚠️ El id cambió durante la verificación, cancelando carga');
      return;
    }
    
    // VALIDAR DATOS CRÍTICOS ANTES DE EJECUTAR EL ANÁLISIS
    console.log('🔍 Validando datos críticos para edificio:', currentId);
    const validation = await validateRequiredData(currentId);
    
    if (!validation.valid) {
      console.log('❌ Faltan datos críticos, no se puede ejecutar el análisis:', validation.missingData);
      // Guardar los datos faltantes para mostrarlos en una lista
      setMissingDataError(validation.missingData.join('|')); // Usar separador especial para parsear después
      setLoadingAnalysis(false);
      setAnalysisLoaded(true); // Marcar como "cargado" para evitar reintentos
      return;
    }
    
    // Limpiar error si los datos están completos
    setMissingDataError(null);
    
    console.log('🚀 Iniciando análisis EBPD para edificio:', currentId);
    setLoadingAnalysis(true);
    setAnalysisMessage(t("analysisMessage"));
    
    try {
      // Obtener token de Supabase
      const token = 
        window.sessionStorage.getItem('access_token') || 
        window.localStorage.getItem('access_token') || 
        '';

      // El servidor espera el payload directamente (table, type, record)
      const payload = {
        table: "buildings",
        type: "UPDATE",
        record: {
          id: currentId, // ID del registro en la tabla
          building_id: currentId, // ID del edificio
        }
      };

      console.log('📤 Enviando análisis EBPD para edificio:', currentId, payload);

      // Preparar headers con el secreto requerido por n8n
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'x-supa-secret': 'arkia-ai-12345', // Secreto requerido por el servidor n8n
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // SIN TIMEOUT - La API puede tardar lo que necesite
      const res = await fetch(ASSESS_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      // Leer el cuerpo de la respuesta antes de verificar el status
      let responseText = '';
      let responseData: APIResponse[] | null = null;
      
      try {
        responseText = await res.text();
        console.log('📥 Respuesta RAW del servidor (status:', res.status, '):', responseText.substring(0, 1000));
        
        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
            console.log('📥 Respuesta parseada:', responseData);
          } catch (parseError) {
            // Si no es JSON, puede ser un mensaje de error en texto plano
            console.warn('⚠️ Respuesta no es JSON válido:', responseText);
            throw new Error(`Respuesta del servidor no es JSON válido: ${responseText.substring(0, 200)}`);
          }
        }
      } catch (readError) {
        console.error('❌ Error leyendo respuesta:', readError);
        throw new Error(`Error al leer respuesta del servidor: ${readError}`);
      }

      if (!res.ok) {
        // Intentar extraer mensaje de error de diferentes formatos
        let errorMessage = res.statusText;
        
        if (responseData) {
          if (typeof responseData === 'object') {
            if ('message' in responseData) {
              errorMessage = (responseData as any).message;
            } else if ('error' in responseData) {
              errorMessage = (responseData as any).error;
            } else if (Array.isArray(responseData) && responseData.length > 0 && typeof responseData[0] === 'object') {
              const firstItem = responseData[0] as any;
              if (firstItem.error || firstItem.message) {
                errorMessage = firstItem.error || firstItem.message;
              }
            }
          }
        } else if (responseText) {
          errorMessage = responseText.substring(0, 200);
        }
        
        console.error('❌ Error del servidor:', {
          status: res.status,
          statusText: res.statusText,
          body: responseText?.substring(0, 500),
          parsed: responseData
        });
        
        throw new Error(`Error ${res.status}: ${errorMessage}`);
      }

      // Verificar que la respuesta tenga el formato esperado
      if (!responseData) {
        console.error('❌ Respuesta vacía o nula');
        throw new Error('La respuesta del servidor está vacía');
      }

      console.log('🔍 Tipo de respuesta:', Array.isArray(responseData) ? 'Array' : typeof responseData);
      console.log('🔍 Contenido completo:', JSON.stringify(responseData, null, 2));

      // El endpoint puede devolver un array con estructura message.content o un objeto directo
      let analysisData: APIResponse | null = null;
      
      if (Array.isArray(responseData)) {
        if (responseData.length === 0) {
          console.error('❌ Array vacío en respuesta');
          throw new Error('La respuesta del servidor contiene un array vacío');
        }
        
        // Verificar si es la nueva estructura con message.content
        const firstItem = responseData[0] as any;
        if (firstItem?.message?.content) {
          // Nueva estructura: array con objetos que tienen message.content
          analysisData = firstItem.message.content as APIResponse;
          console.log('✅ Datos extraídos de message.content:', analysisData);
        } else if ('cumplimiento_actual' in firstItem || 'medidas_recomendadas' in firstItem) {
          // Estructura antigua: array directo con los datos
          analysisData = firstItem as APIResponse;
        console.log('✅ Datos extraídos del array (índice 0):', analysisData);
        } else {
          console.error('❌ Formato de array no reconocido');
          throw new Error('Formato de respuesta no reconocido');
        }
      } else if (typeof responseData === 'object') {
        // Verificar si tiene los campos esperados directamente
        if ('cumplimiento_actual' in responseData || 'medidas_recomendadas' in responseData) {
          analysisData = responseData as APIResponse;
          console.log('✅ Datos extraídos como objeto directo:', analysisData);
        } else if ((responseData as any)?.message?.content) {
          // Estructura con message.content en objeto único
          analysisData = (responseData as any).message.content as APIResponse;
          console.log('✅ Datos extraídos de message.content (objeto):', analysisData);
        } else {
          // Puede ser un objeto con los datos dentro
          console.log('🔍 Buscando datos dentro del objeto...');
          const possibleKeys = Object.keys(responseData);
          console.log('🔍 Claves disponibles:', possibleKeys);
          
          // Intentar encontrar los datos en alguna propiedad
          for (const key of possibleKeys) {
            const value = (responseData as any)[key];
            if (Array.isArray(value) && value.length > 0) {
              const firstArrayItem = value[0];
              if (typeof firstArrayItem === 'object') {
                if (firstArrayItem?.message?.content) {
                  analysisData = firstArrayItem.message.content as APIResponse;
                  console.log(`✅ Datos encontrados en propiedad "${key}" (message.content):`, analysisData);
                  break;
                } else if ('cumplimiento_actual' in firstArrayItem) {
                  analysisData = firstArrayItem as APIResponse;
              console.log(`✅ Datos encontrados en propiedad "${key}":`, analysisData);
              break;
                }
              }
            } else if (typeof value === 'object' && value) {
              if (value.message?.content) {
                analysisData = value.message.content as APIResponse;
                console.log(`✅ Datos encontrados en propiedad "${key}" (message.content):`, analysisData);
                break;
              } else if ('cumplimiento_actual' in value) {
              analysisData = value as APIResponse;
              console.log(`✅ Datos encontrados en propiedad "${key}":`, analysisData);
              break;
              }
            }
          }
        }
      }

      if (!analysisData) {
        console.error('❌ No se pudo extraer datos del análisis. Respuesta completa:', responseData);
        throw new Error('No se pudo extraer los datos del análisis de la respuesta del servidor');
      }

      console.log('✅ Datos del análisis extraídos correctamente:', analysisData);

      // Mapear respuesta del API a nuestra estructura
      let mappedData: EBPDCompliance;
      try {
        mappedData = mapAPIResponseToCompliance(analysisData);
        console.log('✅ Datos mapeados correctamente:', mappedData);
      } catch (mapError) {
        console.error('❌ Error mapeando datos:', mapError);
        throw new Error(`Error procesando datos del análisis: ${mapError}`);
      }
      
      // Verificar nuevamente que el id no ha cambiado antes de guardar
      const finalId = currentIdRef.current;
      if (finalId !== currentId) {
        console.log('⚠️ El id cambió durante el análisis, descartando resultados');
        setLoadingAnalysis(false);
        setAnalysisMessage('');
        return;
      }

      // Actualizar estados de forma síncrona
      console.log('🔄 Actualizando estados con datos recibidos para edificio:', finalId);
      
      // Guardar en localStorage primero
      if (finalId) {
        try {
          saveAnalysisToCache(finalId, mappedData);
        } catch (cacheError) {
          console.warn('⚠️ Error guardando en cache (no crítico):', cacheError);
        }
      }
      
      // Verificar una última vez que el id no ha cambiado antes de actualizar estados
      if (currentIdRef.current === finalId) {
        // Actualizar TODOS los estados de una vez para forzar re-render
        setComplianceData(mappedData);
        setAnalysisMessage('');
        setAnalysisLoaded(true);
        setLoadingAnalysis(false);
        
        console.log('✅ Estados actualizados para edificio:', finalId);
      } else {
        console.log('⚠️ El id cambió justo antes de actualizar estados, descartando');
        setLoadingAnalysis(false);
        setAnalysisMessage('');
      }
    } catch (error) {
      // Log del error para debugging
      const errorId = currentIdRef.current;
      console.error('❌ Error cargando análisis EBPD para edificio:', errorId, error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Si hay error, detener el loading pero mostrar mensaje
      setLoadingAnalysis(false);
      setAnalysisMessage('Error al generar el análisis. Por favor, recarga la página.');
      
      // Intentar cargar desde cache si hay error y el id no ha cambiado
      if (errorId && currentIdRef.current === errorId) {
        const cachedData = loadAnalysisFromCache(errorId);
        if (cachedData) {
          console.log('✅ Cargando datos desde cache después de error para edificio:', errorId);
          setComplianceData(cachedData);
          setAnalysisLoaded(true);
          setAnalysisMessage('');
        }
      }
    }
  };

  const mapAPIResponseToCompliance = (apiData: APIResponse): EBPDCompliance => {
    // Determinar si cumple basado en cumplimiento_actual
    // Solo cumple si es exactamente "cumple" o "cumple_completamente"
    // "parcialmente_cumple", "no_cumple", "incierto" = NO cumple
    const cumplimientoLower = apiData.cumplimiento_actual?.toLowerCase().trim() || '';
    const complies = cumplimientoLower === 'cumple' || 
                     cumplimientoLower === 'cumple_completamente' ||
                     cumplimientoLower === 'cumple completamente';
    
    console.log('🔍 Análisis de cumplimiento:', {
      cumplimiento_actual: apiData.cumplimiento_actual,
      cumplimientoLower,
      complies
    });

    // Extraer issues del fundamento
    const mainIssues: string[] = [];
    if (apiData.fundamento) {
      // Dividir el fundamento en oraciones y extraer los puntos clave
      const sentences = apiData.fundamento.split(/[.!?]+/).filter(s => s.trim().length > 0);
      sentences.forEach(sentence => {
        if (sentence.toLowerCase().includes('no') || 
            sentence.toLowerCase().includes('falta') || 
            sentence.toLowerCase().includes('no es posible')) {
          mainIssues.push(sentence.trim());
        }
      });
      // Si no encontramos issues específicos, usar el fundamento completo
      if (mainIssues.length === 0) {
        mainIssues.push(apiData.fundamento.substring(0, 200) + '...');
      }
    }

    // Mapear medidas recomendadas
    const recommendations: Recommendation[] = (apiData.medidas_recomendadas || [])
      .filter(m => m && m.descripcion && m.descripcion.trim() !== '') // Filtrar medidas vacías
      .map((medida, index) => {
        // Determinar prioridad basada en el semáforo si está disponible, sino usar el número de prioridad
        let priority: 'red' | 'yellow' | 'green' = 'green';
        if (medida.semaforo) {
          // Mapear semáforo a prioridad
          if (medida.semaforo === 'rojo') {
            priority = 'red';
          } else if (medida.semaforo === 'amarillo') {
            priority = 'yellow';
          } else {
            priority = 'green';
          }
        } else if (medida.prioridad <= 3) {
          priority = 'red';
        } else if (medida.prioridad <= 6) {
          priority = 'yellow';
        }

        // Mapear categoría
        let category: 'energetico' | 'estructural' | 'normativo' | 'financiero' = 'energetico';
        const catLower = medida.categoria?.toLowerCase() || '';
        if (catLower.includes('estructural') || catLower.includes('estructura')) {
          category = 'estructural';
        } else if (catLower.includes('normativo') || catLower.includes('legal')) {
          category = 'normativo';
        } else if (catLower.includes('financiero') || catLower.includes('economico')) {
          category = 'financiero';
        }

        // Extraer cambios de la descripción o notas
        const changes: string[] = [];
        if (medida.descripcion) {
          // Intentar dividir la descripción en puntos
          const descLines = medida.descripcion.split(/[•\-\n]/).filter(l => l.trim().length > 0);
          changes.push(...descLines.slice(0, 3).map(l => l.trim()));
        }
        if (changes.length === 0 && medida.notas) {
          changes.push(medida.notas);
        }
        if (changes.length === 0) {
          changes.push(medida.descripcion || 'Mejora recomendada');
        }

        // Calcular costo estimado (promedio del rango)
        const estimatedCost = medida.rango_inversion_eur && medida.rango_inversion_eur.length === 2
          ? Math.round((medida.rango_inversion_eur[0] + medida.rango_inversion_eur[1]) / 2)
          : undefined;

        // Formatear textos para quitar guiones bajos
        const descripcionFormateada = medida.descripcion ? formatText(medida.descripcion) : '';
        const notasFormateadas = medida.notas ? formatText(medida.notas) : '';
        const changesFormateados = changes.map(change => formatText(change));

        return {
          id: medida.id || `rec-${index}`,
          title: descripcionFormateada?.split('.')[0] || descripcionFormateada || `Medida ${index + 1}`,
          description: descripcionFormateada || notasFormateadas || 'Mejora recomendada',
          priority,
          category,
          changes: changesFormateados,
          estimatedCost,
          estimatedTime: medida.retorno_anios ? `${medida.retorno_anios} años` : undefined,
          impactoPrevisto: medida.impacto_previsto ? {
            tipo: formatText(medida.impacto_previsto.tipo),
            valor: formatText(medida.impacto_previsto.valor)
          } : undefined,
          rangoInversion: medida.rango_inversion_eur,
          dependencias: medida.dependencias?.map(dep => formatText(dep)),
          notas: notasFormateadas,
          semaforo: medida.semaforo,
        };
      });

    // Calcular score basado en cumplimiento (sin hardcodeo, solo aproximación si no viene del API)
    // El score se puede calcular basado en el semáforo global si está disponible
    let score: number;
    if (apiData.semaforo_global === 'verde') {
      score = 80;
    } else if (apiData.semaforo_global === 'amarillo') {
      score = 50;
    } else if (apiData.semaforo_global === 'rojo') {
      score = 30;
    } else {
      // Fallback basado en cumplimiento_actual
    if (complies) {
      score = 75;
      } else if (cumplimientoLower.includes('parcial')) {
      score = 45;
      } else if (cumplimientoLower.includes('incierto')) {
        score = 40;
    } else {
        score = 25;
      }
    }

    // No hardcodear ratings - solo mostrar si vienen del API o dejarlos vacíos
    // Los ratings energéticos deberían venir del certificado energético del edificio
    // Por ahora los dejamos como opcionales o los obtenemos del building si está disponible

    return {
      complies,
      score,
      currentRating: '', // No hardcodear - debe venir del certificado energético del edificio
      targetRating: '', // No hardcodear - debe venir del análisis o ser calculado
      mainIssues: mainIssues.length > 0 ? mainIssues : [],
      recommendations,
      fundamento: apiData.fundamento,
      referenciasLegales: apiData.referencias_legales,
      cumplimientoActual: apiData.cumplimiento_actual,
      cumplimientoProyectado2030: apiData.cumplimiento_proyectado_2030,
      semaforoGlobal: apiData.semaforo_global,
      checklistResumen: apiData.checklist_resumen,
      datosEntradaUtilizados: apiData.datos_entrada_utilizados,
    };
  };

  const getPriorityConfig = (priority: 'red' | 'yellow' | 'green') => {
    switch (priority) {
      case 'red':
        return {
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-gray-200',
          icon: XCircle,
          label: 'Urgente'
        };
      case 'yellow':
        return {
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-gray-200',
          icon: AlertTriangle,
          label: 'Importante'
        };
      case 'green':
        return {
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-gray-200',
          icon: CheckCircle2,
          label: 'Recomendado'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energetico':
        return <Zap className="w-4 h-4 text-gray-600" />;
      case 'estructural':
        return <Home className="w-4 h-4 text-gray-600" />;
      case 'normativo':
        return <Info className="w-4 h-4 text-gray-600" />;
      case 'financiero':
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
      default:
        return <Wrench className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Mostrar valor o placeholder
  const displayValue = (value: string | number | undefined | null, type: 'text' | 'number' = 'text'): string => {
    if (value === null || value === undefined || value === '') {
      return type === 'number' ? '0' : '-';
    }
    if (type === 'number' && typeof value === 'number') {
      return value.toString();
    }
    return String(value);
  };

  // Spinner dentro del área de contenido (respeta la sidebar)
  // Solo mostrar spinner si realmente está cargando O si no hay datos Y está intentando cargar
  const shouldShowSpinner = loading || (loadingAnalysis && !complianceData && !missingDataError) || (!complianceData && !analysisLoaded && !missingDataError);
  
  // Mostrar error si faltan datos críticos
  if (missingDataError && analysisLoaded) {
    // Parsear los datos faltantes (separados por |)
    const missingItems = missingDataError.split('|').filter(Boolean).map(item => item.trim());
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  No se puede realizar la auditoría técnica
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Faltan datos críticos necesarios para generar el análisis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {missingItems.length > 0 && (
              <div className="bg-white rounded-lg border border-amber-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Datos faltantes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {missingItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="flex-1 break-words">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
              <p className="text-sm text-gray-700">
                <strong className="font-semibold text-gray-900">Solución:</strong> Complete el libro digital, el certificado energético y asegúrese de que el ESG esté calculado correctamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (shouldShowSpinner) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-gray-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {loading ? t("loadingBuilding") : analysisMessage || t("analysisMessageBuilding")}
        </p>
        <p className="text-sm text-gray-500">
          {t("analysisMessageDesc")}
        </p>
      </div>
    );
  }

  // Skeleton de carga (ya no se usa, pero lo dejamos por si acaso)
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="mb-6 space-y-2">
          <SkeletonBase className="h-8 w-64" />
          <SkeletonBase className="h-4 w-48" />
        </div>

        {/* Estado de Cumplimiento Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2 flex-1">
              <SkeletonBase className="h-6 w-64" />
              <SkeletonBase className="h-4 w-96" />
            </div>
            <SkeletonBase className="h-8 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <SkeletonBase className="h-4 w-24 mb-2" />
                <SkeletonBase className="h-8 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de Recomendaciones Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-2 mb-6">
            <SkeletonBase className="h-6 w-48" />
            <SkeletonBase className="h-4 w-72" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <SkeletonBase className="h-4 w-20 mb-2" />
                <SkeletonBase className="h-8 w-12" />
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <SkeletonBase className="h-4 w-32 mb-2" />
            <SkeletonBase className="h-8 w-40" />
          </div>
        </div>

        {/* Recomendaciones Skeleton */}
        <div className="space-y-4">
          <SkeletonBase className="h-6 w-64" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-4">
                <SkeletonBase className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <SkeletonBase className="h-6 w-48" />
                    <SkeletonBase className="h-5 w-20 rounded-full" />
                  </div>
                  <SkeletonBase className="h-4 w-full" />
                  <SkeletonBase className="h-4 w-3/4" />
                </div>
              </div>
              <div className="space-y-3">
                <SkeletonBase className="h-4 w-32" />
                <SkeletonText lines={3} widths={['w-full', 'w-5/6', 'w-4/6']} />
                <div className="flex gap-4 pt-2 border-t border-gray-200">
                  <SkeletonBase className="h-4 w-32" />
                  <SkeletonBase className="h-4 w-28" />
                  <SkeletonBase className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Edificio no encontrado</div>
      </div>
    );
  }

  // Si no hay datos pero ya intentamos cargar y no está cargando, mostrar mensaje de error
  if (!complianceData && analysisLoaded && !loadingAnalysis) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          No se pudo cargar el análisis
        </p>
        <p className="text-sm text-gray-500">
          {analysisMessage || 'Por favor, intenta recargar la página'}
        </p>
      </div>
    );
  }

  if (!complianceData) {
    return null;
  }

  const totalCost = complianceData.recommendations.reduce((sum, rec) => {
    if (rec.rangoInversion && rec.rangoInversion.length === 2) {
      return sum + Math.round((rec.rangoInversion[0] + rec.rangoInversion[1]) / 2);
    }
    return sum + (rec.estimatedCost || 0);
  }, 0);

  const getSemaforoConfig = (semaforo: 'verde' | 'amarillo' | 'rojo' | undefined) => {
    switch (semaforo) {
      case 'verde':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
          border: 'border-green-200',
          icon: CheckCircle2,
          iconColor: 'text-green-600',
          text: 'text-green-900',
          label: 'Cumplimiento Adecuado',
          dot: 'bg-green-500'
        };
      case 'amarillo':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
          border: 'border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          text: 'text-yellow-900',
          label: 'Cumplimiento Parcial',
          dot: 'bg-yellow-500'
        };
      case 'rojo':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-rose-50',
          border: 'border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600',
          text: 'text-red-900',
          label: 'Requiere Atención',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          border: 'border-gray-200',
          icon: Info,
          iconColor: 'text-gray-600',
          text: 'text-gray-900',
          label: 'Sin evaluación',
          dot: 'bg-gray-500'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  {building.name}
                </CardTitle>
                <CardDescription className="text-sm flex items-center gap-2 text-gray-600">
                  <FileText className="w-4 h-4" />
                  Análisis General - Cumplimiento EBPD
                </CardDescription>
            {complianceData.cumplimientoActual && (
                  <div className="flex items-center gap-3 pt-2">
                    <Badge variant="outline" className="text-xs">
                      Estado: {formatText(complianceData.cumplimientoActual)}
                    </Badge>
                {complianceData.cumplimientoProyectado2030 && (
                      <>
                        <span className="text-gray-400">•</span>
                        <Badge variant="outline" className="text-xs">
                          2030: {formatText(complianceData.cumplimientoProyectado2030)}
                        </Badge>
                      </>
                    )}
                  </div>
            )}
          </div>
          <Badge 
                className={`text-sm font-medium px-4 py-2 ${
              complianceData.complies 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            {complianceData.complies ? 'CUMPLE' : 'NO CUMPLE'}
          </Badge>
        </div>
          </CardHeader>
        </Card>

        {/* Estado de Cumplimiento */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <CardTitle className="text-xl font-semibold">Estado de Cumplimiento EBPD</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Evaluación del cumplimiento de la Directiva de Eficiencia Energética de Edificios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Métricas principales */}
            <div className={`grid gap-4 ${complianceData.currentRating || complianceData.targetRating ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-1'}`}>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Puntuación Actual
                </p>
                <p className="text-3xl font-bold text-gray-900">{displayValue(complianceData.score, 'number')}/100</p>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-600 rounded-full"
                    style={{ width: `${complianceData.score}%` }}
                  ></div>
                </div>
              </div>
              {complianceData.currentRating && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Clase Energética Actual
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{displayValue(complianceData.currentRating)}</p>
                </div>
              )}
              {complianceData.targetRating && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Clase Objetivo
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{displayValue(complianceData.targetRating)}</p>
                </div>
              )}
            </div>

          {!complianceData.complies && (
              <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-900 font-semibold">El edificio no cumple con los requisitos EBPD</AlertTitle>
                <AlertDescription className="text-red-800 mt-2">
                  <ul className="list-disc list-inside space-y-2">
                  {complianceData.mainIssues.map((issue, index) => (
                      <li key={index} className="leading-relaxed">{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Fundamentación */}
          {complianceData.fundamento && (
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  Fundamentación del análisis
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{complianceData.fundamento}</p>
            </div>
          )}

          {/* Referencias legales */}
          {complianceData.referenciasLegales && complianceData.referenciasLegales.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  Referencias legales
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                {complianceData.referenciasLegales.map((ref, index) => (
                    <li key={index} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>{ref}</span>
                    </li>
                ))}
              </ul>
            </div>
          )}
          </CardContent>
        </Card>

        {/* Semáforo Global */}
        {complianceData.semaforoGlobal && (() => {
          const semaforoConfig = getSemaforoConfig(complianceData.semaforoGlobal);
          const Icon = semaforoConfig.icon;
          return (
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${semaforoConfig.dot} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Semáforo Global</p>
                    <p className={`text-lg font-semibold ${semaforoConfig.text}`}>
                      {formatText(semaforoConfig.label)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Checklist Resumen */}
        {complianceData.checklistResumen && (
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-xl font-semibold">Checklist de Cumplimiento</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(complianceData.checklistResumen).map(([key, value]) => {
                  if (!value) return null;
                  const getStatusConfig = (status: string) => {
                    if (status?.toLowerCase().includes('cumple') && !status?.toLowerCase().includes('no')) {
                      return {
                        bg: 'bg-green-50',
                        border: 'border-green-200',
                        text: 'text-green-900',
                        icon: CheckCircle2,
                        iconColor: 'text-green-600',
                        iconBg: 'bg-green-100'
                      };
                    } else if (status?.toLowerCase().includes('parcial')) {
                      return {
                        bg: 'bg-yellow-50',
                        border: 'border-yellow-200',
                        text: 'text-yellow-900',
                        icon: AlertTriangle,
                        iconColor: 'text-yellow-600',
                        iconBg: 'bg-yellow-100'
                      };
                    } else {
                      return {
                        bg: 'bg-red-50',
                        border: 'border-red-200',
                        text: 'text-red-900',
                        icon: XCircle,
                        iconColor: 'text-red-600',
                        iconBg: 'bg-red-100'
                      };
                    }
                  };

                  const statusConfig = getStatusConfig(value);
                  const StatusIcon = statusConfig.icon;

                  const labelMap: Record<string, string> = {
                    diagnostico_previo: 'Diagnóstico Previo',
                    diagnostico_tecnico: 'Diagnóstico Técnico',
                    diagnostico_energetico: 'Diagnóstico Energético',
                    diagnostico_renovables: 'Diagnóstico Renovables',
                    accesibilidad_y_salubridad: 'Accesibilidad y Salubridad',
                    diagnostico_economico_financiero: 'Diagnóstico Económico-Financiero',
                    pasaporte_y_libro_digital: 'Pasaporte y Libro Digital',
                    obligaciones_plazo_EPBD: 'Obligaciones Plazo EPBD',
                  };

                  return (
                    <div key={key} className={`p-3 rounded-lg border ${statusConfig.bg} ${statusConfig.border}`}>
                      <div className="flex items-start gap-2">
                        <div className={`p-1.5 ${statusConfig.iconBg} rounded flex-shrink-0`}>
                          <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold ${statusConfig.text} mb-1`}>
                            {labelMap[key] || key}
                          </h4>
                          <p className="text-xs text-gray-700">{formatText(value)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Datos de Entrada Utilizados */}
        {complianceData.datosEntradaUtilizados && (
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-xl font-semibold">Datos de Entrada Utilizados</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">Emisiones CO₂</p>
                  <p className="text-xl font-bold text-gray-900">
                    {displayValue(complianceData.datosEntradaUtilizados.emisiones_kgco2_m2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kgCO₂/m²</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">Energía Primaria</p>
                  <p className="text-xl font-bold text-gray-900">
                    {displayValue(complianceData.datosEntradaUtilizados.energia_primaria_kwh_m2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">kWh/m²·año</p>
                </div>
                {complianceData.datosEntradaUtilizados.esg_total_score !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">Score ESG</p>
                    <p className="text-xl font-bold text-gray-900">
                      {displayValue(complianceData.datosEntradaUtilizados.esg_total_score, 'number')}/100
                    </p>
                    <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-600 rounded-full"
                        style={{ width: `${complianceData.datosEntradaUtilizados.esg_total_score || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">Etiqueta ESG</p>
                  <p className="text-xl font-bold text-gray-900">
                    {displayValue(complianceData.datosEntradaUtilizados.esg_label)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumen de Recomendaciones */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-gray-600" />
              <CardTitle className="text-xl font-semibold">Plan de Mejoras Recomendado</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Recomendaciones priorizadas para alcanzar el cumplimiento EBPD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Urgentes</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {complianceData.recommendations.filter(r => r.priority === 'red').length}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Importantes</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {complianceData.recommendations.filter(r => r.priority === 'yellow').length}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Recomendadas</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {complianceData.recommendations.filter(r => r.priority === 'green').length}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                    <Euro className="w-4 h-4" />
                    Inversión Total Estimada
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost || 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Recomendaciones Detalladas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Recomendaciones Detalladas</h2>
          </div>
          
          {complianceData.recommendations.map((recommendation) => {
            const config = getPriorityConfig(recommendation.priority);
            const Icon = config.icon;
            const semaforoConfig = getSemaforoConfig(recommendation.semaforo);
          
            return (
              <Card 
                key={recommendation.id} 
                className={`border ${
                  recommendation.priority === 'red' 
                    ? 'bg-red-50 border-red-200' 
                    : recommendation.priority === 'yellow'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-green-50 border-green-200'
                } shadow-sm`}
              >
                <CardContent className="p-5">
                  {/* Header de la recomendación */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`${config.color} rounded-lg p-2 text-white flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                        <Badge className={`${config.bgColor} ${config.textColor} border text-xs font-medium px-2 py-0.5`}>
                          {config.label}
                        </Badge>
                        {recommendation.semaforo && (
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${semaforoConfig.dot}`}></div>
                            <span className="text-xs text-gray-600">{formatText(recommendation.semaforo)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{recommendation.description}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    {/* Cambios necesarios */}
                    {recommendation.changes && recommendation.changes.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-gray-600" />
                          Cambios Necesarios
                        </h4>
                        <ul className="space-y-1.5">
                          {recommendation.changes.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-gray-400 mt-1">•</span>
                              <span className="leading-relaxed">{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Impacto Previsto */}
                    {recommendation.impactoPrevisto && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-gray-600" />
                          Impacto Previsto
                        </h4>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium capitalize">{formatText(recommendation.impactoPrevisto.tipo)}:</span>{' '}
                          {displayValue(recommendation.impactoPrevisto.valor)}
                        </p>
                      </div>
                    )}

                    {/* Información adicional en grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        {recommendation.rangoInversion && recommendation.rangoInversion.length === 2 && (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Euro className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-xs font-medium text-gray-600">Rango de inversión</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(recommendation.rangoInversion[0])} - {formatCurrency(recommendation.rangoInversion[1])}
                              </p>
                            </div>
                          </div>
                        )}
                        {recommendation.estimatedCost && !recommendation.rangoInversion && (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Euro className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-xs font-medium text-gray-600">Coste estimado</p>
                              <p className="text-sm font-semibold text-gray-900">{formatCurrency(recommendation.estimatedCost)}</p>
                            </div>
                          </div>
                        )}
                        {recommendation.estimatedTime && (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-xs font-medium text-gray-600">Retorno estimado</p>
                              <p className="text-sm font-semibold text-gray-900">{displayValue(recommendation.estimatedTime)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          {getCategoryIcon(recommendation.category)}
                          <div>
                            <p className="text-xs font-medium text-gray-600">Categoría</p>
                            <p className="text-sm font-semibold text-gray-900 capitalize">{formatText(recommendation.category)}</p>
                          </div>
                        </div>
                        {recommendation.dependencias && recommendation.dependencias.length > 0 && (
                          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Link2 className="w-4 h-4 text-gray-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-600 mb-1">Depende de</p>
                              <div className="flex flex-wrap gap-1">
                                {recommendation.dependencias.map((dep, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {formatText(dep)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notas */}
                    {recommendation.notas && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <Info className="w-3 h-3 text-gray-500" />
                          Notas adicionales
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{displayValue(recommendation.notas)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
  );
}

