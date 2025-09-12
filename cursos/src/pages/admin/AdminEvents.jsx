import { useState, useEffect } from 'react'
import { eventService } from '../../services/eventService'
import { notificationService } from '../../services/notificationService'
import { useUIStore } from '../../store'
import hardcodedValuesService from '../../services/hardcodedValuesService'
import * as XLSX from 'xlsx'

const AdminEvents = () => {
  const { showToast } = useUIStore()
  const [events, setEvents] = useState([])
  const [hardcodedValues, setHardcodedValues] = useState({})
  const [stats, setStats] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventRegistrations, setEventRegistrations] = useState({})
  const [showConfig, setShowConfig] = useState(false)
  const [loading, setLoading] = useState(true)
  const [eventTypes, setEventTypes] = useState([
    { value: 'webinar', label: 'Webinar', color: 'blue' },
    { value: 'masterclass', label: 'Masterclass', color: 'purple' },
    { value: 'promotion', label: 'Promoción', color: 'green' },
    { value: 'bundle', label: 'Bundle de Cursos', color: 'orange' },
    { value: 'workshop', label: 'Taller', color: 'red' }
  ])
  const [newEventType, setNewEventType] = useState({ value: '', label: '', color: 'blue' })
  const [formData, setFormData] = useState({
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
  })

  useEffect(() => {
    loadInitialData()
    loadHardcodedValues()
  }, [])

  const loadHardcodedValues = async () => {
    try {
      const values = await hardcodedValuesService.getValues()
      setHardcodedValues(values)
    } catch (error) {
      console.error('Error loading hardcoded values:', error)
      setHardcodedValues({
        examples: {
          materialUrl: 'https://example.com/material.pdf',
          videoUrl: 'https://www.youtube.com/watch?v=abc123',
          meetingUrl: 'https://zoom.us/j/123456789 o https://teams.microsoft.com/...',
          demoEmail1: 'carlos.rodriguez@email.com',
          demoEmail2: 'maria.gonzalez@email.com',
          demoEmail3: 'ana.martinez@email.com',
          demoEmail4: 'juan.perez@email.com',
          demoEmail5: 'sofia.lopez@email.com'
        }
      })
    }
  }

  const loadInitialData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        loadEvents(),
        loadStats(),
        loadEventRegistrations()
      ])
    } catch (error) {
      console.error('Error loading initial data:', error)
      showToast('Error al cargar los datos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadEvents = async () => {
    try {
      const allEvents = eventService.getAllActiveEvents()
      setEvents(allEvents)
    } catch (error) {
      console.error('Error loading events:', error)
      setEvents([])
    }
  }

  const loadStats = async () => {
    try {
      const eventStats = eventService.getEventStats()
      setStats(eventStats)
    } catch (error) {
      console.error('Error loading stats:', error)
      setStats(null)
    }
  }

  const loadEventRegistrations = () => {
    try {
      let registrations = JSON.parse(localStorage.getItem('event_registrations') || '{}')
      
      // Si no hay datos, agregar datos de demostración
      if (Object.keys(registrations).length === 0) {
        registrations = {
          'evt-001': [
            {
              firstName: 'Carlos',
              lastName: 'Rodriguez',
              email: hardcodedValues?.examples?.demoEmail1 || 'carlos.rodriguez@email.com',
              phone: '987654321',
              registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              firstName: 'Maria',
              lastName: 'Gonzalez',
              email: hardcodedValues?.examples?.demoEmail2 || 'maria.gonzalez@email.com',
              phone: '912345678',
              registeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              firstName: 'Ana',
              lastName: 'Martinez',
              email: hardcodedValues?.examples?.demoEmail3 || 'ana.martinez@email.com',
              phone: '956781234',
              registeredAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            }
          ],
          'evt-002': [
            {
              firstName: 'Juan',
              lastName: 'Perez',
              email: hardcodedValues?.examples?.demoEmail4 || 'juan.perez@email.com',
              phone: '923456789',
              registeredAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
              firstName: 'Sofia',
              lastName: 'Lopez',
              email: hardcodedValues?.examples?.demoEmail5 || 'sofia.lopez@email.com',
              phone: '934567890',
              registeredAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            }
          ]
        }
        
        localStorage.setItem('event_registrations', JSON.stringify(registrations))
      }
      
      setEventRegistrations(registrations)
    } catch (error) {
      console.error('Error loading event registrations:', error)
      setEventRegistrations({})
    }
  }

  const handleViewEvent = (event) => {
    setSelectedEvent(event)
  }

  const handleBackToList = () => {
    setSelectedEvent(null)
  }

  const getEventParticipants = (eventId) => {
    return eventRegistrations[eventId] || []
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    
    try {
      const newEvent = eventService.createEvent({
        ...formData,
        organizers: formData.organizers,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : formData.tags,
        relatedCourses: typeof formData.relatedCourses === 'string' ? formData.relatedCourses.split(',').map(id => id.trim()).filter(Boolean) : formData.relatedCourses,
        benefits: typeof formData.benefits === 'string' ? formData.benefits.split('\n').filter(b => b.trim()) : formData.benefits
      })

      showToast('Evento creado exitosamente', 'success')
      setIsCreating(false)
      resetForm()
      await loadEvents()
      await loadStats()
    } catch (error) {
      console.error('Error creating event:', error)
      showToast('Error al crear el evento', 'error')
    }
  }

  const resetForm = () => {
    setFormData({
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
    })
  }

  const handleNotifyUsers = async (event) => {
    try {
      // Simular notificación a usuarios interesados
      const relevantUsers = Math.floor(Math.random() * 100) + 20 // Entre 20 y 120 usuarios
      
      await notificationService.createNotification({
        type: 'success',
        title: 'Notificaciones Enviadas',
        message: `Se notificó a ${relevantUsers} usuarios interesados en ${event.area}`,
        duration: 5000
      })

      showToast(`${relevantUsers} usuarios notificados`, 'success')
    } catch (error) {
      console.error('Error notifying users:', error)
      showToast('Error al enviar notificaciones', 'error')
    }
  }

  const handleAddEventType = () => {
    if (!newEventType.value.trim() || !newEventType.label.trim()) {
      showToast('Por favor completa todos los campos', 'error')
      return
    }

    // Verificar que no exista ya
    if (eventTypes.find(type => type.value === newEventType.value)) {
      showToast('Este tipo de evento ya existe', 'error')
      return
    }

    setEventTypes([...eventTypes, { ...newEventType }])
    setNewEventType({ value: '', label: '', color: 'blue' })
    showToast('Tipo de evento agregado exitosamente', 'success')
  }

  const handleRemoveEventType = (valueToRemove) => {
    if (eventTypes.length <= 1) {
      showToast('Debe haber al menos un tipo de evento', 'error')
      return
    }
    
    setEventTypes(eventTypes.filter(type => type.value !== valueToRemove))
    showToast('Tipo de evento eliminado', 'success')
  }

  const getEventTypeConfig = (typeValue) => {
    return eventTypes.find(type => type.value === typeValue) || eventTypes[0]
  }

  const handleDownloadExcel = (event, participants) => {
    if (!participants || participants.length === 0) {
      showToast('No hay participantes para descargar', 'error')
      return
    }

    try {
      // Preparar datos para Excel
      const excelData = participants.map((participant, index) => ({
        '#': index + 1,
        'Nombre': participant.firstName || (participant.name ? participant.name.split(' ')[0] : 'N/A'),
        'Apellidos': participant.lastName || (participant.name ? participant.name.split(' ').slice(1).join(' ') : 'N/A'),
        'Correo Electrónico': participant.email || 'N/A',
        'Teléfono': participant.phone || 'N/A',
        'Fecha de Registro': participant.registeredAt 
          ? new Date(participant.registeredAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'N/A'
      }))

      // Crear libro de trabajo
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Configurar ancho de columnas
      const colWidths = [
        { wch: 5 },  // #
        { wch: 15 }, // Nombre
        { wch: 20 }, // Apellidos
        { wch: 30 }, // Correo
        { wch: 15 }, // Teléfono
        { wch: 18 }  // Fecha de Registro
      ]
      ws['!cols'] = colWidths

      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Participantes')

      // Generar nombre del archivo
      const eventTitle = event.title.replace(/[^a-zA-Z0-9]/g, '_')
      const currentDate = new Date().toISOString().split('T')[0]
      const fileName = `Participantes_${eventTitle}_${currentDate}.xlsx`

      // Descargar archivo
      XLSX.writeFile(wb, fileName)
      
      showToast(`Archivo ${fileName} descargado exitosamente`, 'success')
    } catch (error) {
      console.error('Error downloading Excel:', error)
      showToast('Error al generar el archivo Excel', 'error')
    }
  }

  const handleAddOrganizer = (organizerName) => {
    if (organizerName.trim() && !formData.organizers.includes(organizerName.trim())) {
      setFormData({
        ...formData,
        organizers: [...formData.organizers, organizerName.trim()]
      })
    }
  }

  const handleRemoveOrganizer = (organizerToRemove) => {
    setFormData({
      ...formData,
      organizers: formData.organizers.filter(org => org !== organizerToRemove)
    })
  }

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        // Aquí podrías llamar a eventService.deleteEvent(eventId)
        const updatedEvents = events.filter(event => event.id !== eventId)
        setEvents(updatedEvents)
        
        showToast('Evento eliminado correctamente', 'success')
        await loadStats()
      } catch (error) {
        console.error('Error deleting event:', error)
        showToast('Error al eliminar el evento', 'error')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        <span className="ml-3 text-white">Cargando eventos...</span>
      </div>
    )
  }

  if (selectedEvent) {
    const participants = getEventParticipants(selectedEvent.id)
    
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header con botón de volver */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToList}
            className="flex items-center text-accent hover:text-accent/80 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la lista
          </button>
          <h2 className="text-2xl font-bold text-white">Detalles del Evento</h2>
        </div>

        {/* Detalles del evento */}
        <div className="bg-surface rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{selectedEvent.title}</h3>
                <p className="text-gray-300">{selectedEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getEventTypeConfig(selectedEvent.type).color === 'blue' ? 'bg-blue-600/20 text-blue-400' :
                    getEventTypeConfig(selectedEvent.type).color === 'purple' ? 'bg-purple-600/20 text-purple-400' :
                    getEventTypeConfig(selectedEvent.type).color === 'green' ? 'bg-green-600/20 text-green-400' :
                    getEventTypeConfig(selectedEvent.type).color === 'orange' ? 'bg-orange-600/20 text-orange-400' :
                    getEventTypeConfig(selectedEvent.type).color === 'red' ? 'bg-red-600/20 text-red-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>
                    {getEventTypeConfig(selectedEvent.type).label}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Área</label>
                  <p className="text-white font-medium capitalize">{selectedEvent.area}</p>
                </div>
              </div>

              {selectedEvent.date && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
                    <p className="text-white font-medium">
                      {new Date(selectedEvent.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Hora</label>
                    <p className="text-white font-medium">{selectedEvent.time}</p>
                  </div>
                </div>
              )}

              {selectedEvent.organizers && selectedEvent.organizers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Organizadores</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.organizers.map((organizer, index) => (
                      <span
                        key={index}
                        className="inline-block bg-accent/20 text-accent px-2 py-1 rounded text-sm"
                      >
                        {organizer}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <div className="space-y-4">
              {selectedEvent.capacity && (
                <div className="bg-background rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Registros</label>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">
                      {selectedEvent.registered || 0} / {selectedEvent.capacity}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {Math.round(((selectedEvent.registered || 0) / selectedEvent.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-accent h-3 rounded-full transition-all"
                      style={{ width: `${((selectedEvent.registered || 0) / selectedEvent.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {selectedEvent.price !== undefined && (
                <div className="bg-background rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Precio</label>
                  <p className="text-white font-medium text-lg">
                    {selectedEvent.price === 0 ? 'Gratuito' : `$${selectedEvent.price}`}
                  </p>
                </div>
              )}

              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.benefits && selectedEvent.benefits.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Beneficios</label>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {selectedEvent.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de participantes */}
        <div className="bg-surface rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Participantes Registrados ({participants.length})
              </h3>
              {participants.length > 0 && (
                <button
                  onClick={() => handleDownloadExcel(selectedEvent, participants)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Descargar Excel</span>
                </button>
              )}
            </div>
          </div>
          
          {participants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Apellidos</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Correo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Teléfono</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-400">Fecha de Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {participants.map((participant, index) => (
                    <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 text-white font-medium">
                        {participant.firstName || (participant.name ? participant.name.split(' ')[0] : 'N/A')}
                      </td>
                      <td className="py-3 px-4 text-white font-medium">
                        {participant.lastName || (participant.name ? participant.name.split(' ').slice(1).join(' ') : 'N/A')}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        <a 
                          href={`mailto:${participant.email}`}
                          className="hover:text-accent transition-colors"
                        >
                          {participant.email}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {participant.phone ? (
                          <a 
                            href={`tel:${participant.phone}`}
                            className="hover:text-accent transition-colors"
                          >
                            {participant.phone}
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-300 text-sm">
                        {participant.registeredAt ? 
                          new Date(participant.registeredAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-400 text-lg">No hay participantes registrados</p>
              <p className="text-gray-500 text-sm mt-1">Los registros aparecerán aquí cuando alguien se inscriba al evento</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Eventos</h1>
        <p className="text-text-secondary">
          Administra webinars, masterclasses, promociones y eventos especiales
        </p>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Eventos</p>
                <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Webinars</p>
                <p className="text-2xl font-bold text-blue-400">{stats.upcomingWebinars}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Promociones</p>
                <p className="text-2xl font-bold text-green-400">{stats.activePromotions}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Registros Totales</p>
                <p className="text-2xl font-bold text-purple-400">{stats.totalRegistrations}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header con botones */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            ⚙️ Configurar Tipos
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90"
          >
            + Crear Evento
          </button>
        </div>
      </div>

      {/* Panel de configuración de tipos */}
      {showConfig && (
        <div className="bg-surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Configurar Tipos de Evento</h3>
          
          {/* Tipos existentes */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Tipos Existentes</h4>
            <div className="grid gap-2">
              {eventTypes.map(type => (
                <div key={type.value} className="flex items-center justify-between bg-background rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className={`w-4 h-4 rounded-full ${
                      type.color === 'blue' ? 'bg-blue-500' :
                      type.color === 'purple' ? 'bg-purple-500' :
                      type.color === 'green' ? 'bg-green-500' :
                      type.color === 'orange' ? 'bg-orange-500' :
                      type.color === 'red' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></span>
                    <div>
                      <p className="text-white font-medium">{type.label}</p>
                      <p className="text-gray-400 text-sm">Valor: {type.value}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEventType(type.value)}
                    className="text-red-400 hover:text-red-300 px-3 py-1 rounded text-sm"
                    disabled={eventTypes.length <= 1}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Agregar nuevo tipo */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Agregar Nuevo Tipo</h4>
            <div className="grid md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Valor (ej: taller)"
                value={newEventType.value}
                onChange={(e) => setNewEventType({...newEventType, value: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                className="px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Etiqueta (ej: Taller)"
                value={newEventType.label}
                onChange={(e) => setNewEventType({...newEventType, label: e.target.value})}
                className="px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
              />
              <select
                value={newEventType.color}
                onChange={(e) => setNewEventType({...newEventType, color: e.target.value})}
                className="px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
              >
                <option value="blue">🔵 Azul</option>
                <option value="purple">🟣 Morado</option>
                <option value="green">🟢 Verde</option>
                <option value="orange">🟠 Naranja</option>
                <option value="red">🔴 Rojo</option>
                <option value="gray">⚫ Gris</option>
              </select>
              <button
                onClick={handleAddEventType}
                className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de creación */}
      {isCreating && (
        <div className="bg-surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Nuevo Evento</h3>
          
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Tipo de evento */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Evento
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                  required
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Área */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Área
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                  required
                >
                  <option value="metalurgia">Metalurgia</option>
                  <option value="mineria">Minería</option>
                  <option value="geologia">Geología</option>
                </select>
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del Evento
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                placeholder="Ej: Innovaciones en Metalurgia 4.0"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                rows="3"
                placeholder="Descripción breve del evento..."
                required
              />
            </div>

            {/* Fecha y hora (solo para webinars/masterclass) */}
            {(formData.type === 'webinar' || formData.type === 'masterclass') && (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duración
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                    placeholder="Ej: 2 horas"
                  />
                </div>
              </div>
            )}

            {/* Organizadores */}
            {(formData.type === 'webinar' || formData.type === 'masterclass') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organizadores
                </label>
                
                {/* Lista de organizadores actuales */}
                {formData.organizers.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {formData.organizers.map((organizer, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-accent/20 text-accent px-3 py-1 rounded-full text-sm"
                      >
                        {organizer}
                        <button
                          type="button"
                          onClick={() => handleRemoveOrganizer(organizer)}
                          className="ml-2 text-accent/70 hover:text-accent"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Input para agregar organizador */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="organizerInput"
                    className="flex-1 px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                    placeholder="Nombre del organizador"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddOrganizer(e.target.value)
                        e.target.value = ''
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('organizerInput')
                      handleAddOrganizer(input.value)
                      input.value = ''
                    }}
                    className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            )}

            {/* Capacidad y precio */}
            <div className="grid md:grid-cols-2 gap-4">
              {(formData.type === 'webinar' || formData.type === 'masterclass') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                    min="1"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (separados por coma)
              </label>
              <input
                type="text"
                value={typeof formData.tags === 'string' ? formData.tags : formData.tags.join(', ')}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                placeholder="metalurgia, tecnología, industria 4.0"
              />
            </div>

            {/* Beneficios */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Beneficios (uno por línea)
              </label>
              <textarea
                value={typeof formData.benefits === 'string' ? formData.benefits : formData.benefits.join('\n')}
                onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                rows="3"
                placeholder="Certificado de participación&#10;Material descargable&#10;Descuento en curso"
              />
            </div>

            {/* URLs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📄 URL del PDF descargable
                </label>
                <input
                  type="url"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                  placeholder={hardcodedValues?.examples?.materialUrl || 'https://example.com/material.pdf'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎥 URL del video de YouTube
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                  placeholder={hardcodedValues?.examples?.videoUrl || 'https://www.youtube.com/watch?v=abc123'}
                />
              </div>
            </div>

            {/* URL de redirección */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🔗 URL de redirección después de inscripción
              </label>
              <input
                type="url"
                value={formData.redirectUrl}
                onChange={(e) => setFormData({...formData, redirectUrl: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                placeholder={hardcodedValues?.examples?.meetingUrl || 'https://zoom.us/j/123456789 o https://teams.microsoft.com/...'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Los estudiantes serán redirigidos aquí después de inscribirse
              </p>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false)
                  resetForm()
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90"
              >
                Crear Evento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de eventos */}
      <div className="bg-surface rounded-xl overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No hay eventos</h3>
            <p className="text-text-secondary mb-4">Crea el primer evento para comenzar</p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-accent text-background px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              + Crear Primer Evento
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Evento</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Área</th>
                <th className="text-center py-3 px-4 font-medium text-gray-400">Fecha</th>
                <th className="text-center py-3 px-4 font-medium text-gray-400">Registros</th>
                <th className="text-center py-3 px-4 font-medium text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-white">{event.title}</p>
                      <p className="text-sm text-gray-400 line-clamp-1">{event.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      getEventTypeConfig(event.type).color === 'blue' ? 'bg-blue-600/20 text-blue-400' :
                      getEventTypeConfig(event.type).color === 'purple' ? 'bg-purple-600/20 text-purple-400' :
                      getEventTypeConfig(event.type).color === 'green' ? 'bg-green-600/20 text-green-400' :
                      getEventTypeConfig(event.type).color === 'orange' ? 'bg-orange-600/20 text-orange-400' :
                      getEventTypeConfig(event.type).color === 'red' ? 'bg-red-600/20 text-red-400' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {getEventTypeConfig(event.type).label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300 capitalize">
                    {event.area}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-300">
                    {event.date ? new Date(event.date).toLocaleDateString('es-ES') : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {event.capacity ? (
                      <div>
                        <p className="text-sm text-white">{event.registered || 0}/{event.capacity}</p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${((event.registered || 0) / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewEvent(event)}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium transition-colors"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleNotifyUsers(event)}
                        className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        Notificar
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminEvents