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

export const BADGE_BASE_STYLES = 'text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded'

export const CARD_STYLES = {
  container: 'bg-surface rounded-lg sm:rounded-xl overflow-hidden shadow-lg card-hover cursor-pointer w-full',
  imageContainer: 'relative aspect-video bg-gray-700',
  loadingSpinner: 'absolute inset-0 flex items-center justify-center',
  spinner: 'animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-accent',
  image: 'w-full h-full object-cover transition-opacity duration-300',
  badgeContainer: 'absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1 sm:gap-2',
  favoriteButton: 'absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all',
  duration: 'absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black bg-opacity-75 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded',
  content: 'p-3 sm:p-4',
  title: 'text-white font-semibold text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2 line-clamp-2',
  instructor: 'text-text-secondary text-xs sm:text-sm mb-2 sm:mb-3',
  tagContainer: 'flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap',
  tag: 'text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full',
  ratingContainer: 'flex items-center justify-between mb-2 sm:mb-3 gap-2',
  ratingStars: 'flex items-center space-x-1 sm:space-x-2',
  star: 'w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current',
  progressContainer: 'mb-2 sm:mb-3',
  progressBar: 'w-full bg-gray-700 rounded-full h-1.5 sm:h-2',
  progressFill: 'bg-accent h-1.5 sm:h-2 rounded-full transition-all',
  priceContainer: 'flex items-center justify-between gap-2 flex-wrap',
  priceSection: 'flex items-center gap-2 sm:gap-3',
  priceText: 'text-white font-bold text-sm sm:text-base',
  pointsContainer: 'flex items-center gap-1 bg-purple-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded',
  pointsText: 'text-purple-400 text-xs sm:text-sm font-medium',
  demoLabel: 'text-[10px] sm:text-xs text-accent bg-accent bg-opacity-20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded'
}

export const FAVORITE_MESSAGES = {
  LOGIN_REQUIRED: 'Inicia sesión para agregar a favoritos'
}