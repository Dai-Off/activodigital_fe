import i18next from 'i18next';

export function timeAgo(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString.replace(/-/g, "/"));
  const now = new Date();
  const secondsDifference = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Acceso directo a i18next (sin hooks)
  const t = (key: string) => i18next.t(key);
  const currentLang = i18next.language.split('-')[0].toUpperCase();

  if (secondsDifference < 0) return t('future'); // "en el futuro"
  if (secondsDifference < 10) return t('just_now'); // "justo ahora"

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
      // Manejo de plurales usando las keys de i18next
      const label = value === 1 ? t(unit) : t(`${unit}s`);
      timeText = `${value} ${label}`;
      break; 
    }
  }

  // Lógica de prefijos/sufijos por idioma
  switch (currentLang) {
    case 'ES': return `hace ${timeText}`;
    case 'EN': return `${timeText} ago`;
    case 'FR': return `il y a ${timeText}`;
    case 'DE': return `vor ${timeText}`;
    case 'PT': return `há ${timeText}`;
    default: return timeText;
  }
}