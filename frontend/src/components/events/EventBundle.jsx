import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'

const EventBundle = ({ event }) => {
  return (
    <div className={EVENTS_STYLES.bundle.container}>
      <div className={EVENTS_STYLES.bundle.details}>
        <p className={EVENTS_STYLES.bundle.title}>
          Este pack incluye:
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
            GRATIS
          </span>
        </div>
        <span className={EVENTS_STYLES.bundle.badge}>
          Evento gratuito
        </span>
      </div>
    </div>
  )
}

export default EventBundle