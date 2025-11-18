import { EXAM_TYPES, EXAM_AREAS } from './examTypes'

// Valores por defecto para formulario de examen
export const DEFAULT_EXAM_FORM = {
  id: null,
  title: '',
  description: '',
  type: EXAM_TYPES.COURSE,
  courseId: '',
  area: EXAM_AREAS.ALL,
  duration: 30, // minutos
  passingScore: 70, // porcentaje
  attempts: 3, // intentos permitidos
  isActive: true,
  questions: []
}

// Valores por defecto para formulario de pregunta
export const DEFAULT_QUESTION_FORM = {
  id: null,
  question: '',
  questionImage: '',
  youtubeUrl: '',
  options: ['', '', '', ''],
  optionImages: ['', '', '', ''],
  correct: 0,
  points: 10
}

// Configuración de validación para exámenes
export const EXAM_VALIDATION = {
  minDuration: 5,
  maxDuration: 180,
  minPassingScore: 0,
  maxPassingScore: 100,
  minAttempts: 1,
  maxAttempts: 10,
  minPoints: 1,
  maxPoints: 100
}

// Configuración de límites
export const EXAM_LIMITS = {
  MAX_QUESTIONS: 100,
  MAX_OPTIONS_PER_QUESTION: 4,
  MIN_OPTIONS_PER_QUESTION: 2
}

// Tipos de vista
export const VIEW_TYPES = {
  LIST: 'list',
  CREATE: 'create',
  EDIT: 'edit'
}

// Filtros por defecto
export const DEFAULT_FILTERS = {
  type: 'all',
  course: 'all',
  area: 'all'
}
