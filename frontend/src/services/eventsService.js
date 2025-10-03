import apiClient from './apiClient'

/**
 * Servicio para gestión de eventos
 */
class EventsService {
  /**
   * Obtener todos los eventos
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      // Agregar filtros si existen
      if (filters.tipo) params.append('tipo', filters.tipo)
      if (filters.area) params.append('areaId', filters.area)
      if (filters.activo !== undefined) params.append('activo', filters.activo)

      const queryString = params.toString()
      const url = queryString ? `/eventos?${queryString}` : '/eventos'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo eventos:', error)
      throw error
    }
  }

  /**
   * Obtener evento por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/eventos/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo evento ${id}:`, error)
      throw error
    }
  }

  /**
   * Crear nuevo evento
   */
  async create(eventoData) {
    try {
      const response = await apiClient.post('/eventos', eventoData)
      console.log('✅ Evento creado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creando evento:', error)
      throw error
    }
  }

  /**
   * Actualizar evento existente
   */
  async update(id, eventoData) {
    try {
      const response = await apiClient.put(`/eventos/${id}`, eventoData)
      console.log('✅ Evento actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando evento ${id}:`, error)
      throw error
    }
  }

  /**
   * Actualizar parcialmente un evento
   */
  async patch(id, updates) {
    try {
      const response = await apiClient.patch(`/eventos/${id}`, updates)
      console.log('✅ Evento parcialmente actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando evento ${id}:`, error)
      throw error
    }
  }

  /**
   * Eliminar evento
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/eventos/${id}`)
      console.log('✅ Evento eliminado:', id)
      return response.data
    } catch (error) {
      console.error(`Error eliminando evento ${id}:`, error)
      throw error
    }
  }

  /**
   * Notificar usuarios sobre un evento
   */
  async notifyUsers(eventoId, area) {
    try {
      // Simular notificación (esto podría ser un endpoint custom en el backend)
      console.log(`📧 Notificando usuarios interesados en ${area} sobre evento ${eventoId}`)

      // Por ahora retornamos un conteo simulado
      const count = Math.floor(Math.random() * 100) + 20
      return {
        success: true,
        count,
        message: `Se notificó a ${count} usuarios interesados en ${area}`
      }
    } catch (error) {
      console.error('Error notificando usuarios:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de eventos
   */
  async getStats() {
    try {
      const eventos = await this.getAll()

      const stats = {
        total: eventos.length,
        webinars: eventos.filter(e => e.tipo === 'webinar').length,
        promociones: eventos.filter(e => e.tipo === 'promotion').length,
        totalRegistros: eventos.reduce((sum, e) => sum + (e.registros || 0), 0)
      }

      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }

  /**
   * Obtener tipos de eventos configurados
   */
  async getEventTypes() {
    try {
      // Por ahora retornamos tipos por defecto
      // Podrías crear un endpoint /event-types en el backend
      return [
        { id: 1, name: 'Webinar', value: 'webinar', color: 'bg-blue-600' },
        { id: 2, name: 'Masterclass', value: 'masterclass', color: 'bg-purple-600' },
        { id: 3, name: 'Promoción', value: 'promotion', color: 'bg-green-600' },
        { id: 4, name: 'Bundle de Cursos', value: 'bundle', color: 'bg-orange-600' }
      ]
    } catch (error) {
      console.error('Error obteniendo tipos de eventos:', error)
      throw error
    }
  }

  /**
   * Obtener eventos por área
   */
  async getByArea(areaId) {
    try {
      const response = await apiClient.get(`/eventos?areaId=${areaId}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo eventos del área ${areaId}:`, error)
      throw error
    }
  }

  /**
   * Obtener eventos activos
   */
  async getActive() {
    try {
      const response = await apiClient.get('/eventos?activo=true')
      return response.data
    } catch (error) {
      console.error('Error obteniendo eventos activos:', error)
      throw error
    }
  }

  /**
   * Registrar usuario en un evento
   */
  async registerUser(eventoId, userId) {
    try {
      // Esto podría ser un endpoint POST /eventos/:id/register
      // Por ahora lo simulamos actualizando el contador
      const evento = await this.getById(eventoId)

      if (evento.registros !== null && evento.maxRegistros) {
        if (evento.registros >= evento.maxRegistros) {
          throw new Error('El evento ha alcanzado el máximo de registros')
        }
      }

      const updatedEvento = await this.patch(eventoId, {
        registros: (evento.registros || 0) + 1
      })

      console.log('✅ Usuario registrado en evento')
      return updatedEvento
    } catch (error) {
      console.error('Error registrando usuario en evento:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const eventsService = new EventsService()
export default eventsService
