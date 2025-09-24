export const LESSON_TABS = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'materiales', label: 'Materiales' },
  { id: 'notas', label: 'Notas' }
]

export const MATERIAL_TYPES = {
  pdf: {
    color: 'bg-red-500',
    icon: 'document'
  },
  document: {
    color: 'bg-blue-500',
    icon: 'document'
  },
  excel: {
    color: 'bg-green-500',
    icon: 'document'
  },
  default: {
    color: 'bg-gray-500',
    icon: 'document'
  }
}

export const LESSON_VIEW_MESSAGES = {
  navigation: {
    backToCourse: 'Volver al curso'
  },
  premium: {
    title: 'Contenido Premium',
    subtitle: 'Esta lección requiere una suscripción activa',
    backButton: 'Volver al curso'
  },
  lessonInfo: {
    lessonPrefix: 'Lección',
    of: 'de'
  },
  tabs: {
    description: {
      empty: 'Sin descripción disponible'
    },
    materials: {
      empty: 'No hay materiales disponibles para esta lección',
      download: 'Descargar'
    },
    notes: {
      placeholder: 'Toma notas sobre esta lección...',
      saveButton: 'Guardar notas'
    }
  },
  sidebar: {
    title: 'Contenido del curso'
  }
}

export const LESSON_VIEW_STYLES = {
  container: 'min-h-screen bg-background',
  maxWidth: 'max-w-7xl mx-auto px-4 py-8',
  premium: {
    container: 'min-h-screen bg-background flex items-center justify-center',
    content: 'text-center',
    icon: 'text-6xl mb-4',
    title: 'text-2xl font-bold text-white mb-2',
    subtitle: 'text-text-secondary mb-4',
    button: 'bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90'
  },
  header: {
    container: 'mb-6',
    backButton: 'flex items-center space-x-2 text-text-secondary hover:text-white transition-colors mb-4',
    backIcon: 'w-5 h-5',
    title: 'text-2xl font-bold text-white mb-2',
    info: 'text-text-secondary'
  },
  layout: {
    grid: 'grid lg:grid-cols-3 gap-8',
    mainColumn: 'lg:col-span-2',
    sidebarColumn: 'lg:col-span-1'
  },
  tabs: {
    container: 'mt-8',
    tabsHeader: 'border-b border-gray-700',
    tabsList: 'flex space-x-8',
    tab: 'py-4 px-2 border-b-2 font-medium text-sm transition-colors',
    tabActive: 'border-accent text-accent',
    tabInactive: 'border-transparent text-gray-400 hover:text-white',
    content: 'py-6'
  },
  description: {
    container: 'prose prose-invert max-w-none',
    text: 'text-text-secondary'
  },
  materials: {
    list: 'space-y-3',
    item: 'flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-gray-700 transition-colors group',
    itemLeft: 'flex items-center space-x-3',
    icon: 'w-10 h-10 rounded-lg flex items-center justify-center',
    iconSvg: 'w-5 h-5 text-white',
    info: '',
    name: 'text-white font-medium',
    type: 'text-xs text-gray-400 uppercase',
    download: 'text-accent group-hover:text-accent-light flex items-center space-x-2',
    downloadText: 'text-sm',
    downloadIcon: 'w-5 h-5',
    empty: 'text-text-secondary text-center py-8'
  },
  notes: {
    textarea: 'w-full h-40 px-4 py-3 bg-surface border border-gray-600 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-accent',
    saveButton: 'mt-4 bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90'
  },
  sidebar: {
    container: 'bg-surface rounded-xl p-6',
    title: 'text-lg font-semibold text-white mb-4',
    lessonsList: 'space-y-2 max-h-96 overflow-y-auto',
    lessonItem: 'w-full text-left p-3 rounded-lg transition-colors',
    lessonItemActive: 'bg-accent text-background',
    lessonItemInactive: 'hover:bg-gray-700 text-white',
    lessonContent: 'flex items-center space-x-3',
    lessonNumber: 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
    lessonNumberActive: 'bg-background text-accent',
    lessonNumberInactive: 'bg-gray-700',
    lessonInfo: 'flex-1',
    lessonTitle: 'font-medium text-sm',
    lessonDuration: 'text-xs opacity-75',
    lockIcon: 'w-4 h-4 opacity-50'
  }
}