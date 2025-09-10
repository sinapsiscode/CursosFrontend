/**
 * Endpoints de la API
 */

export const endpoints = {
  // Areas
  areas: {
    list: '/areas',
    byId: (id) => `/areas/${id}`,
    bySlug: (slug) => `/areas?slug=${slug}`,
  },

  // Courses
  courses: {
    list: '/courses',
    byId: (id) => `/courses/${id}`,
    byArea: (areaId) => `/courses?areaId=${areaId}`,
    featured: '/courses?featured=true',
    popular: '/courses?_sort=students&_order=desc&_limit=8',
  },

  // Auth
  auth: {
    login: '/login',
    register: '/users',
    profile: '/profile',
    updateProfile: (id) => `/users/${id}`,
  },

  // Config
  config: {
    get: '/config',
    update: '/config',
  },

  // Leads
  leads: {
    list: '/leads',
    create: '/leads',
    byId: (id) => `/leads/${id}`,
  },

  // Reviews
  reviews: {
    list: '/reviews',
    byCourse: (courseId) => `/reviews?courseId=${courseId}`,
    create: '/reviews',
    update: (id) => `/reviews/${id}`,
  },

  // Exams
  exams: {
    list: '/exams',
    byId: (id) => `/exams/${id}`,
    byCourse: (courseId) => `/exams?courseId=${courseId}`,
  },

  // Exam Results
  examResults: {
    list: '/examResults',
    create: '/examResults',
    byUser: (userId) => `/examResults?userId=${userId}`,
  },

  // Events
  events: {
    list: '/events',
    byId: (id) => `/events/${id}`,
    upcoming: '/events?status=upcoming',
  },

  // Certificates
  certificates: {
    list: '/certificates',
    byUser: (userId) => `/certificates?userId=${userId}`,
    verify: (code) => `/certificates?code=${code}`,
  },

  // WhatsApp
  whatsapp: {
    config: '/whatsapp-config',
    updateConfig: '/whatsapp-config',
  },
}

export default endpoints