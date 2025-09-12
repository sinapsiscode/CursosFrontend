import baseApi from './baseApi.js'
import { mockUsers } from '../mockData.js'

/**
 * API service for student management
 * Migrado desde frontend/src/services/api.js con mejores prácticas
 */
class StudentApi {
  // Obtener todos los estudiantes
  async getStudents() {
    try {
      // En modo desarrollo usar mock data
      if (import.meta.env.DEV) {
        return this.getStoredStudents()
      }
      return await baseApi.get('/students')
    } catch (error) {
      console.warn('Usando datos locales como respaldo:', error.message)
      return this.getStoredStudents()
    }
  }

  // Crear nuevo estudiante
  async createStudent(studentData) {
    try {
      const result = await baseApi.post('/students', studentData)
      // Actualizar también el storage local
      await this.addToStoredStudents(result.student)
      return result
    } catch (error) {
      console.warn('Guardando localmente:', error.message)
      return this.createStudentLocal(studentData)
    }
  }

  // Actualizar estudiante
  async updateStudent(studentId, updateData) {
    try {
      const result = await baseApi.put(`/students/${studentId}`, updateData)
      await this.updateStoredStudent(studentId, updateData)
      return result
    } catch (error) {
      console.warn('Actualizando localmente:', error.message)
      return this.updateStudentLocal(studentId, updateData)
    }
  }

  // Suspender/reactivar estudiante
  async toggleStudentSuspension(studentId) {
    try {
      const result = await baseApi.patch(`/students/${studentId}/toggle-suspension`)
      await this.toggleSuspensionLocal(studentId)
      return result
    } catch (error) {
      console.warn('Cambiando estado localmente:', error.message)
      return this.toggleSuspensionLocal(studentId)
    }
  }

  // Eliminar estudiante
  async deleteStudent(studentId) {
    try {
      const result = await baseApi.delete(`/students/${studentId}`)
      await this.deleteFromStoredStudents(studentId)
      return result
    } catch (error) {
      console.warn('Eliminando localmente:', error.message)
      return this.deleteStudentLocal(studentId)
    }
  }

  // Gestión de inscripciones
  async getCourseStudents(courseId) {
    try {
      if (import.meta.env.DEV) {
        return this.getCourseStudentsLocal(courseId)
      }
      return await baseApi.get(`/courses/${courseId}/students`)
    } catch (error) {
      console.warn('Usando datos locales:', error.message)
      return this.getCourseStudentsLocal(courseId)
    }
  }

  async enrollStudentInCourse(courseId, userId) {
    try {
      const result = await baseApi.post(`/courses/${courseId}/students`, { userId })
      await this.enrollStudentLocal(courseId, userId)
      return result
    } catch (error) {
      console.warn('Inscribiendo localmente:', error.message)
      return this.enrollStudentLocal(courseId, userId)
    }
  }

  async removeStudentFromCourse(courseId, userId) {
    try {
      const result = await baseApi.delete(`/courses/${courseId}/students/${userId}`)
      await this.removeStudentLocal(courseId, userId)
      return result
    } catch (error) {
      console.warn('Removiendo localmente:', error.message)
      return this.removeStudentLocal(courseId, userId)
    }
  }

  // Verificar inscripción
  async isUserEnrolledInCourse(userId, courseId) {
    try {
      return await baseApi.get(`/students/${userId}/enrollments/${courseId}`)
    } catch (error) {
      console.warn('Verificando localmente:', error.message)
      return this.isEnrolledLocal(userId, courseId)
    }
  }

  // MÉTODOS LOCALES (localStorage)
  getStoredStudents() {
    try {
      const stored = localStorage.getItem('students')
      if (stored) {
        return JSON.parse(stored)
      }
      
      // Inicializar con mockUsers si no hay datos
      const students = mockUsers
        .filter(user => user.role === 'user')
        .map(user => ({
          ...user,
          dni: user.dni || '00000000',
          university: user.university || 'Universidad no especificada',
          suspended: user.suspended || false,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString()
        }))
      
      this.saveStudents(students)
      return students
    } catch (error) {
      console.error('Error reading students:', error)
      return []
    }
  }

  saveStudents(students) {
    try {
      localStorage.setItem('students', JSON.stringify(students))
    } catch (error) {
      console.error('Error saving students:', error)
    }
  }

