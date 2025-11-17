import { create } from 'zustand'
import { useCourseStore } from './courseStore'

// Datos iniciales para áreas y niveles
const initialAreas = [
  { id: 1, key: 'metalurgia', name: 'Metalurgia', active: true, textColor: 'text-red-500', bgColor: 'bg-red-500' },
  { id: 2, key: 'mineria', name: 'Minería', active: true, textColor: 'text-blue-500', bgColor: 'bg-blue-500' },
  { id: 3, key: 'geologia', name: 'Geología', active: true, textColor: 'text-green-500', bgColor: 'bg-green-500' }
]

const initialLevels = [
  { id: 1, key: 'basico', name: 'Básico', active: true, textColor: 'text-gray-500', bgColor: 'bg-gray-500' },
  { id: 2, key: 'intermedio', name: 'Intermedio', active: true, textColor: 'text-yellow-500', bgColor: 'bg-yellow-500' },
  { id: 3, key: 'avanzado', name: 'Avanzado', active: true, textColor: 'text-purple-500', bgColor: 'bg-purple-500' }
]

export const useAdminStore = create((set, get) => ({
  users: [],
  courses: [],
  areas: initialAreas,
  levels: initialLevels,
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

  calculateAnalytics: (timeRange = 'month') => {
    // Obtener usuarios desde el store (ya vienen del backend)
    const users = get().users || []
    const courses = get().courses || []
    const totalUsers = users.length
    const totalCourses = courses.length

    // Calcular días según el rango de tiempo
    const TIME_RANGE_DAYS = {
      week: 7,
      month: 30,
      semester: 180,
      year: 365
    }

    const days = TIME_RANGE_DAYS[timeRange] || 30

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

    // Nuevos usuarios según el rango de tiempo seleccionado
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() - days)
    const newUsersInPeriod = users.filter(user => {
      const userDate = new Date(user.fechaCreacion || user.createdAt)
      return userDate > dateLimit
    }).length

    set({
      analytics: {
        totalUsers,
        totalCourses,
        totalHours,
        completionRate,
        revenueThisMonth,
        newUsersThisWeek: newUsersInPeriod, // Ahora representa el período seleccionado
        timeRange
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
      .sort((a, b) => (b.estudiantesInscritos || 0) - (a.estudiantesInscritos || 0))
      .slice(0, limit)
  },

  getRecentUsers: (limit = 5) => {
    const users = get().users || []
    return users
      .sort((a, b) => {
        const dateA = new Date(b.fechaCreacion || b.createdAt || 0)
        const dateB = new Date(a.fechaCreacion || a.createdAt || 0)
        return dateA - dateB
      })
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