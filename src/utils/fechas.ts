import moment from 'moment';
import i18next from 'i18next';

/**
 * Obtiene el prefijo/sufijo según el idioma configurado en i18next
 */
const formatByLanguage = (text: string): string => {
  const lang = (i18next.language || 'es').split('-')[0].toUpperCase();
  const formats: Record<string, string> = {
    'ES': `hace ${text}`,
    'EN': `${text} ago`,
    'FR': `il y a ${text}`,
    'DE': `vor ${text}`,
    'PT': `há ${text}`
  };
  return formats[lang] || text;
};

/**
 * Función compatible con tu implementación actual
 * Importar como: import { timeAgo } from "~/utils/timeAgo";
 */
export function timeAgo(dateString: string): string {
  if (!dateString) return "";
  
  // El formato ISO 8601 se parsea directamente
  const date = new Date(dateString);
  const now = new Date();
  const secondsDifference = Math.floor((now.getTime() - date.getTime()) / 1000);

  const t = (key: string) => i18next.t(key);

  if (secondsDifference < 0) return t('future');
  if (secondsDifference < 10) return t('just_now');

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  let timeText = "";
  for (const [unit, secondsPerUnit] of Object.entries(intervals)) {
    const value = Math.floor(secondsDifference / secondsPerUnit);
    if (value >= 1) {
      const label = value === 1 ? t(unit) : t(`${unit}s`);
      timeText = `${value} ${label}`;
      break;
    }
  }

  return formatByLanguage(timeText);
}

/**
 * Función basada en Moment para cálculos de duración precisos
 * Importar como: import { howTimeWas } from "~/utils/timeAgo";
 */
export function howTimeWas(fechaInicioStr: string): string {
  if (!fechaInicioStr) return "";
  
  const fechaInicio = moment(fechaInicioStr);
  const ahora = moment();
  const t = (key: string) => i18next.t(key);

  if (!fechaInicio.isValid()) return "";
  if (fechaInicio.isAfter(ahora)) return t('future');

  const duracion = moment.duration(ahora.diff(fechaInicio));
  
  let text = "";
  const unidades = [
    { val: Math.floor(duracion.asYears()), key: 'year' },
    { val: Math.floor(duracion.asMonths()), key: 'month' },
    { val: Math.floor(duracion.asDays()), key: 'day' },
    { val: Math.floor(duracion.asHours()), key: 'hour' },
    { val: Math.floor(duracion.asMinutes()), key: 'minute' },
    { val: Math.floor(duracion.asSeconds()), key: 'second' }
  ];

  // Buscamos la primera unidad que sea mayor o igual a 1
  const unidadPrincipal = unidades.find(u => u.val >= 1);

  if (unidadPrincipal) {
    const label = unidadPrincipal.val === 1 ? t(unidadPrincipal.key) : t(`${unidadPrincipal.key}s`);
    text = `${unidadPrincipal.val} ${label}`;
  } else {
    text = `0 ${t('seconds')}`;
  }

  return formatByLanguage(text);
}

export const formatofechaCorta = (isoString: string) => {
  if (!isoString) return "";
  return moment(isoString).format('YYYY-MM-DD HH:mm:ss');
};