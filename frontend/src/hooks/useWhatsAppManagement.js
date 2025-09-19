import { useState, useEffect, useCallback } from 'react'
import { whatsappService } from '../services/whatsappService'
import { notificationService } from '../services/notificationService'
import {
  WHATSAPP_SECTIONS,
  WHATSAPP_MESSAGES,
  WHATSAPP_TEST_NOTIFICATION
} from '../constants/whatsAppManagementConstants'

export const useWhatsAppManagement = () => {
  // Estados principales
  const [config, setConfig] = useState(whatsappService.getStoredConfig())
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState(WHATSAPP_SECTIONS.BASIC)
  const [testResult, setTestResult] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [saving, setSaving] = useState(false)

  // Cargar configuración de notificaciones al montar
  useEffect(() => {
    const notifConfig = localStorage.getItem('notifications_global_config')
    if (notifConfig) {
      const parsed = JSON.parse(notifConfig)
      setNotificationsEnabled(parsed.enabled !== false)
    }
  }, [])

  // Función para mostrar toast (debe ser importada del contexto o servicio apropiado)
  const showToast = useCallback((message, type) => {
    // Esta función debe ser conectada al sistema de toast de la aplicación
    console.log(`Toast [${type}]: ${message}`)
  }, [])

  // Guardar configuración básica
  const handleSave = useCallback(() => {
    whatsappService.updateConfig(config)
    setIsEditing(false)
    showToast(WHATSAPP_MESSAGES.configUpdated, 'success')
  }, [config, showToast])

  // Cancelar edición
  const handleCancel = useCallback(() => {
    setConfig(whatsappService.getStoredConfig())
    setIsEditing(false)
  }, [])

  // Activar modo edición
  const handleEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  // Actualizar configuración de WhatsApp
  const updateWhatsAppConfig = useCallback(async (updates) => {
    setSaving(true)
    try {
      const newConfig = { ...config, ...updates }
      whatsappService.updateConfig(newConfig)
      setConfig(newConfig)
      showToast(WHATSAPP_MESSAGES.configUpdated, 'success')
    } catch (error) {
      console.error('Error updating WhatsApp config:', error)
      showToast(WHATSAPP_MESSAGES.configUpdateError, 'error')
    } finally {
      setSaving(false)
    }
  }, [config, showToast])

  // Actualizar configuración global de notificaciones
  const updateNotificationsConfig = useCallback(async (enabled) => {
    setSaving(true)
    try {
      const notifConfig = { enabled, updatedAt: new Date().toISOString() }
      localStorage.setItem('notifications_global_config', JSON.stringify(notifConfig))
      setNotificationsEnabled(enabled)
      const message = enabled
        ? WHATSAPP_MESSAGES.notificationsEnabled
        : WHATSAPP_MESSAGES.notificationsDisabled
      showToast(message, 'success')
    } catch (error) {
      console.error('Error updating notifications config:', error)
      showToast(WHATSAPP_MESSAGES.notificationsUpdateError, 'error')
    } finally {
      setSaving(false)
    }
  }, [showToast])

  // Probar mensaje
  const handleTest = useCallback(async (messageType) => {
    try {
      const result = await whatsappService.testMessage(messageType)
      setTestResult(result)
      setTimeout(() => setTestResult(null), 5000)
    } catch (error) {
      setTestResult({
        success: false,
        message: WHATSAPP_MESSAGES.testMessageError
      })
      setTimeout(() => setTestResult(null), 5000)
    }
  }, [])

  // Probar notificación
  const handleTestNotification = useCallback(() => {
    notificationService.createNotification(WHATSAPP_TEST_NOTIFICATION)
    showToast(WHATSAPP_MESSAGES.testNotificationCreated, 'success')
  }, [showToast])

  // Actualizar campo básico de configuración
  const updateConfigField = useCallback((field, value) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [field]: value
    }))
  }, [])

  // Actualizar template
  const updateTemplate = useCallback((templateKey, value) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      templates: {
        ...prevConfig.templates,
        [templateKey]: value
      }
    }))
  }, [])

  // Actualizar grupo
  const updateGroup = useCallback((area, groupData) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      groups: {
        ...prevConfig.groups,
        [area]: {
          ...prevConfig.groups[area],
          ...groupData
        }
      }
    }))
  }, [])

  // Actualizar trigger
  const updateTrigger = useCallback((triggerType, updates) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      triggers: {
        ...prevConfig.triggers,
        [triggerType]: {
          ...prevConfig.triggers[triggerType],
          ...updates
        }
      }
    }))
  }, [])

  // Resetear estadísticas
  const resetStatistics = useCallback(() => {
    const resetStats = {
      totalSent: 0,
      courseSearchTriggers: 0,
      courseViewTriggers: 0,
      registrationTriggers: 0,
      formSubmissionTriggers: 0
    }

    const updatedConfig = {
      ...config,
      statistics: resetStats
    }

    whatsappService.updateConfig(updatedConfig)
    setConfig(whatsappService.getStoredConfig())
  }, [config])

  // Cambiar sección activa
  const changeActiveSection = useCallback((section) => {
    setActiveSection(section)
  }, [])

  return {
    // Estado
    config,
    isEditing,
    activeSection,
    testResult,
    notificationsEnabled,
    saving,

    // Acciones principales
    handleSave,
    handleCancel,
    handleEdit,
    handleTest,
    handleTestNotification,

    // Actualizaciones de configuración
    updateWhatsAppConfig,
    updateNotificationsConfig,
    updateConfigField,
    updateTemplate,
    updateGroup,
    updateTrigger,
    resetStatistics,

    // Navegación
    changeActiveSection,

    // Utilidades
    showToast
  }
}