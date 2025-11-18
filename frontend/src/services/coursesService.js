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
 * Transform frontend course format to backend format
 */
const transformCourseToBackend = (courseData) => {
  // Area key to ID mapping
  const AREA_KEY_TO_ID = {
    'metalurgia': '1',
    'mineria': '2',
    'geologia': '3'
  }

  // Level mapping
  const levelMap = {
    'básico': 'Básico',
    'basico': 'Básico',
    'intermedio': 'Intermedio',
    'avanzado': 'Avanzado'
  }

  return {
    titulo: courseData.title || courseData.titulo || '',
    descripcion: courseData.description || courseData.descripcion || '',
    areaId: Number(courseData.areaId || AREA_KEY_TO_ID[courseData.area] || 1),
    nivel: levelMap[courseData.level] || courseData.nivel || 'Básico',
    duracion: Number(courseData.duration || courseData.duracion || 0),
    precio: Number(courseData.price !== undefined ? courseData.price : (courseData.precio || 0)),
    descuento: Number(courseData.discount || courseData.descuento || 0),
    instructor: courseData.instructor || '',
    imagen: courseData.thumbnail || courseData.imagen || '',
    activo: courseData.status === 'published' || courseData.activo !== false,
    destacado: courseData.featured || courseData.destacado || false,
    calificacion: Number(courseData.rating || courseData.calificacion || 0),
    estudiantesInscritos: Number(courseData.students || courseData.estudiantesInscritos || 0),
    fechaCreacion: courseData.createdAt || courseData.fechaCreacion || new Date().toISOString(),
    // Campos adicionales del formulario
    lecciones: courseData.lessons || courseData.lecciones || [],
    materiales: courseData.materials || courseData.materiales || []
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
      // Transform frontend format to backend format
      const backendData = transformCourseToBackend(courseData)
      console.log('📤 Enviando curso al backend:', backendData)

      const response = await apiClient.post('/cursos', backendData)
      console.log('✅ Respuesta del servidor:', response.data)

      // Extract data from server response wrapper
      const cursoCreado = response.data.data || response.data
      console.log('✅ Curso creado:', cursoCreado)

      // Transform response back to frontend format
      return transformCourse(cursoCreado)
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
      // Transform frontend format to backend format
      const backendData = transformCourseToBackend(courseData)
      console.log('📤 Actualizando curso en backend:', backendData)

      const response = await apiClient.put(`/cursos/${id}`, backendData)
      console.log('✅ Respuesta del servidor:', response.data)

      // Extract data from server response wrapper
      const cursoActualizado = response.data.data || response.data
      console.log('✅ Curso actualizado:', cursoActualizado)

      // Transform response back to frontend format
      return transformCourse(cursoActualizado)
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
