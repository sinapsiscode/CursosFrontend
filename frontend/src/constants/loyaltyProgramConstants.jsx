export const LOYALTY_TABS = [
  { id: 'overview', label: 'Resumen' },
  { id: 'rewards', label: 'Tienda de Recompensas' },
  { id: 'history', label: 'Historial' }
]

export const CATEGORY_ICONS = {
  cupones: '🎟️',
  cursos: '📚',
  servicios: '🛠️',
  eventos: '🎭',
  merchandising: '🎁'
}

export const TRANSACTION_TYPES = {
  earned: {
    label: 'Ganado',
    color: 'bg-green-600/20 text-green-400'
  },
  redeemed: {
    label: 'Canjeado',
    color: 'bg-blue-600/20 text-blue-400'
  },
  bonus: {
    label: 'Bonus',
    color: 'bg-purple-600/20 text-purple-400'
  },
  default: {
    label: 'Otro',
    color: 'bg-gray-600/20 text-gray-400'
  }
}

export const REDEMPTION_STATUS = {
  active: {
    label: 'Activo',
    color: 'bg-green-600/20 text-green-400'
  },
  used: {
    label: 'Usado',
    color: 'bg-gray-600/20 text-gray-400'
  },
  expired: {
    label: 'Expirado',
    color: 'bg-red-600/20 text-red-400'
  }
}

export const LOYALTY_MESSAGES = {
  header: {
    title: 'Programa de Fidelización',
    subtitle: 'Gana puntos y canjéalos por increíbles recompensas'
  },
  points: {
    available: 'Puntos disponibles',
    total: 'Puntos totales',
    dailyBonus: '🎁 Reclamar Bonus Diario (+10 pts)'
  },
  level: {
    title: 'Tu Nivel',
    discount: 'Descuento activo',
    progress: 'Progreso al siguiente nivel',
    remaining: 'pts restantes',
    benefits: 'Beneficios de tu nivel:',
    moreBenefits: 'beneficios más...'
  },
  overview: {
    allLevels: 'Niveles del Programa',
    howToEarn: '¿Cómo ganar puntos?',
    redeemedRewards: 'Mis Recompensas Canjeadas',
    minPoints: 'puntos',
    discount: 'Descuento',
    more: 'más...'
  },
  rewards: {
    store: 'Tienda de Recompensas',
    points: 'puntos',
    redeem: 'Canjear',
    redeeming: 'Canjeando...',
    needMore: 'Necesitas',
    morePoints: 'pts más'
  },
  history: {
    title: 'Historial de Transacciones',
    date: 'Fecha',
    description: 'Descripción',
    points: 'Puntos',
    type: 'Tipo',
    noTransactions: 'No hay transacciones aún',
    startEarning: 'Comienza a ganar puntos comprando cursos'
  },
  redemption: {
    code: 'Código de canje',
    expires: 'Expira en',
    days: 'días'
  },
  loading: 'Cargando programa de fidelización...',
  success: '¡Recompensa canjeada exitosamente!',
  error: 'Error al canjear la recompensa',
  dailySuccess: 'puntos diarios reclamados!'
}

export const LOYALTY_STYLES = {
  container: 'min-h-screen bg-background py-8',
  maxWidth: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  loading: {
    container: 'min-h-screen bg-background flex items-center justify-center',
    content: 'text-center',
    spinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4',
    text: 'text-gray-400'
  },
  header: {
    container: 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 mb-8',
    grid: 'grid md:grid-cols-2 gap-8',
    title: 'text-3xl font-bold text-white mb-2',
    subtitle: 'text-gray-300 mb-6',
    pointsSection: 'space-y-4',
    pointsRow: 'flex items-center justify-between',
    pointsLabel: 'text-gray-400',
    pointsAvailable: 'text-3xl font-bold text-white',
    pointsTotal: 'text-xl text-gray-300',
    dailyButton: 'w-full bg-accent text-background py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors'
  },
  levelCard: {
    container: 'bg-gray-800/50 rounded-xl p-6',
    header: 'flex items-center justify-between mb-4',
    levelInfo: '',
    levelTitle: 'text-lg font-medium text-gray-400',
    levelName: 'flex items-center space-x-2 mt-1',
    levelIcon: 'text-2xl',
    levelText: 'text-2xl font-bold',
    discountInfo: 'text-right',
    discountLabel: 'text-sm text-gray-400',
    discountValue: 'text-2xl font-bold text-green-400',
    progress: 'mb-2',
    progressHeader: 'flex justify-between text-sm text-gray-400 mb-1',
    progressBar: 'w-full bg-gray-700 rounded-full h-3',
    progressFill: 'bg-gradient-to-r from-accent to-pink-500 h-3 rounded-full transition-all duration-500',
    benefits: 'mt-4',
    benefitsTitle: 'text-sm font-medium text-gray-400 mb-2',
    benefitsList: 'space-y-1 text-sm text-gray-300',
    benefitItem: 'flex items-start',
    benefitCheck: 'text-green-400 mr-2',
    moreBenefits: 'text-accent'
  },
  tabs: {
    container: 'flex space-x-4 mb-8 border-b border-gray-700',
    tab: 'pb-4 px-2 font-medium transition-colors',
    tabActive: 'text-white border-b-2 border-accent',
    tabInactive: 'text-gray-400 hover:text-white'
  },
  overview: {
    section: 'space-y-8',
    title: 'text-2xl font-bold text-white mb-6',
    levelsGrid: 'grid md:grid-cols-2 lg:grid-cols-4 gap-4',
    levelCard: 'bg-surface rounded-xl p-6 border-2 transition-all',
    levelCardActive: 'border-accent shadow-lg shadow-accent/20',
    levelCardInactive: 'border-gray-700',
    levelCardContent: 'text-center mb-4',
    levelCardIcon: 'text-4xl mb-2',
    levelCardName: 'text-xl font-bold',
    levelCardPoints: 'text-sm text-gray-400 mt-1',
    levelCardDetails: 'space-y-2',
    levelCardDiscount: 'text-center py-2 bg-gray-800 rounded-lg',
    levelCardDiscountValue: 'text-2xl font-bold text-green-400',
    levelCardDiscountLabel: 'text-xs text-gray-400',
    pointsRulesGrid: 'grid md:grid-cols-2 lg:grid-cols-3 gap-4',
    ruleCard: 'bg-surface rounded-xl p-6',
    ruleHeader: 'flex items-center justify-between mb-2',
    ruleTitle: 'font-medium text-white',
    rulePoints: 'text-2xl font-bold text-accent',
    redeemedGrid: 'grid md:grid-cols-2 gap-4'
  },
  rewards: {
    title: 'text-2xl font-bold text-white mb-6',
    categorySection: 'mb-8',
    categoryTitle: 'text-xl font-semibold text-white mb-4 flex items-center',
    categoryIcon: 'text-2xl mr-2',
    rewardsGrid: 'grid md:grid-cols-2 lg:grid-cols-3 gap-4',
    rewardCard: 'bg-surface rounded-xl p-6 border transition-all',
    rewardCardActive: 'border-gray-700 hover:border-accent hover:shadow-lg',
    rewardCardInactive: 'border-gray-800 opacity-60',
    rewardHeader: 'flex items-start justify-between mb-4',
    rewardIcon: 'text-3xl',
    rewardPoints: 'text-right',
    rewardPointsValue: 'text-2xl font-bold text-white',
    rewardPointsLabel: 'text-xs text-gray-400',
    rewardName: 'font-medium text-white mb-2',
    rewardDescription: 'text-sm text-gray-400 mb-4',
    rewardButton: 'w-full py-2 rounded-lg font-medium transition-colors',
    rewardButtonActive: 'bg-accent text-background hover:bg-opacity-90',
    rewardButtonInactive: 'bg-gray-700 text-gray-500 cursor-not-allowed',
    rewardButtonSpinner: 'flex items-center justify-center',
    spinner: 'animate-spin h-5 w-5 mr-2'
  },
  history: {
    title: 'text-2xl font-bold text-white mb-6',
    table: 'bg-surface rounded-xl overflow-hidden',
    tableHead: 'bg-gray-800',
    tableHeader: 'text-left py-3 px-4 font-medium text-gray-400',
    tableHeaderRight: 'text-right py-3 px-4 font-medium text-gray-400',
    tableHeaderCenter: 'text-center py-3 px-4 font-medium text-gray-400',
    tableBody: 'divide-y divide-gray-700',
    tableRow: 'hover:bg-gray-800/50 transition-colors',
    tableCell: 'py-3 px-4 text-sm',
    tableCellDate: 'py-3 px-4 text-sm text-gray-400',
    tableCellDescription: 'py-3 px-4 text-sm text-white',
    tableCellPoints: 'py-3 px-4 text-sm font-medium text-right',
    tableCellPointsPositive: 'text-green-400',
    tableCellPointsNegative: 'text-red-400',
    tableCellType: 'py-3 px-4 text-center',
    typeLabel: 'text-xs px-2 py-1 rounded',
    emptyState: 'text-center py-12 bg-surface rounded-xl',
    emptyTitle: 'text-gray-400',
    emptySubtitle: 'text-sm text-gray-500 mt-2'
  },
  redemption: {
    card: 'bg-surface rounded-xl p-6',
    header: 'flex items-start justify-between mb-4',
    info: 'flex items-center space-x-2',
    icon: 'text-2xl',
    name: 'font-medium text-white',
    description: 'text-sm text-gray-400 mt-1',
    status: 'text-xs px-2 py-1 rounded',
    codeSection: 'bg-gray-800 rounded-lg p-3 text-center',
    codeLabel: 'text-xs text-gray-400 mb-1',
    codeValue: 'font-mono text-sm text-white',
    expiration: 'text-xs text-gray-400 text-center mt-2'
  }
}