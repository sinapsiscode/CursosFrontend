// Modos de vista disponibles
export const VIEW_MODES = {
  ALL: 'all',
  COURSE: 'course'
}

// Estados de estudiantes
export const STUDENT_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
}

// Labels para modos de vista
export const VIEW_MODE_LABELS = {
  [VIEW_MODES.ALL]: 'Todos los Estudiantes',
  [VIEW_MODES.COURSE]: 'Por Curso'
}

// Labels para estados
export const STATUS_LABELS = {
  [STUDENT_STATUS.ALL]: 'Todos los estados',
  [STUDENT_STATUS.ACTIVE]: 'Activos',
  [STUDENT_STATUS.COMPLETED]: 'Completados'
}

// Estilos para StudentManagement
export const STUDENT_STYLES = {
  container: 'max-w-7xl mx-auto p-6',

  // Header
  header: 'mb-8',
  title: 'text-3xl font-bold text-white mb-2',
  subtitle: 'text-text-secondary',

  // View Mode Section
  viewModeCard: 'bg-surface rounded-lg p-6 mb-8',
  viewModeContainer: 'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4',
  viewModeTabs: 'flex items-center space-x-2',
  viewModeTab: 'px-4 py-2 rounded-lg font-medium transition-colors',
  viewModeTabActive: 'bg-accent text-background',
  viewModeTabInactive: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
  courseSelect: 'bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none',

  // Filters Section
  filtersCard: 'bg-surface rounded-lg p-6 mb-8',
  filtersContainer: 'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4',
  filtersGroup: 'flex flex-col sm:flex-row gap-4',
  searchContainer: 'relative',
  searchInput: 'bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:border-accent focus:outline-none w-full sm:w-80',
  searchIcon: 'w-5 h-5 text-gray-400 absolute left-3 top-2.5',
  statusSelect: 'bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none',
  resultsCount: 'text-white font-medium',

  // Students List
  studentsCard: 'bg-surface rounded-lg p-6',
  studentsList: 'space-y-4',
  studentItem: 'bg-gray-700/50 rounded-lg p-4 border border-gray-600',
  studentContent: 'flex items-center justify-between',
  studentInfo: 'flex-1',
  studentHeader: 'flex items-center space-x-4 mb-2',
  studentName: 'font-medium text-white',
  studentDetails: 'space-y-2',
  studentContactInfo: 'flex items-center space-x-4 text-sm text-text-secondary',
  studentCourses: 'flex flex-wrap gap-2 mt-2',
  courseTag: 'text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded',
  courseMore: 'text-xs text-gray-400',
  studentEnrollmentInfo: 'flex items-center space-x-4 text-sm text-text-secondary',

  // Status badges
  statusBadge: 'px-3 py-1 rounded-full text-xs font-medium border',
  statusActive: 'text-blue-400 bg-blue-900/20 border-blue-500/30',
  statusCompleted: 'text-green-400 bg-green-900/20 border-green-500/30',
  statusDefault: 'text-gray-400 bg-gray-900/20 border-gray-500/30',

  // Action buttons
  actionButtons: 'flex items-center space-x-3',
  actionButtonsGroup: 'flex space-x-2',
  actionButton: 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
  viewButton: 'bg-blue-600 hover:bg-blue-700 text-white',
  editButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  suspendButton: 'bg-red-600 hover:bg-red-700 text-white',
  markCompleteButton: 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2',
  completedIndicator: 'flex items-center space-x-2 text-green-400',
  completedText: 'text-sm font-medium',

  // Empty states
  emptyState: 'text-center py-12',
  emptyStateIcon: 'w-16 h-16 text-gray-600 mx-auto mb-4',
  emptyStateTitle: 'text-xl font-semibold text-white mb-2',
  emptyStateText: 'text-text-secondary',

  // Loading
  loadingCenter: 'flex justify-center py-12'
}

// Labels y textos
export const STUDENT_LABELS = {
  title: 'Gestión de Estudiantes',
  subtitle: 'Administra todos los estudiantes, sus cursos y progreso',

  // Placeholders
  searchPlaceholder: 'Buscar por nombre, email o DNI...',
  courseSelectPlaceholder: 'Selecciona un curso...',

  // Status labels con iconos
  statusLabels: {
    completedReviewed: '✅ Completado + Reseñado',
    completed: '🎓 Completado',
    active: '📚 En curso'
  },

  // Actions
  actions: {
    viewDetails: 'Ver detalles',
    edit: 'Editar',
    suspend: 'Suspender',
    markCompleted: 'Marcar Completado',
    completed: 'Completado'
  },

  // Info fields
  infoFields: {
    email: '📧',
    dni: '🆔 DNI:',
    phone: '📱',
    enrolled: '📅 Inscrito:',
    completedAt: '✅ Completado:'
  },

  // Empty states
  emptyStates: {
    noStudentsFound: 'No se encontraron estudiantes',
    noStudentsInCourse: 'No hay estudiantes inscritos',
    tryOtherTerms: 'Intenta con otros términos de búsqueda',
    noCourseStudents: 'Este curso no tiene estudiantes inscritos aún'
  },

  // Results count
  resultsCount: {
    singular: 'estudiante encontrado',
    plural: 'estudiantes encontrados'
  }
}

// Iconos SVG para acciones
export const STUDENT_ICONS = {
  users: (
    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  courses: (
    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  view: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  suspend: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  markComplete: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  completed: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  emptyUsers: (
    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  )
}

// Configuración de confirmación para SweetAlert2
export const STUDENT_CONFIRMATION_CONFIG = {
  markCompleted: {
    title: '¿Marcar como completado?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#22c55e',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, marcar como completado',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'bg-gray-800 text-white',
      title: 'text-white',
      htmlContainer: 'text-gray-300'
    }
  },
  success: {
    title: '¡Completado!',
    text: 'El estudiante ha sido marcado como completado',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    customClass: {
      popup: 'bg-gray-800 text-white',
      title: 'text-white'
    }
  },
  error: {
    title: 'Error',
    icon: 'error',
    customClass: {
      popup: 'bg-gray-800 text-white',
      title: 'text-white'
    }
  }
}

// Mensajes de logging
export const STUDENT_LOG_MESSAGES = {
  LOADING_COURSES: '🔄 StudentManagement - Loading courses...',
  COURSES_LOADED: '✅ StudentManagement - Courses loaded:',
  LOADING_STUDENTS: '🔄 StudentManagement - Loading students...',
  STUDENTS_LOADED: '👥 StudentManagement - Students loaded:',
  ENRICHED_STUDENTS: '✅ StudentManagement - Enriched students:',
  COURSE_STUDENTS_LOADED: '🔍 StudentManagement - Course students loaded:',
  COURSES_AVAILABLE: '🔍 StudentManagement - Courses available:',
  FIRST_COURSE: '🔍 StudentManagement - First course:',
  MARKING_COMPLETED: '✅ Marcando estudiante como completado:',
  ERROR_LOADING_DATA: '❌ StudentManagement - Error loading data:',
  ERROR_LOADING_STUDENTS: '❌ StudentManagement - Error loading students:',
  ERROR_LOADING_COURSE_STUDENTS: 'Error loading course students:',
  ERROR_MARKING_COMPLETED: 'Error marking student as completed:'
}

// Configuración de límites y paginación
export const STUDENT_CONFIG = {
  maxDisplayedCourses: 3,
  defaultPageSize: 20,
  searchMinLength: 2
}