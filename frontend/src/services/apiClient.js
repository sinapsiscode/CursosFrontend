import axios from 'axios'

// Configuración base de axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de request - Agregar headers de autenticación
apiClient.interceptors.request.use(
  (config) => {
    // Obtener datos de autenticación del localStorage
    const authData = localStorage.getItem('auth')

    if (authData) {
      try {
        const { usuario } = JSON.parse(authData)

        if (usuario && usuario.id && usuario.rolId) {
          config.headers['x-user-id'] = usuario.id
          config.headers['x-role-id'] = usuario.rolId
        }
      } catch (error) {
        console.error('Error parseando auth data:', error)
      }
    }

    // Log de request en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
        headers: { 'x-user-id': config.headers['x-user-id'], 'x-role-id': config.headers['x-role-id'] },
        data: config.data
      })
    }

    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Interceptor de response - Manejo de errores
apiClient.interceptors.response.use(
  (response) => {
    // Log de response en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }

    return response
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      const { status, data } = error.response

      // Log del error
      console.error(`[API Error] ${status}:`, data)

      // Manejo específico por código de estado
      switch (status) {
        case 401:
          // No autorizado - Limpiar sesión y redirigir a login
          console.warn('Sesión expirada o no autorizado')
          localStorage.removeItem('auth')

          // Disparar evento personalizado para que el AuthContext lo maneje
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
          break

        case 403:
          // Permiso denegado
          console.warn('Permiso denegado:', data.message)
          break

        case 404:
          console.warn('Recurso no encontrado:', error.config.url)
          break

        case 500:
          console.error('Error del servidor:', data.message)
          break

        default:
          console.error(`Error ${status}:`, data.message || 'Error desconocido')
      }

      // Retornar error formateado
      return Promise.reject({
        status,
        message: data.message || data.error || 'Error en la petición',
        data: data
      })
    }

    // Error de red o timeout
    if (error.request) {
      console.error('[API Network Error]', error.message)
      return Promise.reject({
        status: 0,
        message: 'Error de conexión. Verifica tu conexión a internet o que el servidor esté activo.',
        data: null
      })
    }

    // Error al configurar la petición
    console.error('[API Setup Error]', error.message)
    return Promise.reject({
      status: 0,
      message: error.message,
      data: null
    })
  }
)

// Helper para manejar respuestas con paginación
export const handlePaginatedResponse = (response) => {
  return {
    data: response.data,
    total: parseInt(response.headers['x-total-count'] || '0'),
    page: parseInt(response.config.params?._page || '1'),
    limit: parseInt(response.config.params?._limit || '10')
  }
}

// Helper para construir query params
export const buildQueryParams = (params = {}) => {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value)
    }
  })

  return queryParams.toString()
}

export default apiClient
