import { EVENT_STYLES } from '../../../constants/eventDetailConstants'

const EventDetailItem = ({ icon, label, value }) => {
  return (
    <div className={EVENT_STYLES.detailItem}>
      <svg className={EVENT_STYLES.detailIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span><strong>{label}</strong> {value}</span>
    </div>
  )
}

export default EventDetailItem