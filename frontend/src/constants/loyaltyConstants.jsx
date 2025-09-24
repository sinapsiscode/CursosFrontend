export const LOYALTY_WIDGET_STYLES = {
  container: 'fixed bottom-24 right-4 z-40',
  minimizedButton: 'bg-purple-600 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300',
  compactButton: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2',
  minimizeButton: 'absolute -top-2 -right-2 bg-gray-800 text-gray-400 hover:text-white rounded-full p-1 shadow-lg',
  expandedPanel: 'absolute bottom-full mb-2 right-0 bg-gray-800 rounded-xl shadow-2xl p-6 w-80',
  levelCard: 'bg-gray-700/50 rounded-lg p-4 mb-4',
  levelHeader: 'flex items-center justify-between mb-2',
  levelInfo: 'flex items-center space-x-2',
  pointsDisplay: 'text-right',
  progressContainer: 'mt-3',
  progressLabels: 'flex justify-between text-xs text-gray-400 mb-1',
  progressBar: 'w-full bg-gray-600 rounded-full h-2',
  progressFill: 'bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500',
  benefitsContainer: 'mb-4',
  benefitsCard: 'flex items-center justify-between bg-green-600/20 border border-green-500/50 rounded-lg p-3',
  actionsContainer: 'space-y-2',
  primaryButton: 'w-full bg-accent text-background py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors',
  secondaryButton: 'w-full bg-gray-700 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors',
  pointsSection: 'mt-4 pt-4 border-t border-gray-700',
  pointsGrid: 'grid grid-cols-2 gap-2 text-xs',
  pointsItem: 'flex items-center space-x-1'
}

export const LOYALTY_TEXTS = {
  showProgram: 'Mostrar programa de fidelización',
  myPoints: 'Mis Puntos',
  loyaltyProgram: 'Programa de Fidelización',
  currentLevel: 'Nivel actual',
  points: 'puntos',
  progress: 'Progreso',
  yourBenefits: 'Tus beneficios:',
  activeDiscount: 'Descuento activo',
  viewFullProgram: 'Ver Programa Completo',
  redeemPoints: 'Canjear Puntos',
  earnPointsWith: 'Gana puntos con:',
  minimize: 'Minimizar',
  pointsActions: [
    'Comprar cursos',
    'Completar lecciones',
    'Referir amigos',
    'Dejar reseñas'
  ]
}

export const LOYALTY_ICONS = {
  chevronUp: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  ),
  minimize: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  ),
  close: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  ),
  bullet: '•'
}

export const LOYALTY_NAVIGATION_ROUTES = {
  loyalty: '/loyalty'
}