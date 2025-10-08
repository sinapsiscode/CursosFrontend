import apiClient from './apiClient'

/**
 * Servicio para gestión de configuración del sistema
 * Centraliza todas las configuraciones de negocio desde el backend
 */
class SystemConfigService {
  constructor() {
    this.cache = null
    this.cacheExpiry = null
    this.cacheDuration = 5 * 60 * 1000 // 5 minutos
  }

  /**
   * Obtener configuración completa del sistema
   * Implementa cache para reducir llamadas al backend
   */
  async getConfig(forceRefresh = false) {
    try {
      // Retornar cache si está vigente
      if (!forceRefresh && this.cache && this.cacheExpiry > Date.now()) {
        return this.cache
      }

      const response = await apiClient.get('/system_config')

      // Si es un array (json-server retorna array), tomar el primer elemento
      const config = Array.isArray(response.data) ? response.data[0] : response.data

      // Actualizar cache
      this.cache = config
      this.cacheExpiry = Date.now() + this.cacheDuration

      console.log('✅ Configuración del sistema cargada desde backend')
      return this.cache
    } catch (error) {
      console.error('Error obteniendo configuración del sistema:', error)

      // FALLBACK: Si falla, retornar valores por defecto hardcodeados
      console.warn('⚠️ Usando configuración por defecto (fallback)')
      return this.getDefaultConfig()
    }
  }

  /**
   * Actualizar configuración del sistema
   */
  async updateConfig(updates) {
    try {
      const response = await apiClient.patch('/system_config/1', {
        ...updates,
        updatedAt: new Date().toISOString()
      })

      // Invalidar cache
      this.cache = null
      this.cacheExpiry = null

      console.log('✅ Configuración del sistema actualizada')
      return Array.isArray(response.data) ? response.data[0] : response.data
    } catch (error) {
      console.error('Error actualizando configuración del sistema:', error)
      throw error
    }
  }

  // ==================== CONFIGURACIÓN DE FIDELIZACIÓN ====================

  /**
   * Obtener configuración de fidelización
   */
  async getLoyaltyConfig() {
    const config = await this.getConfig()
    return config.loyalty
  }

  /**
   * Actualizar configuración de fidelización
   */
  async updateLoyaltyConfig(loyaltyUpdates) {
    const config = await this.getConfig()
    return await this.updateConfig({
      ...config,
      loyalty: {
        ...config.loyalty,
        ...loyaltyUpdates
      }
    })
  }

  /**
   * Obtener niveles de fidelización
   */
  async getLoyaltyLevels() {
    const config = await this.getLoyaltyConfig()

    // Convertir array a objeto para compatibilidad con código existente
    const levelsObject = {}
    config.levels.forEach(level => {
      levelsObject[level.key] = level
    })

    return levelsObject
  }

  /**
   * Obtener puntos por curso
   */
  async getPointsPerCourse() {
    const config = await this.getLoyaltyConfig()
    return config.pointsPerCourse || 100
  }

  // ==================== CONFIGURACIÓN DE EXÁMENES ====================

  /**
   * Obtener configuración de exámenes
   */
  async getExamConfig() {
    const config = await this.getConfig()
    return config.exams
  }

  /**
   * Actualizar configuración de exámenes
   */
  async updateExamConfig(examUpdates) {
    const config = await this.getConfig()
    return await this.updateConfig({
      ...config,
      exams: {
        ...config.exams,
        ...examUpdates
      }
    })
  }

  /**
   * Obtener rangos de calificación de exámenes
   */
  async getExamRanges() {
    const config = await this.getExamConfig()

    // Convertir array a objeto para compatibilidad
    const rangesObject = {}
    config.ranges.forEach(range => {
      rangesObject[range.key] = range
    })

    return rangesObject
  }

  /**
   * Calcular descuento según calificación
   */
  async calculateExamDiscount(score) {
    const config = await this.getExamConfig()

    for (const range of config.ranges) {
      if (score >= range.min && score <= range.max) {
        return range.discount
      }
    }

    return 0
  }

  // ==================== CONFIGURACIÓN GENERAL ====================

  /**
   * Obtener configuración general
   */
  async getGeneralConfig() {
    const config = await this.getConfig()
    return config.general || {}
  }

  /**
   * Verificar si el sistema está en mantenimiento
   */
  async isMaintenanceMode() {
    const config = await this.getGeneralConfig()
    return config.maintenanceMode || false
  }

  /**
   * Verificar si se permiten registros
   */
  async allowRegistrations() {
    const config = await this.getGeneralConfig()
    return config.allowRegistrations !== false
  }

  // ==================== FALLBACK (Configuración por defecto) ====================

  /**
   * Configuración por defecto si falla el backend
   * Mantiene el hardcodeo como fallback de seguridad
   */
  getDefaultConfig() {
    return {
      id: '1',
      loyalty: {
        enabled: true,
        pointsPerCourse: 100,
        firstCourseBonus: 50,
        levels: [
          { key: 'bronce', name: 'Bronce', minPoints: 0, maxPoints: 299, discountPercentage: 5, color: '#CD7F32', icon: '🥉' },
          { key: 'plata', name: 'Plata', minPoints: 300, maxPoints: 599, discountPercentage: 10, color: '#C0C0C0', icon: '🥈' },
          { key: 'oro', name: 'Oro', minPoints: 600, maxPoints: 999, discountPercentage: 15, color: '#FFD700', icon: '🥇' },
          { key: 'platino', name: 'Platino', minPoints: 1000, maxPoints: null, discountPercentage: 20, color: '#E5E4E2', icon: '💎' }
        ]
      },
      exams: {
        enabled: true,
        maxScore: 20,
        passingScore: 11,
        timeLimit: 60,
        ranges: [
          { key: 'excellent', min: 18, max: 20, discount: 20, color: 'green', message: '¡Excelente!' },
          { key: 'good', min: 15, max: 17, discount: 15, color: 'green', message: '¡Muy bien!' },
          { key: 'average', min: 11, max: 14, discount: 10, color: 'yellow', message: '¡Bien hecho!' },
          { key: 'below', min: 0, max: 10, discount: 0, color: 'red', message: 'Sigue aprendiendo' }
        ]
      },
      general: {
        siteName: 'METSEL - Educación en Metalurgia',
        defaultCoursePoints: 100,
        maintenanceMode: false,
        allowRegistrations: true,
        allowGuestAccess: true
      }
    }
  }

  /**
   * Invalidar cache manualmente
   */
  invalidateCache() {
    this.cache = null
    this.cacheExpiry = null
    console.log('🔄 Cache de configuración invalidado')
  }

  /**
   * Precargar configuración (útil al iniciar la app)
   */
  async preload() {
    try {
      await this.getConfig(true)
      console.log('✅ Configuración precargada')
    } catch (error) {
      console.warn('⚠️ No se pudo precargar la configuración, se usará fallback cuando sea necesario')
    }
  }
}

// Exportar instancia única (singleton)
export const systemConfigService = new SystemConfigService()
export default systemConfigService
