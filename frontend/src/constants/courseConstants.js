export const COURSE_VARIANTS = {
  small: 'w-full max-w-xs',
  medium: 'w-full max-w-sm',
  large: 'w-full max-w-md'
}

export const AREA_COLORS = {
  metalurgia: 'bg-primary-metalurgia',
  mineria: 'bg-primary-mineria',
  geologia: 'bg-primary-geologia'
}

export const LEVEL_COLORS = {
  básico: 'bg-green-500',
  intermedio: 'bg-yellow-500',
  avanzado: 'bg-red-500'
}

export const COURSE_BADGES = {
  NEW: {
    text: 'NUEVO',
    className: 'bg-accent text-background'
  },
  FREE: {
    text: 'GRATIS',
    className: 'bg-green-500 text-white'
  },
  POPULAR: {
    text: 'POPULAR',
    className: 'bg-orange-500 text-white'
  }
}

export const BADGE_BASE_STYLES = 'text-xs font-bold px-2 py-1 rounded'

export const CARD_STYLES = {
  container: 'bg-surface rounded-xl overflow-hidden shadow-lg card-hover cursor-pointer',
  imageContainer: 'relative aspect-video bg-gray-700',
  loadingSpinner: 'absolute inset-0 flex items-center justify-center',
  spinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-accent',
  image: 'w-full h-full object-cover transition-opacity duration-300',
  badgeContainer: 'absolute top-3 left-3 flex flex-wrap gap-2',
  favoriteButton: 'absolute top-3 right-3 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all',
  duration: 'absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded',
  content: 'p-4',
  title: 'text-white font-semibold text-lg mb-2 line-clamp-2',
  instructor: 'text-text-secondary text-sm mb-3',
  tagContainer: 'flex items-center gap-2 mb-3',
  tag: 'text-white text-xs px-2 py-1 rounded-full',
  ratingContainer: 'flex items-center justify-between mb-3',
  ratingStars: 'flex items-center space-x-2',
  star: 'w-4 h-4 text-yellow-400 fill-current',
  progressContainer: 'mb-3',
  progressBar: 'w-full bg-gray-700 rounded-full h-2',
  progressFill: 'bg-accent h-2 rounded-full transition-all',
  priceContainer: 'flex items-center justify-between',
  priceSection: 'flex items-center gap-3',
  priceText: 'text-white font-bold',
  pointsContainer: 'flex items-center gap-1 bg-purple-900/30 px-2 py-1 rounded',
  pointsText: 'text-purple-400 text-sm font-medium',
  demoLabel: 'text-xs text-accent bg-accent bg-opacity-20 px-2 py-1 rounded'
}

export const FAVORITE_MESSAGES = {
  LOGIN_REQUIRED: 'Inicia sesión para agregar a favoritos'
}