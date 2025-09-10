import { useState, useEffect } from 'react'
import { eventService } from '../../services/eventService'
import { notificationService } from '../../services/notificationService'
import { useUIStore } from '../../store'
import * as XLSX from 'xlsx'

const AdminEvents = () => {
  const { showToast } = useUIStore()
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventRegistrations, setEventRegistrations] = useState({})
  const [showConfig, setShowConfig] = useState(false)
  const [eventTypes, setEventTypes] = useState([
    { value: 'webinar', label: 'Webinar', color: 'blue' },
    { value: 'masterclass', label: 'Masterclass', color: 'purple' },
    { value: 'promotion', label: 'Promoción', color: 'green' },
    { value: 'bundle', label: 'Bundle de Cursos', color: 'orange' }
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
    pdfUrl: '', // PDF descargable
    youtubeUrl: '', // Video de YouTube
    redirectUrl: '', // URL de redirección después de inscripción
    benefits: []
  })

  useEffect(() => {
    loadEvents()
    loadStats()
    loadEventRegistrations()
  }, [])

  const loadEvents = () => {
    const allEvents = eventService.getAllActiveEvents()
    setEvents(allEvents)
  }

  const loadStats = () => {
    const eventStats = eventService.getEventStats()
    setStats(eventStats)
  }

  const loadEventRegistrations = () => {
    let registrations = JSON.parse(localStorage.getItem('event_registrations') || '{}')
    
    // Si no hay datos, agregar datos de prueba
    if (Object.keys(registrations).length === 0) {
      registrations = {
        'evt-001': [
          {
            firstName: 'Carlos',
            lastName: 'Rodriguez',
            email: 'carlos.rodriguez@email.com',
            phone: '987654321',
            registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 días atrás
          },
          {
            firstName: 'Maria',
            lastName: 'Gonzalez',
            email: 'maria.gonzalez@email.com',
            phone: '912345678',
            registeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 día atrás
          },
          {
            firstName: 'Ana',
            lastName: 'Martinez',
            email: 'ana.martinez@email.com',
            phone: '956781234',
            registeredAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 horas atrás
          }
        ],
        'evt-002': [
          {
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'juan.perez@email.com',
            phone: '923456789',
            registeredAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 horas atrás
          },
          {
            firstName: 'Sofia',
            lastName: 'Lopez',
            email: 'sofia.lopez@email.com',
            phone: '934567890',
            registeredAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutos atrás
          }
        ]
      }
      
      // Guardar datos de prueba
      localStorage.setItem('event_registrations', JSON.stringify(registrations))
    }
    
    setEventRegistrations(registrations)
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

  const handleCreateEvent = (e) => {
    e.preventDefault()
    
    const newEvent = eventService.createEvent({
      ...formData,
      organizers: formData.organizers, // ya es un array
      tags: formData.tags.split(',').map(tag => tag.trim()),
      relatedCourses: formData.relatedCourses.split(',').map(id => id.trim()),
      benefits: formData.benefits.split('\n').filter(b => b.trim())
    })

    showToast('Evento creado exitosamente', 'success')
    setIsCreating(false)
    resetForm()
    loadEvents()
    loadStats()
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

  const handleNotifyUsers = (event) => {
    // Simular notificación a usuarios interesados
    const relevantUsers = 50 // En producción, esto vendría de la base de datos
    
    notificationService.createNotification({
      type: 'success',
      title: 'Notificaciones Enviadas',
      message: `Se notificó a ${relevantUsers} usuarios interesados en ${event.area}`,
      duration: 5000
    })

    showToast(`${relevantUsers} usuarios notificados`, 'success')
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

  if (selectedEvent) {
    const participants = getEventParticipants(selectedEvent.id)
    
    return (
      <div className="space-y-6">
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
                    {selectedEvent.type}
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
    <div className="space-y-6">
      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Eventos</h3>
            <p className="text-3xl font-bold text-white">{stats.totalEvents}</p>
          </div>
          <div className="bg-surface rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Webinars</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.upcomingWebinars}</p>
          </div>
          <div className="bg-surface rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Promociones</h3>
            <p className="text-3xl font-bold text-green-400">{stats.activePromotions}</p>
          </div>
          <div className="bg-surface rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Registros Totales</h3>
            <p className="text-3xl font-bold text-purple-400">{stats.totalRegistrations}</p>
          </div>
        </div>
      )}

      {/* Header con botones */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Eventos</h2>
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
                    Inicio
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
                value={formData.tags}
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
                value={formData.benefits}
                onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                rows="3"
                placeholder="Certificado de participación&#10;Material descargable&#10;Descuento en curso"
              />
            </div>

            {/* URL de PDF */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📄 URL del PDF descargable
              </label>
              <input
                type="url"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                placeholder="https://example.com/material.pdf"
              />
              <p className="text-xs text-gray-500 mt-1">
                Material descargable que los estudiantes podrán acceder
              </p>
            </div>

            {/* URL de YouTube */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎥 URL del video de YouTube
              </label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                placeholder="https://www.youtube.com/watch?v=abc123"
              />
              <p className="text-xs text-gray-500 mt-1">
                Video relacionado que aparecerá en los detalles del evento
              </p>
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
                placeholder="https://zoom.us/j/123456789 o https://teams.microsoft.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Los estudiantes serán redirigidos aquí después de inscribirse (ej: Zoom, Teams, etc.)
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
                    <p className="text-sm text-gray-400">{event.description}</p>
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
                    {event.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-300">
                  {event.area}
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-300">
                  {event.date ? new Date(event.date).toLocaleDateString('es-ES') : 'N/A'}
                </td>
                <td className="py-3 px-4 text-center">
                  {event.capacity ? (
                    <div>
                      <p className="text-sm text-white">{event.registered}/{event.capacity}</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `${(event.registered / event.capacity) * 100}%` }}
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
                      className="text-sm bg-accent text-background px-3 py-1 rounded hover:bg-accent/80 font-medium"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleNotifyUsers(event)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Notificar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminEvents