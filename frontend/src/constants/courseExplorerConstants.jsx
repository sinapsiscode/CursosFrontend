export const COURSE_EXPLORER_CONFIG = {
  searchDebounceTime: 300,
  whatsappResetTime: 30000,
  minSearchQueryLength: 2,
  defaultSkeletonCount: 9,
  maxSearchResults: 1000
}

export const VIEW_MODES = {
  grid: 'grid',
  list: 'list'
}

export const FILTER_TYPES = {
  area: 'area',
  level: 'level',
  duration: 'duration',
  price: 'price',
  search: 'search'
}

export const AREAS = [
  { key: 'metalurgia', label: 'Metalurgia' },
  { key: 'mineria', label: 'Minería' },
  { key: 'geologia', label: 'Geología' }
]

export const LEVELS = [
  { key: 'básico', label: 'Básico' },
  { key: 'intermedio', label: 'Intermedio' },
  { key: 'avanzado', label: 'Avanzado' }
]

export const DURATIONS = [
  { key: 'short', label: 'Corto (< 2h)' },
  { key: 'medium', label: 'Medio (2-5h)' },
  { key: 'long', label: 'Largo (> 5h)' }
]

export const PRICES = [
  { key: 'free', label: 'Gratis' },
  { key: 'premium', label: 'Premium' }
]

export const DEFAULT_FILTERS = {
  area: null,
  level: null,
  duration: null,
  price: null,
  search: ''
}

export const COURSE_EXPLORER_STYLES = {
  container: 'min-h-screen bg-background',
  maxWidth: 'max-w-7xl mx-auto px-4 py-8',

  header: {
    container: 'flex flex-col md:flex-row md:items-center justify-between mb-8',
    title: 'text-3xl font-bold text-white mb-2',
    subtitle: 'text-text-secondary',
    viewToggle: 'flex items-center space-x-2 mt-4 md:mt-0'
  },

  viewButton: {
    active: 'p-2 rounded-lg bg-accent text-background',
    inactive: 'p-2 rounded-lg bg-surface text-white hover:bg-gray-700'
  },

  search: {
    container: 'mb-6',
    wrapper: 'relative max-w-2xl',
    iconWrapper: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
    icon: 'h-5 w-5 text-gray-400',
    input: 'block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-surface text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent'
  },

  filters: {
    container: 'bg-surface rounded-xl p-6 mb-8',
    header: 'flex items-center justify-between mb-4',
    title: 'text-lg font-semibold text-white',
    clearButton: 'text-accent hover:text-accent-light transition-colors text-sm',
    grid: 'grid md:grid-cols-2 lg:grid-cols-4 gap-4',
    label: 'block text-sm font-medium text-text-secondary mb-2',
    optionsList: 'space-y-2'
  },

  filterOption: {
    active: 'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors bg-accent text-background',
    inactive: 'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors bg-background text-white hover:bg-gray-700'
  },

  loading: {
    container: 'min-h-screen bg-background',
    wrapper: 'max-w-7xl mx-auto px-4 py-8',
    headerSkeleton: 'h-12 bg-surface rounded-lg mb-8 animate-pulse',
    grid: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
  },

  emptyState: {
    container: 'text-center py-12',
    icon: 'text-6xl mb-4',
    title: 'text-xl font-semibold text-white mb-2',
    subtitle: 'text-text-secondary mb-4',
    button: 'bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors'
  },

  courseGrid: {
    grid: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6',
    list: 'space-y-4'
  }
}

export const COURSE_EXPLORER_MESSAGES = {
  title: 'Explorar Cursos',
  subtitle: 'Descubre {count} cursos disponibles',
  searchPlaceholder: 'Buscar cursos, instructores...',
  filtersTitle: 'Filtros',
  clearFilters: 'Limpiar filtros ({count})',
  filterLabels: {
    area: 'Área',
    level: 'Nivel',
    duration: 'Duración',
    price: 'Gratis'
  },
  emptyState: {
    title: 'No se encontraron cursos',
    subtitle: 'Intenta ajustar tus filtros o términos de búsqueda',
    buttonText: 'Limpiar filtros'
  }
}

export const COURSE_EXPLORER_ICONS = {
  search: (
    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  gridView: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  listView: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  emptySearch: '🔍'
}