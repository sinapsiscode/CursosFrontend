/**
 * ⚠️ MIGRADO A BACKEND
 * Los rangos de puntuación y configuración de negocio ahora están en:
 * - backend/db.json → system_config.exams
 * - Usar: import { getScoreRange, calculateExamDiscount } from '../utils/examUtils'
 *
 * Este archivo solo mantiene constantes de UI (estilos, mensajes)
 */

export const EXAM_CONFIG = {
  // UI/Presentación (no son configuración de negocio)
  questionSubstringLength: 60,  // Caracteres mostrados en preview de pregunta
  imageMaxHeight: '300px'       // Altura máxima de imágenes
}

export const EXAM_STYLES = {
  container: 'min-h-screen bg-background py-8',
  maxWidth: 'max-w-4xl mx-auto px-4',

  header: {
    container: 'bg-surface rounded-xl p-6 mb-6',
    title: 'text-2xl font-bold text-white mb-2',
    subtitle: 'text-gray-400',
    questionCounter: 'text-white',
    timer: 'bg-white/20 px-4 py-2 rounded-full',
    timerText: 'text-white font-mono text-lg'
  },

  content: {
    container: 'bg-surface rounded-xl p-6',
    progressBar: 'w-full bg-gray-700 rounded-full h-2',
    progressFill: 'bg-accent h-2 rounded-full transition-all duration-300'
  },

  question: {
    title: 'text-xl font-semibold text-white mb-6',
    image: 'max-w-full h-auto rounded-lg shadow-lg mx-auto',
    optionSelected: 'border-accent bg-accent/20 text-white',
    optionDefault: 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-800',
    optionContainer: 'w-full text-left p-4 rounded-lg border-2 transition-all',
    optionImage: 'ml-4 h-16 w-16 object-cover rounded'
  },

  navigation: {
    container: 'flex justify-between items-center',
    buttonDisabled: 'bg-gray-700 text-gray-500 cursor-not-allowed',
    buttonEnabled: 'bg-gray-700 text-white hover:bg-gray-600',
    questionDot: {
      answered: 'bg-accent text-background',
      current: 'bg-gray-600 text-white',
      default: 'bg-gray-700 text-gray-400'
    },
    finishButton: 'px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    nextButton: 'px-6 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90'
  },

  results: {
    container: 'py-8',
    scoreCircle: 'w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold',
    title: 'text-2xl font-bold text-white mb-2',
    discountCard: 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 mb-6',
    discountText: 'text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400',
    couponContainer: 'mt-4 p-4 bg-gray-800 rounded-lg',
    couponCode: 'flex items-center justify-between bg-gray-900 px-4 py-2 rounded border-2 border-dashed border-purple-500',
    summaryTitle: 'text-xl font-semibold text-white mb-4',
    answerItem: 'bg-gray-800/50 rounded-lg p-4 flex items-center justify-between',
    correctAnswer: 'text-green-400',
    incorrectAnswer: 'text-red-400'
  }
}

export const EXAM_MESSAGES = {
  loading: 'Cargando examen...',
  examNotAvailable: 'Examen no disponible',
  errorLoadingExam: 'Error al cargar el examen',
  errorProcessingExam: 'Error al procesar el examen',
  processing: 'Procesando...',
  finish: 'Finalizar',
  next: 'Siguiente',
  previous: 'Anterior',
  backToCourse: 'Volver al curso',
  congratsDiscount: '¡Felicidades! Has ganado un',
  discountCode: 'de descuento. Código:',
  congratsNoCode: 'de descuento',
  minScoreForDiscount: 'Necesitas al menos 11/20 para obtener un descuento',
  answersReview: 'Resumen de respuestas',
  correct: 'Correcta',
  incorrect: 'Incorrecta',
  yourDiscountCode: 'Tu código de descuento:',
  copyCode: 'Copiar',
  codeCopied: 'Código copiado al portapapeles',
  presentCodeMessage: 'Presenta este código al administrador para aplicar tu descuento',
  wonDiscount: '¡Has ganado un descuento!',
  inCourse: 'En el curso:'
}

export const EXAM_ICONS = {
  correct: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  incorrect: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

/**
 * ⚠️ MIGRADO A BACKEND
 * Las utilidades de cálculo de puntuación ahora están en:
 * - utils/examUtils.js
 *
 * Usar:
 * - formatTime(seconds) - Formatear tiempo
 * - getScoreCategory(score) - Obtener categoría desde backend
 * - calculateExamDiscount(score) - Calcular descuento desde backend
 * - getScoreRange(score) - Obtener rango completo desde backend
 */