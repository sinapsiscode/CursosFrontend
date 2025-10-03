import apiClient from './apiClient'

const AUTH_STORAGE_KEY = 'auth'

class AuthService {
  /**
   * Iniciar sesión
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password })

      if (response.data.success && response.data.usuario) {
        // Guardar datos de autenticación en localStorage
        const authData = {
          usuario: response.data.usuario,
          token: response.data.token,
          timestamp: new Date().toISOString()
        }

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))

        console.log('✅ Login exitoso:', response.data.usuario.nombre)
        return {
          success: true,
          usuario: response.data.usuario
        }
      }

      throw new Error('Respuesta de login inválida')
    } catch (error) {
      console.error('❌ Error en login:', error)
      throw error
    }
  }

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    console.log('👋 Sesión cerrada')

    // Disparar evento para que los componentes reaccionen
    window.dispatchEvent(new CustomEvent('auth:logout'))
  }

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser() {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY)

      if (authData) {
        const { usuario, timestamp } = JSON.parse(authData)

        // Verificar que la sesión no sea muy antigua (7 días)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        if (new Date(timestamp) < sevenDaysAgo) {
          console.warn('⏰ Sesión expirada (más de 7 días)')
          this.logout()
          return null
        }

        return usuario
      }

      return null
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      return null
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  hasPermission(permiso) {
    const usuario = this.getCurrentUser()

    if (!usuario || !usuario.permisos) {
      return false
    }

    return usuario.permisos.includes(permiso)
  }

  /**
   * Verificar si el usuario tiene alguno de los permisos especificados
   */
  hasAnyPermission(permisos = []) {
    const usuario = this.getCurrentUser()

    if (!usuario || !usuario.permisos) {
      return false
    }

    return permisos.some(permiso => usuario.permisos.includes(permiso))
  }

  /**
   * Verificar si el usuario tiene todos los permisos especificados
   */
  hasAllPermissions(permisos = []) {
    const usuario = this.getCurrentUser()

    if (!usuario || !usuario.permisos) {
      return false
    }

    return permisos.every(permiso => usuario.permisos.includes(permiso))
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(rolId) {
    const usuario = this.getCurrentUser()
    return usuario && usuario.rolId === rolId
  }

  /**
   * Obtener permisos del usuario actual desde el backend
   */
  async getPermisos() {
    try {
      const response = await apiClient.get('/auth/permisos')
      return response.data
    } catch (error) {
      console.error('Error obteniendo permisos:', error)
      throw error
    }
  }

  /**
   * Obtener módulos accesibles para el usuario actual
   */
  async getModulosAccesibles() {
    try {
      const response = await apiClient.get('/auth/modulos')
      return response.data.modulos || []
    } catch (error) {
      console.error('Error obteniendo módulos:', error)
      throw error
    }
  }

  /**
   * Actualizar datos del usuario en localStorage (sin hacer petición al backend)
   */
  updateLocalUser(updates) {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY)

      if (authData) {
        const data = JSON.parse(authData)
        data.usuario = { ...data.usuario, ...updates }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))

        console.log('✅ Usuario actualizado localmente')
        return true
      }

      return false
    } catch (error) {
      console.error('Error actualizando usuario local:', error)
      return false
    }
  }

  /**
   * Obtener token de autenticación
   */
  getToken() {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY)

      if (authData) {
        const { token } = JSON.parse(authData)
        return token
      }

      return null
    } catch (error) {
      console.error('Error obteniendo token:', error)
      return null
    }
  }

  /**
   * Verificar si el token es válido (sin expiración por ahora)
   */
  isTokenValid() {
    const token = this.getToken()
    return token !== null
  }
}

// Exportar instancia única (singleton)
export const authService = new AuthService()
export default authService
