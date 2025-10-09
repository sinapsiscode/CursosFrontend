import apiClient from './apiClient'

/**
 * Servicio para gestión de slides del carrusel principal
 */
class CarouselService {
  /**
   * Obtener todos los slides activos ordenados
   */
  async getActiveSlides() {
    try {
      const response = await apiClient.get('/carousel_slides?active=true&_sort=order&_order=asc')
      return response.data
    } catch (error) {
      console.error('Error obteniendo slides del carrusel:', error)
      throw error
    }
  }

  /**
   * Obtener todos los slides (incluyendo inactivos) - Admin
   */
  async getAllSlides() {
    try {
      const response = await apiClient.get('/carousel_slides?_sort=order&_order=asc')
      return response.data
    } catch (error) {
      console.error('Error obteniendo todos los slides:', error)
      throw error
    }
  }

  /**
   * Obtener slide por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/carousel_slides/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo slide ${id}:`, error)
      throw error
    }
  }

  /**
   * Crear nuevo slide
   */
  async create(slideData) {
    try {
      const newSlide = {
        ...slideData,
        active: slideData.active !== undefined ? slideData.active : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.post('/carousel_slides', newSlide)
      console.log('✅ Slide creado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creando slide:', error)
      throw error
    }
  }

  /**
   * Actualizar slide
   */
  async update(id, slideData) {
    try {
      const updates = {
        ...slideData,
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/carousel_slides/${id}`, updates)
      console.log('✅ Slide actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando slide ${id}:`, error)
      throw error
    }
  }

  /**
   * Eliminar slide
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/carousel_slides/${id}`)
      console.log('✅ Slide eliminado:', id)
      return response.data
    } catch (error) {
      console.error(`Error eliminando slide ${id}:`, error)
      throw error
    }
  }

  /**
   * Activar/Desactivar slide
   */
  async toggleActive(id) {
    try {
      const slide = await this.getById(id)
      const updated = await this.update(id, { active: !slide.active })
      console.log(`✅ Slide ${id} ${updated.active ? 'activado' : 'desactivado'}`)
      return updated
    } catch (error) {
      console.error(`Error toggling slide ${id}:`, error)
      throw error
    }
  }

  /**
   * Reordenar slides
   */
  async reorder(slideIds) {
    try {
      const promises = slideIds.map((id, index) =>
        this.update(id, { order: index + 1 })
      )
      await Promise.all(promises)
      console.log('✅ Slides reordenados')
    } catch (error) {
      console.error('Error reordenando slides:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const carouselService = new CarouselService()
export default carouselService
