import { EVENT_STYLES, ICON_PATHS, FIELD_LABELS } from '../../../constants/eventDetailConstants'
import { formatDate } from '../../../utils/eventDetailUtils'
import EventDetailItem from './EventDetailItem'

const EventDetails = ({ event }) => {
  return (
    <div className={EVENT_STYLES.detailsLeft}>
      <EventDetailItem
        icon={ICON_PATHS.calendar}
        label={FIELD_LABELS.date}
        value={formatDate(event.date)}
      />

      <EventDetailItem
        icon={ICON_PATHS.clock}
        label={FIELD_LABELS.time}
        value={event.time}
      />

      <EventDetailItem
        icon={ICON_PATHS.duration}
        label={FIELD_LABELS.duration}
        value={event.duration}
      />

      <EventDetailItem
        icon={ICON_PATHS.instructor}
        label={FIELD_LABELS.instructor}
        value={event.instructor}
      />

      {event.capacity && (
        <EventDetailItem
          icon={ICON_PATHS.capacity}
          label={FIELD_LABELS.capacity}
          value={`${event.registered || 0}/${event.capacity}`}
        />
      )}
    </div>
  )
}

export default EventDetails