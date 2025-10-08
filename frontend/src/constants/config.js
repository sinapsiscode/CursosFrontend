/**
 * Configuración central de la aplicación
 * Valores que pueden variar entre ambientes (dev, staging, production)
 */

export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5144',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },

  // Storage Configuration
  STORAGE: {
    BASE_URL: import.meta.env.VITE_STORAGE_URL || 'https://storage.metsel.edu.co',
  },

  // Session Configuration
  SESSION: {
    UPDATE_INTERVAL: 30000, // 30 segundos
    IDLE_TIMEOUT: 1800000, // 30 minutos
  },

  // Delays/Timeouts comunes
  DELAYS: {
    FAST: 500,
    NORMAL: 1000,
    MEDIUM: 1500,
    SLOW: 2000,
    VERY_SLOW: 3000,
    DEBOUNCE: 300,
  },

  // Límites de archivos
  FILE_LIMITS: {
    VIDEO: 500 * 1024 * 1024, // 500MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    IMAGE: 10 * 1024 * 1024, // 10MB
  },

  // Paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    PREVIEW_LIMIT: 5,
  },

  // Búsqueda
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_RESULTS: 100, // Cambiado de 1000 para mejor performance
    DEBOUNCE_DELAY: 300,
  },

  // WhatsApp
  WHATSAPP: {
    ACCESS_TOKEN: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN,
    PHONE_NUMBER_ID: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID,
    BUSINESS_ACCOUNT_ID: import.meta.env.VITE_WHATSAPP_BUSINESS_ACCOUNT_ID,
    DEFAULT_PHONE: import.meta.env.VITE_WHATSAPP_DEFAULT_PHONE || '+57 300 123 4567',
  },

  // Demo/Development
  DEMO: {
    PASSWORD: import.meta.env.VITE_DEMO_PASSWORD || 'Demo2024!', // Más seguro que '123456'
    ENABLED: import.meta.env.VITE_DEMO_MODE === 'true',
  },

  // URLs del sitio web
  WEBSITE: {
    BASE_URL: import.meta.env.VITE_WEBSITE_URL || 'https://metsel.edu.co',
    WEBINARS: '/webinars',
    REGISTRATION: '/inscripciones',
  },
}

export default CONFIG
