import { apiFetch } from './api';

export interface InvoiceExtractorResponse {
  invoice_number: string | null;
  invoice_date: string;
  amount_eur: number;
  service_type: 'electricity' | 'water' | 'gas' | 'ibi' | 'waste';
  provider: string | null;
  period_start: string | null;
  period_end: string | null;
  units: number | null;
  notes: string | null;
  expiration_date: string | null;
  is_overdue: boolean;
}

export async function extractInvoiceData(file: File): Promise<InvoiceExtractorResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiFetch('/ai/extract-invoice', {
    method: 'POST',
    body: formData,
  });

  return response.data || response;
}

/** Encola el procesamiento de la factura; la app no se bloquea y el usuario recibe notificación al terminar. */
export async function extractInvoiceDataAsync(params: {
  document_url: string;
  document_filename: string;
  building_id: string;
}): Promise<{ job_id: string }> {
  const response = await apiFetch('/ai/extract-invoice-async', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return { job_id: response.job_id };
}

export interface InvoiceJobResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  document_url?: string;
  document_filename?: string;
  extracted_data?: InvoiceExtractorResponse | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

/** Obtiene el estado y datos de un job de factura (para abrir el modal de revisión). */
export async function getInvoiceJob(jobId: string): Promise<InvoiceJobResponse> {
  const response = await apiFetch(`/ai/invoice-job/${jobId}`, { method: 'GET' });
  return response as InvoiceJobResponse;
}

export async function checkInvoiceExtractorHealth(): Promise<boolean> {
  try {
    await apiFetch('/health', { method: 'GET' });
    return true;
  } catch (error) {
    console.warn('Invoice extractor service unavailable:', error);
    return false;
  }
}
