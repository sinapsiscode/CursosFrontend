export const AREA_COLORS = {
  metalurgia: {
    bg: 'bg-primary-metalurgia',
    text: 'text-primary-metalurgia',
    border: 'border-primary-metalurgia',
    gradient: 'from-primary-metalurgia to-red-600'
  },
  mineria: {
    bg: 'bg-primary-mineria',
    text: 'text-primary-mineria',
    border: 'border-primary-mineria',
    gradient: 'from-primary-mineria to-teal-600'
  },
  geologia: {
    bg: 'bg-primary-geologia',
    text: 'text-primary-geologia',
    border: 'border-primary-geologia',
    gradient: 'from-primary-geologia to-blue-600'
  }
}

export const FILTER_AREAS = [
  { id: 'todas', label: 'Todas las áreas', color: 'bg-accent' },
  { id: 'metalurgia', label: 'Metalurgia', color: 'bg-primary-metalurgia' },
  { id: 'mineria', label: 'Minería', color: 'bg-primary-mineria' },
  { id: 'geologia', label: 'Geología', color: 'bg-primary-geologia' }
]

export const LEARNING_PATHS_MESSAGES = {
  header: {
    title: 'Mis Rutas',
    subtitle: 'Explora todos nuestros cursos y marca tus favoritos. Los cursos que agregues a favoritos se guardarán en tu lista de deseos.'
  },
  auth: {
    title: 'Acceso Restringido',
    subtitle: 'Loguéate para tener acceso a esta sección',
    loginButton: 'Iniciar Sesión'
  },
  stats: {
    available: 'Cursos disponibles',
    wishlist: 'En tu lista de deseos',
    shown: 'Cursos mostrados',
    clickToView: 'Click para ver →'
  },
  filters: {
    showFavorites: 'Mostrar favoritos',
    onlyFavorites: 'Solo favoritos',
    myList: 'Mi Lista'
  },
  empty: {
    noFavorites: {
      title: 'No tienes favoritos aún',
      subtitle: 'Haz clic en el corazón de los cursos que te interesen para agregarlos a tu lista de deseos.',
      button: 'Ver todos los cursos'
    },
    noCourses: {
      title: 'No se encontraron cursos',
      subtitle: 'Intenta cambiar los filtros para ver más cursos disponibles.'
    }
  }
}

export const LEARNING_PATHS_STYLES = {
  container: 'min-h-screen bg-background',
  maxWidth: 'max-w-7xl mx-auto px-4 py-8',
  loading: 'min-h-screen bg-background flex items-center justify-center',
  auth: {
    container: 'min-h-screen bg-background flex items-center justify-center',
    card: 'bg-surface rounded-xl p-8 max-w-md w-full mx-4 text-center',
    icon: 'w-20 h-20 mx-auto text-accent mb-6',
    title: 'text-2xl font-bold text-white mb-4',
    subtitle: 'text-secondary mb-6',
    button: 'bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors w-full'
  },
  header: {
    container: 'text-center mb-8',
    title: 'text-4xl md:text-5xl font-bold text-white mb-4',
    subtitle: 'text-xl text-secondary max-w-3xl mx-auto'
  },
  stats: {
    grid: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8',
    card: 'bg-surface rounded-lg p-6 text-center',
    cardClickable: 'bg-surface rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700 transition-colors',
    number: 'text-3xl font-bold mb-2',
    label: 'text-secondary',
    clickHint: 'text-xs text-red-400 mt-1'
  },
  filters: {
    container: 'bg-surface rounded-lg p-6 mb-8',
    wrapper: 'flex flex-col md:flex-row md:items-center md:justify-between gap-4',
    areaFilters: 'flex flex-wrap gap-2',
    areaButton: 'px-4 py-2 rounded-lg font-medium transition-colors',
    areaButtonActive: 'text-white',
    areaButtonInactive: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
    rightSection: 'flex items-center space-x-2',
    favoritesButton: 'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors',
    favoritesButtonActive: 'bg-red-500 text-white',
    favoritesButtonInactive: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
    myListButton: 'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors',
    icon: 'w-5 h-5'
  },
  courses: {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
  },
  empty: {
    container: 'text-center py-16',
    icon: 'w-24 h-24 mx-auto text-gray-600 mb-6',
    title: 'text-2xl font-bold text-white mb-4',
    subtitle: 'text-secondary mb-6 max-w-md mx-auto',
    button: 'bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors'
  }
}