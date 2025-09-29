import * as XLSX from 'xlsx'
import { EVENT_TYPES, EVENT_AREAS } from '../constants/eventManagementConstants'

export const getEventStats = (events, registrations) => {
  const total = events.length
  const published = events.filter(e => e.status === 'published').length
  const drafts = events.filter(e => e.status === 'draft').length
  const totalRegistrations = Object.values(registrations).reduce((acc, curr) => acc + curr.length, 0)

  const byType = EVENT_TYPES.map(type => ({
    ...type,
    count: events.filter(e => e.type === type.value).length
  }))

  const byArea = EVENT_AREAS.map(area => ({
    ...area,
    count: events.filter(e => e.area === area.value).length
  }))

  return {
    total,
    published,
    drafts,
    totalRegistrations,
    byType,
    byArea
  }
}

export const filterEvents = (events, searchTerm, filters = {}) => {
  let filtered = events

  // Filtro por término de búsqueda
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(term) ||
      event.description.toLowerCase().includes(term) ||
      event.area.toLowerCase().includes(term) ||
      event.type.toLowerCase().includes(term)
    )
  }

  // Filtros adicionales
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(event => event.type === filters.type)
  }

  if (filters.area && filters.area !== 'all') {
    filtered = filtered.filter(event => event.area === filters.area)
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(event => event.status === filters.status)
  }

  return filtered
}

export const formatEventDate = (date, time) => {
  if (!date) return 'Sin fecha'

  try {
    const eventDate = new Date(`${date}T${time || '00:00'}`)
    return eventDate.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: time ? '2-digit' : undefined,
      minute: time ? '2-digit' : undefined
    })
  } catch (error) {
    return 'Fecha inválida'
  }
}

export const calculateEventStatus = (event) => {
  if (!event.date) return 'draft'

  const eventDate = new Date(`${event.date}T${event.time || '00:00'}`)
  const now = new Date()

  if (eventDate < now) {
    return 'completed'
  } else if (event.status === 'published') {
    return 'published'
  } else {
    return 'draft'
  }
}

export const exportEventsToExcel = (events, registrations) => {
  const data = events.map(event => ({
    'ID': event.id,
    'Título': event.title,
    'Tipo': EVENT_TYPES.find(t => t.value === event.type)?.label || event.type,
    'Área': EVENT_AREAS.find(a => a.value === event.area)?.label || event.area,
    'Fecha': formatEventDate(event.date, event.time),
    'Capacidad': event.capacity,
    'Inscritos': registrations[event.id]?.length || 0,
    'Gratis': 'Gratis',
    'Estado': event.status
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Eventos")

  // Ajustar ancho de columnas
  const colWidths = [
    {wch: 10}, // ID
    {wch: 30}, // Título
    {wch: 15}, // Tipo
    {wch: 15}, // Área
    {wch: 20}, // Fecha
    {wch: 10}, // Capacidad
    {wch: 10}, // Inscritos
    {wch: 15}, // Precio
    {wch: 15}  // Estado
  ]
  ws['!cols'] = colWidths

  const fileName = `eventos_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}

export const exportRegistrationsToExcel = (eventId, registrations, eventTitle) => {
  const eventRegistrations = registrations[eventId] || []

  const data = eventRegistrations.map((reg, index) => ({
    'Nº': index + 1,
    'Nombre': reg.name,
    'Email': reg.email,
    'Teléfono': reg.phone || 'No registrado',
    'Área de Interés': reg.area || 'No especificada',
    'Fecha de Inscripción': new Date(reg.registeredAt).toLocaleDateString('es-PE'),
    'Estado': reg.status || 'Confirmado'
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Inscripciones")

  const colWidths = [
    {wch: 5},  // Nº
    {wch: 25}, // Nombre
    {wch: 30}, // Email
    {wch: 15}, // Teléfono
    {wch: 20}, // Área
    {wch: 15}, // Fecha
    {wch: 15}  // Estado
  ]
  ws['!cols'] = colWidths

  const fileName = `inscripciones_${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}

export const validateEventForm = (formData) => {
  const errors = {}

  if (!formData.title.trim()) {
    errors.title = 'El título es obligatorio'
  }

  if (!formData.description.trim()) {
    errors.description = 'La descripción es obligatoria'
  }

  if (!formData.date) {
    errors.date = 'La fecha es obligatoria'
  }

  if (!formData.time) {
    errors.time = 'La hora es obligatoria'
  }

  if (formData.capacity < 1) {
    errors.capacity = 'La capacidad debe ser mayor a 0'
  }

  if (formData.price < 0) {
    errors.price = 'El precio siempre es gratis'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const generateEventSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
}