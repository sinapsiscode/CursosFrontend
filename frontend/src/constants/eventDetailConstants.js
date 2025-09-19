export const EVENT_LABELS = {
  freeLabel: 'GRATIS',
  registering: 'Inscribiendo...',
  loginRequired: 'Inicia sesión para inscribirte',
  registerFree: '🎟️ Inscribirme GRATIS',
  loginMessage: 'Necesitas iniciar sesión para inscribirte en eventos',
  resources: '📁 Recursos',
  benefits: '🎁 Beneficios',
  downloadPdf: '📄 Descargar Material PDF',
  watchVideo: '🎥 Ver Video en YouTube'
}

export const EVENT_MESSAGES = {
  loginRequired: 'Debes iniciar sesión para inscribirte',
  successRegistration: '¡Te has inscrito exitosamente al evento!',
  errorRegistration: 'Error al inscribirse al evento',
  redirecting: '🔄 Redirigiendo a:',
  registrationStart: '🎟️ Iniciando inscripción gratuita al evento:',
  registrationSaved: '✅ Inscripción guardada exitosamente',
  registrationError: '❌ Error en inscripción al evento:'
}

export const EVENT_STYLES = {
  overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
  modal: 'bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto',
  header: 'relative',
  image: 'w-full h-64 object-cover rounded-t-xl',
  closeButton: 'absolute top-4 right-4',
  closeButtonStyle: 'bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors',
  priceBadge: 'absolute bottom-4 left-4',
  freeBadgeStyle: 'bg-green-600 text-white px-4 py-2 rounded-full font-bold text-lg',
  content: 'p-6',
  titleSection: 'mb-6',
  badgeContainer: 'flex items-center gap-2 mb-2',
  typeBadge: 'bg-accent text-background px-3 py-1 rounded-full text-sm font-medium capitalize',
  areaBadge: 'bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm capitalize',
  title: 'text-3xl font-bold text-white mb-4',
  description: 'text-gray-300 text-lg leading-relaxed',
  detailsGrid: 'grid md:grid-cols-2 gap-6 mb-6',
  detailsLeft: 'space-y-4',
  detailsRight: 'space-y-4',
  detailItem: 'flex items-center text-gray-300',
  detailIcon: 'w-5 h-5 mr-3 text-accent',
  resourcesTitle: 'text-lg font-semibold text-white mb-3',
  resourceLink: 'flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors',
  benefitsSection: 'mb-6',
  benefitsTitle: 'text-lg font-semibold text-white mb-3',
  benefitsList: 'space-y-2',
  benefitItem: 'flex items-center text-gray-300',
  benefitIcon: 'w-4 h-4 mr-3 text-green-400',
  registrationSection: 'flex justify-center pt-6 border-t border-gray-700',
  registerButton: 'bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center space-x-3',
  loginPrompt: 'text-center text-gray-400 mt-3 text-sm'
}

export const ICON_PATHS = {
  close: 'M6 18L18 6M6 6l12 12',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  duration: 'M13 10V3L4 14h7v7l9-11h-7z',
  instructor: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  capacity: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  pdf: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  video: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  check: 'M5 13l4 4L19 7',
  register: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
}

export const REGISTRATION_DELAY = 1000 // Delay de simulación en ms

export const FIELD_LABELS = {
  date: 'Fecha:',
  time: 'Hora:',
  duration: 'Duración:',
  instructor: 'Instructor:',
  capacity: 'Cupos:'
}