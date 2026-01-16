// src/services/support.ts
// Servicio para manejar el contacto con soporte

import { apiFetch } from './api';

export interface SupportRequest {
  subject: string;
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  message: string;
  email?: string; // Opcional, se puede obtener del usuario autenticado
  context?: string; // Información adicional del contexto (URL, error, etc.)
}

export interface SupportResponse {
  success: boolean;
  message: string;
  emailId?: string;
  ticketId?: string; // Alias para compatibilidad
}

/**
 * Envía un mensaje de soporte al backend
 */
export async function submitSupportRequest(
  request: SupportRequest
): Promise<SupportResponse> {
  try {
    const response = await apiFetch('/support', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return {
      success: response.success ?? true,
      message: response.message || 'Tu mensaje ha sido enviado correctamente. Te responderemos pronto.',
      emailId: response.emailId,
      ticketId: response.emailId, // Alias para compatibilidad con código existente
    };
  } catch (error) {
    console.error('Error enviando mensaje de soporte:', error);
    
    throw new Error(
      error instanceof Error
        ? error.message
        : 'No se pudo enviar el mensaje. Por favor, intenta de nuevo más tarde.'
    );
  }
}

