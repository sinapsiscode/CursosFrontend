// Tabs del Admin Dashboard
export const ADMIN_TABS = {
  DASHBOARD: 'dashboard',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  STUDENTS: 'students',
  STUDENT_ENROLLMENTS: 'student-enrollments',
  COUPONS: 'coupons',
  AREAS: 'areas',
  REPORTS: 'reports',
  WHATSAPP: 'whatsapp',
  NOTIFICATIONS: 'notifications',
  EVENTS: 'events',
  EXAMS: 'exams',
  REVIEWS: 'reviews',
  LOYALTY: 'loyalty',
  PHOTOS: 'photos'
}

// Rangos de tiempo para analytics
export const TIME_RANGES = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
}

// Labels de los tabs
export const TAB_LABELS = {
  [ADMIN_TABS.DASHBOARD]: 'Dashboard',
  [ADMIN_TABS.COURSES]: 'Cursos',
  [ADMIN_TABS.ENROLLMENTS]: 'Inscripciones',
  [ADMIN_TABS.STUDENTS]: 'Estudiantes',
  [ADMIN_TABS.STUDENT_ENROLLMENTS]: 'Estudiantes Inscritos',
  [ADMIN_TABS.COUPONS]: 'Cupones',
  [ADMIN_TABS.AREAS]: 'Áreas',
  [ADMIN_TABS.REPORTS]: 'Reportes',
  [ADMIN_TABS.WHATSAPP]: 'WhatsApp',
  [ADMIN_TABS.NOTIFICATIONS]: 'Notificaciones',
  [ADMIN_TABS.EVENTS]: 'Eventos',
  [ADMIN_TABS.EXAMS]: 'Exámenes',
  [ADMIN_TABS.REVIEWS]: 'Reseñas',
  [ADMIN_TABS.LOYALTY]: 'Fidelización',
  [ADMIN_TABS.PHOTOS]: 'Fotos'
}

// Estilos comunes
export const ADMIN_STYLES = {
  container: 'min-h-screen bg-background text-white',
  header: 'bg-surface border-b border-gray-700 px-6 py-4',
  title: 'text-2xl font-bold text-white',
  tabsContainer: 'flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6',
  tab: 'px-4 py-2 text-sm font-medium rounded-md transition-colors',
  tabActive: 'bg-accent text-background',
  tabInactive: 'text-gray-300 hover:text-white hover:bg-gray-700',
  contentContainer: 'p-6',
  statCard: 'bg-surface rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-600 hover:border-gray-500',
  statCardHeader: 'flex items-center justify-between',
  statCardTitle: 'text-text-secondary text-sm mb-1',
  statCardValue: 'text-3xl font-bold text-white',
  statCardChange: 'text-sm mt-1 font-medium',
  statCardChangePositive: 'text-green-400',
  statCardChangeNegative: 'text-red-400',
  statCardIcon: 'p-3 rounded-full text-background',
  loadingSpinner: 'flex justify-center items-center h-64'
}

// Configuración de modal
export const MODAL_CONFIG = {
  initialState: {
    showCreateForm: false,
    editingCourse: null
  }
}

// Mensajes de logging
export const LOG_MESSAGES = {
  SAVING_COURSE: '💾 AdminDashboard: Guardando curso:',
  UPDATING_COURSE: '✏️ AdminDashboard: Actualizando curso existente',
  CREATING_COURSE: '➕ AdminDashboard: Creando nuevo curso',
  COURSE_SAVED: '✅ AdminDashboard: Curso guardado exitosamente',
  COURSE_SAVE_ERROR: '❌ AdminDashboard: Error al guardar curso:',
  COURSE_DELETED: '✅ AdminDashboard: Curso eliminado exitosamente',
  COURSE_DELETE_ERROR: '❌ AdminDashboard: Error al eliminar curso:',
  LOADING_DASHBOARD: '🔄 AdminDashboard: Cargando datos del dashboard...',
  LOADING_USERS: '📥 Cargando usuarios...',
  LOADING_COURSES: '📥 Cargando cursos...',
  LOADING_ENROLLMENTS: '📥 Cargando datos de inscripciones...',
  LOADING_AREAS: '📥 Cargando áreas...',
  LOADING_LEVELS: '📥 Cargando niveles...',
  USERS_LOADED: '✅ Usuarios cargados:',
  COURSES_LOADED: '✅ Cursos cargados:',
  ENROLLMENTS_LOADED: '✅ Datos de inscripciones cargados:',
  AREAS_LOADED: '✅ Áreas cargadas:',
  LEVELS_LOADED: '✅ Niveles cargados:',
  DASHBOARD_LOADED: '✅ Dashboard data loaded:',
  LOADING_ERROR: '❌ Error loading dashboard data:',
  ERROR_DETAILS: '📋 Error details:',
  LOADING_COMPLETED: '🏁 AdminDashboard: Carga de datos completada'
}

// Confirmación de eliminación
export const CONFIRMATION_MESSAGES = {
  DELETE_COURSE: (courseTitle) => `¿Estás seguro de que quieres eliminar el curso "${courseTitle}"?`
}

// Configuración de analytics
export const ANALYTICS_CONFIG = {
  defaultTimeRange: TIME_RANGES.WEEK,
  refreshInterval: 30000 // 30 segundos
}

// Iconos para las estadísticas
export const STAT_ICONS = {
  USERS: (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  COURSES: (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  HOURS: (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  REVENUE: (
    <svg className="w-6 h-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  )
}

// Configuración de cards de estadísticas
export const STAT_CARDS_CONFIG = [
  {
    title: 'Total Usuarios',
    key: 'totalUsers',
    change: 12,
    color: 'bg-blue-500',
    icon: STAT_ICONS.USERS
  },
  {
    title: 'Total Cursos',
    key: 'totalCourses',
    change: 8,
    color: 'bg-green-500',
    icon: STAT_ICONS.COURSES
  },
  {
    title: 'Horas Totales',
    key: 'totalHours',
    change: 15,
    color: 'bg-purple-500',
    icon: STAT_ICONS.HOURS
  },
  {
    title: 'Cantidad de inscripción',
    key: 'revenueThisMonth',
    change: 23,
    color: 'bg-accent',
    icon: STAT_ICONS.REVENUE
  }
]