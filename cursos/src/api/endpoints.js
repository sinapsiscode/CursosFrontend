/**
 * Definición centralizada de endpoints de API
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // Content management (configurable por admin)
  CONTENT: {
    AREAS: '/areas',
    AREA_BY_ID: (id) => `/content/areas/${id}`,
    COURSES: '/courses',
    COURSE_BY_ID: (id) => `/content/courses/${id}`,
    COURSE_BY_AREA: (area) => `/content/courses/area/${area}`,
  },

  // Configuration (admin settings)
  CONFIG: {
    LOYALTY: '/config/loyalty',
    POINTS: '/config/points',
    DISCOUNTS: '/config/discounts',
    WHATSAPP: '/config/whatsapp',
    GENERAL: '/config',
  },

  // Lead management
  LEADS: {
    CREATE: '/leads',
    LIST: '/leads',
    BY_ID: (id) => `/leads/${id}`,
    STATS: '/leads/stats',
    EXPORT: '/leads/export',
  },

  // Exams & Assessments
  EXAMS: {
    INITIAL: '/exams/initial',
    BY_COURSE: (courseId) => `/exams/course/${courseId}`,
    SUBMIT: '/exams/submit',
    RESULTS: '/exams/results',
  },

  // Reviews & Ratings
  REVIEWS: {
    BY_COURSE: (courseId) => `/reviews/course/${courseId}`,
    CREATE: '/reviews',
    MODERATE: '/reviews/moderate',
    PENDING: '/reviews/pending',
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    CONVERSIONS: '/analytics/conversions',
    USER_BEHAVIOR: '/analytics/behavior',
  },

  // File uploads
  UPLOADS: {
    IMAGE: '/uploads/image',
    DOCUMENT: '/uploads/document',
    VIDEO: '/uploads/video',
  },
}

/**
 * Helper para construir URLs con parámetros
 */
export const buildUrl = (endpoint, params = {}) => {
  let url = endpoint
  
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key])
  })
  
  return url
}

export default API_ENDPOINTS