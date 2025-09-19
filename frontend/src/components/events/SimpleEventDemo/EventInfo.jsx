import { DEMO_STYLES } from '../../../constants/simpleEventDemoConstants'

const EventInfo = ({ event }) => {
  return (
    <div className={DEMO_STYLES.eventInfo}>
      <h3 className={DEMO_STYLES.eventTitle}>{event.title}</h3>
      <p className={DEMO_STYLES.eventDescription}>{event.description}</p>
    </div>
  )
}

export default EventInfo