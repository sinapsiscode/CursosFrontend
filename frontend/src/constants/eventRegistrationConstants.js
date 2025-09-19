export const FORM_LABELS = {
  title: 'Inscríbete Gratis',
  firstName: 'Nombres',
  lastName: 'Apellidos',
  email: 'Correo electrónico',
  phone: 'N° teléfono',
  cancel: 'Cancelar',
  submit: 'Inscribirse Gratis',
  submitting: 'Registrando...'
}

export const FORM_PLACEHOLDERS = {
  firstName: 'Ingresa tus nombres',
  lastName: 'Ingresa tus apellidos',
  email: 'tu@correo.com',
  phone: '999 999 999'
}

export const VALIDATION_RULES = {
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneRegex: /^\d{9,}$/,
  minPhoneDigits: 9
}

export const ERROR_MESSAGES = {
  firstNameRequired: 'El nombre es obligatorio',
  lastNameRequired: 'El apellido es obligatorio',
  emailRequired: 'El correo es obligatorio',
  emailInvalid: 'Ingresa un correo válido',
  phoneRequired: 'El teléfono es obligatorio',
  phoneInvalid: 'Ingresa un teléfono válido (mínimo 9 dígitos)'
}

export const SUCCESS_MESSAGES = {
  registration: '¡Te has registrado exitosamente!',
  generalError: 'Error al procesar el registro'
}

export const PRIVACY_NOTE = 'Al inscribirte, aceptas recibir notificaciones sobre este evento'

export const REGISTRATION_STYLES = {
  overlay: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4',
  modal: 'bg-surface rounded-2xl max-w-md w-full overflow-hidden',
  header: 'bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative',
  closeButton: 'absolute top-4 right-4 text-white/80 hover:text-white transition-colors',
  title: 'text-2xl font-bold text-white mb-2',
  subtitle: 'text-white/90 text-sm',
  form: 'p-6 space-y-4',
  fieldContainer: 'space-y-1',
  label: 'block text-sm font-medium text-gray-300 mb-2',
  input: 'w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent',
  inputError: 'border-red-500',
  inputNormal: 'border-gray-600',
  inputReadonly: 'opacity-75 cursor-not-allowed',
  errorText: 'text-red-400 text-sm mt-1',
  eventInfo: 'bg-gray-800/50 rounded-lg p-4 space-y-2',
  eventDetail: 'flex items-center text-sm text-gray-300',
  eventIcon: 'w-4 h-4 mr-2 text-accent',
  privacyNote: 'text-xs text-gray-400 text-center',
  buttonContainer: 'flex gap-3',
  cancelButton: 'flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors',
  submitButton: 'flex-1 px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
}

export const ICON_PATHS = {
  close: 'M6 18L18 6M6 6l12 12',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  instructor: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
}

export const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
}