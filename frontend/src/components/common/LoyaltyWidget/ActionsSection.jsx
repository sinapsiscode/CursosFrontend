import { LOYALTY_WIDGET_STYLES, LOYALTY_TEXTS } from '../../../constants/loyaltyConstants.jsx'

const ActionsSection = ({ onNavigateToLoyalty }) => {
  return (
    <div className={LOYALTY_WIDGET_STYLES.actionsContainer}>
      <button
        onClick={onNavigateToLoyalty}
        className={LOYALTY_WIDGET_STYLES.primaryButton}
      >
        {LOYALTY_TEXTS.viewFullProgram}
      </button>
      <button
        onClick={onNavigateToLoyalty}
        className={LOYALTY_WIDGET_STYLES.secondaryButton}
      >
        {LOYALTY_TEXTS.redeemPoints}
      </button>
    </div>
  )
}

export default ActionsSection