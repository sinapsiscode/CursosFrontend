// Sistema de Fidelización y Puntos
export class LoyaltyService {
  constructor() {
    this.config = this.getStoredConfig()
    this.userPoints = this.getUserPoints()
  }

  // Obtener configuración del programa
  getStoredConfig() {
    const stored = localStorage.getItem('loyalty_config')
    if (stored) {
      return JSON.parse(stored)
    }

    // Configuración por defecto
    return {
      // SISTEMA DE PUNTOS ESTÁNDAR
      pointsPerCourse: 100, // Cada curso completado otorga 100 puntos
      
      // Niveles de clientes basados en cursos completados
      levels: {
        bronce: {
          name: 'Bronce',
          minPoints: 0,
          maxPoints: 299, // 0-2 cursos completados
          coursesRequired: '0-2 cursos',
          color: '#CD7F32',
          icon: '🥉',
          benefits: [
            '5% de descuento en futuros cursos',
            'Acceso a webinars mensuales',
            'Certificados digitales básicos',
            'Soporte por email'
          ],
          discountPercentage: 5
        },
        plata: {
          name: 'Plata',
          minPoints: 300,
          maxPoints: 599, // 3-5 cursos completados
          coursesRequired: '3-5 cursos',
          color: '#C0C0C0',
          icon: '🥈',
          benefits: [
            '10% de descuento en todos los cursos',
            'Acceso anticipado a nuevos cursos',
            'Material descargable exclusivo',
            'Certificados con sello de plata',
            'Soporte prioritario'
          ],
          discountPercentage: 10
        },
        oro: {
          name: 'Oro',
          minPoints: 600,
          maxPoints: 999, // 6-9 cursos completados
          coursesRequired: '6-9 cursos',
          color: '#FFD700',
          icon: '🥇',
          benefits: [
            '15% de descuento permanente',
            'Mentoría grupal mensual',
            'Certificados premium con verificación',
            'Acceso a biblioteca de recursos',
            'Invitaciones a eventos exclusivos',
            'Badge de oro en perfil'
          ],
          discountPercentage: 15
        },
        platino: {
          name: 'Platino',
          minPoints: 1000, // 10+ cursos completados
          maxPoints: null,
          coursesRequired: '10+ cursos',
          color: '#E5E4E2',
          icon: '💎',
          benefits: [
            '20% de descuento de por vida',
            'Mentoría 1-a-1 mensual',
            'Certificados premium con blockchain',
            'Acceso ilimitado a todos los recursos',
            'Invitaciones VIP a eventos',
            'Reconocimiento como alumno destacado',
            'Oportunidades laborales exclusivas'
          ],
          discountPercentage: 20
        }
      },

      // Reglas de acumulación de puntos
      pointsRules: {
        courseCompletion: {
          points: 100, // PUNTOS ESTÁNDAR POR CURSO COMPLETADO
          description: 'Puntos por completar un curso'
        },
        firstCourse: {
          points: 150, // Bonus primer curso
          description: 'Bonus por completar tu primer curso'
        },
        referral: {
          points: 1000,
          description: 'Puntos por referir a un amigo'
        },
        review: {
          points: 100,
          description: 'Puntos por dejar una reseña'
        },
        dailyLogin: {
          points: 10,
          description: 'Puntos por inicio de sesión diario'
        },
        surveyCompletion: {
          points: 200,
          description: 'Puntos por completar encuesta'
        },
        socialShare: {
          points: 50,
          description: 'Puntos por compartir en redes'
        }
      },

      // Recompensas canjeables
      rewards: [
        {
          id: 'discount-10',
          name: 'Cupón 10% Descuento',
          description: 'Aplicable en tu próxima compra',
          points: 500,
          type: 'discount',
          value: 10,
          icon: '🎟️',
          category: 'cupones'
        },
        {
          id: 'discount-25',
          name: 'Cupón 25% Descuento',
          description: 'Aplicable en cursos seleccionados',
          points: 1200,
          type: 'discount',
          value: 25,
          icon: '🎫',
          category: 'cupones'
        },
        {
          id: 'discount-50',
          name: 'Cupón 50% Descuento',
          description: 'Válido por 30 días',
          points: 2500,
          type: 'discount',
          value: 50,
          icon: '🏷️',
          category: 'cupones'
        },
        {
          id: 'free-course-basic',
          name: 'Curso Básico Gratis',
          description: 'Cualquier curso de nivel básico',
          points: 3000,
          type: 'free-course',
          value: 'basic',
          icon: '📚',
          category: 'cursos'
        },
        {
          id: 'free-course-intermediate',
          name: 'Curso Intermedio Gratis',
          description: 'Cualquier curso de nivel intermedio',
          points: 5000,
          type: 'free-course',
          value: 'intermediate',
          icon: '📖',
          category: 'cursos'
        },
        {
          id: 'free-course-advanced',
          name: 'Curso Avanzado Gratis',
          description: 'Cualquier curso de nivel avanzado',
          points: 8000,
          type: 'free-course',
          value: 'advanced',
          icon: '🎓',
          category: 'cursos'
        },
        {
          id: 'mentorship-1h',
          name: 'Mentoría 1 hora',
          description: 'Sesión personalizada con experto',
          points: 2000,
          type: 'service',
          value: 'mentorship-1h',
          icon: '👨‍🏫',
          category: 'servicios'
        },
        {
          id: 'certificate-premium',
          name: 'Certificado Premium',
          description: 'Con verificación blockchain',
          points: 1500,
          type: 'service',
          value: 'premium-cert',
          icon: '🏆',
          category: 'servicios'
        },
        {
          id: 'event-vip-access',
          name: 'Acceso VIP a Evento',
          description: 'Próximo evento presencial',
          points: 4000,
          type: 'event',
          value: 'vip-access',
          icon: '🎭',
          category: 'eventos'
        },
        {
          id: 'swag-pack',
          name: 'Pack de Merchandising',
          description: 'Camiseta, taza y stickers',
          points: 2500,
          type: 'physical',
          value: 'swag-pack',
          icon: '🎁',
          category: 'merchandising'
        },
        {
          id: 'linkedin-recommendation',
          name: 'Recomendación en LinkedIn',
          description: 'Del CEO de MetSel',
          points: 5000,
          type: 'service',
          value: 'linkedin-rec',
          icon: '💼',
          category: 'servicios'
        },
        {
          id: 'career-consultation',
          name: 'Consultoría de Carrera',
          description: 'Sesión de 2 horas con experto',
          points: 6000,
          type: 'service',
          value: 'career-consult',
          icon: '🚀',
          category: 'servicios'
        }
      ],

      // Historial de transacciones
      transactionTypes: {
        earned: 'earned',
        redeemed: 'redeemed',
        expired: 'expired',
        bonus: 'bonus'
      }
    }
  }

