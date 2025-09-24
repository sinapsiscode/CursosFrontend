export const MODAL_SIZES = {
  small: 'max-w-md',
  medium: 'max-w-lg',
  large: 'max-w-2xl',
  xlarge: 'max-w-4xl',
  full: 'max-w-full mx-4'
}

export const MODAL_STYLES = {
  overlay: 'fixed inset-0 z-50 overflow-y-auto',
  backdrop: 'fixed inset-0 bg-black bg-opacity-75 transition-opacity',
  container: 'flex min-h-screen items-center justify-center p-4',
  modal: 'relative w-full bg-surface rounded-xl shadow-2xl border border-gray-600 animate-slide-up',
  header: 'flex items-center justify-between p-6 border-b border-gray-600',
  title: 'text-xl font-bold text-white',
  closeButton: 'p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors',
  content: 'p-6',
  contentWithoutHeader: 'p-6'
}

export const CONFIRM_MODAL_VARIANTS = {
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  primary: 'bg-accent hover:bg-accent-dark focus:ring-accent'
}

export const CONFIRM_MODAL_STYLES = {
  container: 'space-y-4',
  message: 'text-text-secondary',
  buttonContainer: 'flex space-x-3 justify-end',
  cancelButton: 'px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors',
  confirmButton: 'px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface'
}

export const CONFIRM_MODAL_DEFAULTS = {
  title: '¿Estás seguro?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  confirmVariant: 'danger'
}

export const MODAL_KEYS = {
  escape: 'Escape'
}

export const MODAL_ICONS = {
  close: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  )
}