import apiClient from './apiClient'
import systemConfigService from './systemConfigService'

/**
 * Servicio para gestión de sistema de fidelización y puntos
 * MIGRADO: Ahora usa configuración desde backend (system_config)
 * Mantiene fallback hardcodeado para compatibilidad
 */
class FidelizacionService {
  constructor() {
    this.config = null // Se carga dinámicamente desde backend
    this.configLoaded = false
  }

  /**
   * Cargar configuración desde backend
   * Con fallback a valores por defecto si falla
   */
  async loadConfig() {
    if (this.configLoaded && this.config) {
      return this.config
    }

    try {
      const loyaltyConfig = await systemConfigService.getLoyaltyConfig()

      // Convertir array de niveles a objeto para compatibilidad
      const levelsObject = {}
      loyaltyConfig.levels.forEach(level => {
        levelsObject[level.key] = level
      })

      this.config = {
        pointsPerCourse: loyaltyConfig.pointsPerCourse,
        firstCourseBonus: loyaltyConfig.firstCourseBonus || 50,
        levels: levelsObject,
        pointsRules: loyaltyConfig.pointsRules || {}
      }

      this.configLoaded = true
      console.log('✅ Configuración de fidelización cargada desde backend')
      return this.config
    } catch (error) {
      console.warn('⚠️ Error cargando config desde backend, usando fallback:', error)

      // FALLBACK: Configuración por defecto
      this.config = {
        pointsPerCourse: 100,
        firstCourseBonus: 50,
        levels: {
          bronce: {
            key: 'bronce',
            name: 'Bronce',
            minPoints: 0,
            maxPoints: 299,
            coursesRequired: '0-2 cursos',
            color: '#CD7F32',
            icon: '🥉',
            discountPercentage: 5
          },
          plata: {
            key: 'plata',
            name: 'Plata',
            minPoints: 300,
            maxPoints: 599,
            coursesRequired: '3-5 cursos',
            color: '#C0C0C0',
            icon: '🥈',
            discountPercentage: 10
          },
          oro: {
            key: 'oro',
            name: 'Oro',
            minPoints: 600,
            maxPoints: 999,
            coursesRequired: '6-9 cursos',
            color: '#FFD700',
            icon: '🥇',
            discountPercentage: 15
          },
          platino: {
            key: 'platino',
            name: 'Platino',
            minPoints: 1000,
            maxPoints: null,
            coursesRequired: '10+ cursos',
            color: '#E5E4E2',
            icon: '💎',
            discountPercentage: 20
          }
        }
      }

      this.configLoaded = true
      return this.config
    }
  }

  // ==================== GESTIÓN DE PUNTOS ====================

  /**
   * Obtener puntos de usuario
   */
  async getUserPoints(userId) {
    try {
      const response = await apiClient.get(`/fidelizacion?userId=${userId}`)
      const userPoints = response.data

      if (userPoints.length === 0) {
        // Crear registro inicial
        return await this.createUserPoints(userId)
      }

      return userPoints[0]
    } catch (error) {
      console.error(`Error obteniendo puntos de usuario ${userId}:`, error)
      throw error
    }
  }

