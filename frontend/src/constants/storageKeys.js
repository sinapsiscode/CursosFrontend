/**
 * Keys de LocalStorage centralizadas
 * Evita duplicación y errores de tipeo
 */

export const STORAGE_KEYS = {
  // Autenticación
  AUTH_STORAGE: 'auth-storage',
  USER_DATA: 'userData',
  AUTH_TOKEN: 'authToken',

  // Notificaciones
  USER_NOTIFICATIONS: 'user_notifications',
  SCHEDULED_NOTIFICATIONS: 'scheduled_notifications',

  // Eventos
  PLATFORM_EVENTS: 'platform_events',
  EVENT_REGISTRATIONS: 'event_registrations',
  USER_INTERESTS: 'user_interests',

  // Cursos
  DYNAMIC_COURSES: 'dynamic_courses',
  EXAM_QUESTIONS: 'exam_questions',
  STUDENT_ENROLLMENTS: 'student_enrollments',

  // Perfil
  PROFILE_PHOTOS: 'profile_photos',
  PROFILE_LINKS: 'profile_links',
  PROFILE_BUTTONS: 'profile_buttons',

  // UI State
  THEME_PREFERENCE: 'theme_preference',
  SIDEBAR_STATE: 'sidebar_state',
  LAST_VISITED_ROUTE: 'last_visited_route',

  // Cache
  COURSES_CACHE: 'courses_cache',
  AREAS_CACHE: 'areas_cache',
}

// Helper functions para trabajar con localStorage
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage [${key}]:`, error)
      return null
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage [${key}]:`, error)
      return false
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage [${key}]:`, error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  },
}

export default STORAGE_KEYS
