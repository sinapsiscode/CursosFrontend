import { create } from 'zustand'

export const useCourseStore = create((set, get) => ({
  courses: [],
  filteredCourses: [],
  filters: {
    area: null,
    level: null,
    duration: null,
    price: null,
    search: ''
  },
  favorites: [],
  viewMode: 'grid',
  loading: false,
  
  setCourses: (courses) => {
    // Combinar cursos mock con cursos creados dinámicamente
    const dynamicCourses = get().getDynamicCourses()
    const allCourses = [...courses, ...dynamicCourses]
    console.log('📚 CourseStore: Estableciendo cursos - Mock:', courses.length, 'Dinámicos:', dynamicCourses.length, 'Total:', allCourses.length)
    set({ courses: allCourses, filteredCourses: allCourses })
  },
  
  addDynamicCourse: (course) => {
    // Agregar curso a localStorage y al store
    const existingCourses = JSON.parse(localStorage.getItem('dynamic_courses') || '[]')
    const newCourse = {
      ...course,
      id: course.id || Date.now(),
      isDynamic: true,
      createdAt: new Date().toISOString()
    }
    
    const updatedCourses = [...existingCourses, newCourse]
    localStorage.setItem('dynamic_courses', JSON.stringify(updatedCourses))
    
    // Actualizar el store
    const currentCourses = get().courses
    const newAllCourses = [...currentCourses, newCourse]
    console.log('📚 CourseStore: Agregando curso dinámico:', newCourse.title)
    set({ courses: newAllCourses, filteredCourses: newAllCourses })
    
    return newCourse
  },
  
  updateDynamicCourse: (courseId, updates) => {
    const existingCourses = JSON.parse(localStorage.getItem('dynamic_courses') || '[]')
    const updatedCourses = existingCourses.map(course => 
      course.id === courseId ? { ...course, ...updates, updatedAt: new Date().toISOString() } : course
    )
    localStorage.setItem('dynamic_courses', JSON.stringify(updatedCourses))
    
    // Actualizar el store
    const currentCourses = get().courses.map(course => 
      course.id === courseId ? { ...course, ...updates } : course
    )
    console.log('📚 CourseStore: Actualizando curso dinámico:', courseId)
    set({ courses: currentCourses, filteredCourses: currentCourses })
  },
  
  deleteDynamicCourse: (courseId) => {
    const existingCourses = JSON.parse(localStorage.getItem('dynamic_courses') || '[]')
    const updatedCourses = existingCourses.filter(course => course.id !== courseId)
    localStorage.setItem('dynamic_courses', JSON.stringify(updatedCourses))
    
    // Actualizar el store
    const currentCourses = get().courses.filter(course => course.id !== courseId)
    console.log('📚 CourseStore: Eliminando curso dinámico:', courseId)
    set({ courses: currentCourses, filteredCourses: currentCourses })
  },
  
  getDynamicCourses: () => {
    return JSON.parse(localStorage.getItem('dynamic_courses') || '[]')
  },
  
  initializeDynamicCourses: () => {
    // Asegurar que los cursos dinámicos estén cargados al inicializar
    const dynamicCourses = get().getDynamicCourses()
    const currentCourses = get().courses
    
    // Verificar si ya están incluidos
    const dynamicIds = dynamicCourses.map(c => c.id)
    const currentIds = currentCourses.map(c => c.id)
    const missingCourses = dynamicCourses.filter(course => !currentIds.includes(course.id))
    
    if (missingCourses.length > 0) {
      const allCourses = [...currentCourses, ...missingCourses]
      console.log('🔄 CourseStore: Inicializando cursos dinámicos faltantes:', missingCourses.length)
      set({ courses: allCourses, filteredCourses: allCourses })
    }
  },
  
  setFilters: (newFilters) => set((state) => {
    const updatedFilters = { ...state.filters, ...newFilters }
    const filtered = get().applyCourseFilters(state.courses, updatedFilters)
    return {
      filters: updatedFilters,
      filteredCourses: filtered
    }
  }),

  applyCourseFilters: (courses, filters) => {
    return courses.filter(course => {
      if (filters.area && course.area !== filters.area) return false
      if (filters.level && course.level !== filters.level) return false
      if (filters.price === 'free' && course.price > 0) return false
      if (filters.price === 'premium' && course.price === 0) return false
      if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !course.instructor.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.duration) {
        const duration = parseInt(course.duration)
        switch (filters.duration) {
          case 'short':
            if (duration > 120) return false
            break
          case 'medium':
            if (duration <= 120 || duration > 300) return false
            break
          case 'long':
            if (duration <= 300) return false
            break
        }
      }
      return true
    })
  },

  searchCourses: (query) => {
    const filters = { ...get().filters, search: query }
    get().setFilters(filters)
  },

  toggleFavorite: (courseId) => set((state) => {
    const favorites = state.favorites.includes(courseId)
      ? state.favorites.filter(id => id !== courseId)
      : [...state.favorites, courseId]
    return { favorites }
  }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setLoading: (loading) => set({ loading }),

  getFavorites: () => get().favorites,
  getCoursesByArea: (area) => get().courses.filter(course => course.area === area),
  getFeaturedCourses: () => get().courses.filter(course => course.featured),
  getPopularCourses: () => get().courses.filter(course => course.popular),
  getNewCourses: () => get().courses.filter(course => course.isNew),
  getCourseById: (id) => get().courses.find(course => course.id === id)
}))