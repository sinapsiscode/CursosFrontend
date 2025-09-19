import {
  SIMULATOR_STYLES,
  EVENT_INFO_LABELS
} from '../../../constants/eventSimulatorConstants'
import { formatEventDate } from '../../../utils/eventSimulatorUtils'

const EventInfoPanel = ({ event, participants, isLive }) => {
  return (
    <div className={SIMULATOR_STYLES.eventInfo}>
      <h3 className={SIMULATOR_STYLES.eventTitle}>{event.title}</h3>
      <div className={SIMULATOR_STYLES.eventGrid}>
        <div>
          <span className={SIMULATOR_STYLES.eventFieldLabel}>{EVENT_INFO_LABELS.date}</span>
          <p className={SIMULATOR_STYLES.eventFieldValue}>{formatEventDate(event.date)}</p>
        </div>
        <div>
          <span className={SIMULATOR_STYLES.eventFieldLabel}>{EVENT_INFO_LABELS.time}</span>
          <p className={SIMULATOR_STYLES.eventFieldValue}>{event.time}</p>
        </div>
        <div>
          <span className={SIMULATOR_STYLES.eventFieldLabel}>{EVENT_INFO_LABELS.registered}</span>
          <p className={SIMULATOR_STYLES.eventFieldValue}>{participants}</p>
        </div>
        <div>
          <span className={SIMULATOR_STYLES.eventFieldLabel}>{EVENT_INFO_LABELS.status}</span>
          <p className={isLive ? SIMULATOR_STYLES.statusLive : SIMULATOR_STYLES.statusScheduled}>
            {isLive ? EVENT_INFO_LABELS.live : EVENT_INFO_LABELS.scheduled}
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventInfoPanel