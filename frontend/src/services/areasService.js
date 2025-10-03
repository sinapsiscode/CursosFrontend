import apiClient from './apiClient'

/**
 * Servicio para gestión de áreas de estudio
 */
class AreasService {
  /**
   * Obtener todas las áreas
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      // Agregar filtros si existen
      if (filters.activo !== undefined) params.append('activo', filters.activo)

      const queryString = params.toString()
      const url = queryString ? `/areas?${queryString}` : '/areas'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo áreas:', error)
      throw error
    }
  }

  /**
   * Obtener área por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/areas/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo área ${id}:`, error)
      throw error
    }
  }

  /**
   * Crear nueva área
   */
  async create(areaData) {
    try {
      const response = await apiClient.post('/areas', areaData)
      console.log('✅ Área creada:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creando área:', error)
      throw error
    }
  }

  /**
   * Actualizar área existente
   */
  async update(id, areaData) {
    try {
      const response = await apiClient.put(`/areas/${id}`, areaData)
      console.log('✅ Área actualizada:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando área ${id}:`, error)
      throw error
    }
  }

  /**
   * Actualizar parcialmente un área
   */
  async patch(id, updates) {
    try {
      const response = await apiClient.patch(`/areas/${id}`, updates)
      console.log('✅ Área parcialmente actualizada:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando área ${id}:`, error)
      throw error
    }
  }

  /**
   * Eliminar área
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/areas/${id}`)
      console.log('✅ Área eliminada:', id)
      return response.data
    } catch (error) {
      console.error(`Error eliminando área ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener áreas activas
   */
  async getActive() {
    try {
      const response = await apiClient.get('/areas?activo=true')
      return response.data
    } catch (error) {
      console.error('Error obteniendo áreas activas:', error)
      throw error
    }
  }

  /**
   * Activar/Desactivar área
   */
  async toggleStatus(id) {
    try {
      const area = await this.getById(id)
      const updatedArea = await this.patch(id, {
        activo: !area.activo
      })
      console.log('✅ Estado de área actualizado')
      return updatedArea
    } catch (error) {
      console.error('Error cambiando estado de área:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de áreas
   */
  async getStats() {
    try {
      const areas = await this.getAll()

      const stats = {
        total: areas.length,
        activas: areas.filter(a => a.activo).length,
        inactivas: areas.filter(a => !a.activo).length
      }

      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const areasService = new AreasService()
export default areasService
