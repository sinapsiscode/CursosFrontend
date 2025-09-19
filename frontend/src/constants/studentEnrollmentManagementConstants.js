// ===================================
// STUDENT ENROLLMENT MANAGEMENT CONSTANTS
// ===================================
// Constantes centralizadas para el módulo StudentEnrollmentManagement
// Sigue el patrón SOLID: Single Responsibility Principle

// ===================================
// ENUMS & STATUS CONSTANTS
// ===================================

export const ENROLLMENT_STATUS = {
  ENROLLED: 'enrolled',
  NOT_ENROLLED: 'not_enrolled',
  PENDING: 'pending'
}

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

export const AREAS = {
  ALL: 'all',
  METALURGIA: 'metalurgia',
  MINERIA: 'mineria',
  GEOLOGIA: 'geologia'
}

export const MODAL_STATES = {
  HIDDEN: false,
  VISIBLE: true
}

export const LOADING_STATES = {
  IDLE: false,
  LOADING: true
}

// ===================================
// AREA CONFIGURATION
// ===================================

export const AREA_COLORS = {
  [AREAS.METALURGIA]: 'bg-blue-500',
  [AREAS.MINERIA]: 'bg-green-500',
  [AREAS.GEOLOGIA]: 'bg-orange-500',
  default: 'bg-gray-500'
}

export const AREA_LABELS = {
  [AREAS.ALL]: 'Todas las áreas',
  [AREAS.METALURGIA]: 'Metalurgia',
  [AREAS.MINERIA]: 'Minería',
  [AREAS.GEOLOGIA]: 'Geología'
}

export const AREA_OPTIONS = [
  { value: AREAS.ALL, label: AREA_LABELS[AREAS.ALL] },
  { value: AREAS.METALURGIA, label: AREA_LABELS[AREAS.METALURGIA] },
  { value: AREAS.MINERIA, label: AREA_LABELS[AREAS.MINERIA] },
  { value: AREAS.GEOLOGIA, label: AREA_LABELS[AREAS.GEOLOGIA] }
]

// ===================================
// NOTIFICATION SETTINGS
// ===================================

export const NOTIFICATION_CONFIG = {
  DURATION: 3000, // 3 segundos
  POSITION: 'bottom-right',
  Z_INDEX: 50
}

export const NOTIFICATION_STYLES = {
  [NOTIFICATION_TYPES.SUCCESS]: 'bg-green-500',
  [NOTIFICATION_TYPES.ERROR]: 'bg-red-500',
  [NOTIFICATION_TYPES.WARNING]: 'bg-yellow-500',
  [NOTIFICATION_TYPES.INFO]: 'bg-blue-500'
}

// ===================================
// ENROLLMENT MODAL CONFIGURATION
// ===================================

export const ENROLLMENT_MODAL_INITIAL_STATE = {
  show: false,
  studentId: null,
  courseId: null,
  couponCode: '',
  validatingCoupon: false,
  couponResult: null
}

export const COUPON_VALIDATION_STATES = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  VALID: 'valid',
  INVALID: 'invalid'
}

// ===================================
// COMPONENT STYLING CONSTANTS
// ===================================

