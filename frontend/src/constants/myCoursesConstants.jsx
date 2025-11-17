export const COURSE_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'in-progress', label: 'En Progreso' },
  { key: 'completed', label: 'Completados' },
  { key: 'not-started', label: 'No Iniciados' }
]

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Más Recientes' },
  { value: 'progress', label: 'Por Progreso' },
  { value: 'alphabetical', label: 'Alfabético' }
]

export const PROGRESS_COLORS = {
  notStarted: 'bg-gray-600',
  low: 'bg-red-500',
  medium: 'bg-yellow-500',
  high: 'bg-blue-500',
  completed: 'bg-green-500'
}

export const PROGRESS_THRESHOLDS = {
  low: 30,
  medium: 70,
  completed: 100
}

export const MY_COURSES_MESSAGES = {
  header: {
    title: 'Mis Cursos',
    subtitle: 'Continúa tu aprendizaje donde lo dejaste'
  },
  stats: {
    total: 'Total Cursos',
    completed: 'Completados',
    inProgress: 'En Progreso',
    averageProgress: 'Progreso Promedio'
  },
  progress: {
    notStarted: 'No iniciado',
    inProgress: 'En progreso',
    completed: 'Completado'
  },
  actions: {
    start: 'Comenzar',
    continue: 'Continuar',
    downloadCertificate: 'Descargar Certificado'
  },
  empty: {
    noCourses: 'No tienes cursos',
    noInProgress: 'No hay cursos en progreso',
    noCompleted: 'No hay cursos completados',
    noNotStarted: 'No hay cursos sin iniciar',
    exploreMessage: 'Explora nuestro catálogo y comienza tu aprendizaje',
    filterMessage: 'Prueba con otro filtro para ver más cursos',
    exploreButton: 'Explorar Cursos'
  },
  labels: {
    instructor: 'Instructor:',
    timeSpent: 'Tiempo dedicado:',
    level: 'NIVEL',
    favorite: 'Favorito',
    completed: 'Completado'
  }
}

export const MY_COURSES_STYLES = {
  container: 'min-h-screen bg-background',
  maxWidth: 'max-w-7xl mx-auto px-4 py-8',
  loading: {
    container: 'min-h-screen bg-background flex items-center justify-center'
  },
  header: {
    container: 'mb-8',
    title: 'text-3xl md:text-4xl font-bold text-white mb-2',
    subtitle: 'text-secondary text-lg'
  },
  stats: {
    grid: 'grid md:grid-cols-4 gap-6 mb-8',
    card: 'bg-surface rounded-xl p-6 text-center',
    number: 'text-2xl font-bold mb-1',
    label: 'text-secondary text-sm',
    totalColor: 'text-white',
    completedColor: 'text-green-500',
    inProgressColor: 'text-blue-500',
    averageColor: 'text-accent'
  },
  filters: {
    container: 'flex flex-col md:flex-row gap-4 mb-8',
    filtersSection: 'flex-1',
    filtersList: 'flex flex-wrap gap-2',
    filterButton: 'px-4 py-2 rounded-lg font-medium transition-colors',
    filterButtonActive: 'bg-accent text-background',
    filterButtonInactive: 'bg-surface text-white hover:bg-gray-600',
    sortSection: 'md:w-48',
    sortSelect: 'w-full bg-surface border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent'
  },
  courses: {
    grid: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
  },
  courseCard: {
    container: 'bg-surface rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300',
    imageContainer: 'relative',
    image: 'w-full h-48 object-cover',
    favoriteIcon: 'absolute top-3 right-3 bg-red-500 rounded-full p-2',
    completedIcon: 'absolute top-3 left-3 bg-green-500 rounded-full p-2',
    icon: 'w-4 h-4 text-white',
    content: 'p-6',
    header: 'mb-4',
    headerTop: 'flex items-center justify-between mb-2',
    levelBadge: 'text-xs font-medium text-accent bg-accent bg-opacity-20 px-2 py-1 rounded',
    duration: 'text-xs text-secondary',
    title: 'text-lg font-bold text-white mb-2 line-clamp-2',
    description: 'text-secondary text-sm mb-3 line-clamp-2',
    instructor: 'text-secondary text-xs',
    progressSection: 'mb-4',
    progressHeader: 'flex items-center justify-between mb-2',
    progressText: 'text-sm font-medium text-white',
    progressPercentage: 'text-sm text-secondary',
    progressBar: 'w-full bg-gray-700 rounded-full h-2',
    progressFill: 'h-2 rounded-full transition-all duration-300',
    timeSpent: 'text-xs text-secondary mt-2',
    actions: 'flex space-x-2',
    continueButton: 'flex-1 bg-accent text-background py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors',
    certificateButton: 'bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors',
    certificateIcon: 'w-5 h-5'
  },
  empty: {
    container: 'text-center py-16',
    icon: 'w-24 h-24 mx-auto text-secondary mb-6',
    title: 'text-xl font-bold text-white mb-2',
    subtitle: 'text-secondary mb-6',
    button: 'bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors'
  }
}