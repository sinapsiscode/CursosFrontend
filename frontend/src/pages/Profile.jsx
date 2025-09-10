import { useState, useEffect } from 'react'
import { useAuthStore, useAdminStore } from '../store'
import { LoadingSpinner } from '../components/common'
import { apiService } from '../services/api'

const Profile = () => {
  const { user, isAuthenticated, selectedArea } = useAuthStore()
  const { profilePhotos, profileLinks, profileButtons, advertisingConfig } = useAdminStore()
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const areaColors = {
    metalurgia: {
      bg: 'bg-primary-metalurgia',
      text: 'text-primary-metalurgia',
      gradient: 'from-primary-metalurgia to-red-600'
    },
    mineria: {
      bg: 'bg-primary-mineria',
      text: 'text-primary-mineria',
      gradient: 'from-primary-mineria to-teal-600'
    },
    geologia: {
      bg: 'bg-primary-geologia',
      text: 'text-primary-geologia',
      gradient: 'from-primary-geologia to-blue-600'
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadProfilePhotos()
    }
  }, [isAuthenticated])

  // Efecto adicional para asegurar que los enlaces se carguen
  useEffect(() => {
    const loadLinks = () => {
      try {
        const storedLinks = JSON.parse(localStorage.getItem('profile_links') || '{}')
        if (Object.keys(storedLinks).length > 0) {
          useAdminStore.getState().updateProfileLinks(storedLinks)
          console.log('🔗 Enlaces cargados en Profile:', storedLinks)
        }
      } catch (error) {
        console.error('Error loading profile links:', error)
      }
    }
    loadLinks()
  }, [])

  const loadProfilePhotos = async () => {
    try {
      setLoading(true)
      // Las fotos se cargan desde adminStore
      console.log('📸 Cargando fotos del perfil configuradas por admin')
      
      // Cargar fotos desde localStorage si no están en el store
      const { profilePhotos, setProfilePhotos, profileLinks, setProfileLinks } = useAdminStore.getState()
      
      if (!profilePhotos || profilePhotos.length === 0) {
        try {
          const storedPhotos = JSON.parse(localStorage.getItem('profile_photos') || '[]')
          if (storedPhotos.length > 0) {
            setProfilePhotos(storedPhotos)
            console.log('📸 Fotos cargadas desde localStorage:', storedPhotos.length)
          }
        } catch (storageError) {
          console.error('Error loading photos from localStorage:', storageError)
        }
      }
      
      // Cargar links del perfil desde localStorage
      try {
        const storedLinks = JSON.parse(localStorage.getItem('profile_links') || '{}')
        if (Object.keys(storedLinks).length > 0) {
          setProfileLinks({ ...profileLinks, ...storedLinks })
          console.log('🔗 Links del perfil cargados desde localStorage')
        }
      } catch (storageError) {
        console.error('Error loading profile links from localStorage:', storageError)
      }

      // Cargar configuración de botones desde localStorage
      try {
        const storedButtons = JSON.parse(localStorage.getItem('profile_buttons') || '{}')
        if (Object.keys(storedButtons).length > 0) {
          useAdminStore.getState().updateProfileButtons(storedButtons)
          console.log('🔘 Configuración de botones cargada desde localStorage')
        }
      } catch (storageError) {
        console.error('Error loading profile buttons from localStorage:', storageError)
      }
    } catch (error) {
      console.error('Error loading profile photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Inicia sesión para ver tu perfil</h2>
          <button className="bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90">
            Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const colors = selectedArea ? areaColors[selectedArea] : areaColors.metalurgia

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header del perfil */}
        <div className="bg-surface rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                alt={user?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-accent"
              />
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                📸
              </div>
            </div>

            {/* Info del usuario */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.name || 'Usuario'}
              </h1>
              <p className="text-text-secondary mb-4">
                {user?.email || 'email@ejemplo.com'}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <div className={`${colors.bg} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                  {selectedArea?.charAt(0).toUpperCase() + selectedArea?.slice(1)}
                </div>
                
                {/* Botón Subir a Pro - condicional */}
                {profileButtons?.showProButton !== false && (
                  <button
                    onClick={() => {
                      const url = profileLinks?.proUpgradeUrl || 'https://ejemplo.com/upgrade-pro'
                      window.open(url, '_blank')
                      console.log('🔗 Abriendo Pro URL desde header:', url)
                    }}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                  >
                    <span>👑</span>
                    <span>{profileButtons?.proButtonText || 'Subir a Pro'}</span>
                  </button>
                )}
                
                {/* Otros tipos de suscripción que no sean expert */}
                {user?.subscription?.type && user.subscription.type.toLowerCase() !== 'expert' && (
                  <div className="bg-accent text-background px-4 py-2 rounded-full text-sm font-bold">
                    {user.subscription.type.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Información básica */}
              <div className="text-center md:text-left">
                <div className={`${colors.bg} text-white px-4 py-2 rounded-full text-sm font-medium inline-block`}>
                  Área de {selectedArea?.charAt(0).toUpperCase() + selectedArea?.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Minimalista - condicional */}
        {profileButtons?.showBanner !== false && (
          <div className="bg-surface border border-gray-600 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-accent">🎓</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {advertisingConfig?.bannerTitle || '¡Certifícate y potencia tu CV!'}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Valida tus conocimientos profesionalmente
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  console.log('🎓 Navegando a certificaciones')
                }}
                className="bg-accent text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
              >
                {profileButtons?.bannerButtonText || 'Ver más'}
              </button>
            </div>
          </div>
        )}

        {/* Botón WhatsApp - condicional */}
        {profileButtons?.showWhatsAppButton !== false && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => {
                const url = profileLinks?.whatsappChannelUrl || 'https://chat.whatsapp.com/ejemplo123'
                window.open(url, '_blank')
                console.log('🔗 Abriendo WhatsApp URL:', url)
              }}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
              </svg>
              <span className="text-lg">{profileButtons?.whatsAppButtonText || 'Unirse al Canal de WhatsApp'}</span>
            </button>
          </div>
        )}


        {/* Galería de Fotos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">📸 Galería</h2>
          
          {profilePhotos && profilePhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {profilePhotos.map((photo, index) => (
                <div 
                  key={index} 
                  className="group relative bg-surface rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => openPhotoModal(photo)}
                >
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white">
                      <div className="mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">Ver detalles</p>
                    </div>
                  </div>
                  
                  {/* Overlay con información */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white font-semibold text-sm mb-1">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-gray-300 text-xs line-clamp-2">{photo.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-xl">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-white mb-2">No hay fotos configuradas</h3>
              <p className="text-text-secondary mb-6">
                El administrador aún no ha configurado fotos para mostrar en esta sección.
              </p>
            </div>
          )}
        </div>
        
        {/* Modal para ver foto en detalle */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={closePhotoModal}>
            <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Header del modal */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">{selectedPhoto.title}</h3>
                <button
                  onClick={closePhotoModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Imagen */}
              <div className="p-4">
                <img 
                  src={selectedPhoto.imageUrl} 
                  alt={selectedPhoto.title}
                  className="w-full max-h-[60vh] object-contain rounded-lg mb-4"
                />
                
                {/* Descripción */}
                {selectedPhoto.description && (
                  <div className="bg-gray-900 rounded-lg p-4">
                    <p className="text-gray-300 leading-relaxed">{selectedPhoto.description}</p>
                  </div>
                )}
                
                {/* Fecha si existe */}
                {selectedPhoto.date && (
                  <div className="text-center mt-4">
                    <span className="text-sm text-gray-400">
                      📅 {new Date(selectedPhoto.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile