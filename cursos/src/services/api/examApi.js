import baseApi from './baseApi.js'

/**
 * API service for exam management
 * Migrado desde frontend/src/services/api.js con mejores prácticas
 */
class ExamApi {
  // Configuraciones de exámenes
  async getExamConfigs() {
    try {
      if (import.meta.env.DEV) {
        return this.getStoredExamConfigs()
      }
      return await baseApi.get('/exams/configs')
    } catch (error) {
      console.warn('Usando configuraciones locales:', error.message)
      return this.getStoredExamConfigs()
    }
  }

  async enableExamForStudent(config) {
    try {
      const result = await baseApi.post('/exams/enable', config)
      await this.saveExamConfigLocal(config)
      return result
    } catch (error) {
      console.warn('Guardando configuración localmente:', error.message)
      return this.enableExamLocal(config)
    }
  }

  async disableExamForStudent(studentId, courseId) {
    try {
      const result = await baseApi.delete(`/exams/disable/${studentId}/${courseId}`)
      await this.disableExamLocal(studentId, courseId)
      return result
    } catch (error) {
      console.warn('Deshabilitando localmente:', error.message)
      return this.disableExamLocal(studentId, courseId)
    }
  }

  async getStudentExamConfig(studentId, courseId) {
    try {
      return await baseApi.get(`/exams/config/${studentId}/${courseId}`)
    } catch (error) {
      console.warn('Buscando configuración localmente:', error.message)
      return this.getStudentExamConfigLocal(studentId, courseId)
    }
  }

  // Gestión de cupones
  async generateCoupon(examResult, studentId) {
    try {
      const result = await baseApi.post('/coupons/generate', { examResult, studentId })
      await this.saveCouponLocal(result.coupon)
      return result
    } catch (error) {
      console.warn('Generando cupón localmente:', error.message)
      return this.generateCouponLocal(examResult, studentId)
    }
  }

  async validateCoupon(couponCode, courseId) {
    try {
      return await baseApi.post('/coupons/validate', { couponCode, courseId })
    } catch (error) {
      console.warn('Validando cupón localmente:', error.message)
      return this.validateCouponLocal(couponCode, courseId)
    }
  }

  async useCoupon(couponCode) {
    try {
      const result = await baseApi.patch(`/coupons/use/${couponCode}`)
      await this.useCouponLocal(couponCode)
      return result
    } catch (error) {
      console.warn('Usando cupón localmente:', error.message)
      return this.useCouponLocal(couponCode)
    }
  }

  async getCoupons(filters = {}) {
    try {
      if (import.meta.env.DEV) {
        return this.getCouponsLocal(filters)
      }
      return await baseApi.get('/coupons', { params: filters })
    } catch (error) {
      console.warn('Usando cupones locales:', error.message)
      return this.getCouponsLocal(filters)
    }
  }

  // Resultados de exámenes
  async submitExamResult(examResult) {
    try {
      return await baseApi.post('/exams/results', examResult)
    } catch (error) {
      console.warn('Guardando resultado localmente:', error.message)
      return this.saveExamResultLocal(examResult)
    }
  }

  async getExamResults(filters = {}) {
    try {
      return await baseApi.get('/exams/results', { params: filters })
    } catch (error) {
      console.warn('Usando resultados locales:', error.message)
      return this.getExamResultsLocal(filters)
    }
  }

  // MÉTODOS LOCALES (localStorage)

  // Configuraciones de exámenes
  getStoredExamConfigs() {
    try {
      const stored = localStorage.getItem('exam_configs')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading exam configs:', error)
      return []
    }
  }

  saveExamConfigs(configs) {
    try {
      localStorage.setItem('exam_configs', JSON.stringify(configs))
    } catch (error) {
      console.error('Error saving exam configs:', error)
    }
  }

