// Secciones disponibles en WhatsApp Management
export const WHATSAPP_SECTIONS = {
  BASIC: 'basic',
  TEMPLATES: 'templates',
  GROUPS: 'groups',
  TRIGGERS: 'triggers',
  STATS: 'stats'
}

// Labels para las secciones
export const WHATSAPP_SECTION_LABELS = {
  [WHATSAPP_SECTIONS.BASIC]: 'Configuración',
  [WHATSAPP_SECTIONS.TEMPLATES]: 'Plantillas',
  [WHATSAPP_SECTIONS.GROUPS]: 'Grupos',
  [WHATSAPP_SECTIONS.TRIGGERS]: 'Triggers',
  [WHATSAPP_SECTIONS.STATS]: 'Estadísticas'
}

// Estilos para WhatsApp Management
export const WHATSAPP_STYLES = {
  container: 'space-y-6',
  header: 'flex justify-between items-center',
  sectionTabs: 'flex space-x-2',
  sectionTab: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
  sectionTabActive: 'bg-accent text-background',
  sectionTabInactive: 'bg-surface text-white hover:bg-gray-700',

  // Botones de acciones
  actionButtons: 'flex space-x-2',
  editButton: 'px-4 py-2 bg-accent text-background rounded-lg hover:bg-opacity-90 transition-colors',
  cancelButton: 'px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors',
  saveButton: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors',

  // Test result
  testResult: 'p-4 rounded-lg',
  testResultSuccess: 'bg-green-500/20 text-green-400',
  testResultError: 'bg-red-500/20 text-red-400',

  // Cards y contenedores
  card: 'bg-surface rounded-xl p-6',
  cardWithSpacing: 'bg-surface rounded-xl p-6 space-y-6',
  controlGrid: 'grid md:grid-cols-2 gap-6',

  // Control switches
  switchContainer: 'flex items-center justify-between mb-4',
  switchInfo: 'flex items-center space-x-3',
  switchIcon: 'w-10 h-10 rounded-full flex items-center justify-center',
  switchButton: 'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
  switchButtonDisabled: 'opacity-50',
  switchToggle: 'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',

  // Stats
  statCard: 'space-y-3 text-sm',
  statItem: 'flex justify-between',
  statLabel: 'text-gray-400',
  statValue: 'text-white',
  statValueActive: 'font-medium text-green-400',
  statValueInactive: 'font-medium text-red-400',

  // Forms
  formGrid: 'grid md:grid-cols-2 gap-6',
  formField: 'block text-text-secondary text-sm font-medium mb-2',
  input: 'w-full bg-background border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50',
  textarea: 'w-full bg-background border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50',
  checkbox: 'w-4 h-4 text-accent bg-surface border-gray-600 rounded focus:ring-accent focus:ring-2 disabled:opacity-50',
  numberInput: 'w-20 bg-background border border-gray-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50',

  // Action buttons
  testButton: 'w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50',
  testButtonSmall: 'mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors',
  resetButton: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors',

  // Trigger configuration
  triggerItem: 'flex items-center justify-between p-4 bg-background rounded-lg',
  triggerLabel: 'flex items-center space-x-2',
  triggerTitle: 'text-white font-medium',
  triggerSubtitle: 'text-xs text-text-secondary mt-1 ml-6',

  // Statistics grid
  statsGrid: 'grid md:grid-cols-2 lg:grid-cols-4 gap-4',
  statGridCard: 'border rounded-lg p-4',
  statGridLabel: 'text-sm font-medium',
  statGridValue: 'text-2xl font-bold'
}

// Labels y textos
export const WHATSAPP_LABELS = {
  title: 'WhatsApp Management',
  edit: 'Editar',
  cancel: 'Cancelar',
  save: 'Guardar',

  // Secciones principales
  whatsappAutoTitle: 'WhatsApp Automático',
  whatsappAutoSubtitle: 'Sistema de lead generation',
  notificationsTitle: 'Notificaciones',
  notificationsSubtitle: 'Sistema global de notificaciones',

  // Estados
  active: 'Activo',
  inactive: 'Inactivo',

  // Estadísticas básicas
  messagesSent: 'Mensajes enviados:',
  phoneNumber: 'Número:',
  centerActive: 'Centro activo:',
  yes: 'Sí',

  // Botones de prueba
  testMessage: 'Probar Mensaje',
  testNotification: 'Probar Notificación',
  sending: 'Enviando...',

  // Configuración detallada
  detailedConfig: 'Configuración Detallada',
  phoneNumberLabel: 'Número de WhatsApp',
  phoneNumberPlaceholder: '+57 300 123 4567',
  autoSendEnabled: 'Envío automático habilitado',
  welcomeMessageLabel: 'Mensaje de Bienvenida',
  testWelcome: 'Probar Bienvenida',

  // Templates
  templatesTitle: 'Plantillas de Mensajes',
  templateLabels: {
    courseInterest: 'Interés en Cursos',
    webinarInvite: 'Invitación Webinar',
    newCourses: 'Cursos Nuevos',
    groupInvite: 'Invitación Grupo'
  },
  testTemplate: 'Probar',

  // Grupos
  groupsTitle: 'Enlaces de Grupos de WhatsApp',
  groupLabel: 'Grupo',
  groupPlaceholder: 'https://chat.whatsapp.com/...',

  // Triggers
  triggersTitle: 'Configuración de Triggers',
  triggerLabels: {
    courseSearch: 'Búsqueda de Cursos',
    courseView: 'Vista de Curso',
    userRegistration: 'Registro de Usuario',
    formSubmission: 'Envío de Formularios'
  },
  delay: 'Delay:',
  delayUnit: 'ms',

  // Estadísticas
  statisticsTitle: 'Estadísticas de WhatsApp',
  statsLabels: {
    totalSent: 'Mensajes Totales',
    courseSearchTriggers: 'Búsquedas',
    courseViewTriggers: 'Vistas de Curso',
    registrationTriggers: 'Registros'
  },
  resetStats: 'Resetear Estadísticas'
}

// Iconos y emojis
export const WHATSAPP_ICONS = {
  whatsapp: '📱',
  notifications: '🔔',
  test: '🧪'
}

// Colores para switches y estados
export const WHATSAPP_COLORS = {
  whatsapp: {
    icon: 'bg-green-600',
    switchActive: 'bg-green-600',
    switchInactive: 'bg-gray-600',
    statusActive: 'text-green-400',
    statusInactive: 'text-red-400'
  },
  notifications: {
    icon: 'bg-blue-600',
    switchActive: 'bg-blue-600',
    switchInactive: 'bg-gray-600',
    statusActive: 'text-blue-400',
    statusInactive: 'text-red-400'
  }
}

// Configuración de estadísticas
export const WHATSAPP_STATS_CONFIG = [
  {
    key: 'totalSent',
    label: 'Mensajes Totales',
    gradient: 'bg-gradient-to-br from-green-500/10 to-green-600/10',
    border: 'border-green-500/20',
    textColor: 'text-green-400'
  },
  {
    key: 'courseSearchTriggers',
    label: 'Búsquedas',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-blue-600/10',
    border: 'border-blue-500/20',
    textColor: 'text-blue-400'
  },
  {
    key: 'courseViewTriggers',
    label: 'Vistas de Curso',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-purple-600/10',
    border: 'border-purple-500/20',
    textColor: 'text-purple-400'
  },
  {
    key: 'registrationTriggers',
    label: 'Registros',
    gradient: 'bg-gradient-to-br from-accent/10 to-accent/20',
    border: 'border-accent/20',
    textColor: 'text-accent'
  }
]

// Configuración por defecto para formularios
export const WHATSAPP_FORM_CONFIG = {
  phoneNumber: {
    type: 'tel',
    placeholder: '+57 300 123 4567'
  },
  welcomeMessage: {
    type: 'textarea',
    rows: 3
  },
  templateMessage: {
    type: 'textarea',
    rows: 3
  },
  groupLink: {
    type: 'url',
    placeholder: 'https://chat.whatsapp.com/...'
  },
  triggerDelay: {
    type: 'number',
    min: 1000,
    max: 30000,
    step: 500
  }
}

// Mensajes de toast y notificaciones
export const WHATSAPP_MESSAGES = {
  configUpdated: 'Configuración de WhatsApp actualizada',
  configUpdateError: 'Error al actualizar configuración',
  notificationsEnabled: 'Notificaciones activadas globalmente',
  notificationsDisabled: 'Notificaciones desactivadas globalmente',
  notificationsUpdateError: 'Error al actualizar notificaciones',
  testNotificationCreated: 'Notificación de prueba creada',
  testMessageError: 'Error al enviar mensaje de prueba'
}

// Configuración de prueba de notificación
export const WHATSAPP_TEST_NOTIFICATION = {
  type: 'info',
  title: 'Prueba de Notificación',
  message: 'Esta es una notificación de prueba desde el admin',
  icon: '🧪'
}