import { useState, useEffect } from 'react'
import { useAdminStore, useUIStore } from '../../store'
import { defaultButtons, initialFormState } from '../../data/adminPhotos'

/**
 * Hook for managing profile buttons configuration
 */
export const useProfileButtons = () => {
  const { profileButtons, updateProfileButtons } = useAdminStore()
  const { showToast } = useUIStore()

  const [showButtonsModal, setShowButtonsModal] = useState(false)
  const [buttonsFormData, setButtonsFormData] = useState(initialFormState.buttons)

  useEffect(() => {
    loadProfileButtons()
  }, [])

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
        useAdminStore.getState().updateProfileButtons(defaultButtons)
        localStorage.setItem('profile_buttons', JSON.stringify(defaultButtons))
        setButtonsFormData(defaultButtons)
        console.log('🔘 Configuración de botones inicializada')
      }
    } catch (error) {
      console.error('Error loading profile buttons from localStorage:', error)
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

  return {
    // State
    showButtonsModal,
    setShowButtonsModal,
    buttonsFormData,
    setButtonsFormData,

    // Actions
    handleSaveButtons,
    handleOpenButtonsModal,
  }
}
