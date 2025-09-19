export const SPINNER_SIZES = {
  small: 'h-4 w-4',
  medium: 'h-8 w-8',
  large: 'h-12 w-12',
  xlarge: 'h-16 w-16'
}

export const SPINNER_COLORS = {
  accent: 'border-accent',
  white: 'border-white',
  gray: 'border-gray-400',
  primary: 'border-primary-metalurgia'
}

export const SPINNER_STYLES = {
  base: 'animate-spin rounded-full border-b-2',
  fullPageContainer: 'fixed inset-0 bg-background bg-opacity-90 flex items-center justify-center z-50',
  fullPageContent: 'text-center',
  fullPageMessage: 'text-white mt-4 text-lg',
  inlineContainer: 'flex items-center space-x-3',
  inlineMessage: 'text-text-secondary'
}

export const SKELETON_STYLES = {
  courseCard: {
    container: 'w-full max-w-sm bg-surface rounded-xl overflow-hidden shadow-lg animate-pulse',
    image: 'aspect-video bg-gray-700',
    content: 'p-4 space-y-3',
    title: 'h-6 bg-gray-700 rounded w-3/4',
    instructor: 'h-4 bg-gray-700 rounded w-1/2',
    tagContainer: 'flex space-x-2',
    tag1: 'h-6 bg-gray-700 rounded-full w-16',
    tag2: 'h-6 bg-gray-700 rounded-full w-20',
    bottomContainer: 'flex justify-between items-center',
    rating: 'h-4 bg-gray-700 rounded w-24',
    price: 'h-6 bg-gray-700 rounded w-16'
  },
  lessonList: {
    container: 'space-y-3',
    item: 'flex items-center space-x-4 p-4 bg-surface rounded-lg animate-pulse',
    icon: 'w-12 h-12 bg-gray-700 rounded',
    content: 'flex-1 space-y-2',
    title: 'h-4 bg-gray-700 rounded w-3/4',
    subtitle: 'h-3 bg-gray-700 rounded w-1/2',
    duration: 'h-4 bg-gray-700 rounded w-16'
  }
}

export const DEFAULT_LOADING_MESSAGE = 'Cargando...'

export const SKELETON_ITEM_COUNT = 5