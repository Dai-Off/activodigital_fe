import { apiFetch } from "./api";

// Tipos de la nueva API
interface DocumentExpirationAlert {
  id: string;
  document_type: 'building' | 'unit' | 'service_invoice';
  building_id: string;
  unit_id?: string | null;
  document_id: string;
  file_name: string;
  title?: string | null;
  category: string;
  expiration_date: string;
  days_until_expiration: number;
  status: 'activo' | 'overdue';
  alert_level: 'critical' | 'warning' | 'info';
  building_name?: string | null;
  unit_name?: string | null;
  service_type?: string | null;
  invoice_number?: string | null;
  amount_eur?: number | null;
}

interface DocumentExpirationAlertsResponse {
  alerts: DocumentExpirationAlert[];
  total: number;
  critical: number;
  warning: number;
  info: number;
  expired: number;
}

// Tipos compatibles con el componente existente
export interface ExpiredKpis {
  total_vencidos: number;
  alta_prioridad: number;
  media_prioridad: number;
  dias_promedio: number;
  deuda_total: number;
  sin_cobertura: number;
}

export interface ExpiredCategory {
  nombre: string;
  cantidad: number;
}

export interface ExpiredDocument {
  id: string;
  building_id: string;
  building_name: string;
  tipo_documento: string;
  contenido_extraido: {
    area?: string;
    estado: string;
    importe?: string;
    resumen?: string;
    vigencia?: string;
    categoria?: string;
    responsable?: string;
    consecuencia?: string;
    fecha_emision?: string;
    numero_referencia?: string;
    prioridad?: string;
  };
  direccion?: string;
  validado?: boolean;
  confidence?: string;
  storage_path?: string;
  created_at?: string;
  dias_vencido?: number;
  prioridad_calculada?: "alta" | "media" | "baja";
}

