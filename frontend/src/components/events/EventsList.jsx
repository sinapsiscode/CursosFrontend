import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'
import EventCard from './EventCard'

const EventsList = ({
  events,
  hasEvents,
  isAuthenticated,
  filter,
  onEventDetail,
  onNavigateToCourses,
  onNavigateToBundle,
  onNavigateToLogin,
  getDaysUntilEvent,
  getTimeIndicatorClass
}) => {
  if (!hasEvents) {
    return (
      <div className={EVENTS_STYLES.emptyState.container}>
        <p className={EVENTS_STYLES.emptyState.text}>
          No hay eventos disponibles con los filtros seleccionados
        </p>
      </div>
    )
  }

  return (
    <div className={EVENTS_STYLES.eventsList.grid}>
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          isAuthenticated={isAuthenticated}
          filter={filter}
          onEventDetail={onEventDetail}
          onNavigateToCourses={onNavigateToCourses}
          onNavigateToBundle={onNavigateToBundle}
          onNavigateToLogin={onNavigateToLogin}
          getDaysUntilEvent={getDaysUntilEvent}
          getTimeIndicatorClass={getTimeIndicatorClass}
        />
      ))}
    </div>
  )
}

export default EventsList