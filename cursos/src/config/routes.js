/**
 * Definición de rutas de la aplicación organizadas por rol
 */

// Rutas públicas (guest users)
export const GUEST_ROUTES = {
  HOME: '/',
  AREA_SELECTION: '/area-selection',
  COURSE_EXPLORER: '/courses',
  COURSE_DETAIL: '/course/:id',
  EXAM_INITIAL: '/exam/initial',
  CERTIFICATE_VERIFY: '/certificate/verify/:code',
}

// Rutas de usuario autenticado
export const USER_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  MY_COURSES: '/my-courses',
  FAVORITES: '/favorites',
  CERTIFICATES: '/certificates',
  LOYALTY: '/loyalty',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:id',
  COURSE_LESSON: '/course/:courseId/lesson/:lessonId',
  COURSE_EXAM: '/course/:courseId/exam/:examId',
}

// Rutas de administración
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  CONTENT_MANAGER: '/admin/content',
  COURSE_MANAGER: '/admin/courses',
  LEAD_MANAGER: '/admin/leads',
  CONFIG_MANAGER: '/admin/config',
  EXAM_MANAGER: '/admin/exams',
  REVIEW_MANAGER: '/admin/reviews',
  ANALYTICS: '/admin/analytics',
  USER_MANAGEMENT: '/admin/users',
}

// Rutas de autenticación
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
}

// Rutas protegidas que requieren autenticación
export const PROTECTED_ROUTES = [
  ...Object.values(USER_ROUTES),
  ...Object.values(ADMIN_ROUTES),
]

// Rutas que requieren rol admin
export const ADMIN_ONLY_ROUTES = Object.values(ADMIN_ROUTES)

// Rutas que requieren selección de área
export const AREA_REQUIRED_ROUTES = [
  GUEST_ROUTES.COURSE_EXPLORER,
  GUEST_ROUTES.COURSE_DETAIL,
  ...Object.values(USER_ROUTES),
]

/**
 * Helper para verificar si una ruta requiere autenticación
 */
export const isProtectedRoute = (pathname) => {
  return PROTECTED_ROUTES.some(route => {
    // Convertir rutas con parámetros a regex
    const routeRegex = new RegExp('^' + route.replace(/:[^\s/]+/g, '[^/]+') + '$')
    return routeRegex.test(pathname)
  })
}

/**
 * Helper para verificar si una ruta requiere rol admin
 */
export const isAdminRoute = (pathname) => {
  return ADMIN_ONLY_ROUTES.some(route => {
    const routeRegex = new RegExp('^' + route.replace(/:[^\s/]+/g, '[^/]+') + '$')
    return routeRegex.test(pathname)
  })
}

/**
 * Helper para verificar si una ruta requiere selección de área
 */
export const requiresAreaSelection = (pathname) => {
  return AREA_REQUIRED_ROUTES.some(route => {
    const routeRegex = new RegExp('^' + route.replace(/:[^\s/]+/g, '[^/]+') + '$')
    return routeRegex.test(pathname)
  })
}

export const ALL_ROUTES = {
  ...GUEST_ROUTES,
  ...USER_ROUTES,
  ...ADMIN_ROUTES,
  ...AUTH_ROUTES,
}

export default ALL_ROUTES