  async createStudentLocal(studentData) {
    const students = this.getStoredStudents()
    
    // Verificar email único
    const existingEmail = students.find(s => s.email === studentData.email)
    if (existingEmail) {
      throw new Error('Ya existe un estudiante con este email')
    }
    
    const newStudent = {
      id: `student_${Date.now()}`,
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    students.push(newStudent)
    this.saveStudents(students)
    
    return { success: true, student: newStudent }
  }

  async updateStudentLocal(studentId, updateData) {
    const students = this.getStoredStudents()
    const studentIndex = students.findIndex(s => s.id === studentId)
    
    if (studentIndex === -1) {
      throw new Error('Estudiante no encontrado')
    }
    
    // Verificar email único
    const existingEmail = students.find(s => s.email === updateData.email && s.id !== studentId)
    if (existingEmail) {
      throw new Error('Ya existe otro estudiante con este email')
    }
    
    students[studentIndex] = {
      ...students[studentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    this.saveStudents(students)
    
    return { success: true, student: students[studentIndex] }
  }

  async toggleSuspensionLocal(studentId) {
    const students = this.getStoredStudents()
    const studentIndex = students.findIndex(s => s.id === studentId)
    
    if (studentIndex === -1) {
      throw new Error('Estudiante no encontrado')
    }
    
    students[studentIndex] = {
      ...students[studentIndex],
      suspended: !students[studentIndex].suspended,
      suspendedAt: !students[studentIndex].suspended ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    }
    
    this.saveStudents(students)
    
    return { success: true, student: students[studentIndex] }
  }

  async deleteStudentLocal(studentId) {
    const students = this.getStoredStudents()
    const filteredStudents = students.filter(s => s.id !== studentId)
    
    if (students.length === filteredStudents.length) {
      throw new Error('Estudiante no encontrado')
    }
    
    // También eliminar inscripciones del estudiante
    this.removeAllEnrollmentsForStudent(studentId)
    
    this.saveStudents(filteredStudents)
    
    return { success: true }
  }

  // Gestión de inscripciones (localStorage)
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
    } catch (error) {
      console.error('Error saving enrollments:', error)
    }
  }

  async getCourseStudentsLocal(courseId) {
    const enrollments = this.getStoredEnrollments()
    const courseEnrollments = enrollments.filter(enrollment => 
      enrollment.courseId === parseInt(courseId)
    )
    
    const students = this.getStoredStudents()
    return courseEnrollments.map(enrollment => {
      const student = students.find(s => s.id === enrollment.userId)
      return {
        ...enrollment,
        userName: student?.name || 'Estudiante no encontrado',
        userEmail: student?.email || 'Email no disponible'
      }
    })
  }

  async enrollStudentLocal(courseId, userId) {
    const enrollments = this.getStoredEnrollments()
    
    // Verificar si ya está inscrito
    const existing = enrollments.find(e => 
      e.courseId === parseInt(courseId) && e.userId === userId
    )
    if (existing) {
      throw new Error('El estudiante ya está inscrito en este curso')
    }
    
    const newEnrollment = {
      id: `enrollment_${Date.now()}`,
      courseId: parseInt(courseId),
      userId,
      enrolledAt: new Date().toISOString(),
      status: 'active',
      progress: 0
    }
    
    enrollments.push(newEnrollment)
    this.saveEnrollments(enrollments)
    
    return { success: true, enrollment: newEnrollment }
  }

  async removeStudentLocal(courseId, userId) {
    const enrollments = this.getStoredEnrollments()
    const filteredEnrollments = enrollments.filter(e => 
      !(e.courseId === parseInt(courseId) && e.userId === userId)
    )
    
    this.saveEnrollments(filteredEnrollments)
    
    return { success: true }
  }

  removeAllEnrollmentsForStudent(studentId) {
    const enrollments = this.getStoredEnrollments()
    const filteredEnrollments = enrollments.filter(e => e.userId !== studentId)
    this.saveEnrollments(filteredEnrollments)
  }

  async isEnrolledLocal(userId, courseId) {
    const enrollments = this.getStoredEnrollments()
    const isEnrolled = enrollments.some(e => 
      e.courseId === parseInt(courseId) && 
      e.userId === userId && 
      (e.status === 'active' || e.status === 'pending_payment')
    )
    
    return { isEnrolled }
  }

  // Utilidades
  async addToStoredStudents(student) {
    const students = this.getStoredStudents()
    students.push(student)
    this.saveStudents(students)
  }

  async updateStoredStudent(studentId, updateData) {
    const students = this.getStoredStudents()
    const studentIndex = students.findIndex(s => s.id === studentId)
    if (studentIndex !== -1) {
      students[studentIndex] = { ...students[studentIndex], ...updateData }
      this.saveStudents(students)
    }
  }

  async deleteFromStoredStudents(studentId) {
    const students = this.getStoredStudents()
    const filteredStudents = students.filter(s => s.id !== studentId)
    this.saveStudents(filteredStudents)
  }
}

export const studentApi = new StudentApi()
export default studentApi