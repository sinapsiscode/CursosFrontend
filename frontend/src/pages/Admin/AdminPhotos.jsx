import { useState, useEffect } from 'react'
import { useAdminStore, useUIStore } from '../../store'

const AdminPhotos = () => {
  const { 
    profilePhotos, 
    profileLinks, 
    profileButtons,
    advertisingConfig,
    addProfilePhoto, 
    updateProfilePhoto, 
    deleteProfilePhoto,
    updateProfileLinks,
    updateProfileButtons,
    updateAdvertisingConfig
  } = useAdminStore()
  const { showToast } = useUIStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [showButtonsModal, setShowButtonsModal] = useState(false)
  const [showAdvertisingModal, setShowAdvertisingModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    date: '',
    active: true
  })
  const [linksFormData, setLinksFormData] = useState({
    proUpgradeUrl: '',
    whatsappChannelUrl: ''
  })
  const [buttonsFormData, setButtonsFormData] = useState({
    showProButton: true,
    showWhatsAppButton: true,
    showBanner: true,
    proButtonText: 'Subir a Pro',
    whatsAppButtonText: 'Unirse al Canal de WhatsApp',
    bannerButtonText: 'Ver más'
  })
  const [advertisingFormData, setAdvertisingFormData] = useState({
    bannerTitle: '',
    bannerSubtitle: '',
    motivationalTitle: '',
    motivationalSubtitle: '',
    motivationalQuote: ''
  })

  useEffect(() => {
    loadProfilePhotos()
    loadProfileLinks()
    loadProfileButtons()
    loadAdvertisingConfig()
  }, [])

  const loadProfileLinks = () => {
    try {
      const storedLinks = JSON.parse(localStorage.getItem('profile_links') || '{}')
      if (Object.keys(storedLinks).length > 0) {
        useAdminStore.getState().updateProfileLinks(storedLinks)
        setLinksFormData({
          proUpgradeUrl: storedLinks.proUpgradeUrl || '',
          whatsappChannelUrl: storedLinks.whatsappChannelUrl || ''
        })
      } else {
        // Inicializar con enlaces de ejemplo
        const defaultLinks = {
          proUpgradeUrl: 'https://ejemplo.com/upgrade-pro',
          whatsappChannelUrl: 'https://chat.whatsapp.com/ejemplo123'
        }
        useAdminStore.getState().updateProfileLinks(defaultLinks)
        localStorage.setItem('profile_links', JSON.stringify(defaultLinks))
        setLinksFormData(defaultLinks)
        console.log('🔗 Enlaces de ejemplo inicializados')
      }
    } catch (error) {
      console.error('Error loading profile links from localStorage:', error)
    }
  }

  const loadProfileButtons = () => {
    try {
      const storedButtons = JSON.parse(localStorage.getItem('profile_buttons') || '{}')
      if (Object.keys(storedButtons).length > 0) {
        useAdminStore.getState().updateProfileButtons(storedButtons)
        setButtonsFormData({
          showProButton: storedButtons.showProButton !== false,
          showWhatsAppButton: storedButtons.showWhatsAppButton !== false,
          showBanner: storedButtons.showBanner !== false,
          proButtonText: storedButtons.proButtonText || 'Subir a Pro',
          whatsAppButtonText: storedButtons.whatsAppButtonText || 'Unirse al Canal de WhatsApp',
          bannerButtonText: storedButtons.bannerButtonText || 'Ver más'
        })
      } else {
        // Usar valores por defecto
        const defaultButtons = {
          showProButton: true,
          showWhatsAppButton: true,
          showBanner: true,
          proButtonText: 'Subir a Pro',
          whatsAppButtonText: 'Unirse al Canal de WhatsApp',
          bannerButtonText: 'Ver más'
        }
        useAdminStore.getState().updateProfileButtons(defaultButtons)
        localStorage.setItem('profile_buttons', JSON.stringify(defaultButtons))
        setButtonsFormData(defaultButtons)
        console.log('🔘 Configuración de botones inicializada')
      }
    } catch (error) {
      console.error('Error loading profile buttons from localStorage:', error)
    }
  }

  const loadAdvertisingConfig = () => {
    try {
      const storedConfig = JSON.parse(localStorage.getItem('advertising_config') || '{}')
      if (Object.keys(storedConfig).length > 0) {
        useAdminStore.getState().updateAdvertisingConfig(storedConfig)
        setAdvertisingFormData({
          bannerTitle: storedConfig.bannerTitle || '',
          bannerSubtitle: storedConfig.bannerSubtitle || '',
          motivationalTitle: storedConfig.motivationalTitle || '',
          motivationalSubtitle: storedConfig.motivationalSubtitle || '',
          motivationalQuote: storedConfig.motivationalQuote || ''
        })
      } else {
        // Usar valores por defecto
        setAdvertisingFormData({
          bannerTitle: advertisingConfig?.bannerTitle || '¡Certifícate y potencia tu CV!',
          bannerSubtitle: advertisingConfig?.bannerSubtitle || 'Transforma tu carrera profesional con certificaciones oficiales que te destacarán en el mercado laboral',
          motivationalTitle: advertisingConfig?.motivationalTitle || '💼 Destaca en el mercado laboral',
          motivationalSubtitle: advertisingConfig?.motivationalSubtitle || 'Valida tus conocimientos con certificaciones oficiales reconocidas por la industria',
          motivationalQuote: advertisingConfig?.motivationalQuote || '"El conocimiento certificado es tu mejor inversión profesional"'
        })
      }
    } catch (error) {
      console.error('Error loading advertising config from localStorage:', error)
    }
  }

  const loadProfilePhotos = () => {
    // Las fotos ya están en el store, solo las cargaremos desde localStorage si es necesario
    try {
      const storedPhotos = JSON.parse(localStorage.getItem('profile_photos') || '[]')
      if (storedPhotos.length > 0 && profilePhotos.length === 0) {
        useAdminStore.getState().setProfilePhotos(storedPhotos)
      } else if (storedPhotos.length === 0 && profilePhotos.length === 0) {
        // Inicializar con fotos de muestra
        const samplePhotos = [
          {
            id: 1,
            title: "Laboratorio de Metalurgia",
            description: "Estudiantes trabajando en análisis de materiales en el laboratorio de metalurgia",
            imageUrl: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=800",
            date: "2024-01-15",
            active: true,
            createdAt: new Date("2024-01-15")
          },
          {
            id: 2,
            title: "Práctica de Campo - Minería",
            description: "Visita técnica a la mina para conocer los procesos de extracción",
            imageUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800",
            date: "2024-02-20",
            active: true,
            createdAt: new Date("2024-02-20")
          },
          {
            id: 3,
            title: "Investigación Geológica",
            description: "Estudiantes analizando muestras de rocas y minerales",
            imageUrl: "https://images.unsplash.com/photo-1463413547347-bd0c8dd6e25b?w=800",
            date: "2024-03-10",
            active: true,
            createdAt: new Date("2024-03-10")
          },
          {
            id: 4,
            title: "Graduación 2024",
            description: "Ceremonia de graduación de ingenieros en metalurgia, minería y geología",
            imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
            date: "2024-04-15",
            active: true,
            createdAt: new Date("2024-04-15")
          }
        ]
        useAdminStore.getState().setProfilePhotos(samplePhotos)
        localStorage.setItem('profile_photos', JSON.stringify(samplePhotos))
        console.log('📸 Fotos de muestra inicializadas')
      }
    } catch (error) {
      console.error('Error loading profile photos from localStorage:', error)
    }
  }

  const savePhotosToStorage = (photos) => {
    try {
      localStorage.setItem('profile_photos', JSON.stringify(photos))
    } catch (error) {
      console.error('Error saving profile photos to localStorage:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      date: '',
      active: true
    })
    setEditingPhoto(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      showToast('El título es obligatorio', 'error')
      return
    }
    
    if (!formData.imageUrl.trim()) {
      showToast('La URL de la imagen es obligatoria', 'error')
      return
    }

    try {
      if (editingPhoto) {
        // Actualizar foto existente
        updateProfilePhoto(editingPhoto.id, formData)
        const updatedPhotos = useAdminStore.getState().profilePhotos
        savePhotosToStorage(updatedPhotos)
        showToast('Foto actualizada exitosamente', 'success')
        console.log('📸 Foto actualizada:', formData.title)
      } else {
        // Agregar nueva foto
        addProfilePhoto(formData)
        const updatedPhotos = useAdminStore.getState().profilePhotos
        savePhotosToStorage(updatedPhotos)
        showToast('Foto agregada exitosamente', 'success')
        console.log('📸 Nueva foto agregada:', formData.title)
      }
      
      resetForm()
      setShowAddModal(false)
    } catch (error) {
      console.error('Error saving photo:', error)
      showToast('Error al guardar la foto', 'error')
    }
  }

  const handleEdit = (photo) => {
    setEditingPhoto(photo)
    setFormData({
      title: photo.title,
      description: photo.description || '',
      imageUrl: photo.imageUrl,
      date: photo.date || '',
      active: photo.active !== false
    })
    setShowAddModal(true)
  }

  const handleDelete = (photoId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta foto?')) {
      deleteProfilePhoto(photoId)
      const updatedPhotos = useAdminStore.getState().profilePhotos
      savePhotosToStorage(updatedPhotos)
      showToast('Foto eliminada exitosamente', 'success')
      console.log('🗑️ Foto eliminada con ID:', photoId)
    }
  }

  const togglePhotoStatus = (photo) => {
    updateProfilePhoto(photo.id, { active: !photo.active })
    const updatedPhotos = useAdminStore.getState().profilePhotos
    savePhotosToStorage(updatedPhotos)
    showToast(
      `Foto ${photo.active ? 'desactivada' : 'activada'} exitosamente`, 
      'success'
    )
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  const handleSaveLinks = (e) => {
    e.preventDefault()
    
    try {
      updateProfileLinks(linksFormData)
      localStorage.setItem('profile_links', JSON.stringify(linksFormData))
      showToast('Enlaces de perfil actualizados exitosamente', 'success')
      console.log('🔗 Enlaces de perfil actualizados:', linksFormData)
      setShowLinksModal(false)
    } catch (error) {
      console.error('Error saving profile links:', error)
      showToast('Error al guardar los enlaces', 'error')
    }
  }

  const handleSaveButtons = (e) => {
    e.preventDefault()
    
    try {
      updateProfileButtons(buttonsFormData)
      localStorage.setItem('profile_buttons', JSON.stringify(buttonsFormData))
      showToast('Configuración de botones actualizada exitosamente', 'success')
      console.log('🔘 Configuración de botones actualizada:', buttonsFormData)
      setShowButtonsModal(false)
    } catch (error) {
      console.error('Error saving profile buttons:', error)
      showToast('Error al guardar la configuración de botones', 'error')
    }
  }

  const handleOpenLinksModal = () => {
    setLinksFormData({
      proUpgradeUrl: profileLinks?.proUpgradeUrl || '',
      whatsappChannelUrl: profileLinks?.whatsappChannelUrl || ''
    })
    setShowLinksModal(true)
  }

  const handleOpenButtonsModal = () => {
    setButtonsFormData({
      showProButton: profileButtons?.showProButton !== false,
      showWhatsAppButton: profileButtons?.showWhatsAppButton !== false,
      showBanner: profileButtons?.showBanner !== false,
      proButtonText: profileButtons?.proButtonText || 'Subir a Pro',
      whatsAppButtonText: profileButtons?.whatsAppButtonText || 'Unirse al Canal de WhatsApp',
      bannerButtonText: profileButtons?.bannerButtonText || 'Ver más'
    })
    setShowButtonsModal(true)
  }

  const handleSaveAdvertising = (e) => {
    e.preventDefault()
    
    try {
      updateAdvertisingConfig(advertisingFormData)
      localStorage.setItem('advertising_config', JSON.stringify(advertisingFormData))
      showToast('Configuración publicitaria actualizada exitosamente', 'success')
      console.log('📢 Configuración publicitaria actualizada:', advertisingFormData)
      setShowAdvertisingModal(false)
    } catch (error) {
      console.error('Error saving advertising config:', error)
      showToast('Error al guardar la configuración publicitaria', 'error')
    }
  }

  const handleOpenAdvertisingModal = () => {
    setAdvertisingFormData({
      bannerTitle: advertisingConfig?.bannerTitle || '¡Certifícate y potencia tu CV!',
      bannerSubtitle: advertisingConfig?.bannerSubtitle || 'Transforma tu carrera profesional con certificaciones oficiales que te destacarán en el mercado laboral',
      motivationalTitle: advertisingConfig?.motivationalTitle || '💼 Destaca en el mercado laboral',
      motivationalSubtitle: advertisingConfig?.motivationalSubtitle || 'Valida tus conocimientos con certificaciones oficiales reconocidas por la industria',
      motivationalQuote: advertisingConfig?.motivationalQuote || '"El conocimiento certificado es tu mejor inversión profesional"'
    })
    setShowAdvertisingModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📸 Gestión de Fotos</h1>
          <p className="text-text-secondary mt-2">
            Administra las fotos que aparecen en el perfil de los estudiantes
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleOpenAdvertisingModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>Configurar Publicidad</span>
          </button>
          <button
            onClick={handleOpenLinksModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Configurar Enlaces</span>
          </button>
          <button
            onClick={handleOpenButtonsModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span>Configurar Botones</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-accent text-background px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar Foto</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-text-secondary text-sm">Total de Fotos</p>
              <p className="text-2xl font-bold text-white">{profilePhotos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-text-secondary text-sm">Fotos Activas</p>
              <p className="text-2xl font-bold text-white">
                {profilePhotos.filter(photo => photo.active !== false).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-text-secondary text-sm">Fotos Inactivas</p>
              <p className="text-2xl font-bold text-white">
                {profilePhotos.filter(photo => photo.active === false).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      {profilePhotos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profilePhotos.map((photo) => (
            <div key={photo.id} className="bg-surface rounded-xl overflow-hidden">
              {/* Image */}
              <div className="relative">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title}
                  className="w-full h-48 object-cover"
                />
                
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    photo.active !== false
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}>
                    {photo.active !== false ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                
                {/* Quick actions */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => togglePhotoStatus(photo)}
                    className={`p-2 rounded-full transition-colors ${
                      photo.active !== false
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    title={photo.active !== false ? 'Desactivar' : 'Activar'}
                  >
                    {photo.active !== false ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2">{photo.title}</h3>
                
                {photo.description && (
                  <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                    {photo.description}
                  </p>
                )}
                
                {photo.date && (
                  <p className="text-text-secondary text-xs mb-3">
                    📅 {new Date(photo.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                
                <div className="text-text-secondary text-xs mb-4">
                  Creada: {new Date(photo.createdAt).toLocaleDateString('es-ES')}
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(photo)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Editar</span>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface rounded-xl">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-white mb-2">No hay fotos configuradas</h3>
          <p className="text-text-secondary mb-6">
            Comienza agregando fotos que aparecerán en el perfil de los estudiantes
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-accent text-background px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Agregar primera foto
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">
                {editingPhoto ? 'Editar Foto' : 'Agregar Nueva Foto'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Ingresa el título de la foto"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Descripción opcional de la foto"
                  rows="3"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  URL de la Imagen *
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
                
                {/* Preview */}
                {formData.imageUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-text-secondary mb-2">Vista previa:</p>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Fecha (opcional)
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="active" className="text-white">
                  Foto activa (visible para estudiantes)
                </label>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-opacity-90 text-background py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingPhoto ? 'Actualizar' : 'Agregar'} Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Configuración de Enlaces */}
      {showLinksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">🔗 Configurar Enlaces del Perfil</h3>
              <button
                onClick={() => setShowLinksModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveLinks} className="p-6 space-y-6">
              {/* Pro Upgrade URL */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  👑 URL para Subir a Pro
                </label>
                <input
                  type="url"
                  value={linksFormData.proUpgradeUrl}
                  onChange={(e) => setLinksFormData({ ...linksFormData, proUpgradeUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://ejemplo.com/upgrade-pro"
                />
                <p className="text-xs text-gray-400 mt-1">
                  URL a la que serán redirigidos los estudiantes para actualizar a cuenta Pro. Deja vacío para ocultar el botón.
                </p>
              </div>

              {/* WhatsApp Channel URL */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  💬 URL del Canal de WhatsApp
                </label>
                <input
                  type="url"
                  value={linksFormData.whatsappChannelUrl}
                  onChange={(e) => setLinksFormData({ ...linksFormData, whatsappChannelUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://chat.whatsapp.com/abc123..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enlace del grupo/canal de WhatsApp al que se unirán los estudiantes. Deja vacío para ocultar el botón.
                </p>
              </div>

              {/* Preview Section */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Vista Previa:</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Preview Pro Button */}
                  {linksFormData.proUpgradeUrl && (
                    <div className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 opacity-75">
                      <span>👑</span>
                      <span>Subir a Pro</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  )}

                  {/* Preview WhatsApp Button */}
                  {linksFormData.whatsappChannelUrl && (
                    <div className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 opacity-75">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
                      </svg>
                      <span>Unirse al Canal</span>
                    </div>
                  )}
                </div>
                
                {!linksFormData.proUpgradeUrl && !linksFormData.whatsappChannelUrl && (
                  <p className="text-gray-400 text-sm italic text-center py-4">
                    Los botones aparecerán aquí cuando configures las URLs
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLinksModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-opacity-90 text-background py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Guardar Enlaces
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Configuración de Botones */}
      {showButtonsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">🔘 Configurar Botones del Perfil</h3>
              <button
                onClick={() => setShowButtonsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveButtons} className="p-6 space-y-6">
              {/* Visibilidad de Botones */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
                  <span className="text-white font-medium">👑 Botón Pro</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={buttonsFormData.showProButton}
                      onChange={(e) => setButtonsFormData({ ...buttonsFormData, showProButton: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
                  <span className="text-white font-medium">💬 Botón WhatsApp</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={buttonsFormData.showWhatsAppButton}
                      onChange={(e) => setButtonsFormData({ ...buttonsFormData, showWhatsAppButton: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
                  <span className="text-white font-medium">🎓 Banner</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={buttonsFormData.showBanner}
                      onChange={(e) => setButtonsFormData({ ...buttonsFormData, showBanner: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>

              {/* Textos de Botones */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    👑 Texto del Botón Pro
                  </label>
                  <input
                    type="text"
                    value={buttonsFormData.proButtonText}
                    onChange={(e) => setButtonsFormData({ ...buttonsFormData, proButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Subir a Pro"
                    disabled={!buttonsFormData.showProButton}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    💬 Texto del Botón WhatsApp
                  </label>
                  <input
                    type="text"
                    value={buttonsFormData.whatsAppButtonText}
                    onChange={(e) => setButtonsFormData({ ...buttonsFormData, whatsAppButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Unirse al Canal de WhatsApp"
                    disabled={!buttonsFormData.showWhatsAppButton}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    🎓 Texto del Botón del Banner
                  </label>
                  <input
                    type="text"
                    value={buttonsFormData.bannerButtonText}
                    onChange={(e) => setButtonsFormData({ ...buttonsFormData, bannerButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Ver más"
                    disabled={!buttonsFormData.showBanner}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowButtonsModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Configuración Publicitaria */}
      {showAdvertisingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">📢 Configurar Publicidad del Perfil</h3>
              <button
                onClick={() => setShowAdvertisingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAdvertising} className="p-6 space-y-8">
              {/* Banner Superior */}
              <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-4">
                <h4 className="text-lg font-bold text-white mb-4">🎯 Banner Promocional Superior</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={advertisingFormData.bannerTitle}
                      onChange={(e) => setAdvertisingFormData({ ...advertisingFormData, bannerTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="¡Certifícate y potencia tu CV!"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Subtítulo del Banner
                    </label>
                    <textarea
                      value={advertisingFormData.bannerSubtitle}
                      onChange={(e) => setAdvertisingFormData({ ...advertisingFormData, bannerSubtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Transforma tu carrera profesional con certificaciones oficiales..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Sección Motivacional */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-4">
                <h4 className="text-lg font-bold text-white mb-4">💼 Sección Motivacional Central</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Título Motivacional
                    </label>
                    <input
                      type="text"
                      value={advertisingFormData.motivationalTitle}
                      onChange={(e) => setAdvertisingFormData({ ...advertisingFormData, motivationalTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="💼 Destaca en el mercado laboral"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Subtítulo Motivacional
                    </label>
                    <textarea
                      value={advertisingFormData.motivationalSubtitle}
                      onChange={(e) => setAdvertisingFormData({ ...advertisingFormData, motivationalSubtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Valida tus conocimientos con certificaciones oficiales..."
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Frase Motivacional
                    </label>
                    <input
                      type="text"
                      value={advertisingFormData.motivationalQuote}
                      onChange={(e) => setAdvertisingFormData({ ...advertisingFormData, motivationalQuote: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="El conocimiento certificado es tu mejor inversión profesional"
                    />
                  </div>
                </div>
              </div>

              {/* Vista Previa */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-white font-bold mb-4">👀 Vista Previa</h4>
                
                {/* Preview Banner */}
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-lg p-4 mb-4 opacity-75">
                  <div className="text-center text-white">
                    <h5 className="text-lg font-bold mb-2">
                      🎓 {advertisingFormData.bannerTitle || 'Título del banner'} 🚀
                    </h5>
                    <p className="text-sm">
                      {advertisingFormData.bannerSubtitle || 'Subtítulo del banner aparecerá aquí'}
                    </p>
                  </div>
                </div>

                {/* Preview Motivacional */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg p-4 opacity-75">
                  <div className="text-center text-white">
                    <h5 className="text-lg font-bold mb-2">
                      {advertisingFormData.motivationalTitle || 'Título motivacional'}
                    </h5>
                    <p className="text-blue-200 text-sm mb-3">
                      {advertisingFormData.motivationalSubtitle || 'Subtítulo motivacional aparecerá aquí'}
                    </p>
                    <div className="text-green-400 text-sm italic">
                      {advertisingFormData.motivationalQuote || 'Frase motivacional aparecerá aquí'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvertisingModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPhotos