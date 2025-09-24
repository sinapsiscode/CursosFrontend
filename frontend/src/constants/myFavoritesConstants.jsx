export const AREAS = [
  'all',
  'programming',
  'design',
  'marketing',
  'business',
  'data-science'
]

export const SORT_OPTIONS = [
  { value: 'dateAdded', label: 'Fecha agregado' },
  { value: 'difficulty', label: 'Dificultad' },
  { value: 'duration', label: 'Duración' },
  { value: 'area', label: 'Área' },
  { value: 'popularity', label: 'Popularidad' }
]

export const DIFFICULTY_ORDER = {
  'Principiante': 1,
  'Intermedio': 2,
  'Avanzado': 3
}

export const MY_FAVORITES_MESSAGES = {
  title: 'Mis Favoritos',
  subtitle: 'Cursos que has marcado como favoritos',
  stats: {
    total: 'Total',
    programming: 'Programación',
    design: 'Diseño',
    marketing: 'Marketing',
    business: 'Negocios',
    dataScience: 'Ciencia de Datos'
  },
  filters: {
    all: 'Todos',
    programming: 'Programación',
    design: 'Diseño',
    marketing: 'Marketing',
    business: 'Negocios',
    'data-science': 'Ciencia de Datos'
  },
  sortBy: 'Ordenar por:',
  actions: {
    removeFavorite: 'Quitar de favoritos',
    enrollNow: 'Inscribirse ahora',
    continueCourse: 'Continuar curso'
  },
  empty: {
    title: 'No tienes cursos favoritos',
    subtitle: 'Explora nuestro catálogo y marca los cursos que más te interesen',
    exploreButton: 'Explorar cursos'
  },
  suggestion: {
    title: '¿Te interesan estos cursos?',
    subtitle: 'Basado en tus favoritos, creemos que estos cursos podrían gustarte',
    addToFavorites: 'Agregar a favoritos'
  },
  quickActions: {
    title: 'Acciones rápidas',
    enrollInAll: 'Inscribirse en todos',
    downloadList: 'Descargar lista',
    shareList: 'Compartir lista',
    clearAll: 'Limpiar favoritos'
  }
}

export const MY_FAVORITES_STYLES = {
  container: 'min-h-screen bg-gray-50 py-6',
  maxWidth: 'max-w-7xl mx-auto px-4',
  header: {
    container: 'mb-8',
    title: 'text-3xl font-bold text-gray-900 mb-2',
    subtitle: 'text-lg text-gray-600'
  },
  stats: {
    grid: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8',
    card: 'bg-white p-4 rounded-lg shadow-sm text-center',
    number: 'text-2xl font-bold mb-1',
    label: 'text-sm text-gray-600',
    totalColor: 'text-blue-600',
    programmingColor: 'text-green-600',
    designColor: 'text-purple-600',
    marketingColor: 'text-orange-600',
    businessColor: 'text-red-600',
    dataScienceColor: 'text-indigo-600'
  },
  filters: {
    container: 'bg-white p-6 rounded-lg shadow-sm mb-6',
    header: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4',
    filtersSection: 'flex-1',
    filtersList: 'flex flex-wrap gap-2',
    filterButton: 'px-4 py-2 rounded-full text-sm font-medium transition-colors',
    filterButtonActive: 'bg-blue-600 text-white',
    filterButtonInactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    sortSection: 'flex items-center gap-2',
    sortLabel: 'text-sm font-medium text-gray-700 whitespace-nowrap',
    sortSelect: 'border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  },
  courseGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8',
  courseCard: {
    container: 'bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow',
    imageContainer: 'relative h-48 overflow-hidden',
    image: 'w-full h-full object-cover',
    favoriteButton: 'absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors',
    favoriteIcon: 'w-5 h-5',
    favoriteIconFilled: 'text-red-500',
    favoriteIconEmpty: 'text-gray-400',
    content: 'p-6',
    header: 'mb-4',
    titleContainer: 'flex items-start justify-between gap-3 mb-2',
    title: 'text-lg font-semibold text-gray-900 line-clamp-2',
    levelBadge: 'px-2 py-1 text-xs font-medium rounded-full flex-shrink-0',
    levelBeginner: 'bg-green-100 text-green-800',
    levelIntermediate: 'bg-yellow-100 text-yellow-800',
    levelAdvanced: 'bg-red-100 text-red-800',
    description: 'text-gray-600 text-sm line-clamp-3 mb-3',
    meta: 'flex items-center justify-between text-sm text-gray-500 mb-4',
    area: 'font-medium',
    duration: '',
    actions: 'flex gap-3',
    enrollButton: 'flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors text-center',
    continueButton: 'flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 transition-colors text-center'
  },
  quickActions: {
    container: 'bg-white p-6 rounded-lg shadow-sm mb-8',
    title: 'text-lg font-semibold text-gray-900 mb-4',
    grid: 'grid grid-cols-2 sm:grid-cols-4 gap-4',
    button: 'p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors',
    icon: 'w-8 h-8 mx-auto mb-2',
    label: 'text-sm font-medium text-gray-700'
  },
  suggestions: {
    container: 'bg-white p-6 rounded-lg shadow-sm mb-8',
    title: 'text-lg font-semibold text-gray-900 mb-2',
    subtitle: 'text-sm text-gray-600 mb-6',
    grid: 'grid grid-cols-1 md:grid-cols-3 gap-6'
  },
  suggestionCard: {
    container: 'border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow',
    imageContainer: 'h-32 overflow-hidden',
    image: 'w-full h-full object-cover',
    content: 'p-4',
    title: 'font-medium text-gray-900 mb-2 text-sm line-clamp-2',
    instructor: 'text-xs text-gray-600 mb-3',
    actions: 'flex justify-between items-center',
    addButton: 'text-blue-600 hover:text-blue-700 text-sm font-medium',
    rating: 'flex items-center gap-1',
    ratingIcon: 'w-4 h-4 text-yellow-400',
    ratingText: 'text-xs text-gray-600'
  },
  empty: {
    container: 'text-center py-12 bg-white rounded-lg shadow-sm',
    icon: 'w-16 h-16 mx-auto text-gray-400 mb-4',
    title: 'text-xl font-semibold text-gray-900 mb-2',
    subtitle: 'text-gray-600 mb-6',
    button: 'inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
  }
}