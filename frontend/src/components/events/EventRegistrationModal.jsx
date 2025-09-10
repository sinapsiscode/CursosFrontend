import { useState } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import { eventService } from '../../services/eventService'

const EventRegistrationModal = ({ event, onClose, onSuccess }) => {
  const { isAuthenticated, user } = useAuthStore()
  const { showToast } = useUIStore()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: isAuthenticated ? user?.email || '' : '',
    phone: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio'
    } else if (!/^\d{9,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ingresa un teléfono válido (mínimo 9 dígitos)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        userId: isAuthenticated ? user?.id : null,
        registeredAt: new Date().toISOString()
      }
      
      const result = await eventService.registerForEvent(event.id, registrationData)
      
      if (result.success) {
        showToast('¡Te has registrado exitosamente!', 'success')
        onSuccess()
        onClose()
      } else {
        showToast(result.error || 'Error al registrarse', 'error')
      }
    } catch (error) {
      showToast('Error al procesar el registro', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-2">Inscríbete Gratis</h2>
          <p className="text-white/90 text-sm">{event.title}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombres
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.firstName ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ingresa tus nombres"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Apellidos
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.lastName ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ingresa tus apellidos"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={isAuthenticated}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } ${isAuthenticated ? 'opacity-75 cursor-not-allowed' : ''}`}
              placeholder="tu@correo.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              N° teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="999 999 999"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Información del evento */}
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center text-sm text-gray-300">
              <svg className="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(event.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
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

          {/* Nota de privacidad */}
          <p className="text-xs text-gray-400 text-center">
            Al inscribirte, aceptas recibir notificaciones sobre este evento
          </p>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registrando...' : 'Inscribirse Gratis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventRegistrationModal