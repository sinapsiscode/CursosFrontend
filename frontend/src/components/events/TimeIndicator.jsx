import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'

const TimeIndicator = ({ date, getDaysUntilEvent, getTimeIndicatorClass }) => {
  return (
    <div className={EVENTS_STYLES.eventCard.timeIndicator}>
      <span className={`text-xs px-2 py-1 rounded-full ${getTimeIndicatorClass(date)}`}>
        {getDaysUntilEvent(date)}
      </span>
    </div>
  )
}

export default TimeIndicator