import moment from 'moment';
import { type Duration } from 'moment';

export function howTimeWas(fechaInicioStr: string): string {
    const fechaInicio = moment(fechaInicioStr);
    const ahora = moment();

    if (!fechaInicio.isValid()) {
        return "Error: La fecha de inicio no es válida.";
    }
    if (fechaInicio.isAfter(ahora)) {
        return "La fecha de inicio es posterior a la fecha actual.";
    }

    const diferenciaMs: number = ahora.diff(fechaInicio);
    const duracion: Duration = moment.duration(diferenciaMs);

    const diasTotales: number = Math.floor(duracion.asDays());
    const años: number = Math.floor(diasTotales / 365.25);
    const diasRestantesDespuesDeAños: number = diasTotales % 365.25;
    const meses: number = Math.floor(diasRestantesDespuesDeAños / 30.44);
    
    const dias: number = diasTotales;
    const horas: number = Math.floor(duracion.asHours());
    const minutos: number = Math.floor(duracion.asMinutes());
    const segundos: number = Math.floor(duracion.asSeconds());

    if (años >= 1) {
        return `hace ${años} ${años === 1 ? 'año' : 'años'}`;
    }
    
    if (meses >= 1) {
        return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    }
    
    if (dias >= 1) {
        return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    }
    
    if (horas >= 1) {
        return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }
    
    if (minutos >= 1) {
        return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // Si ha pasado menos de un minuto
    return `hace ${segundos} ${segundos === 1 ? 'segundo' : 'segundos'}`;
}

export const formatofechaCorta = (isoString: string) => {
    if (!isoString) return "";
    return moment(isoString).format('YYYY-MM-DD HH:mm:ss')
  };