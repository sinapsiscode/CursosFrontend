// Estilos para CourseManagement
export const COURSE_MANAGEMENT_STYLES = {
  container: 'bg-surface rounded-xl p-6',
  header: 'flex flex-col md:flex-row md:items-center justify-between mb-6',
  title: 'text-xl font-bold text-white mb-4 md:mb-0',
  createButton: 'bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors',
  loadingOverlay: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50',
  loadingModal: 'bg-surface rounded-xl p-8 text-center',
  loadingSpinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4',
  loadingTitle: 'text-white text-lg font-medium',
  loadingSubtitle: 'text-gray-400 text-sm mt-2',
  cancelButton: 'mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors',

  // Tabla
  tableContainer: 'overflow-x-auto',
  table: 'w-full',
  tableHeader: 'border-b border-gray-600',
  tableHeaderCell: 'text-left py-3 px-4 font-medium text-secondary',
  tableHeaderCellCenter: 'text-center py-3 px-4 font-medium text-secondary',
  tableRow: 'border-b border-gray-700',
  tableRowEven: 'bg-background/30',
  tableCell: 'py-3 px-4',
  tableCellCenter: 'py-3 px-4 text-center',

  // Course item
  courseItem: 'flex items-center',
  courseThumbnail: 'w-12 h-8 object-cover rounded mr-3',
  courseTitle: 'text-white font-medium text-sm',
  courseNewBadge: 'text-green-400 text-xs',
  courseFeaturedBadge: 'text-accent text-xs ml-2',
  courseInstructor: 'text-secondary text-sm',
  courseDuration: 'text-secondary text-sm',
  coursePrice: 'text-white text-sm font-medium',

  // Tags/Badges
  areaTag: 'inline-block px-2 py-1 rounded-full text-xs font-medium',
  levelTag: 'inline-block px-2 py-1 rounded-full text-xs font-medium',

  // Actions
  actionButtons: 'flex justify-center space-x-2',
  actionButton: 'px-2 py-1 rounded text-xs font-medium transition-colors group relative',
  previewButton: 'bg-green-500 hover:bg-green-600 text-white',
  openButton: 'bg-purple-500 hover:bg-purple-600 text-white',
  editButton: 'bg-blue-500 hover:bg-blue-600 text-white',
  deleteButton: 'bg-red-500 hover:bg-red-600 text-white',

  // Tooltip
  tooltip: 'absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap',

  // Empty state
  emptyState: 'text-center py-8 text-secondary'
}

// Labels y textos
export const COURSE_MANAGEMENT_LABELS = {
  title: 'Gestión de Cursos',
  createButton: 'Crear Curso',
  cancelButton: 'Cancelar',
  loadingTitle: 'Cargando formulario...',
  loadingSubtitle: 'Preparando áreas y niveles disponibles',
  emptyState: 'No hay cursos registrados. Crea el primer curso usando el botón "Crear Curso".',

  // Tabla headers
  headers: {
    course: 'Curso',
    instructor: 'Instructor',
    area: 'Área',
    level: 'Nivel',
    duration: 'Duración',
    price: 'Gratis',
    actions: 'Acciones'
  },

  // Acciones
  actions: {
    preview: 'Ver detalles',
    open: 'Nueva pestaña',
    edit: 'Editar curso',
    delete: 'Eliminar curso'
  },

  // Badges
  badges: {
    new: 'NUEVO',
    featured: 'DESTACADO',
    free: 'Gratis'
  }
}

// Iconos SVG
export const COURSE_MANAGEMENT_ICONS = {
  preview: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  open: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  delete: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

// Mensajes de confirmación
export const COURSE_MANAGEMENT_CONFIRMATIONS = {
  delete: (courseTitle) => `¿Estás seguro de que quieres eliminar el curso "${courseTitle}"?`
}

// Mensajes de logging
export const COURSE_MANAGEMENT_LOG_MESSAGES = {
  SAVING_COURSE: '💾 CourseManagement: Guardando curso:',
  UPDATING_COURSE: '✏️ CourseManagement: Actualizando curso existente',
  CREATING_COURSE: '➕ CourseManagement: Creando nuevo curso',
  COURSE_SAVED: '✅ CourseManagement: Curso guardado exitosamente',
  COURSE_SAVE_ERROR: '❌ CourseManagement: Error al guardar curso:',
  COURSE_DELETED: '✅ CourseManagement: Curso eliminado exitosamente',
  COURSE_DELETE_ERROR: '❌ CourseManagement: Error al eliminar curso:'
}

// Configuración de colores por defecto
export const DEFAULT_COLORS = {
  area: 'text-white bg-gray-500 bg-opacity-20',
  level: 'text-white bg-gray-500 bg-opacity-20'
}