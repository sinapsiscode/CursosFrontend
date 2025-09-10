import { useState } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import { apiService } from '../../services/api'
import { whatsappService } from '../../services/whatsappService'

const RegisterModal = () => {
  const { login } = useAuthStore()
  const { closeModal, showToast, setLoading, isLoading } = useUIStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    selectedArea: 'metalurgia'
  })
  const [errors, setErrors] = useState({})

  const areas = {
    metalurgia: 'Metalurgia',
    mineria: 'Minería',
    geologia: 'Geología'
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading('global', true)
      
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        selectedArea: formData.selectedArea
      }
      
      const response = await apiService.register(userData)
      
      if (response.success) {
        login(response.user)
        closeModal('register')
        showToast(`¡Bienvenido ${response.user.name}! Tu cuenta ha sido creada exitosamente.`, 'success')
        
        // WhatsApp Lead Generation: Trigger cuando usuario se registra
        whatsappService.triggerUserRegistration({
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          selectedArea: response.user.selectedArea
        })
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          selectedArea: 'metalurgia'
        })
        setErrors({})
      } else {
        showToast(response.error || 'Error al crear la cuenta', 'error')
      }
    } catch (error) {
      console.error('Register error:', error)
      showToast('Error de conexión. Intenta nuevamente.', 'error')
    } finally {
      setLoading('global', false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleClose = () => {
    closeModal('register')
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      selectedArea: 'metalurgia'
    })
    setErrors({})
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-white">MetSel</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Crear Cuenta</h2>
          <p className="text-text-secondary">Únete y comienza tu aprendizaje profesional</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Tu nombre completo"
              disabled={isLoading('global')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="tu@email.com"
              disabled={isLoading('global')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              WhatsApp (Opcional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="+57 300 123 4567"
              disabled={isLoading('global')}
            />
            <p className="mt-1 text-xs text-text-secondary">
              📱 Para recibir ofertas y actualizaciones por WhatsApp
            </p>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Area Selection */}
          <div>
            <label htmlFor="selectedArea" className="block text-sm font-medium text-white mb-2">
              Área de interés
            </label>
            <select
              id="selectedArea"
              name="selectedArea"
              value={formData.selectedArea}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              disabled={isLoading('global')}
            >
              {Object.entries(areas).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                errors.password ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="••••••••"
              disabled={isLoading('global')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="••••••••"
              disabled={isLoading('global')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading('global')}
            className="w-full bg-accent text-background py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading('global') ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => {
                closeModal('register')
                setTimeout(() => {
                  useUIStore.getState().openModal('login')
                }, 100)
              }}
              className="text-accent hover:text-accent-light transition-colors font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal