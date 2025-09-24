export const NOTIFICATION_STYLES = {
  container: 'relative',
  button: 'relative p-2 text-gray-300 hover:text-white transition-colors',
  badge: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center',
  backdrop: 'fixed inset-0 z-40',
  panel: 'absolute right-0 mt-2 w-96 max-h-[600px] bg-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden',
  header: 'p-4 border-b border-gray-700',
  headerContent: 'flex items-center justify-between',
  title: 'text-lg font-semibold text-white',
  headerActions: 'flex items-center space-x-2',
  markAllButton: 'text-sm text-blue-400 hover:text-blue-300 transition-colors',
  closeButton: 'text-gray-400 hover:text-white transition-colors',
  scrollContainer: 'overflow-y-auto max-h-[500px]',
  emptyState: 'p-8 text-center',
  emptyIcon: 'text-4xl mb-2',
  emptyText: 'text-gray-400',
  notificationList: 'divide-y divide-gray-700',
  notification: 'p-4 hover:bg-gray-700/50 transition-colors',
  notificationUnread: 'bg-gray-700/20',
  notificationContent: 'flex space-x-3',
  notificationIcon: 'flex-shrink-0 text-2xl',
  notificationBody: 'flex-1',
  notificationTitle: 'font-medium text-white mb-1',
  notificationMessage: 'text-sm text-gray-300',
  actionsContainer: 'mt-3 flex flex-wrap gap-2',
  actionButton: 'inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors',
  actionIcon: 'mr-1',
  notificationFooter: 'mt-2 flex items-center justify-between',
  timestamp: 'text-xs text-gray-400',
  dismissButton: 'text-xs text-gray-400 hover:text-red-400 transition-colors'
}

export const NOTIFICATION_TEXTS = {
  title: 'Notificaciones',
  markAllAsRead: 'Marcar todas como leídas',
  emptyMessage: 'No tienes notificaciones',
  dismiss: 'Eliminar'
}

export const NOTIFICATION_ICONS = {
  bell: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  ),
  close: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  )
}

export const NOTIFICATION_CONFIG = {
  updateInterval: 30000,
  cleanupInterval: 3600000,
  maxUnreadDisplay: 9,
  emptyStateIcon: '🔔'
}

export const DATE_FORMAT_OPTIONS = {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}