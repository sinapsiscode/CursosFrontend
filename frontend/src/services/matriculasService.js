import apiClient from './apiClient'

/**
 * Servicio para gestión de matrículas/inscripciones de estudiantes
 * USA JSON SERVER - Reemplaza localStorage('student_enrollments')
 */
class MatriculasService {
  /**
   * Obtener todas las matrículas con filtros
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      if (filters.studentId) params.append('studentId', filters.studentId)
      if (filters.courseId) params.append('courseId', filters.courseId)
      if (filters.status) params.append('status', filters.status)

      const queryString = params.toString()
      const url = queryString ? `/matriculas?${queryString}` : '/matriculas'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo matrículas:', error)
      throw error
    }
  }

  /**
   * Obtener matrícula por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/matriculas/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo matrícula ${id}:`, error)
      throw error
    }
  }

  /**
   * Verificar si estudiante está matriculado en curso
   */
  async isStudentEnrolled(studentId, courseId) {
    try {
      const matriculas = await this.getAll({ studentId, courseId })
      return matriculas.some(m => m.status === 'active' || m.status === 'completed')
    } catch (error) {
      console.error('Error verificando matrícula:', error)
      return false
    }
  }

  /**
   * Obtener matrículas de un estudiante
   */
  async getStudentEnrollments(studentId) {
    try {
      const matriculas = await this.getAll({ studentId })

      // Ordenar por fecha de matrícula (más recientes primero)
      return matriculas.sort((a, b) =>
        new Date(b.enrolledAt) - new Date(a.enrolledAt)
      )
    } catch (error) {
      console.error(`Error obteniendo matrículas del estudiante ${studentId}:`, error)
      throw error
    }
  }

  /**
   * Obtener estudiantes matriculados en un curso
   */
  async getCourseEnrollments(courseId) {
    try {
      const matriculas = await this.getAll({ courseId })

      // Ordenar por fecha de matrícula (más recientes primero)
      return matriculas.sort((a, b) =>
        new Date(b.enrolledAt) - new Date(a.enrolledAt)
      )
    } catch (error) {
      console.error(`Error obteniendo matrículas del curso ${courseId}:`, error)
      throw error
    }
  }

  /**
   * Crear nueva matrícula (inscribir estudiante)
   */
  async create(enrollmentData) {
    try {
      // Verificar si ya está matriculado
      const alreadyEnrolled = await this.isStudentEnrolled(
        enrollmentData.studentId,
        enrollmentData.courseId
      )

      if (alreadyEnrolled) {
        return {
          success: false,
          error: 'El estudiante ya está matriculado en este curso'
        }
      }

      const newEnrollment = {
        studentId: enrollmentData.studentId,
        courseId: enrollmentData.courseId,
        status: enrollmentData.status || 'active', // active | completed | cancelled
        progress: enrollmentData.progress || 0,
        enrolledAt: new Date().toISOString(),
        completedAt: null,
        certificateGenerated: false,
        paymentStatus: enrollmentData.paymentStatus || 'pending', // pending | paid | refunded
        paymentAmount: enrollmentData.paymentAmount || 0,
        couponUsed: enrollmentData.couponUsed || null,
        metadata: enrollmentData.metadata || {}
      }

      const response = await apiClient.post('/matriculas', newEnrollment)
      console.log('✅ Matrícula creada:', response.data)
      return { success: true, enrollment: response.data }
    } catch (error) {
      console.error('Error creando matrícula:', error)
      throw error
    }
  }

  /**
   * Actualizar matrícula existente
   */
  async update(id, updateData) {
    try {
      const updates = {
        ...updateData,
        updatedAt: new Date().toISOString()
      }

      // Si se marca como completado, agregar fecha
      if (updateData.status === 'completed' && !updateData.completedAt) {
        updates.completedAt = new Date().toISOString()
      }

      const response = await apiClient.patch(`/matriculas/${id}`, updates)
      console.log(`✅ Matrícula ${id} actualizada`)
      return { success: true, enrollment: response.data }
    } catch (error) {
      console.error(`Error actualizando matrícula ${id}:`, error)
      throw error
    }
  }

  /**
   * Actualizar progreso de matrícula
   */
  async updateProgress(id, progress) {
    try {
      const updates = {
        progress,
        updatedAt: new Date().toISOString()
      }

      // Si progreso es 100%, marcar como completado
      if (progress >= 100) {
        updates.status = 'completed'
        updates.completedAt = new Date().toISOString()
      }

      const response = await apiClient.patch(`/matriculas/${id}`, updates)
      console.log(`✅ Progreso actualizado: ${progress}%`)
      return { success: true, enrollment: response.data }
    } catch (error) {
      console.error(`Error actualizando progreso:`, error)
      throw error
    }
  }

  /**
   * Cancelar matrícula
   */
  async cancel(id, reason = '') {
    try {
      const updates = {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason
      }

      const response = await apiClient.patch(`/matriculas/${id}`, updates)
      console.log(`✅ Matrícula ${id} cancelada`)
      return { success: true, enrollment: response.data }
    } catch (error) {
      console.error(`Error cancelando matrícula ${id}:`, error)
      throw error
    }
  }

  /**
   * Eliminar matrícula
   */
  async delete(id) {
    try {
      await apiClient.delete(`/matriculas/${id}`)
      console.log('✅ Matrícula eliminada:', id)
      return { success: true }
    } catch (error) {
      console.error(`Error eliminando matrícula ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de un curso
   */
  async getCourseStats(courseId) {
    try {
      const enrollments = await this.getCourseEnrollments(courseId)

      return {
        total: enrollments.length,
        active: enrollments.filter(e => e.status === 'active').length,
        completed: enrollments.filter(e => e.status === 'completed').length,
        cancelled: enrollments.filter(e => e.status === 'cancelled').length,
        averageProgress: enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length || 0,
        revenue: enrollments
          .filter(e => e.paymentStatus === 'paid')
          .reduce((sum, e) => sum + (e.paymentAmount || 0), 0)
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas del curso:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de un estudiante
   */
  async getStudentStats(studentId) {
    try {
      const enrollments = await this.getStudentEnrollments(studentId)

      return {
        totalCourses: enrollments.length,
        activeCourses: enrollments.filter(e => e.status === 'active').length,
        completedCourses: enrollments.filter(e => e.status === 'completed').length,
        cancelledCourses: enrollments.filter(e => e.status === 'cancelled').length,
        averageProgress: enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length || 0,
        totalSpent: enrollments
          .filter(e => e.paymentStatus === 'paid')
          .reduce((sum, e) => sum + (e.paymentAmount || 0), 0)
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas del estudiante:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const matriculasService = new MatriculasService()
export default matriculasService
