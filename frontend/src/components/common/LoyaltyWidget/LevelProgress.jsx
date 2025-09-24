import { LOYALTY_WIDGET_STYLES, LOYALTY_TEXTS } from '../../../constants/loyaltyConstants.jsx'

const LevelProgress = ({ levelProgress }) => {
  return (
    <div className={LOYALTY_WIDGET_STYLES.progressContainer}>
      <div className={LOYALTY_WIDGET_STYLES.progressLabels}>
        <span>{LOYALTY_TEXTS.progress}</span>
        <span>{levelProgress}%</span>
      </div>
      <div className={LOYALTY_WIDGET_STYLES.progressBar}>
        <div
          className={LOYALTY_WIDGET_STYLES.progressFill}
          style={{ width: `${levelProgress}%` }}
        />
      </div>
    </div>
  )
}

export default LevelProgress