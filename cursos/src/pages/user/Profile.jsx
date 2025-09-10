import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card, Input } from '../../components/ui'
import { validateEmail, validatePhone } from '../../utils/testUtils'

const Profile = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [gallery, setGallery] = useState([])
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    github: user?.github || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    courseUpdates: true,
    weeklyDigest: true,
    darkMode: true,
    language: 'es'
  })
  
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    loadGallery()
  }, [])
  
  const loadGallery = () => {
    // Simulated gallery data
    const photos = [
      {
        id: 1,
        url: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Certificado+React',
        thumbnail: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=React',
        title: 'Certificado React Avanzado',
        date: new Date('2024-01-15'),
        type: 'certificate',
        description: 'Completé el curso de React Avanzado con excelencia'
      },
      {
        id: 2,
        url: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Proyecto+Final',
        thumbnail: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=Proyecto',
        title: 'Proyecto Final - E-commerce',
        date: new Date('2024-02-20'),
        type: 'project',
        description: 'Mi proyecto final del curso Full Stack'
      },
      {
        id: 3,
        url: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Evento+Tech',
        thumbnail: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=Evento',
        title: 'Tech Conference 2024',
        date: new Date('2024-03-10'),
        type: 'event',
        description: 'Participación en la conferencia de tecnología'
      },
      {
        id: 4,
        url: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Hackathon',
        thumbnail: 'https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=Hackathon',
        title: 'Hackathon Winner',
        date: new Date('2024-03-25'),
        type: 'achievement',
        description: 'Primer lugar en el Hackathon de innovación'
      },
      {
        id: 5,
        url: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Workshop',
        thumbnail: 'https://via.placeholder.com/150x150/EF4444/FFFFFF?text=Workshop',
        title: 'Workshop de Machine Learning',
        date: new Date('2024-04-05'),
        type: 'event',
        description: 'Impartí un workshop sobre ML basics'
      },
      {
        id: 6,
        url: 'https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Diploma',
        thumbnail: 'https://via.placeholder.com/150x150/06B6D4/FFFFFF?text=Diploma',
        title: 'Diploma de Honor',
        date: new Date('2024-04-15'),
        type: 'certificate',
        description: 'Reconocimiento por excelencia académica'
      }
    ]
    setGallery(photos)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    if (!formData.name) newErrors.name = 'El nombre es requerido'
    if (!validateEmail(formData.email)) newErrors.email = 'Email inválido'
    if (formData.phone && !validatePhone(formData.phone)) newErrors.phone = 'Teléfono inválido'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateUser({ ...user, ...formData })
      showSuccess('Perfil actualizado exitosamente')
      setIsEditing(false)
    } catch (error) {
      showError('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Contraseña actual requerida'
    }
    if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres'
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccess('Contraseña actualizada exitosamente')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      showError('Error al actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccess('Preferencias actualizadas')
    } catch (error) {
      showError('Error al actualizar preferencias')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
      showSuccess('Cuenta eliminada (simulado)')
      navigate('/')
    }
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Simulate upload
      showSuccess('Avatar actualizado')
    }
  }
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Simulate photo upload
      const newPhoto = {
        id: gallery.length + 1,
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        title: file.name,
        date: new Date(),
        type: 'upload',
        description: 'Nueva foto subida'
      }
      setGallery([newPhoto, ...gallery])
      showSuccess('Foto agregada a tu galería')
    }
  }
  
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo)
    setShowPhotoModal(true)
  }
  
  const handleDeletePhoto = (photoId) => {
    if (window.confirm('¿Estás seguro de eliminar esta foto?')) {
      setGallery(gallery.filter(p => p.id !== photoId))
      showSuccess('Foto eliminada')
      setShowPhotoModal(false)
    }
  }
  
  const getPhotoTypeIcon = (type) => {
    const icons = {
      certificate: '🎓',
      project: '💻',
      event: '🎤',
      achievement: '🏆',
      upload: '📷'
    }
    return icons[type] || '📷'
  }
  
  const formatPhotoDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-accent hover:bg-accent-dark rounded-full p-2 cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{user?.name}</h1>
              <p className="text-text-secondary">{user?.email}</p>
              <p className="text-sm text-accent mt-1">💎 {user?.points || 0} puntos</p>
            </div>
          </div>
          
          {!isEditing && activeTab === 'personal' && (
            <Button onClick={() => setIsEditing(true)}>
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {['personal', 'security', 'preferences', 'gallery', 'danger'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab === 'personal' && 'Información Personal'}
              {tab === 'security' && 'Seguridad'}
              {tab === 'preferences' && 'Preferencias'}
              {tab === 'gallery' && 'Galería'}
              {tab === 'danger' && 'Zona Peligrosa'}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <Card className="p-6">
          <form onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                disabled={!isEditing}
                required
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                disabled={!isEditing}
                required
              />
              
              <Input
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                disabled={!isEditing}
                placeholder="+51 999 999 999"
              />
              
              <Input
                label="Ubicación"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={!isEditing}
                placeholder="Lima, Perú"
              />
              
              <Input
                label="Sitio web"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                placeholder="https://tusitio.com"
              />
              
              <Input
                label="LinkedIn"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                disabled={!isEditing}
                placeholder="linkedin.com/in/usuario"
              />
              
              <Input
                label="GitHub"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                disabled={!isEditing}
                placeholder="github.com/usuario"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Biografía
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>
            
            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      bio: user?.bio || '',
                      location: user?.location || '',
                      website: user?.website || '',
                      linkedin: user?.linkedin || '',
                      github: user?.github || ''
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            )}
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Cambiar Contraseña
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                type="password"
                label="Contraseña actual"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                error={errors.currentPassword}
                required
              />
              
              <Input
                type="password"
                label="Nueva contraseña"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                error={errors.newPassword}
                required
              />
              
              <Input
                type="password"
                label="Confirmar nueva contraseña"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                required
              />
              
              <Button type="submit" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Autenticación de Dos Factores
            </h3>
            <p className="text-text-secondary mb-4">
              Agrega una capa extra de seguridad a tu cuenta
            </p>
            <Button variant="secondary">
              Configurar 2FA
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Sesiones Activas
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">Chrome - Windows</p>
                  <p className="text-sm text-text-secondary">Lima, Perú • Sesión actual</p>
                </div>
                <span className="text-green-400 text-sm">Activo ahora</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'preferences' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">
            Preferencias de Notificación
          </h3>
          
          <div className="space-y-4">
            {Object.entries({
              emailNotifications: 'Notificaciones por email',
              smsNotifications: 'Notificaciones por SMS',
              marketingEmails: 'Emails de marketing',
              courseUpdates: 'Actualizaciones de cursos',
              weeklyDigest: 'Resumen semanal'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between">
                <span className="text-text-primary">{label}</span>
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                  className="w-5 h-5 text-accent bg-surface border-gray-600 rounded focus:ring-accent"
                />
              </label>
            ))}
          </div>

          <hr className="my-6 border-gray-700" />

          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Preferencias de Interfaz
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Idioma
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
            
            <label className="flex items-center justify-between">
              <span className="text-text-primary">Modo oscuro</span>
              <input
                type="checkbox"
                checked={preferences.darkMode}
                onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                className="w-5 h-5 text-accent bg-surface border-gray-600 rounded focus:ring-accent"
              />
            </label>
          </div>
          
          <div className="mt-6">
            <Button onClick={handlePreferencesUpdate} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Preferencias'}
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'gallery' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Mi Galería de Fotos
            </h3>
            <label className="cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoUpload}
                multiple
              />
              <Button variant="primary" size="small">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Subir Fotos
              </Button>
            </label>
          </div>
          
          {gallery.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-text-secondary mb-2">No tienes fotos en tu galería</p>
              <p className="text-sm text-text-secondary">Sube tus fotos de certificados, eventos o momentos especiales</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map(photo => (
                <div 
                  key={photo.id} 
                  className="relative group cursor-pointer rounded-lg overflow-hidden bg-surface-light aspect-square"
                  onClick={() => handlePhotoClick(photo)}
                >
                  <img 
                    src={photo.thumbnail} 
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                      <p className="text-gray-300 text-xs">{formatDate(photo.date)}</p>
                    </div>
                    <button
                      onClick={(e) => handlePhotoDelete(photo.id, e)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {photo.type && (
                    <div className="absolute top-2 left-2">
                      {getPhotoTypeIcon(photo.type)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>{gallery.length} foto{gallery.length !== 1 ? 's' : ''} en total</span>
              <span>Espacio usado: {(gallery.length * 0.5).toFixed(1)} MB de 50 MB</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${(gallery.length * 0.5 / 50) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'danger' && (
        <Card className="p-6 border-2 border-red-500/30">
          <h3 className="text-lg font-semibold text-red-400 mb-4">
            Zona Peligrosa
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-text-primary mb-2">
                Exportar Datos
              </h4>
              <p className="text-text-secondary text-sm mb-3">
                Descarga todos tus datos en formato JSON
              </p>
              <Button variant="secondary" size="small">
                Exportar Datos
              </Button>
            </div>
            
            <hr className="border-gray-700" />
            
            <div>
              <h4 className="font-medium text-text-primary mb-2">
                Desactivar Cuenta
              </h4>
              <p className="text-text-secondary text-sm mb-3">
                Tu cuenta será desactivada temporalmente. Podrás reactivarla cuando quieras.
              </p>
              <Button variant="secondary" size="small" className="border-yellow-500/30 text-yellow-400">
                Desactivar Cuenta
              </Button>
            </div>
            
            <hr className="border-gray-700" />
            
            <div>
              <h4 className="font-medium text-text-primary mb-2">
                Eliminar Cuenta
              </h4>
              <p className="text-text-secondary text-sm mb-3">
                Esta acción es permanente y no se puede deshacer. Todos tus datos serán eliminados.
              </p>
              <Button 
                variant="secondary" 
                size="small" 
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={handleDeleteAccount}
              >
                Eliminar Cuenta Permanentemente
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Modal de Foto */}
      {showPhotoModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setShowPhotoModal(false)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-surface rounded-lg overflow-hidden">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              
              <div className="p-4 bg-surface-light">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{selectedPhoto.title}</h3>
                    <p className="text-text-secondary text-sm mt-1">{selectedPhoto.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(selectedPhoto.date)}
                      </span>
                      {selectedPhoto.type && (
                        <span className="flex items-center gap-1">
                          {getPhotoTypeIcon(selectedPhoto.type)}
                          <span className="capitalize">{selectedPhoto.type}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-text-secondary hover:text-accent transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button className="p-2 text-text-secondary hover:text-accent transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handlePhotoDelete(selectedPhoto.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile