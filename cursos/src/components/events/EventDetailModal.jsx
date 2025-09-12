import { useState } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import { eventService } from '../../services/eventService'

const EventDetailModal = ({ event, onClose, onSuccess }) => {
  const { isAuthenticated, user } = useAuthStore()
  const { showToast } = useUIStore()
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegister = async () => {
    if (!isAuthenticated) {
      showToast('Debes iniciar sesión para inscribirte', 'info')
      return
    }

    setIsRegistering(true)
    console.log('🎟️ Iniciando inscripción gratuita al evento:', event.title)

    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Guardar inscripción en localStorage
      const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]')
      
      // Verificar si ya está inscrito
      const existingRegistration = registrations.find(r => 
        r.eventId === event.id && r.userId === user.id
      )

      if (!existingRegistration) {
        const newRegistration = {
          id: `reg_${Date.now()}`,
          eventId: event.id,
          userId: user.id,
          registeredAt: new Date().toISOString(),
          status: 'confirmed'
        }
        registrations.push(newRegistration)
        localStorage.setItem('event_registrations', JSON.stringify(registrations))
        console.log('✅ Inscripción guardada exitosamente')
      }

      showToast('¡Te has inscrito exitosamente al evento!', 'success')
      
      // Redirigir a la URL configurada del evento
      if (event.redirectUrl) {
        console.log('🔄 Redirigiendo a:', event.redirectUrl)
        window.open(event.redirectUrl, '_blank')
      }

      if (onSuccess) {
        onSuccess()
      }

      onClose()
    } catch (error) {
      console.error('❌ Error en inscripción al evento:', error)
      showToast('Error al inscribirse al evento', 'error')
    } finally {
      setIsRegistering(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Price badge */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-green-600 text-white px-4 py-2 rounded-full font-bold text-lg">
              GRATIS
            </span>
            {event.originalPrice && (
              <span className="ml-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm line-through">
                ${event.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and basic info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-accent text-background px-3 py-1 rounded-full text-sm font-medium capitalize">
                {event.type}
              </span>
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm capitalize">
                {event.area}
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">{event.title}</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{event.description}</p>
          </div>

          {/* Event details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span><strong>Fecha:</strong> {formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Hora:</strong> {event.time}</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span><strong>Duración:</strong> {event.duration}</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span><strong>Instructor:</strong> {event.instructor}</span>
              </div>

              {event.capacity && (
                <div className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span><strong>Cupos:</strong> {event.registered || 0}/{event.capacity}</span>
                </div>
              )}
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">📁 Recursos</h3>
              
              {event.pdfUrl && (
                <a
                  href={event.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>📄 Descargar Material PDF</span>
                </a>
              )}
              
              {event.youtubeUrl && (
                <a
                  href={event.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>🎥 Ver Video en YouTube</span>
                </a>
              )}
            </div>
          </div>

          {/* Benefits */}
          {event.benefits && event.benefits.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">🎁 Beneficios</h3>
              <ul className="space-y-2">
                {event.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg className="w-4 h-4 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Registration button */}
          <div className="flex justify-center pt-6 border-t border-gray-700">
            <button
              onClick={handleRegister}
              disabled={isRegistering || !isAuthenticated}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center space-x-3"
            >
              {isRegistering ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Inscribiendo...</span>
                </>
              ) : !isAuthenticated ? (
                <span>Inicia sesión para inscribirte</span>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>🎟️ Inscribirme GRATIS</span>
                </>
              )}
            </button>
          </div>

          {!isAuthenticated && (
            <p className="text-center text-gray-400 mt-3 text-sm">
              Necesitas iniciar sesión para inscribirte en eventos
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetailModal