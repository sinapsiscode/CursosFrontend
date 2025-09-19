import { EVENT_STYLES, EVENT_LABELS, ICON_PATHS } from '../../../constants/eventDetailConstants'

const EventHeader = ({ event, onClose }) => {
  return (
    <div className={EVENT_STYLES.header}>
      <img
        src={event.imageUrl}
        alt={event.title}
        className={EVENT_STYLES.image}
      />
      <div className={EVENT_STYLES.closeButton}>
        <button
          onClick={onClose}
          className={EVENT_STYLES.closeButtonStyle}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.close} />
          </svg>
        </button>
      </div>

      <div className={EVENT_STYLES.priceBadge}>
        <span className={EVENT_STYLES.freeBadgeStyle}>
          {EVENT_LABELS.freeLabel}
        </span>
      </div>
    </div>
  )
}

export default EventHeader