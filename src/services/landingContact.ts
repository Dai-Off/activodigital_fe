import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  aumRange: string;
  reason: string;
  message: string;
  privacyAccepted: boolean;
}

export const ADMIN_EMAIL = 'gardeken931@gmail.com';

/**
 * Envía el formulario de contacto usando la Edge Function 'send-email'
 */
export async function sendContactEmail(data: ContactFormData) {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: ADMIN_EMAIL,
        subject: `Nuevo contacto de landing: ${data.firstName} ${data.lastName} - ${data.reason}`,
        type: 'support',
        html: `
          <h3>Nuevo mensaje de contacto desde la Landing</h3>
          <p><strong>Nombre:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Teléfono:</strong> ${data.phone}</p>
          <p><strong>Empresa:</strong> ${data.company}</p>
          <p><strong>AUM Gestionados:</strong> ${data.aumRange}</p>
          <p><strong>Motivo:</strong> ${data.reason}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${data.message.replace(/\n/g, '<line-break>')}</p>
        `.replace(/<line-break>/g, '<br>'),
        metadata: {
          support: {
            category: 'landing_contact',
            subject: data.reason,
            userEmail: data.email,
            context: 'Landing Redesign - Contacto'
          }
        }
      }
    });

    if (error) throw error;
    return response;
  } catch (error) {
    console.error('Error enviando email de contacto:', error);
    throw error;
  }
}