  async enableExamLocal(config) {
    const configs = this.getStoredExamConfigs()
    
    const newConfig = {
      id: `exam_config_${Date.now()}`,
      ...config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Verificar si ya existe una configuración para este estudiante y curso
    const existingIndex = configs.findIndex(c => 
      c.studentId === config.studentId && c.courseId === config.courseId
    )
    
    if (existingIndex !== -1) {
      configs[existingIndex] = newConfig
    } else {
      configs.push(newConfig)
    }
    
    this.saveExamConfigs(configs)
    return { success: true, config: newConfig }
  }

  async disableExamLocal(studentId, courseId) {
    const configs = this.getStoredExamConfigs()
    const filteredConfigs = configs.filter(c => 
      !(c.studentId === studentId && c.courseId === courseId)
    )
    
    this.saveExamConfigs(filteredConfigs)
    
    return { success: true }
  }

  async getStudentExamConfigLocal(studentId, courseId) {
    const configs = this.getStoredExamConfigs()
    const config = configs.find(c => 
      c.studentId === studentId && c.courseId === courseId && c.enabled
    )
    return { config: config || null }
  }

  async saveExamConfigLocal(config) {
    const configs = this.getStoredExamConfigs()
    const existingIndex = configs.findIndex(c => 
      c.studentId === config.studentId && c.courseId === config.courseId
    )
    
    if (existingIndex !== -1) {
      configs[existingIndex] = { ...configs[existingIndex], ...config }
    } else {
      configs.push({ ...config, id: `exam_config_${Date.now()}` })
    }
    
    this.saveExamConfigs(configs)
  }

  // Gestión de cupones locales
  getStoredCoupons() {
    try {
      const stored = localStorage.getItem('coupons')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading coupons:', error)
      return []
    }
  }

  saveCoupons(coupons) {
    try {
      localStorage.setItem('coupons', JSON.stringify(coupons))
    } catch (error) {
      console.error('Error saving coupons:', error)
    }
  }

  async generateCouponLocal(examResult, studentId) {
    if (examResult.discount <= 0) {
      throw new Error('El resultado del examen no genera descuento')
    }
    
    const coupons = this.getStoredCoupons()
    const couponCode = this.generateCouponCode()
    
    const newCoupon = {
      id: `coupon_${Date.now()}`,
      code: couponCode,
      studentId,
      courseId: examResult.courseId,
      examId: examResult.examId,
      discountPercentage: examResult.discount,
      expirationDate: this.calculateExpirationDate(30), // 30 días
      isUsed: false,
      createdAt: new Date().toISOString(),
      usedAt: null
    }
    
    coupons.push(newCoupon)
    this.saveCoupons(coupons)
    
    return { success: true, coupon: newCoupon }
  }

  async validateCouponLocal(couponCode, courseId) {
    const coupons = this.getStoredCoupons()
    const coupon = coupons.find(c => c.code === couponCode)
    
    if (!coupon) {
      return { valid: false, message: 'Código de cupón no válido' }
    }
    
    if (coupon.isUsed) {
      return { valid: false, message: 'Este cupón ya ha sido utilizado' }
    }
    
    if (new Date() > new Date(coupon.expirationDate)) {
      return { valid: false, message: 'Este cupón ha expirado' }
    }
    
    if (coupon.courseId !== courseId) {
      return { valid: false, message: 'Este cupón no es válido para este curso' }
    }
    
    return { valid: true, coupon }
  }

  async useCouponLocal(couponCode) {
    const coupons = this.getStoredCoupons()
    const couponIndex = coupons.findIndex(c => c.code === couponCode)
    
    if (couponIndex === -1) {
      throw new Error('Cupón no encontrado')
    }
    
    coupons[couponIndex].isUsed = true
    coupons[couponIndex].usedAt = new Date().toISOString()
    
    this.saveCoupons(coupons)
    
    return { success: true }
  }

  async getCouponsLocal(filters = {}) {
    let coupons = this.getStoredCoupons()
    
    // Aplicar filtros
    if (filters.status) {
      if (filters.status === 'active') {
        coupons = coupons.filter(c => !c.isUsed && new Date() <= new Date(c.expirationDate))
      } else if (filters.status === 'used') {
        coupons = coupons.filter(c => c.isUsed)
      } else if (filters.status === 'expired') {
        coupons = coupons.filter(c => !c.isUsed && new Date() > new Date(c.expirationDate))
      }
    }
    
    return coupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async saveCouponLocal(coupon) {
    const coupons = this.getStoredCoupons()
    coupons.push(coupon)
    this.saveCoupons(coupons)
  }

  // Resultados de exámenes
  getStoredExamResults() {
    try {
      const stored = localStorage.getItem('exam_results')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading exam results:', error)
      return []
    }
  }

  saveExamResults(results) {
    try {
      localStorage.setItem('exam_results', JSON.stringify(results))
    } catch (error) {
      console.error('Error saving exam results:', error)
    }
  }

  async saveExamResultLocal(examResult) {
    const results = this.getStoredExamResults()
    const newResult = {
      id: `result_${Date.now()}`,
      ...examResult,
      submittedAt: new Date().toISOString()
    }
    
    results.push(newResult)
    this.saveExamResults(results)
    
    return { success: true, result: newResult }
  }

  async getExamResultsLocal(filters = {}) {
    let results = this.getStoredExamResults()
    
    // Aplicar filtros básicos
    if (filters.studentId) {
      results = results.filter(r => r.studentId === filters.studentId)
    }
    
    if (filters.courseId) {
      results = results.filter(r => r.courseId === filters.courseId)
    }
    
    return results.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  }

  // Utilidades
  generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'DESC-'
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  calculateExpirationDate(days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString()
  }
}

export const examApi = new ExamApi()
export default examApi