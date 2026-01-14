// src/components/SupportContactModal.tsx
// Componente modal reutilizable para contacto con soporte

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { submitSupportRequest, type SupportRequest } from '../services/support';
import { HelpCircle, Loader2 } from 'lucide-react';

interface SupportContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
  initialCategory?: SupportRequest['category'];
  initialMessage?: string;
  context?: string; // Contexto adicional (URL, error, etc.)
}

export function SupportContactModal({
  isOpen,
  onClose,
  initialSubject = '',
  initialCategory = 'other',
  initialMessage = '',
  context,
}: SupportContactModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [subject, setSubject] = useState(initialSubject);
  const [category, setCategory] = useState<SupportRequest['category']>(initialCategory);
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      showToast({
        type: 'error',
        title: t('support.form.validationTitle', {
          defaultValue: 'Campos requeridos',
        }),
        message: t('support.form.validation', {
          defaultValue: 'Por favor, completa todos los campos requeridos.',
        }),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const request: SupportRequest = {
        subject: subject.trim(),
        category,
        message: message.trim(),
        email: user?.email,
        context: context || window.location.href,
      };

      await submitSupportRequest(request);

      showToast({
        type: 'success',
        title: t('support.form.successTitle', {
          defaultValue: 'Mensaje enviado',
        }),
        message: t('support.form.success', {
          defaultValue: 'Tu mensaje ha sido enviado correctamente. Te responderemos pronto.',
        }),
      });

      // Resetear formulario y cerrar
      setSubject('');
      setCategory('other');
      setMessage('');
      onClose();
    } catch (error) {
      showToast({
        type: 'error',
        title: t('support.form.errorTitle', {
          defaultValue: 'Error al enviar',
        }),
        message:
          error instanceof Error
            ? error.message
            : t('support.form.error', {
                defaultValue: 'No se pudo enviar el mensaje. Por favor, intenta de nuevo.',
              }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Manejar el cambio de estado del modal
  const handleOpenChange = (open: boolean) => {
    // Si se intenta cerrar y no está enviando, cerrar el modal
    if (!open && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] bg-white p-6"
        onInteractOutside={(e) => {
          // Prevenir cierre al hacer clic fuera solo si está enviando
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Permitir cierre con ESC si no está enviando
          if (!isSubmitting) {
            handleClose();
          } else {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <DialogTitle className="text-gray-900 text-xl">
              {t('support.title', { defaultValue: 'Contactar con Soporte' })}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-sm mt-2">
            {t('support.description', {
              defaultValue:
                'Describe tu problema o consulta y nuestro equipo te responderá lo antes posible.',
            })}
          </DialogDescription>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-800 flex items-start gap-2">
              <svg
                className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {t('support.responseTime', {
                  defaultValue:
                    'Nuestro equipo revisará tu consulta y te responderá en un plazo máximo de 24 horas hábiles.',
                })}
              </span>
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="support-category" className="text-sm font-medium text-gray-700">
              {t('support.form.category', { defaultValue: 'Categoría' })}
            </Label>
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as SupportRequest['category'])
              }
              disabled={isSubmitting}
            >
              <SelectTrigger 
                id="support-category" 
                className="w-full h-10 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent 
                className="z-[100] bg-white border border-gray-200 shadow-xl rounded-lg"
                position="popper"
              >
                <SelectItem 
                  value="technical"
                  className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-2.5"
                >
                  {t('support.categories.technical', {
                    defaultValue: 'Problema técnico',
                  })}
                </SelectItem>
                <SelectItem 
                  value="billing"
                  className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-2.5"
                >
                  {t('support.categories.billing', {
                    defaultValue: 'Facturación',
                  })}
                </SelectItem>
                <SelectItem 
                  value="feature"
                  className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-2.5"
                >
                  {t('support.categories.feature', {
                    defaultValue: 'Solicitud de funcionalidad',
                  })}
                </SelectItem>
                <SelectItem 
                  value="bug"
                  className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-2.5"
                >
                  {t('support.categories.bug', {
                    defaultValue: 'Reportar error',
                  })}
                </SelectItem>
                <SelectItem 
                  value="other"
                  className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-2.5"
                >
                  {t('support.categories.other', {
                    defaultValue: 'Otro',
                  })}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-subject" className="text-sm font-medium text-gray-700">
              {t('support.form.subject', { defaultValue: 'Asunto' })}{' '}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="support-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t('support.form.subjectPlaceholder', {
                defaultValue: 'Ej: Problema al crear un edificio',
              })}
              disabled={isSubmitting}
              required
              className="bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-message" className="text-sm font-medium text-gray-700">
              {t('support.form.message', { defaultValue: 'Mensaje' })}{' '}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="support-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('support.form.messagePlaceholder', {
                defaultValue:
                  'Describe tu problema o consulta con el mayor detalle posible...',
              })}
              disabled={isSubmitting}
              required
              rows={6}
              className="bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {user?.email && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-md p-3 border border-gray-200">
              {t('support.form.emailInfo', {
                defaultValue: 'Te responderemos a:',
              })}{' '}
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
          )}

          <DialogFooter className="gap-3 sm:gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400"
            >
              {t('common.cancel', { defaultValue: 'Cancelar' })}
            </Button>
            <button
              type="submit"
              disabled={isSubmitting || !subject.trim() || !message.trim()}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all min-w-[140px] h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-600 disabled:opacity-90 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('support.form.sending', { defaultValue: 'Enviando...' })}</span>
                </>
              ) : (
                <span>{t('support.form.send', { defaultValue: 'Enviar mensaje' })}</span>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

