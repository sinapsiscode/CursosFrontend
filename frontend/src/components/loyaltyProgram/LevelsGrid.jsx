import { LOYALTY_STYLES, LOYALTY_MESSAGES } from '../../constants/loyaltyProgramConstants.jsx'

const LevelsGrid = ({ levels, currentLevel }) => {
  return (
    <div>
      <h2 className={LOYALTY_STYLES.overview.title}>
        {LOYALTY_MESSAGES.overview.allLevels}
      </h2>
      <div className={LOYALTY_STYLES.overview.levelsGrid}>
        {Object.entries(levels).map(([key, level]) => (
          <div
            key={key}
            className={`${LOYALTY_STYLES.overview.levelCard} ${
              key === currentLevel
                ? LOYALTY_STYLES.overview.levelCardActive
                : LOYALTY_STYLES.overview.levelCardInactive
            }`}
          >
            <div className={LOYALTY_STYLES.overview.levelCardContent}>
              <div className={LOYALTY_STYLES.overview.levelCardIcon}>
                {level.icon}
              </div>
              <h3 className={LOYALTY_STYLES.overview.levelCardName} style={{ color: level.color }}>
                {level.name}
              </h3>
              <p className={LOYALTY_STYLES.overview.levelCardPoints}>
                {level.minPoints.toLocaleString()}+ {LOYALTY_MESSAGES.overview.minPoints}
              </p>
            </div>

            <div className={LOYALTY_STYLES.overview.levelCardDetails}>
              <div className={LOYALTY_STYLES.overview.levelCardDiscount}>
                <p className={LOYALTY_STYLES.overview.levelCardDiscountValue}>
                  {level.discountPercentage}%
                </p>
                <p className={LOYALTY_STYLES.overview.levelCardDiscountLabel}>
                  {LOYALTY_MESSAGES.overview.discount}
                </p>
              </div>

              <ul className="space-y-1 text-xs text-gray-300">
                {level.benefits.slice(0, 2).map((benefit, idx) => (
                  <li key={idx} className="truncate">• {benefit}</li>
                ))}
                {level.benefits.length > 2 && (
                  <li className="text-accent">+{level.benefits.length - 2} {LOYALTY_MESSAGES.overview.more}</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LevelsGrid