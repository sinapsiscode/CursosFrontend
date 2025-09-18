import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventService } from '../services/eventService'
import { useAuthStore, useUIStore } from '../store'
import { LoadingSpinner } from '../components/common'
import SimpleEventDemo from '../components/events/SimpleEventDemo'
import EventRegistrationModal from '../components/events/EventRegistrationModal'
import EventDetailModal from '../components/events/EventDetailModal'

const Events = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, selectedArea } = useAuthStore()
  const { showToast, openModal } = useUIStore()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, webinars, promotions, relevant
  const [areaFilter, setAreaFilter] = useState('all')
  const [registering, setRegistering] = useState(null)
  const [showSimulator, setShowSimulator] = useState(false)
  const [selectedEventForSimulation, setSelectedEventForSimulation] = useState(null)
  const [demoMode, setDemoMode] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [filter, areaFilter])

  const loadEvents = () => {
    setLoading(true)
    
    let eventsToShow = []
    
    if (filter === 'relevant' && isAuthenticated) {
      eventsToShow = eventService.getRelevantEvents()
    } else {
      eventsToShow = eventService.getAllActiveEvents()
      
      // Filtrar por tipo
      if (filter === 'webinars') {
        eventsToShow = eventsToShow.filter(e => e.type === 'webinar' || e.type === 'masterclass')
      } else if (filter === 'promotions') {
        eventsToShow = eventsToShow.filter(e => e.type === 'promotion' || e.type === 'bundle')
      }
    }

    // Filtrar por área
    if (areaFilter !== 'all') {
      eventsToShow = eventsToShow.filter(e => e.area === areaFilter)
    }

    setEvents(eventsToShow)
    setLoading(false)
  }

  const handleEventRegister = async (event) => {
    // Abrir modal de registro
    setSelectedEventForRegistration(event)
    setShowRegistrationModal(true)
  }

  const handleRegistrationSuccess = () => {
    setShowRegistrationModal(false)
    setSelectedEventForRegistration(null)
    loadEvents() // Recargar para actualizar contador
  }

  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    if (diffDays < 0) return 'Evento pasado'
    return `En ${diffDays} días`
  }

  const areaColors = {
    metalurgia: 'from-orange-500 to-red-500',
    mineria: 'from-blue-500 to-purple-500',
    geologia: 'from-green-500 to-teal-500'
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Eventos y Promociones</h1>
              <p className="text-gray-400">
                Descubre webinars, masterclasses y ofertas especiales
                {isAuthenticated && ' personalizadas para ti'}
              </p>
            </div>
            {/* Botón de Modo Demo */}
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                demoMode 
                  ? 'bg-purple-600 text-white animate-pulse' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {demoMode ? '🎮 Modo Demo Activo' : '🎮 Activar Modo Demo'}
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-surface rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tipo de evento
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Todos' },
                  { value: 'webinars', label: 'Webinars' },
                  { value: 'promotions', label: 'Promociones' },
                  isAuthenticated && { value: 'relevant', label: 'Para Ti 🎯' }
                ].filter(Boolean).map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === option.value
                        ? 'bg-accent text-background'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por área */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Área de interés
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Todas' },
                  { value: 'metalurgia', label: 'Metalurgia' },
                  { value: 'mineria', label: 'Minería' },
                  { value: 'geologia', label: 'Geología' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setAreaFilter(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      areaFilter === option.value
                        ? 'bg-accent text-background'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Indicador de personalización */}
          {filter === 'relevant' && events.length > 0 && (
            <div className="mt-4 p-3 bg-purple-600/20 border border-purple-500/50 rounded-lg">
              <p className="text-sm text-purple-300">
                🎯 Estos eventos están seleccionados especialmente para ti basados en tu actividad
              </p>
            </div>
          )}
        </div>

        {/* Lista de eventos */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay eventos disponibles con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div
                key={event.id}
                className="bg-surface rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Imagen del evento */}
                {event.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Badge de tipo */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.type === 'webinar' ? 'bg-blue-600 text-white' :
                        event.type === 'masterclass' ? 'bg-purple-600 text-white' :
                        event.type === 'promotion' ? 'bg-green-600 text-white' :
                        'bg-orange-600 text-white'
                      }`}>
                        {event.type === 'webinar' ? '📹 Webinar' :
                         event.type === 'masterclass' ? '🎓 Masterclass' :
                         event.type === 'promotion' ? '🎁 Promoción' :
                         '📦 Bundle'}
                      </span>
                    </div>
                    {/* Área gradient */}
                    {event.area && (
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${areaColors[event.area]}`} />
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Título y descripción */}
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{event.description}</p>

                  {/* Detalles del evento */}
                  {(event.type === 'webinar' || event.type === 'masterclass') && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <svg className="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatEventDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <svg className="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time} ({event.duration})
                      </div>
                      {event.instructor && (
                        <div className="flex items-center text-sm text-gray-300">
                          <svg className="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {event.instructor}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Detalles de promoción */}
                  {event.type === 'promotion' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl font-bold text-green-400">-{event.discount}%</span>
                        <span className="text-sm text-gray-400">
                          Código: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{event.promoCode}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Válido hasta: {new Date(event.endDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}

                  {/* Bundle details */}
                  {event.type === 'bundle' && (
                    <div className="mb-4">
                      <div className="bg-gray-700/50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-300 mb-2">Este pack incluye:</p>
                        <ul className="space-y-1">
                          {event.courses.map((course, idx) => (
                            <li key={idx} className="text-xs text-gray-400">• {course.title}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-white">GRATIS</span>
                        </div>
                        <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          Evento gratuito
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Beneficios */}
                  {event.benefits && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-400 mb-2">Incluye:</p>
                      <ul className="space-y-1">
                        {event.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-start">
                            <span className="text-green-400 mr-1">✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footer con capacidad y botón */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    {/* Capacidad para eventos */}
                    {event.capacity && (
                      <div className="text-sm">
                        <p className="text-gray-400">
                          {event.registered}/{event.capacity} registrados
                        </p>
                        <div className="w-24 bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Precio y botón */}
                    <div className={`${!event.capacity ? 'w-full' : ''} text-right`}>
                      <p className="text-lg font-bold text-white mb-2">
                        GRATIS
                      </p>
                      
                      {(event.type === 'webinar' || event.type === 'masterclass') ? (
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedEventForDetail(event)
                              setShowEventDetail(true)
                            }}
                            className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            📋 Ver detalles
                          </button>
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                navigate('/login')
                                return
                              }
                              setSelectedEventForDetail(event)
                              setShowEventDetail(true)
                            }}
                            disabled={event.capacity && event.registered >= event.capacity}
                            className={`flex-1 min-w-[140px] px-4 py-2 rounded-lg font-medium transition-colors ${
                              event.capacity && event.registered >= event.capacity
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                            title={!isAuthenticated ? 'Inicia sesión para inscribirte' : ''}
                          >
                            {event.capacity && event.registered >= event.capacity 
                              ? '🚫 Lleno' 
                              : !isAuthenticated 
                                ? '🔒 Iniciar Sesión para Inscribirme'
                                : '🎟️ Inscribirme GRATIS'
                            }
                          </button>
                          {demoMode && (
                            <button
                              onClick={() => {
                                setSelectedEventForSimulation(event)
                                setShowSimulator(true)
                              }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                              title="Simular notificaciones del evento"
                            >
                              🎮
                            </button>
                          )}
                        </div>
                      ) : event.type === 'promotion' ? (
                        <button
                          onClick={() => navigate('/courses')}
                          className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90"
                        >
                          Ver Cursos
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/bundle/${event.id}`)}
                          className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90"
                        >
                          Obtener Pack
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Indicador de tiempo */}
                  {event.date && (
                    <div className="mt-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        getDaysUntilEvent(event.date) === 'Hoy' ? 'bg-red-600/20 text-red-400' :
                        getDaysUntilEvent(event.date) === 'Mañana' ? 'bg-orange-600/20 text-orange-400' :
                        'bg-blue-600/20 text-blue-400'
                      }`}>
                        {getDaysUntilEvent(event.date)}
                      </span>
                    </div>
                  )}

                  {/* Score de relevancia (solo en modo relevante) */}
                  {filter === 'relevant' && event.relevanceScore && (
                    <div className="mt-3 text-center">
                      <span className="text-xs text-purple-400">
                        Relevancia: {Math.round(event.relevanceScore)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Mensaje de Modo Demo */}
        {demoMode && (
          <div className="mt-6 p-4 bg-purple-600/20 border border-purple-500 rounded-lg">
            <p className="text-purple-300 text-center">
              <strong>🎮 Modo Demo Activo:</strong> Haz clic en el botón morado (🎮) en cualquier evento para simular las notificaciones
            </p>
          </div>
        )}
      </div>
      
      {/* Simulador de Eventos */}
      {showSimulator && selectedEventForSimulation && (
        <SimpleEventDemo 
          event={selectedEventForSimulation}
          onClose={() => {
            setShowSimulator(false)
            setSelectedEventForSimulation(null)
          }}
        />
      )}
      
      {/* Modal de Registro */}
      {showRegistrationModal && selectedEventForRegistration && (
        <EventRegistrationModal
          event={selectedEventForRegistration}
          onClose={() => {
            setShowRegistrationModal(false)
            setSelectedEventForRegistration(null)
          }}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {/* Modal de Detalles del Evento */}
      {showEventDetail && selectedEventForDetail && (
        <EventDetailModal
          event={selectedEventForDetail}
          onClose={() => {
            setShowEventDetail(false)
            setSelectedEventForDetail(null)
          }}
          onSuccess={() => {
            console.log('✅ Inscripción exitosa al evento:', selectedEventForDetail.title)
            setShowEventDetail(false)
            setSelectedEventForDetail(null)
            // Recargar eventos para actualizar contador de registrados
            loadEvents()
          }}
        />
      )}
    </div>
  )
}

export default Events