import { TAB_BAR_STYLES } from '../../../constants/tabBarConstants.jsx'
import MobileTab from './MobileTab'

const MobileTabBar = ({ tabs, currentTabId, onTabClick }) => {
  return (
    <>
      <div className={TAB_BAR_STYLES.mobileContainer}>
        <div className={TAB_BAR_STYLES.mobileContent}>
          {tabs.map((tab) => (
            <MobileTab
              key={tab.id}
              tab={tab}
              isActive={currentTabId === tab.id}
              onClick={() => onTabClick(tab)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default MobileTabBar