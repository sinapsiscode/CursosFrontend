import { LOYALTY_WIDGET_STYLES, LOYALTY_TEXTS, LOYALTY_ICONS } from '../../../constants/loyaltyConstants.jsx'

const MinimizeButton = ({ onMinimize }) => {
  return (
    <button
      onClick={onMinimize}
      className={LOYALTY_WIDGET_STYLES.minimizeButton}
      title={LOYALTY_TEXTS.minimize}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {LOYALTY_ICONS.minimize}
      </svg>
    </button>
  )
}

export default MinimizeButton