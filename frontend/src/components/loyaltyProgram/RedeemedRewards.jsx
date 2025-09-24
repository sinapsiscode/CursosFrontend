import { REDEMPTION_STATUS, LOYALTY_STYLES, LOYALTY_MESSAGES } from '../../constants/loyaltyProgramConstants.jsx'

const RedeemedRewards = ({ rewards }) => {
  return (
    <div>
      <h2 className={LOYALTY_STYLES.overview.title}>
        {LOYALTY_MESSAGES.overview.redeemedRewards}
      </h2>
      <div className={LOYALTY_STYLES.overview.redeemedGrid}>
        {rewards.slice(0, 4).map(redemption => (
          <div key={redemption.id} className={LOYALTY_STYLES.redemption.card}>
            <div className={LOYALTY_STYLES.redemption.header}>
              <div>
                <div className={LOYALTY_STYLES.redemption.info}>
                  <span className={LOYALTY_STYLES.redemption.icon}>
                    {redemption.reward.icon}
                  </span>
                  <h3 className={LOYALTY_STYLES.redemption.name}>
                    {redemption.reward.name}
                  </h3>
                </div>
                <p className={LOYALTY_STYLES.redemption.description}>
                  {redemption.reward.description}
                </p>
              </div>
              <span className={`${LOYALTY_STYLES.redemption.status} ${
                REDEMPTION_STATUS[redemption.status]?.color || REDEMPTION_STATUS.default.color
              }`}>
                {REDEMPTION_STATUS[redemption.status]?.label || REDEMPTION_STATUS.default.label}
              </span>
            </div>

            <div className={LOYALTY_STYLES.redemption.codeSection}>
              <p className={LOYALTY_STYLES.redemption.codeLabel}>
                {LOYALTY_MESSAGES.redemption.code}
              </p>
              <p className={LOYALTY_STYLES.redemption.codeValue}>
                {redemption.code}
              </p>
            </div>

            {redemption.status === 'active' && (
              <p className={LOYALTY_STYLES.redemption.expiration}>
                {LOYALTY_MESSAGES.redemption.expires} {redemption.daysUntilExpiration} {LOYALTY_MESSAGES.redemption.days}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RedeemedRewards