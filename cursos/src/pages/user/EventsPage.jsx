import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card, Modal } from '../../components/ui'
import apiClient from '../../api/client'

const EventsPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [filterType, setFilterType] = useState('all')
  const [registeredEvents, setRegisteredEvents] = useState([])
  
  useEffect(() => {
    loadEvents()
  }, [])
  
  useEffect(() => {
    filterEvents()
  }, [events, activeTab, filterType])
  
  const loadEvents = async () => {
    setLoading(true)
    try {
      // Simulated events data
      const eventsData = [
        {
          id: '1',
          title: 'Webinar: Introducción a React Hooks',
          type: 'webinar',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          time: '18:00',
          duration: '2 horas',
          instructor: 'María González',
          description: 'Aprende los conceptos fundamentales de React Hooks y cómo implementarlos en tus proyectos.',
          image: '🎥',
          attendees: 145,
          maxAttendees: 500,
          status: 'upcoming',
          price: 0,
          tags: ['React', 'JavaScript', 'Frontend'],
          platform: 'Zoom',
          benefits: [
            'Certificado de participación',
            'Material descargable',
            'Acceso a la grabación por 30 días',
            'Q&A en vivo'
          ]
        },
        {
          id: '2',
          title: 'Masterclass: Arquitectura de Microservicios',
          type: 'masterclass',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          time: '19:00',
          duration: '3 horas',
          instructor: 'Carlos Rodríguez',
          description: 'Diseña y construye aplicaciones escalables con arquitectura de microservicios.',
          image: '🏗️',
          attendees: 89,
          maxAttendees: 200,
          status: 'upcoming',
          price: 29.99,
          tags: ['Backend', 'Arquitectura', 'DevOps'],
          platform: 'Google Meet',
          benefits: [
            'Certificado profesional',
            'Proyecto práctico',
            'Mentoría post-evento',
            'Recursos exclusivos'
          ]
        },
        {
          id: '3',
          title: 'Workshop: Machine Learning con Python',
          type: 'workshop',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          time: '10:00',
          duration: '6 horas',
          instructor: 'Ana Martínez',
          description: 'Workshop práctico de ML: desde los fundamentos hasta la implementación de modelos.',
          image: '🤖',
          attendees: 32,
          maxAttendees: 50,
          status: 'upcoming',
          price: 49.99,
          tags: ['Python', 'Machine Learning', 'Data Science'],
          platform: 'Presencial',
          location: 'Lima, Perú',
          benefits: [
            'Certificado con valor curricular',
            'Kit de herramientas ML',
            'Almuerzo incluido',
            'Networking session'
          ]
        },
        {
          id: '4',
          title: 'Conferencia: El Futuro del Desarrollo Web',
          type: 'conference',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          time: '09:00',
          duration: '8 horas',
          instructor: 'Múltiples ponentes',
          description: 'Conferencia anual sobre las últimas tendencias en desarrollo web.',
          image: '🌐',
          attendees: 500,
          maxAttendees: 500,
          status: 'past',
          price: 0,
          tags: ['Web', 'Tendencias', 'Comunidad'],
          recordingAvailable: true
        },
        {
          id: '5',
          title: 'Taller: Git Avanzado para Equipos',
          type: 'workshop',
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          time: '17:00',
          duration: '4 horas',
          instructor: 'Pedro Sánchez',
          description: 'Domina Git y GitHub para trabajo colaborativo en equipos de desarrollo.',
          image: '🔧',
          attendees: 15,
          maxAttendees: 30,
          status: 'upcoming',
          price: 19.99,
          tags: ['Git', 'DevOps', 'Colaboración'],
          platform: 'Discord',
          benefits: [
            'Guía práctica de Git',
            'Plantillas de workflow',
            'Soporte por 15 días'
          ]
        }
      ]
      
      setEvents(eventsData)
      
      // Simulated registered events
      setRegisteredEvents(['1', '3'])
      
    } catch (error) {
      console.error('Error loading events:', error)
      showError('Error al cargar los eventos')
    } finally {
      setLoading(false)
    }
  }
  
  const filterEvents = () => {
    let filtered = [...events]
    
    // Filter by tab
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(e => e.status === 'upcoming')
    } else if (activeTab === 'past') {
      filtered = filtered.filter(e => e.status === 'past')
    } else if (activeTab === 'registered') {
      filtered = filtered.filter(e => registeredEvents.includes(e.id))
    }
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType)
    }
    
    // Sort by date
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    setFilteredEvents(filtered)
  }
  
  const handleRegister = async (event) => {
    if (!isAuthenticated) {
      showError('Debes iniciar sesión para registrarte')
      navigate('/login')
      return
    }
    
    setSelectedEvent(event)
    setShowRegisterModal(true)
  }
  
  const confirmRegistration = async () => {
    try {
      // Simulate registration
      setRegisteredEvents([...registeredEvents, selectedEvent.id])
      showSuccess(`¡Te has registrado exitosamente para ${selectedEvent.title}!`)
      
      // Send confirmation email simulation
      setTimeout(() => {
        showSuccess('Se ha enviado un email de confirmación con los detalles del evento')
      }, 1000)
      
      setShowRegisterModal(false)
      setSelectedEvent(null)
    } catch (error) {
      showError('Error al registrarte en el evento')
    }
  }
  
  const handleCancelRegistration = (eventId) => {
    if (window.confirm('¿Estás seguro de cancelar tu registro?')) {
      setRegisteredEvents(registeredEvents.filter(id => id !== eventId))
      showSuccess('Registro cancelado exitosamente')
    }
  }
  
  const addToCalendar = (event) => {
    const startDate = new Date(event.date)
    const endDate = new Date(startDate.getTime() + parseInt(event.duration) * 60 * 60 * 1000)
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(event.description)}`
    
    window.open(calendarUrl, '_blank')
  }
  
  const shareEvent = (event) => {
    const url = `${window.location.origin}/events/${event.id}`
    const text = `¡No te pierdas este evento! ${event.title} - ${formatDate(event.date)} a las ${event.time}`
    
    if (navigator.share) {
      navigator.share({ title: event.title, text, url })
    } else {
      navigator.clipboard.writeText(url)
      showSuccess('Enlace copiado al portapapeles')
    }
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const getDaysUntil = (date) => {
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Mañana'
    if (days < 0) return 'Evento pasado'
    return `En ${days} días`
  }
  
  const getEventIcon = (type) => {
    const icons = {
      webinar: '🎥',
      masterclass: '🎓',
      workshop: '🛠️',
      conference: '🎤',
      meetup: '👥'
    }
    return icons[type] || '📅'
  }
  
  const getEventTypeLabel = (type) => {
    const labels = {
      webinar: 'Webinar',
      masterclass: 'Masterclass',
      workshop: 'Taller',
      conference: 'Conferencia',
      meetup: 'Meetup'
    }
    return labels[type] || type
  }
  
  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    registered: registeredEvents.length,
    hoursLearned: registeredEvents.length * 3
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Eventos y Webinars
        </h1>
        <p className="text-text-secondary mb-6">
          Participa en eventos en vivo, masterclasses y talleres con expertos de la industria
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            <p className="text-sm text-text-secondary">Eventos totales</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-accent">{stats.upcoming}</p>
            <p className="text-sm text-text-secondary">Próximos eventos</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-400">{stats.registered}</p>
            <p className="text-sm text-text-secondary">Registrado</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-purple-400">{stats.hoursLearned}h</p>
            <p className="text-sm text-text-secondary">De aprendizaje</p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1">
          {[
            { id: 'upcoming', label: 'Próximos' },
            { id: 'registered', label: 'Mis Eventos' },
            { id: 'past', label: 'Pasados' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">Todos los tipos</option>
          <option value="webinar">Webinars</option>
          <option value="masterclass">Masterclasses</option>
          <option value="workshop">Talleres</option>
          <option value="conference">Conferencias</option>
        </select>
      </div>
      
      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-text-secondary">Cargando eventos...</p>
          </div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            No hay eventos disponibles
          </h3>
          <p className="text-text-secondary">
            {activeTab === 'registered' 
              ? 'No te has registrado en ningún evento aún'
              : 'No hay eventos en esta categoría por el momento'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const isRegistered = registeredEvents.includes(event.id)
            const isPast = event.status === 'past'
            const isFull = event.attendees >= event.maxAttendees
            
            return (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                {/* Event Header */}
                <div className="h-32 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center relative">
                  <span className="text-5xl">{event.image || getEventIcon(event.type)}</span>
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      event.type === 'webinar' ? 'bg-blue-500/20 text-blue-400' :
                      event.type === 'masterclass' ? 'bg-purple-500/20 text-purple-400' :
                      event.type === 'workshop' ? 'bg-green-500/20 text-green-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {getEventTypeLabel(event.type)}
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      event.price === 0
                        ? 'bg-green-500 text-white'
                        : 'bg-accent text-white'
                    }`}>
                      {event.price === 0 ? 'GRATIS' : `$${event.price}`}
                    </span>
                  </div>
                  
                  {/* Status Indicator */}
                  {isRegistered && (
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs py-1 text-center">
                      ✓ Registrado
                    </div>
                  )}
                </div>
                
                {/* Event Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  
                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-text-secondary mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-text-primary">
                        {getDaysUntil(event.date)}
                      </span>
                      <span>• {formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.time} • {event.duration}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{event.instructor}</span>
                    </div>
                    
                    {event.platform && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{event.platform}</span>
                      </div>
                    )}
                    
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Attendees Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-text-secondary mb-1">
                      <span>{event.attendees} registrados</span>
                      <span>{event.maxAttendees} cupos</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          isFull ? 'bg-red-500' : 'bg-accent'
                        }`}
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags?.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-1 bg-surface rounded text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    {isPast ? (
                      event.recordingAvailable ? (
                        <Button size="small" className="flex-1">
                          Ver Grabación
                        </Button>
                      ) : (
                        <Button size="small" variant="secondary" disabled className="flex-1">
                          Evento Finalizado
                        </Button>
                      )
                    ) : isRegistered ? (
                      <>
                        <Button 
                          size="small" 
                          variant="secondary"
                          className="flex-1"
                          onClick={() => addToCalendar(event)}
                        >
                          📅 Calendario
                        </Button>
                        <button
                          onClick={() => handleCancelRegistration(event.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Cancelar registro"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="small"
                          className="flex-1"
                          onClick={() => handleRegister(event)}
                          disabled={isFull}
                        >
                          {isFull ? 'Evento Lleno' : 'Registrarse'}
                        </Button>
                        <button
                          onClick={() => shareEvent(event)}
                          className="text-accent hover:text-accent-dark"
                          title="Compartir"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.003 9.003 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
      
      {/* Registration Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Confirmar Registro"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <span className="text-6xl">{selectedEvent.image || getEventIcon(selectedEvent.type)}</span>
            </div>
            
            <h3 className="text-xl font-semibold text-text-primary text-center">
              {selectedEvent.title}
            </h3>
            
            <div className="space-y-3 py-4">
              <div className="flex justify-between">
                <span className="text-text-secondary">Fecha:</span>
                <span className="text-text-primary font-medium">
                  {formatDate(selectedEvent.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Hora:</span>
                <span className="text-text-primary font-medium">
                  {selectedEvent.time} ({selectedEvent.duration})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Instructor:</span>
                <span className="text-text-primary font-medium">
                  {selectedEvent.instructor}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Plataforma:</span>
                <span className="text-text-primary font-medium">
                  {selectedEvent.platform || selectedEvent.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Precio:</span>
                <span className="text-accent font-bold text-lg">
                  {selectedEvent.price === 0 ? 'GRATIS' : `$${selectedEvent.price}`}
                </span>
              </div>
            </div>
            
            {selectedEvent.benefits && (
              <div className="bg-surface rounded-lg p-4">
                <h4 className="font-semibold text-text-primary mb-2">
                  ¿Qué incluye?
                </h4>
                <ul className="space-y-1">
                  {selectedEvent.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <p className="text-sm text-accent">
                ⚡ Recibirás un email de confirmación con los detalles de acceso
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowRegisterModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmRegistration}
                className="flex-1"
              >
                Confirmar Registro
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default EventsPage