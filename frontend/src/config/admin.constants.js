// ========================================
// CONFIGURACIÓN CENTRALIZADA DEL ADMIN
// ========================================

// Configuración de tabs
export const ADMIN_TABS = {
  DASHBOARD: 'dashboard',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  STUDENTS: 'students',
  REVIEWS: 'reviews',
  LOYALTY: 'loyalty',
  STUDENT_ENROLLMENTS: 'student-enrollments',
  COUPONS: 'coupons',
  AREAS: 'areas',
  REPORTS: 'reports',
  WHATSAPP: 'whatsapp',
  NOTIFICATIONS: 'notifications',
  EVENTS: 'events',
  EXAMS: 'exams',
  PHOTOS: 'photos'
}

// Descripciones de tabs
export const TAB_DESCRIPTIONS = {
  [ADMIN_TABS.DASHBOARD]: 'Resumen de actividad de la plataforma',
  [ADMIN_TABS.COURSES]: 'Gestión y administración de cursos',
  [ADMIN_TABS.ENROLLMENTS]: 'Control de contadores de inscripciones por curso',
  [ADMIN_TABS.STUDENTS]: 'Gestión y registro de estudiantes',
  [ADMIN_TABS.REVIEWS]: 'Gestión y control de reseñas publicadas',
  [ADMIN_TABS.LOYALTY]: 'Gestión del programa de fidelización y puntos',
  [ADMIN_TABS.STUDENT_ENROLLMENTS]: 'Inscripción manual de estudiantes por curso',
  [ADMIN_TABS.COUPONS]: 'Gestión de códigos y cupones de descuento',
  [ADMIN_TABS.AREAS]: 'Configuración de áreas de estudio',
  [ADMIN_TABS.REPORTS]: 'Reportes detallados de estudiantes y encuestas',
  [ADMIN_TABS.WHATSAPP]: 'Configuración de WhatsApp para lead generation',
  [ADMIN_TABS.NOTIFICATIONS]: 'Centro de notificaciones interactivas',
  [ADMIN_TABS.EVENTS]: 'Gestión de eventos y webinars',
  [ADMIN_TABS.EXAMS]: 'Administración de exámenes y evaluaciones',
  [ADMIN_TABS.PHOTOS]: 'Gestión de galería de fotos y multimedia'
}

// Configuración de tiempo
export const TIME_RANGES = {
  WEEK: { value: 'week', label: 'Última semana' },
  MONTH: { value: 'month', label: 'Último mes' },
  YEAR: { value: 'year', label: 'Último año' }
}

// Validaciones
export const VALIDATION_RULES = {
  dni: {
    pattern: /^\d{8}$/,
    message: 'El DNI debe tener exactamente 8 números'
  },
  phone: {
    pattern: /^9\d{8}$/,
    message: 'El teléfono debe tener 9 números y empezar con 9'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Ingresa un email válido'
  },
  courseName: {
    minLength: 3,
    maxLength: 100,
    message: 'El nombre del curso debe tener entre 3 y 100 caracteres'
  },
  price: {
    min: 0,
    max: 10000,
    message: 'El precio debe estar entre 0 y 10,000'
  }
}

// Estados de cursos
export const COURSE_STATUS = {
  DRAFT: { value: 'draft', label: 'Borrador', color: 'gray' },
  PUBLISHED: { value: 'published', label: 'Publicado', color: 'green' },
  ARCHIVED: { value: 'archived', label: 'Archivado', color: 'yellow' },
  DELETED: { value: 'deleted', label: 'Eliminado', color: 'red' }
}

// Niveles de curso
export const COURSE_LEVELS = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'expert', label: 'Experto' }
]