  /**
   * Crear registro de puntos para nuevo usuario
   */
  async createUserPoints(userId) {
    try {
      const newUserPoints = {
        userId,
        totalPoints: 0,
        availablePoints: 0,
        lifetimePoints: 0,
        currentLevel: 'bronce',
        transactions: [],
        redeemedRewards: [],
        completedCourses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.post('/fidelizacion', newUserPoints)
      console.log(`✅ Registro de puntos creado para usuario ${userId}`)
      return response.data
    } catch (error) {
      console.error('Error creando registro de puntos:', error)
      throw error
    }
  }

  /**
   * Agregar puntos a usuario
   */
  async addPoints(userId, amount, description, metadata = {}) {
    try {
      const userPoints = await this.getUserPoints(userId)

      const transaction = {
        id: `txn_${Date.now()}`,
        type: 'earned',
        amount,
        description,
        metadata,
        timestamp: new Date().toISOString()
      }

      const updatedTransactions = [transaction, ...userPoints.transactions]
      const newTotalPoints = userPoints.totalPoints + amount
      const newAvailablePoints = userPoints.availablePoints + amount
      const newLifetimePoints = userPoints.lifetimePoints + amount

      // Calcular nuevo nivel
      const oldLevel = userPoints.currentLevel
      const newLevel = this.calculateLevel(newLifetimePoints)

      const updates = {
        totalPoints: newTotalPoints,
        availablePoints: newAvailablePoints,
        lifetimePoints: newLifetimePoints,
        currentLevel: newLevel,
        transactions: updatedTransactions,
        updatedAt: new Date().toISOString()
      }

      const response = await apiClient.patch(`/fidelizacion/${userPoints.id}`, updates)

      console.log(`✅ Puntos agregados: ${amount} pts para usuario ${userId}`)

      return {
        success: true,
        transaction,
        newBalance: newAvailablePoints,
        levelChanged: oldLevel !== newLevel,
        newLevel
      }
    } catch (error) {
      console.error('Error agregando puntos:', error)
      throw error
    }
  }

  /**
   * Agregar puntos por completar curso
   */
  async addPointsForCourseCompletion(courseId, courseName, userId, customPoints = null) {
    try {
      await this.loadConfig() // Cargar config desde backend

      const userPoints = await this.getUserPoints(userId)

      // Verificar si ya recibió puntos por este curso
      const alreadyCompleted = userPoints.completedCourses?.some(c => c.courseId === courseId)

      if (alreadyCompleted) {
        return { success: false, error: 'Ya recibiste puntos por este curso' }
      }

      const points = customPoints || this.config.pointsPerCourse

      // Determinar si es primer curso
      const isFirstCourse = (userPoints.completedCourses?.length || 0) === 0
      const finalPoints = isFirstCourse ? points + (this.config.firstCourseBonus || 50) : points

      const description = isFirstCourse
        ? `🎉 ¡Primer curso completado! ${courseName}`
        : `✅ Curso completado: ${courseName}`

      // Agregar curso a completados
      const newCompletedCourses = [
        ...(userPoints.completedCourses || []),
        {
          courseId,
          courseName,
          completedAt: new Date().toISOString()
        }
      ]

      // Actualizar con nuevo curso
      await apiClient.patch(`/fidelizacion/${userPoints.id}`, {
        completedCourses: newCompletedCourses
      })

      // Agregar puntos
      return await this.addPoints(
        userId,
        finalPoints,
        description,
        { courseId, isFirstCourse }
      )
    } catch (error) {
      console.error('Error agregando puntos por curso:', error)
      throw error
    }
  }

  /**
   * Canjear recompensa
   */
  async redeemReward(userId, rewardId, rewardPoints, rewardName) {
    try {
      const userPoints = await this.getUserPoints(userId)

      if (userPoints.availablePoints < rewardPoints) {
        return { success: false, error: 'Puntos insuficientes' }
      }

      const transaction = {
        id: `txn_${Date.now()}`,
        type: 'redeemed',
        amount: -rewardPoints,
        description: `Canjeado: ${rewardName}`,
        rewardId,
        timestamp: new Date().toISOString()
      }

      const redemption = {
        id: `red_${Date.now()}`,
        rewardId,
        code: this.generateRedemptionCode(),
        redeemedAt: new Date().toISOString(),
        expiresAt: this.calculateExpirationDate(30),
        status: 'active'
      }

      const updates = {
        availablePoints: userPoints.availablePoints - rewardPoints,
        transactions: [transaction, ...userPoints.transactions],
        redeemedRewards: [redemption, ...(userPoints.redeemedRewards || [])],
        updatedAt: new Date().toISOString()
      }

      await apiClient.patch(`/fidelizacion/${userPoints.id}`, updates)

      console.log(`✅ Recompensa canjeada: ${rewardName}`)

      return {
        success: true,
        redemption,
        newBalance: updates.availablePoints
      }
    } catch (error) {
      console.error('Error canjeando recompensa:', error)
      throw error
    }
  }

  // ==================== CÁLCULOS Y UTILIDADES ====================

  /**
   * Calcular nivel según puntos
   */
  async calculateLevel(lifetimePoints) {
    await this.loadConfig() // Cargar config desde backend

    for (const [key, level] of Object.entries(this.config.levels)) {
      if (lifetimePoints >= level.minPoints && (level.maxPoints === null || lifetimePoints <= level.maxPoints)) {
        return key
      }
    }
    return 'bronce'
  }

  /**
   * Obtener nivel actual
   */
  async getCurrentLevel(userPoints) {
    await this.loadConfig() // Cargar config desde backend
    return this.config.levels[userPoints.currentLevel] || this.config.levels.bronce
  }

  /**
   * Calcular puntos al siguiente nivel
   */
  async getPointsToNextLevel(userPoints) {
    await this.loadConfig() // Cargar config desde backend

    const currentLevel = userPoints.currentLevel
    const levels = Object.entries(this.config.levels)
    const currentIndex = levels.findIndex(([key]) => key === currentLevel)

    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1][1]
      return nextLevel.minPoints - userPoints.lifetimePoints
    }

    return null // Nivel máximo
  }

  /**
   * Obtener progreso al siguiente nivel
   */
  async getLevelProgress(userPoints) {
    await this.loadConfig() // Cargar config desde backend

    const levelConfig = this.config.levels[userPoints.currentLevel]
    const points = userPoints.lifetimePoints

    if (levelConfig.maxPoints === null) {
      return 100 // Nivel máximo
    }

    const levelRange = levelConfig.maxPoints - levelConfig.minPoints
    const pointsInLevel = points - levelConfig.minPoints

    return Math.min(100, Math.round((pointsInLevel / levelRange) * 100))
  }

  /**
   * Aplicar descuento de nivel
   */
  async applyLevelDiscount(userPoints, price) {
    await this.loadConfig() // Cargar config desde backend

    const level = this.config.levels[userPoints.currentLevel]
    const discount = level.discountPercentage / 100

    return {
      originalPrice: price,
      discount: price * discount,
      finalPrice: price * (1 - discount),
      discountPercentage: level.discountPercentage
    }
  }

  /**
   * Generar código de canje
   */
  generateRedemptionCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = 'MET-'
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) code += '-'
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  /**
   * Calcular fecha de expiración
   */
  calculateExpirationDate(days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString()
  }

  // ==================== ESTADÍSTICAS Y RANKINGS ====================

  /**
   * Obtener todos los usuarios con sus puntos
   */
  async getAllUsersWithPoints() {
    try {
      const [loyaltyResponse, usersResponse] = await Promise.all([
        apiClient.get('/fidelizacion'),
        apiClient.get('/usuarios')
      ])

      const loyaltyData = loyaltyResponse.data || []
      const users = usersResponse.data || []

      // Crear un mapa de fidelizacion por userId
      const loyaltyMap = {}
      loyaltyData.forEach(loyalty => {
        if (loyalty.userId) {
          loyaltyMap[loyalty.userId] = loyalty
        }
      })

      // Combinar datos de usuarios con sus puntos
      return users.map(user => {
        const loyalty = loyaltyMap[user.id] || {
          totalPoints: 0,
          availablePoints: 0,
          lifetimePoints: 0,
          currentLevel: 'bronce',
          transactions: [],
          redeemedRewards: [],
          completedCourses: []
        }

        return {
          id: user.id,
          userId: user.id,
          name: user.nombre,
          email: user.email,
          avatar: user.avatar,
          ...loyalty
        }
      })
    } catch (error) {
      console.error('Error obteniendo usuarios con puntos:', error)
      return []
    }
  }

  /**
   * Obtener ranking de usuarios
   */
  async getRanking(limit = 10) {
    try {
      const response = await apiClient.get('/fidelizacion')
      const allUsers = response.data

      return allUsers
        .sort((a, b) => b.lifetimePoints - a.lifetimePoints)
        .slice(0, limit)
    } catch (error) {
      console.error('Error obteniendo ranking:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas globales
   */
  async getGlobalStats() {
    try {
      const response = await apiClient.get('/fidelizacion')
      const allUsers = response.data

      return {
        totalUsers: allUsers.length,
        totalPointsDistributed: allUsers.reduce((sum, u) => sum + u.lifetimePoints, 0),
        totalPointsAvailable: allUsers.reduce((sum, u) => sum + u.availablePoints, 0),
        totalRedemptions: allUsers.reduce((sum, u) => sum + (u.redeemedRewards?.length || 0), 0),
        levelDistribution: {
          bronce: allUsers.filter(u => u.currentLevel === 'bronce').length,
          plata: allUsers.filter(u => u.currentLevel === 'plata').length,
          oro: allUsers.filter(u => u.currentLevel === 'oro').length,
          platino: allUsers.filter(u => u.currentLevel === 'platino').length
        }
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas globales:', error)
      throw error
    }
  }

  // ==================== ADMIN ====================

  /**
   * Agregar puntos (admin)
   */
  async adminAddPoints(userId, amount, description) {
    return await this.addPoints(userId, amount, description || 'Puntos agregados por administrador', { addedBy: 'admin' })
  }

  /**
   * Remover puntos (admin)
   */
  async adminRemovePoints(userId, amount, description) {
    return await this.addPoints(userId, -amount, description || 'Puntos removidos por administrador', { removedBy: 'admin' })
  }
}

// Exportar instancia única (singleton)
export const fidelizacionService = new FidelizacionService()
export default fidelizacionService
