import { LOYALTY_STYLES, LOYALTY_MESSAGES } from '../../constants/loyaltyProgramConstants.jsx'

const PointsRulesGrid = ({ pointsRules }) => {
  return (
    <div>
      <h2 className={LOYALTY_STYLES.overview.title}>
        {LOYALTY_MESSAGES.overview.howToEarn}
      </h2>
      <div className={LOYALTY_STYLES.overview.pointsRulesGrid}>
        {Object.entries(pointsRules).map(([key, rule]) => (
          <div key={key} className={LOYALTY_STYLES.overview.ruleCard}>
            <div className={LOYALTY_STYLES.overview.ruleHeader}>
              <h3 className={LOYALTY_STYLES.overview.ruleTitle}>
                {rule.description}
              </h3>
            </div>
            <p className={LOYALTY_STYLES.overview.rulePoints}>
              {key === 'coursePurchase'
                ? `${rule.rate} pts/$1`
                : `+${rule.points} pts`
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PointsRulesGrid