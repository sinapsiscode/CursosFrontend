import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fidelizacionService as loyaltyService } from '../services/fidelizacionService'
import { useUIStore, useAuthStore } from '../store'
import { LOYALTY_MESSAGES } from '../constants/loyaltyProgramConstants.jsx'

export const useLoyaltyProgram = () => {
  const navigate = useNavigate()
  const { showToast } = useUIStore()
  const { isAuthenticated, user } = useAuthStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [userLoyaltyData, setUserLoyaltyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [redeemingReward, setRedeemingReward] = useState(null)

  const loadLoyaltyData = useCallback(async () => {
    if (!user?.id) {
      console.warn('⚠️ No hay usuario autenticado')
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Cargar datos de puntos del usuario
      const data = await loyaltyService.getUserPoints(user.id)

      // Cargar información de nivel
      const currentLevel = await loyaltyService.getCurrentLevel(data)
      const levelProgress = await loyaltyService.getLevelProgress(data)
      const pointsToNext = await loyaltyService.getPointsToNextLevel(data)

      // Cargar configuración
      await loyaltyService.loadConfig()
      const config = loyaltyService.config

      setUserLoyaltyData({
        ...data,
        currentLevel,
        levelProgress,
        pointsToNext,
        levelConfig: config?.levels?.[data.currentLevel] || config?.levels?.bronce,
        availableRewards: [], // TODO: Implementar getAvailableRewards
        redeemedRewards: data.redeemedRewards || [],
        transactions: data.transactions?.slice(0, 20) || []
      })
    } catch (error) {
      console.error('Error cargando datos de fidelización:', error)
      showToast('Error al cargar datos de fidelización', 'error')
    } finally {
      setLoading(false)
    }
  }, [user, showToast])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    loadLoyaltyData()
  }, [isAuthenticated, navigate, loadLoyaltyData])

  const handleRedeemReward = useCallback(async (reward) => {
    if (!user?.id) return

    setRedeemingReward(reward.id)

    try {
      const result = await loyaltyService.redeemReward(
        user.id,
        reward.id,
        reward.points,
        reward.name
      )

      if (result.success) {
        showToast(LOYALTY_MESSAGES.success, 'success')
        loadLoyaltyData()
      } else {
        showToast(result.error || LOYALTY_MESSAGES.error, 'error')
      }
    } catch (error) {
      console.error('Error canjeando recompensa:', error)
      showToast(LOYALTY_MESSAGES.error, 'error')
    } finally {
      setRedeemingReward(null)
    }
  }, [user, showToast, loadLoyaltyData])

  const handleClaimDailyBonus = useCallback(async () => {
    if (!user?.id) return

    // TODO: Implementar addDailyLoginPoints en fidelizacionService
    showToast('Funcionalidad en desarrollo', 'info')

    // const result = await loyaltyService.addDailyLoginPoints(user.id)
    // if (result.success) {
    //   showToast(`¡+${result.transaction.amount} ${LOYALTY_MESSAGES.dailySuccess}`, 'success')
    //   loadLoyaltyData()
    // } else {
    //   showToast(result.error, 'info')
    // }
  }, [user, showToast])

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