export const ENROLLMENT_STYLES = {
  // Container styles
  MAIN_CONTAINER: 'space-y-6',
  CARD_CONTAINER: 'bg-surface rounded-xl p-6',
  BACKGROUND_CARD: 'bg-background rounded-lg p-4',

  // Header styles
  HEADER_CONTAINER: 'flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6',
  TITLE: 'text-2xl font-bold text-white',
  SEARCH_CONTAINER: 'flex flex-col sm:flex-row gap-4',

  // Form controls
  INPUT: 'bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none',
  SELECT: 'bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none',

  // Stats grid
  STATS_GRID: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  STAT_CARD: 'bg-background rounded-lg p-4',
  STAT_ICON_CONTAINER: 'p-2 rounded-lg mr-3',
  STAT_LABEL: 'text-text-secondary text-sm',
  STAT_VALUE: 'text-xl font-bold text-white',

  // Student card styles
  STUDENT_GRID: 'grid gap-6',
  STUDENT_CARD: 'bg-surface rounded-xl p-6',
  STUDENT_LAYOUT: 'flex flex-col lg:flex-row lg:items-start gap-6',
  STUDENT_INFO_SECTION: 'lg:w-1/3',
  STUDENT_COURSES_SECTION: 'lg:w-2/3',

  // Student info
  STUDENT_HEADER: 'flex items-center space-x-4 mb-4',
  STUDENT_AVATAR: 'w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center',
  STUDENT_AVATAR_TEXT: 'text-white font-bold text-lg',
  STUDENT_NAME: 'text-white font-semibold text-lg',
  STUDENT_EMAIL: 'text-text-secondary',
  STUDENT_DETAILS: 'space-y-2',
  STUDENT_DETAIL_ROW: 'flex items-center justify-between',
  STUDENT_DETAIL_LABEL: 'text-text-secondary text-sm',
  STUDENT_DETAIL_VALUE: 'text-white text-sm',
  ENROLLMENT_COUNT: 'text-accent font-bold',

  // Course grid
  COURSES_GRID: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
  COURSE_CARD_BASE: 'border-2 rounded-lg p-3 transition-all cursor-pointer',
  COURSE_CARD_ENROLLED: 'border-green-500 bg-green-500/10',
  COURSE_CARD_NOT_ENROLLED: 'border-gray-600 hover:border-gray-500',
  COURSE_CONTENT: 'flex items-center justify-between',
  COURSE_INFO: 'flex-1',
  COURSE_TITLE: 'text-white font-medium text-sm',
  COURSE_PRICE: 'text-text-secondary text-xs',
  COURSE_CHECKBOX_BASE: 'w-5 h-5 rounded-full border-2 flex items-center justify-center',
  COURSE_CHECKBOX_CHECKED: 'border-green-500 bg-green-500',
  COURSE_CHECKBOX_UNCHECKED: 'border-gray-400',

  // Empty state
  EMPTY_STATE_CONTAINER: 'bg-surface rounded-xl p-12 text-center',
  EMPTY_STATE_ICON: 'text-6xl mb-4',
  EMPTY_STATE_TITLE: 'text-xl font-bold text-white mb-2',
  EMPTY_STATE_MESSAGE: 'text-text-secondary mb-6',
  EMPTY_STATE_BUTTON: 'bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors'
}

// ===================================
// MODAL STYLING CONSTANTS
// ===================================

export const MODAL_STYLES = {
  // Modal overlay and container
  OVERLAY: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
  CONTAINER: 'bg-surface rounded-xl p-6 w-full max-w-md',

  // Header
  HEADER: 'flex items-center justify-between mb-6',
  TITLE: 'text-xl font-bold text-white',
  CLOSE_BUTTON: 'text-gray-400 hover:text-white',

  // Content
  CONTENT: 'space-y-4',
  INFO_SECTION: 'bg-background rounded-lg p-4',
  INFO_ROW: 'flex justify-between',
  INFO_LABEL: 'text-text-secondary',
  INFO_VALUE: 'text-white',

  // Coupon section
  COUPON_LABEL: 'block text-text-secondary text-sm font-medium mb-2',
  COUPON_INPUT_CONTAINER: 'flex space-x-2',
  COUPON_INPUT: 'flex-1 bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none',
  COUPON_VALIDATE_BUTTON: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed',

  // Coupon result
  COUPON_RESULT_BASE: 'mt-3 p-3 rounded-lg text-sm',
  COUPON_RESULT_VALID: 'bg-green-500/20 border border-green-500/30',
  COUPON_RESULT_INVALID: 'bg-red-500/20 border border-red-500/30',
  COUPON_RESULT_TITLE_VALID: 'font-medium text-green-400',
  COUPON_RESULT_TITLE_INVALID: 'font-medium text-red-400',
  COUPON_RESULT_MESSAGE: 'text-gray-300 mt-1',

  // Action buttons
  ACTIONS_CONTAINER: 'flex space-x-3 pt-4',
  CONFIRM_BUTTON: 'flex-1 bg-accent text-background py-3 px-4 rounded-lg font-medium hover:bg-opacity-90',
  CANCEL_BUTTON: 'flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700'
}

// ===================================
// STATS CONFIGURATION
// ===================================

export const STATS_CONFIG = {
  TOTAL_STUDENTS: {
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 01-13.5 0',
    label: 'Total Estudiantes',
    colorClass: 'bg-blue-500'
  },
  TOTAL_COURSES: {
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    label: 'Total Cursos',
    colorClass: 'bg-green-500'
  },
  TOTAL_ENROLLMENTS: {
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    label: 'Inscripciones Totales',
    colorClass: 'bg-purple-500'
  },
  AVERAGE_ENROLLMENTS: {
    icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    label: 'Promedio por Estudiante',
    colorClass: 'bg-orange-500'
  }
}

