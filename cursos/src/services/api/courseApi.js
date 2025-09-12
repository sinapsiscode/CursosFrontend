import baseApi from './baseApi'
import { mockAPI } from '../mockData.js'

/**
 * Course API Service
 * Handles all course-related API operations
 * Migrado desde frontend/src/services/api.js con mejores prácticas
 */
class CourseApi {
  /**
   * Get all courses with optional filters
   */
  async getCourses(filters = {}) {
    const params = new URLSearchParams()
    
    if (filters.area) params.append('area', filters.area)
    if (filters.level) params.append('level', filters.level)
    if (filters.search) params.append('q', filters.search)
    if (filters.featured) params.append('isFeatured', 'true')
    if (filters.popular) params.append('isPopular', 'true')
    
    const queryString = params.toString()
    return baseApi.get(`/courses${queryString ? `?${queryString}` : ''}`)
  }

  /**
   * Get single course by ID
   */
  async getCourseById(id) {
    return baseApi.get(`/courses/${id}`)
  }

  /**
   * Get courses by area
   */
  async getCoursesByArea(area) {
    return baseApi.get(`/courses?area=${area}`)
  }

  /**
   * Create new course (admin only)
   */
  async createCourse(courseData) {
    return baseApi.post('/courses', {
      ...courseData,
      createdAt: new Date().toISOString(),
      isActive: true,
      studentsCount: 0,
      rating: 0
    })
  }

