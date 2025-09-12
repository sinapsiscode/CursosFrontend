import baseApi from './baseApi.js'
import { mockAPI } from '../mockData.js'

/**
 * API service for authentication
 * Migrado desde frontend/src/services/api.js con mejores prácticas
 */
class AuthApi {
  // Login
  async login(email, password) {
    try {
      const result = await baseApi.post('/auth/login', { email, password })
      
      // Guardar token si existe
      if (result.token) {
        localStorage.setItem('auth_token', result.token)
      }
      
      return result
    } catch (error) {
      console.warn('Usando autenticación local:', error.message)
      return this.loginLocal(email, password)
    }
  }

  // Register
  async register(userData) {
    try {
      const result = await baseApi.post('/auth/register', userData)
      
      // Guardar token si existe
      if (result.token) {
        localStorage.setItem('auth_token', result.token)
      }
      
      return result
    } catch (error) {
      console.warn('Usando registro local:', error.message)
      return this.registerLocal(userData)
    }
  }

  // Logout
  async logout() {
    try {
      await baseApi.post('/auth/logout')
    } catch (error) {
      console.warn('Error en logout remoto:', error.message)
    } finally {
      // Siempre limpiar datos locales
      this.clearLocalAuth()
      return { success: true }
    }
  }

  // Verificar token
  async verifyToken() {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return { valid: false }
      }

      const result = await baseApi.get('/auth/verify')
      return { valid: true, user: result.user }
    } catch (error) {
      console.warn('Token inválido o error de verificación:', error.message)
      this.clearLocalAuth()
      return { valid: false }
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const result = await baseApi.post('/auth/refresh')
      
      if (result.token) {
        localStorage.setItem('auth_token', result.token)
      }
      
      return result
    } catch (error) {
      console.warn('Error refreshing token:', error.message)
      this.clearLocalAuth()
      throw error
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      return await baseApi.patch('/auth/change-password', {
        currentPassword,
        newPassword
      })
    } catch (error) {
      console.warn('Error cambiando contraseña:', error.message)
      throw error
    }
  }

  // Reset password
  async requestPasswordReset(email) {
    try {
      return await baseApi.post('/auth/request-reset', { email })
    } catch (error) {
      console.warn('Error solicitando reset:', error.message)
      // En desarrollo, simular éxito
      if (import.meta.env.DEV) {
        return { success: true, message: 'Email de reset enviado (simulado)' }
      }
      throw error
    }
  }

  async resetPassword(token, newPassword) {
    try {
      return await baseApi.post('/auth/reset-password', { token, newPassword })
    } catch (error) {
      console.warn('Error reseteando contraseña:', error.message)
      throw error
    }
  }

  // Gestión de usuarios
  async getUsers() {
    try {
      if (import.meta.env.DEV) {
        return this.getUsersLocal()
      }
      return await baseApi.get('/users')
    } catch (error) {
      console.warn('Usando usuarios locales:', error.message)
      return this.getUsersLocal()
    }
  }

  async getUserById(id) {
    try {
      return await baseApi.get(`/users/${id}`)
    } catch (error) {
      console.warn('Buscando usuario localmente:', error.message)
      return this.getUserByIdLocal(id)
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      return await baseApi.patch(`/users/${userId}`, updates)
    } catch (error) {
      console.warn('Actualizando perfil localmente:', error.message)
      return this.updateUserLocal(userId, updates)
    }
  }

  // MÉTODOS LOCALES (localStorage/mockData)

  async loginLocal(email, password) {
    try {
      return await mockAPI.login(email, password)
    } catch (error) {
      throw new Error('Credenciales inválidas')
    }
  }

  async registerLocal(userData) {
    try {
      return await mockAPI.register(userData)
    } catch (error) {
      throw new Error('Error en el registro: ' + error.message)
    }
  }

  async getUsersLocal() {
    try {
      return await mockAPI.getUsers()
    } catch (error) {
      console.error('Error obteniendo usuarios locales:', error)
      return []
    }
  }

  async getUserByIdLocal(id) {
    try {
      return await mockAPI.getUserById(id)
    } catch (error) {
      console.error('Error obteniendo usuario local:', error)
      return null
    }
  }

  async updateUserLocal(userId, updates) {
    // En desarrollo, simular actualización exitosa
    console.log(`👤 Actualizando usuario ${userId}:`, updates)
    return { 
      success: true, 
      user: { id: userId, ...updates },
      message: 'Perfil actualizado localmente'
    }
  }

  // Utilidades
  clearLocalAuth() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    sessionStorage.clear()
  }

  getStoredUser() {
    try {
      const stored = localStorage.getItem('user_data')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error reading stored user:', error)
      return null
    }
  }

  saveUserData(user) {
    try {
      localStorage.setItem('user_data', JSON.stringify(user))
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('auth_token')
    return !!token
  }

  getAuthToken() {
    return localStorage.getItem('auth_token')
  }

  // Verificar si el usuario es admin
  isAdmin() {
    const user = this.getStoredUser()
    return user && (user.role === 'admin' || user.isAdmin)
  }

  // Obtener datos del usuario actual
  getCurrentUser() {
    return this.getStoredUser()
  }

  // Simular delay para desarrollo
  async simulateDelay() {
    if (import.meta.env.DEV) {
      const delay = Math.random() * 500 + 200
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

export const authApi = new AuthApi()
export default authApi