import { LOYALTY_STYLES, LOYALTY_MESSAGES } from '../../constants/loyaltyProgramConstants.jsx'
import LevelsGrid from './LevelsGrid'
import PointsRulesGrid from './PointsRulesGrid'
import RedeemedRewards from './RedeemedRewards'

const OverviewTab = ({ userLoyaltyData, loyaltyService }) => {
  if (!loyaltyService?.config) {
    return <div className="text-white">Cargando configuración...</div>
  }

  return (
    <div className={LOYALTY_STYLES.overview.section}>
      {/* All Levels */}
      {loyaltyService.config.levels && (
        <LevelsGrid
          levels={loyaltyService.config.levels}
          currentLevel={userLoyaltyData.currentLevel}
        />
      )}

      {/* How to Earn Points */}
      {loyaltyService.config.pointsRules && (
        <PointsRulesGrid pointsRules={loyaltyService.config.pointsRules} />
      )}

      {/* Redeemed Rewards */}
      {userLoyaltyData.redeemedRewards?.length > 0 && (
        <RedeemedRewards rewards={userLoyaltyData.redeemedRewards} />
      )}
    </div>
  )
}

export default OverviewTab