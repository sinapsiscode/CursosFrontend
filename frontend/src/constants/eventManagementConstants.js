export const EVENT_TYPES = [
  { value: 'webinar', label: 'Webinar', color: 'blue' },
  { value: 'masterclass', label: 'Masterclass', color: 'purple' },
  { value: 'promotion', label: 'Promoción', color: 'green' },
  { value: 'bundle', label: 'Bundle de Cursos', color: 'orange' }
]

export const EVENT_AREAS = [
  { value: 'metalurgia', label: 'Metalurgia', color: 'bg-blue-500' },
  { value: 'mineria', label: 'Minería', color: 'bg-green-500' },
  { value: 'geologia', label: 'Geología', color: 'bg-orange-500' }
]

export const EVENT_DURATIONS = [
  '1 hora',
  '1.5 horas',
  '2 horas',
  '3 horas',
  '4 horas',
  'Medio día',
  'Día completo'
]

export const DEFAULT_FORM_DATA = {
  type: 'webinar',
  title: '',
  description: '',
  date: '',
  time: '',
  duration: '2 horas',
  organizers: [],
  area: 'metalurgia',
  relatedCourses: [],
  tags: [],
  capacity: 100,
  price: 0,
  imageUrl: '',
  registrationUrl: '',
  pdfUrl: '',
  youtubeUrl: '',
  redirectUrl: '',
  benefits: []
}

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
}

export const getEventTypeColor = (type) => {
  const eventType = EVENT_TYPES.find(t => t.value === type)
  return eventType ? eventType.color : 'gray'
}

export const getEventAreaColor = (area) => {
  const eventArea = EVENT_AREAS.find(a => a.value === area)
  return eventArea ? eventArea.color : 'bg-gray-500'
}