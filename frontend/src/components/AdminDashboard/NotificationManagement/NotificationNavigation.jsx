import {
  PANEL_TYPES,
  NOTIFICATION_STYLES,
  NOTIFICATION_LABELS,
  NOTIFICATION_ICONS
} from '../../../constants/notificationManagementConstants'

const NotificationNavigation = ({ activePanel, onPanelChange }) => {
  const tabs = [
    {
      id: PANEL_TYPES.FORM,
      label: NOTIFICATION_LABELS.tabs.create,
      icon: NOTIFICATION_ICONS.create
    },
    {
      id: PANEL_TYPES.TESTING,
      label: NOTIFICATION_LABELS.tabs.testing,
      icon: NOTIFICATION_ICONS.testing
    },
    {
      id: PANEL_TYPES.PREVIEW,
      label: NOTIFICATION_LABELS.tabs.preview,
      icon: NOTIFICATION_ICONS.preview
    },
    {
      id: PANEL_TYPES.HISTORY,
      label: NOTIFICATION_LABELS.tabs.history,
      icon: NOTIFICATION_ICONS.history
    }
  ]

  return (
    <div className={NOTIFICATION_STYLES.nav}>
      <div className={NOTIFICATION_STYLES.navContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onPanelChange(tab.id)}
            className={`${NOTIFICATION_STYLES.navTab} ${
              activePanel === tab.id
                ? NOTIFICATION_STYLES.navTabActive
                : NOTIFICATION_STYLES.navTabInactive
            }`}
          >
            <span className={NOTIFICATION_STYLES.channelIcon}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default NotificationNavigation