import { EVENT_STYLES, EVENT_LABELS, ICON_PATHS } from '../../../constants/eventDetailConstants'

const EventBenefits = ({ benefits }) => {
  if (!benefits || benefits.length === 0) return null

  return (
    <div className={EVENT_STYLES.benefitsSection}>
      <h3 className={EVENT_STYLES.benefitsTitle}>{EVENT_LABELS.benefits}</h3>
      <ul className={EVENT_STYLES.benefitsList}>
        {benefits.map((benefit, index) => (
          <li key={index} className={EVENT_STYLES.benefitItem}>
            <svg className={EVENT_STYLES.benefitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.check} />
            </svg>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventBenefits