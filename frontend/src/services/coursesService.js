import apiClient from './apiClient'
import { AREA_ID_TO_KEY } from '../constants/areaIds'

/**
 * Transform backend course format to frontend format
 */
const transformCourse = (curso) => {
  if (!curso) return null

  // Map areaId to area key
  const area = AREA_ID_TO_KEY[String(curso.areaId)] || 'metalurgia'

  // Map nivel to level (lowercase for consistency)
  const levelMap = {
    'Básico': 'básico',
    'Intermedio': 'intermedio',
    'Avanzado': 'avanzado'
  }
  const level = levelMap[curso.nivel] || curso.nivel?.toLowerCase() || 'básico'

  return {
    ...curso,
    area,
    level,
    // Keep original fields for backward compatibility
    areaId: curso.areaId,
    nivel: curso.nivel
  }
}

/**
 * Servicio para gestión de cursos
 */
class CoursesService {
  /**
   * Obtener todos los cursos
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      // Agregar filtros si existen
      if (filters.areaId) params.append('areaId', filters.areaId)
      if (filters.nivel) params.append('nivel', filters.nivel)
      if (filters.activo !== undefined) params.append('activo', filters.activo)
      if (filters.destacado !== undefined) params.append('destacado', filters.destacado)

      const queryString = params.toString()
      const url = queryString ? `/cursos?${queryString}` : '/cursos'

      const response = await apiClient.get(url)

      // Transform courses to frontend format
      const cursos = Array.isArray(response.data) ? response.data : []
      return cursos.map(transformCourse)
    } catch (error) {
      console.error('Error obteniendo cursos:', error)
      throw error
    }
  }

  /**
   * Obtener curso por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/cursos/${id}`)
      return transformCourse(response.data)
    } catch (error) {
      console.error(`Error obteniendo curso ${id}:`, error)
      throw error
    }
  }

  /**
   * Crear nuevo curso
   */
  async create(courseData) {
    try {
      const response = await apiClient.post('/cursos', courseData)
      console.log('✅ Curso creado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creando curso:', error)
      throw error
    }
  }

  /**
   * Actualizar curso existente
   */
  async update(id, courseData) {
    try {
      const response = await apiClient.put(`/cursos/${id}`, courseData)
      console.log('✅ Curso actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando curso ${id}:`, error)
      throw error
    }
  }

  /**
   * Actualizar parcialmente un curso
   */
  async patch(id, updates) {
    try {
      const response = await apiClient.patch(`/cursos/${id}`, updates)
      console.log('✅ Curso parcialmente actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando curso ${id}:`, error)
      throw error
    }
  }

  /**
   * Eliminar curso
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/cursos/${id}`)
      console.log('✅ Curso eliminado:', id)
      return response.data
    } catch (error) {
      console.error(`Error eliminando curso ${id}:`, error)
      throw error
    }
  }

  /**
   * Buscar cursos por texto
   */
  async search(query) {
    try {
      const response = await apiClient.get(`/cursos?q=${encodeURIComponent(query)}`)
      const cursos = Array.isArray(response.data) ? response.data : []
      return cursos.map(transformCourse)
    } catch (error) {
      console.error('Error buscando cursos:', error)
      throw error
    }
  }

  /**
   * Obtener cursos destacados
   */
  async getFeatured(areaId = null) {
    try {
      const url = areaId
        ? `/cursos?destacado=true&areaId=${areaId}`
        : '/cursos?destacado=true'
      const response = await apiClient.get(url)
      const cursos = Array.isArray(response.data) ? response.data : []
      return cursos.map(transformCourse)
    } catch (error) {
      console.error('Error obteniendo cursos destacados:', error)
      throw error
    }
  }

  /**
   * Obtener cursos por área
   */
  async getByArea(areaId) {
    try {
      const response = await apiClient.get(`/cursos?areaId=${areaId}`)
      const cursos = Array.isArray(response.data) ? response.data : []
      return cursos.map(transformCourse)
    } catch (error) {
      console.error(`Error obteniendo cursos del área ${areaId}:`, error)
      throw error
    }
  }

  /**
   * Obtener cursos activos
   */
  async getActive() {
    try {
      const response = await apiClient.get('/cursos?activo=true')
      const cursos = Array.isArray(response.data) ? response.data : []
      return cursos.map(transformCourse)
    } catch (error) {
      console.error('Error obteniendo cursos activos:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de cursos
   */
  async getStats() {
    try {
      const cursos = await this.getAll()

      const stats = {
        total: cursos.length,
        activos: cursos.filter(c => c.activo).length,
        destacados: cursos.filter(c => c.destacado).length,
        totalEstudiantes: cursos.reduce((sum, c) => sum + (c.estudiantesInscritos || 0), 0)
      }

      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const coursesService = new CoursesService()
export default coursesService
