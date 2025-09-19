// ==========================================
// COURSE ENROLLMENT MANAGEMENT CONSTANTS
// ==========================================

// Sort Options
export const SORT_OPTIONS = {
  TITLE: 'title',
  AREA: 'area',
  ENROLLED_STUDENTS: 'enrolledStudents',
  VIEWS: 'views',
  ENROLLMENT_RATE: 'enrollmentRate'
}

// Sort Orders
export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
}

// Filter Options
export const FILTER_OPTIONS = {
  ALL_AREAS: 'all'
}

// Quick Change Amounts
export const QUICK_CHANGE = {
  INCREMENT: 5,
  DECREMENT: -5
}

// Enrollment Rate Thresholds
export const ENROLLMENT_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
  LOW: 0
}

// Student Status
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended'
}

// Progress Thresholds
export const PROGRESS_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 50,
  LOW: 0
}

// ==========================================
// STYLES
// ==========================================

export const ENROLLMENT_STYLES = {
  // Main Container
  container: 'bg-surface rounded-xl p-6',

  // Header
  header: 'flex flex-col md:flex-row md:items-center justify-between mb-6',
  headerTitle: 'text-xl font-bold text-white mb-4 md:mb-0',
  headerControls: 'flex items-center space-x-4',

  // Filters & Controls
  areaSelect: 'bg-background border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent',
  revertButton: 'bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors',

  // Summary Stats
  summaryGrid: 'grid md:grid-cols-3 gap-4 mb-6',
  summaryCard: 'bg-background rounded-lg p-4',
  summaryLabel: 'text-text-secondary text-sm',
  summaryValue: 'text-2xl font-bold text-white',
  summaryValueAccent: 'text-2xl font-bold text-accent',

  // Table Container
  tableContainer: 'overflow-x-auto',
  table: 'w-full',

  // Table Header
  tableHeader: 'border-b border-gray-600',
  tableHeaderCell: 'text-left py-3 px-4 font-medium text-text-secondary cursor-pointer hover:text-white transition-colors',
  tableHeaderCellCenter: 'text-center py-3 px-4 font-medium text-text-secondary cursor-pointer hover:text-white transition-colors',
  tableHeaderCellFixed: 'text-center py-3 px-4 font-medium text-text-secondary',

  // Table Body
  tableRow: 'border-b border-gray-700 hover:bg-background transition-colors',
  tableCell: 'py-4 px-4',
  tableCellCenter: 'py-4 px-4 text-center',

  // Course Info
  courseInfo: '',
  courseTitle: 'text-white font-medium truncate max-w-xs',
  courseInstructor: 'text-text-secondary text-sm',
  areaLabel: 'capitalize font-medium',

  // Enrollment Editing
  editingContainer: 'flex items-center justify-center space-x-2',
  editingInput: 'w-20 bg-background border border-gray-600 text-white rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-accent',
  editingButtonSave: 'text-green-500 hover:text-green-400 p-1',
  editingButtonCancel: 'text-red-500 hover:text-red-400 p-1',

  // Data Display
  enrollmentValue: 'text-white font-bold',
  viewsValue: 'text-blue-400 font-bold',
  studentsValue: 'text-text-secondary',

  // Enrollment Rate Colors
  enrollmentRateHigh: 'text-green-500',
  enrollmentRateMedium: 'text-yellow-500',
  enrollmentRateLow: 'text-red-500',

  // Action Buttons
  actionButtonsContainer: 'flex items-center justify-center space-x-1',
  actionButtonDecrease: 'bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors shadow-sm',
  actionButtonEdit: 'bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors shadow-sm',
  actionButtonIncrease: 'bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors shadow-sm',
  actionButtonView: 'bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors shadow-sm',

  // Empty State
  emptyState: 'text-center py-8 text-text-secondary',

  // Modal Overlay
  modalOverlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
  modalContainer: 'bg-surface rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto',
  modalHeader: 'flex items-center justify-between mb-6',
  modalTitle: 'text-xl font-bold text-white',
  modalSubtitle: 'text-text-secondary',
  modalCloseButton: 'text-gray-400 hover:text-white',

  // Students Table
  studentsTableContainer: 'overflow-x-auto',
  studentsTable: 'w-full',
  studentsTableHeader: 'border-b border-gray-600',
  studentsTableHeaderCell: 'text-left py-3 px-4 font-medium text-text-secondary',
  studentsTableHeaderCellCenter: 'text-center py-3 px-4 font-medium text-text-secondary',
  studentsTableRow: 'border-b border-gray-700 hover:bg-background transition-colors',
  studentsTableCell: 'py-4 px-4',
  studentsTableCellCenter: 'py-4 px-4 text-center',

  // Student Info
  studentContainer: 'flex items-center space-x-3',
  studentAvatar: 'w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center',
  studentAvatarText: 'text-white font-bold text-sm',
  studentName: 'text-white font-medium',
  studentPhone: 'text-text-secondary text-sm',
  studentEmail: 'text-text-secondary',

  // Area Badge
  areaBadge: 'px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400',

  // Progress Bar
  progressContainer: 'flex items-center justify-center space-x-2',
  progressBar: 'w-20 bg-gray-700 rounded-full h-2',
  progressFillHigh: 'h-2 rounded-full bg-green-500',
  progressFillMedium: 'h-2 rounded-full bg-yellow-500',
  progressFillLow: 'h-2 rounded-full bg-orange-500',
  progressText: 'text-white text-sm font-medium',

  // Status Badge
  statusBadgeActive: 'px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400',
  statusBadgeSuspended: 'px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400',

  // Empty Students State
  emptyStudentsContainer: 'text-center py-12',
  emptyStudentsIcon: 'w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4',
  emptyStudentsIconSvg: 'w-10 h-10 text-gray-400',
  emptyStudentsTitle: 'text-text-secondary text-lg',
  emptyStudentsSubtitle: 'text-text-secondary text-sm mt-2'
}

