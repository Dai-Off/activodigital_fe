export function getTimeRemaining(dateString: string | null | undefined): string {
  if (!dateString) {
    return "Fecha no disponible";
  }
  // 1. Parsear la cadena de fecha (DD/MM/YYYY)
  const parts = dateString.split("/");
  if (parts.length !== 3) {
    return "Error: Formato de fecha incorrecto. Use DD/MM/YYYY.";
  }

  const [day, month, year] = parts.map(Number);
  const targetDate = new Date(year, month - 1, day);
  const now = new Date();

  if (isNaN(targetDate.getTime())) {
    return "Error: Fecha inválida.";
  }

  if (targetDate.getTime() <= now.getTime()) {
    return "Ha vencido";
  }

  const diffInMilliseconds = targetDate.getTime() - now.getTime();

  const msInDay = 1000 * 60 * 60 * 24;
  const msInHour = 1000 * 60 * 60;

  const days = Math.floor(diffInMilliseconds / msInDay);
  const remainingMillisecondsAfterDays = diffInMilliseconds % msInDay;

  const hours = Math.ceil(remainingMillisecondsAfterDays / msInHour);

  if (days > 0) {
    const dayText = days === 1 ? "día" : "días";

    if (hours > 0) {
      return `Vence en ${days} ${dayText}.`;
    }
    return `Vence en ${days} ${dayText}.`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? "hora" : "horas"}.`;
  } else {
    return "Ha vencido";
  }
}
