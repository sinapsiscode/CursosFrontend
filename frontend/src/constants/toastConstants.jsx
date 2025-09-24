export const TOAST_TYPES = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info'
}

export const TOAST_STYLES = {
  container: 'fixed top-4 right-4 z-50 animate-slide-in-right',
  toast: 'border rounded-lg shadow-lg p-4 text-white max-w-sm',
  content: 'flex items-center',
  iconContainer: 'flex-shrink-0 mr-3',
  messageContainer: 'flex-1',
  message: 'text-sm font-medium',
  closeButton: 'flex-shrink-0 ml-3 text-white hover:text-gray-200 transition-colors'
}

export const TOAST_TYPE_STYLES = {
  [TOAST_TYPES.success]: 'bg-green-600 border-green-500',
  [TOAST_TYPES.error]: 'bg-red-600 border-red-500',
  [TOAST_TYPES.warning]: 'bg-yellow-600 border-yellow-500',
  [TOAST_TYPES.info]: 'bg-blue-600 border-blue-500'
}

export const TOAST_ICONS = {
  [TOAST_TYPES.success]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  [TOAST_TYPES.error]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  [TOAST_TYPES.warning]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  [TOAST_TYPES.info]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export const CLOSE_ICON = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)