import { useState, useEffect } from 'react'
import { eventService } from '../services/eventService'
import { notificationService } from '../services/notificationService'
import { useUIStore } from '../store'
import { DEFAULT_FORM_DATA, EVENT_TYPES } from '../constants/eventManagementConstants'
import { validateEventForm, generateEventSlug } from '../utils/eventManagementUtils'

export const useEventManagement = () => {
  const { showToast } = useUIStore()

  // Estados principales
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [eventRegistrations, setEventRegistrations] = useState({})

  // Estados de UI
  const [isCreating, setIsCreating] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    area: 'all',
    status: 'all'
  })

  // Estados del formulario
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [validationErrors, setValidationErrors] = useState({})
  const [eventTypes, setEventTypes] = useState(EVENT_TYPES)
  const [newEventType, setNewEventType] = useState({ value: '', label: '', color: 'blue' })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        loadEvents(),
        loadStats(),
        loadEventRegistrations()
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadEvents = async () => {
    try {
      const allEvents = await eventService.getAllActiveEvents()
      setEvents(allEvents)
      return allEvents
    } catch (error) {
      console.error('Error loading events:', error)
      showToast('Error al cargar eventos', 'error')
      return []
    }
  }

  const loadStats = async () => {
    try {
      const eventStats = await eventService.getEventStats()
      setStats(eventStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadEventRegistrations = () => {
    try {
      let registrations = JSON.parse(localStorage.getItem('event_registrations') || '{}')

      // Si no hay datos, agregar datos de prueba
      if (Object.keys(registrations).length === 0) {
        registrations = generateSampleRegistrations()
        localStorage.setItem('event_registrations', JSON.stringify(registrations))
      }

      setEventRegistrations(registrations)
    } catch (error) {
      console.error('Error loading registrations:', error)
      setEventRegistrations({})
    }
  }

  const generateSampleRegistrations = () => {
    return {
      'event-1': [
        {
          id: 1,
          name: 'María García',
          email: 'maria@ejemplo.com',
          phone: '987654321',
          area: 'metalurgia',
          registeredAt: new Date().toISOString(),
          status: 'confirmed'
        },
        {
          id: 2,
          name: 'Carlos López',
          email: 'carlos@ejemplo.com',
          phone: '987654322',
          area: 'mineria',
          registeredAt: new Date().toISOString(),
          status: 'confirmed'
        }
      ],
      'event-2': [
        {
          id: 3,
          name: 'Ana Silva',
          email: 'ana@ejemplo.com',
          phone: '987654323',
          area: 'geologia',
          registeredAt: new Date().toISOString(),
          status: 'confirmed'
        }
      ]
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Limpiar error de validación del campo
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateEventForm(formData)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      showToast('Por favor corrige los errores en el formulario', 'error')
      return
    }

    try {
      const eventData = {
        ...formData,
        slug: generateEventSlug(formData.title),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, eventData)
        showToast('✅ Evento actualizado correctamente', 'success')
      } else {
        await eventService.createEvent(eventData)
        showToast('✅ Evento creado correctamente', 'success')
      }

      await loadEvents()
      handleCloseForm()
    } catch (error) {
      console.error('Error saving event:', error)
      showToast(`Error: ${error.message}`, 'error')
    }
  }

  const handleEdit = (event) => {
    setSelectedEvent(event)
    setFormData({
      ...DEFAULT_FORM_DATA,
      ...event
    })
    setIsCreating(true)
  }

  const handleDelete = async (event) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el evento "${event.title}"?`)) {
      try {
        await eventService.deleteEvent(event.id)
        await loadEvents()
        showToast('✅ Evento eliminado correctamente', 'success')
      } catch (error) {
        console.error('Error deleting event:', error)
        showToast(`Error: ${error.message}`, 'error')
      }
    }
  }

  const handleDuplicate = async (event) => {
    try {
      const duplicatedEvent = {
        ...event,
        title: `${event.title} (Copia)`,
        slug: generateEventSlug(`${event.title} (Copia)`),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      delete duplicatedEvent.id

      await eventService.createEvent(duplicatedEvent)
      await loadEvents()
      showToast('✅ Evento duplicado correctamente', 'success')
    } catch (error) {
      console.error('Error duplicating event:', error)
      showToast(`Error: ${error.message}`, 'error')
    }
  }

  const handlePublishToggle = async (event) => {
    try {
      const newStatus = event.status === 'published' ? 'draft' : 'published'
      await eventService.updateEvent(event.id, { status: newStatus })
      await loadEvents()

      const action = newStatus === 'published' ? 'publicado' : 'despublicado'
      showToast(`✅ Evento ${action} correctamente`, 'success')
    } catch (error) {
      console.error('Error updating event status:', error)
      showToast(`Error: ${error.message}`, 'error')
    }
  }

  const handleCloseForm = () => {
    setIsCreating(false)
    setSelectedEvent(null)
    setFormData(DEFAULT_FORM_DATA)
    setValidationErrors({})
  }

  const addEventType = () => {
    if (newEventType.value && newEventType.label) {
      setEventTypes(prev => [...prev, newEventType])
      setNewEventType({ value: '', label: '', color: 'blue' })
      showToast('✅ Tipo de evento agregado', 'success')
    }
  }

  return {
    // Estados
    events,
    stats,
    loading,
    eventRegistrations,
    isCreating,
    selectedEvent,
    showConfig,
    searchTerm,
    filters,
    formData,
    validationErrors,
    eventTypes,
    newEventType,

    // Setters
    setIsCreating,
    setSelectedEvent,
    setShowConfig,
    setSearchTerm,
    setFilters,
    setNewEventType,

    // Handlers
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handlePublishToggle,
    handleCloseForm,
    addEventType,
    loadAllData
  }
}