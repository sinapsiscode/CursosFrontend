import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'

const EventBenefits = ({ benefits, maxToShow }) => {
  return (
    <div className={EVENTS_STYLES.benefits.container}>
      <p className={EVENTS_STYLES.benefits.title}>
        {EVENTS_MESSAGES.eventDetails.includes}
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