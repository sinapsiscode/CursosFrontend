import { NOTIFICATION_STYLES, NOTIFICATION_TEXTS, NOTIFICATION_ICONS } from '../../../constants/notificationConstants.jsx'

const NotificationHeader = ({ unreadCount, onMarkAllAsRead, onClose }) => {
  return (
    <div className={NOTIFICATION_STYLES.header}>
      <div className={NOTIFICATION_STYLES.headerContent}>
        <h3 className={NOTIFICATION_STYLES.title}>{NOTIFICATION_TEXTS.title}</h3>
        <div className={NOTIFICATION_STYLES.headerActions}>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className={NOTIFICATION_STYLES.markAllButton}
            >
              {NOTIFICATION_TEXTS.markAllAsRead}
            </button>
          )}
          <button
            onClick={onClose}
            className={NOTIFICATION_STYLES.closeButton}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {NOTIFICATION_ICONS.close}
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationHeader