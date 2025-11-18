import { useState, useEffect } from 'react'
import { useAdminStore, useUIStore } from '../../store'
import { defaultAdvertising, initialFormState } from '../../data/adminPhotos'

/**
 * Hook for managing advertising configuration
 */
export const useAdvertisingConfig = () => {
  const { advertisingConfig, updateAdvertisingConfig } = useAdminStore()
  const { showToast } = useUIStore()

  const [showAdvertisingModal, setShowAdvertisingModal] = useState(false)
  const [advertisingFormData, setAdvertisingFormData] = useState(initialFormState.advertising)

  useEffect(() => {
    loadAdvertisingConfig()
  }, [])

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
        setAdvertisingFormData({
          bannerTitle: advertisingConfig?.bannerTitle || defaultAdvertising.bannerTitle,
          bannerSubtitle: advertisingConfig?.bannerSubtitle || defaultAdvertising.bannerSubtitle,
          motivationalTitle: advertisingConfig?.motivationalTitle || defaultAdvertising.motivationalTitle,
          motivationalSubtitle: advertisingConfig?.motivationalSubtitle || defaultAdvertising.motivationalSubtitle,
          motivationalQuote: advertisingConfig?.motivationalQuote || defaultAdvertising.motivationalQuote
        })
      }
    } catch (error) {
      console.error('Error loading advertising config from localStorage:', error)
    }
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
      bannerTitle: advertisingConfig?.bannerTitle || defaultAdvertising.bannerTitle,
      bannerSubtitle: advertisingConfig?.bannerSubtitle || defaultAdvertising.bannerSubtitle,
      motivationalTitle: advertisingConfig?.motivationalTitle || defaultAdvertising.motivationalTitle,
      motivationalSubtitle: advertisingConfig?.motivationalSubtitle || defaultAdvertising.motivationalSubtitle,
      motivationalQuote: advertisingConfig?.motivationalQuote || defaultAdvertising.motivationalQuote
    })
    setShowAdvertisingModal(true)
  }

  return {
    // State
    showAdvertisingModal,
    setShowAdvertisingModal,
    advertisingFormData,
    setAdvertisingFormData,

    // Actions
    handleSaveAdvertising,
    handleOpenAdvertisingModal,
  }
}
