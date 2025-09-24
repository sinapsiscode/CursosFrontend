import { NOTIFICATION_STYLES, NOTIFICATION_TEXTS } from '../../../constants/notificationConstants.jsx'
import { formatNotificationDate, isNotificationUnread } from '../../../utils/notificationUtils'
import NotificationActions from './NotificationActions'

const NotificationItem = ({ notification, onNotificationAction, onDismiss }) => {
  const unread = isNotificationUnread(notification)

  return (
    <div
      className={`${NOTIFICATION_STYLES.notification} ${
        unread ? NOTIFICATION_STYLES.notificationUnread : ''
      }`}
    >
      <div className={NOTIFICATION_STYLES.notificationContent}>
        {notification.icon && (
          <div className={NOTIFICATION_STYLES.notificationIcon}>
            {notification.icon}
          </div>
        )}

        <div className={NOTIFICATION_STYLES.notificationBody}>
          {notification.title && (
            <h4 className={NOTIFICATION_STYLES.notificationTitle}>
              {notification.title}
            </h4>
          )}

          <p className={NOTIFICATION_STYLES.notificationMessage}>
            {notification.message}
          </p>

          {notification.actions.length > 0 && (
            <NotificationActions
              actions={notification.actions}
              onAction={(actionIndex) => onNotificationAction(notification, actionIndex)}
            />
          )}

          <div className={NOTIFICATION_STYLES.notificationFooter}>
            <span className={NOTIFICATION_STYLES.timestamp}>
              {formatNotificationDate(notification.timestamp)}
            </span>

            <button
              onClick={() => onDismiss(notification.id)}
              className={NOTIFICATION_STYLES.dismissButton}
            >
              {NOTIFICATION_TEXTS.dismiss}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem