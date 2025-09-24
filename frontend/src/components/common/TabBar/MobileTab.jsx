import { TAB_BAR_STYLES } from '../../../constants/tabBarConstants.jsx'

const MobileTab = ({ tab, isActive, onClick }) => {
  const tabClasses = `${TAB_BAR_STYLES.mobileTab} ${
    isActive ? TAB_BAR_STYLES.mobileTabActive : TAB_BAR_STYLES.mobileTabInactive
  }`

  return (
    <button
      onClick={onClick}
      className={tabClasses}
    >
      <div className={TAB_BAR_STYLES.mobileTabIcon}>
        {tab.icon}
      </div>
      <span className={TAB_BAR_STYLES.mobileTabLabel}>{tab.label}</span>
    </button>
  )
}

export default MobileTab