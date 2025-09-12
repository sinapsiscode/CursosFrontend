import { useState } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import { authApi } from '../../services/api'
import { mockUsers } from '../../services/mockData'
import config from '../../config/env'

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuthStore()
  const { showToast, setLoading, isLoading } = useUIStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
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
      
      const response = await authApi.login(formData.email, formData.password)
      
      if (response.success) {
        login(response.user)
        onClose()
        showToast(`¡Bienvenido ${response.user.name}!`, 'success')
        
        setFormData({ email: '', password: '' })
        setErrors({})
      } else {
        showToast(response.error || 'Error al iniciar sesión', 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      if (config.DEV_MODE) {
        const mockUser = mockUsers.find(u => u.email === formData.email)
        if (mockUser && formData.password === '123456') {
          login(mockUser)
          onClose()
          showToast(`¡Bienvenido ${mockUser.name}! (Modo desarrollo)`, 'success')
          setFormData({ email: '', password: '' })
          setErrors({})
          return
        }
      }
      
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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({ email: '', password: '' })
    setErrors({})
  }

  const handleQuickLogin = async (userEmail) => {
    setFormData({
      email: userEmail,
      password: '123456'
    })
    
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} })
    }, 100)
  }

  const getUserRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-600 hover:bg-red-700'
      case 'user':
        return 'bg-blue-600 hover:bg-blue-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  const getUserRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'user':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getAreaColor = (area) => {
    switch (area) {
      case 'metalurgia':
        return 'text-orange-400'
      case 'mineria':
        return 'text-yellow-400'
      case 'geologia':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-white">MetSel</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Iniciar Sesión</h2>
          <p className="text-text-secondary">Accede a tu cuenta para continuar aprendiendo</p>
        </div>

        {config.DEV_MODE && mockUsers && mockUsers.length > 0 && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white mb-3 text-center">Acceso rápido (Modo desarrollo):</h3>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user.email)}
                    disabled={isLoading('global')}
                    className={`w-full ${getUserRoleColor(user.role)} text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white border-opacity-20"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`
                      }}
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.name}</span>
                        <div className="flex items-center space-x-1">
                          {getUserRoleIcon(user.role)}
                          <span className="text-xs opacity-80 capitalize">{user.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs opacity-70">
                        <span className={getAreaColor(user.selectedArea)}>
                          {user.selectedArea?.charAt(0).toUpperCase() + user.selectedArea?.slice(1) || 'Sin área'}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{user.subscription?.type || 'free'}</span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <hr className="flex-1 border-gray-600" />
              <span className="px-4 text-text-secondary text-sm">o inicia sesión manualmente</span>
              <hr className="flex-1 border-gray-600" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
              />
              <span className="ml-2 text-sm text-text-secondary">Recordarme</span>
            </label>
            <button
              type="button"
              className="text-sm text-accent hover:text-accent-light transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

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
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => {
                handleClose()
                setTimeout(() => {
                  useUIStore.getState().openModal('register')
                }, 100)
              }}
              className="text-accent hover:text-accent-light transition-colors font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

        {config.DEV_MODE && (
          <div className="mt-6 p-4 bg-background rounded-lg">
            <h4 className="text-sm font-medium text-white mb-3">Información de usuarios demo:</h4>
            <div className="space-y-2">
              {mockUsers?.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-3 text-xs">
                  <div className={`w-3 h-3 rounded-full ${user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  <div className="flex-1">
                    <span className="text-white font-medium">{user.name}</span>
                    <span className="text-text-secondary ml-2">({user.email})</span>
                  </div>
                  <span className={`${getAreaColor(user.selectedArea)} font-medium`}>
                    {user.selectedArea?.charAt(0).toUpperCase() + user.selectedArea?.slice(1) || 'Sin área'}
                  </span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-600">
                <p className="text-text-secondary text-xs">
                  <strong>Contraseña para todos:</strong> 123456
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginModal