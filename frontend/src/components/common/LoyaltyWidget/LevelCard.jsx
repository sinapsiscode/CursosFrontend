import { LOYALTY_WIDGET_STYLES, LOYALTY_TEXTS } from '../../../constants/loyaltyConstants.jsx'
import LevelProgress from './LevelProgress'

const LevelCard = ({ loyaltyData }) => {
  return (
    <div className={LOYALTY_WIDGET_STYLES.levelCard}>
      <div className={LOYALTY_WIDGET_STYLES.levelHeader}>
        <div className={LOYALTY_WIDGET_STYLES.levelInfo}>
          <span className="text-2xl">{loyaltyData.levelConfig.icon}</span>
          <div>
            <p className="text-sm text-gray-400">{LOYALTY_TEXTS.currentLevel}</p>
            <p className="font-bold" style={{ color: loyaltyData.levelConfig.color }}>
              {loyaltyData.levelConfig.name}
            </p>
          </div>
        </div>
        <div className={LOYALTY_WIDGET_STYLES.pointsDisplay}>
          <p className="text-2xl font-bold text-white">{loyaltyData.points.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{LOYALTY_TEXTS.points}</p>
        </div>
      </div>

      <LevelProgress levelProgress={loyaltyData.levelProgress} />
    </div>
  )
}

export default LevelCard