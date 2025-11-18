import { useState, useEffect } from 'react'
import { useAdminStore, useUIStore } from '../../store'
import { defaultLinks, initialFormState } from '../../data/adminPhotos'

/**
 * Hook for managing profile links configuration
 */
export const useProfileLinks = () => {
  const { profileLinks, updateProfileLinks } = useAdminStore()
  const { showToast } = useUIStore()

  const [showLinksModal, setShowLinksModal] = useState(false)
  const [linksFormData, setLinksFormData] = useState(initialFormState.links)

  useEffect(() => {
    loadProfileLinks()
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
        useAdminStore.getState().updateProfileLinks(defaultLinks)
        localStorage.setItem('profile_links', JSON.stringify(defaultLinks))
        setLinksFormData(defaultLinks)
        console.log('🔗 Enlaces de ejemplo inicializados')
      }
    } catch (error) {
      console.error('Error loading profile links from localStorage:', error)
    }
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

  const handleOpenLinksModal = () => {
    setLinksFormData({
      proUpgradeUrl: profileLinks?.proUpgradeUrl || '',
      whatsappChannelUrl: profileLinks?.whatsappChannelUrl || ''
    })
    setShowLinksModal(true)
  }

  return {
    // State
    showLinksModal,
    setShowLinksModal,
    linksFormData,
    setLinksFormData,

    // Actions
    handleSaveLinks,
    handleOpenLinksModal,
  }
}
