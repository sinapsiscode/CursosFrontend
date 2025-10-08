import apiClient from './apiClient'

/**
 * Servicio para gestión de intereses y comportamiento de usuarios
 * USA JSON SERVER - Tracking de navegación, vistas de cursos, búsquedas, etc.
 */
class UserInterestsService {
  /**
   * Obtener intereses de un usuario
   */
  async getUserInterests(userId) {
    try {
      const response = await apiClient.get(`/user_interests?userId=${userId}`)
      const userInterests = response.data

      if (userInterests.length === 0) {
        // Crear registro inicial
        return await this.createUserInterests(userId)
      }

      return userInterests[0]
    } catch (error) {
      console.error(`Error obteniendo intereses de usuario ${userId}:`, error)
      throw error
    }
  }

  /**
   * Crear registro de intereses para nuevo usuario
   */
  async createUserInterests(userId) {
    try {
      const newUserInterests = {
        userId,
        viewedCourses: [],
        viewedCoursesDetails: {},
        searchedTerms: [],
        favoriteAreas: [],
        completedCourses: [],
        registeredEvents: [],
        interestScore: {
          metalurgia: 0,
          mineria: 0,
          geologia: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.post('/user_interests', newUserInterests)
      console.log(`✅ Intereses creados para usuario ${userId}`)
      return response.data
    } catch (error) {
      console.error('Error creando intereses de usuario:', error)
      throw error
    }
  }

  /**
   * Registrar vista de curso
   */
  async trackCourseView(userId, courseData) {
    try {
      const userInterests = await this.getUserInterests(userId)

      // Actualizar cursos vistos
      const viewedCourses = userInterests.viewedCourses || []
      if (!viewedCourses.includes(courseData.courseId)) {
        viewedCourses.push(courseData.courseId)
      }

      // Guardar detalles del curso
      const viewedCoursesDetails = userInterests.viewedCoursesDetails || {}
      viewedCoursesDetails[courseData.courseId] = {
        title: courseData.courseTitle,
        area: courseData.area,
        tags: courseData.tags || [],
        lastViewed: new Date().toISOString()
      }

      // Incrementar score del área
      const interestScore = { ...userInterests.interestScore }
      if (courseData.area && interestScore[courseData.area] !== undefined) {
        interestScore[courseData.area] += 10
      }

      const updates = {
        viewedCourses,
        viewedCoursesDetails,
        interestScore,
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/user_interests/${userInterests.id}`, updates)
      console.log(`✅ Vista de curso registrada: ${courseData.courseId}`)
      return response.data
    } catch (error) {
      console.error('Error registrando vista de curso:', error)
      throw error
    }
  }

  /**
   * Registrar búsqueda
   */
  async trackSearch(userId, searchData) {
    try {
      const userInterests = await this.getUserInterests(userId)

      const searchedTerms = userInterests.searchedTerms || []
      searchedTerms.push({
        term: searchData.query,
        area: searchData.area,
        timestamp: new Date().toISOString()
      })

      // Incrementar score si busca en área específica
      const interestScore = { ...userInterests.interestScore }
      if (searchData.area && interestScore[searchData.area] !== undefined) {
        interestScore[searchData.area] += 5
      }

      const updates = {
        searchedTerms,
        interestScore,
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/user_interests/${userInterests.id}`, updates)
      console.log(`✅ Búsqueda registrada: "${searchData.query}"`)
      return response.data
    } catch (error) {
      console.error('Error registrando búsqueda:', error)
      throw error
    }
  }

  /**
   * Registrar curso completado
   */
  async trackCourseCompletion(userId, courseId, area = null) {
    try {
      const userInterests = await this.getUserInterests(userId)

      const completedCourses = userInterests.completedCourses || []
      if (!completedCourses.includes(courseId)) {
        completedCourses.push(courseId)
      }

      const interestScore = { ...userInterests.interestScore }
      if (area && interestScore[area] !== undefined) {
        interestScore[area] += 20
      }

      const updates = {
        completedCourses,
        interestScore,
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/user_interests/${userInterests.id}`, updates)
      console.log(`✅ Curso completado registrado: ${courseId}`)
      return response.data
    } catch (error) {
      console.error('Error registrando curso completado:', error)
      throw error
    }
  }

  /**
   * Registrar inscripción a evento
   */
  async trackEventRegistration(userId, eventId, area = null) {
    try {
      const userInterests = await this.getUserInterests(userId)

      const registeredEvents = userInterests.registeredEvents || []
      if (!registeredEvents.includes(eventId)) {
        registeredEvents.push(eventId)
      }

      const interestScore = { ...userInterests.interestScore }
      if (area && interestScore[area] !== undefined) {
        interestScore[area] += 15
      }

      const updates = {
        registeredEvents,
        interestScore,
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/user_interests/${userInterests.id}`, updates)
      console.log(`✅ Registro de evento guardado: ${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error registrando evento:', error)
      throw error
    }
  }

  /**
   * Obtener área de mayor interés
   */
  async getTopInterestArea(userId) {
    try {
      const userInterests = await this.getUserInterests(userId)
      const scores = userInterests.interestScore || {}

      let topArea = null
      let maxScore = 0

      for (const [area, score] of Object.entries(scores)) {
        if (score > maxScore) {
          maxScore = score
          topArea = area
        }
      }

      return { area: topArea, score: maxScore }
    } catch (error) {
      console.error('Error obteniendo área de mayor interés:', error)
      throw error
    }
  }

  /**
   * Obtener recomendaciones basadas en intereses
   */
  async getRecommendations(userId) {
    try {
      const userInterests = await this.getUserInterests(userId)

      return {
        topArea: await this.getTopInterestArea(userId),
        viewedCount: userInterests.viewedCourses?.length || 0,
        completedCount: userInterests.completedCourses?.length || 0,
        searchCount: userInterests.searchedTerms?.length || 0,
        eventsRegistered: userInterests.registeredEvents?.length || 0,
        interestScores: userInterests.interestScore
      }
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error)
      throw error
    }
  }

  /**
   * Resetear intereses de usuario (admin)
   */
  async resetUserInterests(userId) {
    try {
      const userInterests = await this.getUserInterests(userId)

      const updates = {
        viewedCourses: [],
        viewedCoursesDetails: {},
        searchedTerms: [],
        completedCourses: [],
        registeredEvents: [],
        interestScore: {
          metalurgia: 0,
          mineria: 0,
          geologia: 0
        },
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/user_interests/${userInterests.id}`, updates)
      console.log(`✅ Intereses reseteados para usuario ${userId}`)
      return response.data
    } catch (error) {
      console.error('Error reseteando intereses:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas globales
   */
  async getGlobalStats() {
    try {
      const response = await apiClient.get('/user_interests')
      const allInterests = response.data

      return {
        totalUsers: allInterests.length,
        totalViews: allInterests.reduce((sum, u) => sum + (u.viewedCourses?.length || 0), 0),
        totalSearches: allInterests.reduce((sum, u) => sum + (u.searchedTerms?.length || 0), 0),
        totalCompletions: allInterests.reduce((sum, u) => sum + (u.completedCourses?.length || 0), 0),
        areaPopularity: {
          metalurgia: allInterests.reduce((sum, u) => sum + (u.interestScore?.metalurgia || 0), 0),
          mineria: allInterests.reduce((sum, u) => sum + (u.interestScore?.mineria || 0), 0),
          geologia: allInterests.reduce((sum, u) => sum + (u.interestScore?.geologia || 0), 0)
        }
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas globales:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const userInterestsService = new UserInterestsService()
export default userInterestsService
