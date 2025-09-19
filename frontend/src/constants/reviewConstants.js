export const RATING_LABELS = {
  1: '😞 Muy malo',
  2: '😕 Malo',
  3: '😐 Regular',
  4: '😊 Bueno',
  5: '😍 Excelente',
  default: 'Selecciona una calificación'
}

export const VALIDATION_RULES = {
  minCommentLength: 10,
  maxCommentLength: 500
}

export const ERROR_MESSAGES = {
  rating: 'Por favor selecciona una calificación',
  commentRequired: 'Por favor escribe un comentario',
  commentTooShort: 'El comentario debe tener al menos 10 caracteres'
}

export const FORM_LABELS = {
  title: 'Reseña del Curso',
  rating: 'Calificación *',
  comment: 'Tu opinión *',
  commentPlaceholder: 'Comparte tu experiencia con este curso...',
  characterCount: 'caracteres (mínimo 10)',
  cancel: 'Cancelar',
  submit: 'Enviar Reseña',
  submitting: 'Enviando...',
  infoTitle: '¡Tu opinión es importante!',
  infoDescription: 'Compartir tu experiencia ayuda a otros estudiantes a elegir los mejores cursos. Tu reseña aparecerá pronto en la página del curso.'
}

export const FORM_STYLES = {
  container: 'max-w-md mx-auto bg-surface rounded-xl p-6',
  header: 'text-center mb-6',
  title: 'text-2xl font-bold text-white mb-2',
  subtitle: 'text-text-secondary text-sm',
  form: 'space-y-6',
  label: 'block text-white font-medium',
  starContainer: 'flex items-center justify-center space-x-2',
  starButton: 'transition-transform hover:scale-110 focus:outline-none',
  starActive: 'text-yellow-400',
  starInactive: 'text-gray-600',
  ratingText: 'text-center text-sm text-accent font-medium',
  textarea: 'w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-accent focus:outline-none resize-none',
  characterCount: 'flex justify-between items-center text-xs',
  characterCountValid: 'text-green-400',
  characterCountInvalid: 'text-red-400',
  error: 'text-red-400 text-sm',
  errorCenter: 'text-red-400 text-sm text-center',
  buttonContainer: 'flex space-x-3 pt-4',
  cancelButton: 'flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors',
  submitButton: 'flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2',
  infoFooter: 'mt-6 p-4 bg-gray-800 rounded-lg',
  infoContent: 'flex items-start space-x-3',
  infoIcon: 'w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0',
  infoText: 'text-sm text-gray-300',
  infoTitle: 'font-medium text-white mb-1'
}

export const RATING_RANGE = [1, 2, 3, 4, 5]