// ==========================================
// LABELS & MESSAGES
// ==========================================

export const ENROLLMENT_LABELS = {
  // Page Title
  pageTitle: 'Inscripciones por Curso',

  // Header Controls
  filterAllAreas: 'Todas las áreas',
  revertChanges: 'Revertir Cambios',
  revertConfirmation: '¿Estás seguro de que quieres revertir todos los cambios temporales?',

  // Summary Stats
  summary: {
    totalEnrolled: 'Total Inscritos',
    averageRate: 'Tasa Promedio',
    coursesShown: 'Cursos Mostrados'
  },

  // Table Headers
  tableHeaders: {
    course: 'Curso',
    area: 'Área',
    enrolled: 'Inscritos',
    views: 'Vistas',
    rate: 'Tasa',
    realStudents: 'Estudiantes reales',
    actions: 'Acciones'
  },

  // Sort Indicators
  sortIndicators: {
    desc: '↓',
    asc: '↑'
  },

  // Action Buttons
  actions: {
    decrease: 'Reducir',
    edit: 'Editar',
    increase: 'Agregar',
    view: '👥 Ver',
    save: '✓',
    cancel: '✕'
  },

  // Button Tooltips
  tooltips: {
    decrease: 'Reducir 5 estudiantes',
    edit: 'Editar cantidad exacta',
    increase: 'Agregar 5 estudiantes',
    view: 'Ver estudiantes inscritos',
    save: 'Guardar',
    cancel: 'Cancelar'
  },

  // Empty States
  emptyStates: {
    noCourses: 'No hay cursos disponibles para el filtro seleccionado',
    noStudents: 'No hay estudiantes inscritos',
    noStudentsDescription: 'Este curso aún no tiene estudiantes inscritos'
  },

  // Modal
  modal: {
    studentsTitle: 'Estudiantes Inscritos',
    studentsCount: 'estudiantes'
  },

  // Students Table Headers
  studentsTable: {
    student: 'Estudiante',
    email: 'Email',
    area: 'Área',
    progress: 'Progreso',
    enrollment: 'Inscripción',
    lastActivity: 'Última Actividad',
    status: 'Estado'
  },

  // Student Status
  studentStatus: {
    active: 'Activo',
    suspended: 'Suspendido'
  },

  // Validation Messages
  validation: {
    invalidNumber: 'Por favor ingresa un número válido mayor o igual a 0',
    updateError: 'Error al actualizar inscripciones. Inténtalo de nuevo.'
  },

  // Success Messages
  success: {
    enrollmentUpdated: 'Inscripciones actualizadas para curso',
    enrollmentSet: 'Inscripciones establecidas en'
  },

  // Common
  common: {
    notAvailable: 'N/A'
  }
}

