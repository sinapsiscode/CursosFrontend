import { EVENT_STYLES } from '../../../constants/eventDetailConstants'

const EventTitleSection = ({ event }) => {
  return (
    <div className={EVENT_STYLES.titleSection}>
      <div className={EVENT_STYLES.badgeContainer}>
        <span className={EVENT_STYLES.typeBadge}>
          {event.type}
        </span>
        <span className={EVENT_STYLES.areaBadge}>
          {event.area}
        </span>
      </div>

      <h2 className={EVENT_STYLES.title}>{event.title}</h2>
      <p className={EVENT_STYLES.description}>{event.description}</p>
    </div>
  )
}

export default EventTitleSection