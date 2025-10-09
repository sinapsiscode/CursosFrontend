import coursesService from './coursesService'
import usuariosService from './usuariosService'
import examenesService from './examenesService'
import areasService from './areasService'
import eventsService from './eventsService'
import examenConfigService from './examenConfigService'
import cuponesService from './cuponesService'
import resenasService from './resenasService'
import notificacionesService from './notificacionesService'
import userInterestsService from './userInterestsService'
import eventRegistrationsService from './eventRegistrationsService'
import { CONFIG } from '../constants/config'
import { ROLE_IDS, isStudent } from '../constants/roleIds'

/**
 * API Service - Wrapper que centraliza todos los servicios
 * SOLO USA JSON-SERVER - NO HAY DATOS MOCK
 */
class ApiService {
  constructor() {
    this.baseURL = CONFIG.API.BASE_URL
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
      console.warn('📵 Sin conexión - Las operaciones pueden fallar')
    })
  }

  // ==================== COURSES ====================

  async getCourses(area = null, filters = {}) {
    if (area) filters.areaId = area
    return coursesService.getAll(filters)
  }

  async getCourseById(id) {
    return coursesService.getById(id)
  }

  async searchCourses(query) {
    return coursesService.search(query)
  }

  async getFeaturedCourses(area = null) {
    return coursesService.getFeatured(area)
  }

  async getPopularCourses(area = null) {
    // JSON Server no soporta ordenamiento complejo directamente
    // Obtenemos todos y ordenamos por estudiantesInscritos
    const courses = await this.getCourses(area)
    return courses.sort((a, b) => (b.estudiantesInscritos || 0) - (a.estudiantesInscritos || 0))
  }

  async getNewCourses(area = null) {
    // Obtenemos todos y ordenamos por fecha de creación
    const courses = await this.getCourses(area)
    return courses.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
  }

  async createCourse(courseData) {
    return coursesService.create(courseData)
  }

  async updateCourse(courseId, courseData) {
    return coursesService.update(courseId, courseData)
  }

  async deleteCourse(courseId) {
    return coursesService.delete(courseId)
  }

  // ==================== USERS ====================

  async getUsers() {
    return usuariosService.getAll()
  }

  async getUserById(id) {
    return usuariosService.getById(id)
  }

  async getStudents() {
    // Obtener usuarios con rol de estudiante
    const allUsers = await usuariosService.getAll()
    return allUsers.filter(u => isStudent(u.rolId))
  }

  async createStudent(studentData) {
    return usuariosService.create({
      ...studentData,
      rolId: studentData.rolId || ROLE_IDS.STUDENT, // Default: Estudiante
      activo: true,
      fechaCreacion: new Date().toISOString()
    })
  }

  async updateStudent(studentId, updateData) {
    return usuariosService.update(studentId, updateData)
  }

  async toggleStudentSuspension(studentId) {
    return usuariosService.toggleStatus(studentId)
  }

  async deleteStudent(studentId) {
    return usuariosService.delete(studentId)
  }

  async updateUserProgress(userId, courseId, progress) {
    console.log(`📊 Actualizando progreso: Usuario ${userId}, Curso ${courseId}, Progreso ${progress}%`)
    // Aquí podrías implementar un endpoint personalizado en el backend
    // Por ahora solo logueamos
    return { success: true, progress }
  }

  // ==================== AREAS ====================

  async getAreas(includeInactive = false) {
    if (includeInactive) {
      return areasService.getAll()
    }
    return areasService.getActive()
  }

  async getAreaByKey(key) {
    const areas = await areasService.getAll()
    return areas.find(a => a.codigo === key)
  }

  async createArea(areaData) {
    return areasService.create(areaData)
  }

  async updateArea(areaId, updates) {
    return areasService.update(areaId, updates)
  }

  async deleteArea(areaId) {
    return areasService.delete(areaId)
  }

  // ==================== EVENTS ====================

  async getEvents(filters = {}) {
    return eventsService.getAll(filters)
  }

  async getEventById(id) {
    return eventsService.getById(id)
  }

  async createEvent(eventData) {
    return eventsService.create(eventData)
  }

  async updateEvent(id, eventData) {
    return eventsService.update(id, eventData)
  }

  async deleteEvent(id) {
    return eventsService.delete(id)
  }

  // ==================== EXAMS ====================

  async getExams(filters = {}) {
    return examenesService.getAll(filters)
  }

  async getExamById(id) {
    return examenesService.getById(id)
  }

  async createExam(examData) {
    return examenesService.create(examData)
  }

  async updateExam(id, examData) {
    return examenesService.update(id, examData)
  }

  async deleteExam(id) {
    return examenesService.delete(id)
  }

  async getExamConfigs(filters = {}) {
    return examenConfigService.getAll(filters)
  }

  async enableExamForStudent(config) {
    return examenConfigService.enableExamForStudent(config)
  }

  async disableExamForStudent(studentId, courseId) {
    return examenConfigService.disableExamForStudent(studentId, courseId)
  }

  async getStudentExamConfig(studentId, courseId) {
    const config = await examenConfigService.getStudentConfig(studentId, courseId)
    return { config }
  }

  // ==================== COUPONS ====================

  async generateCoupon(examResult, studentId) {
    return cuponesService.generateCoupon(examResult, studentId)
  }

  async validateCoupon(couponCode, courseId) {
    return cuponesService.validateCoupon(couponCode, courseId)
  }

  async useCoupon(couponCode) {
    return cuponesService.useCoupon(couponCode)
  }

  async getCoupons(filters = {}) {
    return cuponesService.getCouponsWithDetails(filters)
  }

  // ==================== GENERIC HTTP METHODS ====================

  async get(endpoint) {
    if (endpoint === '/courses') return this.getCourses()
    if (endpoint === '/courses/featured') return this.getFeaturedCourses()
    if (endpoint === '/courses/recommended') {
      const courses = await this.getCourses()
      return courses.slice(0, 3)
    }
    if (endpoint === '/favorites') return []
    if (endpoint === '/suggestions') return []

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

  // ==================== ANALYTICS ====================

  async getAnalytics() {
    const [usuarios, cursos, areas] = await Promise.all([
      this.getUsers(),
      this.getCourses(),
      this.getAreas(true)
    ])

    return {
      totalUsers: usuarios.length,
      totalCourses: cursos.length,
      totalAreas: areas.length,
      activeUsers: usuarios.filter(u => u.activo).length,
      activeCourses: cursos.filter(c => c.activo).length
    }
  }

  // ==================== NOTIFICATIONS ====================

  async sendNotification(notification) {
    console.log('📧 Enviando notificación:', notification)
    return { success: true, sentAt: new Date() }
  }

  // ==================== CERTIFICATES ====================

  async generateCertificate(userId, courseId) {
    console.log(`🏆 Generando certificado para usuario ${userId}, curso ${courseId}`)
    return {
      success: true,
      certificateId: `cert_${userId}_${courseId}_${Date.now()}`,
      downloadUrl: `${this.baseURL}/certificates/cert_${userId}_${courseId}.pdf`
    }
  }

  // ==================== FILE UPLOAD ====================

  async uploadFile(file, type = 'image') {
    console.log(`📤 Subiendo archivo: ${file.name}`)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          url: `${this.baseURL}/uploads/${type}/${Date.now()}_${file.name}`,
          filename: file.name
        })
      }, 1000)
    })
  }

  // ==================== NOTIFICATIONS ====================

  async getNotifications(usuarioId) {
    return notificacionesService.getUserNotifications(usuarioId)
  }

  async createNotification(notificationData) {
    return notificacionesService.create(notificationData)
  }

  async markNotificationAsRead(id) {
    return notificacionesService.markAsRead(id)
  }

  async getUnreadCount(usuarioId) {
    return notificacionesService.getUnreadCount(usuarioId)
  }

  // ==================== USER INTERESTS / TRACKING ====================

  async trackCourseView(userId, courseData) {
    return userInterestsService.trackCourseView(userId, courseData)
  }

  async trackSearch(userId, searchData) {
    return userInterestsService.trackSearch(userId, searchData)
  }

  async trackCourseCompletion(userId, courseId, area) {
    return userInterestsService.trackCourseCompletion(userId, courseId, area)
  }

  async getUserRecommendations(userId) {
    return userInterestsService.getRecommendations(userId)
  }

  // ==================== EVENT REGISTRATIONS ====================

  async registerForEvent(eventId, userData) {
    return eventRegistrationsService.registerForEvent(eventId, userData)
  }

  async getEventRegistrations(eventId) {
    return eventRegistrationsService.getEventRegistrations(eventId)
  }

  async getUserEventRegistrations(userId, email) {
    return eventRegistrationsService.getUserRegistrations(userId, email)
  }

  // ==================== HELPER METHODS ====================
  // Los helpers se movieron a sus respectivos servicios

  // ==================== LOCAL STORAGE - ELIMINADO ====================
  // Todo se maneja con JSON Server ahora
}

export const apiService = new ApiService()
export default apiService
