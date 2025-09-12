import baseApi from './baseApi'

/**
 * Area API Service
 * Handles all area-related API operations
 */
class AreaApi {
  /**
   * Get all areas
   */
  async getAreas() {
    return baseApi.get('/areas')
  }

  /**
   * Get single area by ID
   */
  async getAreaById(id) {
    return baseApi.get(`/areas/${id}`)
  }

  /**
   * Get area by slug
   */
  async getAreaBySlug(slug) {
    const areas = await baseApi.get(`/areas?slug=${slug}`)
    return areas[0] || null
  }

  /**
   * Get active areas only
   */
  async getActiveAreas() {
    return baseApi.get('/areas?isActive=true')
  }

  /**
   * Create new area (admin only)
   */
  async createArea(areaData) {
    return baseApi.post('/areas', {
      ...areaData,
      createdAt: new Date().toISOString(),
      isActive: true
    })
  }

  /**
   * Update existing area (admin only)
   */
  async updateArea(id, updates) {
    return baseApi.patch(`/areas/${id}`, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Delete area (admin only)
   */
  async deleteArea(id) {
    return baseApi.delete(`/areas/${id}`)
  }

  /**
   * Get area statistics
   */
  async getAreaStats(areaId) {
    // Get all courses for this area
    const courses = await baseApi.get(`/courses?areaId=${areaId}`)
    
    return {
      totalCourses: courses.length,
      totalStudents: courses.reduce((sum, course) => sum + (course.studentsCount || 0), 0),
      averageRating: courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length || 0
    }
  }

  /**
   * Get levels configuration
   */
  async getLevels() {
    // This should come from backend config
    return [
      {
        id: 'basico',
        name: 'Básico',
        description: 'Para principiantes',
        color: '#4ecdc4'
      },
      {
        id: 'intermedio',
        name: 'Intermedio',
        description: 'Conocimientos previos requeridos',
        color: '#f39c12'
      },
      {
        id: 'avanzado',
        name: 'Avanzado',
        description: 'Para expertos',
        color: '#e74c3c'
      }
    ]
  }
}

export const areaApi = new AreaApi()
export default areaApi