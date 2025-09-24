import { TAB_BAR_STYLES } from '../../../constants/tabBarConstants.jsx'

const DesktopTab = ({ tab, isActive, onClick }) => {
  const tabClasses = `${TAB_BAR_STYLES.desktopTab} ${
    isActive ? TAB_BAR_STYLES.desktopTabActive : TAB_BAR_STYLES.desktopTabInactive
  }`

  return (
    <button
      onClick={onClick}
      className={tabClasses}
    >
      <div className={TAB_BAR_STYLES.desktopTabIcon}>
        {tab.icon}
      </div>
      <span>{tab.label}</span>
    </button>
  )
}

export default DesktopTab