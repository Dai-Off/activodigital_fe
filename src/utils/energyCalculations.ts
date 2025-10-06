import type { PersistedEnergyCertificate } from '../services/energyCertificates';

/**
 * Obtiene el rating del último certificado subido en la aplicación (por created_at)
 */
export const getLatestRating = (certificates: PersistedEnergyCertificate[]): string => {
  if (!certificates || certificates.length === 0) {
    return 'G'; // Sin certificados = peor rating
  }

  // Ordenar por fecha de creación en la app (created_at más reciente primero) y tomar el primero
  const sortedCertificates = certificates.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Último cargado primero
  });

  const latestCert = sortedCertificates[0];
  
  if (latestCert.rating && ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(latestCert.rating)) {
    return latestCert.rating;
  }

  return 'G';
};

/**
 * Obtiene las emisiones de CO2 del último certificado subido en la aplicación (por created_at)
 */
export const getLatestCO2Emissions = (certificates: PersistedEnergyCertificate[]): number => {
  if (!certificates || certificates.length === 0) {
    return 0;
  }

  // Ordenar por fecha de creación en la app (created_at más reciente primero) y tomar el primero
  const sortedCertificates = certificates.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Último cargado primero
  });

  const latestCert = sortedCertificates[0];
  
  if (latestCert.emissionsKgCo2PerM2Year && 
      typeof latestCert.emissionsKgCo2PerM2Year === 'number' && 
      latestCert.emissionsKgCo2PerM2Year > 0) {
    return latestCert.emissionsKgCo2PerM2Year;
  }

  return 0;
};

/**
 * Calcula el número de estrellas basado en el rating específico
 */
export const getRatingStars = (rating: string): number => {
  const ratingStars = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 3,
    'E': 2,
    'F': 1,
    'G': 1
  };

  return ratingStars[rating as keyof typeof ratingStars] || 1;
};
