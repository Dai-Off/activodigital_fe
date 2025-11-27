export function timeAgo(dateString: string): string {
  const date = new Date(dateString.replace(/-/g, "/"));
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 0) {
    return "en el futuro";
  }

  const intervals = {
    año: 31536000,
    mes: 2592000,
    día: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1,
  };

  for (const [label, secondsPerUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsPerUnit);

    if (interval >= 1) {
      if (label === "segundo" && interval < 60) {
        return `Hace ${interval} segundo${interval !== 1 ? "s" : ""}`;
      }
      if (label === "minuto" && interval < 60) {
        return `Hace ${interval} minuto${interval !== 1 ? "s" : ""}`;
      }

      return `Hace ${interval} ${label}${interval !== 1 ? "s" : ""}`;
    }
  }

  return "Justo ahora";
}
