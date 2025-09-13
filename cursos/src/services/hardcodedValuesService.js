import baseApi from './api/baseApi'

class HardcodedValuesService {
  constructor() {
    this.cache = null
    this.cacheTimestamp = null
    this.CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  }

  async getValues() {
    if (this.cache && this.cacheTimestamp && 
        Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      return this.cache
    }

    try {
      const response = await baseApi.get('/hardcodedValues')
      this.cache = response
      this.cacheTimestamp = Date.now()
      return response
    } catch (error) {
      console.warn('Error fetching hardcoded values, using fallback:', error.message)
      return this.getFallbackValues()
    }
  }

  getFallbackValues() {
    // Este es solo un fallback, los valores reales vienen de db.json
    return {
      urls: {},
      contacts: {},
      timers: {},
      placeholders: {},
      examples: {},
      points: {},
      ui: {},
      messages: {},
      validation: {},
      limits: {},
      defaults: {},
      statistics: {},
      mock: {},
      authentication: {},
      whatsappConfig: {}
    }
  }

  async getUrl(key) {
    const values = await this.getValues()
    return values.urls?.[key] || ''
  }

  async getContact(key) {
    const values = await this.getValues()
    return values.contacts?.[key] || ''
  }

  async getTimer(key) {
    const values = await this.getValues()
    return values.timers?.[key] || 0
  }

  async getPoints(key) {
    const values = await this.getValues()
    return values.points?.[key] || 0
  }

  async getUI(key) {
    const values = await this.getValues()
    return values.ui?.[key]
  }

  async getPlaceholder(key) {
    const values = await this.getValues()
    return values.placeholders?.[key] || ''
  }

  async getExample(key) {
    const values = await this.getValues()
    return values.examples?.[key] || ''
  }

  async getMessage(key) {
    const values = await this.getValues()
    return values.messages?.[key] || ''
  }

  async getValidation(key) {
    const values = await this.getValues()
    return values.validation?.[key]
  }

  async getLimit(key) {
    const values = await this.getValues()
    return values.limits?.[key]
  }

  async getDefault(key) {
    const values = await this.getValues()
    return values.defaults?.[key]
  }

  async getStatistic(key) {
    const values = await this.getValues()
    return values.statistics?.[key]
  }

  async getMock(key) {
    const values = await this.getValues()
    return values.mock?.[key]
  }

  async getAuthentication(key) {
    const values = await this.getValues()
    return values.authentication?.[key]
  }

  async getWhatsappConfig(key) {
    const values = await this.getValues()
    return values.whatsappConfig?.[key] || ''
  }

  async getRoute(category, key) {
    const values = await this.getValues()
    return values.routes?.[category]?.[key] || ''
  }

  async getIcon(key) {
    const values = await this.getValues()
    return values.icons?.[key] || ''
  }

  async getFileExtension(category) {
    const values = await this.getValues()
    return values.fileExtensions?.[category] || []
  }

  async getMockTestData(key) {
    const values = await this.getValues()
    return values.mockTestData?.[key] || null
  }

  async getConsoleMessage(key) {
    const values = await this.getValues()
    return values.consoleMessages?.[key] || ''
  }

  async getFormLabel(key) {
    const values = await this.getValues()
    return values.formLabels?.[key] || ''
  }

  async getValidationMessage(key) {
    const values = await this.getValues()
    return values.validationMessages?.[key] || ''
  }

  async getHttpCode(key) {
    const values = await this.getValues()
    return values.httpCodes?.[key] || 500
  }

  async getRegexPattern(key) {
    const values = await this.getValues()
    return values.regexPatterns?.[key] || ''
  }

  async getBrandName(key) {
    const values = await this.getValues()
    return values.brandNames?.[key] || ''
  }

  async getAreaName(area, field = 'displayName') {
    const values = await this.getValues()
    return values.areaNames?.[area]?.[field] || area
  }

  async getLevel(level, field = 'displayName') {
    const values = await this.getValues()
    return values.levels?.[level]?.[field] || level
  }

  async getLoyaltyLevel(level, field = 'name') {
    const values = await this.getValues()
    return values.loyaltyLevels?.[level]?.[field] || level
  }

  async getTailwindClass(category, key) {
    const values = await this.getValues()
    return values.ui?.tailwindClasses?.[category]?.[key] || ''
  }

  // Convenience methods for common use cases
  async getWhatsAppUrl(message = '') {
    const baseUrl = await this.getUrl('whatsappBase')
    const phone = await this.getContact('whatsappNumber')
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    return `${baseUrl}${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`
  }

  async getAvatarUrl(name, size = 40) {
    const baseUrl = await this.getUrl('avatarService')
    return `${baseUrl}?name=${encodeURIComponent(name)}&size=${size}&background=random`
  }

  async getYoutubeThumbnail(videoId, quality = 'hqdefault') {
    const baseUrl = await this.getUrl('youtubeThumbnail')
    return `${baseUrl}${videoId}/${quality}.jpg`
  }

  clearCache() {
    this.cache = null
    this.cacheTimestamp = null
  }
}

export default new HardcodedValuesService()