// Categorías de cursos
export const COURSE_CATEGORIES = [
  { value: 'metalurgia', label: 'Metalurgia' },
  { value: 'soldadura', label: 'Soldadura' },
  { value: 'fundicion', label: 'Fundición' },
  { value: 'tratamientos', label: 'Tratamientos Térmicos' },
  { value: 'ensayos', label: 'Ensayos No Destructivos' },
  { value: 'calidad', label: 'Control de Calidad' }
]

// Configuración de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: { type: 'success', duration: 3000, color: 'green' },
  ERROR: { type: 'error', duration: 5000, color: 'red' },
  WARNING: { type: 'warning', duration: 4000, color: 'yellow' },
  INFO: { type: 'info', duration: 3000, color: 'blue' }
}

// Mensajes comunes
export const MESSAGES = {
  loading: 'Cargando...',
  saving: 'Guardando cambios...',
  saved: 'Cambios guardados exitosamente',
  error: 'Ha ocurrido un error',
  confirm_delete: '¿Estás seguro de eliminar este elemento?',
  deleted: 'Elemento eliminado correctamente',
  no_data: 'No hay datos disponibles',
  required_field: 'Este campo es obligatorio',
  invalid_format: 'Formato inválido',
  search_placeholder: 'Buscar...',
  filter_by: 'Filtrar por',
  export_success: 'Datos exportados exitosamente',
  import_success: 'Datos importados exitosamente'
}

// Configuración de paginación
export const PAGINATION = {
  itemsPerPage: [10, 20, 50, 100],
  defaultItemsPerPage: 20,
  maxPagesShown: 5
}

// Configuración de gráficos
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  tertiary: '#F59E0B',
  quaternary: '#8B5CF6',
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6'
}

// Formatos
export const FORMATS = {
  date: 'DD/MM/YYYY',
  datetime: 'DD/MM/YYYY HH:mm',
  time: 'HH:mm',
  currency: { style: 'currency', currency: 'PEN' },
  percentage: { style: 'percent', minimumFractionDigits: 0 }
}

// Configuración de exportación
export const EXPORT_OPTIONS = {
  csv: { extension: '.csv', mimeType: 'text/csv' },
  excel: { extension: '.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  pdf: { extension: '.pdf', mimeType: 'application/pdf' }
}

// Permisos y roles
export const USER_ROLES = {
  ADMIN: { value: 'admin', label: 'Administrador', level: 3 },
  INSTRUCTOR: { value: 'instructor', label: 'Instructor', level: 2 },
  STUDENT: { value: 'student', label: 'Estudiante', level: 1 }
}

// Configuración de WhatsApp
export const WHATSAPP_CONFIG = {
  baseUrl: 'https://wa.me/',
  defaultCountryCode: '+57',
  messageTemplates: {
    welcome: 'Hola! Bienvenido a METSEL Education',
    courseInfo: 'Información sobre el curso: ',
    support: 'Para soporte técnico, contacta a: '
  }
}

// Configuración de lealtad
export const LOYALTY_CONFIG = {
  pointsPerPurchase: 10,
  pointsPerReview: 5,
  pointsPerReferral: 20,
  minimumPointsToRedeem: 100,
  pointsExpirationDays: 365
}

// Estados de inscripción
export const ENROLLMENT_STATUS = {
  PENDING: { value: 'pending', label: 'Pendiente', color: 'yellow' },
  ACTIVE: { value: 'active', label: 'Activo', color: 'green' },
  COMPLETED: { value: 'completed', label: 'Completado', color: 'blue' },
  CANCELLED: { value: 'cancelled', label: 'Cancelado', color: 'red' }
}

// Configuración de áreas
export const STUDY_AREAS = [
  { id: 'metalurgia', name: 'Metalurgia', icon: '⚙️' },
  { id: 'soldadura', name: 'Soldadura', icon: '🔥' },
  { id: 'fundicion', name: 'Fundición', icon: '🏭' },
  { id: 'calidad', name: 'Control de Calidad', icon: '✅' },
  { id: 'seguridad', name: 'Seguridad Industrial', icon: '🦺' }
]