import { useState, useEffect } from 'react'
import { notificationService } from '../../services/notificationService'

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Cargar notificaciones al montar
    loadNotifications()

    // Actualizar cada 30 segundos
    const interval = setInterval(loadNotifications, 30000)

    // Limpiar notificaciones antiguas cada hora
    const cleanupInterval = setInterval(() => {
      notificationService.cleanOldNotifications()
      loadNotifications()
    }, 3600000)

    return () => {
      clearInterval(interval)
      clearInterval(cleanupInterval)
    }
  }, [])

  const loadNotifications = () => {
    setNotifications(notificationService.getActiveNotifications())
    setUnreadCount(notificationService.getUnreadCount())
  }

  const handleNotificationAction = (notification, actionIndex) => {
    notificationService.handleAction(notification.id, actionIndex)
    loadNotifications()
  }

  const handleDismiss = (notificationId) => {
    notificationService.dismissNotification(notificationId)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    notifications.forEach(notif => {
      notificationService.markAsRead(notif.id)
    })
    loadNotifications()
  }

  return (
    <>
      {/* Botón de notificaciones */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          
          {/* Badge de notificaciones no leídas */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Panel de notificaciones */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de notificaciones */}
              <div className="overflow-y-auto max-h-[500px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-2">🔔</div>
                    <p className="text-gray-400">No tienes notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-700/50 transition-colors ${
                          !notification.read ? 'bg-gray-700/20' : ''
                        }`}
                      >
                        <div className="flex space-x-3">
                          {notification.icon && (
                            <div className="flex-shrink-0 text-2xl">
                              {notification.icon}
                            </div>
                          )}
                          
                          <div className="flex-1">
                            {notification.title && (
                              <h4 className="font-medium text-white mb-1">
                                {notification.title}
                              </h4>
                            )}
                            
                            <p className="text-sm text-gray-300">
                              {notification.message}
                            </p>
                            
                            {notification.actions.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {notification.actions.map((action, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleNotificationAction(notification, index)}
                                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                  >
                                    {action.icon && <span className="mr-1">{action.icon}</span>}
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {new Date(notification.timestamp).toLocaleString('es-ES', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              
                              <button
                                onClick={() => handleDismiss(notification.id)}
                                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default NotificationCenter