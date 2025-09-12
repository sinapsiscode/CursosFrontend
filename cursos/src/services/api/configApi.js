import baseApi from './baseApi'

/**
 * Configuration API Service
 * Handles all configuration-related API operations
 */
class ConfigApi {
  /**
   * Get all configuration
   */
  async getConfig() {
    return baseApi.get('/config')
  }

  /**
   * Get general configuration
   */
  async getGeneralConfig() {
    const config = await this.getConfig()
    return config.general || {}
  }

  /**
   * Get loyalty configuration
   */
  async getLoyaltyConfig() {
    const config = await this.getConfig()
    return config.loyalty || {}
  }

  /**
   * Get WhatsApp configuration
   */
  async getWhatsAppConfig() {
    const config = await this.getConfig()
    return config.whatsapp || {}
  }

  /**
   * Get payment configuration
   */
  async getPaymentConfig() {
    const config = await this.getConfig()
    return config.payments || {}
  }

  /**
   * Get notification configuration
   */
  async getNotificationConfig() {
    const config = await this.getConfig()
    return config.notifications || {}
  }

  /**
   * Update configuration (admin only)
   */
  async updateConfig(section, updates) {
    const config = await this.getConfig()
    config[section] = { ...config[section], ...updates }
    
    return baseApi.put('/config', config)
  }

  /**
   * Get feature flags
   */
  async getFeatureFlags() {
    const config = await this.getConfig()
    return config.features || {}
  }

  /**
   * Check if feature is enabled
   */
  async isFeatureEnabled(featureName) {
    const features = await this.getFeatureFlags()
    return features[featureName] === true
  }

  /**
   * Get discount codes
   */
  async getDiscountCodes() {
    const config = await this.getConfig()
    return config.payments?.discountCodes || []
  }

  /**
   * Validate discount code
   */
  async validateDiscountCode(code) {
    const discountCodes = await this.getDiscountCodes()
    const discount = discountCodes.find(d => 
      d.code === code && 
      d.isActive && 
      new Date(d.validUntil) > new Date()
    )
    
    if (!discount) {
      throw new Error('Código de descuento inválido o expirado')
    }
    
    return discount
  }

  /**
   * Get branding configuration
   */
  async getBrandingConfig() {
    const config = await this.getConfig()
    return config.branding || {}
  }

  /**
   * Get security configuration
   */
  async getSecurityConfig() {
    const config = await this.getConfig()
    return config.security || {}
  }

  /**
   * Get integration settings
   */
  async getIntegrations() {
    const config = await this.getConfig()
    return config.integrations || {}
  }
}

export const configApi = new ConfigApi()
export default configApi