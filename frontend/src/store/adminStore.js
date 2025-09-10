import { create } from 'zustand'
import { useCourseStore } from './courseStore'

export const useAdminStore = create((set, get) => ({
  users: [],
  courses: [],
  coursesWithEnrollment: [],
  areas: [],
  levels: [],
  analytics: {
    totalUsers: 0,
    totalCourses: 0,
    totalHours: 0,
    completionRate: 0,
    revenueThisMonth: 0,
    newUsersThisWeek: 0
  },
  selectedUser: null,
  selectedCourse: null,
  notifications: [],
  profilePhotos: [],
  profileLinks: {
    proUpgradeUrl: '',
    whatsappChannelUrl: ''
  },
  profileButtons: {
    showProButton: true,
    showWhatsAppButton: true,
    showBanner: true,
    proButtonText: 'Subir a Pro',
    whatsAppButtonText: 'Unirse al Canal de WhatsApp',
    bannerButtonText: 'Ver más'
  },
  advertisingConfig: {
    bannerTitle: '¡Certifícate y potencia tu CV!',
    bannerSubtitle: 'Transforma tu carrera profesional con certificaciones oficiales que te destacarán en el mercado laboral',
    motivationalTitle: '💼 Destaca en el mercado laboral',
    motivationalSubtitle: 'Valida tus conocimientos con certificaciones oficiales reconocidas por la industria',
    motivationalQuote: '"El conocimiento certificado es tu mejor inversión profesional"'
  },
  loading: false,

  // User Management
  setUsers: (users) => set({ users }),
  
  addUser: (user) => set((state) => ({
    users: [...state.users, { ...user, id: Date.now(), createdAt: new Date() }]
  })),
  
  updateUser: (userId, updates) => set((state) => ({
    users: state.users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    )
  })),
  
  deleteUser: (userId) => set((state) => ({
    users: state.users.filter(user => user.id !== userId)
  })),

  setSelectedUser: (user) => set({ selectedUser: user }),

  // Course Management  
  setCourses: (courses) => set((state) => {
    console.log('🔄 AdminStore: Sobrescribiendo cursos - Antes:', state.courses?.length || 0, 'Después:', courses?.length || 0)
    return { courses }
  }),
  
  addCourse: (course) => set((state) => {
    const newCourse = { 
      ...course, 
      id: course.id || Date.now(), 
      createdAt: new Date(),
      students: 0,
      rating: 0
    }
    console.log('📚 AdminStore: Agregando curso:', newCourse.title, 'ID:', newCourse.id)
    console.log('📚 AdminStore: Total cursos antes:', state.courses.length)
    
    // Sincronizar con CourseStore para que aparezca en el área de estudiantes
    try {
      const courseStore = useCourseStore.getState()
      if (courseStore?.addDynamicCourse) {
        courseStore.addDynamicCourse(newCourse)
        console.log('🔄 AdminStore: Sincronizado con CourseStore')
      } else {
        console.log('⚠️ AdminStore: addDynamicCourse no disponible')
      }
    } catch (error) {
      console.error('❌ AdminStore: Error en sincronización:', error)
    }
    
    const newState = {
      courses: [...state.courses, newCourse]
    }
    console.log('📚 AdminStore: Total cursos después:', newState.courses.length)
    return newState
  }),
  
  updateCourse: (courseId, updates) => set((state) => {
    console.log('📝 AdminStore: Actualizando curso:', courseId)
    
    // Sincronizar con CourseStore
    const courseStore = useCourseStore.getState()
    courseStore.updateDynamicCourse(courseId, updates)
    console.log('🔄 AdminStore: Actualización sincronizada con CourseStore')
    
    return {
      courses: state.courses.map(course => 
        course.id === courseId ? { ...course, ...updates } : course
      )
    }
  }),
  
  deleteCourse: (courseId) => set((state) => {
    console.log('🗑️ AdminStore: Eliminando curso:', courseId)
    
    // Sincronizar con CourseStore
    const courseStore = useCourseStore.getState()
    courseStore.deleteDynamicCourse(courseId)
    console.log('🔄 AdminStore: Eliminación sincronizada con CourseStore')
    
    return {
      courses: state.courses.filter(course => course.id !== courseId)
    }
  }),

  duplicateCourse: (courseId) => set((state) => {
    const originalCourse = state.courses.find(course => course.id === courseId)
    if (originalCourse) {
      const duplicated = {
        ...originalCourse,
        id: Date.now(),
        title: `${originalCourse.title} (Copia)`,
        createdAt: new Date(),
        students: 0
      }
      return { courses: [...state.courses, duplicated] }
    }
    return state
  }),

  setSelectedCourse: (course) => set({ selectedCourse: course }),

  // Course Enrollment Management
  setCoursesWithEnrollment: (coursesWithEnrollment) => set({ coursesWithEnrollment }),
  
  updateCourseEnrollment: (courseId, enrolledStudents) => set((state) => ({
    coursesWithEnrollment: state.coursesWithEnrollment.map(course => 
      course.id === courseId 
        ? {
            ...course,
            enrolledStudents,
            enrollmentData: {
              ...course.enrollmentData,
              totalEnrolled: enrolledStudents,
              enrollmentRate: course.students 
                ? Math.round((enrolledStudents / course.students) * 100)
                : 0
            }
          }
        : course
    )
  })),

  getCourseEnrollmentData: () => {
    const courses = get().coursesWithEnrollment || []
    return {
      totalEnrolled: courses.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0),
      averageEnrollmentRate: courses.length > 0 
        ? Math.round(courses.reduce((sum, course) => sum + (course.enrollmentData?.enrollmentRate || 0), 0) / courses.length)
        : 0,
      topEnrolledCourses: courses
        .sort((a, b) => (b.enrolledStudents || 0) - (a.enrolledStudents || 0))
        .slice(0, 5),
      lowEnrollmentCourses: courses
        .filter(course => course.enrollmentData?.enrollmentRate < 30)
        .sort((a, b) => (a.enrollmentData?.enrollmentRate || 0) - (b.enrollmentData?.enrollmentRate || 0))
    }
  },

  getCoursesByEnrollmentRange: (min, max) => {
    const courses = get().coursesWithEnrollment || []
    return courses.filter(course => {
      const enrolled = course.enrolledStudents || 0
      return enrolled >= min && enrolled <= max
    })
  },

  // Areas Management
  setAreas: (areas) => set({ areas }),
  setLevels: (levels) => set({ levels }),

  addArea: (area) => set((state) => ({
    areas: [...state.areas, { ...area, id: Date.now(), createdAt: new Date() }]
  })),

  updateArea: (areaId, updates) => set((state) => ({
    areas: state.areas.map(area => 
      area.id === areaId ? { ...area, ...updates } : area
    )
  })),

  deleteArea: (areaId) => set((state) => ({
    areas: state.areas.filter(area => area.id !== areaId)
  })),

  getActiveAreas: () => {
    const areas = get().areas || []
    return areas.filter(area => area.active)
  },

  getAreaByKey: (key) => {
    const areas = get().areas || []
    return areas.find(area => area.key === key)
  },

  // Analytics
  updateAnalytics: (analytics) => set({ analytics }),
  
  calculateAnalytics: () => {
    // Obtener usuarios actualizados desde localStorage
    let users = get().users || []
    try {
      const storedUsers = JSON.parse(localStorage.getItem('userData') || '[]')
      if (storedUsers.length > 0) {
        // Combinar datos del store con datos actualizados de localStorage
        users = users.map(user => {
          const storedUser = storedUsers.find(su => su.id === user.id)
          return storedUser ? { ...user, ...storedUser } : user
        })
      }
    } catch (error) {
      console.error('Error loading users from localStorage:', error)
    }

    const courses = get().courses || []
    const totalUsers = users.length
    const totalCourses = courses.length
    
    // Calcular horas totales de uso real de usuarios (en horas)
    const totalUsageTimeMs = users.reduce((sum, user) => {
      return sum + (user.totalUsageTime || 0)
    }, 0)
    const totalHours = Math.round((totalUsageTimeMs / (1000 * 60 * 60)) * 100) / 100
    
    // Calculate completion rate based on user progress
    let totalProgress = 0
    let progressCount = 0
    
    users.forEach(user => {
      if (user.progress) {
        Object.values(user.progress).forEach(progress => {
          totalProgress += progress
          progressCount++
        })
      }
    })
    
    const completionRate = progressCount > 0 ? Math.round(totalProgress / progressCount) : 0
    
    // Mock revenue calculation
    const revenueThisMonth = users.filter(user => user.subscription?.type !== 'free').length * 129
    
    // Mock new users this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const newUsersThisWeek = users.filter(user => 
      user.createdAt && new Date(user.createdAt) > oneWeekAgo
    ).length

    set({
      analytics: {
        totalUsers,
        totalCourses,
        totalHours,
        completionRate,
        revenueThisMonth,
        newUsersThisWeek
      }
    })
  },

  // Notifications Management
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, {
      id: Date.now(),
      ...notification,
      createdAt: new Date(),
      sent: false
    }]
  })),

  sendNotification: (notificationId) => set((state) => ({
    notifications: state.notifications.map(notif => 
      notif.id === notificationId ? { ...notif, sent: true, sentAt: new Date() } : notif
    )
  })),

  deleteNotification: (notificationId) => set((state) => ({
    notifications: state.notifications.filter(notif => notif.id !== notificationId)
  })),

  // Profile Photos Management
  setProfilePhotos: (profilePhotos) => set({ profilePhotos }),
  
  addProfilePhoto: (photo) => set((state) => ({
    profilePhotos: [...state.profilePhotos, {
      id: Date.now(),
      ...photo,
      createdAt: new Date()
    }]
  })),
  
  updateProfilePhoto: (photoId, updates) => set((state) => ({
    profilePhotos: state.profilePhotos.map(photo => 
      photo.id === photoId ? { ...photo, ...updates } : photo
    )
  })),
  
  deleteProfilePhoto: (photoId) => set((state) => ({
    profilePhotos: state.profilePhotos.filter(photo => photo.id !== photoId)
  })),
  
  getActiveProfilePhotos: () => {
    const photos = get().profilePhotos || []
    return photos.filter(photo => photo.active !== false)
  },

  // Profile Links Management
  setProfileLinks: (profileLinks) => set({ profileLinks }),
  
  updateProfileLinks: (updates) => set((state) => ({
    profileLinks: { ...state.profileLinks, ...updates }
  })),

  // Profile Buttons Management
  setProfileButtons: (profileButtons) => set({ profileButtons }),
  
  updateProfileButtons: (updates) => set((state) => ({
    profileButtons: { ...state.profileButtons, ...updates }
  })),

  // Advertising Config Management
  setAdvertisingConfig: (advertisingConfig) => set({ advertisingConfig }),
  
  updateAdvertisingConfig: (updates) => set((state) => ({
    advertisingConfig: { ...state.advertisingConfig, ...updates }
  })),

  // Utility functions
  setLoading: (loading) => set({ loading }),

  getUserById: (userId) => get().users.find(user => user.id === userId),
  
  getCourseById: (courseId) => get().courses.find(course => course.id === courseId),
  
  getCoursesByArea: (area) => get().courses.filter(course => course.area === area),
  
  getUsersBySubscription: (type) => get().users.filter(user => user.subscription?.type === type),

  getTopCourses: (limit = 5) => {
    const courses = get().courses || []
    return courses
      .sort((a, b) => (b.students || 0) - (a.students || 0))
      .slice(0, limit)
  },

  getRecentUsers: (limit = 5) => {
    const users = get().users || []
    return users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  },

  // Impersonation for testing
  impersonateUser: (userId) => {
    const user = get().getUserById(userId)
    if (user) {
      // This would typically update the auth store
      console.log('Impersonating user:', user.name)
      return user
    }
  }
}))