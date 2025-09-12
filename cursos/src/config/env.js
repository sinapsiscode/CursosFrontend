/**
 * Configuración centralizada de variables de entorno
 * Utiliza hardcodedValuesService para evitar hardcodeo
 */
import hardcodedValuesService from '../services/hardcodedValuesService'

class ConfigService {
  constructor() {
    this.cache = null
  }

  async getConfig() {
    if (this.cache) {
      return this.cache
    }

    try {
      const hardcodedValues = await hardcodedValuesService.getValues()
      
      this.cache = {
        // API Configuration
        API_URL: import.meta.env.VITE_API_URL || hardcodedValues?.urls?.apiUrl || 'http://localhost:4002/api',
        STORAGE_URL: import.meta.env.VITE_STORAGE_URL || hardcodedValues?.urls?.storageUrl || 'https://storage.metsel.edu.co',
        
        // WhatsApp Configuration
        WHATSAPP: {
          phoneNumber: import.meta.env.VITE_WHATSAPP_NUMBER || hardcodedValues?.contacts?.whatsappNumber || '+57 300 123 4567',
          channelUrl: import.meta.env.VITE_WHATSAPP_CHANNEL_URL || hardcodedValues?.examples?.whatsappChannelUrl || 'https://whatsapp.com/channel/default'
        },
        
        // Authentication
        DEFAULT_PASSWORD: import.meta.env.VITE_DEFAULT_PASSWORD || hardcodedValues?.authentication?.adminCredentials?.password || '123456',
        
        // Features
        ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
        ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
        
        // External Services
        YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || '',
        UNSPLASH_API_KEY: import.meta.env.VITE_UNSPLASH_API_KEY || '',
        
        // Environment
        isDevelopment: import.meta.env.DEV,
        isProduction: import.meta.env.PROD,
      }

      return this.cache
    } catch (error) {
      console.error('Error loading config:', error)
      // Fallback config
      return {
        API_URL: import.meta.env.VITE_API_URL || 'http://localhost:4002/api',
        STORAGE_URL: import.meta.env.VITE_STORAGE_URL || 'https://storage.metsel.edu.co',
        WHATSAPP: {
          phoneNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '+57 300 123 4567',
          channelUrl: import.meta.env.VITE_WHATSAPP_CHANNEL_URL || 'https://whatsapp.com/channel/default'
        },
        DEFAULT_PASSWORD: import.meta.env.VITE_DEFAULT_PASSWORD || '123456',
        ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
        ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
        YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || '',
        UNSPLASH_API_KEY: import.meta.env.VITE_UNSPLASH_API_KEY || '',
        isDevelopment: import.meta.env.DEV,
        isProduction: import.meta.env.PROD,
      }
    }
  }

  async getApiUrl() {
    const config = await this.getConfig()
    return config.API_URL
  }

  async getStorageUrl() {
    const config = await this.getConfig()
    return config.STORAGE_URL
  }

  async getWhatsAppConfig() {
    const config = await this.getConfig()
    return config.WHATSAPP
  }

  clearCache() {
    this.cache = null
  }
}

// Para compatibilidad, exportar también un objeto estático con valores por defecto
const config = {
  API_URL: 'http://localhost:4002/api',
  STORAGE_URL: 'https://storage.metsel.edu.co',
  WHATSAPP: {
    phoneNumber: '+57 300 123 4567',
    channelUrl: 'https://whatsapp.com/channel/default'
  },
  DEFAULT_PASSWORD: '123456',
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  UNSPLASH_API_KEY: import.meta.env.VITE_UNSPLASH_API_KEY || '',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export const configService = new ConfigService()
export default config