export interface ExpiredListResponse {
  items: ExpiredDocument[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ExpiredListFilters {
  search?: string;
  building_id?: string;
  unidad?: string;
  prioridad?: "alta" | "media" | "baja" | "todas";
  categoria?: string;
  tipo_documento?: string;
  sort?:
    | "mas_retrasado"
    | "menos_retrasado"
    | "mas_reciente"
    | "menos_reciente";
  page?: number;
  limit?: number;
}

export interface AvailableFilters {
  tipos_documento: string[];
  categorias: string[];
  edificios: Array<{ id: string; nombre: string }>;
}

// Función auxiliar para obtener todos los documentos (sin paginación del backend)
async function getAllExpiringDocuments(filters: {
  building_id?: string;
  unit_id?: string;
  category?: string;
  alert_level?: 'critical' | 'warning' | 'info';
  days_ahead?: number;
  include_expired?: boolean;
}): Promise<DocumentExpirationAlert[]> {
  const params = new URLSearchParams();
  params.set("days_ahead", String(filters.days_ahead ?? 90));
  params.set("include_expired", String(filters.include_expired ?? true));
  if (filters.building_id) params.set("building_id", filters.building_id);
  if (filters.unit_id) params.set("unit_id", filters.unit_id);
  if (filters.category) params.set("category", filters.category);
  if (filters.alert_level) params.set("alert_level", filters.alert_level);

  const response = await apiFetch(
    `/document-expiration-alerts?${params.toString()}`,
    { method: "GET" }
  ) as DocumentExpirationAlertsResponse;

  return response.alerts || [];
}

// Mapear alert_level a prioridad
function mapAlertLevelToPrioridad(alert_level: 'critical' | 'warning' | 'info'): "alta" | "media" | "baja" {
  if (alert_level === 'critical') return 'alta';
  if (alert_level === 'warning') return 'media';
  return 'baja';
}

// Formatear fecha para mostrar
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

// Mapear documento de la nueva API al formato esperado por el componente
function mapAlertToExpiredDocument(alert: DocumentExpirationAlert): ExpiredDocument {
  const diasVencido = alert.days_until_expiration < 0 ? Math.abs(alert.days_until_expiration) : 0;
  const tipoDocumento = alert.document_type === 'service_invoice' 
    ? `Factura ${alert.service_type || 'servicio'}`
    : alert.title || alert.file_name || 'Documento';

  // Determinar el texto de vigencia según si está vencido o próximo a vencer
  let vigenciaText = formatDate(alert.expiration_date);
  if (alert.days_until_expiration < 0) {
    vigenciaText = `Vencido el ${vigenciaText}`;
  } else if (alert.days_until_expiration <= 7) {
    vigenciaText = `Vence en ${alert.days_until_expiration} día${alert.days_until_expiration !== 1 ? 's' : ''} (${vigenciaText})`;
  } else {
    vigenciaText = `Vence el ${vigenciaText}`;
  }

  return {
    id: alert.id,
    building_id: alert.building_id,
    building_name: alert.building_name || '',
    tipo_documento: tipoDocumento,
    contenido_extraido: {
      estado: alert.status === 'overdue' ? 'vencido' : alert.days_until_expiration <= 7 ? 'próximo-vencer' : 'activo',
      importe: alert.amount_eur ? `€${alert.amount_eur.toFixed(2)}` : undefined,
      resumen: alert.title || alert.file_name,
      vigencia: vigenciaText,
      categoria: alert.category,
      fecha_emision: undefined,
      numero_referencia: alert.invoice_number || undefined,
      prioridad: alert.alert_level,
    },
    dias_vencido: diasVencido,
    prioridad_calculada: mapAlertLevelToPrioridad(alert.alert_level),
  };
}

// Obtener KPIs desde los datos de la API
export async function getExpiredKpis(): Promise<ExpiredKpis> {
  const allAlerts = await getAllExpiringDocuments({ days_ahead: 90, include_expired: true });
  
  const expired = allAlerts.filter(a => a.days_until_expiration < 0);
  const critical = allAlerts.filter(a => a.alert_level === 'critical');
  const warning = allAlerts.filter(a => a.alert_level === 'warning');
  
  const totalVencidos = expired.length;
  const altaPrioridad = critical.length;
  const mediaPrioridad = warning.length;
  
  // Calcular días promedio de retraso (solo para documentos vencidos)
  const diasPromedio = expired.length > 0
    ? Math.round(
        expired.reduce((sum, a) => sum + Math.abs(a.days_until_expiration), 0) / expired.length
      )
    : 0;
  
  // Calcular deuda total (suma de amount_eur de TODAS las facturas próximas a vencer, vencidas y futuras)
  const deudaTotal = allAlerts
    .filter(a => a.amount_eur !== null && a.amount_eur !== undefined)
    .reduce((sum, a) => sum + (a.amount_eur || 0), 0);
  
  // Contar seguros vencidos (categoría insurance o similar)
  const sinCobertura = expired.filter(
    a => a.category?.toLowerCase().includes('insurance') || 
         a.category?.toLowerCase().includes('seguro')
  ).length;

  return {
    total_vencidos: totalVencidos,
    alta_prioridad: altaPrioridad,
    media_prioridad: mediaPrioridad,
    dias_promedio: diasPromedio,
    deuda_total: deudaTotal,
    sin_cobertura: sinCobertura,
  };
}

// Mapear categorías de la base de datos a nombres en español para el componente
function mapCategoryToSpanish(category: string): string {
  const categoryLower = category.toLowerCase().trim();
  
  // Mapeo directo
  const directMapping: Record<string, string> = {
    'certificates': 'Certificados',
    'certificate': 'Certificados',
    'contracts': 'Contratos',
    'contract': 'Contratos',
    'inspections': 'Inspecciones',
    'inspection': 'Inspecciones',
    'financial': 'Pagos',
    'finance': 'Pagos',
    'maintenance': 'Mantenimiento',
    'maintenances': 'Mantenimiento',
    'insurance': 'Seguros',
    'insurances': 'Seguros',
    'legal': 'Documentos',
    'public': 'Documentos',
    'internal': 'Documentos',
    'technical': 'Documentos',
  };

  // Si hay un mapeo directo, usarlo
  if (directMapping[categoryLower]) {
    return directMapping[categoryLower];
  }

  // Buscar por coincidencia parcial
  if (categoryLower.includes('certif')) return 'Certificados';
  if (categoryLower.includes('contract')) return 'Contratos';
  if (categoryLower.includes('inspect')) return 'Inspecciones';
  if (categoryLower.includes('financial') || categoryLower.includes('finance') || categoryLower.includes('payment') || categoryLower.includes('pago')) return 'Pagos';
  if (categoryLower.includes('maintenance') || categoryLower.includes('manten')) return 'Mantenimiento';
  if (categoryLower.includes('insurance') || categoryLower.includes('seguro')) return 'Seguros';
  if (categoryLower.includes('document') || categoryLower.includes('legal') || categoryLower.includes('public') || categoryLower.includes('internal') || categoryLower.includes('technical')) return 'Documentos';

  // Si no hay coincidencia, devolver el nombre original capitalizado
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

// Mapear nombres en español de vuelta a valores de base de datos para filtros
function mapSpanishToCategory(spanishName: string): string[] {
  const mapping: Record<string, string[]> = {
    'Certificados': ['certificates', 'certificate'],
    'Contratos': ['contracts', 'contract'],
    'Inspecciones': ['inspections', 'inspection'],
    'Pagos': ['financial', 'finance', 'payment'],
    'Mantenimiento': ['maintenance', 'maintenances'],
    'Documentos': ['legal', 'public', 'internal', 'technical', 'documents', 'document'],
  };

  return mapping[spanishName] || [spanishName.toLowerCase()];
}

// Obtener categorías desde los datos de la API
// Incluye TODOS los documentos próximos a vencer (no solo vencidos)
export async function getExpiredCategories(): Promise<ExpiredCategory[]> {
  // Obtener todos los documentos próximos a vencer (incluyendo vencidos)
  const allAlerts = await getAllExpiringDocuments({ days_ahead: 90, include_expired: true });
  
  // Agrupar por categoría (todos los documentos, no solo vencidos)
  const categoryMap = new Map<string, number>();
  allAlerts.forEach(alert => {
    const category = alert.category || 'Otros';
    const categorySpanish = mapCategoryToSpanish(category);
    categoryMap.set(categorySpanish, (categoryMap.get(categorySpanish) || 0) + 1);
  });

  // Crear array con las categorías esperadas por el componente
  const expectedCategories = ['Certificados', 'Contratos', 'Inspecciones', 'Pagos', 'Mantenimiento', 'Documentos'];
  
  // Crear resultado con todas las categorías esperadas (incluso si tienen 0)
  const result: ExpiredCategory[] = expectedCategories.map(nombre => ({
    nombre,
    cantidad: categoryMap.get(nombre) || 0,
  }));

  // Agregar cualquier categoría adicional que no esté en la lista esperada
  categoryMap.forEach((cantidad, nombre) => {
    if (!expectedCategories.includes(nombre)) {
      result.push({ nombre, cantidad });
    }
  });

  return result;
}

// Obtener lista de documentos con paginación en el frontend
export async function getExpiredList(
  filters: ExpiredListFilters,
): Promise<ExpiredListResponse> {
  // Mapear filtros de prioridad a alert_level
  let alertLevel: 'critical' | 'warning' | 'info' | undefined;
  if (filters.prioridad === 'alta') alertLevel = 'critical';
  else if (filters.prioridad === 'media') alertLevel = 'warning';
  else if (filters.prioridad === 'baja') alertLevel = 'info';

  // Si la categoría viene en español (del componente), mapearla a valores de BD
  // Pero como la API puede recibir múltiples valores, mejor filtramos en el frontend
  let categoryFilter = filters.categoria;

  // Obtener todos los documentos que coincidan con los filtros básicos
  const allAlerts = await getAllExpiringDocuments({
    building_id: filters.building_id,
    unit_id: filters.unidad,
    // No pasamos category aquí porque puede venir en español, lo filtramos después
    alert_level: alertLevel,
    days_ahead: 90,
    include_expired: true,
  });

  // Convertir a formato esperado
  let mappedDocuments = allAlerts.map(mapAlertToExpiredDocument);

  // Aplicar filtro de categoría (si viene en español, mapear a valores de BD)
  if (categoryFilter && categoryFilter !== 'all') {
    const categoryValues = mapSpanishToCategory(categoryFilter);
    mappedDocuments = mappedDocuments.filter(doc => {
      const docCategory = doc.contenido_extraido.categoria?.toLowerCase() || '';
      return categoryValues.some(cat => docCategory.includes(cat.toLowerCase()));
    });
  }

  // Aplicar búsqueda por texto (si existe)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    mappedDocuments = mappedDocuments.filter(doc =>
      doc.tipo_documento.toLowerCase().includes(searchLower) ||
      doc.building_name.toLowerCase().includes(searchLower) ||
      doc.contenido_extraido.categoria?.toLowerCase().includes(searchLower) ||
      doc.contenido_extraido.resumen?.toLowerCase().includes(searchLower)
    );
  }

  // Aplicar ordenamiento
  if (filters.sort) {
    mappedDocuments.sort((a, b) => {
      switch (filters.sort) {
        case 'mas_retrasado':
          return (b.dias_vencido || 0) - (a.dias_vencido || 0);
        case 'menos_retrasado':
          return (a.dias_vencido || 0) - (b.dias_vencido || 0);
        case 'mas_reciente':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'menos_reciente':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        default:
          return 0;
      }
    });
  }

  // Aplicar paginación en el frontend
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = mappedDocuments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(mappedDocuments.length / limit);

  return {
    items: paginatedItems,
    total: mappedDocuments.length,
    page,
    limit,
    total_pages: totalPages,
  };
}

// Obtener filtros disponibles desde los datos de la API
export async function getAvailableFilters(): Promise<AvailableFilters> {
  const allAlerts = await getAllExpiringDocuments({ days_ahead: 90, include_expired: true });
  
  // Extraer tipos de documento únicos
  const tiposDocumento = Array.from(
    new Set(allAlerts.map(a => {
      if (a.document_type === 'service_invoice') {
        return `Factura ${a.service_type || 'servicio'}`;
      }
      return a.title || a.file_name || 'Documento';
    }))
  );

  // Extraer categorías únicas
  const categorias = Array.from(
    new Set(allAlerts.map(a => a.category).filter(Boolean))
  );

  // Extraer edificios únicos
  const edificiosMap = new Map<string, string>();
  allAlerts.forEach(alert => {
    if (alert.building_id && alert.building_name) {
      edificiosMap.set(alert.building_id, alert.building_name);
    }
  });
  const edificios = Array.from(edificiosMap.entries()).map(([id, nombre]) => ({
    id,
    nombre,
  }));

  return {
    tipos_documento: tiposDocumento,
    categorias: categorias,
    edificios: edificios,
  };
}

