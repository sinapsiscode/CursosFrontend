import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'

const RelevantIndicator = () => {
  return (
    <div className={EVENTS_STYLES.filters.relevantIndicator}>
      <p className="text-sm text-purple-300">
        {EVENTS_MESSAGES.filters.relevantMessage}
      </p>
    </div>
  )
}

export default RelevantIndicator