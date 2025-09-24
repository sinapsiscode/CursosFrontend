import { NOTIFICATION_STYLES } from '../../constants/notificationConstants.jsx'
import { useNotificationCenter } from '../../hooks/useNotificationCenter'
import NotificationButton from './NotificationCenter/NotificationButton'
import NotificationPanel from './NotificationCenter/NotificationPanel'

const NotificationCenter = () => {
  const {
    isOpen,
    notifications,
    unreadCount,
    toggleOpen,
    close,
    handleNotificationAction,
    handleDismiss,
    handleMarkAllAsRead
  } = useNotificationCenter()

  return (
    <div className={NOTIFICATION_STYLES.container}>
      <NotificationButton
        unreadCount={unreadCount}
        onClick={toggleOpen}
      />

      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={close}
          onNotificationAction={handleNotificationAction}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  )
}

export default NotificationCenter