// ===================================
// SEARCH & FILTER CONFIGURATION
// ===================================

export const SEARCH_CONFIG = {
  PLACEHOLDER: 'Buscar estudiante...',
  MIN_LENGTH: 0,
  DEBOUNCE_DELAY: 300
}

export const FILTER_CONFIG = {
  DEFAULT_AREA: AREAS.ALL,
  SEARCH_FIELDS: ['name', 'email']
}

// ===================================
// COUPON CONFIGURATION
// ===================================

export const COUPON_CONFIG = {
  PLACEHOLDER: 'Ej: DESC-ABC123',
  MAX_LENGTH: 20,
  VALIDATION_MESSAGES: {
    VALID: '✅ Cupón válido',
    INVALID: '❌ Cupón inválido',
    ERROR: 'Error al validar el cupón',
    EMPTY: 'Verifica el código e intenta nuevamente'
  }
}

// ===================================
// SUCCESS/ERROR MESSAGES
// ===================================

export const MESSAGES = {
  SUCCESS: {
    STUDENT_ENROLLED: 'Estudiante inscrito en el curso',
    STUDENT_ENROLLED_WITH_COUPON: (discount) => `Estudiante inscrito con descuento del ${discount}%`,
    STUDENT_REMOVED: 'Estudiante removido del curso'
  },
  ERROR: {
    ENROLLMENT_FAILED: 'Error al inscribir estudiante',
    REMOVAL_FAILED: 'Error al remover estudiante',
    COUPON_VALIDATION_FAILED: 'Error al validar el cupón',
    DATA_LOAD_FAILED: 'Error al cargar datos'
  },
  EMPTY_STATES: {
    NO_STUDENTS: 'No se encontraron estudiantes',
    ADJUST_FILTERS: 'Intenta ajustar los filtros de búsqueda',
    REGISTER_STUDENTS: 'Primero registra algunos estudiantes en la pestaña "Estudiantes"',
    GO_TO_STUDENTS: 'Ir a Estudiantes'
  }
}

// ===================================
// ICONS SVG PATHS
// ===================================

export const ICONS = {
  CLOSE: 'M6 18L18 6M6 6l12 12',
  CHECK: 'M5 13l4 4L19 7',
  STUDENTS: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 01-13.5 0',
  COURSES: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  ENROLLMENTS: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  ANALYTICS: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
}

// ===================================
// RESPONSIVE BREAKPOINTS
// ===================================

export const BREAKPOINTS = {
  SM: 'sm:',
  LG: 'lg:',
  GRID_COLS: {
    MOBILE: 'grid-cols-1',
    TABLET: 'sm:grid-cols-2',
    DESKTOP: 'lg:grid-cols-4'
  }
}

// ===================================
// VALIDATION RULES
// ===================================

export const VALIDATION_RULES = {
  COUPON_CODE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9-]+$/
  },
  SEARCH_TERM: {
    MIN_LENGTH: 0,
    MAX_LENGTH: 100
  }
}

// ===================================
// ACCESSIBILITY CONSTANTS
// ===================================

export const ACCESSIBILITY = {
  LABELS: {
    SEARCH_INPUT: 'Buscar estudiante por nombre o email',
    AREA_SELECT: 'Filtrar por área de estudio',
    ENROLL_BUTTON: 'Inscribir estudiante en curso',
    UNENROLL_BUTTON: 'Remover estudiante del curso',
    CLOSE_MODAL: 'Cerrar modal de inscripción',
    VALIDATE_COUPON: 'Validar código de cupón'
  },
  ROLES: {
    BUTTON: 'button',
    DIALOG: 'dialog',
    GRID: 'grid',
    LISTBOX: 'listbox'
  }
}

// ===================================
// DEBUGGING & LOGGING
// ===================================

export const DEBUG_CONFIG = {
  ENABLED: true,
  PREFIX: '🎓 StudentEnrollmentManager',
  COLORS: {
    INFO: '🔍',
    SUCCESS: '✅',
    ERROR: '❌',
    WARNING: '⚠️'
  }
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

export const PERFORMANCE_CONFIG = {
  VIRTUAL_SCROLL_THRESHOLD: 50,
  DEBOUNCE_SEARCH: 300,
  MEMO_DEPENDENCIES: ['students', 'courses', 'enrollments', 'searchTerm', 'selectedArea']
}