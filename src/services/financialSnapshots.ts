import { apiFetch } from './api';

export interface FinancialSnapshot {
  id?: string;
  building_id: string;
  period_start: string;
  period_end: string;
  currency: 'EUR';
  ingresos_brutos_anuales_eur: number;
  otros_ingresos_anuales_eur?: number | null;
  walt_meses: number;
  concentracion_top1_pct_noi: number;
  indexacion_ok?: boolean | null;
  mora_pct_12m?: number | null;
  opex_total_anual_eur: number;
  opex_energia_anual_eur: number;
  opex_mantenimiento_anual_eur?: number | null;
  opex_seguros_anual_eur?: number | null;
  opex_otros_anual_eur?: number | null;
  dscr?: number | null;
  servicio_deuda_anual_eur?: number | null;
  penalidad_prepago_alta?: boolean | null;
  principal_pendiente_eur?: number | null;
  capex_rehab_estimado_eur?: number | null;
  ahorro_energia_pct_estimado?: number | null;
  uplift_precio_pct_estimado?: number | null;
  lead_time_rehab_semanas?: number | null;
  meta?: {
    libro_edificio_estado?: 'completo' | 'parcial' | 'faltante';
    ite_iee_estado?: 'ok' | 'pendiente' | 'no_aplica';
    mantenimientos_criticos_ok?: boolean;
    planos_estado?: 'ok' | 'faltante';
    eur_m2_ref_p50?: number;
    dom_dias?: number;
    fuente?: string | null;
    version?: string | null;
    notas?: string | null;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreateFinancialSnapshotRequest extends Omit<FinancialSnapshot, 'id' | 'created_at' | 'updated_at'> {}

export class FinancialSnapshotsService {
  static async createFinancialSnapshot(data: CreateFinancialSnapshotRequest): Promise<FinancialSnapshot> {
    const response = await apiFetch('/financial-snapshots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response;
  }

  static async getFinancialSnapshots(buildingId: string): Promise<FinancialSnapshot[]> {
    const response = await apiFetch(`/financial-snapshots/building/${buildingId}`);
    return response.data || [];
  }

  static async getFinancialSnapshot(id: string): Promise<FinancialSnapshot> {
    const response = await apiFetch(`/financial-snapshots/${id}`);
    return response.data || response;
  }

  static async updateFinancialSnapshot(id: string, data: Partial<FinancialSnapshot>): Promise<FinancialSnapshot> {
    const response = await apiFetch(`/financial-snapshots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data || response;
  }

  static async deleteFinancialSnapshot(id: string): Promise<void> {
    await apiFetch(`/financial-snapshots/${id}`, {
      method: 'DELETE',
    });
  }
}