  /**
   * Update existing course (admin only)
   */
  async updateCourse(id, updates) {
    return baseApi.patch(`/courses/${id}`, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Delete course (admin only)
   */
  async deleteCourse(id) {
    return baseApi.delete(`/courses/${id}`)
  }

  /**
   * Get featured courses
   */
  async getFeaturedCourses() {
    return baseApi.get('/courses?isFeatured=true')
  }

  /**
   * Get popular courses
   */
  async getPopularCourses() {
    return baseApi.get('/courses?isPopular=true&_sort=studentsCount&_order=desc')
  }

  /**
   * Get course statistics
   */
  async getCourseStats(courseId) {
    // This would typically be a separate endpoint
    const course = await this.getCourseById(courseId)
    return {
      totalStudents: course.studentsCount || 0,
      averageRating: course.rating || 0,
      completionRate: 0.75, // This should come from backend
      totalLessons: course.lessons?.length || 0
    }
  }

  /**
   * Search courses
   */
  async searchCourses(query) {
    try {
      return await baseApi.get(`/courses?q=${encodeURIComponent(query)}`)
    } catch (error) {
      console.warn('Usando búsqueda local:', error.message)
      return this.searchCoursesLocal(query)
    }
  }

  // Enrollment management
  async getCoursesWithEnrollment(area = null) {
    try {
      if (import.meta.env.DEV) {
        return this.getCoursesWithEnrollmentLocal(area)
      }
      return await baseApi.get(`/courses/enrollment${area ? `?area=${area}` : ''}`)
    } catch (error) {
      console.warn('Usando datos locales:', error.message)
      return this.getCoursesWithEnrollmentLocal(area)
    }
  }

  async updateCourseEnrollment(courseId, newEnrollmentCount) {
    try {
      const result = await baseApi.patch(`/courses/${courseId}/enrollment`, { 
        enrollmentCount: newEnrollmentCount 
      })
      await this.saveSessionEnrollmentChange(courseId, newEnrollmentCount)
      return result
    } catch (error) {
      console.warn('Guardando cambio localmente:', error.message)
      return this.updateEnrollmentLocal(courseId, newEnrollmentCount)
    }
  }

  // Video management
  async getVideoUrl(courseId, lessonId) {
    try {
      return await baseApi.get(`/courses/${courseId}/lessons/${lessonId}/video`)
    } catch (error) {
      console.warn('Generando URL de video simulada:', error.message)
      return this.getVideoUrlLocal(courseId, lessonId)
    }
  }

  // Progress management
  async updateUserProgress(userId, courseId, progress) {
    try {
      return await baseApi.patch(`/users/${userId}/courses/${courseId}/progress`, { 
        progress 
      })
    } catch (error) {
      console.warn('Guardando progreso localmente:', error.message)
      return this.updateProgressLocal(userId, courseId, progress)
    }
  }

  // MÉTODOS LOCALES (fallback para desarrollo)

  async getCoursesLocal(area = null) {
    try {
      return await mockAPI.getCourses(area)
    } catch (error) {
      console.error('Error obteniendo cursos locales:', error)
      return []
    }
  }

  async getCourseByIdLocal(id) {
    try {
      return await mockAPI.getCourseById(id)
    } catch (error) {
      console.error('Error obteniendo curso local:', error)
      return null
    }
  }

  async searchCoursesLocal(query) {
    try {
      return await mockAPI.searchCourses(query)
    } catch (error) {
      console.error('Error en búsqueda local:', error)
      return []
    }
  }

  async getCoursesWithEnrollmentLocal(area = null) {
    try {
      const courses = await mockAPI.getCourses(area)
      
      // Aplicar cambios temporales guardados en sessionStorage
      const enrollmentChanges = this.getSessionEnrollmentChanges()
      
      return courses.map(course => {
        const tempEnrollment = enrollmentChanges[course.id]
        const enrolledStudents = tempEnrollment !== undefined ? tempEnrollment : course.enrolledStudents || 0
        
        return {
          ...course,
          enrolledStudents,
          enrollmentData: {
            totalEnrolled: enrolledStudents,
            totalHistorical: course.students || 0,
            enrollmentRate: enrolledStudents && course.students 
              ? Math.round((enrolledStudents / course.students) * 100)
              : 0
          }
        }
      })
    } catch (error) {
      console.error('Error obteniendo cursos con inscripciones:', error)
      return []
    }
  }

  async getVideoUrlLocal(courseId, lessonId) {
    // Simular URL de video
    const videoUrl = `https://example.com/videos/${courseId}/${lessonId}.mp4`
    return { 
      success: true,
      videoUrl, 
      duration: 1800 // 30 minutos
    }
  }

  async updateProgressLocal(userId, courseId, progress) {
    // Simular actualización de progreso
    console.log(`📊 Actualizando progreso: Usuario ${userId}, Curso ${courseId}, Progreso ${progress}%`)
    return { success: true, progress }
  }

  async updateEnrollmentLocal(courseId, newEnrollmentCount) {
    // Guardar el cambio en sessionStorage para persistencia temporal
    this.saveSessionEnrollmentChange(courseId, newEnrollmentCount)
    
    return { 
      success: true, 
      courseId,
      newEnrollmentCount,
      timestamp: new Date()
    }
  }

  // Utilidades para manejo de inscripciones temporales
  getSessionEnrollmentChanges() {
    try {
      const stored = sessionStorage.getItem('admin_enrollment_changes')
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error reading enrollment changes:', error)
      return {}
    }
  }

  saveSessionEnrollmentChange(courseId, newEnrollment) {
    try {
      const changes = this.getSessionEnrollmentChanges()
      changes[courseId] = newEnrollment
      sessionStorage.setItem('admin_enrollment_changes', JSON.stringify(changes))
    } catch (error) {
      console.error('Error saving enrollment change:', error)
    }
  }

  clearSessionEnrollmentChanges() {
    sessionStorage.removeItem('admin_enrollment_changes')
    console.log('🧹 Cambios temporales de inscripción eliminados')
  }

  // Fallback con MockAPI cuando falla el servidor
  async handleRequest(requestFn, fallbackFn) {
    try {
      // Simular delay de red en desarrollo
      if (import.meta.env.DEV) {
        const delay = Math.random() * 500 + 200
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      return await requestFn()
    } catch (error) {
      console.warn('API Error, usando fallback:', error.message)
      
      if (fallbackFn) {
        return fallbackFn()
      }
      
      throw error
    }
  }

  // Override métodos principales con manejo de errores
  async getCourses(filters = {}) {
    return this.handleRequest(
      () => {
        const params = new URLSearchParams()
        
        if (filters.area) params.append('area', filters.area)
        if (filters.level) params.append('level', filters.level)
        if (filters.search) params.append('q', filters.search)
        if (filters.featured) params.append('isFeatured', 'true')
        if (filters.popular) params.append('isPopular', 'true')
        
        const queryString = params.toString()
        return baseApi.get(`/courses${queryString ? `?${queryString}` : ''}`)
      },
      () => this.getCoursesLocal(filters.area)
    )
  }

  async getCourseById(id) {
    return this.handleRequest(
      () => baseApi.get(`/courses/${id}`),
      () => this.getCourseByIdLocal(id)
    )
  }

  async getFeaturedCourses() {
    return this.handleRequest(
      () => baseApi.get('/courses?isFeatured=true'),
      async () => {
        const courses = await this.getCoursesLocal()
        return courses.filter(course => course.featured)
      }
    )
  }

  async getPopularCourses() {
    return this.handleRequest(
      () => baseApi.get('/courses?isPopular=true&_sort=studentsCount&_order=desc'),
      async () => {
        const courses = await this.getCoursesLocal()
        return courses.filter(course => course.popular)
      }
    )
  }

  async getNewCourses(area = null) {
    return this.handleRequest(
      () => baseApi.get(`/courses?isNew=true${area ? `&area=${area}` : ''}`),
      async () => {
        const courses = await this.getCoursesLocal(area)
        return courses.filter(course => course.isNew)
      }
    )
  }
}

export const courseApi = new CourseApi()
export default courseApi