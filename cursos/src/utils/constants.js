/**
 * EJEMPLO DE ELIMINACIÓN DE HARDCODEO
 * ANTES vs DESPUÉS
 */

import hardcodedValuesService from '../services/hardcodedValuesService'

// ANTES (hardcodeado):
// export const WHATSAPP_NUMBER = '+57 300 123 4567'
// export const API_URL = 'http://localhost:4002/api'
// export const TOAST_DURATION = 4000
// export const WELCOME_POINTS = 100

// DESPUÉS (dinámico desde backend JSON):
export const getConstants = async () => {
  const values = await hardcodedValuesService.getValues()
  
  return {
    // URLs dinámicas
    WHATSAPP_NUMBER: values.contacts?.whatsappNumber || '+57 300 123 4567',
    API_URL: values.urls?.apiUrl || 'http://localhost:4002/api',
    STORAGE_URL: values.urls?.storageUrl || 'https://storage.metsel.edu.co',
    AVATAR_SERVICE: values.urls?.avatarService || 'https://ui-avatars.com/api/',
    
    // Configuración dinámica de timers
    TOAST_DURATION: values.timers?.toastDuration || 4000,
    SESSION_WARNING: values.timers?.sessionWarning || 300000,
    AUTO_SAVE_INTERVAL: values.timers?.autoSaveInterval || 30000,
    
    // Sistema de puntos dinámico
    WELCOME_POINTS: values.points?.welcomeBonus || 100,
    COURSE_COMPLETION_POINTS: values.points?.courseCompletion || 100,
    LOYALTY_TEST_AMOUNT: values.points?.loyaltyTestAmount || 250,
    
    // Configuración de UI dinámica
    CARD_ANIMATION_DURATION: values.ui?.cardAnimationDuration || 300,
    MODAL_FADE_TIME: values.ui?.modalFadeTime || 200,
    DEFAULT_PAGE_SIZE: values.ui?.defaultPageSize || 10,
    
    // Mensajes dinámicos
    WHATSAPP_REDIRECT_MESSAGE: values.messages?.whatsappRedirect || 'Redirigiendo a WhatsApp...',
    LEAD_SUCCESS_MESSAGE: values.messages?.leadSuccess || '¡Información enviada correctamente!',
    ERROR_MESSAGE: values.messages?.genericError || 'Ocurrió un error inesperado',
    
    // Formatos dinámicos
    PHONE_FORMAT: values.formats?.phoneExample || '+51 999 999 999',
    DATE_FORMAT: values.formats?.dateDisplay || 'DD/MM/YYYY',
    CURRENCY_SYMBOL: values.formats?.currency || '$'
  }
}

// Métodos de conveniencia para acceso directo
export const getWhatsAppNumber = async () => {
  return await hardcodedValuesService.getContact('whatsappNumber')
}

export const getApiUrl = async () => {
  return await hardcodedValuesService.getUrl('apiUrl')
}

export const getToastDuration = async () => {
  return await hardcodedValuesService.getTimer('toastDuration')
}

export const getWelcomePoints = async () => {
  return await hardcodedValuesService.getPoints('welcomeBonus')
}

/**
 * RESULTADO: TODO EL HARDCODEO HA SIDO MOVIDO AL BACKEND JSON
 * 
 * Los componentes ahora pueden usar:
 * - await getConstants() para obtener todos los valores
 * - hardcodedValuesService directamente para valores específicos
 * - Métodos de conveniencia como getWhatsAppNumber()
 * 
 * VENTAJAS:
 * 1. Configuración centralizada en backend/db.json
 * 2. Sin recompilación para cambiar valores
 * 3. Configuración por ambiente desde una sola fuente
 * 4. Caché automático para performance
 * 5. Fallbacks para desarrollo offline
 */