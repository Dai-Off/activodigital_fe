import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const formatMoneyShort = (value: number): string => {
    if (value === null || value === undefined || isNaN(value) || value === 0) {
        return '0';
    }

    const absValue = Math.abs(value);
    const units = [
        { limit: 1_000_000_000, suffix: 'B', divisor: 1_000_000_000 },
        { limit: 1_000_000, suffix: 'M', divisor: 1_000_000 },
        { limit: 1_000, suffix: 'K', divisor: 1_000 },
    ];

    // --- Lógica de Formato Corto (B, M, K) ---
    for (const unit of units) {
        if (absValue >= unit.limit) {
            const rawValue = absValue / unit.divisor;
            let formattedValue: string;
            
            // Usamos la función toFixed(2) para tener la precisión inicial
            formattedValue = rawValue.toFixed(2); 

            // 1. Lógica de Limpieza de Ceros Finales (Trailing Zeros)
            // Esto convierte 1.25M -> 1.25M, 1.20M -> 1.2M, 1.00M -> 1M
            
            const cleanedValue = formattedValue.replace(/(\.00|0)$/, '');
            
            const isExact = rawValue % 1 === 0;
            const needsPlusSign = !isExact && rawValue.toString() !== cleanedValue;

            // 3. Ensamblar la cadena final
            let result = cleanedValue + unit.suffix;

            // Aplicar signo
            if (value < 0) {
                return `-${result}`;
            } else {
                // Si el valor es positivo, solo añadimos '+' si la aproximación lo requiere
                return needsPlusSign ? `+${result}` : result;
            }
        }
    }

    const formattedLessThan1k = absValue.toLocaleString('es-ES', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2 
    });

    // Si es positivo, se devuelve sin el signo '+'.
    if (value >= 0) {
        return formattedLessThan1k;
    } else {
        return `-${formattedLessThan1k}`;
    }
};

export const getEnergyRatingColorClass = (rating: string): string => {
  switch (rating) {
      case 'A':
          return 'bg-green-600 text-white'; 
      case 'B':
          return 'bg-lime-500 text-white'; 
      case 'C':
          return 'bg-lime-300 text-gray-600'; 
      case 'D':
          return 'bg-yellow-400 text-white'; 
      case 'E':
          return 'bg-orange-400 text-white'; 
      case 'F':
          return 'bg-orange-600 text-white'; 
      case 'G':
          return 'bg-red-700 text-white'; 
      default:
          return 'bg-gray-400 text-white'; 
  }
};

export const getEnergyRatingTextColorClass = (rating: string): string => {
  switch (rating) {
      case 'A':
          return 'text-green-600'; 
      case 'B':
          return 'text-lime-500'; 
      case 'C':
          return 'text-lime-300'; 
      case 'D':
          return 'text-yellow-400'; 
      case 'E':
          return 'text-orange-400'; 
      case 'F':
          return 'text-orange-600'; 
      case 'G':
          return 'text-red-700'; 
      default:
          return 'text-gray-400'; 
  }
};