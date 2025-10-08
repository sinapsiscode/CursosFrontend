import apiClient from './apiClient'

/**
 * Servicio para gestión de exámenes
 */
class ExamenesService {
  /**
   * Obtener todos los exámenes
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      // Agregar filtros si existen
      if (filters.cursoId) params.append('cursoId', filters.cursoId)
      if (filters.activo !== undefined) params.append('activo', filters.activo)

      const queryString = params.toString()
      const url = queryString ? `/examenes?${queryString}` : '/examenes'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo exámenes:', error)
      throw error
    }
  }

  /**
   * Obtener examen por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/examenes/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo examen ${id}:`, error)
      throw error
    }
  }

  /**
   * Crear nuevo examen
   */
  async create(examenData) {
    try {
      const response = await apiClient.post('/examenes', examenData)
      console.log('✅ Examen creado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creando examen:', error)
      throw error
    }
  }

  /**
   * Actualizar examen existente
   */
  async update(id, examenData) {
    try {
      const response = await apiClient.put(`/examenes/${id}`, examenData)
      console.log('✅ Examen actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando examen ${id}:`, error)
      throw error
    }
  }

  /**
   * Actualizar parcialmente un examen
   */
  async patch(id, updates) {
    try {
      const response = await apiClient.patch(`/examenes/${id}`, updates)
      console.log('✅ Examen parcialmente actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando examen ${id}:`, error)
      throw error
    }
  }

  /**
   * Eliminar examen
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/examenes/${id}`)
      console.log('✅ Examen eliminado:', id)
      return response.data
    } catch (error) {
      console.error(`Error eliminando examen ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener exámenes por curso
   */
  async getByCourse(cursoId) {
    try {
      const response = await apiClient.get(`/examenes?cursoId=${cursoId}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo exámenes del curso ${cursoId}:`, error)
      throw error
    }
  }

  /**
   * Obtener exámenes activos
   */
  async getActive() {
    try {
      const response = await apiClient.get('/examenes?activo=true')
      return response.data
    } catch (error) {
      console.error('Error obteniendo exámenes activos:', error)
      throw error
    }
  }

  /**
   * Activar/Desactivar examen
   */
  async toggleStatus(id) {
    try {
      const examen = await this.getById(id)
      const updatedExamen = await this.patch(id, {
        activo: !examen.activo
      })
      console.log('✅ Estado de examen actualizado')
      return updatedExamen
    } catch (error) {
      console.error('Error cambiando estado de examen:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de exámenes
   */
  async getStats() {
    try {
      const examenes = await this.getAll()

      const stats = {
        total: examenes.length,
        activos: examenes.filter(e => e.activo).length,
        inactivos: examenes.filter(e => !e.activo).length,
        totalPreguntas: examenes.reduce((sum, e) => sum + (e.preguntas?.length || 0), 0)
      }

      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }

  /**
   * Agregar pregunta a examen
   */
  async addQuestion(examenId, pregunta) {
    try {
      const examen = await this.getById(examenId)
      const preguntas = examen.preguntas || []

      const updatedExamen = await this.patch(examenId, {
        preguntas: [...preguntas, { ...pregunta, id: Date.now() }]
      })

      console.log('✅ Pregunta agregada al examen')
      return updatedExamen
    } catch (error) {
      console.error('Error agregando pregunta:', error)
      throw error
    }
  }

  /**
   * Eliminar pregunta de examen
   */
  async removeQuestion(examenId, preguntaId) {
    try {
      const examen = await this.getById(examenId)
      const preguntas = examen.preguntas || []

      const updatedExamen = await this.patch(examenId, {
        preguntas: preguntas.filter(p => p.id !== preguntaId)
      })

      console.log('✅ Pregunta eliminada del examen')
      return updatedExamen
    } catch (error) {
      console.error('Error eliminando pregunta:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const examenesService = new ExamenesService()
export default examenesService
