import axios from 'axios'

/**
 * API Client configurado con interceptors y manejo de errores
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: '/api', // Usar proxy de Vite
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor - Agregar auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - Manejo de errores global
    this.client.interceptors.response.use(
      (response) => {
        return response.data
      },
      (error) => {
        const { response } = error

        // Manejo de errores común
        switch (response?.status) {
          case 401:
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
            break
          case 403:
            console.error('Acceso denegado')
            break
          case 404:
            console.error('Recurso no encontrado')
            break
          case 500:
            console.error('Error del servidor')
            break
          default:
            console.error('Error de API:', error.message)
        }

        return Promise.reject(error)
      }
    )
  }

  // Métodos HTTP base
  async get(url, config = {}) {
    return this.client.get(url, config)
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config)
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config)
  }

  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config)
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config)
  }
}

// Singleton instance
export const apiClient = new ApiClient()
export default apiClient