import apiClient from './apiClient'

/**
 * Servicio para gestión de configuraciones de exámenes por estudiante
 */
class ExamenConfigService {
  /**
   * Obtener todas las configuraciones
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams()

      if (filters.studentId) params.append('studentId', filters.studentId)
      if (filters.courseId) params.append('courseId', filters.courseId)
      if (filters.examId) params.append('examId', filters.examId)
      if (filters.enabled !== undefined) params.append('enabled', filters.enabled)

      const queryString = params.toString()
      const url = queryString ? `/examen_configuraciones?${queryString}` : '/examen_configuraciones'

      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error obteniendo configuraciones de exámenes:', error)
      throw error
    }
  }

  /**
   * Obtener configuración por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/examen_configuraciones/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error obteniendo configuración ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener configuración específica de estudiante para un curso
   */
  async getStudentConfig(studentId, courseId) {
    try {
      const response = await apiClient.get(`/examen_configuraciones?studentId=${studentId}&courseId=${courseId}`)
      const configs = response.data
      return configs.length > 0 ? configs[0] : null
    } catch (error) {
      console.error(`Error obteniendo configuración de estudiante ${studentId} en curso ${courseId}:`, error)
      throw error
    }
  }

  /**
   * Habilitar examen para estudiante
   */
  async enableExamForStudent(config) {
    try {
      const newConfig = {
        studentId: config.studentId,
        courseId: config.courseId,
        examId: config.examId,
        enabled: true,
        attemptsAllowed: config.attemptsAllowed || 3,
        attemptsUsed: 0,
        timeLimit: config.timeLimit || 60,
        availableFrom: config.availableFrom || new Date().toISOString(),
        availableUntil: config.availableUntil || this.calculateDefaultExpiry(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.post('/examen_configuraciones', newConfig)
      console.log('✅ Examen habilitado para estudiante:', response.data)
      return { success: true, config: response.data }
    } catch (error) {
      console.error('Error habilitando examen:', error)
      throw error
    }
  }

  /**
   * Deshabilitar examen para estudiante
   */
  async disableExamForStudent(studentId, courseId) {
    try {
      // Buscar configuración existente
      const configs = await this.getAll({ studentId, courseId })

      if (configs.length === 0) {
        return { success: true, message: 'No hay configuración para eliminar' }
      }

      // Eliminar todas las configuraciones
      for (const config of configs) {
        await apiClient.delete(`/examen_configuraciones/${config.id}`)
      }

      console.log('✅ Examen deshabilitado para estudiante')
      return { success: true }
    } catch (error) {
      console.error('Error deshabilitando examen:', error)
      throw error
    }
  }

  /**
   * Actualizar configuración
   */
  async update(id, updates) {
    try {
      const response = await apiClient.patch(`/examen_configuraciones/${id}`, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      console.log('✅ Configuración actualizada:', response.data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando configuración ${id}:`, error)
      throw error
    }
  }

  /**
   * Registrar intento de examen
   */
  async registerAttempt(configId) {
    try {
      const config = await this.getById(configId)

      if (config.attemptsUsed >= config.attemptsAllowed) {
        throw new Error('No quedan intentos disponibles')
      }

      const updatedConfig = await this.update(configId, {
        attemptsUsed: config.attemptsUsed + 1
      })

      return { success: true, config: updatedConfig }
    } catch (error) {
      console.error('Error registrando intento:', error)
      throw error
    }
  }

  /**
   * Verificar si estudiante puede tomar examen
   */
  async canTakeExam(studentId, courseId) {
    try {
      const config = await this.getStudentConfig(studentId, courseId)

      if (!config) {
        return {
          canTake: false,
          reason: 'No tienes acceso a este examen'
        }
      }

      if (!config.enabled) {
        return {
          canTake: false,
          reason: 'El examen está deshabilitado'
        }
      }

      if (config.attemptsUsed >= config.attemptsAllowed) {
        return {
          canTake: false,
          reason: 'Has agotado todos tus intentos'
        }
      }

      const now = new Date()
      const availableFrom = new Date(config.availableFrom)
      const availableUntil = new Date(config.availableUntil)

      if (now < availableFrom) {
        return {
          canTake: false,
          reason: 'El examen aún no está disponible'
        }
      }

      if (now > availableUntil) {
        return {
          canTake: false,
          reason: 'El examen ha expirado'
        }
      }

      return {
        canTake: true,
        config,
        attemptsRemaining: config.attemptsAllowed - config.attemptsUsed
      }
    } catch (error) {
      console.error('Error verificando acceso a examen:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas
   */
  async getStats() {
    try {
      const configs = await this.getAll()

      return {
        total: configs.length,
        enabled: configs.filter(c => c.enabled).length,
        disabled: configs.filter(c => !c.enabled).length,
        exhausted: configs.filter(c => c.attemptsUsed >= c.attemptsAllowed).length
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }

  /**
   * Calcular fecha de expiración por defecto (30 días)
   */
  calculateDefaultExpiry() {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toISOString()
  }

  /**
   * Eliminar configuración
   */
  async delete(id) {
    try {
      await apiClient.delete(`/examen_configuraciones/${id}`)
      console.log('✅ Configuración eliminada:', id)
      return { success: true }
    } catch (error) {
      console.error(`Error eliminando configuración ${id}:`, error)
      throw error
    }
  }
}

// Exportar instancia única (singleton)
export const examenConfigService = new ExamenConfigService()
export default examenConfigService
