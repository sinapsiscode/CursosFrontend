import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUIStore } from '../store'
import { TAB_DEFINITIONS } from '../constants/tabBarConstants.jsx'

export const useTabBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setActiveTab } = useUIStore()

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab.id)
    navigate(tab.path)
  }, [setActiveTab, navigate])

  const getCurrentTab = useCallback(() => {
    const currentPath = location.pathname
    const currentTab = TAB_DEFINITIONS.find(tab => {
      if (tab.path === '/' && currentPath === '/') return true
      if (tab.path !== '/' && currentPath.startsWith(tab.path)) return true
      return false
    })
    return currentTab?.id || 'inicio'
  }, [location.pathname])

  const currentTabId = getCurrentTab()

  return {
    tabs: TAB_DEFINITIONS,
    currentTabId,
    handleTabClick
  }
}