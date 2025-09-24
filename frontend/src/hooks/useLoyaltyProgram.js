import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loyaltyService } from '../services/loyaltyService'
import { useUIStore, useAuthStore } from '../store'
import { LOYALTY_MESSAGES } from '../constants/loyaltyProgramConstants.jsx'

export const useLoyaltyProgram = () => {
  const navigate = useNavigate()
  const { showToast } = useUIStore()
  const { isAuthenticated } = useAuthStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [userLoyaltyData, setUserLoyaltyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [redeemingReward, setRedeemingReward] = useState(null)

  const loadLoyaltyData = useCallback(() => {
    const data = loyaltyService.getUserPoints()
    const currentLevel = loyaltyService.getCurrentLevel()
    const levelProgress = loyaltyService.getLevelProgress()
    const pointsToNext = loyaltyService.getPointsToNextLevel()
    const config = loyaltyService.config

    setUserLoyaltyData({
      ...data,
      currentLevel,
      levelProgress,
      pointsToNext,
      levelConfig: config.levels[currentLevel],
      availableRewards: loyaltyService.getAvailableRewards(),
      redeemedRewards: loyaltyService.getRedeemedRewards(),
      transactions: loyaltyService.getTransactionHistory(20)
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    loadLoyaltyData()
  }, [isAuthenticated, navigate, loadLoyaltyData])

  const handleRedeemReward = useCallback(async (rewardId) => {
    setRedeemingReward(rewardId)

    const result = await loyaltyService.redeemReward(rewardId)

    if (result.success) {
      showToast(LOYALTY_MESSAGES.success, 'success')
      loadLoyaltyData()
    } else {
      showToast(result.error || LOYALTY_MESSAGES.error, 'error')
    }

    setRedeemingReward(null)
  }, [showToast, loadLoyaltyData])

  const handleClaimDailyBonus = useCallback(async () => {
    const result = await loyaltyService.addDailyLoginPoints()

    if (result.success) {
      showToast(`¡+${result.transaction.amount} ${LOYALTY_MESSAGES.dailySuccess}`, 'success')
      loadLoyaltyData()
    } else {
      showToast(result.error, 'info')
    }
  }, [showToast, loadLoyaltyData])

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId)
  }, [])

  const groupRewardsByCategory = useCallback(() => {
    if (!userLoyaltyData?.availableRewards) return {}

    return userLoyaltyData.availableRewards.reduce((acc, reward) => {
      if (!acc[reward.category]) acc[reward.category] = []
      acc[reward.category].push(reward)
      return acc
    }, {})
  }, [userLoyaltyData])

  return {
    activeTab,
    userLoyaltyData,
    loading,
    redeemingReward,
    loyaltyService,
    groupedRewards: groupRewardsByCategory(),
    handleRedeemReward,
    handleClaimDailyBonus,
    handleTabChange
  }
}