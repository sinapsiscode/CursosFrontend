import baseApi from './baseApi'

/**
 * User API Service
 * Handles all user-related API operations
 */
class UserApi {
  /**
   * Get all users (admin only)
   */
  async getUsers() {
    return baseApi.get('/users')
  }

  /**
   * Get single user by ID
   */
  async getUserById(id) {
    return baseApi.get(`/users/${id}`)
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    // This should use the auth token to get current user
    const userId = localStorage.getItem('user_id')
    if (!userId) throw new Error('No user logged in')
    return this.getUserById(userId)
  }

  /**
   * Create new user (registration)
   */
  async createUser(userData) {
    return baseApi.post('/users', {
      ...userData,
      role: userData.role || 'user',
      points: 100, // Welcome bonus
      createdAt: new Date().toISOString(),
      avatar: userData.avatar || null
    })
  }

  /**
   * Update user profile
   */
  async updateUser(id, updates) {
    return baseApi.patch(`/users/${id}`, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(id) {
    return baseApi.delete(`/users/${id}`)
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Simple login - in production use proper auth endpoint
    const users = await baseApi.get(`/users?email=${email}`)
    
    if (users.length === 0) {
      throw new Error('Usuario no encontrado')
    }
    
    const user = users[0]
    if (user.password !== password) {
      throw new Error('Contraseña incorrecta')
    }
    
    // Store auth info
    localStorage.setItem('user_id', user.id)
    localStorage.setItem('auth_token', btoa(`${email}:${password}`))
    
    return user
  }

  /**
   * Register new user
   */
  async register(userData) {
    // Check if email already exists
    const existingUsers = await baseApi.get(`/users?email=${userData.email}`)
    
    if (existingUsers.length > 0) {
      throw new Error('El email ya está registrado')
    }
    
    // Create new user
    const newUser = await this.createUser(userData)
    
    // Auto login
    localStorage.setItem('user_id', newUser.id)
    localStorage.setItem('auth_token', btoa(`${userData.email}:${userData.password}`))
    
    return newUser
  }

  /**
   * Logout user
   */
  async logout() {
    localStorage.removeItem('user_id')
    localStorage.removeItem('auth_token')
    return true
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    const user = await this.getUserById(userId)
    
    return {
      totalPoints: user.points || 0,
      coursesEnrolled: user.enrolledCourses?.length || 0,
      certificatesEarned: user.certificates?.length || 0,
      memberSince: user.createdAt,
      loyaltyLevel: this.calculateLoyaltyLevel(user.points || 0)
    }
  }

  /**
   * Calculate loyalty level based on points
   */
  calculateLoyaltyLevel(points) {
    if (points >= 600) return 'oro'
    if (points >= 300) return 'plata'
    return 'bronce'
  }

  /**
   * Update user points
   */
  async updateUserPoints(userId, pointsToAdd) {
    const user = await this.getUserById(userId)
    const newPoints = (user.points || 0) + pointsToAdd
    
    return this.updateUser(userId, { points: newPoints })
  }

  /**
   * Get user enrollments
   */
  async getUserEnrollments(userId) {
    const user = await this.getUserById(userId)
    return user.enrolledCourses || []
  }

  /**
   * Enroll user in course
   */
  async enrollInCourse(userId, courseId) {
    const user = await this.getUserById(userId)
    const enrolledCourses = user.enrolledCourses || []
    
    if (enrolledCourses.includes(courseId)) {
      throw new Error('Ya estás inscrito en este curso')
    }
    
    enrolledCourses.push(courseId)
    
    return this.updateUser(userId, { 
      enrolledCourses,
      points: (user.points || 0) + 50 // Bonus points for enrollment
    })
  }

  /**
   * Get analytics data from backend
   */
  async getAnalytics() {
    try {
      const analytics = await baseApi.get('/analytics')
      return {
        ...analytics.dashboard,
        userGrowth: analytics.growth?.userGrowth || null,
        courseGrowth: analytics.growth?.courseGrowth || null,
        enrollmentGrowth: analytics.growth?.enrollmentGrowth || null,
        areaGrowth: analytics.growth?.areaGrowth || null,
        trends: analytics.trends || {}
      }
    } catch (error) {
      console.warn('Error fetching analytics, using fallback:', error.message)
      return {
        totalLeads: 0,
        totalCourses: 0,
        totalAreas: 0,
        conversionRate: 0,
        userGrowth: null,
        courseGrowth: null,
        enrollmentGrowth: null,
        areaGrowth: null,
        trends: {}
      }
    }
  }
}

export const userApi = new UserApi()
export default userApi
