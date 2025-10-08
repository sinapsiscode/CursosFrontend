import apiClient from './apiClient'

/**
 * Servicio para gestión de cupones de descuento
 */
class CuponesService {
  /**
   * Obtener todos los cupones
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      if (filters.studentId) params.append('studentId', filters.studentId)
      if (filters.courseId) params.append('courseId', filters.courseId)
      if (filters.code) params.append('code', filters.code)
      if (filters.isUsed !== undefined) params.append('isUsed', filters.isUsed)

      const queryString = params.toString()
      const url = queryString ? `/cupones?${queryString}` : '/cupones'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo cupones:', error)
      throw error
    }
  }

  /**
   * Obtener cupón por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/cupones/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo cupón ${id}:`, error)
      throw error
    }
  }

  /**
   * Buscar cupón por código
   */
  async getByCode(code) {
    try {
      const response = await apiClient.get(`/cupones?code=${code}`)
      const cupones = response.data
      return cupones.length > 0 ? cupones[0] : null
    } catch (error) {
      console.error(`Error buscando cupón ${code}:`, error)
      throw error
    }
  }

  /**
   * Generar cupón por resultado de examen
   */
  async generateCoupon(examResult, studentId) {
    try {
      if (!examResult.discount || examResult.discount <= 0) {
        throw new Error('El resultado del examen no genera descuento')
      }

      const couponCode = this.generateCouponCode()

      const newCoupon = {
        code: couponCode,
        studentId,
        courseId: examResult.courseId,
        examId: examResult.examId,
        discountPercentage: examResult.discount,
        expirationDate: this.calculateExpirationDate(30),
        isUsed: false,
        createdAt: new Date().toISOString(),
        usedAt: null
      }

      const response = await apiClient.post('/cupones', newCoupon)
      console.log('✅ Cupón generado:', couponCode)
      return { success: true, coupon: response.data }
    } catch (error) {
      console.error('Error generando cupón:', error)
      throw error
    }
  }

  /**
   * Validar cupón
   */
  async validateCoupon(couponCode, courseId) {
    try {
      const coupon = await this.getByCode(couponCode)

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
    } catch (error) {
      console.error('Error validando cupón:', error)
      throw error
    }
  }

  /**
   * Usar cupón
   */
  async useCoupon(couponCode) {
    try {
      const coupon = await this.getByCode(couponCode)

      if (!coupon) {
        throw new Error('Cupón no encontrado')
      }

      if (coupon.isUsed) {
        throw new Error('Este cupón ya ha sido utilizado')
      }

      const updatedCoupon = await apiClient.patch(`/cupones/${coupon.id}`, {
        isUsed: true,
        usedAt: new Date().toISOString()
      })

      console.log('✅ Cupón utilizado:', couponCode)
      return { success: true, coupon: updatedCoupon.data }
    } catch (error) {
      console.error('Error usando cupón:', error)
      throw error
    }
  }

  /**
   * Obtener cupones con datos enriquecidos
   */
  async getCouponsWithDetails(filters = {}) {
    try {
      let cupones = await this.getAll(filters)

      // Aplicar filtros de estado
      if (filters.status) {
        const now = new Date()

        if (filters.status === 'active') {
          cupones = cupones.filter(c =>
            !c.isUsed && new Date(c.expirationDate) >= now
          )
        } else if (filters.status === 'used') {
          cupones = cupones.filter(c => c.isUsed)
        } else if (filters.status === 'expired') {
          cupones = cupones.filter(c =>
            !c.isUsed && new Date(c.expirationDate) < now
          )
        }
      }

      // Ordenar por fecha de creación (más recientes primero)
      return cupones.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    } catch (error) {
      console.error('Error obteniendo cupones con detalles:', error)
      throw error
    }
  }

  /**
   * Obtener cupones de un estudiante
   */
  async getStudentCoupons(studentId) {
    try {
      return await this.getAll({ studentId })
    } catch (error) {
      console.error(`Error obteniendo cupones de estudiante ${studentId}:`, error)
      throw error
    }
  }

  /**
   * Crear cupón manualmente (admin)
   */
  async createCoupon(couponData) {
    try {
      const newCoupon = {
        code: couponData.code || this.generateCouponCode(),
        studentId: couponData.studentId,
        courseId: couponData.courseId,
        examId: couponData.examId || null,
        discountPercentage: couponData.discountPercentage,
        expirationDate: couponData.expirationDate || this.calculateExpirationDate(30),
        isUsed: false,
        createdAt: new Date().toISOString(),
        usedAt: null
      }

      const response = await apiClient.post('/cupones', newCoupon)
      console.log('✅ Cupón creado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creando cupón:', error)
      throw error
    }
  }

  /**
   * Crear cupón general (admin) - para descuentos globales
   */
  async createGeneralCoupon(couponData) {
    try {
      const newCoupon = {
        code: couponData.code.toUpperCase(),
        discountType: couponData.discountType || 'percentage',
        discountValue: parseFloat(couponData.discountValue),
        maxUses: parseInt(couponData.maxUses),
        currentUses: 0,
        expiryDate: couponData.expiryDate,
        description: couponData.description || '',
        active: couponData.active !== undefined ? couponData.active : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.post('/cupones', newCoupon)
      console.log('✅ Cupón general creado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creando cupón general:', error)
      throw error
    }
  }

  /**
   * Actualizar cupón general (admin)
   */
  async updateGeneralCoupon(id, couponData) {
    try {
      const updatedCoupon = {
        code: couponData.code.toUpperCase(),
        discountType: couponData.discountType,
        discountValue: parseFloat(couponData.discountValue),
        maxUses: parseInt(couponData.maxUses),
        expiryDate: couponData.expiryDate,
        description: couponData.description || '',
        active: couponData.active,
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/cupones/${id}`, updatedCoupon)
      console.log('✅ Cupón actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error actualizando cupón:', error)
      throw error
    }
  }

  /**
   * Eliminar cupón
   */
  async delete(id) {
    try {
      await apiClient.delete(`/cupones/${id}`)
      console.log('✅ Cupón eliminado:', id)
      return { success: true }
    } catch (error) {
      console.error(`Error eliminando cupón ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener estadísticas
   */
  async getStats() {
    try {
      const cupones = await this.getAll()
      const now = new Date()

      return {
        total: cupones.length,
        active: cupones.filter(c =>
          !c.isUsed && new Date(c.expirationDate) >= now
        ).length,
        used: cupones.filter(c => c.isUsed).length,
        expired: cupones.filter(c =>
          !c.isUsed && new Date(c.expirationDate) < now
        ).length,
        totalDiscount: cupones.reduce((sum, c) =>
          sum + (c.isUsed ? c.discountPercentage : 0), 0
        )
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }

  // ==================== HELPERS ====================

  /**
   * Generar código de cupón
   */
  generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = 'DESC-'
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  /**
   * Calcular fecha de expiración
   */
  calculateExpirationDate(days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString()
  }
}

// Exportar instancia única (singleton)
export const cuponesService = new CuponesService()
export default cuponesService
