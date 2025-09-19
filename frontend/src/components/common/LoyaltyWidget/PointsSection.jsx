import { LOYALTY_WIDGET_STYLES, LOYALTY_TEXTS, LOYALTY_ICONS } from '../../../constants/loyaltyConstants'

const PointsSection = () => {
  return (
    <div className={LOYALTY_WIDGET_STYLES.pointsSection}>
      <p className="text-xs text-gray-400 mb-2">{LOYALTY_TEXTS.earnPointsWith}</p>
      <div className={LOYALTY_WIDGET_STYLES.pointsGrid}>
        {LOYALTY_TEXTS.pointsActions.map((action, index) => (
          <div key={index} className={LOYALTY_WIDGET_STYLES.pointsItem}>
            <span className="text-green-400">{LOYALTY_ICONS.bullet}</span>
            <span className="text-gray-300">{action}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PointsSection