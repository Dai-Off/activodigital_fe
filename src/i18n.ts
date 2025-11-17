import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Recursos de traducción básicos
const resources = {
  es: {
    translation: {
      // Traducciones básicas que se usan en toda la app
      login: 'Iniciar sesión',
      register: 'Registrarse',
      logout: 'Cerrar sesión',
      search: 'Buscar edificios...',
      buildings: 'Edificios',
      assets: 'Activos',
      
      // Dashboard
      generalDashboard: 'Dashboard General',
      executiveSummary: 'Resumen ejecutivo del portfolio de activos',
      createBuilding: 'Crear edificio',
      energyBuildings: 'Edificios energéticos',
      completedBooks: 'Libros completados',
      pending: 'Pendientes',
      totalSurface2: 'Superficie Total',
      dominantTypology: 'Tipología Dominante',
      avgUnits2: 'Promedio Unidades',
      avgAge2: 'Edad Promedio',
      years: 'años',
      buildingBooksCompleted: '% libros del edificio completados',
      completed: 'Completado',
      
      // Tipologías
      residential: 'Residencial',
      commercial: 'Comercial',
      office: 'Mixto',
      
      // Navegación
      assetsList: 'Listado de activos',
      filters2: 'Filtros',
      type: 'Tipo',
      all: 'Todos',
      city: 'Ciudad',
      clearFilters: 'Limpiar filtros',
      generalView: 'Vista General',
      backToDashboard: 'Volver al dashboard',
      
      // Mensajes
      errorLoadingStats: 'Error al cargar estadísticas',
      languageChangedTo: 'Idioma cambiado a',
      selectLanguage: 'Seleccionar idioma',
      notifications: 'Notificaciones',
      noNotifications: 'No hay notificaciones',
      aiAssistant: 'Asistente IA',
      profile: 'Mi perfil',
      settings: 'Configuración',
      userArkia: 'Usuario ARKIA',
      sessionClosed: 'Sesión cerrada correctamente',
      buildingsFound: 'Edificios encontrados',
      noAddress: 'Sin dirección',
    }
  },
  en: {
    translation: {
      login: 'Log in',
      register: 'Register',
      logout: 'Log out',
      search: 'Search buildings...',
      buildings: 'Buildings',
      assets: 'Assets',
      
      // Dashboard
      generalDashboard: 'General Dashboard',
      executiveSummary: 'Executive summary of the asset portfolio',
      createBuilding: 'Create building',
      energyBuildings: 'Energy buildings',
      completedBooks: 'Completed books',
      pending: 'Pending',
      totalSurface2: 'Total Surface Area',
      dominantTypology: 'Dominant Typology',
      avgUnits2: 'Average Units',
      avgAge2: 'Average Age',
      years: 'years',
      buildingBooksCompleted: '% building books completed',
      completed: 'Completed',
      
      // Typologies
      residential: 'Residential',
      commercial: 'Commercial',
      office: 'Mixed',
      
      // Navigation
      assetsList: 'Assets List',
      filters2: 'Filters',
      type: 'Type',
      all: 'All',
      city: 'City',
      clearFilters: 'Clear filters',
      generalView: 'General View',
      backToDashboard: 'Back to dashboard',
      
      // Messages
      errorLoadingStats: 'Error loading statistics',
      languageChangedTo: 'Language changed to',
      selectLanguage: 'Select language',
      notifications: 'Notifications',
      noNotifications: 'No notifications',
      aiAssistant: 'AI Assistant',
      profile: 'My profile',
      settings: 'Settings',
      userArkia: 'ARKIA User',
      sessionClosed: 'Session closed successfully',
      buildingsFound: 'Buildings found',
      noAddress: 'No address',
    }
  }
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto
    debug: false,
    
    interpolation: {
      escapeValue: false // React ya escapa los valores
    },
    
    detection: {
      // Opciones de detección de idioma
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;

