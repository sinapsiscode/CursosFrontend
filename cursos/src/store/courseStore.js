import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import courseApi from '../services/api/courseApi'

export const useCourseStore = create(
  devtools(
    (set, get) => ({
      courses: [],
      filteredCourses: [],
      currentCourse: null,
      featuredCourses: [],
      popularCourses: [],
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
      error: null,
      
      // Fetch courses from API
      fetchCourses: async () => {
        set({ loading: true, error: null })
        try {
          const courses = await courseApi.getCourses()
          set({ 
            courses, 
            filteredCourses: courses,
            loading: false 
          })
          return courses
        } catch (error) {
          set({ error: error.message, loading: false })
          console.error('Error fetching courses:', error)
          return []
        }
      },
      
      // Fetch single course
      fetchCourseById: async (id) => {
        set({ loading: true, error: null })
        try {
          const course = await courseApi.getCourseById(id)
          set({ currentCourse: course, loading: false })
          return course
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
        }
      },
      
      // Fetch featured courses
      fetchFeaturedCourses: async () => {
        try {
          const courses = await courseApi.getFeaturedCourses()
          set({ featuredCourses: courses })
          return courses
        } catch (error) {
          console.error('Error fetching featured courses:', error)
          return []
        }
      },
      
      // Fetch popular courses
      fetchPopularCourses: async () => {
        try {
          const courses = await courseApi.getPopularCourses()
          set({ popularCourses: courses })
          return courses
        } catch (error) {
          console.error('Error fetching popular courses:', error)
          return []
        }
      },
      
      // Add course (admin)
      addCourse: async (courseData) => {
        set({ loading: true, error: null })
        try {
          const newCourse = await courseApi.createCourse(courseData)
          const courses = [...get().courses, newCourse]
          set({ 
            courses,
            filteredCourses: courses,
            loading: false 
          })
          return newCourse
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
        }
      },
      
      // Update course (admin)
      updateCourse: async (courseId, updates) => {
        set({ loading: true, error: null })
        try {
          const updatedCourse = await courseApi.updateCourse(courseId, updates)
          const courses = get().courses.map(course => 
            course.id === courseId ? updatedCourse : course
          )
          set({ 
            courses,
            filteredCourses: courses,
            currentCourse: get().currentCourse?.id === courseId ? updatedCourse : get().currentCourse,
            loading: false 
          })
          return updatedCourse
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
        }
      },
      
      // Delete course (admin)
      deleteCourse: async (courseId) => {
        set({ loading: true, error: null })
        try {
          await courseApi.deleteCourse(courseId)
          const courses = get().courses.filter(course => course.id !== courseId)
          set({ 
            courses,
            filteredCourses: courses,
            loading: false 
          })
          return true
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
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
      getFeaturedCourses: () => get().featuredCourses.length > 0 ? get().featuredCourses : get().courses.filter(course => course.isFeatured),
      getPopularCourses: () => get().popularCourses.length > 0 ? get().popularCourses : get().courses.filter(course => course.isPopular),
      getNewCourses: () => get().courses.filter(course => course.isNew),
      getCourseById: (id) => get().courses.find(course => course.id == id),
      clearError: () => set({ error: null })
    }),
    {
      name: 'course-store'
    }
  )
)

export default useCourseStore