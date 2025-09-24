import { LOYALTY_WIDGET_STYLES, LOYALTY_TEXTS } from '../../../constants/loyaltyConstants.jsx'

const MinimizedButton = ({ loyaltyData, onRestore }) => {
  return (
    <button
      onClick={onRestore}
      className={LOYALTY_WIDGET_STYLES.minimizedButton}
      title={LOYALTY_TEXTS.showProgram}
    >
      <span className="text-xl">{loyaltyData.levelConfig.icon}</span>
    </button>
  )
}

export default MinimizedButton