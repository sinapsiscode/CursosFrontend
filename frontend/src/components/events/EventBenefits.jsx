import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'

const EventBenefits = ({ benefits, maxToShow }) => {
  return (
    <div className={EVENTS_STYLES.benefits.container}>
      <p className={EVENTS_STYLES.benefits.title}>
        Incluye:
      </p>
      <ul className={EVENTS_STYLES.benefits.list}>
        {benefits.slice(0, maxToShow).map((benefit, idx) => (
          <li key={idx} className={EVENTS_STYLES.benefits.item}>
            <span className={EVENTS_STYLES.benefits.checkmark}>✓</span>
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventBenefits