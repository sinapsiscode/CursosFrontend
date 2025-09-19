// ==========================================
// NOTIFICATION MANAGEMENT CONSTANTS
// ==========================================

// Notification Types
export const NOTIFICATION_TYPES = {
  ENROLLMENT: 'enrollment',
  COURSE_UPDATE: 'course_update',
  ACHIEVEMENT: 'achievement',
  REMINDER: 'reminder',
  ANNOUNCEMENT: 'announcement',
  PAYMENT: 'payment',
  SYSTEM: 'system'
}

// Notification Channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  PUSH: 'push',
  IN_APP: 'in_app'
}

// Notification Status
export const NOTIFICATION_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  SENT: 'sent',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
}

// Target Audiences
export const TARGET_AUDIENCES = {
  ALL_USERS: 'all_users',
  ENROLLED_STUDENTS: 'enrolled_students',
  COURSE_SPECIFIC: 'course_specific',
  INACTIVE_USERS: 'inactive_users',
  VIP_USERS: 'vip_users',
  CUSTOM: 'custom'
}

// ==========================================
// UI CONSTANTS
// ==========================================

// Form Sections
export const FORM_SECTIONS = {
  BASIC_INFO: 'basic_info',
  CONTENT: 'content',
  TARGETING: 'targeting',
  SCHEDULING: 'scheduling',
  CHANNELS: 'channels'
}

// Panel Types
export const PANEL_TYPES = {
  FORM: 'form',
  TESTING: 'testing',
  PREVIEW: 'preview',
  HISTORY: 'history'
}

// View Modes
export const VIEW_MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view'
}

// ==========================================
// STYLES
// ==========================================

export const NOTIFICATION_STYLES = {
  // Main Container
  container: 'min-h-screen bg-gray-50 p-6',

  // Header
  header: 'mb-8',
  headerTitle: 'text-3xl font-bold text-gray-900 mb-2',
  headerSubtitle: 'text-gray-600',

  // Navigation
  nav: 'bg-white rounded-lg shadow-sm border border-gray-200 mb-6',
  navContainer: 'flex',
  navTab: 'flex-1 px-6 py-4 text-center font-medium transition-colors cursor-pointer',
  navTabActive: 'bg-blue-50 text-blue-600 border-b-2 border-blue-600',
  navTabInactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',

  // Form Container
  formContainer: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  formColumn: 'lg:col-span-2',
  previewColumn: 'lg:col-span-1',

  // Form Card
  formCard: 'bg-white rounded-lg shadow-sm border border-gray-200',
  formHeader: 'px-6 py-4 border-b border-gray-200',
  formTitle: 'text-lg font-semibold text-gray-900',
  formBody: 'p-6 space-y-6',

  // Form Sections
  section: 'space-y-4',
  sectionTitle: 'text-md font-medium text-gray-900 mb-3',

  // Form Groups
  formGroup: 'space-y-2',
  label: 'block text-sm font-medium text-gray-700',
  input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  textarea: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical',
  select: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',

  // Channel Selection
  channelGrid: 'grid grid-cols-2 gap-3',
  channelOption: 'flex items-center p-3 border rounded-lg cursor-pointer transition-colors',
  channelOptionActive: 'border-blue-500 bg-blue-50',
  channelOptionInactive: 'border-gray-300 hover:border-gray-400',
  channelIcon: 'mr-3 text-lg',
  channelLabel: 'font-medium',

  // Preview Panel
  previewCard: 'bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6',
  previewHeader: 'px-6 py-4 border-b border-gray-200',
  previewTitle: 'text-lg font-semibold text-gray-900',
  previewBody: 'p-6',

  // Preview Content
  previewNotification: 'border border-gray-200 rounded-lg p-4 mb-4',
  previewSubject: 'font-semibold text-gray-900 mb-2',
  previewMessage: 'text-gray-700 whitespace-pre-wrap',
  previewMeta: 'text-sm text-gray-500 mt-3 pt-3 border-t border-gray-200',

  // Testing Panel
  testingCard: 'bg-white rounded-lg shadow-sm border border-gray-200 mb-6',
  testingHeader: 'px-6 py-4 border-b border-gray-200',
  testingBody: 'p-6',
  testGroup: 'space-y-4',
  testButton: 'w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors',
  testResults: 'mt-4 p-4 bg-gray-50 rounded-lg',

  // Action Buttons
  buttonGroup: 'flex justify-end space-x-3 pt-6 border-t border-gray-200',
  buttonPrimary: 'bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors',
  buttonSecondary: 'bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors',
  buttonDanger: 'bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors',

  // Status Indicators
  statusBadge: 'px-2 py-1 rounded-full text-xs font-medium',
  statusDraft: 'bg-gray-100 text-gray-800',
  statusScheduled: 'bg-yellow-100 text-yellow-800',
  statusSent: 'bg-green-100 text-green-800',
  statusFailed: 'bg-red-100 text-red-800',
  statusCancelled: 'bg-gray-100 text-gray-500',

  // Priority Indicators
  priorityLow: 'text-green-600',
  priorityNormal: 'text-blue-600',
  priorityHigh: 'text-orange-600',
  priorityUrgent: 'text-red-600',

  // Loading States
  loadingCenter: 'flex justify-center items-center py-12',
  loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600',

  // Empty States
  emptyState: 'text-center py-12',
  emptyStateIcon: 'mx-auto h-12 w-12 text-gray-400 mb-4',
  emptyStateTitle: 'text-lg font-medium text-gray-900 mb-2',
  emptyStateText: 'text-gray-600'
}

// ==========================================
// LABELS & MESSAGES
// ==========================================

export const NOTIFICATION_LABELS = {
  // Headers
  pageTitle: 'Gestión de Notificaciones',
  pageSubtitle: 'Crea y administra notificaciones para estudiantes',

  // Navigation
  tabs: {
    create: 'Crear Notificación',
    testing: 'Probar Envío',
    preview: 'Vista Previa',
    history: 'Historial'
  },

  // Form Sections
  sections: {
    basicInfo: 'Información Básica',
    content: 'Contenido',
    targeting: 'Audiencia Objetivo',
    scheduling: 'Programación',
    channels: 'Canales de Envío'
  },

  // Form Fields
  fields: {
    title: 'Título de la notificación',
    type: 'Tipo de notificación',
    priority: 'Prioridad',
    subject: 'Asunto',
    message: 'Mensaje',
    targetAudience: 'Audiencia objetivo',
    courseId: 'Curso específico',
    scheduledFor: 'Programar para',
    channels: 'Canales de envío',
    testEmail: 'Email de prueba',
    testWhatsApp: 'WhatsApp de prueba'
  },

  // Placeholders
  placeholders: {
    title: 'Ej: Bienvenida al curso de React',
    subject: 'Ej: ¡Tu curso está listo!',
    message: 'Escribe tu mensaje aquí...',
    testEmail: 'tu-email@ejemplo.com',
    testWhatsApp: '+34 600 000 000'
  },

  // Type Labels
  types: {
    [NOTIFICATION_TYPES.ENROLLMENT]: 'Inscripción',
    [NOTIFICATION_TYPES.COURSE_UPDATE]: 'Actualización de Curso',
    [NOTIFICATION_TYPES.ACHIEVEMENT]: 'Logro',
    [NOTIFICATION_TYPES.REMINDER]: 'Recordatorio',
    [NOTIFICATION_TYPES.ANNOUNCEMENT]: 'Anuncio',
    [NOTIFICATION_TYPES.PAYMENT]: 'Pago',
    [NOTIFICATION_TYPES.SYSTEM]: 'Sistema'
  },

  // Channel Labels
  channels: {
    [NOTIFICATION_CHANNELS.EMAIL]: 'Email',
    [NOTIFICATION_CHANNELS.WHATSAPP]: 'WhatsApp',
    [NOTIFICATION_CHANNELS.PUSH]: 'Push',
    [NOTIFICATION_CHANNELS.IN_APP]: 'En la App'
  },

  // Status Labels
  status: {
    [NOTIFICATION_STATUS.DRAFT]: 'Borrador',
    [NOTIFICATION_STATUS.SCHEDULED]: 'Programada',
    [NOTIFICATION_STATUS.SENT]: 'Enviada',
    [NOTIFICATION_STATUS.FAILED]: 'Fallida',
    [NOTIFICATION_STATUS.CANCELLED]: 'Cancelada'
  },

  // Priority Labels
  priority: {
    [PRIORITY_LEVELS.LOW]: 'Baja',
    [PRIORITY_LEVELS.NORMAL]: 'Normal',
    [PRIORITY_LEVELS.HIGH]: 'Alta',
    [PRIORITY_LEVELS.URGENT]: 'Urgente'
  },

  // Audience Labels
  audiences: {
    [TARGET_AUDIENCES.ALL_USERS]: 'Todos los usuarios',
    [TARGET_AUDIENCES.ENROLLED_STUDENTS]: 'Estudiantes inscritos',
    [TARGET_AUDIENCES.COURSE_SPECIFIC]: 'Curso específico',
    [TARGET_AUDIENCES.INACTIVE_USERS]: 'Usuarios inactivos',
    [TARGET_AUDIENCES.VIP_USERS]: 'Usuarios VIP',
    [TARGET_AUDIENCES.CUSTOM]: 'Personalizado'
  },

  // Buttons
  buttons: {
    create: 'Crear Notificación',
    save: 'Guardar',
    send: 'Enviar Ahora',
    schedule: 'Programar',
    cancel: 'Cancelar',
    test: 'Enviar Prueba',
    preview: 'Vista Previa',
    edit: 'Editar',
    delete: 'Eliminar',
    duplicate: 'Duplicar'
  },

  // Messages
  messages: {
    creating: 'Creando notificación...',
    sending: 'Enviando notificación...',
    testSent: 'Prueba enviada correctamente',
    testFailed: 'Error al enviar prueba',
    saved: 'Notificación guardada',
    deleted: 'Notificación eliminada',
    scheduled: 'Notificación programada'
  },

  // Validation
  validation: {
    titleRequired: 'El título es obligatorio',
    subjectRequired: 'El asunto es obligatorio',
    messageRequired: 'El mensaje es obligatorio',
    audienceRequired: 'Debe seleccionar una audiencia',
    channelRequired: 'Debe seleccionar al menos un canal',
    courseRequired: 'Debe seleccionar un curso',
    emailInvalid: 'Email inválido',
    phoneInvalid: 'Número de teléfono inválido'
  },

  // Empty States
  emptyStates: {
    noNotifications: 'No hay notificaciones',
    noHistory: 'No hay historial disponible',
    createFirst: 'Crea tu primera notificación'
  }
}

// ==========================================
// ICONS
// ==========================================

export const NOTIFICATION_ICONS = {
  // Navigation
  create: '✏️',
  testing: '🧪',
  preview: '👁️',
  history: '📋',

  // Types
  [NOTIFICATION_TYPES.ENROLLMENT]: '🎓',
  [NOTIFICATION_TYPES.COURSE_UPDATE]: '📚',
  [NOTIFICATION_TYPES.ACHIEVEMENT]: '🏆',
  [NOTIFICATION_TYPES.REMINDER]: '⏰',
  [NOTIFICATION_TYPES.ANNOUNCEMENT]: '📢',
  [NOTIFICATION_TYPES.PAYMENT]: '💳',
  [NOTIFICATION_TYPES.SYSTEM]: '⚙️',

  // Channels
  [NOTIFICATION_CHANNELS.EMAIL]: '📧',
  [NOTIFICATION_CHANNELS.WHATSAPP]: '💬',
  [NOTIFICATION_CHANNELS.PUSH]: '🔔',
  [NOTIFICATION_CHANNELS.IN_APP]: '📱',

  // Status
  [NOTIFICATION_STATUS.DRAFT]: '📝',
  [NOTIFICATION_STATUS.SCHEDULED]: '⏱️',
  [NOTIFICATION_STATUS.SENT]: '✅',
  [NOTIFICATION_STATUS.FAILED]: '❌',
  [NOTIFICATION_STATUS.CANCELLED]: '🚫',

  // Priority
  [PRIORITY_LEVELS.LOW]: '🟢',
  [PRIORITY_LEVELS.NORMAL]: '🔵',
  [PRIORITY_LEVELS.HIGH]: '🟠',
  [PRIORITY_LEVELS.URGENT]: '🔴',

  // Actions
  send: '🚀',
  save: '💾',
  edit: '✏️',
  delete: '🗑️',
  duplicate: '📋',
  test: '🧪',

  // General
  notification: '🔔',
  users: '👥',
  course: '📚',
  calendar: '📅',
  settings: '⚙️',
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
}

