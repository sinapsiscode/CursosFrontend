import { NOTIFICATION_STYLES } from '../../../constants/notificationConstants.jsx'
import NotificationHeader from './NotificationHeader'
import NotificationList from './NotificationList'

const NotificationPanel = ({
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onClose,
  onNotificationAction,
  onDismiss
}) => {
  return (
    <>
      <div className={NOTIFICATION_STYLES.backdrop} onClick={onClose} />

      <div className={NOTIFICATION_STYLES.panel}>
        <NotificationHeader
          unreadCount={unreadCount}
          onMarkAllAsRead={onMarkAllAsRead}
          onClose={onClose}
        />

        <NotificationList
          notifications={notifications}
          onNotificationAction={onNotificationAction}
          onDismiss={onDismiss}
        />
      </div>
    </>
  )
}

export default NotificationPanel