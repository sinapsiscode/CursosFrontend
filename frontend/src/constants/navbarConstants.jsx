export const NAVBAR_STYLES = {
  nav: 'bg-surface border-b border-gray-700 sticky top-0 z-50 relative',
  container: 'max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8',
  content: 'flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-3',
  logoSection: 'flex items-center space-x-2 sm:space-x-3 flex-shrink-0',
  logoContainer: 'flex items-center space-x-1.5 sm:space-x-2',
  logoIcon: 'w-7 h-7 sm:w-8 sm:h-8 bg-accent rounded-lg flex items-center justify-center',
  logoText: 'text-background font-bold text-base sm:text-lg',
  brandText: 'text-base sm:text-lg md:text-xl font-bold text-white',
  areaTag: 'text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-opacity-20 hidden sm:block',
  searchContainer: 'hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8',
  searchForm: 'w-full',
  searchInputContainer: 'relative',
  searchIcon: 'absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none',
  searchInput: 'block w-full pl-8 sm:pl-10 pr-3 py-1.5 sm:py-2 text-sm border border-gray-600 rounded-lg bg-background text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
  userSection: 'flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0',
  userButton: 'flex items-center space-x-1.5 sm:space-x-2 text-white hover:text-accent transition-colors',
  avatar: 'w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-600',
  userName: 'hidden lg:block text-xs sm:text-sm',
  userMenu: 'absolute right-0 mt-2 w-44 sm:w-48 bg-surface rounded-lg shadow-lg py-2 border border-gray-600 z-50',
  menuItem: 'block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-white hover:bg-background transition-colors',
  menuDivider: 'my-2 border-gray-600',
  guestButtons: 'flex items-center space-x-2 sm:space-x-3',
  loginButton: 'text-white hover:text-accent transition-colors text-xs sm:text-sm',
  registerButton: 'bg-accent text-background px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-opacity-90 transition-colors',
  overlay: 'fixed inset-0 z-30'
}

export const AREA_COLORS = {
  metalurgia: 'text-primary-metalurgia',
  mineria: 'text-primary-mineria',
  geologia: 'text-primary-geologia'
}

export const NAVBAR_TEXTS = {
  searchPlaceholder: '¿Qué quieres aprender hoy?',
  userMenuItems: {
    profile: 'Mi Perfil',
    courses: 'Mis Cursos',
    certificates: 'Certificados',
    loyalty: 'Programa de Puntos',
    admin: 'Panel Admin',
    logout: 'Cerrar Sesión'
  },
  guestButtons: {
    login: 'Iniciar Sesión',
    register: 'Registrarse'
  }
}

export const NAVBAR_ROUTES = {
  profile: '/profile',
  courses: '/my-courses',
  certificates: '/certificates',
  loyalty: '/loyalty',
  admin: '/admin'
}

export const NAVBAR_MODALS = {
  login: 'login',
  register: 'register'
}

export const NAVBAR_ICONS = {
  search: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  ),
  chevronDown: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  )
}

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'

export const LOGO_CONFIG = {
  text: 'C',
  brandName: 'CEOs UNI'
}