import { NOTIFICATION_STYLES } from '../../../constants/notificationConstants.jsx'

const NotificationActions = ({ actions, onAction }) => {
  return (
    <div className={NOTIFICATION_STYLES.actionsContainer}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onAction(index)}
          className={NOTIFICATION_STYLES.actionButton}
        >
          {action.icon && <span className={NOTIFICATION_STYLES.actionIcon}>{action.icon}</span>}
          {action.label}
        </button>
      ))}
    </div>
  )
}

export default NotificationActions