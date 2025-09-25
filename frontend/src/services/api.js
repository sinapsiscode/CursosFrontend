import { mockAPI, mockUsers } from './mockData'

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api'
    this.isOnline = navigator.onLine
    this.setupNetworkListeners()
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('🌐 Conexión restaurada')
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('📵 Sin conexión - usando datos locales')
    })
  }

  async handleRequest(requestFn, fallbackData = null) {
    try {
      // Simular delay de red
      const delay = Math.random() * 500 + 200
      await new Promise(resolve => setTimeout(resolve, delay))

      return await requestFn()
    } catch (error) {
      console.error('API Error:', error)

      // Si hay datos de respaldo, usarlos
      if (fallbackData) {
        console.log('📦 Usando datos locales como respaldo')
        return fallbackData
      }

      throw error
    }
  }

  // HTTP Methods
  async get(endpoint) {
    // Map common endpoints to existing methods
    if (endpoint === '/courses') {
      return this.getCourses()
    }
    if (endpoint === '/courses/featured') {
      return this.getFeaturedCourses()
    }
    if (endpoint === '/courses/recommended') {
      const courses = await this.getCourses()
      return courses.slice(0, 3) // Return first 3 as recommended
    }
    if (endpoint === '/courses/continue') {
      return null // No continue course by default
    }
    if (endpoint === '/favorites') {
      return []
    }
    if (endpoint === '/suggestions') {
      return []
    }

    // Default empty response
    return { data: [] }
  }

  async post(endpoint, data) {
    console.log(`POST ${endpoint}:`, data)
    return { success: true, data }
  }

  async put(endpoint, data) {
    console.log(`PUT ${endpoint}:`, data)
    return { success: true, data }
  }

  async delete(endpoint) {
    console.log(`DELETE ${endpoint}`)
    return { success: true }
  }

  // Courses
  async getCourses(area = null, filters = {}) {
    return this.handleRequest(() => mockAPI.getCourses(area))
  }

  async getCourseById(id) {
    return this.handleRequest(() => mockAPI.getCourseById(id))
  }

  async searchCourses(query) {
    return this.handleRequest(() => mockAPI.searchCourses(query))
  }

  async getFeaturedCourses(area = null) {
    const courses = await this.getCourses(area)
    return courses.filter(course => course.featured)
  }

  async getPopularCourses(area = null) {
    const courses = await this.getCourses(area)
    return courses.filter(course => course.popular)
  }

  async getNewCourses(area = null) {
    const courses = await this.getCourses(area)
    return courses.filter(course => course.isNew)
  }

  // Users
  async getUsers() {
    return this.handleRequest(() => mockAPI.getUsers())
  }

  async getUserById(id) {
    return this.handleRequest(() => mockAPI.getUserById(id))
  }

  async updateUserProgress(userId, courseId, progress) {
    return this.handleRequest(async () => {
      // Simular actualización de progreso
      console.log(`📊 Actualizando progreso: Usuario ${userId}, Curso ${courseId}, Progreso ${progress}%`)
      return { success: true, progress }
    })
  }

  // Authentication
  async login(email, password) {
    return this.handleRequest(() => mockAPI.login(email, password))
  }

  async register(userData) {
    return this.handleRequest(() => mockAPI.register(userData))
  }

  async logout() {
    return this.handleRequest(async () => {
      console.log('👋 Cerrando sesión')
      return { success: true }
    })
  }

  // Learning Paths
  async getLearningPaths(area = null) {
    return this.handleRequest(() => mockAPI.getLearningPaths(area))
  }

  async enrollInPath(pathId, userId) {
    return this.handleRequest(async () => {
      console.log(`🎯 Usuario ${userId} inscrito en ruta ${pathId}`)
      return { success: true, enrolledAt: new Date() }
    })
  }

  // Ranking
  async getWeeklyRanking() {
    return this.handleRequest(() => mockAPI.getWeeklyRanking())
  }

  async updateUserPoints(userId, points) {
    return this.handleRequest(async () => {
      console.log(`⭐ Usuario ${userId} ganó ${points} puntos`)
      return { success: true, totalPoints: points }
    })
  }

  // Video streaming simulation
  async getVideoUrl(courseId, lessonId) {
    return this.handleRequest(async () => {
      // Simular URL de video
      const videoUrl = `https://example.com/videos/${courseId}/${lessonId}.mp4`
      console.log(`📹 URL de video generada: ${videoUrl}`)
      return { videoUrl, duration: 1800 } // 30 minutos
    })
  }

  // Course enrollment management
  async getCoursesWithEnrollment(area = null) {
    return this.handleRequest(async () => {
      const courses = await mockAPI.getCourses(area)
      
      // Aplicar cambios temporales guardados en sessionStorage
      const enrollmentChanges = this.getSessionEnrollmentChanges()
      
      return courses.map(course => {
        const tempEnrollment = enrollmentChanges[course.id]
        const enrolledStudents = tempEnrollment !== undefined ? tempEnrollment : course.enrolledStudents || 0
        
        return {
          ...course,
          enrolledStudents,
          enrollmentData: {
            totalEnrolled: enrolledStudents,
            totalHistorical: course.students || 0,
            enrollmentRate: enrolledStudents && course.students 
              ? Math.round((enrolledStudents / course.students) * 100)
              : 0
          }
        }
      })
    })
  }

  getSessionEnrollmentChanges() {
    try {
      const stored = sessionStorage.getItem('admin_enrollment_changes')
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error reading enrollment changes:', error)
      return {}
    }
  }

  saveSessionEnrollmentChange(courseId, newEnrollment) {
    try {
      const changes = this.getSessionEnrollmentChanges()
      changes[courseId] = newEnrollment
      sessionStorage.setItem('admin_enrollment_changes', JSON.stringify(changes))
      console.log('📝 Cambio de inscripción guardado temporalmente:', { courseId, newEnrollment })
    } catch (error) {
      console.error('Error saving enrollment change:', error)
    }
  }

  clearSessionEnrollmentChanges() {
    sessionStorage.removeItem('admin_enrollment_changes')
    console.log('🧹 Cambios temporales de inscripción eliminados')
  }

  async updateCourseEnrollment(courseId, newEnrollmentCount) {
    return this.handleRequest(async () => {
      // Guardar el cambio en sessionStorage para persistencia temporal
      this.saveSessionEnrollmentChange(courseId, newEnrollmentCount)
      
      console.log(`📊 Inscripciones actualizadas para curso ${courseId}: ${newEnrollmentCount}`)
      return { 
        success: true, 
        courseId,
        newEnrollmentCount,
        timestamp: new Date()
      }
    })
  }

  // Individual student enrollment management
  async getCourseStudents(courseId) {
    return this.handleRequest(async () => {
      // Primero intentar obtener datos desde enrolledStudentsData en el curso
      const courses = await this.getCourses()
      const course = courses.find(c => c.id === parseInt(courseId))
      
      if (course && course.enrolledStudentsData && course.enrolledStudentsData.length > 0) {
        // Usar los datos JSON del curso
        return course.enrolledStudentsData.map(student => ({
          id: `enrollment_${courseId}_${student.id}`,
          userId: student.id,
          courseId: parseInt(courseId),
          userName: student.name,
          userEmail: student.email,
          enrollmentDate: student.enrollmentDate,
          progress: student.progress,
          suspended: student.suspended,
          lastActivity: student.lastActivity,
          phone: student.phone,
          selectedArea: student.selectedArea
        }))
      }
      
      // Fallback: usar el método anterior con enrollments almacenados
      const enrollments = this.getStoredEnrollments()
      const courseEnrollments = enrollments.filter(enrollment => enrollment.courseId === parseInt(courseId))
      
      // Enriquecer con datos del estudiante
      const students = this.getStoredStudents()
      return courseEnrollments.map(enrollment => {
        const student = students.find(s => s.id === enrollment.userId)
        return {
          ...enrollment,
          userName: student?.name || 'Estudiante no encontrado',
          userEmail: student?.email || 'Email no disponible'
        }
      })
    })
  }

  async enrollStudentInCourse(courseId, userId) {
    return this.handleRequest(async () => {
      const enrollments = this.getStoredEnrollments()
      
      // Verificar si ya está inscrito
      const existing = enrollments.find(e => e.courseId === courseId && e.userId === userId)
      if (existing) {
        throw new Error('El estudiante ya está inscrito en este curso')
      }
      
      // Crear nueva inscripción
      const newEnrollment = {
        id: `enrollment_${Date.now()}`,
        courseId,
        userId,
        enrolledAt: new Date().toISOString(),
        status: 'active'
      }
      
      enrollments.push(newEnrollment)
      this.saveEnrollments(enrollments)
      
      console.log(`✅ Estudiante ${userId} inscrito en curso ${courseId}`)
      return { success: true, enrollment: newEnrollment }
    })
  }

  async removeStudentFromCourse(courseId, userId) {
    return this.handleRequest(async () => {
      const enrollments = this.getStoredEnrollments()
      const filteredEnrollments = enrollments.filter(e => 
        !(e.courseId === courseId && e.userId === userId)
      )
      
      this.saveEnrollments(filteredEnrollments)
      
      console.log(`✅ Estudiante ${userId} removido del curso ${courseId}`)
      return { success: true }
    })
  }

  async isUserEnrolledInCourse(userId, courseId) {
    return this.handleRequest(async () => {
      const enrollments = this.getStoredEnrollments()
      const isEnrolled = enrollments.some(e => 
        e.courseId === courseId && e.userId === userId && (e.status === 'active' || e.status === 'pending_payment')
      )
      
      console.log('🔍 Verificando inscripción:', { userId, courseId, enrollments: enrollments.length, isEnrolled })
      return { isEnrolled }
    })
  }

  getStoredEnrollments() {
    try {
      const stored = localStorage.getItem('student_enrollments')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading enrollments:', error)
      return []
    }
  }

  saveEnrollments(enrollments) {
    try {
      localStorage.setItem('student_enrollments', JSON.stringify(enrollments))
      console.log('💾 Inscripciones guardadas:', enrollments.length)
    } catch (error) {
      console.error('Error saving enrollments:', error)
    }
  }

  // Student Management
  async getStudents() {
    return this.handleRequest(async () => {
      const students = this.getStoredStudents()
      return students
    })
  }

  async createStudent(studentData) {
    return this.handleRequest(async () => {
      const students = this.getStoredStudents()
      
      // Verificar email único
      const existingEmail = students.find(s => s.email === studentData.email)
      if (existingEmail) {
        throw new Error('Ya existe un estudiante con este email')
      }
      
      // Crear nuevo estudiante
      const newStudent = {
        id: `student_${Date.now()}`,
        ...studentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      students.push(newStudent)
      this.saveStudents(students)
      
      console.log('✅ Estudiante creado:', newStudent.name)
      return { success: true, student: newStudent }
    })
  }

  async updateStudent(studentId, updateData) {
    return this.handleRequest(async () => {
      const students = this.getStoredStudents()
      const studentIndex = students.findIndex(s => s.id === studentId)
      
      if (studentIndex === -1) {
        throw new Error('Estudiante no encontrado')
      }
      
      // Verificar email único (excluyendo el actual)
      const existingEmail = students.find(s => s.email === updateData.email && s.id !== studentId)
      if (existingEmail) {
        throw new Error('Ya existe otro estudiante con este email')
      }
      
      // Actualizar estudiante
      students[studentIndex] = {
        ...students[studentIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      
      this.saveStudents(students)
      
      console.log('✅ Estudiante actualizado:', students[studentIndex].name)
      return { success: true, student: students[studentIndex] }
    })
  }

  async toggleStudentSuspension(studentId) {
    return this.handleRequest(async () => {
      const students = this.getStoredStudents()
      const studentIndex = students.findIndex(s => s.id === studentId)
      
      if (studentIndex === -1) {
        throw new Error('Estudiante no encontrado')
      }
      
      // Cambiar estado de suspensión
      students[studentIndex] = {
        ...students[studentIndex],
        suspended: !students[studentIndex].suspended,
        suspendedAt: !students[studentIndex].suspended ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      }
      
      this.saveStudents(students)
      
      const action = students[studentIndex].suspended ? 'suspendido' : 'reactivado'
      console.log(`✅ Estudiante ${action}:`, students[studentIndex].name)
      return { success: true, student: students[studentIndex] }
    })
  }

  async deleteStudent(studentId) {
    return this.handleRequest(async () => {
      const students = this.getStoredStudents()
      const filteredStudents = students.filter(s => s.id !== studentId)
      
      if (students.length === filteredStudents.length) {
        throw new Error('Estudiante no encontrado')
      }
      
      // También eliminar inscripciones del estudiante
      const enrollments = this.getStoredEnrollments()
      const filteredEnrollments = enrollments.filter(e => e.userId !== studentId)
      this.saveEnrollments(filteredEnrollments)
      
      this.saveStudents(filteredStudents)
      
      console.log('✅ Estudiante eliminado y sus inscripciones removidas')
      return { success: true }
    })
  }

  getStoredStudents() {
    try {
      const stored = localStorage.getItem('students')
      if (stored) {
        return JSON.parse(stored)
      }
      
      // Si no hay datos almacenados, inicializar con mockUsers
      // Filtrar solo usuarios con role: 'user' y agregar campos requeridos
      const students = mockUsers
        .filter(user => user.role === 'user')
        .map(user => ({
          ...user,
          dni: user.dni || '00000000',
          university: user.university || 'Universidad no especificada',
          suspended: user.suspended || false
        }))
      
      // Guardar en localStorage para futuras consultas
      this.saveStudents(students)
      console.log('🔄 Estudiantes inicializados desde mockData:', students.length)
      return students
      
    } catch (error) {
      console.error('Error reading students:', error)
      return []
    }
  }

  saveStudents(students) {
    try {
      localStorage.setItem('students', JSON.stringify(students))
      console.log('💾 Estudiantes guardados:', students.length)
    } catch (error) {
      console.error('Error saving students:', error)
    }
  }

  // Admin functions
  async getAnalytics() {
    return this.handleRequest(async () => {
      return {
        totalUsers: 15420,
        totalCourses: 156,
        totalHours: 2340,
        completionRate: 78,
        revenueThisMonth: 45600,
        newUsersThisWeek: 234
      }
    })
  }

  async createCourse(courseData) {
    return this.handleRequest(async () => {
      console.log('📚 Creando nuevo curso:', courseData.title)
      return { success: true, courseId: Date.now() }
    })
  }

  async updateCourse(courseId, courseData) {
    return this.handleRequest(async () => {
      console.log(`📝 Actualizando curso ${courseId}`)
      return { success: true }
    })
  }

  async deleteCourse(courseId) {
    return this.handleRequest(async () => {
      console.log(`🗑️ Eliminando curso ${courseId}`)
      return { success: true }
    })
  }

  // Notifications
  async sendNotification(notification) {
    return this.handleRequest(async () => {
      console.log('📧 Enviando notificación:', notification)
      return { success: true, sentAt: new Date() }
    })
  }

  // Certificates
  async generateCertificate(userId, courseId) {
    return this.handleRequest(async () => {
      console.log(`🏆 Generando certificado para usuario ${userId}, curso ${courseId}`)
      return {
        success: true,
        certificateId: `cert_${userId}_${courseId}_${Date.now()}`,
        downloadUrl: `https://example.com/certificates/cert_${userId}_${courseId}.pdf`
      }
    })
  }

  // Areas and Levels management
  async getAreas(includeInactive = false) {
    return this.handleRequest(() => mockAPI.getAreas(includeInactive))
  }

  async getAreaByKey(key) {
    return this.handleRequest(() => mockAPI.getAreaByKey(key))
  }

  async getLevels() {
    return this.handleRequest(() => mockAPI.getLevels())
  }

  async createArea(areaData) {
    return this.handleRequest(() => {
      console.log('🌟 Creando nueva área:', areaData.name)
      return mockAPI.createArea(areaData)
    })
  }

  async updateArea(areaId, updates) {
    return this.handleRequest(() => {
      console.log(`✏️ Actualizando área ${areaId}`)
      return mockAPI.updateArea(areaId, updates)
    })
  }

  async deleteArea(areaId) {
    return this.handleRequest(() => {
      console.log(`🗑️ Eliminando área ${areaId}`)
      return mockAPI.deleteArea(areaId)
    })
  }


  // File upload simulation
  async uploadFile(file, type = 'image') {
    return this.handleRequest(async () => {
      console.log(`📤 Subiendo archivo: ${file.name}`)
      // Simular progreso de subida
      return new Promise((resolve) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          console.log(`Upload progress: ${progress}%`)
          if (progress >= 100) {
            clearInterval(interval)
            resolve({
              success: true,
              url: `https://example.com/uploads/${type}/${Date.now()}_${file.name}`,
              filename: file.name
            })
          }
        }, 100)
      })
    })
  }

  // Offline data management
  saveOfflineData(key, data) {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      }))
      console.log(`💾 Datos guardados offline: ${key}`)
    } catch (error) {
      console.error('Error guardando datos offline:', error)
    }
  }

  getOfflineData(key) {
    try {
      const stored = localStorage.getItem(`offline_${key}`)
      if (stored) {
        const { data, expires } = JSON.parse(stored)
        if (Date.now() < expires) {
          console.log(`📱 Usando datos offline: ${key}`)
          return data
        } else {
          localStorage.removeItem(`offline_${key}`)
        }
      }
      return null
    } catch (error) {
      console.error('Error leyendo datos offline:', error)
      return null
    }
  }

  clearOfflineData() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('offline_'))
    keys.forEach(key => localStorage.removeItem(key))
    console.log('🧹 Datos offline eliminados')
  }

  // Exam Management
  async getExamConfigs() {
    return this.handleRequest(async () => {
      const configs = this.getStoredExamConfigs()
      return configs
    })
  }

  async enableExamForStudent(config) {
    return this.handleRequest(async () => {
      const configs = this.getStoredExamConfigs()
      
      // Crear nueva configuración de examen
      const newConfig = {
        id: `exam_config_${Date.now()}`,
        ...config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Verificar si ya existe una configuración para este estudiante y curso
      const existingIndex = configs.findIndex(c => 
        c.studentId === config.studentId && c.courseId === config.courseId
      )
      
      if (existingIndex !== -1) {
        configs[existingIndex] = newConfig
        console.log('✅ Configuración de examen actualizada')
      } else {
        configs.push(newConfig)
        console.log('✅ Configuración de examen creada')
      }
      
      this.saveExamConfigs(configs)
      return { success: true, config: newConfig }
    })
  }

  async disableExamForStudent(studentId, courseId) {
    return this.handleRequest(async () => {
      const configs = this.getStoredExamConfigs()
      const filteredConfigs = configs.filter(c => 
        !(c.studentId === studentId && c.courseId === courseId)
      )
      
      this.saveExamConfigs(filteredConfigs)
      
      console.log('✅ Configuración de examen deshabilitada')
      return { success: true }
    })
  }

  async getStudentExamConfig(studentId, courseId) {
    return this.handleRequest(async () => {
      const configs = this.getStoredExamConfigs()
      const config = configs.find(c => 
        c.studentId === studentId && c.courseId === courseId && c.enabled
      )
      return { config: config || null }
    })
  }

  getStoredExamConfigs() {
    try {
      const stored = localStorage.getItem('exam_configs')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading exam configs:', error)
      return []
    }
  }

  saveExamConfigs(configs) {
    try {
      localStorage.setItem('exam_configs', JSON.stringify(configs))
      console.log('💾 Configuraciones de exámenes guardadas:', configs.length)
    } catch (error) {
      console.error('Error saving exam configs:', error)
    }
  }

  // Coupon Management
  async generateCoupon(examResult, studentId) {
    return this.handleRequest(async () => {
      if (examResult.discount <= 0) {
        throw new Error('El resultado del examen no genera descuento')
      }
      
      const coupons = this.getStoredCoupons()
      const couponCode = this.generateCouponCode()
      
      const newCoupon = {
        id: `coupon_${Date.now()}`,
        code: couponCode,
        studentId,
        courseId: examResult.courseId,
        examId: examResult.examId,
        discountPercentage: examResult.discount,
        expirationDate: this.calculateExpirationDate(30), // 30 días por defecto
        isUsed: false,
        createdAt: new Date().toISOString(),
        usedAt: null
      }
      
      coupons.push(newCoupon)
      this.saveCoupons(coupons)
      
      console.log('✅ Cupón generado:', couponCode)
      return { success: true, coupon: newCoupon }
    })
  }

  async validateCoupon(couponCode, courseId) {
    return this.handleRequest(async () => {
      const coupons = this.getStoredCoupons()
      const coupon = coupons.find(c => c.code === couponCode)
      
      if (!coupon) {
        return { valid: false, message: 'Código de cupón no válido' }
      }
      
      if (coupon.isUsed) {
        return { valid: false, message: 'Este cupón ya ha sido utilizado' }
      }
      
      if (new Date() > new Date(coupon.expirationDate)) {
        return { valid: false, message: 'Este cupón ha expirado' }
      }
      
      if (coupon.courseId !== courseId) {
        return { valid: false, message: 'Este cupón no es válido para este curso' }
      }
      
      return { valid: true, coupon }
    })
  }

  async useCoupon(couponCode) {
    return this.handleRequest(async () => {
      const coupons = this.getStoredCoupons()
      const couponIndex = coupons.findIndex(c => c.code === couponCode)
      
      if (couponIndex === -1) {
        throw new Error('Cupón no encontrado')
      }
      
      coupons[couponIndex].isUsed = true
      coupons[couponIndex].usedAt = new Date().toISOString()
      
      this.saveCoupons(coupons)
      
      console.log('✅ Cupón utilizado:', couponCode)
      return { success: true }
    })
  }

  async getCoupons(filters = {}) {
    return this.handleRequest(async () => {
      let coupons = this.getStoredCoupons()
      
      // Enriquecer con datos de estudiante y curso
      const students = this.getStoredStudents()
      const courses = await this.getCourses()
      
      coupons = coupons.map(coupon => {
        const student = students.find(s => s.id === coupon.studentId)
        const course = courses.find(c => c.id === coupon.courseId)
        
        return {
          ...coupon,
          studentName: student?.name || 'Estudiante no encontrado',
          studentEmail: student?.email || 'Email no disponible',
          courseTitle: course?.title || 'Curso no encontrado'
        }
      })
      
      // Aplicar filtros
      if (filters.status) {
        if (filters.status === 'active') {
          coupons = coupons.filter(c => !c.isUsed && new Date() <= new Date(c.expirationDate))
        } else if (filters.status === 'used') {
          coupons = coupons.filter(c => c.isUsed)
        } else if (filters.status === 'expired') {
          coupons = coupons.filter(c => !c.isUsed && new Date() > new Date(c.expirationDate))
        }
      }
      
      return coupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })
  }

  generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'DESC-'
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  calculateExpirationDate(days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString()
  }

  getStoredCoupons() {
    try {
      const stored = localStorage.getItem('coupons')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading coupons:', error)
      return []
    }
  }

  saveCoupons(coupons) {
    try {
      localStorage.setItem('coupons', JSON.stringify(coupons))
      console.log('💾 Cupones guardados:', coupons.length)
    } catch (error) {
      console.error('Error saving coupons:', error)
    }
  }
}

export const apiService = new ApiService()
export default apiService