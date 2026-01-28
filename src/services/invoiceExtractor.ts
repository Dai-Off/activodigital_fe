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

export async function checkInvoiceExtractorHealth(): Promise<boolean> {
  try {
    await apiFetch('/health', { method: 'GET' });
    return true;
  } catch (error) {
    console.warn('Invoice extractor service unavailable:', error);
    return false;
  }
}
