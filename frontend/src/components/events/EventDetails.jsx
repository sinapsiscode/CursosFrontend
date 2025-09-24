import { EVENTS_STYLES, EVENTS_ICONS } from '../../constants/eventsConstants.jsx'

const EventDetails = ({ event, formatEventDate }) => {
  return (
    <div className={EVENTS_STYLES.eventCard.details}>
      <div className={EVENTS_STYLES.eventCard.detailItem}>
        {EVENTS_ICONS.calendar}
        {formatEventDate(event.date)}
      </div>
      <div className={EVENTS_STYLES.eventCard.detailItem}>
        {EVENTS_ICONS.clock}
        {event.time} ({event.duration})
      </div>
      {event.instructor && (
        <div className={EVENTS_STYLES.eventCard.detailItem}>
          {EVENTS_ICONS.user}
          {event.instructor}
        </div>
      )}
    </div>
  )
}

export default EventDetails