// ==========================================
// ICONS
// ==========================================

export const ENROLLMENT_ICONS = {
  // Actions
  save: '✓',
  cancel: '✕',
  view: '👥',

  // General
  users: '👥',
  close: '✕',

  // SVG Icons (as components or paths)
  closeIcon: {
    viewBox: '0 0 24 24',
    path: 'M6 18L18 6M6 6l12 12'
  },

  usersIcon: {
    viewBox: '0 0 24 24',
    path: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
  }
}

// ==========================================
// CONFIGURATION
// ==========================================

export const ENROLLMENT_CONFIG = {
  // Default Sort
  defaultSort: SORT_OPTIONS.ENROLLED_STUDENTS,
  defaultOrder: SORT_ORDERS.DESC,
  defaultFilter: FILTER_OPTIONS.ALL_AREAS,

  // Quick Change
  quickChangeAmount: 5,

  // Validation
  minEnrollment: 0,

  // Table
  maxCourseNameLength: 'max-w-xs',

  // Progress
  progressBarWidth: 'w-20',

  // Avatar
  avatarSize: 'w-10 h-10',
  maxInitials: 2,

  // Modal
  modalMaxWidth: 'max-w-4xl',
  modalMaxHeight: 'max-h-[90vh]',

  // Empty State Icons
  emptyIconSize: 'w-20 h-20',
  emptyIconSvgSize: 'w-10 h-10',

  // Date Format
  dateLocale: 'es-PE'
}

// ==========================================
// DEFAULT DATA STRUCTURES
// ==========================================

export const DEFAULT_ENROLLMENT_DATA = {
  totalEnrolled: 0,
  averageEnrollmentRate: 0,
  coursesCount: 0
}

export const DEFAULT_STUDENT = {
  id: null,
  name: '',
  email: '',
  phone: '',
  selectedArea: '',
  progress: 0,
  enrollmentDate: new Date().toISOString(),
  lastActivity: null,
  suspended: false
}

export const DEFAULT_COURSE = {
  id: null,
  title: '',
  instructor: '',
  area: '',
  enrolledStudents: 0,
  views: 0,
  students: 0,
  enrollmentData: {
    enrollmentRate: 0
  },
  enrolledStudentsData: []
}

// ==========================================
// UTILITY FUNCTIONS CONSTANTS
// ==========================================

export const ENROLLMENT_UTILS = {
  // Sort comparison types
  SORT_TYPES: {
    STRING: 'string',
    NUMBER: 'number'
  },

  // Color mapping for enrollment rates
  RATE_COLORS: {
    [ENROLLMENT_THRESHOLDS.HIGH]: ENROLLMENT_STYLES.enrollmentRateHigh,
    [ENROLLMENT_THRESHOLDS.MEDIUM]: ENROLLMENT_STYLES.enrollmentRateMedium,
    [ENROLLMENT_THRESHOLDS.LOW]: ENROLLMENT_STYLES.enrollmentRateLow
  },

  // Progress colors
  PROGRESS_COLORS: {
    [PROGRESS_THRESHOLDS.HIGH]: ENROLLMENT_STYLES.progressFillHigh,
    [PROGRESS_THRESHOLDS.MEDIUM]: ENROLLMENT_STYLES.progressFillMedium,
    [PROGRESS_THRESHOLDS.LOW]: ENROLLMENT_STYLES.progressFillLow
  },

  // Status colors
  STATUS_COLORS: {
    [STUDENT_STATUS.ACTIVE]: ENROLLMENT_STYLES.statusBadgeActive,
    [STUDENT_STATUS.SUSPENDED]: ENROLLMENT_STYLES.statusBadgeSuspended
  }
}