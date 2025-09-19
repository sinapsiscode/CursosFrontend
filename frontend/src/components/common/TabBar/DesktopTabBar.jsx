import { TAB_BAR_STYLES } from '../../../constants/tabBarConstants'
import DesktopTab from './DesktopTab'

const DesktopTabBar = ({ tabs, currentTabId, onTabClick }) => {
  return (
    <div className={TAB_BAR_STYLES.desktopContainer}>
      <div className={TAB_BAR_STYLES.desktopWrapper}>
        <div className={TAB_BAR_STYLES.desktopContent}>
          <div className={TAB_BAR_STYLES.desktopTabs}>
            {tabs.map((tab) => (
              <DesktopTab
                key={tab.id}
                tab={tab}
                isActive={currentTabId === tab.id}
                onClick={() => onTabClick(tab)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopTabBar