import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usuariosService } from '../services/usuariosService'
import { LoadingSpinner } from '../components/common'

const ProfileSettings = () => {
  const { usuario, isAuthenticated, updateUser, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    avatar: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (usuario) {
      console.log('👤 Usuario cargado en ProfileSettings:', {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        avatar: usuario.avatar
      })

      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        avatar: usuario.avatar || ''
      })
    }
  }, [usuario, isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.telefono && !/^\+?[0-9]{9,15}$/.test(formData.telefono.replace(/[\s-]/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (9-15 dígitos)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordChange = () => {
    const newErrors = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Ingresa tu contraseña actual'
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Ingresa una nueva contraseña'
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)
    try {
      const updatedData = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        avatar: formData.avatar
      }

      console.log('📤 Actualizando usuario ID:', usuario.id, 'con datos:', updatedData)

      const response = await usuariosService.update(usuario.id, updatedData)
      console.log('📥 Respuesta del servidor completa:', response)

      // El backend envuelve con { success: true, data: {...usuario actualizado}, ... }
      // usuariosService.update ya hace response.data, así que response es el objeto envuelto
      let userData

      if (response.success && response.data) {
        // Backend envuelve la respuesta
        userData = response.data
      } else {
        // Respuesta directa
        userData = response
      }

      console.log('👤 Datos de usuario extraídos:', userData)

      // Actualizar usuario en el contexto local (esto actualiza localStorage)
      updateUser(userData)

      // Refrescar desde localStorage
      setTimeout(() => {
        refreshUser()
      }, 100)

      // También actualizar el formData local para que se muestre inmediatamente
      setFormData({
        nombre: userData.nombre || '',
        email: userData.email || '',
        telefono: userData.telefono || '',
        avatar: userData.avatar || ''
      })

      alert('✅ Perfil actualizado exitosamente')
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error)
      alert('Error al actualizar perfil: ' + (error.message || 'Error desconocido'))
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validatePasswordChange()) return

    // Verificar contraseña actual
    if (passwordData.currentPassword !== usuario.password) {
      setErrors({ currentPassword: 'Contraseña actual incorrecta' })
      return
    }

    setSaving(true)
    try {
      console.log('🔐 Cambiando contraseña para usuario ID:', usuario.id)

      await usuariosService.update(usuario.id, {
        password: passwordData.newPassword
      })

      console.log('✅ Contraseña actualizada en backend')

      alert('✅ Contraseña actualizada exitosamente')

      // Limpiar formulario de contraseña
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error)
      alert('Error al cambiar contraseña: ' + (error.message || 'Error desconocido'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-accent hover:text-accent/80 mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-white">Configuración del Perfil</h1>
          <p className="text-secondary mt-2">Administra tu información personal y seguridad</p>
        </div>

        {/* Tabs */}
        <div className="bg-surface rounded-lg mb-6">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-secondary hover:text-white'
              }`}
            >
              Información Personal
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'security'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-secondary hover:text-white'
              }`}
            >
              Seguridad
            </button>
          </div>
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="bg-surface rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Información Personal</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Preview */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.nombre)
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                      👤
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{formData.nombre}</p>
                  <p className="text-secondary text-sm">{formData.email}</p>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  placeholder="Tu nombre completo"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  placeholder="+52 123 456 7890"
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                )}
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  URL del Avatar (opcional)
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  placeholder="https://ejemplo.com/avatar.jpg"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Ingresa la URL de una imagen para tu avatar
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-background border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-surface rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Cambiar Contraseña</h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              {/* Contraseña Actual */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  placeholder="••••••••"
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  placeholder="••••••••"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                    setErrors({})
                  }}
                  className="px-6 py-3 bg-background border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileSettings
