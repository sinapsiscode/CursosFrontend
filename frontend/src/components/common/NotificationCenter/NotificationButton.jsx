import { NOTIFICATION_STYLES, NOTIFICATION_ICONS } from '../../../constants/notificationConstants.jsx'
import { formatUnreadCount } from '../../../utils/notificationUtils'

const NotificationButton = ({ unreadCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={NOTIFICATION_STYLES.button}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {NOTIFICATION_ICONS.bell}
      </svg>

      {unreadCount > 0 && (
        <span className={NOTIFICATION_STYLES.badge}>
          {formatUnreadCount(unreadCount)}
        </span>
      )}
    </button>
  )
}

export default NotificationButton