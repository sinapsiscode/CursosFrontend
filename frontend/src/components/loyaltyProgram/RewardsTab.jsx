import { CATEGORY_ICONS, LOYALTY_STYLES, LOYALTY_MESSAGES } from '../../constants/loyaltyProgramConstants.jsx'
import RewardCard from './RewardCard'

const RewardsTab = ({ groupedRewards, userLoyaltyData, redeemingReward, onRedeemReward }) => {
  return (
    <div>
      <h2 className={LOYALTY_STYLES.rewards.title}>
        {LOYALTY_MESSAGES.rewards.store}
      </h2>

      {/* Reward Categories */}
      {Object.entries(groupedRewards).map(([category, rewards]) => (
        <div key={category} className={LOYALTY_STYLES.rewards.categorySection}>
          <h3 className={LOYALTY_STYLES.rewards.categoryTitle}>
            <span className={LOYALTY_STYLES.rewards.categoryIcon}>
              {CATEGORY_ICONS[category]}
            </span>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h3>

          <div className={LOYALTY_STYLES.rewards.rewardsGrid}>
            {rewards.map(reward => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userPoints={userLoyaltyData.availablePoints}
                isRedeeming={redeemingReward === reward.id}
                onRedeem={onRedeemReward}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RewardsTab