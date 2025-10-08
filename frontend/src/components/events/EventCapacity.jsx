import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'

const EventCapacity = ({ registered, capacity }) => {
  return (
    <div className="text-sm">
      <p className={EVENTS_STYLES.eventCard.capacity.text}>
        {registered}/{capacity} registrados
      </p>
      <div className={EVENTS_STYLES.eventCard.capacity.bar}>
        <div
          className={EVENTS_STYLES.eventCard.capacity.progress}
          style={{ width: `${(registered / capacity) * 100}%` }}
        />
      </div>
    </div>
  )
}

export default EventCapacity