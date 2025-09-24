import { useState, useEffect, useCallback } from 'react'
import { useAuthStore, useAdminStore } from '../store'
import { AREA_COLORS, DEFAULT_URLS } from '../constants/profileConstants.jsx'

export const useProfile = () => {
  const { user, isAuthenticated, selectedArea } = useAuthStore()
  const { profilePhotos, profileLinks, profileButtons, advertisingConfig } = useAdminStore()
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true)
      console.log('📸 Cargando fotos del perfil configuradas por admin')

      const {
        profilePhotos,
        setProfilePhotos,
        profileLinks,
        setProfileLinks,
        updateProfileButtons,
        updateProfileLinks
      } = useAdminStore.getState()

      // Cargar fotos desde localStorage si no están en el store
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
          updateProfileLinks(storedLinks)
          console.log('🔗 Links del perfil cargados desde localStorage')
        }
      } catch (storageError) {
        console.error('Error loading profile links from localStorage:', storageError)
      }

      // Cargar configuración de botones desde localStorage
      try {
        const storedButtons = JSON.parse(localStorage.getItem('profile_buttons') || '{}')
        if (Object.keys(storedButtons).length > 0) {
          updateProfileButtons(storedButtons)
          console.log('🔘 Configuración de botones cargada desde localStorage')
        }
      } catch (storageError) {
        console.error('Error loading profile buttons from localStorage:', storageError)
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoading(false)
    }
  }, [profileLinks])

  const loadProfileLinks = useCallback(() => {
    try {
      const storedLinks = JSON.parse(localStorage.getItem('profile_links') || '{}')
      if (Object.keys(storedLinks).length > 0) {
        useAdminStore.getState().updateProfileLinks(storedLinks)
        console.log('🔗 Enlaces cargados en Profile:', storedLinks)
      }
    } catch (error) {
      console.error('Error loading profile links:', error)
    }
  }, [])

  const openPhotoModal = useCallback((photo) => {
    setSelectedPhoto(photo)
  }, [])

  const closePhotoModal = useCallback(() => {
    setSelectedPhoto(null)
  }, [])

  const handleProUpgrade = useCallback(() => {
    const url = profileLinks?.proUpgradeUrl || DEFAULT_URLS.proUpgrade
    window.open(url, '_blank')
    console.log('🔗 Abriendo Pro URL desde header:', url)
  }, [profileLinks])

  const handleWhatsAppClick = useCallback(() => {
    const url = profileLinks?.whatsappChannelUrl || DEFAULT_URLS.whatsappChannel
    window.open(url, '_blank')
    console.log('🔗 Abriendo WhatsApp URL:', url)
  }, [profileLinks])

  const handleBannerClick = useCallback(() => {
    console.log('🎓 Navegando a certificaciones')
  }, [])

  const getAreaColors = useCallback(() => {
    return selectedArea ? AREA_COLORS[selectedArea] : AREA_COLORS.metalurgia
  }, [selectedArea])

  const getAreaName = useCallback((area) => {
    return area ? area.charAt(0).toUpperCase() + area.slice(1) : ''
  }, [])

  const formatPhotoDate = useCallback((date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadProfileData()
    }
  }, [isAuthenticated, loadProfileData])

  useEffect(() => {
    loadProfileLinks()
  }, [loadProfileLinks])

  return {
    user,
    isAuthenticated,
    selectedArea,
    loading,
    selectedPhoto,
    profilePhotos,
    profileLinks,
    profileButtons,
    advertisingConfig,
    openPhotoModal,
    closePhotoModal,
    handleProUpgrade,
    handleWhatsAppClick,
    handleBannerClick,
    getAreaColors,
    getAreaName,
    formatPhotoDate
  }
}