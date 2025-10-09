import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'

const EventCardImage = ({
  imageUrl,
  title,
  eventType,
  eventConfig,
  area,
  areaGradient
}) => {
  return (
    <div className={EVENTS_STYLES.eventCard.image.wrapper}>
      <img
        src={imageUrl}
        alt={title}
        className={EVENTS_STYLES.eventCard.image.image}
      />

      {/* Type Badge */}
      <div className={EVENTS_STYLES.eventCard.image.badge}>
        <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${eventConfig.color}`}>
          {eventConfig.badge}
        </span>
      </div>

      {/* Area Gradient */}
      {area && (
        <div className={`${EVENTS_STYLES.eventCard.image.areaGradient} bg-gradient-to-r ${areaGradient}`} />
      )}
    </div>
  )
}

export default EventCardImage