import { LOYALTY_STYLES, LOYALTY_MESSAGES } from '../../constants/loyaltyProgramConstants.jsx'

const RewardCard = ({ reward, userPoints, isRedeeming, onRedeem }) => {
  const canRedeem = reward.canRedeem

  return (
    <div
      className={`${LOYALTY_STYLES.rewards.rewardCard} ${
        canRedeem
          ? LOYALTY_STYLES.rewards.rewardCardActive
          : LOYALTY_STYLES.rewards.rewardCardInactive
      }`}
    >
      <div className={LOYALTY_STYLES.rewards.rewardHeader}>
        <div className={LOYALTY_STYLES.rewards.rewardIcon}>
          {reward.icon}
        </div>
        <div className={LOYALTY_STYLES.rewards.rewardPoints}>
          <p className={LOYALTY_STYLES.rewards.rewardPointsValue}>
            {reward.points.toLocaleString()}
          </p>
          <p className={LOYALTY_STYLES.rewards.rewardPointsLabel}>
            {LOYALTY_MESSAGES.rewards.points}
          </p>
        </div>
      </div>

      <h4 className={LOYALTY_STYLES.rewards.rewardName}>
        {reward.name}
      </h4>
      <p className={LOYALTY_STYLES.rewards.rewardDescription}>
        {reward.description}
      </p>

      <button
        onClick={() => onRedeem(reward.id)}
        disabled={!canRedeem || isRedeeming}
        className={`${LOYALTY_STYLES.rewards.rewardButton} ${
          canRedeem
            ? LOYALTY_STYLES.rewards.rewardButtonActive
            : LOYALTY_STYLES.rewards.rewardButtonInactive
        }`}
      >
        {isRedeeming ? (
          <span className={LOYALTY_STYLES.rewards.rewardButtonSpinner}>
            <svg className={LOYALTY_STYLES.rewards.spinner} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {LOYALTY_MESSAGES.rewards.redeeming}
          </span>
        ) : canRedeem ? (
          LOYALTY_MESSAGES.rewards.redeem
        ) : (
          `${LOYALTY_MESSAGES.rewards.needMore} ${(reward.points - userPoints).toLocaleString()} ${LOYALTY_MESSAGES.rewards.morePoints}`
        )}
      </button>
    </div>
  )
}

export default RewardCard