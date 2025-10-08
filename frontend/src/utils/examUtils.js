import systemConfigService from '../services/systemConfigService'

/**
 * Utilidades para exámenes
 * Wrapper que carga configuración desde backend
 */

let cachedExamConfig = null

/**
 * Obtener configuración de exámenes desde backend
 */
export async function getExamConfig() {
  if (!cachedExamConfig) {
    cachedExamConfig = await systemConfigService.getExamConfig()
  }
  return cachedExamConfig
}

/**
 * Calcular descuento según calificación
 */
export async function calculateExamDiscount(score) {
  const config = await getExamConfig()

  for (const range of config.ranges) {
    if (score >= range.min && score <= range.max) {
      return range.discount
    }
  }

  return 0
}

/**
 * Obtener rango de calificación
 */
export async function getScoreRange(score) {
  const config = await getExamConfig()

  for (const range of config.ranges) {
    if (score >= range.min && score <= range.max) {
      return range
    }
  }

  // Fallback
  return config.ranges[config.ranges.length - 1]
}

/**
 * Obtener categoría de puntuación (key del rango)
 */
export async function getScoreCategory(score) {
  const range = await getScoreRange(score)
  return range.key
}

/**
 * Obtener todos los rangos como objeto (para compatibilidad)
 */
export async function getExamRanges() {
  const config = await getExamConfig()

  const rangesObject = {}
  config.ranges.forEach(range => {
    rangesObject[range.key] = range
  })

  return rangesObject
}

/**
 * Verificar si una calificación es aprobatoria
 */
export async function isPassingScore(score) {
  const config = await getExamConfig()
  return score >= config.passingScore
}

/**
 * Obtener puntuación máxima
 */
export async function getMaxScore() {
  const config = await getExamConfig()
  return config.maxScore || 20
}

/**
 * Obtener puntuación mínima para aprobar
 */
export async function getPassingScore() {
  const config = await getExamConfig()
  return config.passingScore || 11
}

/**
 * Formatear tiempo (segundos a mm:ss)
 * Esta es una función de utilidad pura, no necesita backend
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Invalidar cache (útil cuando la config cambia)
 */
export function invalidateExamConfigCache() {
  cachedExamConfig = null
}

// Fallback constants (por si falla el backend)
export const EXAM_CONSTANTS_FALLBACK = {
  maxScore: 20,
  passingScore: 11,
  ranges: {
    excellent: { key: 'excellent', min: 18, max: 20, discount: 20, color: 'green', message: '¡Excelente!' },
    good: { key: 'good', min: 15, max: 17, discount: 15, color: 'green', message: '¡Muy bien!' },
    average: { key: 'average', min: 11, max: 14, discount: 10, color: 'yellow', message: '¡Bien hecho!' },
    below: { key: 'below', min: 0, max: 10, discount: 0, color: 'red', message: 'Sigue aprendiendo' }
  }
}
