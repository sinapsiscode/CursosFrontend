// Tipos de exámenes disponibles
export const EXAM_TYPES = {
  INITIAL: 'initial',
  COURSE: 'course',
  CERTIFICATION: 'certification'
}

// Opciones de tipos de examen para select
export const EXAM_TYPE_OPTIONS = [
  { value: EXAM_TYPES.INITIAL, label: 'Examen Inicial' },
  { value: EXAM_TYPES.COURSE, label: 'Examen de Curso' },
  { value: EXAM_TYPES.CERTIFICATION, label: 'Certificación' }
]

// Áreas temáticas disponibles
export const EXAM_AREAS = {
  ALL: 'all',
  METALURGIA: 'metalurgia',
  MINERIA: 'mineria',
  GEOLOGIA: 'geologia'
}

// Opciones de áreas temáticas para select
export const EXAM_AREA_OPTIONS = [
  { value: EXAM_AREAS.ALL, label: 'Todas las áreas' },
  { value: EXAM_AREAS.METALURGIA, label: 'Metalurgia' },
  { value: EXAM_AREAS.MINERIA, label: 'Minería' },
  { value: EXAM_AREAS.GEOLOGIA, label: 'Geología' }
]

// Función helper para obtener el label del tipo de examen
export const getExamTypeLabel = (type) => {
  const option = EXAM_TYPE_OPTIONS.find(opt => opt.value === type)
  return option ? option.label : type
}

// Función helper para obtener el label del área
export const getExamAreaLabel = (area) => {
  const option = EXAM_AREA_OPTIONS.find(opt => opt.value === area)
  return option ? option.label : area
}
