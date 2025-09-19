import { useState } from 'react'

export const useCoursePreview = (initialTab = 'general') => {
  const [activeTab, setActiveTab] = useState(initialTab)

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  return {
    activeTab,
    setActiveTab: handleTabChange
  }
}