import { LOYALTY_WIDGET_STYLES, LOYALTY_TEXTS, LOYALTY_ICONS } from '../../../constants/loyaltyConstants.jsx'
import MinimizeButton from './MinimizeButton'

const CompactWidget = ({ loyaltyData, isExpanded, onToggleExpanded, onMinimize }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggleExpanded}
        className={LOYALTY_WIDGET_STYLES.compactButton}
      >
        <span className="text-2xl">{loyaltyData.levelConfig.icon}</span>
        <div className="text-left">
          <p className="text-xs font-medium">{LOYALTY_TEXTS.myPoints}</p>
          <p className="text-lg font-bold">{loyaltyData.points.toLocaleString()}</p>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {LOYALTY_ICONS.chevronUp}
        </svg>
      </button>

      <MinimizeButton onMinimize={onMinimize} />
    </div>
  )
}

export default CompactWidget