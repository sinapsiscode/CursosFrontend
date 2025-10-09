import apiClient from './apiClient'

/**
 * Servicio para gestión de usuarios
 */
class UsuariosService {
  /**
   * Obtener todos los usuarios
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      // Agregar filtros si existen
      if (filters.rolId) params.append('rolId', filters.rolId)
      if (filters.activo !== undefined) params.append('activo', filters.activo)

      const queryString = params.toString()
      const url = queryString ? `/usuarios?${queryString}` : '/usuarios'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      throw error
    }
  }

  /**
   * Obtener usuario por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/usuarios/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo usuario ${id}:`, error)
      throw error
    }
  }

  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    try {
      const response = await apiClient.post('/usuarios', userData)
      console.log('✅ Usuario creado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creando usuario:', error)
      throw error
    }
  }

  /**
   * Actualizar usuario existente
   * IMPORTANTE: Usa PATCH para actualización parcial, no PUT que sobrescribe todo
   */
  async update(id, userData) {
    try {
      const response = await apiClient.patch(`/usuarios/${id}`, userData)
      console.log('✅ Usuario actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando usuario ${id}:`, error)
      throw error
    }
  }

  /**
   * Actualizar parcialmente un usuario
   */
  async patch(id, updates) {
    try {
      const response = await apiClient.patch(`/usuarios/${id}`, updates)
      console.log('✅ Usuario parcialmente actualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando usuario ${id}:`, error)
      throw error
    }
  }

  /**
   * Eliminar usuario
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/usuarios/${id}`)
      console.log('✅ Usuario eliminado:', id)
      return response.data
    } catch (error) {
      console.error(`Error eliminando usuario ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener usuarios por rol
   */
  async getByRole(rolId) {
    try {
      const response = await apiClient.get(`/usuarios?rolId=${rolId}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo usuarios del rol ${rolId}:`, error)
      throw error
    }
  }

  /**
   * Obtener usuarios activos
   */
  async getActive() {
    try {
      const response = await apiClient.get('/usuarios?activo=true')
      return response.data
    } catch (error) {
      console.error('Error obteniendo usuarios activos:', error)
      throw error
    }
  }

  /**
   * Activar/Desactivar usuario
   */
  async toggleStatus(id) {
    try {
      const usuario = await this.getById(id)
      const updatedUsuario = await this.patch(id, {
        activo: !usuario.activo
      })
      console.log('✅ Estado de usuario actualizado')
      return updatedUsuario
    } catch (error) {
      console.error('Error cambiando estado de usuario:', error)
      throw error
    }
  }

  /**
   * Buscar usuarios por texto
   */
  async search(query) {
    try {
      const response = await apiClient.get(`/usuarios?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Error buscando usuarios:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getStats() {
    try {
      const usuarios = await this.getAll()

      const stats = {
        total: usuarios.length,
        activos: usuarios.filter(u => u.activo).length,
        inactivos: usuarios.filter(u => !u.activo).length,
        porRol: {}
      }

      // Contar por rol
      usuarios.forEach(usuario => {
        const rolId = usuario.rolId
        stats.porRol[rolId] = (stats.porRol[rolId] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const usuariosService = new UsuariosService()
export default usuariosService
