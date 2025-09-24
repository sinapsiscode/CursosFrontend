import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'

const EventBundle = ({ event }) => {
  return (
    <div className={EVENTS_STYLES.bundle.container}>
      <div className={EVENTS_STYLES.bundle.details}>
        <p className={EVENTS_STYLES.bundle.title}>
          {EVENTS_MESSAGES.eventDetails.packIncludes}
        </p>
        <ul className={EVENTS_STYLES.bundle.list}>
          {event.courses.map((course, idx) => (
            <li key={idx} className={EVENTS_STYLES.bundle.item}>
              • {course.title}
            </li>
          ))}
        </ul>
      </div>
      <div className={EVENTS_STYLES.bundle.pricing}>
        <div>
          <span className={EVENTS_STYLES.bundle.price}>
            {EVENTS_MESSAGES.eventDetails.free}
          </span>
        </div>
        <span className={EVENTS_STYLES.bundle.badge}>
          {EVENTS_MESSAGES.eventDetails.freeEvent}
        </span>
      </div>
    </div>
  )
}

export default EventBundle