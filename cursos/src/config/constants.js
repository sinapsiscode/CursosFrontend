/**
 * Constantes globales de la aplicación
 * Nota: Los valores dinámicos (áreas, cursos) vienen de la API
 */

// Roles de usuario
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user', 
  ADMIN: 'admin',
}

// Estados de review
export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

// Estados de lead
export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
}

// Tipos de examen
export const EXAM_TYPES = {
  INITIAL: 'initial',
  COURSE: 'course',
  CERTIFICATION: 'certification',
}

// Estados de inscripción
export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
}

// Tipos de eventos
export const EVENT_TYPES = {
  WEBINAR: 'webinar',
  WORKSHOP: 'workshop',
  CONFERENCE: 'conference',
  PROMOTION: 'promotion',
}

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
}

// Configuración de archivos
export const FILE_LIMITS = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
  DOCUMENT: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
}

// Configuración de localStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  SELECTED_AREA: 'selected_area',
  GUEST_SESSION: 'guest_session',
}

// Configuración de timeouts
export const TIMEOUTS = {
  API_REQUEST: 10000, // 10s
  TOAST_DURATION: 4000, // 4s
  SESSION_WARNING: 300000, // 5min
}

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  VALIDATION: 'Los datos ingresados no son válidos.',
  GENERIC: 'Ha ocurrido un error inesperado.',
}

// Configuración de validación
export const VALIDATION_RULES = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
  },
}

export default {
  USER_ROLES,
  REVIEW_STATUS,
  LEAD_STATUS,
  EXAM_TYPES,
  ENROLLMENT_STATUS,
  EVENT_TYPES,
  PAGINATION,
  FILE_LIMITS,
  STORAGE_KEYS,
  TIMEOUTS,
  ERROR_MESSAGES,
  VALIDATION_RULES,
}