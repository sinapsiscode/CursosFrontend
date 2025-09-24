import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'

const EmptyEventsState = () => {
  return (
    <div className={EVENTS_STYLES.emptyState.container}>
      <p className={EVENTS_STYLES.emptyState.text}>
        {EVENTS_MESSAGES.emptyState}
      </p>
    </div>
  )
}

export default EmptyEventsState