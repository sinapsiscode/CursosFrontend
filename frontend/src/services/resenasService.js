import apiClient from './apiClient'

/**
 * Servicio para gestión de reseñas de cursos
 */
class ResenasService {
  /**
   * Obtener todas las reseñas
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      if (filters.courseId) params.append('courseId', filters.courseId)
      if (filters.userId) params.append('userId', filters.userId)
      if (filters.status) params.append('status', filters.status)
      if (filters.rating) params.append('rating', filters.rating)

      const queryString = params.toString()
      const url = queryString ? `/resenas?${queryString}` : '/resenas'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo reseñas:', error)
      throw error
    }
  }

  /**
   * Obtener reseña por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/resenas/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo reseña ${id}:`, error)
      throw error
    }
  }

  /**
   * Crear nueva reseña
   */
  async createReview(reviewData) {
    try {
      const newReview = {
        courseId: reviewData.courseId,
        userId: reviewData.userId,
        userName: reviewData.userName,
        rating: reviewData.rating,
        comment: reviewData.comment,
        status: 'pending', // pending | approved | rejected
        createdAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
        rejectionReason: null
      }

      const response = await apiClient.post('/resenas', newReview)
      console.log('✅ Reseña creada:', response.data)
      return { success: true, review: response.data }
    } catch (error) {
      console.error('Error creando reseña:', error)
      throw error
    }
  }

  /**
   * Verificar si usuario puede reseñar
   */
  async canUserReview(userId, courseId) {
    try {
      const response = await apiClient.get(`/resenas?userId=${userId}&courseId=${courseId}`)
      const existingReviews = response.data

      // Puede reseñar si no tiene reseña previa para este curso
      return existingReviews.length === 0
    } catch (error) {
      console.error('Error verificando si puede reseñar:', error)
      throw error
    }
  }

  /**
   * Obtener reseñas de un curso (solo aprobadas)
   */
  async getCourseReviews(courseId, includeAll = false) {
    try {
      let reviews

      if (includeAll) {
        reviews = await this.getAll({ courseId })
      } else {
        // Solo reseñas aprobadas para público
        reviews = await this.getAll({ courseId, status: 'approved' })
      }

      return reviews.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    } catch (error) {
      console.error(`Error obteniendo reseñas del curso ${courseId}:`, error)
      throw error
    }
  }

  /**
   * Obtener reseñas pendientes de moderación
   */
  async getPendingReviews() {
    try {
      const reviews = await this.getAll({ status: 'pending' })
      return reviews.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    } catch (error) {
      console.error('Error obteniendo reseñas pendientes:', error)
      throw error
    }
  }

  /**
   * Aprobar reseña (admin)
   */
  async approveReview(reviewId, adminId) {
    try {
      const response = await apiClient.patch(`/resenas/${reviewId}`, {
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: adminId
      })

      console.log(`✅ Reseña ${reviewId} aprobada`)
      return { success: true, review: response.data }
    } catch (error) {
      console.error(`Error aprobando reseña ${reviewId}:`, error)
      throw error
    }
  }

  /**
   * Rechazar reseña (admin)
   */
  async rejectReview(reviewId, adminId, reason = '') {
    try {
      const response = await apiClient.patch(`/resenas/${reviewId}`, {
        status: 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewedBy: adminId,
        rejectionReason: reason
      })

      console.log(`✅ Reseña ${reviewId} rechazada`)
      return { success: true, review: response.data }
    } catch (error) {
      console.error(`Error rechazando reseña ${reviewId}:`, error)
      throw error
    }
  }

  /**
   * Obtener reseñas de un usuario
   */
  async getUserReviews(userId) {
    try {
      const reviews = await this.getAll({ userId })
      return reviews.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    } catch (error) {
      console.error(`Error obteniendo reseñas de usuario ${userId}:`, error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de reseñas de un curso
   */
  async getCourseReviewStats(courseId) {
    try {
      // Solo contar reseñas aprobadas
      const reviews = await this.getAll({ courseId, status: 'approved' })

      if (reviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = Math.round((totalRating / reviews.length) * 10) / 10

      const ratingDistribution = reviews.reduce((dist, review) => {
        dist[review.rating] = (dist[review.rating] || 0) + 1
        return dist
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

      return {
        totalReviews: reviews.length,
        averageRating,
        ratingDistribution
      }
    } catch (error) {
      console.error(`Error obteniendo estadísticas de curso ${courseId}:`, error)
      throw error
    }
  }

  /**
   * Eliminar reseña
   */
  async delete(id) {
    try {
      await apiClient.delete(`/resenas/${id}`)
      console.log('✅ Reseña eliminada:', id)
      return { success: true }
    } catch (error) {
      console.error(`Error eliminando reseña ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener estadísticas generales
   */
  async getGlobalStats() {
    try {
      const allReviews = await this.getAll()

      return {
        total: allReviews.length,
        pending: allReviews.filter(r => r.status === 'pending').length,
        approved: allReviews.filter(r => r.status === 'approved').length,
        rejected: allReviews.filter(r => r.status === 'rejected').length,
        averageRating: allReviews.length > 0
          ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10
          : 0
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas globales:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const resenasService = new ResenasService()
export default resenasService