  // Obtener puntos del usuario
  getUserPoints(userId = null) {
    // Si no se proporciona userId, obtener el usuario actual
    if (!userId) {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        const auth = JSON.parse(authData)
        userId = auth?.state?.user?.id
      }
    }
    
    if (!userId) {
      return this.getDefaultUserPoints()
    }
    
    // Obtener datos de todos los usuarios
    const allUsersData = this.getAllUsersData()
    
    if (allUsersData[userId]) {
      return allUsersData[userId]
    }
    
    // Crear datos para nuevo usuario
    const newUserData = this.getDefaultUserPoints()
    allUsersData[userId] = newUserData
    localStorage.setItem('loyalty_users_data', JSON.stringify(allUsersData))
    
    return newUserData
  }
  
  // Obtener datos por defecto de usuario
  getDefaultUserPoints() {
    return {
      totalPoints: 0,
      availablePoints: 0,
      lifetimePoints: 0,
      currentLevel: 'bronce',
      transactions: [],
      redeemedRewards: [],
      lastDailyLogin: null,
      completedCourses: []
    }
  }
  
  // Obtener datos de todos los usuarios
  getAllUsersData() {
    const stored = localStorage.getItem('loyalty_users_data')
    if (stored) {
      return JSON.parse(stored)
    }
    return {}
  }

  // Guardar datos de puntos
  saveUserPoints(userId = null) {
    // Si no se proporciona userId, obtener el usuario actual
    if (!userId) {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        const auth = JSON.parse(authData)
        userId = auth?.state?.user?.id
      }
    }
    
    if (!userId) return
    
    const allUsersData = this.getAllUsersData()
    allUsersData[userId] = this.userPoints
    localStorage.setItem('loyalty_users_data', JSON.stringify(allUsersData))
  }

  // Obtener nivel actual del usuario
  getCurrentLevel() {
    const points = this.userPoints.lifetimePoints
    
    for (const [key, level] of Object.entries(this.config.levels)) {
      if (points >= level.minPoints && (level.maxPoints === null || points <= level.maxPoints)) {
        return key
      }
    }
    
    return 'bronce'
  }

  // Calcular puntos para el siguiente nivel
  getPointsToNextLevel() {
    const currentLevel = this.getCurrentLevel()
    const levels = Object.entries(this.config.levels)
    const currentIndex = levels.findIndex(([key]) => key === currentLevel)
    
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1][1]
      return nextLevel.minPoints - this.userPoints.lifetimePoints
    }
    
    return null // Ya está en el nivel máximo
  }

  // Obtener progreso al siguiente nivel (porcentaje)
  getLevelProgress() {
    const currentLevel = this.getCurrentLevel()
    const levelConfig = this.config.levels[currentLevel]
    const points = this.userPoints.lifetimePoints
    
    if (levelConfig.maxPoints === null) {
      return 100 // Nivel máximo
    }
    
    const levelRange = levelConfig.maxPoints - levelConfig.minPoints
    const pointsInLevel = points - levelConfig.minPoints
    
    return Math.min(100, Math.round((pointsInLevel / levelRange) * 100))
  }

  // Agregar puntos
  async addPoints(amount, type, description, metadata = {}, userId = null) {
    // Obtener datos del usuario específico
    if (userId) {
      this.userPoints = this.getUserPoints(userId)
    }
    const transaction = {
      id: `txn_${Date.now()}`,
      type: this.config.transactionTypes.earned,
      amount,
      description,
      category: type,
      metadata,
      timestamp: new Date().toISOString()
    }

    this.userPoints.transactions.unshift(transaction)
    this.userPoints.totalPoints += amount
    this.userPoints.availablePoints += amount
    this.userPoints.lifetimePoints += amount

    // Verificar cambio de nivel
    const oldLevel = this.userPoints.currentLevel
    const newLevel = this.getCurrentLevel()
    
    if (oldLevel !== newLevel) {
      this.userPoints.currentLevel = newLevel
      // Notificar cambio de nivel
      this.notifyLevelUp(oldLevel, newLevel)
    }

    this.saveUserPoints(userId || null)

    return {
      success: true,
      transaction,
      newBalance: this.userPoints.availablePoints,
      levelChanged: oldLevel !== newLevel,
      newLevel
    }
  }

  // Canjear puntos por recompensa
  async redeemReward(rewardId) {
    const reward = this.config.rewards.find(r => r.id === rewardId)
    
    if (!reward) {
      return { success: false, error: 'Recompensa no encontrada' }
    }

    if (this.userPoints.availablePoints < reward.points) {
      return { success: false, error: 'Puntos insuficientes' }
    }

    // Crear transacción de canje
    const transaction = {
      id: `txn_${Date.now()}`,
      type: this.config.transactionTypes.redeemed,
      amount: -reward.points,
      description: `Canjeado: ${reward.name}`,
      rewardId: reward.id,
      timestamp: new Date().toISOString()
    }

    // Crear código de canje
    const redemption = {
      id: `red_${Date.now()}`,
      rewardId: reward.id,
      reward: reward,
      code: this.generateRedemptionCode(),
      redeemedAt: new Date().toISOString(),
      expiresAt: this.calculateExpirationDate(reward),
      status: 'active',
      transactionId: transaction.id
    }

    this.userPoints.transactions.unshift(transaction)
    this.userPoints.availablePoints -= reward.points
    this.userPoints.redeemedRewards.unshift(redemption)

    this.saveUserPoints(userId || null)

    // Notificar canje exitoso
    this.notifyRedemption(reward, redemption)

    return {
      success: true,
      redemption,
      newBalance: this.userPoints.availablePoints
    }
  }

  // Generar código de canje
  generateRedemptionCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = 'MET-'
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) code += '-'
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  // Calcular fecha de expiración
  calculateExpirationDate(reward) {
    const date = new Date()
    
    switch (reward.type) {
      case 'discount':
        date.setDate(date.getDate() + 30) // 30 días para cupones
        break
      case 'free-course':
        date.setDate(date.getDate() + 90) // 90 días para cursos gratis
        break
      case 'service':
        date.setDate(date.getDate() + 60) // 60 días para servicios
        break
      case 'event':
        date.setDate(date.getDate() + 180) // 180 días para eventos
        break
      default:
        date.setDate(date.getDate() + 365) // 1 año por defecto
    }
    
    return date.toISOString()
  }

  // Puntos por compra de curso
  async addPointsForPurchase(coursePrice, courseId, courseName) {
    const points = Math.floor(coursePrice * this.config.pointsRules.coursePurchase.rate)
    
    return await this.addPoints(
      points,
      'coursePurchase',
      `Compra: ${courseName}`,
      { courseId, price: coursePrice }
    )
  }

  // Puntos por completar curso - SISTEMA PERSONALIZABLE
  async addPointsForCourseCompletion(courseId, courseName, isFirstCourse = false, userId = null, customPoints = null) {
    // Verificar si ya recibió puntos por este curso
    const alreadyCompleted = this.userPoints.transactions.some(
      t => t.metadata?.courseId === courseId && t.category === 'courseCompletion'
    )
    
    if (alreadyCompleted) {
      return { success: false, error: 'Ya recibiste puntos por este curso' }
    }
    
    // Determinar puntos a otorgar
    // Si se especifican puntos personalizados, usarlos; si no, usar los estándar
    let basePoints = customPoints || this.config.pointsRules.courseCompletion.points
    
    // Si es el primer curso, dar bonus adicional
    const points = isFirstCourse 
      ? Math.max(basePoints + 50, this.config.pointsRules.firstCourse.points) // Bonus de 50 puntos extra o 150 mínimo
      : basePoints
    
    const description = isFirstCourse
      ? `🎉 ¡Primer curso completado! ${courseName}`
      : `✅ Curso completado: ${courseName}`
    
    // Registrar curso completado
    if (!this.userPoints.completedCourses) {
      this.userPoints.completedCourses = []
    }
    this.userPoints.completedCourses.push({
      courseId,
      courseName,
      completedAt: new Date().toISOString()
    })
    
    return await this.addPoints(
      points,
      'courseCompletion',
      description,
      { courseId, isFirstCourse },
      userId
    )
  }
  
  // Obtener número de cursos completados
  getCompletedCoursesCount() {
    return Math.floor(this.userPoints.lifetimePoints / this.config.pointsPerCourse)
  }

  // Puntos por login diario
  async addDailyLoginPoints() {
    const today = new Date().toDateString()
    const lastLogin = this.userPoints.lastDailyLogin
    
    if (!lastLogin || new Date(lastLogin).toDateString() !== today) {
      this.userPoints.lastDailyLogin = new Date().toISOString()
      
      return await this.addPoints(
        this.config.pointsRules.dailyLogin.points,
        'dailyLogin',
        'Bonus de inicio de sesión diario'
      )
    }
    
    return { success: false, error: 'Ya reclamaste los puntos de hoy' }
  }

  // Obtener recompensas disponibles para el usuario
  getAvailableRewards() {
    return this.config.rewards.map(reward => ({
      ...reward,
      canRedeem: this.userPoints.availablePoints >= reward.points,
      userPoints: this.userPoints.availablePoints
    }))
  }

  // Obtener recompensas canjeadas
  getRedeemedRewards() {
    return this.userPoints.redeemedRewards.map(redemption => {
      const now = new Date()
      const expiresAt = new Date(redemption.expiresAt)
      
      return {
        ...redemption,
        isExpired: now > expiresAt,
        daysUntilExpiration: Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)))
      }
    })
  }

  // Obtener historial de transacciones
  getTransactionHistory(limit = 50) {
    return this.userPoints.transactions.slice(0, limit)
  }

  // Notificar subida de nivel
  notifyLevelUp(oldLevel, newLevel) {
    if (typeof window !== 'undefined' && window.notificationService) {
      const newLevelConfig = this.config.levels[newLevel]
      
      window.notificationService.createNotification({
        type: 'success',
        title: '🎉 ¡Subiste de Nivel!',
        message: `Felicidades, ahora eres ${newLevelConfig.name} ${newLevelConfig.icon}`,
        icon: '⭐',
        actions: [
          {
            label: 'Ver Beneficios',
            url: '/profile/loyalty',
            icon: '🎁'
          }
        ],
        persistent: true
      })
    }
  }

  // Notificar canje exitoso
  notifyRedemption(reward, redemption) {
    if (typeof window !== 'undefined' && window.notificationService) {
      window.notificationService.createNotification({
        type: 'success',
        title: '🎁 ¡Canje Exitoso!',
        message: `Has canjeado: ${reward.name}`,
        icon: reward.icon,
        actions: [
          {
            label: 'Ver Código',
            url: `/profile/rewards/${redemption.id}`,
            icon: '🎟️'
          },
          {
            label: 'Mis Recompensas',
            url: '/profile/rewards',
            icon: '📦'
          }
        ],
        persistent: true
      })
    }
  }

  // Aplicar descuento de nivel a precio
  applyLevelDiscount(price) {
    const level = this.config.levels[this.userPoints.currentLevel]
    const discount = level.discountPercentage / 100
    return {
      originalPrice: price,
      discount: price * discount,
      finalPrice: price * (1 - discount),
      discountPercentage: level.discountPercentage
    }
  }

  // Verificar si puede aplicar cupón de descuento
  canApplyRedemption(redemptionCode, coursePrice = null) {
    const redemption = this.userPoints.redeemedRewards.find(r => r.code === redemptionCode)
    
    if (!redemption) {
      return { valid: false, error: 'Código no válido' }
    }

    if (redemption.status !== 'active') {
      return { valid: false, error: 'Código ya utilizado' }
    }

    const now = new Date()
    const expiresAt = new Date(redemption.expiresAt)
    
    if (now > expiresAt) {
      return { valid: false, error: 'Código expirado' }
    }

    return { valid: true, redemption }
  }

  // Usar código de canje
  useRedemption(redemptionCode) {
    const redemption = this.userPoints.redeemedRewards.find(r => r.code === redemptionCode)
    
    if (redemption && redemption.status === 'active') {
      redemption.status = 'used'
      redemption.usedAt = new Date().toISOString()
      this.saveUserPoints(userId || null)
      return true
    }
    
    return false
  }
}

// Agregar métodos administrativos
LoyaltyService.prototype.adminAddPoints = async function(userId, amount, description) {
  this.userPoints = this.getUserPoints(userId)
  const result = await this.addPoints(
    amount,
    'admin',
    description || `Puntos agregados por administrador`,
    { addedBy: 'admin' },
    userId
  )
  return result
}

LoyaltyService.prototype.adminRemovePoints = async function(userId, amount, description) {
  this.userPoints = this.getUserPoints(userId)
  const result = await this.addPoints(
    -amount,
    'admin',
    description || `Puntos removidos por administrador`,
    { removedBy: 'admin' },
    userId
  )
  return result
}

// Obtener todos los usuarios con sus puntos
LoyaltyService.prototype.getAllUsersWithPoints = function() {
  const allUsersData = this.getAllUsersData()
  const users = []
  
  // Obtener información de usuarios desde el store de auth si existe
  const authData = localStorage.getItem('auth-storage')
  let registeredUsers = []
  if (authData) {
    const auth = JSON.parse(authData)
    registeredUsers = auth?.state?.allUsers || []
  }
  
  // Combinar datos de usuarios con datos de puntos
  for (const [userId, pointsData] of Object.entries(allUsersData)) {
    const userInfo = registeredUsers.find(u => u.id === userId)
    users.push({
      userId,
      name: userInfo?.name || `Usuario ${userId}`,
      email: userInfo?.email || '',
      points: pointsData.availablePoints,
      lifetimePoints: pointsData.lifetimePoints,
      level: pointsData.currentLevel,
      completedCourses: pointsData.completedCourses?.length || 0,
      transactions: pointsData.transactions?.length || 0,
      lastActivity: pointsData.transactions?.[0]?.timestamp || null
    })
  }
  
  return users.sort((a, b) => b.lifetimePoints - a.lifetimePoints)
}

// Instancia singleton
export const loyaltyService = new LoyaltyService()

// Hacer disponible globalmente para integración con otros servicios
if (typeof window !== 'undefined') {
  window.loyaltyService = loyaltyService
}