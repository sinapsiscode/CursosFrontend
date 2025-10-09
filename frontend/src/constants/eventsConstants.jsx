export const EVENT_TYPES = {
  webinar: 'webinar',
  masterclass: 'masterclass',
  promotion: 'promotion',
  bundle: 'bundle'
}

export const FILTER_TYPES = {
  all: 'all',
  webinars: 'webinars',
  promotions: 'promotions',
  relevant: 'relevant'
}

export const AREA_FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'metalurgia', label: 'Metalurgia' },
  { value: 'mineria', label: 'Minería' },
  { value: 'geologia', label: 'Geología' }
]

export const TYPE_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'webinars', label: 'Webinars' },
  { value: 'promotions', label: 'Promociones' }
]

export const AREA_COLORS = {
  metalurgia: 'from-orange-500 to-red-500',
  mineria: 'from-blue-500 to-purple-500',
  geologia: 'from-green-500 to-teal-500'
}

export const EVENT_TYPE_CONFIG = {
  [EVENT_TYPES.webinar]: {
    badge: '📹 Webinar',
    color: 'bg-blue-600 text-white',
    buttonText: '🎟️ Inscribirme GRATIS',
    lockedButtonText: '🔒 Iniciar Sesión para Inscribirme',
    fullButtonText: '🚫 Lleno'
  },
  [EVENT_TYPES.masterclass]: {
    badge: '🎓 Masterclass',
    color: 'bg-purple-600 text-white',
    buttonText: '🎟️ Inscribirme GRATIS',
    lockedButtonText: '🔒 Iniciar Sesión para Inscribirme',
    fullButtonText: '🚫 Lleno'
  },
  [EVENT_TYPES.promotion]: {
    badge: '🎁 Promoción',
    color: 'bg-green-600 text-white',
    buttonText: 'Ver Cursos'
  },
  [EVENT_TYPES.bundle]: {
    badge: '📦 Bundle',
    color: 'bg-orange-600 text-white',
    buttonText: 'Obtener Pack'
  }
}

export const TIME_INDICATORS = {
  today: { class: 'bg-red-600/20 text-red-400', text: 'Hoy' },
  tomorrow: { class: 'bg-orange-600/20 text-orange-400', text: 'Mañana' },
  future: { class: 'bg-blue-600/20 text-blue-400' },
  past: { class: 'bg-gray-600/20 text-gray-400', text: 'Evento pasado' }
}

export const EVENTS_CONFIG = {
  maxBenefitsToShow: 3,
  dateLocale: 'es-ES',
  dateOptions: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
}

export const EVENTS_STYLES = {
  container: 'min-h-screen bg-background py-8',
  maxWidth: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',

  header: {
    container: 'mb-8',
    wrapper: 'flex items-center justify-between',
    title: 'text-3xl font-bold text-white mb-4',
    subtitle: 'text-gray-400',
    demoButton: {
      active: 'px-4 py-2 rounded-lg font-medium transition-all bg-purple-600 text-white animate-pulse',
      inactive: 'px-4 py-2 rounded-lg font-medium transition-all bg-gray-700 text-gray-300 hover:bg-gray-600'
    }
  },

  filters: {
    container: 'bg-surface rounded-xl p-6 mb-8',
    grid: 'grid md:grid-cols-2 gap-4',
    label: 'block text-sm font-medium text-gray-400 mb-2',
    buttonGroup: 'flex flex-wrap gap-2',
    button: {
      active: 'px-4 py-2 rounded-lg font-medium transition-colors bg-accent text-background',
      inactive: 'px-4 py-2 rounded-lg font-medium transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600'
    },
    relevantIndicator: 'mt-4 p-3 bg-purple-600/20 border border-purple-500/50 rounded-lg'
  },

  eventCard: {
    container: 'bg-surface rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group max-w-md mx-auto sm:max-w-none',
    image: {
      wrapper: 'relative h-40 sm:h-48 overflow-hidden',
      image: 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-300',
      badge: 'absolute top-3 left-3 sm:top-4 sm:left-4',
      areaGradient: 'absolute bottom-0 left-0 right-0 h-1'
    },
    content: 'p-4 sm:p-6',
    title: 'text-lg sm:text-xl font-bold text-white mb-2 leading-tight',
    description: 'text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2',
    details: 'space-y-1.5 sm:space-y-2 mb-3 sm:mb-4',
    detailItem: 'flex items-center text-xs sm:text-sm text-gray-300',
    detailIcon: 'w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent flex-shrink-0',
    footer: 'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-700',
    capacity: {
      wrapper: 'flex flex-col space-y-1',
      text: 'text-[10px] sm:text-xs md:text-sm text-gray-400',
      bar: 'w-full sm:w-32 md:w-24 bg-gray-700 rounded-full h-1 sm:h-1.5 md:h-2',
      progress: 'bg-accent h-1 sm:h-1.5 md:h-2 rounded-full'
    },
    price: 'text-sm sm:text-base md:text-lg font-bold text-white mb-1',
    buttons: {
      wrapper: 'flex flex-col sm:flex-row gap-1.5 sm:gap-2 w-full',
      detail: 'w-full sm:flex-1 sm:min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-colors',
      register: 'w-full sm:flex-1 sm:min-w-[120px] px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-colors',
      registerActive: 'bg-green-600 hover:bg-green-700 text-white',
      registerDisabled: 'bg-gray-700 text-gray-500 cursor-not-allowed',
      demo: 'px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-xs sm:text-sm md:text-base'
    },
    timeIndicator: 'mt-1.5 sm:mt-2 md:mt-3 text-center text-[10px] sm:text-xs',
    relevanceScore: 'mt-1.5 sm:mt-2 md:mt-3 text-center text-[10px] sm:text-xs text-purple-400'
  },

  promotion: {
    container: 'mb-4',
    discountWrapper: 'flex items-center justify-between mb-2',
    discount: 'text-3xl font-bold text-green-400',
    code: 'text-sm text-gray-400',
    codeValue: 'font-mono bg-gray-700 px-2 py-1 rounded',
    validity: 'text-xs text-gray-400'
  },

  bundle: {
    container: 'mb-4',
    details: 'bg-gray-700/50 rounded-lg p-3 mb-3',
    title: 'text-sm text-gray-300 mb-2',
    list: 'space-y-1',
    item: 'text-xs text-gray-400',
    pricing: 'flex items-center justify-between',
    price: 'text-2xl font-bold text-white',
    badge: 'bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm'
  },

  benefits: {
    container: 'mb-3 sm:mb-4',
    title: 'text-xs sm:text-sm font-medium text-gray-400 mb-1.5 sm:mb-2',
    list: 'space-y-0.5 sm:space-y-1',
    item: 'text-[10px] sm:text-xs text-gray-300 flex items-start',
    checkmark: 'text-green-400 mr-1 text-xs sm:text-sm flex-shrink-0'
  },

  emptyState: {
    container: 'text-center py-12',
    text: 'text-gray-400 text-lg'
  },

  demoMessage: {
    container: 'mt-6 p-4 bg-purple-600/20 border border-purple-500 rounded-lg',
    text: 'text-purple-300 text-center'
  }
}

// MESSAGES eliminado - ya no se usan textos hardcodeados

export const EVENTS_ICONS = {
  calendar: (
    <svg className="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  user: (
    <svg className="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

export const EVENTS_UTILS = {
  formatEventDate: (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(EVENTS_CONFIG.dateLocale, EVENTS_CONFIG.dateOptions)
  },

  getDaysUntilEvent: (dateString) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return TIME_INDICATORS.today.text
    if (diffDays === 1) return TIME_INDICATORS.tomorrow.text
    if (diffDays < 0) return TIME_INDICATORS.past.text
    return `En ${diffDays} días`
  },

  getTimeIndicatorClass: (dateString) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return TIME_INDICATORS.today.class
    if (diffDays === 1) return TIME_INDICATORS.tomorrow.class
    if (diffDays < 0) return TIME_INDICATORS.past.class
    return TIME_INDICATORS.future.class
  }
}