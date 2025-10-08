import apiClient from './apiClient'

/**
 * Servicio para gestión de notificaciones de usuarios
 * USA JSON SERVER
 */
class NotificacionesService {
  /**
   * Obtener todas las notificaciones con filtros
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      if (filters.usuarioId) params.append('usuarioId', filters.usuarioId)
      if (filters.tipo) params.append('tipo', filters.tipo)
      if (filters.categoria) params.append('categoria', filters.categoria)
      if (filters.leida !== undefined) params.append('leida', filters.leida)

      const queryString = params.toString()
      const url = queryString ? `/notificaciones?${queryString}` : '/notificaciones'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error)
      throw error
    }
  }

  /**
   * Obtener notificación por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/notificaciones/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo notificación ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener notificaciones de un usuario
   */
  async getUserNotifications(usuarioId, onlyUnread = false) {
    try {
      const filters = { usuarioId }
      if (onlyUnread) {
        filters.leida = false
      }

      const notifications = await this.getAll(filters)

      // Ordenar por fecha (más recientes primero)
      return notifications.sort((a, b) =>
        new Date(b.fecha) - new Date(a.fecha)
      )
    } catch (error) {
      console.error(`Error obteniendo notificaciones de usuario ${usuarioId}:`, error)
      throw error
    }
  }

  /**
   * Crear nueva notificación
   */
  async create(notificationData) {
    try {
      const newNotification = {
        usuarioId: notificationData.usuarioId,
        tipo: notificationData.tipo || 'info', // info | success | warning | error
        categoria: notificationData.categoria || 'sistema', // sistema | curso | examen | evento
        titulo: notificationData.titulo,
        mensaje: notificationData.mensaje,
        leida: false,
        fecha: new Date().toISOString(),
        metadata: notificationData.metadata || {}
      }

      const response = await apiClient.post('/notificaciones', newNotification)
      console.log('✅ Notificación creada:', response.data)
      return { success: true, notification: response.data }
    } catch (error) {
      console.error('Error creando notificación:', error)
      throw error
    }
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(id) {
    try {
      const response = await apiClient.patch(`/notificaciones/${id}`, {
        leida: true
      })
      console.log(`✅ Notificación ${id} marcada como leída`)
      return { success: true, notification: response.data }
    } catch (error) {
      console.error(`Error marcando notificación ${id} como leída:`, error)
      throw error
    }
  }

  /**
   * Marcar todas las notificaciones de un usuario como leídas
   */
  async markAllAsRead(usuarioId) {
    try {
      const unreadNotifications = await this.getUserNotifications(usuarioId, true)

      const updatePromises = unreadNotifications.map(notification =>
        apiClient.patch(`/notificaciones/${notification.id}`, { leida: true })
      )

      await Promise.all(updatePromises)
      console.log(`✅ Todas las notificaciones de usuario ${usuarioId} marcadas como leídas`)
      return { success: true, count: unreadNotifications.length }
    } catch (error) {
      console.error('Error marcando todas como leídas:', error)
      throw error
    }
  }

  /**
   * Eliminar notificación
   */
  async delete(id) {
    try {
      await apiClient.delete(`/notificaciones/${id}`)
      console.log('✅ Notificación eliminada:', id)
      return { success: true }
    } catch (error) {
      console.error(`Error eliminando notificación ${id}:`, error)
      throw error
    }
  }

  /**
   * Eliminar todas las notificaciones leídas de un usuario
   */
  async deleteReadNotifications(usuarioId) {
    try {
      const readNotifications = await this.getAll({
        usuarioId,
        leida: true
      })

      const deletePromises = readNotifications.map(notification =>
        apiClient.delete(`/notificaciones/${notification.id}`)
      )

      await Promise.all(deletePromises)
      console.log(`✅ ${readNotifications.length} notificaciones leídas eliminadas`)
      return { success: true, count: readNotifications.length }
    } catch (error) {
      console.error('Error eliminando notificaciones leídas:', error)
      throw error
    }
  }

  /**
   * Obtener conteo de notificaciones no leídas
   */
  async getUnreadCount(usuarioId) {
    try {
      const unreadNotifications = await this.getUserNotifications(usuarioId, true)
      return unreadNotifications.length
    } catch (error) {
      console.error('Error obteniendo conteo de no leídas:', error)
      throw error
    }
  }

  /**
   * Obtener notificaciones agrupadas por categoría
   */
  async getGroupedByCategory(usuarioId) {
    try {
      const notifications = await this.getUserNotifications(usuarioId)

      return notifications.reduce((grouped, notification) => {
        const category = notification.categoria
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push(notification)
        return grouped
      }, {})
    } catch (error) {
      console.error('Error agrupando notificaciones:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de notificaciones
   */
  async getStats(usuarioId = null) {
    try {
      const filters = usuarioId ? { usuarioId } : {}
      const notifications = await this.getAll(filters)

      return {
        total: notifications.length,
        unread: notifications.filter(n => !n.leida).length,
        read: notifications.filter(n => n.leida).length,
        byType: {
          info: notifications.filter(n => n.tipo === 'info').length,
          success: notifications.filter(n => n.tipo === 'success').length,
          warning: notifications.filter(n => n.tipo === 'warning').length,
          error: notifications.filter(n => n.tipo === 'error').length
        },
        byCategory: {
          sistema: notifications.filter(n => n.categoria === 'sistema').length,
          curso: notifications.filter(n => n.categoria === 'curso').length,
          examen: notifications.filter(n => n.categoria === 'examen').length,
          evento: notifications.filter(n => n.categoria === 'evento').length
        }
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }

  /**
   * Crear notificación masiva (broadcast)
   */
  async broadcast(notificationData, userIds) {
    try {
      const createPromises = userIds.map(usuarioId =>
        this.create({
          ...notificationData,
          usuarioId
        })
      )

      const results = await Promise.all(createPromises)
      console.log(`✅ Notificación enviada a ${userIds.length} usuarios`)
      return { success: true, count: results.length }
    } catch (error) {
      console.error('Error en broadcast de notificaciones:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const notificacionesService = new NotificacionesService()
export default notificacionesService
