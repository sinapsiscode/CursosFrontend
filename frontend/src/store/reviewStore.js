import { create } from 'zustand'
import { resenasService as reviewService } from '../services/resenasService'

export const useReviewStore = create((set, get) => ({
  // ========== ESTADO ==========
  reviews: [],
  pendingReviews: [],
  courseStudents: [],
  loading: {
    reviews: false,
    students: false,
    submitting: false
  },
  error: null,

  // ========== ACCIONES PARA ESTUDIANTES ==========

  // Verificar si usuario puede reseñar un curso
  canReview: async (userId, courseId) => {
    return await reviewService.canUserReview(userId, courseId)
  },

  // Crear nueva reseña
  submitReview: async (reviewData) => {
    set((state) => ({
      loading: { ...state.loading, submitting: true },
      error: null
    }))

    try {
      const result = await reviewService.createReview(reviewData)

      if (result.success) {
        // Actualizar lista de reseñas pendientes si estamos en admin
        const currentPending = get().pendingReviews
        if (currentPending.length > 0) {
          const updatedPending = await reviewService.getPendingReviews()
          set({ pendingReviews: updatedPending })
        }

        return { success: true }
      } else {
        throw new Error('Error al enviar reseña')
      }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    } finally {
      set((state) => ({
        loading: { ...state.loading, submitting: false }
      }))
    }
  },

  // Obtener reseñas de un usuario
  loadUserReviews: async (userId) => {
    const userReviews = await reviewService.getUserReviews(userId)
    return userReviews
  },

  // ========== ACCIONES PARA CURSOS ==========

  // Cargar reseñas de un curso (públicas)
  loadCourseReviews: async (courseId) => {
    set((state) => ({
      loading: { ...state.loading, reviews: true },
      error: null
    }))

    try {
      const courseReviews = await reviewService.getCourseReviews(courseId)
      const stats = await reviewService.getCourseReviewStats(courseId)

      console.log(`📚 Cargando reseñas del curso ${courseId}:`, courseReviews)
      console.log(`📊 Estadísticas:`, stats)

      set((state) => ({
        reviews: courseReviews,
        courseStats: stats,
        loading: { ...state.loading, reviews: false }
      }))

      return { reviews: courseReviews, stats }
    } catch (error) {
      console.error('❌ Error cargando reseñas:', error)
      set((state) => ({
        error: error.message,
        loading: { ...state.loading, reviews: false }
      }))
      return { reviews: [], stats: null }
    }
  },

  // Obtener estadísticas de reseñas de un curso
  getCourseStats: async (courseId) => {
    return await reviewService.getCourseReviewStats(courseId)
  },

  // ========== ACCIONES PARA ADMIN ==========

  // Cargar reseñas pendientes de moderación
  loadPendingReviews: async () => {
    set((state) => ({
      loading: { ...state.loading, reviews: true },
      error: null
    }))

    try {
      const pending = await reviewService.getPendingReviews()

      set((state) => ({
        pendingReviews: pending,
        loading: { ...state.loading, reviews: false }
      }))

      return pending
    } catch (error) {
      set((state) => ({
        error: error.message,
        loading: { ...state.loading, reviews: false }
      }))
      return []
    }
  },

  // Aprobar reseña
  approveReview: async (reviewId, adminId) => {
    try {
      const result = await reviewService.approveReview(reviewId, adminId)

      if (result.success) {
        // Actualizar lista de pendientes
        const updatedPending = await reviewService.getPendingReviews()
        set({ pendingReviews: updatedPending })

        return { success: true }
      }

      throw new Error('Error al aprobar reseña')
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  // Rechazar reseña
  rejectReview: async (reviewId, adminId, reason = '') => {
    try {
      const result = await reviewService.rejectReview(reviewId, adminId, reason)

      if (result.success) {
        // Actualizar lista de pendientes
        const updatedPending = await reviewService.getPendingReviews()
        set({ pendingReviews: updatedPending })

        return { success: true }
      }

      throw new Error('Error al rechazar reseña')
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  // ========== UTILIDADES ==========

  // Limpiar error
  clearError: () => {
    set({ error: null })
  },

  // Limpiar datos
  clearReviews: () => {
    set({
      reviews: [],
      pendingReviews: [],
      courseStudents: [],
      error: null
    })
  },

  // Crear datos de prueba - ELIMINADO (no existe en resenasService)
  // generateTestData: () => {
  //   console.log('⚠️ generateTestData ya no está disponible')
  //   return { message: 'Función eliminada - usar datos reales del backend' }
  // },

  // ========== GETTERS ==========

  // Verificar si hay reseñas cargadas para un curso
  hasReviewsLoaded: (courseId) => {
    const state = get()
    return state.reviews.some(review => review.courseId === courseId)
  },

  // Obtener reseñas por estado
  getReviewsByStatus: (status) => {
    const state = get()
    return state.reviews.filter(review => review.status === status)
  },

  // Verificar si está cargando algo
  isLoading: () => {
    const state = get()
    return Object.values(state.loading).some(loading => loading)
  }
}))