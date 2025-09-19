import { useNotificationManagement } from '../../../hooks/useNotificationManagement'
import {
  PANEL_TYPES,
  NOTIFICATION_STYLES
} from '../../../constants/notificationManagementConstants'
import NotificationHeader from './NotificationHeader'
import NotificationNavigation from './NotificationNavigation'
import NotificationForm from './NotificationForm'
import NotificationTesting from './NotificationTesting'
import NotificationPreview from './NotificationPreview'
import NotificationHistory from './NotificationHistory'

const NotificationManagement = () => {
  const {
    // Estado
    activePanel,
    loading,

    // Navegación
    changePanel,

    // Resto de props para componentes hijos
    ...notificationProps
  } = useNotificationManagement()

  const renderActivePanel = () => {
    switch (activePanel) {
      case PANEL_TYPES.FORM:
        return <NotificationForm {...notificationProps} />
      case PANEL_TYPES.TESTING:
        return <NotificationTesting {...notificationProps} />
      case PANEL_TYPES.PREVIEW:
        return <NotificationPreview {...notificationProps} />
      case PANEL_TYPES.HISTORY:
        return <NotificationHistory {...notificationProps} />
      default:
        return <NotificationForm {...notificationProps} />
    }
  }

  return (
    <div className={NOTIFICATION_STYLES.container}>
      <NotificationHeader />

      <NotificationNavigation
        activePanel={activePanel}
        onPanelChange={changePanel}
      />

      {renderActivePanel()}
    </div>
  )
}

export default NotificationManagement