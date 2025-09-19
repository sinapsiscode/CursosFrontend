import { LoadingSpinner } from '../../common'
import {
  NOTIFICATION_STYLES,
  NOTIFICATION_LABELS,
  NOTIFICATION_ICONS
} from '../../../constants/notificationManagementConstants'

const NotificationHistory = ({
  notifications,
  loading,
  loadNotifications
}) => {
  if (loading) {
    return (
      <div className={NOTIFICATION_STYLES.loadingCenter}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className={NOTIFICATION_STYLES.emptyState}>
        <div className={NOTIFICATION_STYLES.emptyStateIcon}>
          {NOTIFICATION_ICONS.notification}
        </div>
        <h3 className={NOTIFICATION_STYLES.emptyStateTitle}>
          {NOTIFICATION_LABELS.emptyStates.noNotifications}
        </h3>
        <p className={NOTIFICATION_STYLES.emptyStateText}>
          {NOTIFICATION_LABELS.emptyStates.createFirst}
        </p>
      </div>
    )
  }

  return (
    <div className={NOTIFICATION_STYLES.formContainer}>
      <div className="w-full">
        <div className={NOTIFICATION_STYLES.formCard}>
          <div className={NOTIFICATION_STYLES.formHeader}>
            <div className="flex justify-between items-center">
              <h2 className={NOTIFICATION_STYLES.formTitle}>
                {NOTIFICATION_ICONS.history} {NOTIFICATION_LABELS.tabs.history}
              </h2>
              <button
                onClick={loadNotifications}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>

          <div className={NOTIFICATION_STYLES.formBody}>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>
                          {NOTIFICATION_ICONS[notification.type]} {NOTIFICATION_LABELS.types[notification.type]}
                        </span>
                        <span>•</span>
                        <span>
                          {NOTIFICATION_ICONS[notification.priority]} {NOTIFICATION_LABELS.priority[notification.priority]}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`${NOTIFICATION_STYLES.statusBadge} ${NOTIFICATION_STYLES[`status${notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}`]}`}>
                        {NOTIFICATION_ICONS[notification.status]} {NOTIFICATION_LABELS.status[notification.status]}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <p className="line-clamp-2">{notification.subject || notification.message}</p>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      {notification.recipientCount && (
                        <span>
                          👥 {notification.recipientCount} destinatarios
                        </span>
                      )}
                      {notification.sentAt && (
                        <span>
                          📅 {new Date(notification.sentAt).toLocaleString('es-ES')}
                        </span>
                      )}
                      {notification.scheduledFor && (
                        <span>
                          ⏰ Programado: {new Date(notification.scheduledFor).toLocaleString('es-ES')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        title={NOTIFICATION_LABELS.buttons.edit}
                      >
                        {NOTIFICATION_ICONS.edit}
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 font-medium"
                        title={NOTIFICATION_LABELS.buttons.duplicate}
                      >
                        {NOTIFICATION_ICONS.duplicate}
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 font-medium"
                        title={NOTIFICATION_LABELS.buttons.delete}
                      >
                        {NOTIFICATION_ICONS.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación (placeholder) */}
            {notifications.length > 10 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm">1 de 5</span>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationHistory