export const TIME_RANGES = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
}

export const ANALYTICS_CONFIG = {
  defaultTimeRange: TIME_RANGES.MONTH,
  refreshInterval: 60000 // 1 minute
}

export const LOG_MESSAGES = {
  LOADING_DASHBOARD: '📊 Cargando datos del dashboard...',
  DASHBOARD_LOADED: '✅ Dashboard cargado:',
  LOADING_ERROR: '❌ Error al cargar el dashboard:',
  ERROR_DETAILS: '📝 Detalles del error:',
  LOADING_COMPLETED: '✅ Carga completada'
}

export const STAT_CARDS_CONFIG = [
  {
    key: 'totalUsers',
    title: 'Total Usuarios',
    change: 12,
    color: 'blue',
    icon: '👥'
  },
  {
    key: 'totalCourses',
    title: 'Total Cursos',
    change: 5,
    color: 'green',
    icon: '📚'
  },
  {
    key: 'totalHours',
    title: 'Horas Totales',
    change: 8,
    color: 'purple',
    icon: '⏱️'
  }
]

export const ADMIN_STYLES = {
  // StatCard styles
  statCard: 'bg-surface rounded-lg p-6 border border-gray-700',
  statCardHeader: 'flex items-center justify-between mb-4',
  statCardTitle: 'text-text-secondary text-sm',
  statCardValue: 'text-2xl font-bold text-white mt-1',
  statCardChange: 'text-xs mt-2',
  statCardChangePositive: 'text-green-500',
  statCardChangeNegative: 'text-red-500',
  statCardIcon: 'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',

  // UserChart styles
  userChart: 'bg-surface rounded-lg p-6 border border-gray-700',
  userChartTitle: 'text-lg font-semibold text-white mb-6',
  userChartContainer: 'relative h-48',
  userChartBar: 'absolute bottom-0 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300',
  userChartLabel: 'text-xs text-text-secondary mt-2',

  // PopularCourses styles
  popularCourses: 'bg-surface rounded-lg p-6 border border-gray-700',
  popularCoursesTitle: 'text-lg font-semibold text-white mb-6',
  popularCoursesList: 'space-y-4',
  popularCourseItem: 'flex items-center justify-between',
  popularCourseInfo: 'flex items-center space-x-3',
  popularCourseNumber: 'w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-300',
  popularCourseName: 'text-white',
  popularCourseStudents: 'text-text-secondary text-sm',

  // RecentUsers styles
  recentUsers: 'bg-surface rounded-lg p-6 border border-gray-700',
  recentUsersTitle: 'text-lg font-semibold text-white mb-6',
  recentUsersList: 'space-y-3',
  recentUserItem: 'flex items-center justify-between',
  recentUserInfo: 'flex items-center space-x-3',
  recentUserAvatar: 'w-10 h-10 rounded-full bg-gradient-to-br',
  recentUserDetails: 'text-left',
  recentUserName: 'text-white text-sm font-medium',
  recentUserEmail: 'text-text-secondary text-xs',
  recentUserDate: 'text-xs text-text-secondary'
}