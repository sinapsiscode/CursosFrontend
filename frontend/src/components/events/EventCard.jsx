import {
  EVENTS_STYLES,
  EVENTS_MESSAGES,
  EVENT_TYPE_CONFIG,
  AREA_COLORS,
  EVENTS_CONFIG,
  EVENTS_ICONS,
  FILTER_TYPES
} from '../../constants/eventsConstants.jsx'
import EventCardImage from './EventCardImage'
import EventDetails from './EventDetails'
import EventPromotion from './EventPromotion'
import EventBundle from './EventBundle'
import EventBenefits from './EventBenefits'
import EventCapacity from './EventCapacity'
import EventActions from './EventActions'
import TimeIndicator from './TimeIndicator'
import RelevanceScore from './RelevanceScore'

const EventCard = ({
  event,
  demoMode,
  isAuthenticated,
  filter,
  onEventDetail,
  onSimulatorOpen,
  onNavigateToCourses,
  onNavigateToBundle,
  onNavigateToLogin,
  getDaysUntilEvent,
  getTimeIndicatorClass
}) => {
  const eventConfig = EVENT_TYPE_CONFIG[event.type]
  const areaGradient = AREA_COLORS[event.area]

  return (
    <div className={EVENTS_STYLES.eventCard.container}>
      {/* Event Image */}
      {event.imageUrl && (
        <EventCardImage
          imageUrl={event.imageUrl}
          title={event.title}
          eventType={event.type}
          eventConfig={eventConfig}
          area={event.area}
          areaGradient={areaGradient}
        />
      )}

      <div className={EVENTS_STYLES.eventCard.content}>
        {/* Title and Description */}
        <h3 className={EVENTS_STYLES.eventCard.title}>
          {event.title}
        </h3>
        <p className={EVENTS_STYLES.eventCard.description}>
          {event.description}
        </p>

        {/* Event Details */}
        {(event.type === 'webinar' || event.type === 'masterclass') && (
          <EventDetails
            event={event}
            formatEventDate={(dateString) => {
              const date = new Date(dateString)
              return date.toLocaleDateString(EVENTS_CONFIG.dateLocale, EVENTS_CONFIG.dateOptions)
            }}
          />
        )}

        {/* Promotion Details */}
        {event.type === 'promotion' && (
          <EventPromotion event={event} />
        )}

        {/* Bundle Details */}
        {event.type === 'bundle' && (
          <EventBundle event={event} />
        )}

        {/* Benefits */}
        {event.benefits && (
          <EventBenefits
            benefits={event.benefits}
            maxToShow={EVENTS_CONFIG.maxBenefitsToShow}
          />
        )}

        {/* Footer with capacity and actions */}
        <div className={EVENTS_STYLES.eventCard.footer}>
          {/* Capacity */}
          {event.capacity && (
            <EventCapacity
              registered={event.registered}
              capacity={event.capacity}
            />
          )}

          {/* Actions */}
          <EventActions
            event={event}
            eventConfig={eventConfig}
            demoMode={demoMode}
            isAuthenticated={isAuthenticated}
            hasCapacity={!!event.capacity}
            onEventDetail={onEventDetail}
            onSimulatorOpen={onSimulatorOpen}
            onNavigateToCourses={onNavigateToCourses}
            onNavigateToBundle={onNavigateToBundle}
            onNavigateToLogin={onNavigateToLogin}
          />
        </div>

        {/* Time Indicator */}
        {event.date && (
          <TimeIndicator
            date={event.date}
            getDaysUntilEvent={getDaysUntilEvent}
            getTimeIndicatorClass={getTimeIndicatorClass}
          />
        )}

        {/* Relevance Score */}
        {filter === FILTER_TYPES.relevant && event.relevanceScore && (
          <RelevanceScore score={event.relevanceScore} />
        )}
      </div>
    </div>
  )
}

export default EventCard