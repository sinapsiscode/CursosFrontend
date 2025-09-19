import { REGISTRATION_STYLES, ICON_PATHS } from '../../../constants/eventRegistrationConstants'
import { formatEventDate } from '../../../utils/eventRegistrationUtils'

const EventInfoDisplay = ({ event }) => {
  return (
    <div className={REGISTRATION_STYLES.eventInfo}>
      <div className={REGISTRATION_STYLES.eventDetail}>
        <svg className={REGISTRATION_STYLES.eventIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.calendar} />
        </svg>
        {formatEventDate(event.date)}
      </div>

      <div className={REGISTRATION_STYLES.eventDetail}>
        <svg className={REGISTRATION_STYLES.eventIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.clock} />
        </svg>
        {event.time} ({event.duration})
      </div>

      {event.instructor && (
        <div className={REGISTRATION_STYLES.eventDetail}>
          <svg className={REGISTRATION_STYLES.eventIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.instructor} />
          </svg>
          {event.instructor}
        </div>
      )}
    </div>
  )
}

export default EventInfoDisplay