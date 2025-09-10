import { create } from 'zustand'
import { reviewService } from '../services/reviewService'

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
  canReview: (userId, courseId) => {
    return reviewService.canStudentReview(userId, courseId)
  },

  // Crear nueva reseña
  submitReview: async (reviewData) => {
    set((state) => ({
      loading: { ...state.loading, submitting: true },
      error: null
    }))

    try {
      const result = reviewService.createReview(reviewData)
      
      if (result.success) {
        // Actualizar lista de reseñas pendientes si estamos en admin
        const currentPending = get().pendingReviews
        if (currentPending.length > 0) {
          const updatedPending = reviewService.getPendingReviews()
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
  loadUserReviews: (userId) => {
    const userReviews = reviewService.getUserReviews(userId)
    return userReviews
  },

  // ========== ACCIONES PARA CURSOS ==========

  // Cargar reseñas de un curso (públicas)
  loadCourseReviews: (courseId) => {
    set((state) => ({
      loading: { ...state.loading, reviews: true },
      error: null
    }))

    try {
      const courseReviews = reviewService.getCourseReviews(courseId)
      const stats = reviewService.getCourseReviewStats(courseId)
      
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
  getCourseStats: (courseId) => {
    return reviewService.getCourseReviewStats(courseId)
  },

  // ========== ACCIONES PARA ADMIN ==========

  // Cargar estudiantes de un curso
  loadCourseStudents: (courseId) => {
    set((state) => ({
      loading: { ...state.loading, students: true },
      error: null
    }))

    try {
      const students = reviewService.getCourseStudents(courseId)
      
      set((state) => ({
        courseStudents: students,
        loading: { ...state.loading, students: false }
      }))
      
      return students
    } catch (error) {
      set((state) => ({
        error: error.message,
        loading: { ...state.loading, students: false }
      }))
      return []
    }
  },

  // Marcar estudiante como completado
  markStudentCompleted: async (userId, courseId, courseName = null, coursePoints = null) => {
    try {
      // Si no se proporciona el nombre o puntos del curso, obtenerlos
      if (!courseName || !coursePoints) {
        const { courses } = get().courseStore || {}
        const course = courses?.find(c => c.id === courseId)
        courseName = courseName || course?.title || 'Curso'
        coursePoints = coursePoints || course?.points || 100
      }
      
      const result = reviewService.markStudentAsCompleted(userId, courseId, courseName, coursePoints)
      
      if (result.success) {
        // Actualizar lista de estudiantes
        const updatedStudents = reviewService.getCourseStudents(courseId)
        set({ courseStudents: updatedStudents })
        
        return { success: true }
      }
      
      throw new Error('Error al marcar estudiante como completado')
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },

  // Cargar reseñas pendientes de moderación
  loadPendingReviews: () => {
    set((state) => ({
      loading: { ...state.loading, reviews: true },
      error: null
    }))

    try {
      const pending = reviewService.getPendingReviews()
      
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
      const result = reviewService.approveReview(reviewId, adminId)
      
      if (result.success) {
        // Actualizar lista de pendientes
        const updatedPending = reviewService.getPendingReviews()
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
      const result = reviewService.rejectReview(reviewId, adminId, reason)
      
      if (result.success) {
        // Actualizar lista de pendientes
        const updatedPending = reviewService.getPendingReviews()
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

  // Crear datos de prueba
  generateTestData: () => {
    const result = reviewService.generateTestData()
    // Recargar datos
    const pending = reviewService.getPendingReviews()
    set({ pendingReviews: pending })
    return result
  },

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