import axios from 'axios'
import config from '../../config/env.js'

/**
 * Base API configuration with interceptors and error handling
 */
class BaseApi {
  constructor() {
    this.client = axios.create({
      baseURL: config.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const { response } = error
        
        if (response?.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        
        return Promise.reject(error)
      }
    )
  }

  // HTTP methods
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

export const baseApi = new BaseApi()
export default baseApi