// ==========================================
// CONFIGURATION
// ==========================================

export const NOTIFICATION_CONFIG = {
  // Limits
  maxTitleLength: 100,
  maxSubjectLength: 150,
  maxMessageLength: 1000,

  // Defaults
  defaultType: NOTIFICATION_TYPES.ANNOUNCEMENT,
  defaultPriority: PRIORITY_LEVELS.NORMAL,
  defaultChannels: [NOTIFICATION_CHANNELS.EMAIL, NOTIFICATION_CHANNELS.IN_APP],
  defaultAudience: TARGET_AUDIENCES.ALL_USERS,

  // Auto-refresh intervals (in seconds)
  refreshInterval: 30,
  historyRefreshInterval: 60,

  // Testing
  testEmailTimeout: 10000, // 10 seconds
  testWhatsAppTimeout: 15000, // 15 seconds

  // Validation patterns
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phonePattern: /^\+?[1-9]\d{1,14}$/
}

// ==========================================
// TEMPLATE VARIABLES
// ==========================================

export const TEMPLATE_VARIABLES = {
  student: {
    name: '{{student.name}}',
    email: '{{student.email}}',
    firstName: '{{student.firstName}}',
    lastName: '{{student.lastName}}'
  },
  course: {
    title: '{{course.title}}',
    instructor: '{{course.instructor}}',
    startDate: '{{course.startDate}}',
    endDate: '{{course.endDate}}',
    area: '{{course.area}}'
  },
  system: {
    siteName: '{{system.siteName}}',
    supportEmail: '{{system.supportEmail}}',
    currentDate: '{{system.currentDate}}',
    unsubscribeLink: '{{system.unsubscribeLink}}'
  }
}

// ==========================================
// DEFAULT TEMPLATES
// ==========================================

export const DEFAULT_TEMPLATES = {
  [NOTIFICATION_TYPES.ENROLLMENT]: {
    subject: '¡Bienvenido a {{course.title}}!',
    message: 'Hola {{student.firstName}},\n\n¡Te has inscrito exitosamente en el curso "{{course.title}}"!\n\nEl curso comenzará el {{course.startDate}} y será impartido por {{course.instructor}}.\n\n¡Nos vemos pronto!\n\nEquipo de {{system.siteName}}'
  },
  [NOTIFICATION_TYPES.REMINDER]: {
    subject: 'Recordatorio: {{course.title}}',
    message: 'Hola {{student.firstName}},\n\nTe recordamos que tienes pendiente el curso "{{course.title}}".\n\n¡No te olvides de continuar con tu aprendizaje!\n\nEquipo de {{system.siteName}}'
  },
  [NOTIFICATION_TYPES.ACHIEVEMENT]: {
    subject: '🏆 ¡Felicitaciones por tu logro!',
    message: 'Hola {{student.firstName}},\n\n¡Felicitaciones! Has completado exitosamente el curso "{{course.title}}".\n\n¡Sigue así con tu aprendizaje!\n\nEquipo de {{system.siteName}}'
  }
}