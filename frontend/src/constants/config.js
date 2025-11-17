/**
 * Configuración central de la aplicación
 * Valores que pueden variar entre ambientes (dev, staging, production)
 */

export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5144',
    TIMEOUT: 10000,
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
    MAX_RESULTS: 100,
    DEBOUNCE_DELAY: 300,
  },

  // WhatsApp Configuration (Solo info pública - hardcoded)
  WHATSAPP: {
    // Contact Information (Público)
    DEFAULT_PHONE: '+57 300 123 4567',
    BUSINESS_PHONE: '+573001234567',

    // WhatsApp URLs Base
    WA_ME_BASE: 'https://wa.me',
    CHAT_BASE: 'https://chat.whatsapp.com',

    // Group Links (Públicos)
    GROUPS: {
      METALURGIA: 'https://chat.whatsapp.com/metalurgia-pro',
      MINERIA: 'https://chat.whatsapp.com/mineros-unidos',
      GEOLOGIA: 'https://chat.whatsapp.com/geologos-colombia',
      GENERAL: 'https://chat.whatsapp.com/metsel-community',
    },
  },

  // Demo/Development
  DEMO: {
    PASSWORD: 'Demo2024!',
    ENABLED: true,
  },

  // URLs del sitio web
  WEBSITE: {
    BASE_URL: import.meta.env.VITE_WEBSITE_URL || 'https://metsel.edu.co',
    FORMS_URL: 'https://formularios.metsel.edu.co',
    WEBINARS: '/webinars',
    REGISTRATION: '/inscripciones',
    DOCUMENTS: '/docs',
  },

  // External Services URLs (URLs públicas, hardcoded está OK)
  EXTERNAL: {
    UNSPLASH_BASE: 'https://images.unsplash.com',
    ZOOM_BASE: 'https://zoom.us',
    TEAMS_BASE: 'https://teams.microsoft.com',
    YOUTUBE_BASE: 'https://www.youtube.com',
  },

  // Placeholder Images (para desarrollo/demo)
  PLACEHOLDERS: {
    AVATAR_DEFAULT: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    COURSE_DEFAULT: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    EVENT_DEFAULT: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  },
}

export default CONFIG
