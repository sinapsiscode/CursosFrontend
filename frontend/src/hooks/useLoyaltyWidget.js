import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loyaltyService } from '../services/loyaltyService'
import { useAuthStore } from '../store'
import { LOYALTY_NAVIGATION_ROUTES } from '../constants/loyaltyConstants'

export const useLoyaltyWidget = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [loyaltyData, setLoyaltyData] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const loadLoyaltyData = useCallback(() => {
    const data = loyaltyService.getUserPoints()
    const currentLevel = loyaltyService.getCurrentLevel()
    const levelConfig = loyaltyService.config.levels[currentLevel]
    const levelProgress = loyaltyService.getLevelProgress()

    setLoyaltyData({
      points: data.availablePoints,
      level: currentLevel,
      levelConfig,
      levelProgress
    })
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadLoyaltyData()
    }
  }, [isAuthenticated, loadLoyaltyData])

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const handleMinimize = useCallback((e) => {
    e.stopPropagation()
    setIsMinimized(true)
    setIsExpanded(false)
  }, [])

  const handleRestore = useCallback(() => {
    setIsMinimized(false)
  }, [])

  const handleClose = useCallback(() => {
    setIsExpanded(false)
  }, [])

  const handleNavigateToLoyalty = useCallback(() => {
    navigate(LOYALTY_NAVIGATION_ROUTES.loyalty)
    setIsExpanded(false)
  }, [navigate])

  const isVisible = isAuthenticated && loyaltyData

  return {
    loyaltyData,
    isExpanded,
    isMinimized,
    isVisible,
    handleToggleExpanded,
    handleMinimize,
    handleRestore,
    handleClose,
    handleNavigateToLoyalty
  }
}