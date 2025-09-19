import {
  NOTIFICATION_STYLES,
  NOTIFICATION_LABELS
} from '../../../constants/notificationManagementConstants'

const NotificationHeader = () => {
  return (
    <div className={NOTIFICATION_STYLES.header}>
      <h1 className={NOTIFICATION_STYLES.headerTitle}>
        {NOTIFICATION_LABELS.pageTitle}
      </h1>
      <p className={NOTIFICATION_STYLES.headerSubtitle}>
        {NOTIFICATION_LABELS.pageSubtitle}
      </p>
    </div>
  )
}

export default NotificationHeader