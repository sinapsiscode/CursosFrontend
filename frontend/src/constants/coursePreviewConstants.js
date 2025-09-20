export const COURSE_PREVIEW_MODAL = {
  INITIAL_STATE: {
    isOpen: false,
    course: null
  },

  ACTIONS: {
    OPEN: 'OPEN_PREVIEW',
    CLOSE: 'CLOSE_PREVIEW',
    SET_COURSE: 'SET_PREVIEW_COURSE'
  },

  MODAL_CONFIG: {
    closeOnEscape: true,
    closeOnOverlayClick: true,
    showCloseButton: true
  },

  ANIMATION: {
    duration: 300,
    easing: 'ease-in-out'
  },

  ACCESSIBILITY: {
    ariaLabel: 'Vista previa del curso',
    role: 'dialog',
    focusTrap: true
  }
}

export const COURSE_PREVIEW_STYLES = {
  overlay: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4',
  modal: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden',
  header: 'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700',
  content: 'p-6 overflow-y-auto max-h-[70vh]',
  footer: 'flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700',
  closeButton: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
}

export const COURSE_PREVIEW_MESSAGES = {
  loading: 'Cargando vista previa...',
  error: 'Error al cargar la vista previa del curso',
  noData: 'No hay datos disponibles para mostrar',
  closeConfirm: '¿Estás seguro de que quieres cerrar la vista previa?'
}