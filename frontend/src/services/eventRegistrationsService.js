import apiClient from './apiClient'

/**
 * Servicio para gestión de registros de eventos
 * USA JSON SERVER
 */
class EventRegistrationsService {
  /**
   * Obtener todos los registros con filtros
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      if (filters.eventId) params.append('eventId', filters.eventId)
      if (filters.userId) params.append('userId', filters.userId)
      if (filters.email) params.append('email', filters.email)

      const queryString = params.toString()
      const url = queryString ? `/event_registrations?${queryString}` : '/event_registrations'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo registros de eventos:', error)
      throw error
    }
  }

  /**
   * Verificar si usuario está registrado en evento
   */
  async isUserRegistered(eventId, email) {
    try {
      const registrations = await this.getAll({ eventId, email })
      return registrations.length > 0
    } catch (error) {
      console.error('Error verificando registro:', error)
      throw error
    }
  }

  /**
   * Registrar usuario en evento
   */
  async registerForEvent(eventId, userData) {
    try {
      // Verificar si ya está registrado
      const alreadyRegistered = await this.isUserRegistered(eventId, userData.email)

      if (alreadyRegistered) {
        return { success: false, error: 'Ya estás registrado en este evento' }
      }

      const newRegistration = {
        eventId,
        userId: userData.userId || null,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || null,
        company: userData.company || null,
        registeredAt: new Date().toISOString()
      }

      const response = await apiClient.post('/event_registrations', newRegistration)
      console.log('✅ Registro de evento creado:', response.data)
      return { success: true, registration: response.data }
    } catch (error) {
      console.error('Error registrando en evento:', error)
      throw error
    }
  }

  /**
   * Obtener registros de un evento
   */
  async getEventRegistrations(eventId) {
    try {
      const registrations = await this.getAll({ eventId })

      // Ordenar por fecha de registro (más recientes primero)
      return registrations.sort((a, b) =>
        new Date(b.registeredAt) - new Date(a.registeredAt)
      )
    } catch (error) {
      console.error(`Error obteniendo registros del evento ${eventId}:`, error)
      throw error
    }
  }

  /**
   * Obtener eventos registrados por usuario
   */
  async getUserRegistrations(userId = null, email = null) {
    try {
      const filters = {}
      if (userId) filters.userId = userId
      if (email) filters.email = email

      const registrations = await this.getAll(filters)

      return registrations.sort((a, b) =>
        new Date(b.registeredAt) - new Date(a.registeredAt)
      )
    } catch (error) {
      console.error('Error obteniendo registros de usuario:', error)
      throw error
    }
  }

  /**
   * Cancelar registro
   */
  async cancelRegistration(registrationId) {
    try {
      await apiClient.delete(`/event_registrations/${registrationId}`)
      console.log('✅ Registro cancelado:', registrationId)
      return { success: true }
    } catch (error) {
      console.error(`Error cancelando registro ${registrationId}:`, error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de un evento
   */
  async getEventStats(eventId) {
    try {
      const registrations = await this.getEventRegistrations(eventId)

      return {
        totalRegistrations: registrations.length,
        withPhone: registrations.filter(r => r.phone).length,
        withCompany: registrations.filter(r => r.company).length,
        registeredUsers: registrations.filter(r => r.userId).length,
        guestRegistrations: registrations.filter(r => !r.userId).length
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas globales
   */
  async getGlobalStats() {
    try {
      const allRegistrations = await this.getAll()

      return {
        totalRegistrations: allRegistrations.length,
        uniqueEmails: new Set(allRegistrations.map(r => r.email)).size,
        registeredUsers: allRegistrations.filter(r => r.userId).length,
        guestRegistrations: allRegistrations.filter(r => !r.userId).length
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas globales:', error)
      throw error
    }
  }

  /**
   * Exportar registros de un evento (admin)
   */
  async exportEventRegistrations(eventId) {
    try {
      const registrations = await this.getEventRegistrations(eventId)

      // Formatear para CSV
      const headers = ['Nombre', 'Email', 'Teléfono', 'Empresa', 'Fecha de Registro']
      const rows = registrations.map(r => [
        r.name,
        r.email,
        r.phone || '',
        r.company || '',
        new Date(r.registeredAt).toLocaleString('es-ES')
      ])

      return { headers, rows, count: registrations.length }
    } catch (error) {
      console.error('Error exportando registros:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const eventRegistrationsService = new EventRegistrationsService()
export default eventRegistrationsService
