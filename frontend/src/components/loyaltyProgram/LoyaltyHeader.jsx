import { LOYALTY_STYLES, LOYALTY_MESSAGES } from '../../constants/loyaltyProgramConstants.jsx'

const LoyaltyHeader = ({ userLoyaltyData, onClaimDailyBonus }) => {
  return (
    <div className={LOYALTY_STYLES.header.container}>
      <div className={LOYALTY_STYLES.header.grid}>
        {/* Points Information */}
        <div>
          <h1 className={LOYALTY_STYLES.header.title}>
            {LOYALTY_MESSAGES.header.title}
          </h1>
          <p className={LOYALTY_STYLES.header.subtitle}>
            {LOYALTY_MESSAGES.header.subtitle}
          </p>

          <div className={LOYALTY_STYLES.header.pointsSection}>
            <div className={LOYALTY_STYLES.header.pointsRow}>
              <span className={LOYALTY_STYLES.header.pointsLabel}>
                {LOYALTY_MESSAGES.points.available}
              </span>
              <span className={LOYALTY_STYLES.header.pointsAvailable}>
                {userLoyaltyData.availablePoints.toLocaleString()}
              </span>
            </div>

            <div className={LOYALTY_STYLES.header.pointsRow}>
              <span className={LOYALTY_STYLES.header.pointsLabel}>
                {LOYALTY_MESSAGES.points.total}
              </span>
              <span className={LOYALTY_STYLES.header.pointsTotal}>
                {userLoyaltyData.lifetimePoints.toLocaleString()}
              </span>
            </div>

            <button
              onClick={onClaimDailyBonus}
              className={LOYALTY_STYLES.header.dailyButton}
            >
              {LOYALTY_MESSAGES.points.dailyBonus}
            </button>
          </div>
        </div>

        {/* Level Information */}
        <div className={LOYALTY_STYLES.levelCard.container}>
          <div className={LOYALTY_STYLES.levelCard.header}>
            <div className={LOYALTY_STYLES.levelCard.levelInfo}>
              <h3 className={LOYALTY_STYLES.levelCard.levelTitle}>
                {LOYALTY_MESSAGES.level.title}
              </h3>
              <div className={LOYALTY_STYLES.levelCard.levelName}>
                <span className={LOYALTY_STYLES.levelCard.levelIcon}>
                  {userLoyaltyData.levelConfig.icon}
                </span>
                <span
                  className={LOYALTY_STYLES.levelCard.levelText}
                  style={{ color: userLoyaltyData.levelConfig.color }}
                >
                  {userLoyaltyData.levelConfig.name}
                </span>
              </div>
            </div>
            <div className={LOYALTY_STYLES.levelCard.discountInfo}>
              <p className={LOYALTY_STYLES.levelCard.discountLabel}>
                {LOYALTY_MESSAGES.level.discount}
              </p>
              <p className={LOYALTY_STYLES.levelCard.discountValue}>
                {userLoyaltyData.levelConfig.discountPercentage}%
              </p>
            </div>
          </div>

          {/* Level Progress */}
          {userLoyaltyData.pointsToNext !== null && (
            <div className={LOYALTY_STYLES.levelCard.progress}>
              <div className={LOYALTY_STYLES.levelCard.progressHeader}>
                <span>{LOYALTY_MESSAGES.level.progress}</span>
                <span>{userLoyaltyData.pointsToNext.toLocaleString()} {LOYALTY_MESSAGES.level.remaining}</span>
              </div>
              <div className={LOYALTY_STYLES.levelCard.progressBar}>
                <div
                  className={LOYALTY_STYLES.levelCard.progressFill}
                  style={{ width: `${userLoyaltyData.levelProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Level Benefits */}
          <div className={LOYALTY_STYLES.levelCard.benefits}>
            <p className={LOYALTY_STYLES.levelCard.benefitsTitle}>
              {LOYALTY_MESSAGES.level.benefits}
            </p>
            <ul className={LOYALTY_STYLES.levelCard.benefitsList}>
              {(userLoyaltyData.levelConfig?.benefits || []).slice(0, 3).map((benefit, index) => (
                <li key={index} className={LOYALTY_STYLES.levelCard.benefitItem}>
                  <span className={LOYALTY_STYLES.levelCard.benefitCheck}>✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
              {(userLoyaltyData.levelConfig?.benefits?.length || 0) > 3 && (
                <li className={LOYALTY_STYLES.levelCard.moreBenefits}>
                  +{userLoyaltyData.levelConfig.benefits.length - 3} {LOYALTY_MESSAGES.level.moreBenefits}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoyaltyHeader