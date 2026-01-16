import { apiFetch } from "./api";

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

export async function getExpiredKpis(): Promise<ExpiredKpis> {
  const response = await apiFetch("/vencidos/kpis", { method: "GET" });
  return (response.kpis || response.data || response) as ExpiredKpis;
}

export async function getExpiredCategories(): Promise<ExpiredCategory[]> {
  const response = await apiFetch("/vencidos/categorias", { method: "GET" });
  const raw =
    response.categorias ||
    response.data?.categorias ||
    response.data ||
    response;
  if (!Array.isArray(raw)) return [];
  return raw as ExpiredCategory[];
}

export async function getExpiredList(
  filters: ExpiredListFilters,
): Promise<ExpiredListResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.building_id) params.set("building_id", filters.building_id);
  if (filters.unidad) params.set("unidad", filters.unidad);
  if (filters.prioridad && filters.prioridad !== "todas") {
    params.set("prioridad", filters.prioridad);
  }
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.tipo_documento) params.set("tipo_documento", filters.tipo_documento);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const qs = params.toString();
  const response = await apiFetch(
    `/vencidos/listado${qs ? `?${qs}` : ""}`,
    { method: "GET" },
  );
  const data =
    response.data ||
    response.listado ||
    response.items
      ? response
      : response;
  return {
    items: data.items || data.data?.items || [],
    total: data.total ?? data.data?.total ?? 0,
    page: data.page ?? data.data?.page ?? filters.page ?? 1,
    limit: data.limit ?? data.data?.limit ?? filters.limit ?? 10,
    total_pages: data.total_pages ?? data.data?.total_pages ?? 0,
  };
}

export async function getAvailableFilters(): Promise<AvailableFilters> {
  const response = await apiFetch("/vencidos/filtros", { method: "GET" });
  return (response.data || response) as AvailableFilters;
}

