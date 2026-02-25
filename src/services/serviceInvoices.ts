import { apiFetch } from "./api";

// Tipos de servicios disponibles según la documentación
export type ServiceType = "electricity" | "water" | "gas" | "ibi" | "waste";

export interface ServiceInvoice {
  id?: string;
  building_id: string;
  invoice_date: string; // ISO date string (YYYY-MM-DD)
  service_type: ServiceType;
  amount_eur: number;
  units?: number | null; // Unidades consumidas (opcional)
  invoice_number?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  document_filename?: string | null;
  provider?: string | null;
  notes?: string | null;
  document_url?: string | null;
  expiration_date?: string | null;
  is_overdue?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface CreateServiceInvoiceRequest
  extends Omit<
    ServiceInvoice,
    "id" | "created_at" | "updated_at" | "created_by"
  > {}

export interface ServiceInvoiceResponse {
  data: ServiceInvoice;
}

export interface ServiceInvoiceListResponse {
  data: ServiceInvoice[];
}

export interface MonthlyServiceCosts {
  year: number;
  month: number;
  byService: Record<ServiceType, number>;
  total: number;
}

export class ServiceInvoicesService {
  /**
   * Crear una nueva factura de servicio
   * POST /service-invoices
   */
  static async createServiceInvoice(
    data: CreateServiceInvoiceRequest
  ): Promise<ServiceInvoice> {
    const response = await apiFetch("/service-invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data || response;
  }

  /**
   * Obtener todas las facturas de servicios de un edificio
   * GET /service-invoices/building/:buildingId
   */
  static async getByBuilding(
    buildingId: string,
    options?: {
      year?: number;
      month?: number;
      serviceType?: ServiceType;
    }
  ): Promise<ServiceInvoice[]> {
    const queryParams = new URLSearchParams();
    if (options?.year) queryParams.append("year", options.year.toString());
    if (options?.month) queryParams.append("month", options.month.toString());
    // Según documentación, el backend espera `serviceType` (camelCase)
    if (options?.serviceType) {
      queryParams.append("serviceType", options.serviceType);
    }

    const queryString = queryParams.toString();
    const url = `/service-invoices/building/${buildingId}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiFetch(url);
    // Normalizamos siempre a array
    const data: ServiceInvoice[] = response.data || response || [];

    // Filtro defensivo por fecha en cliente, por si el backend ignora year/month
    if (!options?.year && !options?.month) {
      return data;
    }

    return data.filter((invoice) => {
      const date = new Date(invoice.invoice_date);
      if (Number.isNaN(date.getTime())) return false;

      const yearMatch = options?.year
        ? date.getFullYear() === options.year
        : true;
      const monthMatch = options?.month
        ? date.getMonth() + 1 === options.month
        : true;

      return yearMatch && monthMatch;
    });
  }

  /**
   * Obtiene los costes mensuales agregados por tipo de servicio
   * a partir de las facturas ya cargadas.
   */
  static async getMonthlyCostsForBuilding(
    buildingId: string,
    year: number,
    month: number
  ): Promise<MonthlyServiceCosts> {
    const invoices = await this.getByBuilding(buildingId, { year, month });

    const initialTotals: Record<ServiceType, number> = {
      electricity: 0,
      water: 0,
      gas: 0,
      ibi: 0,
      waste: 0,
    };

    const byService = invoices.reduce((acc, invoice) => {
      const amount =
        typeof invoice.amount_eur === "number" && !Number.isNaN(invoice.amount_eur)
          ? invoice.amount_eur
          : 0;
      acc[invoice.service_type] += amount;
      return acc;
    }, initialTotals);

    const total = Object.values(byService).reduce(
      (sum, value) => sum + value,
      0
    );

    return {
      year,
      month,
      byService,
      total,
    };
  }

  /**
   * Obtiene los costes mensuales del mes más reciente con datos.
   * Primero intenta el mes actual; si no hay facturas, busca el último mes con datos.
   */
  static async getLatestMonthlyCostsForBuilding(
    buildingId: string
  ): Promise<MonthlyServiceCosts> {
    // Intentar primero con el mes actual
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const currentMonthCosts = await this.getMonthlyCostsForBuilding(
      buildingId,
      currentYear,
      currentMonth
    );

    // Si hay datos para el mes actual, usarlos
    if (currentMonthCosts.total > 0) {
      return currentMonthCosts;
    }

    // Si no hay datos para el mes actual, buscar el último mes con datos
    const allInvoices = await this.getByBuilding(buildingId);

    if (!allInvoices.length) {
      return currentMonthCosts; // Devolver estructura vacía
    }

    // Encontrar la factura más reciente
    const sorted = [...allInvoices].sort(
      (a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime()
    );

    const latestDate = new Date(sorted[0].invoice_date);
    const latestYear = latestDate.getFullYear();
    const latestMonth = latestDate.getMonth() + 1;

    // Filtrar facturas de ese mes y agregar
    const monthInvoices = allInvoices.filter((inv) => {
      const d = new Date(inv.invoice_date);
      return d.getFullYear() === latestYear && d.getMonth() + 1 === latestMonth;
    });

    const initialTotals: Record<ServiceType, number> = {
      electricity: 0,
      water: 0,
      gas: 0,
      ibi: 0,
      waste: 0,
    };

    const byService = monthInvoices.reduce((acc, invoice) => {
      const amount =
        typeof invoice.amount_eur === "number" && !Number.isNaN(invoice.amount_eur)
          ? invoice.amount_eur
          : 0;
      acc[invoice.service_type] += amount;
      return acc;
    }, initialTotals);

    const total = Object.values(byService).reduce(
      (sum, value) => sum + value,
      0
    );

    return {
      year: latestYear,
      month: latestMonth,
      byService,
      total,
    };
  }

  /**
   * Obtener una factura de servicio por ID
   * GET /service-invoices/:id
   */
  static async getServiceInvoice(id: string): Promise<ServiceInvoice> {
    const response = await apiFetch(`/service-invoices/${id}`);
    return response.data || response;
  }

  /**
   * Actualizar una factura de servicio
   * PUT /service-invoices/:id
   */
  static async updateServiceInvoice(
    id: string,
    data: Partial<CreateServiceInvoiceRequest>
  ): Promise<ServiceInvoice> {
    const response = await apiFetch(`/service-invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data || response;
  }

  /**
   * Eliminar una factura de servicio
   * DELETE /service-invoices/:id
   */
  static async deleteServiceInvoice(id: string): Promise<void> {
    await apiFetch(`/service-invoices/${id}`, {
      method: 'DELETE',
    });
  }
}

// Mapeo de tipos de servicio a etiquetas en español
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  electricity: 'Electricidad',
  water: 'Agua',
  gas: 'Gas',
  ibi: 'IBI (Impuesto sobre Bienes Inmuebles)',
  waste: 'Basuras',
};

// Helper para obtener el label de un tipo de servicio
export const getServiceTypeLabel = (type: ServiceType): string => {
  return SERVICE_TYPE_LABELS[type] || type;
};




