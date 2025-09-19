import { useTabBar } from '../../hooks/useTabBar'
import MobileTabBar from './TabBar/MobileTabBar'
import DesktopTabBar from './TabBar/DesktopTabBar'

const TabBar = () => {
  const { tabs, currentTabId, handleTabClick } = useTabBar()

  return (
    <>
      <MobileTabBar
        tabs={tabs}
        currentTabId={currentTabId}
        onTabClick={handleTabClick}
      />

      <DesktopTabBar
        tabs={tabs}
        currentTabId={currentTabId}
        onTabClick={handleTabClick}
      />
    </>
  )
}

export default TabBar