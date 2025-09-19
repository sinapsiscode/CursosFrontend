export const DEFAULT_VALUES = {
  AREA: 'metalurgia',
  LEVEL: 'basico',
  DURATION: 180,
  PRICE: 0,
  POINTS: 100,
  MAX_PARTICIPANTS: 50,
  STATUS: 'draft'
}

export const LESSON_DEFAULTS = {
  DURATION: 15,
  VIDEO_URL: '',
  VIDEO_FILE_ID: '',
  IS_FREE: false,
  DESCRIPTION: '',
  MATERIALS: []
}

export const MATERIAL_DEFAULTS = {
  NAME: '',
  TYPE: 'pdf',
  URL: '',
  FILE_ID: '',
  DESCRIPTION: ''
}

export const FILE_UPLOAD = {
  MAX_SIZE: {
    VIDEO: 500 * 1024 * 1024, // 500MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    IMAGE: 10 * 1024 * 1024 // 10MB
  },
  ALLOWED_TYPES: {
    image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
    pdf: ['application/pdf'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  STORAGE_BASE_URL: 'https://storage.metsel.edu.co'
}

export const FORM_TABS = [
  { id: 'basic', label: 'Información Básica', icon: '📝' },
  { id: 'content', label: 'Contenido y Lecciones', icon: '📚' },
  { id: 'materials', label: 'Materiales', icon: '📄' },
  { id: 'settings', label: 'Configuración', icon: '⚙️' }
]

export const COURSE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  MAINTENANCE: 'maintenance'
}

export const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF' },
  { value: 'document', label: 'Documento' },
  { value: 'excel', label: 'Excel' },
  { value: 'presentation', label: 'Presentación' },
  { value: 'image', label: 'Imagen' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'other', label: 'Otro' }
]

export const PREVIEW_TABS = [
  { id: 'general', label: 'Información General', icon: '📋' },
  { id: 'lessons', label: 'Lecciones', icon: '🎥' },
  { id: 'materials', label: 'Materiales', icon: '📄' },
  { id: 'stats', label: 'Estadísticas', icon: '📊' }
]

export const MATERIAL_COLORS = {
  pdf: 'bg-red-500',
  document: 'bg-blue-500',
  excel: 'bg-green-500',
  presentation: 'bg-orange-500',
  video: 'bg-purple-500',
  default: 'bg-gray-500'
}