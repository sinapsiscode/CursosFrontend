import { NOTIFICATION_STYLES, NOTIFICATION_TEXTS, NOTIFICATION_CONFIG } from '../../../constants/notificationConstants'
import NotificationItem from './NotificationItem'

const NotificationList = ({ notifications, onNotificationAction, onDismiss }) => {
  return (
    <div className={NOTIFICATION_STYLES.scrollContainer}>
      {notifications.length === 0 ? (
        <div className={NOTIFICATION_STYLES.emptyState}>
          <div className={NOTIFICATION_STYLES.emptyIcon}>{NOTIFICATION_CONFIG.emptyStateIcon}</div>
          <p className={NOTIFICATION_STYLES.emptyText}>{NOTIFICATION_TEXTS.emptyMessage}</p>
        </div>
      ) : (
        <div className={NOTIFICATION_STYLES.notificationList}>
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onNotificationAction={onNotificationAction}
              onDismiss={onDismiss}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationList